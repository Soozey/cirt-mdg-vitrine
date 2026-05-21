import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { DashboardLayout } from "@/components/quiz/dashboard-layout";
import { ProtectedRoute } from "@/components/quiz/protected-route";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { seedDemoSubmissions, submissionsApi } from "@/lib/quiz/firestore";
import { formatRelative } from "@/lib/quiz/format";
import type { Submission } from "@/lib/quiz/types";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Administration · Jobdating CIRT" }] }),
  component: () => (
    <ProtectedRoute roles={["admin"]}>
      <AdminPage />
    </ProtectedRoute>
  ),
});

function AdminPage() {
  const [items, setItems] = useState<Submission[]>([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | "pending" | "reviewed">("all");

  useEffect(() => {
    seedDemoSubmissions();
    setItems(submissionsApi.list());
  }, []);

  const filtered = useMemo(() => {
    return items.filter((s) => {
      if (status !== "all" && s.status !== status) return false;
      if (q) {
        const blob = `${s.user.firstName} ${s.user.lastName} ${s.user.email}`.toLowerCase();
        if (!blob.includes(q.toLowerCase())) return false;
      }
      return true;
    });
  }, [items, q, status]);

  const stats = useMemo(() => {
    const total = items.length;
    const pending = items.filter((s) => s.status === "pending").length;
    const avg = total ? Math.round(items.reduce((a, s) => a + s.finalScore, 0) / total) : 0;
    const aiRisk = items.filter((s) => s.aiAverage > 0.5).length;
    return { total, pending, avg, aiRisk };
  }, [items]);

  function exportCsv() {
    const rows = [
      ["id", "candidat", "email", "score", "ai", "statut", "date"],
      ...filtered.map((s) => [
        s.id,
        `${s.user.firstName} ${s.user.lastName}`,
        s.user.email,
        String(s.finalScore),
        (s.aiAverage * 100).toFixed(0) + "%",
        s.status,
        s.submittedAt,
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "quiz-submissions.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Export CSV téléchargé");
  }

  function remove(id: string) {
    submissionsApi.remove(id);
    setItems(submissionsApi.list());
    toast.success("Soumission supprimée");
  }

  return (
    <DashboardLayout title="Administration" subtitle="Vue d'ensemble des candidatures et évaluations.">
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Candidatures", value: stats.total },
          { label: "En attente jury", value: stats.pending },
          { label: "Score moyen", value: `${stats.avg}/100` },
          { label: "Risque IA élevé", value: stats.aiRisk },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-soft)]">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</p>
            <p className="mt-1 font-display text-2xl font-bold text-foreground">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Rechercher un candidat…"
            className="pl-9"
          />
        </div>
        <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="pending">En attente</SelectItem>
            <SelectItem value="reviewed">Évalués</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={exportCsv}>
          <Download className="size-4" /> Export CSV
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-soft)]">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidat</TableHead>
                <TableHead>Profil</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>IA</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Soumis</TableHead>
                <TableHead className="w-[100px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-12 text-center text-sm text-muted-foreground">
                    Aucune candidature.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>
                      <Link
                        to="/detail/$id"
                        params={{ id: s.id }}
                        className="font-medium text-foreground hover:text-primary"
                      >
                        {s.user.firstName} {s.user.lastName}
                      </Link>
                      <p className="text-xs text-muted-foreground">{s.user.email}</p>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{s.user.profile ?? "—"}</TableCell>
                    <TableCell>
                      <span className="font-mono font-semibold text-foreground">{s.finalScore}</span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          s.aiAverage > 0.5
                            ? "border-destructive/40 bg-destructive/10 text-destructive"
                            : s.aiAverage > 0.3
                              ? "border-chart-4/40 bg-chart-4/10 text-chart-4"
                              : "border-accent/40 bg-accent-soft text-primary-deep"
                        }
                      >
                        {(s.aiAverage * 100).toFixed(0)}%
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={s.status === "reviewed" ? "secondary" : "outline"}>
                        {s.status === "reviewed" ? "Évalué" : "En attente"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{formatRelative(s.submittedAt)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => remove(s.id)} aria-label="Supprimer">
                        <Trash2 className="size-4 text-muted-foreground" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
}