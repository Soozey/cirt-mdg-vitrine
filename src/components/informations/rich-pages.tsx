import { Link } from "@tanstack/react-router";
import {
  Trophy,
  Code2,
  Users,
  Calendar,
  MapPin,
  Cpu,
  Briefcase,
  Mic,
  Wrench,
  Building2,
  Coffee,
  CheckCircle2,
  Flag,
  ExternalLink,
  Mail,
  Laptop,
  Info,
  ArrowLeft,
  Gift,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { RegistrationDialog } from "@/components/registration/registration-dialog";
import { cn } from "@/lib/utils";
import detailHeroBg from "@/assets/info-section.webp";

/* ---------- Stand plan (exposition floor map) ---------- */

function StandPlan() {
  const stands = [
    { n: 1, x: 60, y: 120 },
    { n: 2, x: 60, y: 240 },
    { n: 3, x: 60, y: 360 },
    { n: 6, x: 540, y: 120 },
    { n: 7, x: 540, y: 240 },
    { n: 8, x: 540, y: 360 },
    { n: 4, x: 235, y: 310 },
    { n: 5, x: 365, y: 310 },
  ];

  return (
    <div
      className="overflow-hidden rounded-2xl border border-white/15 bg-[oklch(0.14_0.10_265)] 
                    p-4 md:p-6 max-w-full md:max-w-3xl lg:max-w-2xl mx-auto"
    >
      <svg
        viewBox="0 0 720 560"
        className="h-auto w-full md:w-[90%] lg:w-[95%]"
        role="img"
        aria-label="Plan des stands"
      >
        {/* room outline */}
        <rect
          x="30"
          y="30"
          width="660"
          height="430"
          rx="14"
          fill="oklch(0.18 0.12 265)"
          stroke="var(--iris-cyan)"
          strokeWidth="2"
        />

        {/* stage arc */}
        <path
          d="M 200 70 Q 360 30 520 70"
          fill="none"
          stroke="var(--iris-lime)"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* seats in arc */}
        {Array.from({ length: 5 }).map((_, r) =>
          Array.from({ length: 12 }).map((_, c) => {
            const angle = (c - 6) * 8; // angle de placement
            const radius = 120 + r * 22;
            const x = 360 + radius * Math.sin((angle * Math.PI) / 180);
            const y = 60 + radius * Math.cos((angle * Math.PI) / 180);
            return (
              <rect
                key={`s-${r}-${c}`}
                x={x}
                y={y}
                width="8"
                height="6"
                rx="2"
                fill="oklch(0.92 0.02 265)"
                opacity="0.85"
              />
            );
          }),
        )}

        {/* stands */}
        {stands.map((s) => (
          <g key={s.n}>
            <rect
              x={s.x}
              y={s.y}
              width="120"
              height="100"
              rx="8"
              fill="oklch(0.10 0.08 265)"
              stroke="var(--iris-cyan)"
              strokeWidth="1.5"
            />
            <text
              x={s.x + 60}
              y={s.y + 62}
              textAnchor="middle"
              fill="white"
              fontSize="36"
              fontWeight="700"
              fontFamily="var(--font-display)"
            >
              {s.n}
            </text>
          </g>
        ))}

        {/* entrance */}
        <rect
          x="320"
          y="470"
          width="80"
          height="50"
          rx="6"
          fill="var(--iris-magenta)"
          opacity="0.85"
        />
        <text x="360" y="545" textAnchor="middle" fill="white" fontSize="14" fontWeight="600">
          ↑ ENTRÉE
        </text>
      </svg>
    </div>
  );
}

/* ---------- Shared layout primitives ---------- */

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <Reveal className={cn("mb-10 max-w-3xl", align === "center" && "mx-auto text-center")}>
      {eyebrow ? (
        <p
          className="mb-2 text-[11px] uppercase tracking-[0.24em] text-iris-lime"
          style={{ fontFamily: "var(--font-barlow)" }}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2
        className="text-2xl uppercase leading-tight text-iris bg-iris animate-iris md:text-4xl"
        style={{ fontFamily: "var(--font-turret)", letterSpacing: "0.02em" }}
      >
        {title}
      </h2>
      {description ? (
        <p className="mt-3 text-sm leading-relaxed text-white/82 md:text-base">{description}</p>
      ) : null}
      <div className={cn("mt-4 h-1 w-12 rounded-full bg-iris", align === "center" && "mx-auto")} />
    </Reveal>
  );
}

