import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";

import { DashboardLayout } from "@/components/quiz/dashboard-layout";
import { ProtectedRoute } from "@/components/quiz/protected-route";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { seedDemoSubmissions, submissionsApi } from "@/lib/quiz/firestore";
import { formatRelative } from "@/lib/quiz/format";
import type { Submission } from "@/lib/quiz/types";

export const Route = createFileRoute("/jury")({
  head: () => ({ meta: [{ title: "Espace juré · Jobdating CIRT" }] }),
  component: () => (
    <ProtectedRoute roles={["juror", "admin"]}>
      <JuryPage />
    </ProtectedRoute>
  ),
});

function JuryPage() {
  const [items, setItems] = useState<Submission[]>([]);

  useEffect(() => {
    seedDemoSubmissions();
    setItems(submissionsApi.list());
  }, []);

  const pending = items.filter((s) => s.status === "pending");
  const reviewed = items.filter((s) => s.status === "reviewed");

  return (
    <DashboardLayout title="Évaluations" subtitle="Examinez les réponses, notez et laissez votre commentaire.">
      <section className="mb-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          À évaluer ({pending.length})
        </h2>
        <div className="grid gap-3 md:grid-cols-2">
          {pending.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground md:col-span-2">
              Aucune candidature à évaluer pour le moment.
            </p>
          ) : (
            pending.map((s) => <Card key={s.id} s={s} />)
          )}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Déjà évaluées ({reviewed.length})
        </h2>
        <div className="grid gap-3 md:grid-cols-2">
          {reviewed.map((s) => <Card key={s.id} s={s} />)}
        </div>
      </section>
    </DashboardLayout>
  );
}

function Card({ s }: { s: Submission }) {
  return (
    <div className="group rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-soft)] transition-all hover:shadow-[var(--shadow-card)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-foreground">
            {s.user.firstName} {s.user.lastName}
          </h3>
          <p className="text-xs text-muted-foreground">{s.user.email}</p>
        </div>
        <Badge variant={s.status === "reviewed" ? "secondary" : "outline"}>
          {s.status === "reviewed" ? "Évalué" : "À évaluer"}
        </Badge>
      </div>
      <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
        <span>Score : <span className="font-mono font-semibold text-foreground">{s.finalScore}/100</span></span>
        <span>IA : {(s.aiAverage * 100).toFixed(0)}%</span>
        <span className="ml-auto">{formatRelative(s.submittedAt)}</span>
      </div>
      <div className="mt-4">
        <Button asChild size="sm" className="w-full">
          <Link to="/detail/$id" params={{ id: s.id }}>
            Examiner les réponses
          </Link>
        </Button>
      </div>
    </div>
  );
}