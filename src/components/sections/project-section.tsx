import { ArrowUpRight } from "lucide-react";

import { CIRT_WEBSITE } from "@/lib/event-data";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";

export function ProjectSection() {
  return (
    <section id="projet" className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-24">
      <div className="grid gap-10 md:grid-cols-[1fr_1.5fr] md:gap-16">
        <Reveal>
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">
            Le projet
          </p>
          <h2 className="text-3xl font-bold text-primary-deep md:text-4xl">
            Présentation
          </h2>
        </Reveal>
        <RevealGroup className="space-y-6" stagger={0.12}>
          <RevealItem className="text-lg leading-relaxed text-foreground/80">
            Le <strong className="text-primary-deep">Sommet de la Cybersécurité Madagascar — 1ère édition 2026</strong> est un événement dédié à la confiance numérique, à la sensibilisation cyber et au renforcement de la résilience numérique à Madagascar.
          </RevealItem>
          <RevealItem className="text-base leading-relaxed text-muted-foreground">
            Rassemblement national qui réunit institutions, entreprises, experts et étudiants autour d'un enjeu commun : protéger les systèmes, les données et les usages numériques du pays.
          </RevealItem>
          <RevealItem>
          <a
            href={CIRT_WEBSITE}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary transition-colors hover:text-primary-deep"
          >
            Site officiel du CIRT MDG
            <ArrowUpRight className="size-4" />
          </a>
          </RevealItem>
        </RevealGroup>
      </div>
    </section>
  );
}