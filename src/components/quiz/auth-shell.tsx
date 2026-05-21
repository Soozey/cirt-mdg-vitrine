import { Link } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";

export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(60% 50% at 50% 0%, color-mix(in oklch, var(--primary) 18%, transparent), transparent), radial-gradient(50% 40% at 100% 100%, color-mix(in oklch, var(--accent) 25%, transparent), transparent)",
        }}
      />
      <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-4 py-12">
        <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
          <ShieldCheck className="size-4 text-primary" />
          CIRT · Quiz Jobdating
        </Link>
        <div className="w-full rounded-2xl border border-border bg-card/90 p-7 shadow-[var(--shadow-card)] backdrop-blur-xl">
          <div className="mb-6 text-center">
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">{title}</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}