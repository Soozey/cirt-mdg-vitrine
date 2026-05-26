import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { toast } from "sonner";

import { DashboardLayout } from "@/components/quiz/dashboard-layout";
import { ProtectedRoute } from "@/components/quiz/protected-route";
import { SimplePagination } from "@/components/quiz/simple-pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { listSubmissionsForStaff } from "@/lib/firebase/server-api";
import { formatRelative } from "@/lib/quiz/format";
import type { Submission } from "@/lib/quiz/types";
import { getErrorMessage } from "@/lib/utils";

const PER_PAGE = 3;

export const Route = createFileRoute("/jury")({
  head: () => ({ meta: [{ title: "Espace juré · CIRT" }] }),
  component: () => (
    <ProtectedRoute roles={["juror", "admin", "superadmin"]}>
      <JuryPage />
    </ProtectedRoute>
  ),
});

function JuryPage() {
  const [items, setItems] = useState<Submission[]>([]);
  const [pagePending, setPagePending] = useState(1);
  const [pageReviewed, setPageReviewed] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    listSubmissionsForStaff()
      .then((data) => {
        if (active) setItems(data.submissions);
      })
      .catch((error: unknown) =>
        toast.error(getErrorMessage(error, "Chargement des évaluations impossible")),
      )
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const pending = items.filter((s) => s.status === "pending");
  const reviewed = items.filter((s) => s.status === "reviewed");

  const pendingPageCount = Math.max(1, Math.ceil(pending.length / PER_PAGE));
  const reviewedPageCount = Math.max(1, Math.ceil(reviewed.length / PER_PAGE));
  const pendingItems = pending.slice((pagePending - 1) * PER_PAGE, pagePending * PER_PAGE);
  const reviewedItems = reviewed.slice((pageReviewed - 1) * PER_PAGE, pageReviewed * PER_PAGE);

  return (
    <DashboardLayout
      title="Évaluations"
      subtitle="Examinez les réponses, notez et laissez votre commentaire."
    >
      <section className="mb-10">
        <div className="mb-3 flex items-center gap-2">
          <span className="size-2 rounded-full bg-iris-magenta" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            À évaluer ({pending.length})
          </h2>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {loading ? (
            <p className="rounded-xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground md:col-span-2">
              Chargement des candidatures…
            </p>
          ) : pendingItems.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground md:col-span-2">
              Aucune candidature à évaluer pour le moment.
            </p>
          ) : (
            pendingItems.map((s, i) => <Card key={s.id} s={s} index={i} />)
          )}
        </div>
        <SimplePagination
          page={pagePending}
          pageCount={pendingPageCount}
          onChange={setPagePending}
        />
      </section>

      <section>
        <div className="mb-3 flex items-center gap-2">
          <span className="size-2 rounded-full bg-iris-cyan" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Déjà évaluées ({reviewed.length})
          </h2>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {loading ? (
            <p className="rounded-xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground md:col-span-2">
              Chargement des évaluations…
            </p>
          ) : reviewedItems.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground md:col-span-2">
              Aucune évaluation pour le moment.
            </p>
          ) : (
            reviewedItems.map((s, i) => <Card key={s.id} s={s} index={i} />)
          )}
        </div>
        <SimplePagination
          page={pageReviewed}
          pageCount={reviewedPageCount}
          onChange={setPageReviewed}
        />
      </section>
    </DashboardLayout>
  );
}

function Card({ s, index }: { s: Submission; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      whileHover={{ y: -2 }}
      className="group relative overflow-hidden rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-soft)] transition-all hover:border-primary/30 hover:shadow-[var(--shadow-card)]"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-iris-violet to-iris-cyan opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="flex size-10 items-center justify-center rounded-full text-sm font-semibold text-white shadow-md"
            style={{
              background:
                s.user.avatarColor ??
                "linear-gradient(135deg, oklch(0.55 0.22 265), oklch(0.42 0.22 285))",
            }}
          >
            {(s.user.firstName?.[0] ?? "?") + (s.user.lastName?.[0] ?? "")}
          </div>
          <div>
            <h3 className="font-semibold text-foreground">
              {s.user.firstName} {s.user.lastName}
            </h3>
            <p className="text-xs text-muted-foreground">{s.user.email}</p>
          </div>
        </div>
        <Badge
          variant={s.status === "reviewed" ? "secondary" : "outline"}
          className={
            s.status === "pending"
              ? "border-iris-magenta/40 bg-iris-magenta/10 text-iris-magenta"
              : ""
          }
        >
          {s.status === "reviewed" ? "Évalué" : "À évaluer"}
        </Badge>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 rounded-lg bg-primary/[0.04] p-3 text-xs">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Score</p>
          <p className="font-mono font-semibold text-foreground">
            {s.finalScore}
            <span className="text-muted-foreground">/100</span>
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">IA</p>
          <p className="font-mono font-semibold text-foreground">
            {(s.aiAverage * 100).toFixed(0)}%
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Date</p>
          <p className="font-mono text-foreground">{formatRelative(s.submittedAt)}</p>
        </div>
      </div>
      <div className="mt-4">
        <Button asChild size="sm" className="w-full rounded-full bg-primary hover:bg-primary/90">
          <Link to="/detail/$id" params={{ id: s.id }}>
            Examiner les réponses
          </Link>
        </Button>
      </div>
    </motion.div>
  );
}
