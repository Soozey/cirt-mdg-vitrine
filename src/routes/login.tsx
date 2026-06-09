import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { AuthModeSwitch } from "@/components/quiz/auth-mode-switch";
import { AuthShell } from "@/components/quiz/auth-shell";
import { OAuthButtons } from "@/components/quiz/oauth-buttons";
import { redirectForRole } from "@/lib/access-control";
import { useAuth } from "@/lib/quiz/auth-context";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Connexion · Quiz Cybersécurité" },
      { name: "description", content: "Accédez au Quiz Cybersécurité du CIRT Madagascar." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    navigate({ to: redirectForRole(user.role, user.registered) });
  }, [navigate, user]);

  return (
    <AuthShell title="Se connecter" subtitle="Accédez au quiz avec votre compte Google.">
      <AuthModeSwitch mode="login" />
      <div className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <OAuthButtons mode="login" />
        <p className="text-center text-xs leading-relaxed text-slate-500">
          Seule la connexion Google est disponible pour le parcours quiz.
        </p>
      </div>
    </AuthShell>
  );
}
