import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Mail,
  Building2,
  Cpu,
  Landmark,
  CheckCircle2,
  Users,
  Calendar,
  MapPin,
  Sparkles,
  QrCode,
} from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { submitPartnershipLead } from "@/lib/firebase/server-api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { downloadQrCodePng } from "@/lib/qr-code";
import { getErrorMessage } from "@/lib/utils";
import infoBg from "@/assets/info-section.webp";

export const Route = createFileRoute("/partenaires")({
  head: () => ({
    meta: [
      { title: "Devenir partenaire, Symposium Cybersécurité Madagascar 2026" },
      {
        name: "description",
        content:
          "Dossier de partenariat du Symposium de la Cybersécurité Madagascar, les 22 et 23 juin 2026 au Novotel Convention & Spa, Antananarivo.",
      },
      { property: "og:title", content: "Devenir partenaire, Symposium Cybersécurité Madagascar 2026" },
      {
        property: "og:description",
        content:
          "Packages de partenariat, profils ciblés et opportunités de visibilité pour la 1ère édition du Symposium.",
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
    description:
      "Visibilité maximale • Prise de parole plénière/atelier • Conférence de presse • PAD • Espace Partenaire • 100 invitations",
  },
  {
    name: "Partenaire",
    price: "50 000 000 Ar",
    description: "Logo sur tous supports • Pose visuels • Prise de parole atelier • 50 invitations",
  },
  {
    name: "Conférence / Masterclass",
    price: "1 000 000 Ar",
    description:
      "Animation d'un atelier ou masterclass • Visibilité programme • Accès réseau spécialisé • 25 invitations",
  },
  // {
  //   name: "Billet Visiteur",
  //   price: "1 000 000 Ar",
  //   description: "Sur invitation uniquement",
  // },
];

const PARTNERSHIP_LEVELS = [
  "Sponsor Officiel & Gold",
  "Partenaire",
  "Partenaire Technique (Atelier/Masterclass)",
];

function PackageRequestDialog({ packageName }: { packageName?: string }) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [createdLead, setCreatedLead] = useState<{ id: string; qrCode: string } | null>(null);
  const defaultLevel =
    packageName === "Conférence / Masterclass"
      ? "Partenaire Technique (Atelier/Masterclass)"
      : PARTNERSHIP_LEVELS.includes(packageName ?? "")
        ? packageName
        : undefined;

  return (
    <Dialog
      onOpenChange={(open) => {
        if (open) {
          setStatus("idle");
          setErrorMessage("");
          setCreatedLead(null);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="bg-iris-cyan text-nav-deep hover:bg-iris-cyan/90">
          Demander un package <ArrowRight className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[92vh] overflow-y-auto border-iris-cyan/20 sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-primary-deep">
            Devenir Partenaire / Sponsor
          </DialogTitle>
          <DialogDescription>
            Envoyez votre demande de package. L'équipe prendra contact avec vous pour qualifier
            l'opportunité.
          </DialogDescription>
        </DialogHeader>

        {status === "success" ? (
          <div className="rounded-md border border-iris-lime/40 bg-iris-lime/10 p-4 text-sm text-primary-deep">
            <p>
              Merci, votre demande a bien été enregistrée. L'équipe du Symposium vous recontactera pour
              finaliser le package.
            </p>
            {createdLead ? (
              <div className="mt-4">
                <p className="font-mono text-xs">{createdLead.qrCode}</p>
                <Button
                  type="button"
                  className="mt-3 bg-iris-violet hover:bg-iris-violet/90"
                  onClick={() =>
                    downloadQrCodePng({
                      payload: JSON.stringify({
                        event: "SCM2026",
                        id: createdLead.id,
                        type: "partnership",
                        qrCode: createdLead.qrCode,
                      }),
                      fileName: `${createdLead.qrCode}.png`,
                    }).catch((error) =>
                      setErrorMessage(
                        getErrorMessage(error, "Téléchargement du QR Code impossible"),
                      ),
                    )
                  }
                >
                  <QrCode className="size-4" />
                  Télécharger mon QR Code
                </Button>
              </div>
            ) : null}
            {errorMessage ? (
              <p className="mt-3 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {errorMessage}
              </p>
            ) : null}
          </div>
        ) : (
          <form
            className="grid gap-4"
            onSubmit={async (event) => {
              event.preventDefault();
              setStatus("submitting");
              setErrorMessage("");

              const formData = new FormData(event.currentTarget);
              try {
                const response = await submitPartnershipLead({
                  phone: String(formData.get("phone") ?? ""),
                  email: String(formData.get("email") ?? ""),
                  organization: String(formData.get("organization") ?? ""),
                  sector: String(formData.get("sector") ?? ""),
                  level: String(formData.get("level") ?? ""),
                  message: String(formData.get("message") ?? ""),
                  sourcePackage: packageName ?? "",
                });
                setCreatedLead(response);
                setStatus("success");
              } catch (error) {
                setStatus("error");
                setErrorMessage(
                  error instanceof Error
                    ? error.message
                    : "Impossible d'enregistrer la demande pour le moment.",
                );
              }
            }}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="partner-phone">Numéro</Label>
                <Input id="partner-phone" name="phone" type="tel" required placeholder="+261 ..." />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="partner-email">Email</Label>
                <Input
                  id="partner-email"
                  name="email"
                  type="email"
                  required
                  placeholder="contact@organisation.mg"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="partner-organization">Nom de la société</Label>
                <Input
                  id="partner-organization"
                  name="organization"
                  required
                  placeholder="Organisation"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="partner-sector">Secteur d'activité</Label>
                <Input
                  id="partner-sector"
                  name="sector"
                  required
                  placeholder="Banque, Télécom, Énergie..."
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Niveau de partenariat souhaité</Label>
              <Select name="level" defaultValue={defaultLevel} required>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un niveau" />
                </SelectTrigger>
                <SelectContent>
                  {PARTNERSHIP_LEVELS.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="partner-message">Message</Label>
              <Textarea
                id="partner-message"
                name="message"
                className="min-h-28"
                placeholder="Demandes spécifiques de branding, d'espace d'exposition ou d'atelier..."
              />
            </div>

            {status === "error" ? (
              <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {errorMessage}
              </p>
            ) : null}

            <Button
              type="submit"
              size="lg"
              className="bg-iris-violet hover:bg-iris-violet/90"
              disabled={status === "submitting"}
            >
              {status === "submitting" ? "Envoi en cours..." : "Envoyer la demande"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

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
                Devenir partenaire du Symposium de la Cybersécurité Madagascar
              </h1>
              <p className="mt-4 max-w-2xl text-base text-nav-deep-foreground/80 md:text-lg">
                Plateforme nationale de sensibilisation, d'innovation, de protection et de confiance
                numérique. Associez votre marque à la 1ère édition d'un événement stratégique pour
                Madagascar.
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
                <Button
                  asChild
                  size="lg"
                  className="bg-iris-cyan text-nav-deep hover:bg-iris-cyan/90"
                >
                  <a href="mailto:contact@cirt.gov.mg?subject=Demande%20de%20partenariat%20-%20Symposium%20Cybers%C3%A9curit%C3%A9%20MDG%202026">
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
                À l'ère de la transformation numérique accélérée, Madagascar fait face à des enjeux
                croissants en matière de cybersécurité. Protection des données, résilience des
                infrastructures critiques, lutte contre la cybercriminalité : ces défis sont devenus
                des priorités nationales. Ce Symposium est la première plateforme stratégique dédiée à
                y répondre collectivement.
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
                Au-delà du public attendu, le Symposium cible des organisations dont le positionnement,
                les enjeux et la stratégie de croissance s'alignent avec la cybersécurité.
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
              {/* <p className="mt-3 text-xs text-foreground/60">
                * Tarifs pouvant être adaptés sous forme d'échange de service ou en nature.
              </p> */}
              <p
                style={{ opacity: 0.8 }}
                className="inline-block rounded-md bg-iris-violet px-4 py-2 my-2 text-sm font-semibold uppercase tracking-wide text-white shadow-md"
              >
                Visiteurs sur invitation uniquement
              </p>

              <div className="mt-4 h-1 w-12 rounded-full bg-iris" />
            </Reveal>

            <div className="mb-5 flex justify-start">
              <PackageRequestDialog />
            </div>

            <RevealGroup className="space-y-3">
              {PACKAGES.map((p) => (
                <RevealItem key={p.name}>
                  <div className="rounded-[8px] bg-[linear-gradient(110deg,oklch(0.67_0.28_300),oklch(0.72_0.18_205),oklch(0.88_0.23_125))] p-px">
                    <div className="grid gap-4 rounded-[7px] bg-[#020839] px-5 py-5 text-white shadow-[0_22px_55px_-32px_rgba(23,81,255,0.8)] md:grid-cols-[1.05fr_2.2fr_auto] md:items-start md:px-8">
                      <h3 className="bg-[linear-gradient(90deg,oklch(0.68_0.28_300)_0%,oklch(0.76_0.20_205)_48%,oklch(0.88_0.23_125)_100%)] bg-clip-text font-display text-lg font-semibold uppercase leading-none text-transparent md:text-xl">
                        {p.name}
                      </h3>
                      <p className="text-sm font-bold leading-snug text-white md:text-base">
                        {p.description}
                      </p>
                      <div className="md:min-w-40 md:text-right">
                        <p className="whitespace-nowrap text-sm text-white/85">{p.price}</p>
                      </div>
                    </div>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>

        {/* CTA */}
        {/* <section className="bg-nav-deep text-nav-deep-foreground">
          <div className="mx-auto max-w-4xl px-4 py-14 text-center md:px-8 md:py-20">
            <h2 className="font-display text-2xl font-bold md:text-4xl">
              Construisons ensemble la résilience numérique de Madagascar
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-nav-deep-foreground/75 md:text-base">
              Notre équipe revient vers vous pour finaliser un partenariat sur mesure.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="bg-iris-cyan text-nav-deep hover:bg-iris-cyan/90">
                <a href="mailto:contact@cirt.gov.mg?subject=Demande%20de%20partenariat%20-%20Symposium%20Cybers%C3%A9curit%C3%A9%20MDG%202026">
                  <Mail className="size-4" /> contact@cirt.gov.mg
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
        </section> */}
      </main>
      <SiteFooter />
    </div>
  );
}
