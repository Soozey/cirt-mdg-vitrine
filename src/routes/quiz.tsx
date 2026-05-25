import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Loader2, Send, ShieldAlert, Sparkles } from "lucide-react";

import quizPattern from "@/assets/hero-section.webp";
import { DashboardLayout } from "@/components/quiz/dashboard-layout";
import { ProtectedRoute } from "@/components/quiz/protected-route";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/quiz/auth-context";
import { computeFinalScore, contentScore, detectAI } from "@/lib/quiz/ai-detect";
import { ANSWER_MAX, AUTOSAVE_KEY, DOMAIN_COLORS, LEVEL_COLORS, QUIZ_LENGTH } from "@/lib/quiz/constants";
import { submissionsApi } from "@/lib/quiz/firestore";
import { pickQuestions } from "@/lib/quiz/questions";
import type { Question, Submission } from "@/lib/quiz/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/quiz")({
  head: () => ({
    meta: [
      { title: "Quiz Cybersécurité · Jobdating CIRT" },
      { name: "description", content: "Passez le quiz cybersécurité pour participer au jobdating." },
    ],
  }),
  component: () => (
    <ProtectedRoute roles={["candidate"]} requireProfile>
      <QuizPage />
    </ProtectedRoute>
  ),
});

type Draft = {
  questions: Question[];
  answers: Record<string, string>;
  index: number;
  startedAt: number;
};

