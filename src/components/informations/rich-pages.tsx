import { Link } from "@tanstack/react-router";
import {
  Trophy,
  Medal,
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
  Clock,
  Mail,
  Laptop,
  Info,
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
import { cn } from "@/lib/utils";


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
    <Reveal
      className={cn("mb-10 max-w-3xl", align === "center" && "mx-auto text-center")}
    >
      {eyebrow ? (
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-iris-violet">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-display text-2xl font-bold text-primary-deep md:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 text-sm leading-relaxed text-foreground/75 md:text-base">
          {description}
        </p>
      ) : null}
      <div
        className={cn(
          "mt-4 h-1 w-12 rounded-full bg-iris",
          align === "center" && "mx-auto",
        )}
      />
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
    <section className="relative isolate overflow-hidden bg-nav-deep text-nav-deep-foreground">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at top, oklch(0.55 0.22 295 / 0.45), transparent 60%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(oklch(1 0 0 / 0.6) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 0.6) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />
      <ContentContainer className="relative">
        <Reveal>
          <Badge className="border-iris-cyan/30 bg-iris-cyan/10 text-iris-cyan hover:bg-iris-cyan/15">
            {badge}
          </Badge>
          <h1 className="mt-5 font-display text-3xl font-bold leading-tight md:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-base text-nav-deep-foreground/75 md:text-lg">
            {tagline}
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="bg-iris-cyan text-nav-deep hover:bg-iris-cyan/90">
              <a href={ctaHref}>{ctaLabel}</a>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/20 bg-white/5 text-nav-deep-foreground hover:bg-white/10">
              <Link to="/" hash="contact">Nous contacter</Link>
            </Button>
          </div>
          {meta.length ? (
            <div className="mt-8 flex flex-wrap gap-4 text-xs text-nav-deep-foreground/70">
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

/* ---------- HACKATHON ---------- */

function HackathonPage() {
  const criteres = [
    { label: "Innovation technique", desc: "Originalité et créativité de la solution." },
    { label: "Niveau de sécurité", desc: "Robustesse face aux menaces cyber concrètes." },
    { label: "Viabilité de la solution", desc: "Architecture solide, faisabilité réelle." },
    { label: "Qualité de la présentation finale", desc: "Démo claire et pitch convaincant." },
  ];
  const prix = [
    { icon: Trophy, label: "Trophées", desc: "Distinctions officielles remises aux meilleures équipes." },
    { icon: Medal, label: "Matériel technologique", desc: "Équipements & licences pro pour continuer à coder." },
    { icon: Trophy, label: "Programmes & formations", desc: "Accès à des cursus et programmes d'accompagnement cyber." },
  ];
  return (
    <>
      <RichHero
        badge="Challenge · 24 – 48h"
        title="Hackathon Cybersécurité : Codez pour la Résilience"
        tagline="24 à 48 heures de challenge non-stop pour concevoir les solutions de sécurité de demain."
        ctaLabel="Voir le programme"
        ctaHref="#programme"
        meta={[
          { icon: <Calendar className="size-3.5" />, label: "22 – 23 Juin 2026" },
          { icon: <MapPin className="size-3.5" />, label: "Novotel, Alarobia" },
          { icon: <Users className="size-3.5" />, label: "Équipes pluridisciplinaires" },
        ]}
      />

      <section id="programme" className="bg-background">
        <ContentContainer>
          <SectionHeader
            eyebrow="Le concept"
            title="Un marathon de code au service de la cybersécurité"
            description="Innovation, cybersécurité et esprit d'équipe : les équipes prototypent des solutions concrètes de défense numérique aux côtés d'experts et de mentors."
          />
          <div className="grid gap-5 md:grid-cols-3 lg:grid-cols-5">
            {[
              { icon: Users, t: "Accueil & briefing", d: "Formation des équipes, présentation des défis et des règles." },
              { icon: Flag, t: "Lancement du challenge", d: "Coup d'envoi officiel des sujets et accès aux ressources." },
              { icon: Code2, t: "Sessions de développement", d: "Sprints encadrés par les mentors et points d'étape." },
              { icon: Mic, t: "Soutenances", d: "Démo de quelques minutes devant le jury." },
              { icon: Trophy, t: "Remise des prix", d: "Délibération et cérémonie de clôture." },
            ].map(({ icon: Icon, t, d }) => (
              <Card key={t} className="border-border/60 p-5">
                <Icon className="size-5 text-iris-violet" />
                <h3 className="mt-3 font-display text-base font-semibold text-primary-deep">{t}</h3>
                <p className="mt-2 text-sm text-foreground/75">{d}</p>
              </Card>
            ))}
          </div>
        </ContentContainer>
      </section>

      <section className="bg-surface-muted/50">
        <ContentContainer>
          <SectionHeader eyebrow="Évaluation" title="Critères d'évaluation" />
          <RevealGroup className="grid gap-5 md:grid-cols-2">
            {criteres.map((c) => (
              <RevealItem key={c.label}>
                <Card className="border-border/60 p-6">
                  <h3 className="font-display text-base font-semibold text-primary-deep">{c.label}</h3>
                  <p className="mt-2 text-sm text-foreground/70">{c.desc}</p>
                </Card>
              </RevealItem>
            ))}
          </RevealGroup>
        </ContentContainer>
      </section>

      <section className="bg-background">
        <ContentContainer>
          <SectionHeader eyebrow="Récompenses" title="Prix à gagner" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {prix.map(({ icon: Icon, label, desc }) => (
              <Card key={label} className="border-border/60 p-6 text-center">
                <Icon className="mx-auto size-8 text-iris-violet" />
                <h3 className="mt-3 font-display text-lg font-semibold text-primary-deep">{label}</h3>
                <p className="mt-2 text-sm text-foreground/70">{desc}</p>
              </Card>
            ))}
          </div>
        </ContentContainer>
      </section>

      <section className="bg-surface-muted/50">
        <ContentContainer>
          <SectionHeader eyebrow="Pratique" title="Informations pratiques" />
          <div className="grid gap-5 md:grid-cols-3">
            {[
              { icon: Clock, t: "Durée totale", d: "24 à 48 heures non-stop selon le format final." },
              { icon: Users, t: "Taille des équipes", d: "Équipes recommandées de 3 à 5 membres, profils variés (dev, ops, design, étudiants)." },
              { icon: Laptop, t: "Matériel recommandé", d: "PC portable, chargeur, multiprise, casque, et votre stack préférée." },
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

      <section className="bg-background">
        <ContentContainer className="max-w-3xl">
          <SectionHeader eyebrow="FAQ" title="Mini FAQ" />
          <Accordion type="single" collapsible className="w-full">
            {[
              { q: "Que dois-je amener ?", a: "Laptop, chargeur, multiprise, votre stack préférée. Restauration et connexion sur place." },
              { q: "Quel niveau est requis ?", a: "Tous les niveaux sont les bienvenus, avec des équipes mixtes mêlant dev, design, ops et étudiants." },
              { q: "Qu'attend le jury ?", a: "Une solution innovante, sécurisée, viable, et clairement présentée lors de la soutenance finale." },
            ].map((f, i) => (
              <AccordionItem value={`f${i}`} key={i}>
                <AccordionTrigger>{f.q}</AccordionTrigger>
                <AccordionContent className="text-foreground/75">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ContentContainer>
      </section>
    </>
  );
}

/* ---------- CTF ---------- */

function CtfPage() {
  return (
    <>
      <RichHero
        badge="Compétition · 22 juin 2026"
        title="CTF Cybersécurité : l'arène des talents"
        tagline="Capture The Flag organisé le 22 juin pour étudiants et jeunes professionnels, avec des épreuves techniques en conditions réelles : pentest, forensique, IA et développement sécurisé."
        ctaLabel="Voir le règlement"
        ctaHref="#reglement"
        meta={[
          { icon: <Flag className="size-3.5" />, label: "Format Jeopardy / Attack-Defense" },
          { icon: <Users className="size-3.5" />, label: "Étudiants & jeunes professionnels" },
        ]}
      />

      <section className="bg-background">
        <ContentContainer>
          <SectionHeader
            eyebrow="Format"
            title="Plusieurs disciplines, une seule arène"
            description="Plateforme de détection et de valorisation des talents cyber du territoire, dans une ambiance compétitive et fair-play."
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { t: "Cryptographie", d: "Cassez les algorithmes faibles." },
              { t: "Exploitation web", d: "Exploitez les vulnérabilités OWASP." },
              { t: "Forensics", d: "Analysez dumps mémoire et trafic." },
              { t: "Reverse engineering", d: "Désassemblez et exploitez le binaire." },
            ].map((c) => (
              <Card key={c.t} className="border-border/60 p-5">
                <Badge variant="secondary" className="bg-iris-violet/10 text-iris-violet">{c.t}</Badge>
                <p className="mt-3 text-sm text-foreground/75">{c.d}</p>
              </Card>
            ))}
          </div>
        </ContentContainer>
      </section>

      <section id="reglement" className="bg-background">
        <ContentContainer className="grid gap-10 md:grid-cols-2">
          <div>
            <SectionHeader eyebrow="Règlement" title="Cadre éthique & règles" />
            <Accordion type="single" collapsible>
              {[
                { q: "Respect du cadre éthique", a: "Aucune attaque hors du périmètre du CTF, aucun partage de flag." },
                { q: "Interdictions standard", a: "DoS, brute force massif, attaques sur l'infrastructure de l'événement." },
                { q: "Matériel et outils autorisés", a: "Votre laptop, outils open-source, VM Kali ou Parrot." },
              ].map((r, i) => (
                <AccordionItem value={`r${i}`} key={i}>
                  <AccordionTrigger>{r.q}</AccordionTrigger>
                  <AccordionContent className="text-foreground/75">{r.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          <div>
            <SectionHeader eyebrow="Prérequis" title="Stack technique" />
            <Card className="border-border/60 p-6">
              <ul className="space-y-3 text-sm text-foreground/80">
                {[
                  ["PC personnel", "Avec accès admin/root local"],
                  ["Systèmes recommandés", "Linux, Kali, Parrot"],
                  ["Outils recommandés", "Wireshark, BurpSuite, Ghidra, etc."],
                ].map(([t, d]) => (
                  <li key={t} className="flex items-start gap-3">
                    <Cpu className="mt-0.5 size-4 shrink-0 text-iris-violet" />
                    <div>
                      <p className="font-medium text-primary-deep">{t}</p>
                      <p className="text-foreground/70">{d}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </ContentContainer>
      </section>
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
              { t: "Préparez un pitch de 60s", d: "Présentez clairement votre parcours et vos motivations." },
              { t: "Imprimez 5 CV à jour", d: "Apportez aussi votre version numérique sur clé USB." },
              { t: "Ciblez les bons profils", d: "Concentrez-vous sur les entreprises alignées avec votre projet." },
            ].map((c) => (
              <Card key={c.t} className="border-border/60 p-6">
                <Briefcase className="size-5 text-iris-violet" />
                <h3 className="mt-3 font-display text-base font-semibold text-primary-deep">{c.t}</h3>
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
            description="Un point de rencontre exclusif entre les jeunes talents et les entreprises en quête de profils spécialisés en cybersécurité."
          />
          <div className="grid gap-5 md:grid-cols-3">
            {[
              { t: "Sourcing direct", d: "Rencontres en face-à-face avec les lauréats CTF & Hackathon." },
              { t: "Candidats pré-filtrés", d: "Profils évalués sur compétences réelles, pas seulement sur CV." },
              { t: "Profils spécialisés", d: "Pentest, forensique, IA, dev sécurité." },
            ].map((c) => (
              <Card key={c.t} className="border-border/60 p-6">
                <Building2 className="size-5 text-iris-violet" />
                <h3 className="mt-3 font-display text-base font-semibold text-primary-deep">{c.t}</h3>
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
              Envoyez votre CV à l'organisation par email afin que votre candidature soit transmise aux recruteurs partenaires
              avant l'événement.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild>
                <a href="mailto:contact@cirt.gov.mg?subject=Candidature%20Job%20Dating%20-%20CIRT%20MDG%202026">
                  <Mail className="size-4" /> Envoyer mon CV par email
                </a>
              </Button>
              <Button asChild variant="outline">
                <Link to="/" hash="contact">
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
        badge="Programme · 2 jours"
        title="Conférences & Panels : Décrypter les Enjeux du Cyber-Espace"
        tagline="Experts nationaux & internationaux : cybermenaces, IA & cybersécurité, réglementation, protection des données."
        ctaLabel="Voir le programme"
        ctaHref="#programme"
      />

      <section className="bg-background">
        <ContentContainer>
          <SectionHeader
            eyebrow="Thèmes"
            title="Ce qui sera abordé"
            description="Cybermenaces actuelles, IA & cybersécurité, régulations, protection des données : interventions structurées autour des cinq axes thématiques du Sommet."
          />
          <div className="flex flex-wrap gap-2">
            {[
              "Cybermenaces 2026",
              "IA & cybersécurité",
              "Protection des infrastructures critiques",
              "Souveraineté numérique",
              "Gestion d'incidents",
              "Cadre réglementaire",
            ].map((t) => (
              <Badge key={t} variant="outline" className="border-iris-violet/40 text-iris-violet">{t}</Badge>
            ))}
          </div>
        </ContentContainer>
      </section>

      <section className="bg-surface-muted/50">
        <ContentContainer>
          <SectionHeader eyebrow="Axes thématiques" title="Les 5 axes du Sommet" />
          <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {axes.map((a) => (
              <RevealItem key={a.n}>
                <Card className="h-full border-border/60 p-6">
                  <span className="font-display text-2xl font-bold text-iris-violet">{a.n}</span>
                  <h3 className="mt-2 font-display text-base font-semibold text-primary-deep">{a.t}</h3>
                  <p className="mt-2 text-sm text-foreground/75">{a.d}</p>
                </Card>
              </RevealItem>
            ))}
          </RevealGroup>
        </ContentContainer>
      </section>

      <section id="programme" className="bg-background">
        <ContentContainer>
          <SectionHeader eyebrow="Programme" title="Les deux journées du Sommet" />
          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                day: "Jour 1",
                date: "22 juin 2026",
                items: [
                  "Cérémonie d'ouverture officielle",
                  "Conférences plénières & panels d'experts",
                  "Ateliers techniques (systèmes & réseaux)",
                  "Espace exposition & démos live partenaires",
                  "Déjeuner networking partenaires & VIP",
                  "CTF & Hackathon Cyber",
                ],
              },
              {
                day: "Jour 2",
                date: "23 juin 2026",
                items: [
                  "Masterclass : gestion de cyber-crise",
                  "Coopération internationale & panels",
                  "Annonce des résultats & remise des prix CTF / Hackathon",
                  "Job Dating Cyber : lauréats CTF, Hackathon & jeunes talents",
                  "Table ronde : cybermenaces & IA",
                  "Cocktail de clôture & networking",
                ],
              },
            ].map((d) => (
              <Card key={d.day} className="border-border/60 p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-iris-violet">
                  {d.day}
                </p>
                <h3 className="mt-1 font-display text-xl font-semibold text-primary-deep">
                  {d.date}
                </h3>
                <ul className="mt-4 space-y-2 text-sm text-foreground/80">
                  {d.items.map((it) => (
                    <li key={it} className="flex gap-2">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-iris-violet" />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </ContentContainer>
      </section>

      <section className="bg-surface-muted/50">
        <ContentContainer className="max-w-3xl">
          <SectionHeader eyebrow="Panels" title="Thématiques des tables rondes" />
          <Accordion type="single" collapsible>
            {[
              { q: "IA & cybersécurité", a: "Opportunités et risques de l'IA générative pour la défense et l'attaque." },
              { q: "Protection des infrastructures critiques", a: "Bonnes pratiques pour les secteurs sensibles (énergie, télécoms, finance)." },
              { q: "Souveraineté numérique", a: "Hébergement local, dépendances logicielles et autonomie stratégique." },
              { q: "Gestion d'incidents", a: "Préparer, détecter, contenir, éradiquer et apprendre." },
            ].map((p, i) => (
              <AccordionItem value={`p${i}`} key={i}>
                <AccordionTrigger>{p.q}</AccordionTrigger>
                <AccordionContent className="text-foreground/75">{p.a}</AccordionContent>
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
              <strong>Places limitées.</strong> L'inscription se fait obligatoirement auprès de l'organisation.
            </p>
          </Card>
          <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {ateliers.map((a) => (
              <RevealItem key={a.t}>
                <Card className="flex h-full flex-col border-border/60 p-6">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display text-base font-semibold text-primary-deep">{a.t}</h3>
                    <Badge variant="outline" className={cn("shrink-0", levelColor[a.level])}>
                      {a.level}
                    </Badge>
                  </div>
                  <p className="mt-3 text-sm text-foreground/75">Atelier scénarisé encadré par un expert SOC/CSIRT.</p>
                  <p className="mt-2 text-xs text-foreground/60">Matériel : {a.mat}</p>
                </Card>
              </RevealItem>
            ))}
          </RevealGroup>
        </ContentContainer>
      </section>

      <section className="bg-surface-muted/50">
        <ContentContainer>
          <SectionHeader eyebrow="Matériel requis" title="À prévoir avant de venir" />
          <div className="grid gap-5 md:grid-cols-3">
            {[
              { icon: Laptop, t: "PC portable", d: "Avec accès admin local." },
              { icon: Cpu, t: "Environnement virtualisé", d: "VM pré-installée (VirtualBox / VMware, 8 Go RAM min)." },
              { icon: Wrench, t: "Outils techniques", d: "Selon chaque atelier : Wireshark, Ghidra, Volatility, etc." },
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

/* ---------- VILLAGE PARTENAIRES ---------- */

function VillagePage() {
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
  return (
    <>
      <RichHero
        badge="Exposition · 2 jours"
        title="Village Partenaires : l'innovation en action"
        tagline="Espaces partenaires, démos live et plénière : un espace pour les échanges, la visibilité institutionnelle et les rencontres avec les acteurs de l'écosystème cyber."
        ctaLabel="Devenir partenaire"
        ctaHref="/partenaires"
      />

      <section className="bg-background">
        <ContentContainer>
          <SectionHeader
            eyebrow="Objectifs"
            title="Découvrir l'écosystème cyber malgache"
            description="Stands des partenaires technologiques, démos live (EDR, SIEM, simulations d'attaques) et focus souveraineté numérique."
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { t: "Démonstrations live", d: "EDR, SIEM, SOC managé et simulations d'attaques en conditions réelles." },
              { t: "Génération de leads B2B", d: "Rencontres ciblées avec décideurs et grands comptes." },
              { t: "Positionnement d'expert", d: "Visibilité programme et prise de parole auprès d'un public qualifié." },
            ].map((c) => (
              <Card key={c.t} className="border-border/60 p-6">
                <h3 className="font-display text-base font-semibold text-primary-deep">{c.t}</h3>
                <p className="mt-2 text-sm text-foreground/75">{c.d}</p>
              </Card>
            ))}
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
                  <h3 className="mt-3 font-display text-base font-semibold text-primary-deep">{title}</h3>
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
            <Button asChild>
              <Link to="/partenaires">
                <Building2 className="size-4" /> Voir les packages
              </Link>
            </Button>
            <Button asChild variant="outline">
              <a href="mailto:contact@cirt.gov.mg?subject=Village%20Partenaires%20-%20CIRT%20MDG%202026">
                <Mail className="size-4" /> Contacter l'organisation
              </a>
            </Button>
          </div>
        </ContentContainer>
      </section>
    </>
  );
}


/* ---------- NETWORKING ---------- */

function NetworkingPage() {
  const slots = [
    { h: "09h30", t: "Pause café d'accueil", l: "Foyer principal" },
    { h: "12h30", t: "Déjeuner networking", l: "Restaurant Novotel" },
    { h: "15h30", t: "Pause café & démos", l: "Village partenaires" },
    { h: "18h00", t: "Afterwork avec cocktail de clôture J1", l: "Terrasse" },
    { h: "12h30", t: "Déjeuner J2 avec tables thématiques", l: "Restaurant Novotel" },
  ];
  return (
    <>
      <RichHero
        badge="Rencontres · 2 jours"
        title="Espace Networking : Développez votre Réseau Professionnel"
        tagline="Connectez-vous avec vos pairs et créez des opportunités d'affaires."
        ctaLabel="Voir les horaires"
        ctaHref="#horaires"
      />

      <section className="bg-background">
        <ContentContainer>
          <SectionHeader
            eyebrow="Pour qui"
            title="Étudiants, entreprises, institutions"
            description="Espaces lounge, pauses café et déjeuners networking : des moments dédiés pour favoriser les rencontres informelles."
          />
          <div className="grid gap-5 md:grid-cols-3">
            {[
              { icon: Users, t: "Étudiants & jeunes diplômés", d: "Rencontrez vos futurs employeurs." },
              { icon: Building2, t: "Entreprises", d: "Identifiez les talents et partenaires." },
              { icon: Mic, t: "Institutions publiques", d: "Coopération et politiques cyber." },
            ].map(({ icon: Icon, t, d }) => (
              <Card key={t} className="border-border/60 p-6">
                <Icon className="size-5 text-iris-violet" />
                <h3 className="mt-3 font-display text-base font-semibold text-primary-deep">{t}</h3>
                <p className="mt-2 text-sm text-foreground/70">{d}</p>
              </Card>
            ))}
          </div>
        </ContentContainer>
      </section>

      <section className="bg-surface-muted/50">
        <ContentContainer className="grid gap-8 md:grid-cols-2">
          <Card className="border-border/60 p-6 md:p-8">
            <h3 className="font-display text-xl font-semibold text-primary-deep">
              Application de matchmaking
            </h3>
            <p className="mt-3 text-sm text-foreground/80">
              Une application de matchmaking pourra être proposée pour faciliter la prise de rendez-vous
              entre participants. Le lien sera communiqué prochainement par l'organisation.
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
                <li key={i} className="flex gap-4">
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
                    <p className="mt-1 font-display text-base font-semibold text-primary-deep">{s.t}</p>
                    <p className="text-xs text-foreground/70">{s.l}</p>
                  </Card>
                </li>
              ))}
            </ol>
          </div>
        </ContentContainer>
      </section>
    </>
  );
}

/* ---------- Registry ---------- */

export const RICH_PAGES: Record<string, () => React.JSX.Element> = {
  hackathon: HackathonPage,
  "ctf-etudiant": CtfPage,
  "job-dating": JobDatingPage,
  conferences: ConferencesPage,
  ateliers: AteliersPage,
  "village-partenaires": VillagePage,
  networking: NetworkingPage,
};