export function ContentContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-4 py-14 md:px-8 md:py-20", className)}>
      {children}
    </div>
  );
}

function RichHero({
  badge,
  title,
  tagline,
  ctaLabel,
  ctaHref = "#contenu",
  meta = [],
}: {
  badge: string;
  title: string;
  tagline: string;
  ctaLabel: string;
  ctaHref?: string;
  meta?: { icon: React.ReactNode; label: string }[];
}) {
  return (
    <section className="relative isolate overflow-hidden bg-[#03164a] text-white">
      <img
        src={detailHeroBg}
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 h-full w-full object-cover opacity-35 mix-blend-screen"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-100"
        style={{
          background:
            "radial-gradient(circle at 88% 12%, rgba(214, 255, 87, 0.18), transparent 26%), radial-gradient(circle at 8% 82%, rgba(142, 60, 255, 0.22), transparent 30%), linear-gradient(180deg, rgba(3, 27, 89, 0.92) 0%, rgba(3, 20, 74, 0.94) 52%, rgba(2, 8, 45, 0.98) 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />
      <ContentContainer className="relative">
        <Reveal>
          <Link
            to="/"
            hash="informations"
            className="mb-6 mr-3 inline-flex items-center gap-1 rounded-md border border-iris-cyan/25 bg-[#03164a]/85 px-3 py-2 text-sm font-semibold text-iris-lime shadow-[0_14px_35px_-28px_rgba(34,211,238,0.75)] transition-colors hover:bg-[#041a5d] hover:text-iris-cyan"
          >
            <ArrowLeft className="size-4" /> Retour aux informations
          </Link>
          <Badge
            className="border-iris-cyan/35 bg-iris-cyan/10 text-iris-lime hover:bg-iris-cyan/15"
            style={{ fontFamily: "var(--font-barlow)" }}
          >
            {badge}
          </Badge>
          <h1
            className="mt-5 text-3xl uppercase leading-tight text-iris bg-iris animate-iris md:text-5xl"
            style={{ fontFamily: "var(--font-turret)", letterSpacing: "0.02em" }}
          >
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-base text-white/82 md:text-lg">{tagline}</p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Button
              asChild
              size="lg"
              className="bg-iris-lime text-primary-deep shadow-[0_14px_35px_-22px_rgba(214,255,87,0.85)] hover:bg-iris-lime/90"
            >
              <a href={ctaHref}>{ctaLabel}</a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-iris-cyan/35 bg-transparent text-white hover:bg-iris-cyan/10 hover:text-iris-lime"
            >
              <RegistrationDialog
                type="ctf-hackathon"
                label="S'inscrire"
                className="ml-0 mt-3 sm:ml-3 sm:mt-0"
              />
            </Button>
          </div>
          {meta.length ? (
            <div className="mt-8 flex flex-wrap gap-4 text-xs text-white/78">
              {meta.map((m, i) => (
                <span key={i} className="inline-flex items-center gap-1.5">
                  {m.icon}
                  {m.label}
                </span>
              ))}
            </div>
          ) : null}
        </Reveal>
      </ContentContainer>
    </section>
  );
}

/* ---------- CTF & HACKATHON ---------- */

function CtfHackathonPage() {
  const disciplines = [
    {
      icon: Flag,
      title: "Pentest",
      desc: "Scénarios d'intrusion encadrés sur périmètre autorisé.",
    },
    {
      icon: Cpu,
      title: "Forensique",
      desc: "Analyse d'artefacts, traces, dumps mémoire et trafic réseau.",
    },
    {
      icon: Code2,
      title: "IA",
      desc: "Cas d'usage offensifs et défensifs autour de l'intelligence artificielle.",
    },
    {
      icon: Laptop,
      title: "Dev sécurité",
      desc: "Développement, correction et durcissement de solutions sécurisées.",
    },
  ];

  return (
    <>
      <RichHero
        badge="Challenge · 22 juin 2026"
        title="CTF & HACKATHON"
        tagline="CTF (Capture The Flag) et Hackathon organisés le 22 juin pour étudiants et jeunes professionnels."
        ctaLabel="Voir les épreuves"
        ctaHref="#epreuves"
        meta={[
          { icon: <Calendar className="size-3.5" />, label: "22 juin 2026" },
          { icon: <MapPin className="size-3.5" />, label: "Novotel, Alarobia" },
          { icon: <Users className="size-3.5" />, label: "Étudiants & jeunes professionnels" },
        ]}
      />

      <section className="bg-background">
        <ContentContainer>
          <SectionHeader
            eyebrow="Synthèse"
            title="CTF (Capture The Flag) et Hackathon"
            description="Organisés le 22 juin pour étudiants et jeunes professionnels. Épreuves techniques en conditions réelles : pentest, forensique, IA, dev sécurité. Plateforme de détection et de valorisation des talents cyber du territoire."
          />
          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                icon: Flag,
                t: "CTF",
                d: "Résolution de challenges cyber pour tester les réflexes techniques et l'analyse en conditions réelles.",
              },
              {
                icon: Code2,
                t: "Hackathon",
                d: "Conception de solutions concrètes autour de la défense, de la résilience et du développement sécurisé.",
              },
              {
                icon: Gift, // tu peux utiliser l’icône "Gift" de lucide-react
                t: "Goodies pour participants",
                d: "Distribution de cadeaux et goodies offerts aux participants par les deux partenaires sollicités.",
              },
            ].map(({ icon: Icon, t, d }) => (
              <Card key={t} className="border-border/60 p-6">
                <Icon className="size-5 text-iris-violet" />
                <h3 className="mt-3 font-display text-base font-semibold text-primary-deep">{t}</h3>
                <p className="mt-2 text-sm text-foreground/75">{d}</p>
              </Card>
            ))}
          </div>
        </ContentContainer>
      </section>

      <section id="epreuves" className="bg-surface-muted/50">
        <ContentContainer>
          <SectionHeader
            eyebrow="Épreuves"
            title="Techniques, réelles, encadrées"
            description="Les participants manipulent des scénarios proches du terrain, dans un cadre éthique et maîtrisé."
          />
          <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {disciplines.map(({ icon: Icon, title, desc }) => (
              <RevealItem key={title}>
                <Card className="h-full border-border/60 p-6">
                  <Icon className="size-5 text-iris-violet" />
                  <h3 className="mt-3 font-display text-base font-semibold text-primary-deep">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm text-foreground/70">{desc}</p>
                </Card>
              </RevealItem>
            ))}
          </RevealGroup>
        </ContentContainer>
      </section>

      {/* <section className="bg-background">
        <ContentContainer className="max-w-3xl text-center">
          <SectionHeader
            align="center"
            eyebrow="Objectif"
            title="Valoriser les talents cyber du territoire"
            description="Le CTF & Hackathon sert de plateforme de détection, de qualification et de mise en relation des étudiants et jeunes professionnels avec les acteurs cyber."
          />
          <Button asChild>
            <Link to="/" hash="contact">
              <Info className="size-4" /> Demander des informations
            </Link>
          </Button>
          <RegistrationDialog
            type="ctf-hackathon"
            label="S'inscrire au CTF & Hackathon"
            className="ml-0 mt-3 sm:ml-3 sm:mt-0"
          />
        </ContentContainer>
      </section> */}
    </>
  );
}

