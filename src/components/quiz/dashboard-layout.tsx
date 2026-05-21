import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, LogOut, ScrollText, ShieldCheck, Users } from "lucide-react";

import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/quiz/auth-context";
import { initials } from "@/lib/quiz/format";
import { cn } from "@/lib/utils";

type Item = { to: string; label: string; icon: React.ComponentType<{ className?: string }>; roles: Array<"candidate" | "juror" | "admin"> };

const ITEMS: Item[] = [
  { to: "/quiz", label: "Mon quiz", icon: ScrollText, roles: ["candidate"] },
  { to: "/admin", label: "Administration", icon: LayoutDashboard, roles: ["admin"] },
  { to: "/jury", label: "Évaluations", icon: ShieldCheck, roles: ["juror", "admin"] },
];

export function DashboardLayout({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle?: string }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const items = ITEMS.filter((i) => user && i.roles.includes(user.role));

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 md:flex-row md:px-8 md:py-10">
        <aside className="md:w-64 md:shrink-0">
          <div className="sticky top-6 rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)]">
            <Link to="/" className="flex items-center">
              <BrandMark />
            </Link>

            <div className="mt-5 rounded-xl border border-border/60 bg-surface-muted/60 p-3">
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
                    {user?.role === "candidate" ? "Candidat" : user?.role === "juror" ? "Juré" : "Administrateur"}
                  </p>
                </div>
              </div>
            </div>

            <nav className="mt-5 grid gap-1">
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

            <div className="mt-5 border-t border-border pt-4">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-muted-foreground"
                onClick={() => {
                  logout();
                  navigate({ to: "/login" });
                }}
              >
                <LogOut className="size-4" />
                Se déconnecter
              </Button>
            </div>
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          <header className="mb-6">
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              {title}
            </h1>
            {subtitle ? (
              <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>
            ) : null}
          </header>
          {children}
        </main>
      </div>
    </div>
  );
}