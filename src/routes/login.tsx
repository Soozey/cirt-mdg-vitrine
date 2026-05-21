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

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Connexion · Quiz Jobdating Cybersécurité" },
      { name: "description", content: "Accédez au Quiz Jobdating Cybersécurité du CIRT Madagascar." },
    ],
  }),
  component: LoginPage,
});

const TEST_ACCOUNTS = [
  { role: "Candidat", email: "candidate@test.io", password: "candidate123" },
  { role: "Jury / Correcteur", email: "jury@test.io", password: "jury123" },
  { role: "Administrateur", email: "admin@test.io", password: "admin123" },
  { role: "Nouveau candidat (incomplet)", email: "new@test.io", password: "new12345" },
];

function LoginPage() {
  const { loginWithEmail } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedTestAccount, setSelectedTestAccount] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<{ email?: string; password?: string; root?: string }>({});

  async function handleLogin(currentEmail: string, currentPassword: string) {
    setLoading(true);
    setErr({});
    try {
      const u = await loginWithEmail(currentEmail, currentPassword);
      toast.success(`Bienvenue ${u.firstName}`);
      navigate({
        to:
          u.role === "admin"
            ? "/admin"
            : u.role === "juror"
            ? "/jury"
            : u.registered
            ? "/quiz"
            : "/register",
      });
    } catch (e: any) {
      setErr({ root: e.message ?? "Connexion impossible" });
    } finally {
      setLoading(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: typeof err = {};
    if (!email.trim()) next.email = "L'email est requis";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Email invalide";
    if (!password) next.password = "Le mot de passe est requis";
    setErr(next);
    if (Object.keys(next).length) return;

    await handleLogin(email, password);
  }

  return (
    <AuthShell title="Bon retour" subtitle="Connectez-vous pour accéder au quiz cybersécurité.">
      <form onSubmit={onSubmit} className="grid gap-4">
        <div className="w-full space-y-1.5">
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            Compte de test rapide
          </label>
          <Select
            value={selectedTestAccount}
            onValueChange={async (val) => {
              setSelectedTestAccount(val);
              const account = TEST_ACCOUNTS.find((acc) => acc.email === val);
              if (account) {
                setEmail(account.email);
                setPassword(account.password);
                toast.success(`Identifiants ${account.role} appliqués`);
                // 🚀 Connexion automatique après sélection
                await handleLogin(account.email, account.password);
              }
            }}
          >
            <SelectTrigger className="h-11 bg-muted/20 border-dashed border-muted-foreground/30 hover:border-primary/50 transition-colors">
              <SelectValue placeholder="Choisir un compte de test..." />
            </SelectTrigger>
            <SelectContent>
              {TEST_ACCOUNTS.map((acc) => (
                <SelectItem key={acc.email} value={acc.email} className="cursor-pointer">
                  <div className="flex flex-col items-start py-0.5">
                    <span className="font-semibold text-foreground text-sm">{acc.role}</span>
                    <span className="text-xs text-muted-foreground">{acc.email}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <FloatingInput
          type="email"
          label="Email"
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setSelectedTestAccount("");
          }}
          error={err.email}
        />
        <FloatingInput
          type="password"
          label="Mot de passe"
          autoComplete="current-password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setSelectedTestAccount("");
          }}
          error={err.password}
        />

        {err.root ? (
          <p className="rounded-md bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive">
            {err.root}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center gap-2">
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? "Connexion…" : "Se connecter"}
          </Button>
          <Button asChild variant="outline" className="flex-1">
            <Link to="/register">S'inscrire</Link>
          </Button>
        </div>

        <div className="my-2 flex items-center gap-3">
          <span className="h-px flex-1 bg-border" />
          <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            ou
          </span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <OAuthButtons mode="login" />
      </form>
    </AuthShell>
  );
}