/* ---------- JOB DATING ---------- */

function JobDatingPage() {
  return (
    <>
      <RichHero
        badge="Carrière · 23 juin 2026"
        title="Job Dating Cyber : talents & recruteurs"
        tagline="Le 23 juin, à l'issue du CTF et du Hackathon, les partenaires accèdent aux talents cyber pré-qualifiés et révélés sur le terrain : sourcing direct, candidats pré-filtrés, profils évalués sur compétences réelles (pentest, forensique, IA, dev sécurité)."
        ctaLabel="Déposer mon CV"
        ctaHref="#cv"
      />

      <section className="bg-background">
        <ContentContainer>
          <SectionHeader
            eyebrow="À qui s'adresse l'événement"
            title="Préparez-vous en quelques minutes"
            description="Étudiants, nouveaux diplômés, ingénieurs et jeunes professionnels : des entretiens express pour créer un lien direct avec les entreprises engagées dans la cybersécurité."
          />
          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                t: "Préparez un pitch de 60s",
                d: "Présentez clairement votre parcours et vos motivations.",
              },
              {
                t: "Imprimez 5 CV à jour",
                d: "Apportez aussi votre version numérique sur clé USB.",
              },
              {
                t: "Ciblez les bons profils",
                d: "Concentrez-vous sur les entreprises alignées avec votre projet.",
              },
            ].map((c) => (
              <Card key={c.t} className="border-border/60 p-6">
                <Briefcase className="size-5 text-iris-violet" />
                <h3 className="mt-3 font-display text-base font-semibold text-primary-deep">
                  {c.t}
                </h3>
                <p className="mt-2 text-sm text-foreground/70">{c.d}</p>
              </Card>
            ))}
          </div>
        </ContentContainer>
      </section>

      <section className="bg-surface-muted/50">
        <ContentContainer>
          <SectionHeader
            eyebrow="Opportunité partenaires"
            title="Pour les recruteurs"
            description="L’évènement sera le point de
