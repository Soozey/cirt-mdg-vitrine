import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { AuthShell } from "@/components/quiz/auth-shell";
import { FloatingInput } from "@/components/quiz/floating-input";
import { OAuthButtons } from "@/components/quiz/oauth-buttons";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { redirectForRole } from "@/lib/access-control";
import { useAuth } from "@/lib/quiz/auth-context";
import { formatPhone } from "@/lib/quiz/format";
import { getErrorMessage } from "@/lib/utils";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Créer un compte · Quiz cybersécurité" },
      {
        name: "description",
        content: "Créez votre compte pour accéder au quiz cybersécurité du CIRT.",
      },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const { user, signUp, completeProfile } = useAuth();
  const navigate = useNavigate();

  // If a user is already logged in but not registered (OAuth flow), skip to step 2.
  const [step, setStep] = useState<1 | 2>(user && !user.registered ? 2 : 1);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);

  const [phone, setPhone] = useState("");
  const [profile, setProfile] = useState<
    "Étudiant" | "Professionnel" | "Chercheur" | "Indépendant"
  >("Étudiant");
  const [linkedin, setLinkedin] = useState("");

  const [err, setErr] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName ?? "");
      setLastName(user.lastName ?? "");
      setEmail(user.email ?? "");
      setPhone(user.phone ?? "");
      if (user.profile) setProfile(user.profile);
      setLinkedin(user.linkedin ?? "");
    }
  }, [user]);

  function validateStep1() {
    const e: Record<string, string> = {};
    if (!firstName.trim()) e.firstName = "Requis";
    if (!lastName.trim()) e.lastName = "Requis";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Email invalide";
    if (!user && password.length < 6) e.password = "6 caractères minimum";
    if (!agree) e.agree = "Vous devez accepter les conditions";
    setErr(e);
    return Object.keys(e).length === 0;
  }

  function validateStep2() {
    const e: Record<string, string> = {};
    if (!phone.trim() || phone.replace(/\D/g, "").length < 8) e.phone = "Téléphone invalide";
    setErr(e);
    return Object.keys(e).length === 0;
  }

  async function goNext() {
    if (!validateStep1()) return;
    setSubmitting(true);
    try {
      if (!user) {
        await signUp({ firstName, lastName, email, password });
      }
      setStep(2);
    } catch (error) {
      setErr({ root: getErrorMessage(error, "Inscription impossible") });
    } finally {
      setSubmitting(false);
    }
  }

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validateStep2()) return;
    setSubmitting(true);
    try {
      const nextUser = await completeProfile({
        firstName,
        lastName,
        email,
        phone,
        profile,
        linkedin,
      });
      toast.success("Profil enregistré — bienvenue !");
      navigate({ to: redirectForRole(nextUser?.role ?? "candidate", true) });
    } catch (error) {
      setErr({ root: getErrorMessage(error, "Enregistrement impossible") });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell
      title={step === 1 ? "Create your account" : "Complétez votre profil"}
      subtitle={
        step === 1
          ? "Étape 1 / 2 — Vos informations de base"
          : "Étape 2 / 2 — Informations complémentaires"
      }
    >
      {/* Stepper */}
      <div className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest">
        <span className={step >= 1 ? "text-primary" : "text-slate-400"}>1. Identité</span>
        <span className="h-px flex-1 bg-slate-200" />
        <span className={step >= 2 ? "text-primary" : "text-slate-400"}>2. Profil</span>
      </div>

      {step === 1 ? (
        <div className="grid gap-3">
          <div className="grid grid-cols-2 gap-3">
            <FloatingInput
              label="Prénom"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              error={err.firstName}
              placeholder="Jean"
            />
            <FloatingInput
              label="Nom"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              error={err.lastName}
              placeholder="Dupont"
            />
          </div>
          <FloatingInput
            type="email"
            label="E-mail Adress"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={err.email}
            disabled={!!user}
            placeholder="Enter your email"
          />
          {!user && (
            <FloatingInput
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={err.password}
              placeholder="Enter your password"
            />
          )}

          <label className="flex cursor-pointer items-start gap-2 text-[11px] leading-snug text-slate-600">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="mt-0.5 size-3.5 accent-[var(--primary)]"
            />
            <span>
              En m'inscrivant, j'accepte les{" "}
              <a href="#" className="font-semibold text-primary hover:underline">
                conditions générales d'utilisation
              </a>
            </span>
          </label>
          {err.agree ? <p className="-mt-2 text-[11px] text-destructive">{err.agree}</p> : null}
          {err.root ? (
            <p className="rounded-md bg-destructive/10 px-2 py-1.5 text-[11px] font-medium text-destructive">
              {err.root}
            </p>
          ) : null}

          <div className="mt-1 flex items-center gap-2">
            <Button
              type="button"
              onClick={goNext}
              disabled={submitting}
              className="h-9 flex-1 rounded-full bg-primary text-sm font-semibold text-primary-foreground shadow-md shadow-primary/30 hover:bg-primary/90"
            >
              {submitting ? "…" : "Sign Up"} <ArrowRight className="ml-1 size-4" />
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-9 flex-1 rounded-full border-2 border-primary/40 bg-transparent text-sm font-semibold text-primary hover:bg-primary/5 hover:text-primary"
            >
              <Link to="/login">Sign In</Link>
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <span className="h-px flex-1 bg-slate-200" />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
              ou
            </span>
            <span className="h-px flex-1 bg-slate-200" />
          </div>

          <OAuthButtons mode="register" />
        </div>
      ) : (
        <form onSubmit={onSubmit} className="grid gap-3">
          <FloatingInput
            label="Téléphone"
            value={phone}
            onChange={(e) => setPhone(formatPhone(e.target.value))}
            error={err.phone}
            placeholder="+261 34 12 345 67"
          />

          <div className="w-full">
            <label className="mb-0.5 block text-[12px] font-semibold text-slate-900">
              Profil professionnel
            </label>
            <Select value={profile} onValueChange={(v) => setProfile(v as typeof profile)}>
              <SelectTrigger className="h-9 border-slate-200 bg-white text-xs text-slate-700">
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

          {err.root ? (
            <p className="rounded-md bg-destructive/10 px-2 py-1.5 text-[11px] font-medium text-destructive">
              {err.root}
            </p>
          ) : null}

          <div className="mt-1 flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(1)}
              className="h-9 rounded-full border-2 border-slate-200 bg-transparent px-3 text-xs text-slate-600 hover:bg-slate-50"
            >
              <ArrowLeft className="size-4" /> Retour
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="h-9 flex-1 rounded-full bg-primary text-sm font-semibold text-primary-foreground shadow-md shadow-primary/30 hover:bg-primary/90"
            >
              {submitting ? "Enregistrement…" : "Continuer vers le quiz"}
            </Button>
          </div>
        </form>
      )}
    </AuthShell>
  );
}
