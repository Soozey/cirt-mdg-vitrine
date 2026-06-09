import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { AuthShell } from "@/components/quiz/auth-shell";
import { Button } from "@/components/ui/button";
import { getBootstrapStatus } from "@/lib/firebase/server-api";
import { useAuth } from "@/lib/quiz/auth-context";
import { getErrorMessage } from "@/lib/utils";

export const Route = createFileRoute("/bootstrap")({
  head: () => ({ meta: [{ title: "Bootstrap superadmin · CIRT" }] }),
  component: BootstrapPage,
});

function BootstrapPage() {
  const { bootstrapWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [err, setErr] = useState<Record<string, string>>({});
  const [googleSubmitting, setGoogleSubmitting] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    getBootstrapStatus()
      .then((status) => {
        if (status.configured) navigate({ to: "/" });
      })
      .finally(() => setChecking(false));
  }, [navigate]);

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
      subtitle="Créez le premier compte superadministrateur avec Google."
    >
      <div className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        {checking ? (
          <p className="rounded-md bg-primary/[0.04] px-2 py-1.5 text-[11px] font-medium text-primary">
            Vérification de l'état de configuration...
          </p>
        ) : null}
        {err.root ? (
          <p className="rounded-md bg-destructive/10 px-2 py-1.5 text-[11px] font-medium text-destructive">
            {err.root}
          </p>
        ) : null}
        <Button
          type="button"
          variant="outline"
          disabled={checking || googleSubmitting}
          onClick={submitWithGoogle}
          className="h-11 rounded-full bg-background text-sm font-semibold"
        >
          <GoogleIcon />
          {googleSubmitting ? "Configuration Google..." : "Initialiser avec Google"}
          {googleSubmitting ? (
            <span className="size-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : null}
        </Button>
      </div>
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