rencontre entre les jeunes talents et les entreprises en quête de
profils spécialisés."
          />
          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                t: "Sourcing direct",
                d: "Rencontres en face-à-face avec les lauréats CTF & Hackathon.",
              },
              {
                t: "Candidats pré-filtrés",
                d: "Profils évalués sur compétences réelles, pas seulement sur CV.",
              },
              { t: "Profils spécialisés", d: "Pentest, forensique, IA, dev sécurité." },
            ].map((c) => (
              <Card key={c.t} className="border-border/60 p-6">
                <Building2 className="size-5 text-iris-violet" />
                <h3 className="mt-3 font-display text-base font-semibold text-primary-deep">
                  {c.t}
                </h3>
                <p className="mt-2 text-sm text-foreground/70">{c.d}</p>
              </Card>
            ))}
          </div>
        </ContentContainer>
      </section>

      <section id="cv" className="bg-surface-muted/50">
        <ContentContainer className="max-w-3xl">
          <SectionHeader eyebrow="Candidature" title="Déposer mon CV" />
          <Card className="border-border/60 p-6 md:p-8">
            <p className="text-sm text-foreground/80">
              Envoyez votre CV à l'organisation par email afin que votre candidature soit transmise
              aux recruteurs partenaires avant l'événement.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <RegistrationDialog type="job-dating" label="Déposer mon CV" />
              <Button asChild variant="outline">
                <Link to="/" hash="informations">
                  <Info className="size-4" /> Plus d'informations
                </Link>
              </Button>
            </div>
          </Card>
        </ContentContainer>
      </section>
    </>
  );
}

/* ---------- CONFERENCES ---------- */

