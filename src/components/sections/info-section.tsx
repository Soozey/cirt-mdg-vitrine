import { Link } from "@tanstack/react-router";
import { ArrowRight, ExternalLink } from "lucide-react";

import { INFO_PAGES } from "@/lib/event-data";
import { Card } from "@/components/ui/card";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";

export function InfoSection() {
  return (
    <section id="informations" className="bg-surface-muted">
      <div className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-24">
        <Reveal className="mb-12 max-w-2xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">
            En un coup d'œil
          </p>
          <h2 className="text-3xl font-bold text-primary-deep md:text-4xl">
            Informations essentielles
          </h2>
        </Reveal>

        <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
          {INFO_PAGES.map((item) => (
            <RevealItem key={item.slug}>
            <Link
              to="/informations/$slug"
              params={{ slug: item.slug }}
              className="group block"
            >
              <Card className="h-full border-border/60 p-6 transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-[var(--shadow-card)]">
                <div className="mb-4 h-1 w-10 rounded-full bg-accent" />
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                  {item.kicker}
                </p>
                <h3 className="mb-2 font-display text-xl font-semibold text-primary-deep">
                  {item.title}
                </h3>
                <p className="mb-6 text-sm text-muted-foreground line-clamp-2">{item.summary}</p>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  {item.externalPending ? (
                    <>
                      Lien externe à venir <ExternalLink className="size-3.5" />
                    </>
                  ) : (
                    <>
                      Voir la page{" "}
                      <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                    </>
                  )}
                </span>
              </Card>
            </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}