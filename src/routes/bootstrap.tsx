import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";

import { AuthShell } from "@/components/quiz/auth-shell";
import { FloatingInput } from "@/components/quiz/floating-input";
import { Button } from "@/components/ui/button";
import { createSuperadmin, getBootstrapStatus } from "@/lib/firebase/server-api";
import { useAuth } from "@/lib/quiz/auth-context";
import { getErrorMessage } from "@/lib/utils";

export const Route = createFileRoute("/bootstrap")({
  head: () => ({ meta: [{ title: "Bootstrap superadmin · CIRT" }] }),
  component: BootstrapPage,
});

function BootstrapPage() {
  const { bootstrapWithGoogle, loginWithEmail } = useAuth();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    getBootstrapStatus()
      .then((status) => {
        if (status.configured) navigate({ to: "/" });
      })
      .finally(() => setChecking(false));
  }, [navigate]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (!firstName.trim()) next.firstName = "Requis";
    if (!lastName.trim()) next.lastName = "Requis";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Email invalide";
    if (password.length < 8) next.password = "8 caractères minimum";
    setErr(next);
    if (Object.keys(next).length) return;

    setSubmitting(true);
    try {
      await createSuperadmin({ firstName, lastName, email, password });
      await loginWithEmail(email, password);
      toast.success("Superadministrateur créé");
      navigate({ to: "/superadmin" });
    } catch (error) {
      setErr({ root: getErrorMessage(error, "Configuration impossible") });
    } finally {
      setSubmitting(false);
    }
  }

  async function submitWithGoogle() {
    setErr({});
    setGoogleSubmitting(true);
    try {
      await bootstrapWithGoogle();
      toast.success("Superadministrateur créé via Google");
      navigate({ to: "/superadmin" });
    } catch (error) {
      setErr({ root: getErrorMessage(error, "Configuration Google impossible") });
    } finally {
      setGoogleSubmitting(false);
    }
  }

  return (
    <AuthShell
      title="Initialisation"
      subtitle="Créez le premier compte superadministrateur de la plateforme."
    >
      <form onSubmit={submit} className="grid gap-3">
        {checking ? (
          <p className="rounded-md bg-primary/[0.04] px-2 py-1.5 text-[11px] font-medium text-primary">
            Vérification de l'état de configuration...
          </p>
        ) : null}
        <div className="grid grid-cols-2 gap-3">
          <FloatingInput
            label="Prénom"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            error={err.firstName}
          />
          <FloatingInput
            label="Nom"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            error={err.lastName}
          />
        </div>
        <FloatingInput
          type="email"
          label="Email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={err.email}
        />
        <FloatingInput
          type="password"
          label="Mot de passe"
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={err.password}
        />
        {err.root ? (
          <p className="rounded-md bg-destructive/10 px-2 py-1.5 text-[11px] font-medium text-destructive">
            {err.root}
          </p>
        ) : null}
        <Button
          type="button"
          variant="outline"
          disabled={checking || submitting || googleSubmitting}
          onClick={submitWithGoogle}
          className="h-9 rounded-full bg-background text-sm font-semibold"
        >
          <GoogleIcon />
          {googleSubmitting ? "Configuration Google..." : "Initialiser avec Google"}
          {googleSubmitting ? (
            <span className="size-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : null}
        </Button>
        <div className="flex items-center gap-3 py-1">
          <span className="h-px flex-1 bg-border" />
          <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            ou
          </span>
          <span className="h-px flex-1 bg-border" />
        </div>
        <Button
          type="submit"
          disabled={checking || submitting || googleSubmitting}
          className="mt-1 h-9 rounded-full bg-primary text-sm font-semibold text-primary-foreground shadow-md shadow-primary/30 hover:bg-primary/90"
        >
          {submitting ? "Configuration..." : "Créer le superadmin"}
          <ArrowRight className="size-4" />
        </Button>
      </form>
    </AuthShell>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.2 1.3-1.6 3.9-5.5 3.9-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.5 14.6 2.5 12 2.5 6.7 2.5 2.5 6.7 2.5 12s4.2 9.5 9.5 9.5c5.5 0 9.1-3.9 9.1-9.3 0-.6-.1-1.1-.2-1.6L12 10.2z"
      />
    </svg>
  );
}
