import { Link } from "@tanstack/react-router";
import { ArrowRight, ExternalLink } from "lucide-react";

import { INFO_PAGES } from "@/lib/event-data";
import { Card } from "@/components/ui/card";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import infoBg from "@/assets/info-section.webp";

export function InfoSection() {
  return (
    <section id="informations" className="relative isolate overflow-hidden bg-nav-deep text-nav-deep-foreground">
      <img
        src={infoBg}
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 hidden h-full w-full object-cover opacity-60 md:block"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.18 0.14 295 / 0.45) 0%, oklch(0.22 0.16 290 / 0.55) 100%)",
        }}
      />
      <div className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-24">
        <Reveal className="mb-12 max-w-2xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-iris-cyan">
            En un coup d'œil
          </p>
          <h2 className="font-display text-3xl font-bold text-nav-deep-foreground md:text-5xl">
            Informations essentielles
          </h2>
          <div className="mt-4 h-1 w-16 bg-iris" />
        </Reveal>

        <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.08} amount={0.05}>
          {INFO_PAGES.map((item) => (
            <RevealItem key={item.slug}>
            <Link
              to="/informations/$slug"
              params={{ slug: item.slug }}
              className="group block"
            >
              <Card className="h-full overflow-hidden border-white/10 bg-white/[0.04] p-6 text-nav-deep-foreground backdrop-blur-md transition-[transform,border-color,background-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-iris-cyan/40 hover:bg-white/[0.08] hover:shadow-[0_20px_60px_-20px_oklch(0.62_0.22_295_/_0.45)]">
                <div className="mb-4 h-1 w-10 rounded-full bg-iris" />
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-iris-cyan/80">
                  {item.kicker}
                </p>
                <h3 className="mb-2 font-display text-xl font-semibold text-nav-deep-foreground">
                  {item.title}
                </h3>
                <p className="mb-6 text-sm text-nav-deep-foreground/70 line-clamp-2">{item.summary}</p>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-iris-lime">
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