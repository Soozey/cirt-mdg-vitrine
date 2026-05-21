import { ArrowUpRight, Handshake, Mail, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CIRT_WEBSITE } from "@/lib/event-data";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";

const CARDS = [
  {
    id: "contact-inscription",
    icon: Mail,
    title: "Inscription",
    body: "Le parcours d'inscription sera publié dès validation par l'équipe d'organisation.",
    cta: "Consulter le CIRT",
    variant: "default" as const,
  },
  {
    id: "sponsor",
    icon: Handshake,
    title: "Sponsoring",
    body: "Les demandes de partenariat peuvent être orientées vers l'équipe d'organisation.",
    cta: "Devenir partenaire",
    variant: "secondary" as const,
  },
  {
    id: "programme",
    icon: FileText,
    title: "Programme",
    body: "Le programme détaillé sera ajouté lorsqu'un fichier officiel sera disponible.",
    cta: "Suivre le programme",
    variant: "outline" as const,
  },
];

export function ContactSection() {
  return (
    <section id="contact" className="bg-primary-deep text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 md:grid-cols-[1fr_2fr] md:gap-16 md:px-8 md:py-24">
        <Reveal className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">
            Restons en contact
          </p>
          <h2 className="text-3xl font-bold text-primary-foreground md:text-4xl">Contact</h2>
          <p className="max-w-md text-base text-primary-foreground/75">
            Pour toute demande d'information, de partenariat ou de sponsoring, contactez l'équipe
            d'organisation du sommet.
          </p>
        </Reveal>

        <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.1}>
          {CARDS.map(({ id, icon: Icon, title, body, cta, variant }) => (
            <RevealItem
              key={id}
              id={id}
              className="flex flex-col rounded-xl border border-primary-foreground/15 bg-primary-foreground/5 p-6 backdrop-blur"
            >
              <span className="mb-4 inline-flex size-10 items-center justify-center rounded-lg bg-accent text-primary-deep">
                <Icon className="size-5" />
              </span>
              <h3 className="mb-2 text-lg font-semibold text-primary-foreground">{title}</h3>
              <p className="mb-6 flex-1 text-sm text-primary-foreground/75">{body}</p>
              <Button asChild variant={variant} size="sm" className={variant === "outline" ? "border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground" : ""}>
                <a href={CIRT_WEBSITE} target="_blank" rel="noopener noreferrer">
                  {cta} <ArrowUpRight className="size-4" />
                </a>
              </Button>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}