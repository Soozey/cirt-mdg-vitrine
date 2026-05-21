import { ArrowRight, CalendarDays, Download, MapPin } from "lucide-react";

import { Countdown } from "@/components/countdown";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";

export function HeroSection() {
  return (
    <section
      id="accueil"
      className="relative overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 15% 10%, color-mix(in oklch, var(--accent) 22%, transparent), transparent 45%), linear-gradient(180deg, var(--surface-muted), var(--background) 75%)",
      }}
    >
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-4 md:grid-cols-[1.4fr_1fr] md:items-center md:gap-16 md:px-8 md:py-24 lg:py-4">
        <RevealGroup className="space-y-6" stagger={0.1}>
          <RevealItem>
            <Badge variant="secondary" className="bg-accent-soft text-primary-deep border-transparent">
            1ère édition · 2026
            </Badge>
          </RevealItem>

          <RevealItem>
          <h1 className="font-display text-4xl font-bold leading-[1.05] text-primary-deep sm:text-5xl lg:text-6xl xl:text-7xl">
            Sommet de la Cybersécurité <span className="text-primary">Madagascar</span>
          </h1>
          </RevealItem>

          <RevealItem>
          <p className="max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Bâtir la confiance numérique pour un Madagascar cyber-résilient.
          </p>
          </RevealItem>

          <RevealItem>
          <dl className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-foreground">
            <div className="inline-flex items-center gap-2">
              <CalendarDays className="size-4 text-primary" />
              <span>23 – 24 mai 2026</span>
            </div>
            <div className="inline-flex items-center gap-2">
              <MapPin className="size-4 text-primary" />
              <span>Novotel Convention &amp; Spa, Antananarivo</span>
            </div>
          </dl>
          </RevealItem>

          <RevealItem className="flex flex-wrap gap-3 pt-2">
            <Button asChild size="lg">
              <a href="#contact">
                S'inscrire <ArrowRight className="ml-1" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="#sponsor">Devenir sponsor</a>
            </Button>
            <Button asChild size="lg" variant="ghost">
              <a href="#informations">
                <Download /> Programme
              </a>
            </Button>
          </RevealItem>
        </RevealGroup>

        <Reveal delay={0.25} className="md:justify-self-end md:w-full md:max-w-sm">
          <Countdown />
        </Reveal>
      </div>
    </section>
  );
}