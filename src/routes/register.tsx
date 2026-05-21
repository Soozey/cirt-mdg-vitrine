import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";

import { AuthShell } from "@/components/quiz/auth-shell";
import { FloatingInput } from "@/components/quiz/floating-input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/lib/quiz/auth-context";
import { formatPhone } from "@/lib/quiz/format";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Compléter mon profil · Quiz Jobdating" },
      { name: "description", content: "Complétez votre profil pour accéder au quiz cybersécurité." },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const { user, completeProfile } = useAuth();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [profile, setProfile] = useState<"Étudiant" | "Professionnel" | "Chercheur" | "Indépendant">("Étudiant");
  const [linkedin, setLinkedin] = useState("");
  const [rgpd, setRgpd] = useState(false);
  const [err, setErr] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate({ to: "/login" });
      return;
    }
    setFirstName(user.firstName ?? "");
    setLastName(user.lastName ?? "");
    setEmail(user.email ?? "");
    setPhone(user.phone ?? "");
    if (user.profile) setProfile(user.profile);
    setLinkedin(user.linkedin ?? "");
  }, [user, navigate]);

  function validate() {
    const e: Record<string, string> = {};
    if (!firstName.trim()) e.firstName = "Requis";
    if (!lastName.trim()) e.lastName = "Requis";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Email invalide";
    if (!phone.trim() || phone.replace(/\D/g, "").length < 8) e.phone = "Téléphone invalide";
    if (!rgpd) e.rgpd = "Vous devez accepter les conditions";
    setErr(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 350));
    completeProfile({ firstName, lastName, email, phone, profile, linkedin });
    toast.success("Profil enregistré");
    navigate({ to: "/quiz" });
  }

  if (!user) return null;

  return (
    <AuthShell
      title="Complétez votre profil"
      subtitle="Pour accéder au Quiz Cybersécurité et au matching jobdating."
    >
      <div className="mb-5 flex items-center gap-3 rounded-xl border border-accent/40 bg-accent-soft/60 px-4 py-3">
        <CheckCircle2 className="size-4 shrink-0 text-primary" />
        <p className="text-xs text-primary-deep">
          Connecté via{" "}
          <span className="font-semibold capitalize">{user.provider}</span> ·{" "}
          {user.firstName} {user.lastName} · {user.email}
        </p>
      </div>

      <form onSubmit={onSubmit} className="grid gap-4">
        <div className="grid grid-cols-2 gap-3">
          <FloatingInput label="Prénom *" value={firstName} onChange={(e) => setFirstName(e.target.value)} error={err.firstName} />
          <FloatingInput label="Nom *" value={lastName} onChange={(e) => setLastName(e.target.value)} error={err.lastName} />
        </div>
        <FloatingInput type="email" label="Email *" value={email} onChange={(e) => setEmail(e.target.value)} error={err.email} />
        <FloatingInput
          label="Téléphone *"
          value={phone}
          onChange={(e) => setPhone(formatPhone(e.target.value))}
          error={err.phone}
          hint="Utilisé uniquement pour les opportunités jobdating."
          placeholder="+261 34 12 345 67"
        />

        <div className="w-full">
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
            Profil professionnel *
          </label>
          <Select value={profile} onValueChange={(v) => setProfile(v as typeof profile)}>
            <SelectTrigger className="h-11">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Étudiant">Étudiant</SelectItem>
              <SelectItem value="Professionnel">Professionnel</SelectItem>
              <SelectItem value="Chercheur">Chercheur</SelectItem>
              <SelectItem value="Indépendant">Indépendant</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <FloatingInput
          label="LinkedIn (optionnel)"
          value={linkedin}
          onChange={(e) => setLinkedin(e.target.value)}
          placeholder="linkedin.com/in/votre-profil"
        />

        <label className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-border bg-surface-muted/40 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
          <input
            type="checkbox"
            checked={rgpd}
            onChange={(e) => setRgpd(e.target.checked)}
            className="mt-0.5 size-4 accent-[var(--primary)]"
          />
          <span>
            J'accepte que mes données soient utilisées pour le matching avec des
            recruteurs partenaires du CIRT.{" "}
            <a href="#" className="font-medium text-primary underline-offset-2 hover:underline">
              Lire la politique RGPD
            </a>
          </span>
        </label>
        {err.rgpd ? <p className="-mt-2 text-xs text-destructive">{err.rgpd}</p> : null}

        <Button type="submit" size="lg" disabled={submitting} className="mt-1">
          {submitting ? "Enregistrement…" : "Continuer vers le quiz →"}
        </Button>
      </form>
    </AuthShell>
  );
}