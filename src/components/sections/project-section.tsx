import { Globe2, Lightbulb, ScanLine } from "lucide-react";
import { motion } from "framer-motion";

import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import casquette from "@/assets/casquette-pour-presentation.webp";

const presentationPillars = [
  {
    title: "Sensibiliser",
    description: "Entreprises & institutions aux enjeux cyber",
    icon: ScanLine,
  },
  {
    title: "Connecter",
    description: "Acteurs publics, privés & techniques",
    icon: Globe2,
  },
  {
    title: "Innover",
    description: "Solutions locales & internationales",
    icon: Lightbulb,
  },
];

export function ProjectSection() {
  return (
    <section id="projet" className="relative overflow-hidden bg-white">
      <div className="mx-auto max-w-7xl px-4 py-15 md:px-8 md:py-24">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)] lg:items-center lg:gap-16">
          {/* Texte gauche : animation droite vers gauche */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col"
          >
            {/* Bloc texte */}
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-iris-violet">
                Le projet
              </p>
              <h2 className="font-display text-3xl font-bold text-primary-deep md:text-5xl">
                Présentation
              </h2>
              <div className="mt-4 mb-8 h-1 w-16 bg-iris" />

              <RevealGroup className="space-y-8" stagger={0.12}>
                <RevealItem>
                  <h3 className="font-turret text-2xl font-bold uppercase text-iris sm:text-3xl md:text-4xl">
                    Une première nationale
                  </h3>
                  <p className="mt-4 max-w-3xl text-base leading-relaxed text-foreground/70 md:text-lg">
                    Plateforme de sensibilisation, d'innovation, de protection et de confiance
                    numérique à Madagascar.
                  </p>
                </RevealItem>

                <RevealItem className="grid gap-4 sm:grid-cols-3">
                  {presentationPillars.map(({ title, description, icon: Icon }) => (
                    <article
                      key={title}
                      className="relative min-h-44 border border-border bg-white p-5 shadow-[0_18px_45px_-28px_oklch(0.22_0.14_285_/_0.35)]"
                    >
                      <span
                        aria-hidden
                        className="absolute right-0 top-0 h-0 w-0 border-l-[22px] border-t-[22px] border-l-transparent border-t-iris-lime"
                      />
                      <Icon className="size-9 text-iris-cyan" strokeWidth={2.3} />
                      <h4 className="mt-6 font-turret text-xl font-bold uppercase text-primary-deep md:text-2xl">
                        {title}
                      </h4>
                      <p className="mt-4 text-sm leading-relaxed text-foreground/65 md:text-base">
                        {description}
                      </p>
                    </article>
                  ))}
                </RevealItem>

                <RevealItem className="grid gap-6 text-sm leading-relaxed text-foreground/75 md:grid-cols-2 md:text-base">
                  <p>
                    À l'ère de la transformation numérique accélérée, Madagascar fait face à des
                    enjeux croissants en matière de cybersécurité. Protection des données,
                    résilience des infrastructures critiques, lutte contre la cybercriminalité : ces
                    défis sont devenus des priorités nationales.
                  </p>
                  <p>
                    Ce Sommet est la première plateforme stratégique dédiée à y répondre
                    collectivement.
                  </p>
                </RevealItem>
              </RevealGroup>
            </div>

            {/* Bloc image */}
            <div className="mt-8 flex justify-center lg:hidden">
              <img
                src={casquette}
                alt="Illustration du projet"
                className="w-full max-w-xs object-cover rounded-lg sm:max-w-sm"
              />
            </div>
          </motion.div>

          {/* Image casquette droite : animation gauche vers droite, desktop only */}
          <motion.div
            className="relative hidden lg:block"
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
