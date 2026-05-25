import { ArrowRight, CalendarDays, MapPin } from "lucide-react";

import { Countdown } from "@/components/countdown";
import { Button } from "@/components/ui/button";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import heroBg from "@/assets/project-section.png";

export function HeroSection() {
  return (
    <section
      id="accueil"
      className="relative isolate overflow-hidden bg-deep text-primary-foreground"
    >
      {/* Desktop background image */}
      <img
        src={heroBg}
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 hidden h-full w-full object-cover opacity-90 md:block"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 hidden md:block"
        style={{
          background:
            "linear-gradient(90deg, oklch(0.15 0.12 295 / 0.92) 0%, oklch(0.15 0.12 295 / 0.55) 45%, oklch(0.15 0.12 295 / 0.25) 100%)",
        }}
      />
      {/* Aurore iridescente (mobile fallback) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-70 bg-iris animate-iris mix-blend-screen md:hidden"
        style={{ maskImage: "radial-gradient(ellipse at 0% 0%, black 0%, transparent 60%)" }}
      />
      {/* Grain léger */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "3px 3px",
        }}
      />

      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 md:grid-cols-[1.3fr_1fr] md:items-center md:gap-12 md:px-8 md:py-28 lg:py-12">
        <RevealGroup className="space-y-7" stagger={0.1}>
          <RevealItem>
            <h1 className="font-display text-[2.6rem] font-bold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl xl:text-[5.5rem]">
              <span className="block text-primary-foreground/80 text-base font-medium uppercase tracking-[0.3em] mb-3">
                Sommet de la
              </span>
              <span className="block text-iris animate-iris bg-iris">CYBER</span>
              <span className="block text-iris animate-iris bg-iris">SÉCURITÉ</span>
              <span className="block text-primary-foreground/90 text-2xl sm:text-3xl mt-2 tracking-[0.2em]">
                MADAGASCAR
              </span>
            </h1>
          </RevealItem>

          <RevealItem>
            <p className="max-w-xl text-lg text-primary-foreground/75 sm:text-xl">
              <span className="text-iris-lime font-semibold">Confiance numérique</span>, votre gage de pérennité
            </p>
          </RevealItem>

          <RevealItem>
            <dl className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-primary-foreground/85">
              <div className="inline-flex items-center gap-2">
                <CalendarDays className="size-4 text-iris-lime" />
                <span className="tabular-nums">22 – 23 Juin 2026</span>
              </div>
              <div className="inline-flex items-center gap-2">
                <MapPin className="size-4 text-iris-cyan" />
                <span>Novotel, Alarobia</span>
              </div>
            </dl>
          </RevealItem>

          <RevealItem className="flex flex-wrap gap-3 pt-2">
            <Button asChild size="lg" className="bg-iris-lime text-primary-deep hover:bg-iris-lime/90 shadow-[var(--shadow-iris)]">
              <a href="#contact">
                S'inscrire <ArrowRight className="ml-1" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
              <a href="#sponsor">Devenir sponsor</a>
            </Button>
          </RevealItem>
        </RevealGroup>

        <Reveal delay={0.2} className="relative md:justify-self-end md:w-full md:max-w-md">
          {/* Countdown card */}
          <div className="relative rounded-3xl border border-iris-violet/30 bg-primary-deep/40 p-5 backdrop-blur-md shadow-[var(--shadow-iris)]">
            <Countdown />
          </div>
        </Reveal>
      </div>
    </section>
  );
}