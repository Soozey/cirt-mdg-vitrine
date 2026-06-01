import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  Circle,
  Dot,
  Loader2,
  Send,
} from "lucide-react";

import quizPattern from "@/assets/hero-section.webp";
import { DashboardLayout } from "@/components/quiz/dashboard-layout";
import { ProtectedRoute } from "@/components/quiz/protected-route";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { submitQuizSubmission } from "@/lib/firebase/server-api";
import { useAuth } from "@/lib/quiz/auth-context";
import { AUTOSAVE_KEY, DOMAIN_COLORS, LEVEL_COLORS, QUIZ_LENGTH } from "@/lib/quiz/constants";
import { gradeAnswers, pickQuestions } from "@/lib/quiz/questions";
import type { Question, Submission } from "@/lib/quiz/types";
import { cn, getErrorMessage } from "@/lib/utils";

export const Route = createFileRoute("/quiz")({
  head: () => ({
    meta: [
      { title: "Quizz Cybersécurité · Jobdating CIRT" },
      {
        name: "description",
        content: "Passez le quiz cybersécurité pour participer au jobdating.",
      },
    ],
  }),
  component: () => (
    <ProtectedRoute roles={["candidate"]} requireProfile>
      <QuizPage />
    </ProtectedRoute>
  ),
});

type Draft = {
  schemaVersion: 2;
  quizMode: "qcm";
  questions: Question[];
  answers: Record<string, string>;
  index: number;
  startedAt: number;
};

function loadDraft(): Draft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTOSAVE_KEY);
    const parsed = raw ? (JSON.parse(raw) as Draft) : null;
    return parsed?.schemaVersion === 2 && parsed.quizMode === "qcm" ? parsed : null;
  } catch {
    return null;
  }
}

function createDraft(): Draft {
  return {
    schemaVersion: 2,
    quizMode: "qcm",
    questions: pickQuestions(QUIZ_LENGTH),
    answers: {},
    index: 0,
    startedAt: Date.now(),
  };
}

function QuizPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const existing = loadDraft();
    const next = existing ?? createDraft();
    setDraft(next);
    localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(next));
  }, []);

  const current = draft?.questions[draft.index];
  const selected = current ? (draft!.answers[current.id] ?? "") : "";
  const progress = draft ? ((draft.index + 1) / draft.questions.length) * 100 : 0;
  const answeredCount = draft
    ? draft.questions.filter((question) => draft.answers[question.id]).length
    : 0;

  function persist(next: Draft) {
    setDraft(next);
    localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(next));
  }

  function choose(optionId: string) {
    if (!draft || !current) return;
    persist({
      ...draft,
      answers: { ...draft.answers, [current.id]: optionId },
    });
  }

  function go(delta: number) {
    if (!draft) return;
    const next = Math.max(0, Math.min(draft.questions.length - 1, draft.index + delta));
    persist({ ...draft, index: next });
  }

  function restart() {
    const next = createDraft();
    persist(next);
    toast.success("Nouveau QCM généré");
  }

  async function submitAll() {
    if (!draft || !user) return;
    const empty = draft.questions.filter((question) => !draft.answers[question.id]);
    if (empty.length) {
      toast.error(`Il reste ${empty.length} question(s) sans réponse`);
      return;
    }

    const { answers, finalScore } = gradeAnswers(draft.questions, draft.answers, draft.startedAt);
    const sub: Submission = {
      id: `sub-${Date.now()}`,
      schemaVersion: 2,
      quizMode: "qcm",
      userId: user.id,
      user,
      questions: draft.questions,
      answers,
      finalScore,
      submittedAt: new Date().toISOString(),
      status: "pending",
    };

    try {
      setSubmitting(true);
      await submitQuizSubmission(sub);
      localStorage.removeItem(AUTOSAVE_KEY);
      navigate({ to: "/done", search: { id: sub.id } });
    } catch (error) {
      toast.error(getErrorMessage(error, "Envoi impossible"));
    } finally {
      setSubmitting(false);
    }
  }

  if (!draft || !current) return null;

  return (
    <DashboardLayout
      title="QCM cybersécurité"
      subtitle="Sélectionnez une réponse par question. Le score est calculé automatiquement."
    >
      <div className="mb-6 grid gap-4 lg:grid-cols-[1fr_auto]">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
          <div className="mb-3 flex items-center justify-between text-sm">
            <span className="font-medium text-foreground">
              Question {draft.index + 1} / {draft.questions.length}
            </span>
            <span className="text-muted-foreground">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} />
          <p className="mt-3 text-xs text-muted-foreground">
            {answeredCount} réponse(s) sélectionnée(s) sur {draft.questions.length}
          </p>
        </div>

        {/* <Button variant="outline" onClick={restart} className="self-stretch lg:self-auto">
          Recommencer
        </Button> */}
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
          style={{
            backgroundImage: `url(${quizPattern})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
          }}
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

        <div className="mt-6 grid gap-3">
          {current.options.map((option) => {
            const isSelected = selected === option.id;

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => choose(option.id)}
                className={cn(
                  "group flex w-full items-start gap-3 rounded-xl border bg-background p-4 text-left transition-all hover:-translate-y-0.5 hover:border-sky-400/50 hover:shadow-[0_16px_36px_-24px_rgba(56,189,248,0.75)]",
                  isSelected && "border-sky-400 bg-sky-500/15 shadow-[0_18px_42px_-24px_rgba(56,189,248,0.95)]",
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                    isSelected ? "border-sky-300 text-sky-300" : "border-border text-muted-foreground",
                  )}
                >
                  {isSelected ? (
                    <Dot className="size-5" />
                  ) : (
                    <Circle className="size-3" />
                  )}
                </span>
                <span className="min-w-0 flex-1 text-sm leading-relaxed text-foreground md:text-base">
                  {option.text}
                </span>
              </button>
            );
          })}
        </div>

        <p className="mt-4 text-sm text-muted-foreground">
          Vous pourrez modifier votre choix avant la soumission finale.
        </p>
      </motion.div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <Button variant="outline" onClick={() => go(-1)} disabled={draft.index === 0}>
          <ArrowLeft className="size-4" /> Précédent
        </Button>
        <div className="flex items-center gap-2">
          {draft.index < draft.questions.length - 1 ? (
            <Button onClick={() => go(1)} disabled={!selected}>
              Suivant <ArrowRight className="size-4" />
            </Button>
          ) : (
            <Button onClick={submitAll} disabled={submitting || answeredCount < draft.questions.length}>
              {submitting ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
              Soumettre le QCM
            </Button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
