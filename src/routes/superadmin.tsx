import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Download,
  FileText,
  Plus,
  RotateCw,
  Search,
  ShieldPlus,
  Trash2,
  UserCog,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { DashboardLayout } from "@/components/quiz/dashboard-layout";
import { ProtectedRoute } from "@/components/quiz/protected-route";
import { SimplePagination } from "@/components/quiz/simple-pagination";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
import {
  createRoleInvite,
  deleteEventRegistration,
  deletePartnershipLead,
  downloadEventRegistrationCv,
  listEventRegistrations,
  listPartnershipLeads,
  listRoleInvites,
  revokeRoleInvite,
  updatePartnershipLeadStatus,
} from "@/lib/firebase/server-api";
import type { RoleInvite, RoleInviteRole } from "@/lib/access-control";
import {
  PARTNERSHIP_STATUS_LABELS,
  type PartnershipLead,
  type PartnershipLeadStatus,
} from "@/lib/partnerships";
import {
  REGISTRATION_LABELS,
  type RegistrationRecord,
  type RegistrationType,
} from "@/lib/registrations";
import {
  PHONE_PREFIXES,
  composePhone,
  formatNationalPhone,
  formatPhone,
  type PhonePrefix,
} from "@/lib/quiz/format";
import { getErrorMessage } from "@/lib/utils";

const PER_PAGE = 8;

type SuperadminView =
  | "role-invites"
  | "partnerships"
  | "registrations"
  | "registrations-visitor"
  | "registrations-ctf"
  | "registrations-job"
  | "registrations-workshop"
  | "registrations-newsletter";

const REGISTRATION_VIEW_TYPES: Partial<Record<SuperadminView, RegistrationType>> = {
  "registrations-visitor": "visitor",
  "registrations-ctf": "ctf-hackathon",
  "registrations-job": "job-dating",
  "registrations-workshop": "workshop",
  "registrations-newsletter": "newsletter",
};

