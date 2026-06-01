import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Mail,
  Building2,
  Cpu,
  Landmark,
  CheckCircle2,
  Users,
  Calendar,
  MapPin,
  Sparkles,
} from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import infoBg from "@/assets/info-section.webp";

export const Route = createFileRoute("/partenaires")({
  head: () => ({
    meta: [
      { title: "Devenir partenaire, Sommet Cybersécurité Madagascar 2026" },
      {
        name: "description",
        content:
          "Dossier de partenariat du Sommet de la Cybersécurité Madagascar, les 22 et 23 juin 2026 au Novotel Convention & Spa, Antananarivo.",
      },
      { property: "og:title", content: "Devenir partenaire, Sommet Cybersécurité Madagascar 2026" },
      {
        property: "og:description",
        content:
          "Packages de partenariat, profils ciblés et opportunités de visibilité pour la 1ère édition du Sommet.",
      },
    ],
  }),
  component: PartenairesPage,
});

const PROFILS = [
  {
    icon: Building2,
    title: "Grands comptes & OIV",
    intro: "Banques, télécoms, assurances, énergie, transport, industrie.",
    points: [
      "Infrastructures critiques à protéger",
      "Forte exposition réputationnelle",
      "Recherche de talents qualifiés",
    ],
  },
  {
    icon: Cpu,
    title: "Éditeurs & intégrateurs cyber",
    intro: "Fournisseurs de solutions, SOC, ESN, startups & cabinets spécialisés.",
    points: [
      "Démonstration en conditions réelles",
      "Génération de leads B2B",
      "Positionnement d'expert",
    ],
  },
  {
    icon: Landmark,
    title: "Institutions & partenaires publics",
    intro: "Ministères, agences stratégiques, bailleurs, universités & centres de formation.",
    points: [
      "Mission de souveraineté numérique",
      "Rôle de sensibilisation",
      "Vivier de talents à valoriser",
    ],
  },
];

const PACKAGES = [
  {
    name: "Sponsor Officiel & Gold",
    price: "80 000 000 Ar",
    highlighted: true,
    inclusions: [
      "Visibilité maximale",
      "Prise de parole plénière / atelier",
      "Conférence de presse",
      "PAD",
      "Espace Partenaire",
      "100 invitations",
    ],
  },
  {
    name: "Partenaire",
    price: "50 000 000 Ar",
    inclusions: [
      "Logo sur tous supports",
      "Pose visuels",
      "Prise de parole atelier",
      "50 invitations",
    ],
  },
  {
    name: "Conférence / Masterclass",
    price: "1 000 000 Ar",
    inclusions: [
      "Animation d'un atelier ou masterclass",
      "Visibilité programme",
      "Accès réseau spécialisé",
      "25 invitations",
    ],
  },
  {
    name: "Billet Visiteur",
    price: "Sur invitation uniquement",
    inclusions: ["Accès participant avec distribution gérée par l'organisation"],
  },
];

function PartenairesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 pt-16 md:pt-20">
        {/* Back bar */}
        <div className="bg-nav-deep">
          <div className="mx-auto max-w-7xl px-4 pt-6 pb-2 md:px-8">
            <Link
              to="/"
              hash="contact"
              className="inline-flex items-center gap-1 text-sm font-semibold text-iris-lime transition-colors hover:text-iris-cyan"
            >
              <ArrowLeft className="size-4" /> Retour à l'accueil
            </Link>
          </div>
        </div>

        {/* Hero */}
        <section className="relative isolate overflow-hidden bg-nav-deep text-nav-deep-foreground">
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
                "linear-gradient(180deg, oklch(0.20 0.14 295 / 0.55) 0%, oklch(0.22 0.16 290 / 0.75) 100%)",
            }}
          />
          <div className="mx-auto max-w-5xl px-4 py-14 md:px-8 md:py-20">
            <Reveal>
              <Badge className="border-iris-cyan/30 bg-iris-cyan/10 text-iris-cyan hover:bg-iris-cyan/15">
                1ère édition · 2026
              </Badge>
              <h1 className="mt-5 font-display text-3xl font-bold leading-tight md:text-5xl">
                Devenir partenaire du Sommet de la Cybersécurité Madagascar
              </h1>
              <p className="mt-4 max-w-2xl text-base text-nav-deep-foreground/80 md:text-lg">
                Plateforme nationale de sensibilisation, d'innovation, de protection et de
                confiance numérique. Associez votre marque à la 1ère édition d'un événement
                stratégique pour Madagascar.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-4 text-xs text-nav-deep-foreground/75">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="size-3.5" /> 22 & 23 juin 2026
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="size-3.5" /> Novotel Convention & Spa, Antananarivo
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Users className="size-3.5" /> 500+ participants qualifiés
                </span>
              </div>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button asChild size="lg" className="bg-iris-cyan text-nav-deep hover:bg-iris-cyan/90">
                  <a href="mailto:contact@cybersecurite-madagascar.mg?subject=Demande%20de%20partenariat%20-%20Sommet%20Cybers%C3%A9curit%C3%A9%20MDG%202026">
                    <Mail className="size-4" /> Contacter l'organisation
                  </a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/20 bg-white/5 text-nav-deep-foreground hover:bg-white/10"
                >
                  <a href="#packages">Voir les packages</a>
                </Button>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Pourquoi */}
        <section className="bg-background">
          <div className="mx-auto max-w-6xl px-4 py-14 md:px-8 md:py-20">
            <Reveal className="mb-10 max-w-3xl">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-iris-violet">
                Une première nationale
              </p>
              <h2 className="font-display text-2xl font-bold text-primary-deep md:text-4xl">
                Sensibiliser, connecter, innover
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-foreground/75 md:text-base">
                À l'ère de la transformation numérique accélérée, Madagascar fait face à des
                enjeux croissants en matière de cybersécurité. Protection des données,
                résilience des infrastructures critiques, lutte contre la cybercriminalité :
                ces défis sont devenus des priorités nationales. Ce Sommet est la première
                plateforme stratégique dédiée à y répondre collectivement.
              </p>
              <div className="mt-4 h-1 w-12 rounded-full bg-iris" />
            </Reveal>

            <div className="grid gap-5 md:grid-cols-3">
              {[
                { t: "Sensibiliser", d: "Entreprises & institutions aux enjeux cyber." },
                { t: "Connecter", d: "Acteurs publics, privés & techniques." },
                { t: "Innover", d: "Solutions locales & internationales." },
              ].map((c) => (
                <Card key={c.t} className="border-border/60 p-6">
                  <Sparkles className="size-5 text-iris-violet" />
                  <h3 className="mt-3 font-display text-base font-semibold text-primary-deep">
                    {c.t}
                  </h3>
                  <p className="mt-2 text-sm text-foreground/75">{c.d}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Profils ciblés */}
        <section className="bg-surface-muted/50">
          <div className="mx-auto max-w-6xl px-4 py-14 md:px-8 md:py-20">
            <Reveal className="mb-10 max-w-3xl">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-iris-violet">
                Profils ciblés
              </p>
              <h2 className="font-display text-2xl font-bold text-primary-deep md:text-4xl">
                Partenaires & sponsors recherchés
              </h2>
              <p className="mt-3 text-sm text-foreground/75 md:text-base">
                Au-delà du public attendu, le Sommet cible des organisations dont le
                positionnement, les enjeux et la stratégie de croissance s'alignent avec la
                cybersécurité.
              </p>
              <div className="mt-4 h-1 w-12 rounded-full bg-iris" />
            </Reveal>
            <RevealGroup className="grid gap-5 md:grid-cols-3">
              {PROFILS.map(({ icon: Icon, title, intro, points }) => (
                <RevealItem key={title}>
                  <Card className="h-full border-border/60 p-6">
                    <Icon className="size-6 text-iris-violet" />
                    <h3 className="mt-3 font-display text-lg font-semibold text-primary-deep">
                      {title}
                    </h3>
                    <p className="mt-2 text-sm italic text-foreground/70">{intro}</p>
                    <ul className="mt-4 space-y-2 text-sm text-foreground/80">
                      {points.map((p) => (
                        <li key={p} className="flex gap-2">
                          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-iris-violet" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>

        {/* Packages */}
        <section id="packages" className="bg-background">
          <div className="mx-auto max-w-6xl px-4 py-14 md:px-8 md:py-20">
            <Reveal className="mb-10 max-w-3xl">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-iris-violet">
                Packages de partenariat
              </p>
              <h2 className="font-display text-2xl font-bold text-primary-deep md:text-4xl">
                Choisissez votre niveau d'engagement
              </h2>
              <p className="mt-3 text-xs text-foreground/60">
                * Tarifs pouvant être adaptés sous forme d'échange de service ou en nature.
              </p>
              <div className="mt-4 h-1 w-12 rounded-full bg-iris" />
            </Reveal>

            {/* Cards */}
            <RevealGroup className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {PACKAGES.map((p) => (
                <RevealItem key={p.name}>
                  <Card
                    className={
                      "flex h-full flex-col border-border/60 p-6 " +
                      (p.highlighted
                        ? "border-iris-violet/60 bg-iris-violet/[0.04] shadow-[0_20px_60px_-20px_oklch(0.62_0.22_295_/_0.35)]"
                        : "")
                    }
                  >
                    {p.highlighted ? (
                      <Badge className="mb-3 w-fit border-iris-lime/40 bg-iris-lime/15 text-iris-violet hover:bg-iris-lime/20">
                        Recommandé
                      </Badge>
                    ) : null}
                    <h3 className="font-display text-lg font-semibold text-primary-deep">
                      {p.name}
                    </h3>
                    <p className="mt-2 font-display text-2xl font-bold text-iris-violet">
                      {p.price}
                    </p>
                    <ul className="mt-5 flex-1 space-y-2 text-sm text-foreground/80">
                      {p.inclusions.map((inc) => (
                        <li key={inc} className="flex gap-2">
                          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-iris-violet" />
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>
                    <Button asChild className="mt-6" variant={p.highlighted ? "default" : "outline"}>
                      <a
                        href={`mailto:contact@cybersecurite-madagascar.mg?subject=Partenariat%20-%20${encodeURIComponent(p.name)}`}
                      >
                        <Mail className="size-4" /> Demander ce package
                      </a>
                    </Button>
                  </Card>
                </RevealItem>
              ))}
            </RevealGroup>

            {/* Recap table */}
            
          </div>
        </section>

        {/* CTA */}
        <section className="bg-nav-deep text-nav-deep-foreground">
          <div className="mx-auto max-w-4xl px-4 py-14 text-center md:px-8 md:py-20">
            <h2 className="font-display text-2xl font-bold md:text-4xl">
              Construisons ensemble la résilience numérique de Madagascar
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-nav-deep-foreground/75 md:text-base">
              Notre équipe revient vers vous pour finaliser un partenariat sur mesure.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="bg-iris-cyan text-nav-deep hover:bg-iris-cyan/90">
                <a href="mailto:contact@cybersecurite-madagascar.mg?subject=Demande%20de%20partenariat%20-%20Sommet%20Cybers%C3%A9curit%C3%A9%20MDG%202026">
                  <Mail className="size-4" /> contact@cybersecurite-madagascar.mg
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/20 bg-white/5 text-nav-deep-foreground hover:bg-white/10"
              >
                <Link to="/" hash="informations">Voir le programme</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
