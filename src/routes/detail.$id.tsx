import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, CheckCircle2, XCircle } from "lucide-react";

import { DashboardLayout } from "@/components/quiz/dashboard-layout";
import { ProtectedRoute } from "@/components/quiz/protected-route";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { getSubmission, reviewSubmission } from "@/lib/firebase/server-api";
import { useAuth } from "@/lib/quiz/auth-context";
import { DOMAIN_COLORS, LEVEL_COLORS } from "@/lib/quiz/constants";
import { formatPhone, initials } from "@/lib/quiz/format";
import type { Submission } from "@/lib/quiz/types";
import { cn, getErrorMessage } from "@/lib/utils";

export const Route = createFileRoute("/detail/$id")({
  head: () => ({ meta: [{ title: "Détail candidat · CIRT" }] }),
  component: () => (
    <ProtectedRoute roles={["juror", "admin", "superadmin"]}>
      <DetailPage />
    </ProtectedRoute>
  ),
});

function DetailPage() {
  const { id } = Route.useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sub, setSub] = useState<Submission | null>(null);
  const [note, setNote] = useState("");
  const [score, setScore] = useState<number>(0);
  const [answerPage, setAnswerPage] = useState(0);
  const [pageDirection, setPageDirection] = useState(1);
  const canEvaluate = user?.role === "juror";

  useEffect(() => {
    let active = true;
    getSubmission(id)
      .then((data) => {
        if (!active) return;
        const s = data.submission;
        if (!s) {
          toast.error("Candidature introuvable");
          navigate({ to: "/admin" });
          return;
        }
        setSub(s);
        setNote(s.juryNote ?? "");
        setScore(s.juryScore ?? s.finalScore);
        setAnswerPage(0);
        setPageDirection(1);
      })
      .catch((error: unknown) => {
        toast.error(getErrorMessage(error, "Chargement impossible"));
        navigate({ to: "/admin" });
      });
    return () => {
      active = false;
    };
  }, [id, navigate]);

  async function save() {
    if (!sub) return;
    try {
      const next = await reviewSubmission(sub.id, { juryNote: note, juryScore: score });
      setSub(next.submission);
      toast.success("Évaluation enregistrée");
    } catch (error) {
      toast.error(getErrorMessage(error, "Enregistrement impossible"));
    }
  }

  if (!sub) return null;

  const answerTotal = sub.questions.length;
  const currentQuestion = sub.questions[answerPage];
  const currentAnswer = currentQuestion
    ? sub.answers.find((answer) => answer.questionId === currentQuestion.id)
    : undefined;

  function goToAnswerPage(nextPage: number) {
    if (!answerTotal) return;
    const bounded = Math.max(0, Math.min(answerTotal - 1, nextPage));
    if (bounded === answerPage) return;
    setPageDirection(bounded > answerPage ? 1 : -1);
    setAnswerPage(bounded);
  }

  return (
    <DashboardLayout
      title="Évaluation candidat"
      subtitle="Réponses QCM détaillées, score automatique et avis du jury."
    >
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm">
          <Link to="/jury">
            <ArrowLeft className="size-4" /> Retour
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <aside className="space-y-4 lg:col-span-1">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
            <div className="flex items-center gap-3">
              <div
                className="flex size-12 items-center justify-center rounded-full text-base font-semibold text-white"
                style={{ background: sub.user.avatarColor ?? "oklch(0.42 0.17 268)" }}
              >
                {initials(sub.user.firstName, sub.user.lastName)}
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold text-foreground">
                  {sub.user.firstName} {sub.user.lastName}
                </h3>
                <p className="text-xs text-muted-foreground">{sub.user.email}</p>
              </div>
            </div>
            <dl className="mt-5 grid gap-2 text-sm">
              {[
                ["Profil", sub.user.profile ?? "Non renseigné"],
                ["Téléphone", sub.user.phone ? formatPhone(sub.user.phone) : "Non renseigné"],
                ["LinkedIn", sub.user.linkedin ?? "Non renseigné"],
                ["Auth", sub.user.provider],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="flex justify-between gap-3 border-b border-border/60 pb-1.5 last:border-0"
                >
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="text-right text-foreground">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
            <h3 className="text-sm font-semibold text-foreground">Score automatique</h3>
            <div className="mt-4 space-y-3 text-sm">
              <div>
                <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                  <span>Score final</span>
                  <span className="font-mono font-semibold text-foreground">
                    {sub.finalScore}/100
                  </span>
                </div>
                <Progress value={sub.finalScore} />
              </div>
              <div>
                <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                  <span>Bonnes réponses</span>
                  <span className="font-mono font-semibold text-foreground">
                    {sub.answers.filter((answer) => answer.isCorrect).length}/{sub.questions.length}
                  </span>
                </div>
                <Progress
                  value={
                    sub.questions.length
                      ? (sub.answers.filter((answer) => answer.isCorrect).length / sub.questions.length) * 100
                      : 0
                  }
                />
              </div>
            </div>
          </div>

          {canEvaluate ? (
            <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
              <h3 className="text-sm font-semibold text-foreground">Notation du jury</h3>
              <label className="mt-3 block text-xs text-muted-foreground">Score /100</label>
              <input
                type="number"
                min={0}
                max={100}
                value={score}
                onChange={(e) => setScore(Number(e.target.value))}
                className="mt-1 h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
              />
              <label className="mt-3 block text-xs text-muted-foreground">Justification</label>
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Vos commentaires pour l'équipe RH…"
                className="mt-1 min-h-[110px]"
              />
              <Button onClick={save} className="mt-3 w-full">
                Enregistrer l'évaluation
              </Button>
            </div>
          ) : sub.status === "reviewed" ? (
            <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
              <h3 className="text-sm font-semibold text-foreground">Évaluation du jury</h3>
              <dl className="mt-4 grid gap-2 text-sm">
                <div className="flex justify-between gap-3 border-b border-border/60 pb-1.5">
                  <dt className="text-muted-foreground">Évalué par</dt>
                  <dd className="text-right text-foreground">
                    {sub.reviewedByEmail ?? "Non renseigné"}
                  </dd>
                </div>
                <div className="flex justify-between gap-3 border-b border-border/60 pb-1.5">
                  <dt className="text-muted-foreground">Score jury</dt>
                  <dd className="font-mono text-foreground">{sub.juryScore ?? "Non noté"}/100</dd>
                </div>
              </dl>
              {sub.juryNote ? (
                <p className="mt-3 whitespace-pre-wrap rounded-lg border border-border bg-surface-muted/40 px-3 py-2.5 text-sm text-foreground">
                  {sub.juryNote}
                </p>
              ) : null}
            </div>
          ) : null}
        </aside>

        <section className="space-y-4 lg:col-span-2">
          {sub.answers.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
              Aucune réponse détaillée disponible pour cette candidature de démonstration.
            </div>
          ) : currentQuestion ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)]">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Réponses du candidat
                  </p>
                  <p className="mt-1 text-sm text-foreground">
                    Enregistrement {answerPage + 1} sur {answerTotal}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => goToAnswerPage(answerPage - 1)}
                    disabled={answerPage === 0}
                  >
                    <ArrowLeft className="size-4" /> Précédent
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => goToAnswerPage(answerPage + 1)}
                    disabled={answerPage >= answerTotal - 1}
                  >
                    Suivant <ArrowRight className="size-4" />
                  </Button>
                </div>
              </div>

              <AnimatePresence mode="wait" custom={pageDirection}>
                <motion.div
                  key={currentQuestion.id}
                  custom={pageDirection}
                  initial={{ opacity: 0, x: pageDirection > 0 ? 36 : -36, scale: 0.985 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: pageDirection > 0 ? -36 : 36, scale: 0.985 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]"
                >
                  {(() => {
              const q = currentQuestion;
              const a = currentAnswer;
              const options = q.options ?? [];
              return (
                <>
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono text-muted-foreground">Q{answerPage + 1}</span>
                    <Badge variant="outline" className={cn("border", DOMAIN_COLORS[q.domain])}>
                      {q.domain}
                    </Badge>
                    <Badge variant="outline" className={cn("border", LEVEL_COLORS[q.level])}>
                      {q.level}
                    </Badge>
                   {a ? (
                      <span className="ml-auto text-xs text-muted-foreground">
                        {a.isCorrect ? "Correct" : "Incorrect"} · {Math.round(a.points)} pt
                      </span>
                    ) : null}
                  </div>
                  <h4 className="font-semibold text-foreground">{q.text}</h4>
                  {options.length ? (
                  <div className="mt-3 grid gap-2">
                    {options.map((option) => {
                      const isSelected = a?.selectedOptionId === option.id;
                      const isCorrect = q.correctOptionId === option.id;
                      return (
                        <div
                          key={option.id}
                          className={cn(
                            "flex items-start gap-2 rounded-lg border border-border bg-surface-muted/40 px-3 py-2.5 text-sm leading-relaxed text-foreground",
                            isCorrect && "border-iris-lime/50 bg-iris-lime/10",
                            isSelected && !isCorrect && "border-destructive/50 bg-destructive/10",
                          )}
                        >
                          {isCorrect ? (
                            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-iris-lime" />
                          ) : isSelected ? (
                            <XCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
                          ) : (
                            <span className="mt-1 size-4 shrink-0 rounded-full border border-muted-foreground/30" />
                          )}
                          <span>{option.text}</span>
                        </div>
                      );
                    })}
                  </div>
                  ) : (
                    <p className="mt-3 whitespace-pre-wrap rounded-lg border border-border bg-surface-muted/40 px-3 py-2.5 text-sm leading-relaxed text-foreground">
                      Ancienne réponse libre : {a?.text ?? "Aucune réponse fournie."}
                    </p>
                  )}
                  {q.explanation ? (
                    <p className="mt-3 rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-muted-foreground">
                      {q.explanation}
                    </p>
                  ) : null}
                </>
              );
                  })()}
                </motion.div>
              </AnimatePresence>
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
              Aucune question disponible pour cette candidature.
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}