const SUPERADMIN_VIEWS: Array<{ value: SuperadminView; label: string; hint: string }> = [
  {
    value: "role-invites",
    label: "Invitations de rôle",
    hint: "Gestion des accès admin et juré",
  },
  {
    value: "partnerships",
    label: "Demandes partenaires",
    hint: "Packages, sponsors et demandes B2B",
  },
  {
    value: "registrations",
    label: "Toutes inscriptions",
    hint: "Vue consolidée des formulaires publics",
  },
  { value: "registrations-visitor", label: "Visiteur", hint: "Billetterie visiteurs" },
  { value: "registrations-ctf", label: "CTF", hint: "CTF & Hackathon" },
  { value: "registrations-job", label: "Job Dating", hint: "CV et portfolios" },
  { value: "registrations-workshop", label: "Ateliers", hint: "Ateliers & masterclass" },
  { value: "registrations-newsletter", label: "Newsletter", hint: "Leads mailing list" },
];

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
  const [phonePrefix, setPhonePrefix] = useState<PhonePrefix>("+261");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<RoleInviteRole>("juror");
  const [registrations, setRegistrations] = useState<RegistrationRecord[]>([]);
  const [registrationQuery, setRegistrationQuery] = useState("");
  const [registrationType, setRegistrationType] = useState<RegistrationType | "all">("all");
  const [paymentFilter, setPaymentFilter] = useState<"all" | "paid" | "pending">("all");
  const [partnershipLeads, setPartnershipLeads] = useState<PartnershipLead[]>([]);
  const [partnershipQuery, setPartnershipQuery] = useState("");
  const [partnershipStatus, setPartnershipStatus] = useState<PartnershipLeadStatus | "all">("all");
  const [activeView, setActiveView] = useState<SuperadminView>("role-invites");
  const activeViewDetails =
    SUPERADMIN_VIEWS.find((view) => view.value === activeView) ?? SUPERADMIN_VIEWS[0];
  const [roleInvitePage, setRoleInvitePage] = useState(1);
  const [partnershipPage, setPartnershipPage] = useState(1);
  const [registrationPage, setRegistrationPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [registrationsLoading, setRegistrationsLoading] = useState(true);
  const [partnershipsLoading, setPartnershipsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const stats = useMemo(() => {
    const pending = items.filter((item) => item.status === "pending").length;
    const used = items.filter((item) => item.status === "used").length;
    const admin = items.filter((item) => item.role === "admin").length;
    const juror = items.filter((item) => item.role === "juror").length;
    return { pending, used, admin, juror };
  }, [items]);

  const registrationStats = useMemo(() => {
    const active = registrations.filter((item) => !item.deleted);
    return {
      total: active.length,
      tickets: active.filter((item) => item.type === "visitor").length,
      paid: active.filter((item) => item.paiementStatus).length,
      workshops: active.filter((item) => item.type === "workshop").length,
    };
  }, [registrations]);

  const filteredRegistrations = useMemo(() => {
    const needle = registrationQuery.trim().toLowerCase();
    const viewType = REGISTRATION_VIEW_TYPES[activeView];
    const effectiveType = viewType ?? registrationType;
    return registrations.filter((item) => {
      if (item.deleted) return false;
      if (effectiveType !== "all" && item.type !== effectiveType) return false;
      if (paymentFilter === "paid" && !item.paiementStatus) return false;
      if (paymentFilter === "pending" && item.paiementStatus) return false;
      if (!needle) return true;
      return `${item.nom} ${item.prenom ?? ""} ${item.email} ${item.telephone}`
        .toLowerCase()
        .includes(needle);
    });
  }, [activeView, paymentFilter, registrationQuery, registrationType, registrations]);

  const partnershipStats = useMemo(() => {
    const active = partnershipLeads.filter((item) => !item.deleted);
    return {
      total: active.length,
      new: active.filter((item) => item.status === "new").length,
      contacted: active.filter((item) => item.status === "contacted").length,
      qualified: active.filter((item) => item.status === "qualified").length,
    };
  }, [partnershipLeads]);

  const filteredPartnershipLeads = useMemo(() => {
    const needle = partnershipQuery.trim().toLowerCase();
    return partnershipLeads.filter((item) => {
      if (item.deleted) return false;
      if (partnershipStatus !== "all" && item.status !== partnershipStatus) return false;
      if (!needle) return true;
      return `${item.organization} ${item.email} ${item.phone} ${item.level} ${item.sector}`
        .toLowerCase()
        .includes(needle);
    });
  }, [partnershipLeads, partnershipQuery, partnershipStatus]);

  const roleInvitePageCount = Math.max(1, Math.ceil(items.length / PER_PAGE));
  const roleInvitePageItems = items.slice(
    (roleInvitePage - 1) * PER_PAGE,
    roleInvitePage * PER_PAGE,
  );
  const partnershipPageCount = Math.max(1, Math.ceil(filteredPartnershipLeads.length / PER_PAGE));
  const partnershipPageItems = filteredPartnershipLeads.slice(
    (partnershipPage - 1) * PER_PAGE,
    partnershipPage * PER_PAGE,
  );
  const registrationPageCount = Math.max(1, Math.ceil(filteredRegistrations.length / PER_PAGE));
  const registrationPageItems = filteredRegistrations.slice(
    (registrationPage - 1) * PER_PAGE,
    registrationPage * PER_PAGE,
  );

  useEffect(() => {
    setRegistrationPage(1);
  }, [activeView, paymentFilter, registrationQuery, registrationType]);

  useEffect(() => {
    setPartnershipPage(1);
  }, [partnershipQuery, partnershipStatus]);

  useEffect(() => {
    setRoleInvitePage((current) => Math.min(current, roleInvitePageCount));
  }, [roleInvitePageCount]);

  useEffect(() => {
    setPartnershipPage((current) => Math.min(current, partnershipPageCount));
  }, [partnershipPageCount]);

  useEffect(() => {
    setRegistrationPage((current) => Math.min(current, registrationPageCount));
  }, [registrationPageCount]);

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

  async function refreshRegistrations() {
    setRegistrationsLoading(true);
    try {
      const data = await listEventRegistrations();
      setRegistrations(data.registrations);
    } catch (error) {
      toast.error(getErrorMessage(error, "Chargement des inscriptions impossible"));
    } finally {
      setRegistrationsLoading(false);
    }
  }

  async function refreshPartnershipLeads() {
    setPartnershipsLoading(true);
    try {
      const data = await listPartnershipLeads();
      setPartnershipLeads(data.leads);
    } catch (error) {
      toast.error(getErrorMessage(error, "Chargement des demandes partenaires impossible"));
    } finally {
      setPartnershipsLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    refreshRegistrations();
    refreshPartnershipLeads();
  }, []);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const formattedPhone = composePhone(phonePrefix, phone);
    if (!email.trim() && !formattedPhone) {
      toast.error("Ajoutez au moins un email ou un téléphone");
      return;
    }
    setSubmitting(true);
    try {
      await createRoleInvite({ email: email.trim(), phone: formattedPhone, role });
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

  async function removeRegistration(id: string) {
    try {
      await deleteEventRegistration(id, "soft");
      setRegistrations((current) => current.filter((item) => item.id !== id));
      toast.success("Inscription supprimée");
    } catch (error) {
      toast.error(getErrorMessage(error, "Suppression impossible"));
    }
  }

  async function changePartnershipStatus(id: string, status: PartnershipLeadStatus) {
    try {
      const data = await updatePartnershipLeadStatus(id, status);
      setPartnershipLeads((current) => current.map((item) => (item.id === id ? data.lead : item)));
      toast.success("Statut partenaire mis à jour");
    } catch (error) {
      toast.error(getErrorMessage(error, "Mise à jour impossible"));
    }
  }

  async function removePartnershipLead(id: string) {
    try {
      await deletePartnershipLead(id, "soft");
      setPartnershipLeads((current) => current.filter((item) => item.id !== id));
      toast.success("Demande partenaire supprimée");
    } catch (error) {
      toast.error(getErrorMessage(error, "Suppression impossible"));
    }
  }

  function exportPartnershipLeadsCsv() {
    const rows = [
      [
        "id",
        "organisation",
        "email",
        "telephone",
        "secteur",
        "package",
        "sourcePackage",
        "statut",
        "message",
        "createdAt",
      ],
      ...filteredPartnershipLeads.map((item) => [
        item.id,
        item.organization,
        item.email,
        item.phone,
        item.sector,
        item.level,
        item.sourcePackage ?? "",
        PARTNERSHIP_STATUS_LABELS[item.status],
        item.message ?? "",
        item.createdAt ?? "",
      ]),
    ];
    const csv = rows
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "demandes-partenaires-scm-2026.csv";
    anchor.click();
    URL.revokeObjectURL(url);
    toast.success("Export partenaires téléchargé");
  }

  function exportRegistrationsCsv() {
    const rows = [
      [
        "id",
        "formulaire",
        "nom",
        "prenom",
        "email",
        "telephone",
        "profil",
        "billet",
        "paiement",
        "session",
        "portfolio",
        "cv",
        "qrCode",
        "createdAt",
      ],
      ...filteredRegistrations.map((item) => [
        item.id,
        REGISTRATION_LABELS[item.type],
        item.nom,
        item.prenom ?? "",
        item.email,
        item.telephone,
        item.profil || item.technicalProfile || item.statut || "",
        item.typeBillet ?? "",
        item.paiementStatus ? "payé" : "en attente",
        item.session ?? "",
        item.portfolioUrl ?? "",
        item.cvFileName ?? "",
        item.qrCode ?? "",
        item.createdAt ?? "",
      ]),
    ];
    const csv = rows
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "inscriptions-scm-2026.csv";
    anchor.click();
    URL.revokeObjectURL(url);
    toast.success("Export CSV téléchargé");
  }

  function exportRegistrationsPdf() {
    const rows = filteredRegistrations
      .map(
        (item) =>
          `<tr><td>${REGISTRATION_LABELS[item.type]}</td><td>${item.nom} ${item.prenom ?? ""}</td><td>${item.email}</td><td>${item.telephone}</td><td>${item.portfolioUrl ?? ""}</td><td>${item.qrCode ?? ""}</td></tr>`,
      )
      .join("");
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`
      <html><head><title>Inscriptions SCM 2026</title>
      <style>body{font-family:Arial,sans-serif;padding:24px}table{width:100%;border-collapse:collapse}td,th{border:1px solid #ddd;padding:8px;text-align:left}th{background:#f2f2f2}</style>
      </head><body><h1>Inscriptions SCM 2026</h1><table><thead><tr><th>Formulaire</th><th>Nom</th><th>Email</th><th>Téléphone</th><th>Portfolio</th><th>QR Code</th></tr></thead><tbody>${rows}</tbody></table></body></html>
    `);
    win.document.close();
    win.print();
  }

  return (
    <DashboardLayout
      title="Superadministration"
      subtitle="Autorisez les emails ou numéros qui pourront devenir administrateur ou juré."
    >
      <div className="mb-6 rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-soft)]">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Affichage</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Choisissez le formulaire ou module à consulter.
            </p>
          </div>
          <Select
            value={activeView}
            onValueChange={(value) => setActiveView(value as SuperadminView)}
          >
            <SelectTrigger className="h-11 w-full border-primary/20 bg-background text-left leading-none shadow-sm md:w-[360px] [&>span]:block [&>span]:truncate">
              <SelectValue>{activeViewDetails.label}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {SUPERADMIN_VIEWS.map((view) => (
                <SelectItem key={view.value} value={view.value}>
                  <div className="py-1">
                    <p className="font-medium">{view.label}</p>
                    <p className="text-xs text-muted-foreground">{view.hint}</p>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {activeView === "role-invites" ? (
        <>
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
                  <p className="mt-2 font-display text-2xl font-bold text-foreground">
                    {stat.value}
                  </p>
                </div>
              );
            })}
          </div>

          <form
            onSubmit={submit}
            className="mb-6 grid gap-3 rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-soft)] lg:grid-cols-[1fr_8rem_1fr_180px_auto]"
          >
            <Input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="email@domaine.com"
              className="bg-background"
            />
            <Select
              value={phonePrefix}
              onValueChange={(value) => {
                const nextPrefix = value as PhonePrefix;
                setPhonePrefix(nextPrefix);
                setPhone((current) => formatNationalPhone(nextPrefix, current));
              }}
            >
              <SelectTrigger className="bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PHONE_PREFIXES.map((prefix) => (
                  <SelectItem key={prefix.value} value={prefix.value}>
                    {prefix.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="tel"
              value={phone}
              onChange={(event) => setPhone(formatNationalPhone(phonePrefix, event.target.value))}
              placeholder={phonePrefix === "+261" ? "34 12 345 67" : "Numéro"}
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
                    <TableCell
                      colSpan={5}
                      className="py-10 text-center text-sm text-muted-foreground"
                    >
                      Chargement des invitations...
                    </TableCell>
                  </TableRow>
                ) : items.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="py-10 text-center text-sm text-muted-foreground"
                    >
                      Aucune invitation pour le moment.
                    </TableCell>
                  </TableRow>
                ) : (
                  roleInvitePageItems.map((invite) => (
                    <TableRow key={invite.id}>
                      <TableCell>
                        <p className="font-medium text-foreground">
                          {invite.email || "Email non renseigné"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {invite.phone ? formatPhone(invite.phone) : "Téléphone non renseigné"}
                        </p>
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
          <SimplePagination
            page={roleInvitePage}
            pageCount={roleInvitePageCount}
            onChange={setRoleInvitePage}
          />
        </>
      ) : null}

      {activeView === "partnerships" ? (
        <>
          <div className="mt-10 mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Demandes partenaires", value: partnershipStats.total },
              { label: "Nouvelles", value: partnershipStats.new },
              { label: "Contactées", value: partnershipStats.contacted },
              { label: "Qualifiées", value: partnershipStats.qualified },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-soft)]"
              >
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  {stat.label}
                </p>
                <p className="mt-2 font-display text-2xl font-bold text-foreground">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="mb-4 flex flex-wrap items-center gap-2">
            <div className="relative min-w-[220px] flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={partnershipQuery}
                onChange={(event) => setPartnershipQuery(event.target.value)}
                placeholder="Rechercher société, email, téléphone, package"
                className="pl-9"
              />
            </div>
            <Select
              value={partnershipStatus}
              onValueChange={(value) =>
                setPartnershipStatus(value as PartnershipLeadStatus | "all")
              }
            >
              <SelectTrigger className="w-[180px] bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous statuts</SelectItem>
                {Object.entries(PARTNERSHIP_STATUS_LABELS).map(([value, itemLabel]) => (
                  <SelectItem key={value} value={value}>
                    {itemLabel}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={refreshPartnershipLeads}
              disabled={partnershipsLoading}
            >
              <RotateCw className="size-4" />
              Actualiser
            </Button>
            <Button variant="outline" onClick={exportPartnershipLeadsCsv}>
              <Download className="size-4" />
              CSV
            </Button>
          </div>

          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-soft)]">
            <div className="border-b border-border px-4 py-3">
              <h2 className="text-sm font-semibold text-foreground">
                Demandes de packages partenaires
              </h2>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-primary/[0.04]">
                    <TableHead>Organisation</TableHead>
                    <TableHead>Package</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {partnershipsLoading ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="py-10 text-center text-sm text-muted-foreground"
                      >
                        Chargement des demandes partenaires...
                      </TableCell>
                    </TableRow>
                  ) : filteredPartnershipLeads.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="py-10 text-center text-sm text-muted-foreground"
                      >
                        Aucune demande partenaire.
                      </TableCell>
                    </TableRow>
                  ) : (
                    partnershipPageItems.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell className="min-w-[220px]">
                          <p className="font-medium text-foreground">{lead.organization}</p>
                          <p className="text-xs text-muted-foreground">{lead.email}</p>
                          <p className="text-xs text-muted-foreground">{lead.phone}</p>
                          <p className="mt-1 text-xs text-muted-foreground">{lead.sector}</p>
                        </TableCell>
                        <TableCell className="min-w-[210px]">
                          <p className="font-medium text-foreground">{lead.level}</p>
                          {lead.sourcePackage ? (
                            <p className="text-xs text-muted-foreground">
                              Source : {lead.sourcePackage}
                            </p>
                          ) : null}
                        </TableCell>
                        <TableCell className="min-w-[260px] max-w-md text-sm text-muted-foreground">
                          {lead.message || "Aucun message"}
                        </TableCell>
                        <TableCell>
                          <Select
                            value={lead.status}
                            onValueChange={(value) =>
                              changePartnershipStatus(lead.id, value as PartnershipLeadStatus)
                            }
                          >
                            <SelectTrigger className="w-[150px] bg-background">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(PARTNERSHIP_STATUS_LABELS).map(
                                ([value, itemLabel]) => (
                                  <SelectItem key={value} value={value}>
                                    {itemLabel}
                                  </SelectItem>
                                ),
                              )}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-right">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" aria-label="Supprimer">
                                <Trash2 className="size-4 text-muted-foreground" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Supprimer cette demande partenaire ?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  La demande sera archivée et retirée du tableau courant.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => removePartnershipLead(lead.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Supprimer
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
          <SimplePagination
            page={partnershipPage}
            pageCount={partnershipPageCount}
            onChange={setPartnershipPage}
          />
        </>
      ) : null}

      {activeView.startsWith("registrations") ? (
        <>
          <div className="mt-10 mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Inscriptions", value: registrationStats.total },
              { label: "Billets visiteurs", value: registrationStats.tickets },
              { label: "Billets payés / invités", value: registrationStats.paid },
              { label: "Ateliers", value: registrationStats.workshops },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-soft)]"
              >
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  {stat.label}
                </p>
                <p className="mt-2 font-display text-2xl font-bold text-foreground">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="mb-4 flex flex-wrap items-center gap-2">
            <div className="relative min-w-[220px] flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={registrationQuery}
                onChange={(event) => setRegistrationQuery(event.target.value)}
                placeholder="Rechercher nom, email, téléphone"
                className="pl-9"
              />
            </div>
            {activeView === "registrations" ? (
              <Select
                value={registrationType}
                onValueChange={(value) => setRegistrationType(value as RegistrationType | "all")}
              >
                <SelectTrigger className="w-[210px] bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les formulaires</SelectItem>
                  {Object.entries(REGISTRATION_LABELS).map(([value, itemLabel]) => (
                    <SelectItem key={value} value={value}>
                      {itemLabel}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Badge variant="outline" className="px-3 py-2">
                {REGISTRATION_LABELS[REGISTRATION_VIEW_TYPES[activeView] ?? "visitor"]}
              </Badge>
            )}
            <Select
              value={paymentFilter}
              onValueChange={(value) => setPaymentFilter(value as typeof paymentFilter)}
            >
              <SelectTrigger className="w-[190px] bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous paiements</SelectItem>
                <SelectItem value="paid">Payés / invités</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={refreshRegistrations}
              disabled={registrationsLoading}
            >
              <RotateCw className="size-4" />
              Actualiser
            </Button>
            <Button variant="outline" onClick={exportRegistrationsCsv}>
              <Download className="size-4" />
              CSV
            </Button>
            <Button variant="outline" onClick={exportRegistrationsPdf}>
              <FileText className="size-4" />
              PDF
            </Button>
          </div>

          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-soft)]">
            <div className="border-b border-border px-4 py-3">
              <h2 className="text-sm font-semibold text-foreground">Inscriptions publiques</h2>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-primary/[0.04]">
                    <TableHead>Participant</TableHead>
                    <TableHead>Formulaire</TableHead>
                    <TableHead>Profil</TableHead>
                    <TableHead>Documents</TableHead>
                    <TableHead>Paiement</TableHead>
                    <TableHead>QR Code</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registrationsLoading ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="py-10 text-center text-sm text-muted-foreground"
                      >
                        Chargement des inscriptions...
                      </TableCell>
                    </TableRow>
                  ) : filteredRegistrations.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="py-10 text-center text-sm text-muted-foreground"
                      >
                        Aucune inscription.
                      </TableCell>
                    </TableRow>
                  ) : (
                    registrationPageItems.map((registration) => (
                      <TableRow key={registration.id}>
                        <TableCell>
                          <p className="font-medium text-foreground">
                            {registration.nom} {registration.prenom}
                          </p>
                          <p className="text-xs text-muted-foreground">{registration.email}</p>
                          <p className="text-xs text-muted-foreground">{registration.telephone}</p>
                        </TableCell>
                        <TableCell>{REGISTRATION_LABELS[registration.type]}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {registration.profil ||
                            registration.technicalProfile ||
                            registration.session ||
                            registration.statut ||
                            "Non renseigné"}
                        </TableCell>
                        <TableCell className="min-w-[180px] text-sm">
                          {registration.portfolioUrl ? (
                            <a
                              href={registration.portfolioUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block font-medium text-primary hover:underline"
                            >
                              Portfolio
                            </a>
                          ) : null}
                          {registration.cvStoragePath ? (
                            <button
                              type="button"
                              className="mt-1 text-left text-sm text-primary hover:underline"
                              onClick={() =>
                                downloadEventRegistrationCv(
                                  registration.id,
                                  registration.cvFileName,
                                )
                                  .then(() => toast.success("CV téléchargé"))
                                  .catch((error) =>
                                    toast.error(
                                      getErrorMessage(error, "Téléchargement impossible"),
                                    ),
                                  )
                              }
                            >
                              Télécharger le CV
                            </button>
                          ) : registration.cvFileName ? (
                            <span className="mt-1 block text-xs text-muted-foreground">
                              CV reçu, stockage indisponible
                            </span>
                          ) : null}
                          {!registration.portfolioUrl && !registration.cvFileName ? (
                            <span className="text-muted-foreground">Aucun document</span>
                          ) : null}
                        </TableCell>
                        <TableCell>
                          <Badge variant={registration.paiementStatus ? "secondary" : "outline"}>
                            {registration.type === "visitor"
                              ? registration.paiementStatus
                                ? "Payé / invité"
                                : "En attente"
                              : "N/A"}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          {registration.qrCode ?? "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" aria-label="Supprimer">
                                <Trash2 className="size-4 text-muted-foreground" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Supprimer cette inscription ?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  L'inscription sera masquée du tableau. Les exports ne l'incluront
                                  plus.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => removeRegistration(registration.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Supprimer
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
          <SimplePagination
            page={registrationPage}
            pageCount={registrationPageCount}
            onChange={setRegistrationPage}
          />
        </>
      ) : null}
    </DashboardLayout>
  );
}
