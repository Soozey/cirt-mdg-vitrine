import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

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
import { useAuth } from "@/lib/quiz/auth-context";

const TEST_ACCOUNTS = [
  { id: "candidate", label: "Candidat — accès quiz", email: "candidate@test.io", password: "candidate123" },
  { id: "jury", label: "Jury — espace évaluation", email: "jury@test.io", password: "jury123" },
  { id: "admin", label: "Administrateur — pilotage", email: "admin@test.io", password: "admin123" },
  { id: "new", label: "Nouveau profil OAuth", email: "new@test.io", password: "new12345" },
];

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Connexion · Quiz Jobdating Cybersécurité" },
      { name: "description", content: "Accédez au Quiz Jobdating Cybersécurité du CIRT Madagascar." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { loginWithEmail } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<{ email?: string; password?: string; root?: string }>({});

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
      navigate({
        to: u.role === "admin" ? "/admin" : u.role === "juror" ? "/jury" : u.registered ? "/quiz" : "/register",
      });
    } catch (e: any) {
      setErr({ root: e.message ?? "Connexion impossible" });
    } finally {
      setLoading(false);
    }
  }

  async function pickTestAccount(id: string) {
    const acc = TEST_ACCOUNTS.find((a) => a.id === id);
    if (!acc) return;
    setEmail(acc.email);
    setPassword(acc.password);
    await doLogin(acc.email, acc.password);
  }

  return (
    <AuthShell
      title="Sign In"
      subtitle="Connectez-vous pour accéder au quiz cybersécurité."
    >
      <div className="mb-3 rounded-lg border border-primary/15 bg-primary/[0.04] p-2">
        <label className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-primary">
          Comptes de démonstration
        </label>
        <Select onValueChange={pickTestAccount} disabled={loading}>
          <SelectTrigger className="h-8 border-slate-200 bg-white text-xs text-slate-700">
            <SelectValue placeholder="Choisir un profil…" />
          </SelectTrigger>
          <SelectContent>
            {TEST_ACCOUNTS.map((a) => (
              <SelectItem key={a.id} value={a.id} className="text-xs">
                {a.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <form onSubmit={onSubmit} className="grid gap-3">
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

        <div className="mt-1 flex items-center gap-2">
          <Button
            type="submit"
            disabled={loading}
            className="h-9 flex-1 rounded-full bg-primary text-sm font-semibold text-primary-foreground shadow-md shadow-primary/30 hover:bg-primary/90"
          >
            {loading ? "Connexion…" : "Sign In"}
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-9 flex-1 rounded-full border-2 border-primary/40 bg-transparent text-sm font-semibold text-primary hover:bg-primary/5 hover:text-primary"
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
