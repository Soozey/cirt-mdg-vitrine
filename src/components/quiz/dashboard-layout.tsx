import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Crown, LayoutDashboard, LogOut, ScrollText, ShieldCheck, Trash2 } from "lucide-react";
import { toast } from "sonner";

import heroBanner from "@/assets/above-countdown.webp";
import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";
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
import { deleteCurrentUserAccount } from "@/lib/firebase/server-api";
import { useAuth } from "@/lib/quiz/auth-context";
import { initials } from "@/lib/quiz/format";
import { cn } from "@/lib/utils";

type Item = {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: Array<"candidate" | "juror" | "admin" | "superadmin">;
};

const ITEMS: Item[] = [
  { to: "/quiz", label: "Mon quiz", icon: ScrollText, roles: ["candidate"] },
  { to: "/superadmin", label: "Superadmin", icon: Crown, roles: ["superadmin"] },
  { to: "/admin", label: "Administration", icon: LayoutDashboard, roles: ["admin", "superadmin"] },
  { to: "/jury", label: "Évaluations", icon: ShieldCheck, roles: ["juror", "admin", "superadmin"] },
];

export function DashboardLayout({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const items = ITEMS.filter((i) => user && i.roles.includes(user.role));

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 md:flex-row md:px-8 md:py-10">
        <aside className="md:w-64 md:shrink-0">
          <div className="sticky top-6 overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)]">
            <Link
              to="/"
              className="flex items-center justify-center border-b border-border bg-primary from-primary/[0.08] via-iris-violet/[0.06] to-iris-cyan/[0.06] px-4 py-4"
            >
              <BrandMark variant="light" />
            </Link>

            <div className="px-4 pt-4">
              <div className="rounded-xl border border-border/60 bg-surface-muted/60 p-3">
                <div className="flex items-center gap-3">
                  <div
                    className="flex size-9 items-center justify-center rounded-full text-sm font-semibold text-white"
                    style={{ background: user?.avatarColor ?? "oklch(0.42 0.17 268)" }}
                  >
                    {initials(user?.firstName, user?.lastName)}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="truncate text-[11px] uppercase tracking-wider text-muted-foreground">
                      {user?.role === "candidate"
                        ? "Candidat"
                        : user?.role === "juror"
                          ? "Juré"
                          : user?.role === "admin"
                            ? "Administrateur"
                            : "Superadministrateur"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <nav className="mt-5 grid gap-1 px-4">
              {items.map((it) => {
                const Icon = it.icon;
                const active = pathname.startsWith(it.to);
                return (
                  <Link
                    key={it.to}
                    to={it.to}
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <Icon className="size-4" />
                    {it.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mx-4 mt-5 border-t border-border pb-4 pt-4">
              {user?.role === "candidate" ? (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mb-2 w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="size-4" />
                      Supprimer mon compte
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Supprimer votre compte ?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Cette action supprimera votre compte candidat et vos données de quiz. Elle
                        est définitive.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        onClick={async () => {
                          try {
                            await deleteCurrentUserAccount();
                            await logout();
                            navigate({ to: "/login" });
                          } catch (error) {
                            toast.error(
                              error instanceof Error
                                ? error.message
                                : "Suppression du compte impossible",
                            );
                          }
                        }}
                      >
                        Supprimer mon compte
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ) : null}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-muted-foreground"
                  >
                    <LogOut className="size-4" />
                    Se déconnecter
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirmer la déconnexion ?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Si un quiz est en cours, il sera annulé et le minuteur s'arrêtera.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={async () => {
                        await logout();
                        navigate({ to: "/login" });
                      }}
                    >
                      Se déconnecter
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          <motion.header
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="relative mb-6 overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]"
          >
            <div className="absolute inset-0">
              <img src={heroBanner} alt="" aria-hidden className="h-full w-full object-cover" />
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "linear-gradient(110deg, oklch(0.30 0.20 280 / 0.92) 0%, oklch(0.42 0.22 285 / 0.88) 55%, oklch(0.55 0.22 265 / 0.78) 100%)",
                }}
              />
            </div>
            <div className="relative px-6 py-7 md:px-8 md:py-9">
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/70">
                CIRT · Quiz Cybersécurité
              </p>
              <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-white md:text-3xl">
                {title}
              </h1>
              {subtitle ? (
                <p className="mt-1.5 max-w-2xl text-sm text-white/80">{subtitle}</p>
              ) : null}
            </div>
          </motion.header>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
