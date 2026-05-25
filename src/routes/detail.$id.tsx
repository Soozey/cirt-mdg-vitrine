import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

import { DashboardLayout } from "@/components/quiz/dashboard-layout";
import { ProtectedRoute } from "@/components/quiz/protected-route";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { DOMAIN_COLORS, LEVEL_COLORS } from "@/lib/quiz/constants";
import { submissionsApi } from "@/lib/quiz/firestore";
import { initials } from "@/lib/quiz/format";
import type { Submission } from "@/lib/quiz/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/detail/$id")({
  head: () => ({ meta: [{ title: "Détail candidat · CIRT" }] }),
  component: () => (
    <ProtectedRoute roles={["juror", "admin"]}>
      <DetailPage />
    </ProtectedRoute>
  ),
});

function DetailPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [sub, setSub] = useState<Submission | null>(null);
  const [note, setNote] = useState("");
  const [score, setScore] = useState<number>(0);

  useEffect(() => {
    const s = submissionsApi.get(id);
    if (!s) {
      toast.error("Candidature introuvable");
      navigate({ to: "/admin" });
      return;
    }
    setSub(s);
    setNote(s.juryNote ?? "");
    setScore(s.juryScore ?? s.finalScore);
  }, [id, navigate]);

  function save() {
    if (!sub) return;
    const next: Submission = { ...sub, juryNote: note, juryScore: score, status: "reviewed" };
    submissionsApi.save(next);
    setSub(next);
    toast.success("Évaluation enregistrée");
  }

  if (!sub) return null;

  return (
    <DashboardLayout title="Évaluation candidat" subtitle="Réponses détaillées, scores IA et avis du jury.">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm">
          <Link to="/admin"><ArrowLeft className="size-4" /> Retour</Link>
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
                ["Profil", sub.user.profile ?? "—"],
                ["Téléphone", sub.user.phone ?? "—"],
                ["LinkedIn", sub.user.linkedin ?? "—"],
                ["Auth", sub.user.provider],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3 border-b border-border/60 pb-1.5 last:border-0">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="text-right text-foreground">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
            <h3 className="text-sm font-semibold text-foreground">Scores automatiques</h3>
            <div className="mt-4 space-y-3 text-sm">
              <div>
                <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                  <span>Score final</span>
                  <span className="font-mono font-semibold text-foreground">{sub.finalScore}/100</span>
                </div>
                <Progress value={sub.finalScore} />
              </div>
              <div>
                <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                  <span>Probabilité IA</span>
                  <span className="font-mono font-semibold text-foreground">{(sub.aiAverage * 100).toFixed(0)}%</span>
                </div>
                <Progress value={sub.aiAverage * 100} />
              </div>
            </div>
          </div>

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
        </aside>

        <section className="space-y-4 lg:col-span-2">
          {sub.answers.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
              Aucune réponse détaillée disponible pour cette candidature de démonstration.
            </div>
          ) : (
            sub.questions.map((q, i) => {
              const a = sub.answers.find((x) => x.questionId === q.id);
              return (
                <div key={q.id} className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono text-muted-foreground">Q{i + 1}</span>
                    <Badge variant="outline" className={cn("border", DOMAIN_COLORS[q.domain])}>
                      {q.domain}
                    </Badge>
                    <Badge variant="outline" className={cn("border", LEVEL_COLORS[q.level])}>
                      {q.level}
                    </Badge>
                    {a ? (
                      <span className="ml-auto text-xs text-muted-foreground">
                        Contenu {a.contentScore} · IA {(a.aiScore * 100).toFixed(0)}%
                      </span>
                    ) : null}
                  </div>
                  <h4 className="font-semibold text-foreground">{q.text}</h4>
                  <p className="mt-3 whitespace-pre-wrap rounded-lg border border-border bg-surface-muted/40 px-3 py-2.5 text-sm leading-relaxed text-foreground">
                    {a?.text ?? "—"}
                  </p>
                </div>
              );
            })
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}