import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { AuthShell } from "@/components/quiz/auth-shell";
import { FloatingInput } from "@/components/quiz/floating-input";
import { OAuthButtons } from "@/components/quiz/oauth-buttons";
import { Button } from "@/components/ui/button";
import { redirectForRole } from "@/lib/access-control";
import { useAuth } from "@/lib/quiz/auth-context";
import { getErrorMessage } from "@/lib/utils";

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
  const { loginWithEmail, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<{ email?: string; password?: string; root?: string }>({});

  useEffect(() => {
    if (!user) return;
    navigate({ to: redirectForRole(user.role, user.registered) });
  }, [navigate, user]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: typeof err = {};
    if (!email.trim()) next.email = "L'email est requis";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Email invalide";
    if (!password) next.password = "Le mot de passe est requis";
    setErr(next);
    if (Object.keys(next).length) return;
    await doLogin(email, password);
  }

  async function doLogin(em: string, pw: string) {
    setLoading(true);
    setErr({});
    try {
      const u = await loginWithEmail(em, pw);
      toast.success(`Bienvenue ${u.firstName}`);
      navigate({ to: redirectForRole(u.role, u.registered) });
    } catch (error) {
      setErr({ root: getErrorMessage(error, "Connexion impossible") });
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell title="Sign In" subtitle="Connectez-vous pour accéder au quiz cybersécurité.">
      <form onSubmit={onSubmit} className="grid gap-4">
        <FloatingInput
          type="email"
          label="E-mail Adress"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={err.email}
          placeholder="Enter your email"
        />
        <FloatingInput
          type="password"
          label="Password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={err.password}
          placeholder="Enter your password"
        />

        {err.root ? (
          <p className="rounded-md bg-destructive/10 px-2 py-1.5 text-[11px] font-medium text-destructive">
            {err.root}
          </p>
        ) : null}

        <div className="mt-1 grid gap-2 sm:grid-cols-2">
          <Button
            type="submit"
            disabled={loading}
            className="h-10 w-full rounded-full bg-primary text-sm font-semibold text-primary-foreground shadow-md shadow-primary/30 hover:bg-primary/90"
          >
            {loading ? "Connexion…" : "Sign In"}
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-10 w-full rounded-full border-2 border-primary/40 bg-transparent text-sm font-semibold text-primary hover:bg-primary/5 hover:text-primary"
          >
            <Link to="/register">Sign Up</Link>
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <span className="h-px flex-1 bg-slate-200" />
          <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
            ou
          </span>
          <span className="h-px flex-1 bg-slate-200" />
        </div>

        <OAuthButtons mode="login" />
      </form>
    </AuthShell>
  );
}
