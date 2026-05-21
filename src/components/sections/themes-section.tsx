import { Gavel, Activity, ShieldCheck, GraduationCap, Globe2 } from "lucide-react";

import { THEMES } from "@/lib/event-data";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";

const ICONS = [Gavel, Activity, ShieldCheck, GraduationCap, Globe2];

export function ThemesSection() {
  return (
    <section id="themes" className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-24">
      <Reveal className="mb-12 max-w-2xl">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">
          Programme
        </p>
        <h2 className="text-3xl font-bold text-primary-deep md:text-4xl">Axes thématiques</h2>
        <p className="mt-3 text-base text-muted-foreground">
          Cinq axes complémentaires pour couvrir l'ensemble du cycle de la confiance numérique.
        </p>
      </Reveal>

      <RevealGroup className="grid gap-3 md:grid-cols-2 lg:grid-cols-5" stagger={0.08}>
        {THEMES.map((theme, i) => {
          const Icon = ICONS[i];
          return (
            <RevealItem
              key={theme.label}
              className="group relative flex flex-col gap-3 rounded-xl border border-border/60 bg-card p-5 transition-colors hover:border-primary/30"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex size-10 items-center justify-center rounded-lg bg-accent-soft text-primary-deep">
                  <Icon className="size-5" />
                </span>
                <span className="font-display text-sm font-bold text-muted-foreground">
                  0{i + 1}
                </span>
              </div>
              <div>
                <h3 className="text-base font-semibold text-primary-deep">{theme.label}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{theme.hint}</p>
              </div>
            </RevealItem>
          );
        })}
      </RevealGroup>
    </section>
  );
}