function ConferencesPage() {
  const axes = [
    { n: "01", t: "Juridique", d: "Cadre légal & gouvernance." },
    { n: "02", t: "Opérationnel (SOC)", d: "Détection & réponse aux incidents." },
    { n: "03", t: "Technique", d: "Architectures & défense." },
    { n: "04", t: "Formation & Sensibilisation", d: "Culture cyber et montée en compétences." },
    { n: "05", t: "Coopération Internationale", d: "Échanges, alliances et partage d'expérience." },
  ];

  return (
    <>
      <RichHero
        badge="Conférences · Panels"
        title="Conférences & Tables Rondes"
        tagline="Experts nationaux & internationaux : cybermenaces, IA & cybersécurité, réglementation, protection des données."
        ctaLabel="Voir les thématiques"
        ctaHref="#themes"
      />

      <section id="themes" className="bg-background">
        <ContentContainer>
          <SectionHeader
            eyebrow="Thèmes"
            title="Ce qui sera abordé"
            description="Cybermenaces actuelles, IA & cybersécurité, régulations, protection des données : interventions structurées autour des cinq axes thématiques du symposium."
          />
          <div className="flex flex-wrap gap-2">
            {[
              "Cybermenaces 2026",
              "IA & cybersécurité",
              "Protection des infrastructures critiques",
              "Souveraineté numérique",
              "Gestion d'incidents",
              "Cadre réglementaire",
            ].map((theme) => (
              <Badge
                key={theme}
                variant="outline"
                className="border-iris-violet/40 text-iris-violet"
              >
                {theme}
              </Badge>
            ))}
          </div>
        </ContentContainer>
      </section>

      <section className="bg-surface-muted/50">
        <ContentContainer>
          <SectionHeader eyebrow="Axes thématiques" title="Les 5 axes du symposium" />
          <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {axes.map((axis) => (
              <RevealItem key={axis.n}>
                <Card className="h-full border-border/60 p-6">
                  <span className="font-display text-2xl font-bold text-iris-violet">{axis.n}</span>
                  <h3 className="mt-2 font-display text-base font-semibold text-primary-deep">
                    {axis.t}
                  </h3>
                  <p className="mt-2 text-sm text-foreground/75">{axis.d}</p>
                </Card>
              </RevealItem>
            ))}
          </RevealGroup>
        </ContentContainer>
      </section>

      <section className="bg-surface-muted/50">
        <ContentContainer className="max-w-3xl">
          <SectionHeader eyebrow="Panels" title="Thématiques des tables rondes" />
          <Accordion type="single" collapsible>
            {[
              {
                q: "IA & cybersécurité",
                a: "Opportunités et risques de l'IA générative pour la défense et l'attaque.",
              },
              {
                q: "Protection des infrastructures critiques",
                a: "Bonnes pratiques pour les secteurs sensibles comme l'énergie, les télécoms et la finance.",
              },
              {
                q: "Souveraineté numérique",
                a: "Hébergement local, dépendances logicielles et autonomie stratégique.",
              },
              {
                q: "Gestion d'incidents",
                a: "Préparer, détecter, contenir, éradiquer et apprendre.",
              },
            ].map((panel, index) => (
              <AccordionItem value={`panel-${index}`} key={panel.q}>
                <AccordionTrigger>{panel.q}</AccordionTrigger>
                <AccordionContent className="text-foreground/75">{panel.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ContentContainer>
      </section>
    </>
  );
}

/* ---------- ATELIERS ---------- */

function AteliersPage() {
  const ateliers = [
    { t: "Hardening Linux", level: "Débutant", mat: "VM Ubuntu/Debian" },
    { t: "Sécurisation réseaux", level: "Intermédiaire", mat: "Laptop + outils CLI" },
    { t: "SIEM & corrélation", level: "Intermédiaire", mat: "Laptop + VM Linux" },
    { t: "Analyse de malware", level: "Avancé", mat: "VM isolée + Ghidra" },
    { t: "Forensic mémoire", level: "Avancé", mat: "Volatility, Wireshark" },
    { t: "Incident Response & playbooks", level: "Intermédiaire", mat: "Laptop + outils CLI" },
  ];
  const levelColor: Record<string, string> = {
    Débutant: "bg-iris-lime/15 text-iris-violet border-iris-lime/40",
    Intermédiaire: "bg-iris-cyan/15 text-iris-violet border-iris-cyan/40",
    Avancé: "bg-iris-magenta/15 text-iris-violet border-iris-magenta/40",
  };
  return (
    <>
      <RichHero
        badge="Pratique · Places limitées"
        title="Ateliers Pratiques : Maîtrisez les Outils du Terrain"
        tagline="Des sessions immersives guidées par des experts certifiés."
        ctaLabel="Voir les ateliers"
        ctaHref="#ateliers"
        meta={[{ icon: <Users className="size-3.5" />, label: "Places limitées" }]}
      />

      <section id="ateliers" className="bg-background">
        <ContentContainer>
          <SectionHeader
            eyebrow="Programme"
            title="Apprendre en pratiquant"
            description="Hardening système, sécurisation des réseaux, analyse de malwares, gestion d'incidents et playbooks : tous les ateliers sont scénarisés en conditions proches du réel."
          />
          <Card className="mb-8 flex items-start gap-3 border-iris-lime/40 bg-iris-lime/10 p-5">
            <Info className="mt-0.5 size-5 shrink-0 text-iris-violet" />
            <p className="text-sm text-primary-deep">
              <strong>Places limitées.</strong> L'inscription se fait obligatoirement auprès de
              l'organisation.
            </p>
          </Card>
          <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {ateliers.map((a) => (
              <RevealItem key={a.t}>
                <Card className="flex h-full flex-col border-border/60 p-6">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display text-base font-semibold text-primary-deep">
                      {a.t}
                    </h3>
                    <Badge variant="outline" className={cn("shrink-0", levelColor[a.level])}>
                      {a.level}
                    </Badge>
                  </div>
                  <p className="mt-3 text-sm text-foreground/75">
                    Atelier scénarisé encadré par un expert SOC/CSIRT.
                  </p>
                  <p className="mt-2 text-xs text-foreground/60">Matériel : {a.mat}</p>
                </Card>
              </RevealItem>
            ))}
          </RevealGroup>
          <div className="mt-8">
            <RegistrationDialog type="workshop" label="S'inscrire à un atelier" />
          </div>
        </ContentContainer>
      </section>

      <section className="bg-surface-muted/50">
        <ContentContainer>
          <SectionHeader eyebrow="Matériel requis" title="À prévoir avant de venir" />
          <div className="grid gap-5 md:grid-cols-3">
            {[
              { icon: Laptop, t: "PC portable", d: "Avec accès admin local." },
              {
                icon: Cpu,
                t: "Environnement virtualisé",
                d: "VM pré-installée (VirtualBox / VMware, 8 Go RAM min).",
              },
              {
                icon: Wrench,
                t: "Outils techniques",
                d: "Selon chaque atelier : Wireshark, Ghidra, Volatility, etc.",
              },
            ].map(({ icon: Icon, t, d }) => (
              <Card key={t} className="border-border/60 p-6">
                <Icon className="size-6 text-iris-violet" />
                <h3 className="mt-3 font-display text-base font-semibold text-primary-deep">{t}</h3>
                <p className="mt-2 text-sm text-foreground/75">{d}</p>
              </Card>
            ))}
          </div>
        </ContentContainer>
      </section>

      <section className="bg-background">
        <ContentContainer>
          <SectionHeader eyebrow="Niveaux" title="Pour qui ?" />
          <div className="grid gap-5 md:grid-cols-3">
            {[
              { level: "Débutant", d: "Découverte des outils et fondamentaux." },
              { level: "Intermédiaire", d: "Approfondissement des techniques opérationnelles." },
              { level: "Avancé", d: "Scénarios complexes, reverse et forensic avancé." },
            ].map((n) => (
              <Card key={n.level} className="border-border/60 p-6">
                <Badge variant="outline" className={cn("border", levelColor[n.level])}>
                  {n.level}
                </Badge>
                <p className="mt-3 text-sm text-foreground/75">{n.d}</p>
              </Card>
            ))}
          </div>
        </ContentContainer>
      </section>
    </>
  );
}

/* ---------- EXPOSITION & NETWORKING ---------- */

function ExpositionNetworkingPage() {
  const profils = [
    {
      icon: Building2,
      title: "Grands comptes & OIV",
      desc: "Banques, télécoms, assurances, énergie, transport et industrie : autant d'infrastructures critiques à protéger.",
    },
    {
      icon: Cpu,
      title: "Éditeurs & intégrateurs cyber",
      desc: "Fournisseurs de solutions, SOC, ESN, startups & cabinets spécialisés présentant leurs offres en conditions réelles.",
    },
    {
      icon: Mic,
      title: "Institutions & partenaires publics",
      desc: "Ministères, agences stratégiques, bailleurs, universités & centres de formation engagés dans la souveraineté numérique.",
    },
  ];
  const slots = [
    { h: "", t: "Pause café d'accueil", l: "Foyer principal" },
    { h: "", t: "Déjeuner networking", l: "Restaurant Novotel" },
    { h: "", t: "Pause café & démos", l: "Village partenaires" },
    { h: "", t: "Afterwork avec cocktail de clôture J1", l: "Terrasse" },
    { h: "", t: "Déjeuner J2 avec tables thématiques", l: "Restaurant Novotel" },
  ];

  return (
    <>
      <RichHero
        badge="Exposition & Networking · 2 jours"
        title="EXPOSITION & NETWORKING"
        tagline="Espaces partenaires, plénière et démonstrations live : un espace commun pour rencontrer les acteurs de l'écosystème cyber et développer son réseau."
        ctaLabel="Devenir partenaire"
        ctaHref="/partenaires"
      />

      <section className="bg-background">
        <ContentContainer>
          <SectionHeader
            eyebrow="Objectifs"
            title="Découvrir, échanger, connecter"
            description="Stands partenaires, zone plénière, démos live (EDR, SIEM, simulations d'attaques) et moments networking pour créer des opportunités concrètes."
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                t: "Démonstrations live",
                d: "EDR, SIEM, SOC managé et simulations d'attaques en conditions réelles.",
              },
              {
                t: "Génération de leads B2B",
                d: "Rencontres ciblées avec décideurs et grands comptes.",
              },
              {
                t: "Positionnement d'expert",
                d: "Visibilité programme et prise de parole auprès d'un public qualifié.",
              },
            ].map((c) => (
              <Card key={c.t} className="border-border/60 p-6">
                <h3 className="font-display text-base font-semibold text-primary-deep">{c.t}</h3>
                <p className="mt-2 text-sm text-foreground/75">{c.d}</p>
              </Card>
            ))}
          </div>
        </ContentContainer>
      </section>

      <section className="bg-nav-deep text-nav-deep-foreground">
        <ContentContainer className="flex flex-col md:flex-row md:items-start md:gap-8">
          <Reveal className="mb-10 max-w-3xl md:mb-0 md:flex-1">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-iris-cyan">
              Espace
            </p>
            <h2 className="font-display text-2xl font-bold md:text-4xl">Plan des stands</h2>
            <p className="mt-3 text-sm text-nav-deep-foreground/75 md:text-base">
              Disposition des 8 espaces partenaires autour de la zone plénière (scène + sièges),
              avec entrée centrale.
            </p>
            <div className="mt-4 h-1 w-12 rounded-full bg-iris" />
          </Reveal>

          <Reveal className="md:flex-1">
            <StandPlan />
          </Reveal>
        </ContentContainer>
      </section>

      <section className="bg-surface-muted/50">
        <ContentContainer className="grid gap-8 md:grid-cols-2">
          <Card className="border-border/60 p-6 md:p-8">
            <h3 className="font-display text-xl font-semibold text-primary-deep">
              Application de matchmaking
            </h3>
            <p className="mt-3 text-sm text-foreground/80">
              Une application de matchmaking pourra être proposée pour faciliter la prise de
              rendez-vous entre participants. Le lien sera communiqué prochainement par
              l'organisation.
            </p>
            <p className="mt-3 text-xs text-foreground/60">
              <CheckCircle2 className="mr-1.5 inline size-3.5 text-iris-violet" />
              Participation optionnelle, sans inscription requise pour les moments networking.
            </p>
            <Button asChild variant="outline" className="mt-6" disabled>
              <span>
                Lien à venir <ExternalLink className="size-4" />
              </span>
            </Button>
          </Card>

          <div id="horaires">
            <h3 className="font-display text-xl font-semibold text-primary-deep">
              Horaires des moments networking
            </h3>
            <ol className="mt-4 space-y-4">
              {slots.map((s, i) => (
                <li key={`${s.h}-${s.t}`} className="flex gap-4">
                  <div className="flex flex-col items-center pt-1">
                    <span className="size-3 shrink-0 rounded-full bg-iris-violet ring-4 ring-iris-violet/20" />
                    {i < slots.length - 1 ? (
                      <span className="mt-1 w-px flex-1 bg-iris-violet/30" aria-hidden />
                    ) : null}
                  </div>
                  <Card className="flex-1 border-border/60 p-4">
                    <div className="flex items-center gap-3">
                      <Coffee className="size-4 text-iris-violet" />
                      <span className="text-xs font-semibold text-iris-violet">{s.h}</span>
                    </div>
                    <p className="mt-1 font-display text-base font-semibold text-primary-deep">
                      {s.t}
                    </p>
                    <p className="text-xs text-foreground/70">{s.l}</p>
                  </Card>
                </li>
              ))}
            </ol>
          </div>
        </ContentContainer>
      </section>

      <section className="bg-surface-muted/50">
        <ContentContainer>
          <SectionHeader eyebrow="Profils ciblés" title="Qui sera présent" />
          <RevealGroup className="grid gap-5 md:grid-cols-3">
            {profils.map(({ icon: Icon, title, desc }) => (
              <RevealItem key={title}>
                <Card className="h-full border-border/60 p-6">
                  <Icon className="size-6 text-iris-violet" />
                  <h3 className="mt-3 font-display text-base font-semibold text-primary-deep">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm text-foreground/75">{desc}</p>
                </Card>
              </RevealItem>
            ))}
          </RevealGroup>
        </ContentContainer>
      </section>

      <section className="bg-background">
        <ContentContainer className="max-w-3xl text-center">
          <SectionHeader
            align="center"
            eyebrow="Partenariat"
            title="Réservez votre espace Partenaire"
            description="Visibilité maximale, prise de parole, espace dédié, invitations VIP : découvrez les packages de partenariat de la 1ère édition."
          />
          <div className="flex flex-wrap justify-center gap-3">
            <RegistrationDialog type="visitor" label="Acheter un billet visiteur" />
            <Button asChild>
              <Link to="/partenaires">
                <Building2 className="size-4" /> Voir les packages
              </Link>
            </Button>
            <Button asChild variant="outline">
              <a href="mailto:contact@cirt.gov.mg?subject=Exposition%20%26%20Networking%20-%20CIRT%20MDG%202026">
                <Mail className="size-4" /> Contacter l'organisation
              </a>
            </Button>
          </div>
        </ContentContainer>
      </section>
    </>
  );
}

function ProgrammePage() {
  const days = [
    {
      day: "Jour 1",
      date: "22 juin 2026",
      items: [
        "Cérémonie d'ouverture officielle",
        "Conférences plénières & panels d'experts",
        "Ateliers techniques (systèmes & réseaux)",
        "Espace exposition & démos live partenaires",
        "Déjeuner networking partenaires & VIP",
        "CTF & Hackathon",
      ],
    },
    {
      day: "Jour 2",
      date: "23 juin 2026",
      items: [
        "Masterclass : gestion de cyber-crise",
        "Coopération internationale & panels",
        "Annonce des résultats & remise des prix CTF / Hackathon",
        "Job Dating : lauréats CTF, Hackathon & jeunes talents",
        "Table ronde : cybermenaces & IA",
        "Cocktail de clôture & networking",
      ],
    },
  ];

  return (
    <>
      <RichHero
        badge="Programme · 2 jours"
        title="Les deux journées du Symposium"
        tagline="Cérémonies, conférences, ateliers techniques, CTF & Hackathon, networking et remise des prix : découvrez le programme complet."
        ctaLabel="Voir le programme"
        ctaHref="#programme"
      />

      <section id="programme" className="bg-background">
        <ContentContainer>
          <SectionHeader eyebrow="Programme" title="Les deux journées du Symposium" />
          <div className="grid gap-6 md:grid-cols-2">
            {days.map((day) => (
              <Card key={day.day} className="border-border/60 p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-iris-violet">
                  {day.day}
                </p>
                <h3 className="mt-1 font-display text-xl font-semibold text-primary-deep">
                  {day.date}
                </h3>
                <ul className="mt-4 space-y-2 text-sm text-foreground/80">
                  {day.items.map((item) => (
                    <li key={item} className="flex gap-2">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-iris-violet" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
          <div className="mt-8">
            <RegistrationDialog
              type="newsletter"
              label="Recevoir les informations du Symposium"
              variant="outline"
            />
          </div>
        </ContentContainer>
      </section>
    </>
  );
}

/* ---------- Registry ---------- */

export const RICH_PAGES: Record<string, () => React.JSX.Element> = {
  "ctf-hackathon": CtfHackathonPage,
  "job-dating": JobDatingPage,
  conferences: ConferencesPage,
  programme: ProgrammePage,
  ateliers: AteliersPage,
  "exposition-networking": ExpositionNetworkingPage,
};
