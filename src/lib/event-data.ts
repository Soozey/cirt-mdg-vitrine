export const CIRT_WEBSITE = "https://cirt.gov.mg/";
export const EVENT_DATE = new Date("2026-05-23T00:00:00+03:00");

export type InfoPage = {
  slug: string;
  title: string;
  kicker: string;
  summary: string;
  description: string;
  externalPending?: boolean;
};

export const INFO_PAGES: InfoPage[] = [
  {
    slug: "2-jours",
    title: "2 jours",
    kicker: "Format",
    summary: "Deux journées dédiées à la cybersécurité et à la confiance numérique.",
    description:
      "Deux journées consacrées à la cybersécurité, à la confiance numérique et aux échanges professionnels entre les acteurs publics, privés et académiques de Madagascar.",
  },
  {
    slug: "5-axes-thematiques",
    title: "5 axes thématiques",
    kicker: "Programme",
    summary: "Juridique, opérationnel, technique, sensibilisation et coopération.",
    description:
      "Les axes structurent les interventions autour des enjeux juridiques, opérationnels, techniques, pédagogiques et internationaux de la résilience numérique.",
  },
  {
    slug: "experts",
    title: "Experts nationaux et internationaux",
    kicker: "Intervenants",
    summary: "Un cadre pensé pour réunir expertises locales et internationales.",
    description:
      "Un cadre prévu pour réunir des expertises locales et internationales autour de la résilience numérique et du partage d'expérience opérationnelle.",
  },
  {
    slug: "cyberdrill-national",
    title: "Cyberdrill National",
    kicker: "Exercice",
    summary: "Un espace opérationnel de préparation aux incidents cyber.",
    description:
      "Un espace dédié à l'exercice opérationnel et à la préparation des acteurs face aux incidents cyber, en conditions proches du réel.",
  },
  {
    slug: "ctf-etudiant",
    title: "CTF étudiant",
    kicker: "Compétition",
    summary: "Le CTF étudiant disposera d'un site dédié.",
    description:
      "Le CTF étudiant sera relié à un site dédié dès que le lien officiel sera disponible. Une compétition pensée pour révéler les talents de demain.",
    externalPending: true,
  },
  {
    slug: "espace-exposition",
    title: "Espace exposition",
    kicker: "Networking",
    summary: "Un espace pour les échanges et les rencontres partenaires.",
    description:
      "Un espace prévu pour les échanges, la visibilité institutionnelle et les rencontres avec les partenaires de l'écosystème cyber malgache.",
  },
];

export const THEMES = [
  { label: "Axe juridique", hint: "Cadre légal & gouvernance" },
  { label: "Axe opérationnel / SOC", hint: "Détection & réponse" },
  { label: "Axe technique", hint: "Architectures & défense" },
  { label: "Sensibilisation & formation", hint: "Culture cyber" },
  { label: "Coopération internationale", hint: "Échanges & alliances" },
];