import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, RotateCw, ShieldPlus, UserCog, XCircle } from "lucide-react";
import { toast } from "sonner";

import { DashboardLayout } from "@/components/quiz/dashboard-layout";
import { ProtectedRoute } from "@/components/quiz/protected-route";
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
import { createRoleInvite, listRoleInvites, revokeRoleInvite } from "@/lib/firebase/server-api";
import type { RoleInvite, RoleInviteRole } from "@/lib/access-control";
import { getErrorMessage } from "@/lib/utils";

export const Route = createFileRoute("/superadmin")({
  head: () => ({ meta: [{ title: "Superadministration · CIRT" }] }),
  component: () => (
    <ProtectedRoute roles={["superadmin"]}>
      <SuperadminPage />
    </ProtectedRoute>
  ),
});

function SuperadminPage() {
  const [items, setItems] = useState<RoleInvite[]>([]);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<RoleInviteRole>("juror");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const stats = useMemo(() => {
    const pending = items.filter((item) => item.status === "pending").length;
    const used = items.filter((item) => item.status === "used").length;
    const admin = items.filter((item) => item.role === "admin").length;
    const juror = items.filter((item) => item.role === "juror").length;
    return { pending, used, admin, juror };
  }, [items]);

  async function refresh() {
    setLoading(true);
    try {
      const data = await listRoleInvites();
      setItems(data.invites);
    } catch (error) {
      toast.error(getErrorMessage(error, "Chargement impossible"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!email.trim() && !phone.trim()) {
      toast.error("Ajoutez au moins un email ou un téléphone");
      return;
    }
    setSubmitting(true);
    try {
      await createRoleInvite({ email: email.trim(), phone: phone.trim(), role });
      setEmail("");
      setPhone("");
      toast.success("Invitation créée");
      await refresh();
    } catch (error) {
      toast.error(getErrorMessage(error, "Création impossible"));
    } finally {
      setSubmitting(false);
    }
  }

  async function revoke(id: string) {
    try {
      await revokeRoleInvite(id);
      toast.success("Invitation révoquée");
      await refresh();
    } catch (error) {
      toast.error(getErrorMessage(error, "Révocation impossible"));
    }
  }

  return (
    <DashboardLayout
      title="Superadministration"
      subtitle="Autorisez les emails ou numéros qui pourront devenir administrateur ou juré."
    >
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "En attente", value: stats.pending, icon: ShieldPlus },
          { label: "Utilisées", value: stats.used, icon: UserCog },
          { label: "Administrateurs", value: stats.admin, icon: UserCog },
          { label: "Jurés", value: stats.juror, icon: ShieldPlus },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-soft)]"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  {stat.label}
                </p>
                <Icon className="size-4 text-primary" />
              </div>
              <p className="mt-2 font-display text-2xl font-bold text-foreground">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <form
        onSubmit={submit}
        className="mb-6 grid gap-3 rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-soft)] lg:grid-cols-[1fr_1fr_180px_auto]"
      >
        <Input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="email@domaine.com"
          className="bg-background"
        />
        <Input
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder="+261 34 12 345 67"
          className="bg-background"
        />
        <Select value={role} onValueChange={(value) => setRole(value as RoleInviteRole)}>
          <SelectTrigger className="bg-background">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="juror">Juré</SelectItem>
            <SelectItem value="admin">Administrateur</SelectItem>
          </SelectContent>
        </Select>
        <Button type="submit" disabled={submitting}>
          <Plus className="size-4" />
          Autoriser
        </Button>
      </form>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-soft)]">
        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
          <h2 className="text-sm font-semibold text-foreground">Invitations de rôle</h2>
          <Button variant="outline" size="sm" onClick={refresh} disabled={loading}>
            <RotateCw className="size-4" />
            Actualiser
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-primary/[0.04]">
              <TableHead>Contact</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Statut</TableHead>
              {/* <TableHead>Utilisée par</TableHead> */}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                  Chargement des invitations...
                </TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                  Aucune invitation pour le moment.
                </TableCell>
              </TableRow>
            ) : (
              items.map((invite) => (
                <TableRow key={invite.id}>
                  <TableCell>
                    <p className="font-medium text-foreground">{invite.email || "Email non renseigné"}</p>
                    <p className="text-xs text-muted-foreground">{invite.phone || "Téléphone non renseigné"}</p>
                  </TableCell>
                  <TableCell>{invite.role === "admin" ? "Administrateur" : "Juré"}</TableCell>
                  <TableCell>
                    <span className="rounded-full border border-border px-2 py-0.5 text-xs">
                      {invite.status}
                    </span>
                  </TableCell>
                  {/* <TableCell className="text-xs text-muted-foreground">
                    {invite.usedBy ?? "Non utilisé"}
                  </TableCell> */}
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={invite.status !== "pending"}
                      onClick={() => revoke(invite.id)}
                    >
                      <XCircle className="size-4" />
                      Révoquer
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </DashboardLayout>
  );
}