function loadDraft(): Draft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTOSAVE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function QuizPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [aiScores, setAiScores] = useState<Record<string, number>>({});
  const [analyzing, setAnalyzing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const debounceRef = useRef<number | null>(null);

  useEffect(() => {
    const existing = loadDraft();
    if (existing) setDraft(existing);
    else {
      const fresh: Draft = {
        questions: pickQuestions(QUIZ_LENGTH),
        answers: {},
        index: 0,
        startedAt: Date.now(),
      };
      setDraft(fresh);
      localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(fresh));
    }
  }, []);

  const current = draft?.questions[draft.index];
  const answer = current ? (draft!.answers[current.id] ?? "") : "";
  const progress = draft ? ((draft.index + 1) / draft.questions.length) * 100 : 0;

  function persist(next: Draft) {
    setDraft(next);
    localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(next));
  }

  function updateAnswer(text: string) {
    if (!draft || !current) return;
    const next: Draft = {
      ...draft,
      answers: { ...draft.answers, [current.id]: text.slice(0, ANSWER_MAX) },
    };
    persist(next);
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    if (text.trim().length < 40) return;
    setAnalyzing(true);
    debounceRef.current = window.setTimeout(async () => {
      const score = await detectAI(current, text);
      setAiScores((s) => ({ ...s, [current.id]: score }));
      setAnalyzing(false);
    }, 700);
  }

  function go(delta: number) {
    if (!draft) return;
    const next = Math.max(0, Math.min(draft.questions.length - 1, draft.index + delta));
    persist({ ...draft, index: next });
  }

  async function submitAll() {
    if (!draft || !user) return;
    const empty = draft.questions.filter((q) => !(draft.answers[q.id] ?? "").trim());
    if (empty.length) {
      toast.error(`Il reste ${empty.length} question(s) sans réponse`);
      return;
    }
    setSubmitting(true);
    const answers = await Promise.all(
      draft.questions.map(async (q) => {
        const text = draft.answers[q.id];
        const ai = aiScores[q.id] ?? (await detectAI(q, text));
        return {
          questionId: q.id,
          text,
          aiScore: ai,
          contentScore: contentScore(q, text),
          durationMs: Math.round((Date.now() - draft.startedAt) / draft.questions.length),
        };
      }),
    );
    const { final, aiAvg } = computeFinalScore(answers);
    const sub: Submission = {
      id: `sub-${Date.now()}`,
      userId: user.id,
      user,
      questions: draft.questions,
      answers,
      finalScore: final,
      aiAverage: aiAvg,
      submittedAt: new Date().toISOString(),
      status: "pending",
    };
    submissionsApi.save(sub);
    localStorage.removeItem(AUTOSAVE_KEY);
    setSubmitting(false);
    navigate({ to: "/done", search: { id: sub.id } });
  }

  const aiBadge = useMemo(() => {
    const s = current ? aiScores[current.id] : undefined;
    if (s === undefined) return null;
    const risk = s > 0.6 ? "high" : s > 0.35 ? "med" : "low";
    return { score: s, risk };
  }, [aiScores, current]);

  if (!draft || !current) return null;

  return (
    <DashboardLayout title="Quiz cybersécurité" subtitle="Répondez en vos propres mots — vos réponses sont analysées en temps réel.">
      <div className="mb-6 rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
        <div className="mb-3 flex items-center justify-between text-sm">
          <span className="font-medium text-foreground">
            Question {draft.index + 1} / {draft.questions.length}
          </span>
          <span className="text-muted-foreground">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} />
      </div>

      <motion.div
        key={current.id}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] md:p-8"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-12 -top-12 hidden h-48 w-48 rotate-12 opacity-[0.06] md:block"
          style={{ backgroundImage: `url(${quizPattern})`, backgroundSize: "contain", backgroundRepeat: "no-repeat" }}
        />
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Badge variant="outline" className={cn("border", DOMAIN_COLORS[current.domain])}>
            {current.domain}
          </Badge>
          <Badge variant="outline" className={cn("border", LEVEL_COLORS[current.level])}>
            {current.level}
          </Badge>
          <span className="ml-auto text-[11px] font-mono text-muted-foreground">{current.id}</span>
        </div>

        <h2 className="font-display text-xl font-semibold leading-snug text-foreground md:text-2xl">
          {current.text}
        </h2>

        <div className="mt-6">
          <Textarea
            autoFocus
            value={answer}
            onChange={(e) => updateAnswer(e.target.value)}
            placeholder="Répondez en quelques phrases techniques et précises…"
            className="min-h-[180px] resize-y bg-background"
          />
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              {analyzing ? (
                <span className="inline-flex items-center gap-1.5 text-primary">
                  <Loader2 className="size-3.5 animate-spin" /> Analyse IA en cours…
                </span>
              ) : aiBadge ? (
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
                    aiBadge.risk === "high"
                      ? "border-destructive/40 bg-destructive/10 text-destructive"
                      : aiBadge.risk === "med"
                        ? "border-chart-4/40 bg-chart-4/10 text-chart-4"
                        : "border-accent/40 bg-accent-soft/60 text-primary-deep",
                  )}
                >
                  {aiBadge.risk === "high" ? <ShieldAlert className="size-3" /> : <Sparkles className="size-3" />}
                  Probabilité IA : {(aiBadge.score * 100).toFixed(0)}%
                </span>
              ) : (
                <span>Tapez au moins 40 caractères pour l'analyse IA.</span>
              )}
            </div>
            <span className={cn(answer.length > ANSWER_MAX * 0.9 ? "text-chart-4" : "")}>
              {answer.length} / {ANSWER_MAX}
            </span>
          </div>
        </div>
      </motion.div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <Button variant="outline" onClick={() => go(-1)} disabled={draft.index === 0}>
          <ArrowLeft className="size-4" /> Précédent
        </Button>
        <div className="flex items-center gap-2">
          {draft.index < draft.questions.length - 1 ? (
            <Button onClick={() => go(1)}>
              Suivant <ArrowRight className="size-4" />
            </Button>
          ) : (
            <Button onClick={submitAll} disabled={submitting}>
              {submitting ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
              Soumettre le quiz
            </Button>
          )}
        </div>
      </div>

      <p className="mt-5 text-center text-xs text-muted-foreground">
        Vos réponses sont sauvegardées automatiquement dans ce navigateur.
      </p>
    </DashboardLayout>
  );
}