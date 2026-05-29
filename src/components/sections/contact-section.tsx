import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Handshake, Mail, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CIRT_WEBSITE } from "@/lib/event-data";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import contactBg from "@/assets/above-countdown.webp";

type ContactCard = {
  id: string;
  icon: typeof Mail;
  title: string;
  body: string;
  cta: string;
  variant: "default" | "secondary" | "outline";
  to?: string;
  href?: string;
};

const CARDS: ContactCard[] = [
  {
    id: "contact-inscription",
    icon: Mail,
    title: "Inscription",
    body: "Le parcours d'inscription sera publié dès validation par l'équipe d'organisation.",
    cta: "Consulter le CIRT",
    variant: "default",
    href: CIRT_WEBSITE,
  },
  {
    id: "sponsor",
    icon: Handshake,
    title: "Sponsoring",
    body: "Les demandes de partenariat peuvent être orientées vers l'équipe d'organisation.",
    cta: "Devenir partenaire",
    variant: "secondary",
    to: "/partenaires",
  },
  {
    id: "programme",
    icon: FileText,
    title: "Programme",
    body: "Le programme détaillé sera ajouté lorsqu'un fichier officiel sera disponible.",
    cta: "Suivre le programme",
    variant: "outline",
    href: CIRT_WEBSITE,
  },
];

export function ContactSection() {
  return (
    <section id="contact" className="relative isolate overflow-hidden bg-white text-primary-deep">
      <img
        src={contactBg}
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 h-full w-full object-cover opacity-60"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-white/58"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-80 opacity-25 bg-iris animate-iris"
        style={{ maskImage: "linear-gradient(0deg, black, transparent)" }}
      />
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 md:grid-cols-[1fr_2fr] md:gap-16 md:px-8 md:py-24">
        <Reveal className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-iris-violet drop-shadow-sm">
            Restons en contact
          </p>
          <h2 className="font-display text-3xl font-bold text-primary-deep md:text-5xl">
            Contact
          </h2>
          <div className="h-1 w-16 bg-iris" />
          <p className="max-w-md text-base font-medium text-primary-deep/80">
            Pour toute demande d'information, de partenariat ou de sponsoring, contactez l'équipe
            d'organisation du sommet.
          </p>
        </Reveal>

        <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.1}>
          {CARDS.map(({ id, icon: Icon, title, body, cta, variant, to, href }) => (
            <RevealItem
              key={id}
              id={id}
              className="flex flex-col rounded-2xl border border-border/60 bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-iris-violet/50 hover:shadow-md"
            >
              <span className="mb-4 inline-flex size-11 items-center justify-center rounded-xl bg-iris-violet/10 text-iris-violet">
                <Icon className="size-5" />
              </span>
              <h3 className="mb-2 text-lg font-semibold text-primary-deep">{title}</h3>
              <p className="mb-6 flex-1 text-sm text-foreground/70">{body}</p>
              <Button asChild variant={variant} size="sm">
                {to ? (
                  <Link to={to}>
                    {cta} <ArrowUpRight className="size-4" />
                  </Link>
                ) : (
                  <a href={href} target="_blank" rel="noopener noreferrer">
                    {cta} <ArrowUpRight className="size-4" />
                  </a>
                )}
              </Button>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
