import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

import { CIRT_WEBSITE } from "@/lib/event-data";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import casquette from "@/assets/casquette-pour-presentation.png";

export function ProjectSection() {
  return (
    <section id="projet" className="relative bg-background">
      <div className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-24">
      <div className="grid gap-10 md:grid-cols-2 md:items-center md:gap-16">
        {/* Texte (gauche) — animation droite → gauche */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-iris-violet">
            Le projet
          </p>
          <h2 className="font-display text-3xl font-bold text-primary-deep md:text-5xl">
            Présentation
          </h2>
          <div className="mt-4 mb-8 h-1 w-16 bg-iris" />

          <RevealGroup className="space-y-6" stagger={0.12}>
            <RevealItem className="text-lg leading-relaxed text-foreground/80">
              Le <strong className="text-primary-deep">Sommet de la Cybersécurité Madagascar</strong> est un événement dédié à la confiance numérique, à la sensibilisation cyber et au renforcement de la résilience numérique à Madagascar.
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
        </motion.div>

        {/* Image casquette (droite) — animation gauche → droite, desktop only */}
        <motion.div
          className="relative hidden md:block"
          initial={{ opacity: 0, x: -80 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            aria-hidden
            className="absolute -inset-6 -z-10 rounded-[3rem] opacity-60 blur-3xl"
            style={{
              background:
                "radial-gradient(ellipse at center, color-mix(in oklch, var(--iris-violet) 35%, transparent), transparent 70%)",
            }}
          />
          <img
            src={casquette}
            alt="Casquette officielle Sommet de la Cybersécurité Madagascar"
            className="mx-auto w-full max-w-lg drop-shadow-[0_30px_60px_oklch(0.22_0.14_285_/_0.35)]"
          />
        </motion.div>
      </div>
      </div>
    </section>
  );
}