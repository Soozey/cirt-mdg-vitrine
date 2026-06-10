import { useCallback, useEffect, useRef, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Circle, Clock3, Dot, Loader2, Play, Send } from "lucide-react";

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

const MS_PER_QUESTION = 60_000;
const SECONDS_PER_QUESTION = MS_PER_QUESTION / 1000;

export const Route = createFileRoute("/quiz")({
  head: () => ({
    meta: [
      { title: "Quiz Cybersécurité · Jobdating CIRT" },
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

function getRemainingSeconds(draft: Draft) {
  const durationMs = draft.questions.length * MS_PER_QUESTION;
  const deadline = draft.startedAt + durationMs;
  return Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
}

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function QuizPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(QUIZ_LENGTH * SECONDS_PER_QUESTION);
  const autoSubmittedRef = useRef(false);

  useEffect(() => {
    localStorage.removeItem(AUTOSAVE_KEY);
  }, []);

  const current = draft?.questions[draft.index];
  const selected = current ? (draft!.answers[current.id] ?? "") : "";
  const progress = draft ? ((draft.index + 1) / draft.questions.length) * 100 : 0;
  const answeredCount = draft
    ? draft.questions.filter((question) => draft.answers[question.id]).length
    : 0;

  function persist(next: Draft) {
    setDraft(next);
    setRemainingSeconds(getRemainingSeconds(next));
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

  function startQuiz() {
    const next = createDraft();
    autoSubmittedRef.current = false;
    persist(next);
  }

  const submitAll = useCallback(
    async (force = false) => {
      if (!draft || !user) return;
      const empty = draft.questions.filter((question) => !draft.answers[question.id]);
      if (!force && empty.length) {
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
    },
    [draft, navigate, user],
  );

  useEffect(() => {
    if (!draft) return;

    const tick = () => {
      const nextRemaining = getRemainingSeconds(draft);
      setRemainingSeconds(nextRemaining);

      if (nextRemaining > 0 || autoSubmittedRef.current) return;
      autoSubmittedRef.current = true;
      toast.info("Temps écoulé : le quiz est soumis automatiquement.");
      void submitAll(true);
    };

    tick();
    const interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  }, [draft, submitAll]);

  if (!draft || !current) {
    return (
      <DashboardLayout
        title="QCM cybersécurité"
        subtitle="Le quiz commencera uniquement après votre confirmation. La première question s'affichera ensuite et la minuterie s'arrêtera à la fin du temps imparti."
      >
        <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] md:p-8">
          <div className="max-w-2xl">
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
              Prêt à commencer
            </Badge>
            <h2 className="font-display text-2xl font-semibold text-foreground">
              Lancez le quiz quand vous êtes prêt
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Après le clic sur le bouton, le minuteur démarre et la première question apparaît. Le
              quiz sera soumis automatiquement lorsque le temps imparti sera écoulé.
            </p>
          </div>
          <Button onClick={startQuiz} className="mt-6">
            <Play className="size-4" />
            Commencer le quiz
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="QCM cybersécurité"
      subtitle="La minuterie s'arrêtera automatiquement à la fin du temps imparti."
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

        <div
          className={cn(
            "flex min-w-[13rem] items-center justify-between gap-3 rounded-2xl border bg-card p-5 shadow-[var(--shadow-soft)]",
            remainingSeconds <= 60 ? "border-destructive/40 text-destructive" : "border-border",
          )}
        >
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Temps restant</p>
            <p className="mt-1 font-display text-2xl font-bold tabular-nums">
              {formatTime(remainingSeconds)}
            </p>
          </div>
          <Clock3 className="size-6 shrink-0" />
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
                  isSelected &&
                    "border-sky-400 bg-sky-500/15 shadow-[0_18px_42px_-24px_rgba(56,189,248,0.95)]",
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                    isSelected
                      ? "border-sky-300 text-sky-300"
                      : "border-border text-muted-foreground",
                  )}
                >
                  {isSelected ? <Dot className="size-5" /> : <Circle className="size-3" />}
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
            <Button
              onClick={() => submitAll()}
              disabled={submitting || answeredCount < draft.questions.length}
            >
              {submitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Send className="size-4" />
              )}
              Soumettre le QCM
            </Button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
