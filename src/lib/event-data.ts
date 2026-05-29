export const CIRT_WEBSITE = "https://cirt.gov.mg/";
export const EVENT_DATE = new Date("2026-06-22T00:00:00+03:00");

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
  {
    slug: "hackathon",
    title: "Hackathon Cybersécurité",
    kicker: "Challenge",
    summary: "24 à 48 heures de challenge non-stop pour coder la résilience.",
    description:
      "Un marathon de code dédié à la cybersécurité où équipes pluridisciplinaires prototypent des solutions concrètes : détection, réponse à incident, sensibilisation, souveraineté numérique.",
  },
  {
    slug: "job-dating",
    title: "Job Dating Tech",
    kicker: "Carrière",
    summary: "Rencontres express entre talents et employeurs du secteur cyber.",
    description:
      "Des entretiens courts (10 à 15 min) entre candidats et recruteurs des entreprises engagées dans la cybersécurité à Madagascar et à l'international.",
  },
  {
    slug: "conferences",
    title: "Conférences & Panels",
    kicker: "Programme",
    summary: "Experts et tables rondes sur les enjeux du cyber-espace.",
    description:
      "Sessions plénières et panels thématiques pour décrypter les cybermenaces, l'IA défensive, la réglementation locale et la coopération régionale.",
  },
  {
    slug: "ateliers",
    title: "Ateliers Techniques",
    kicker: "Pratique",
    summary: "Sessions immersives : SIEM, forensic, hardening, malware.",
    description:
      "Des ateliers pratiques animés par des experts pour manipuler les outils du terrain : SIEM, EDR, forensic, hardening systèmes & réseaux, réponse à incident.",
  },
  {
    slug: "village-partenaires",
    title: "Village Partenaires",
    kicker: "Exposition",
    summary: "Démonstrations et innovations des acteurs du secteur.",
    description:
      "Un espace d'exposition où partenaires publics et privés présentent leurs solutions : EDR, SIEM, SOC, souveraineté numérique et services managés.",
  },
  {
    slug: "networking",
    title: "Networking",
    kicker: "Rencontres",
    summary: "Pauses café, déjeuners et matchmaking pour développer son réseau.",
    description:
      "Des moments dédiés aux rencontres entre étudiants, entreprises, institutions publiques et experts internationaux pour faire émerger les collaborations de demain.",
  },
];

export const THEMES = [
  { label: "Axe juridique", hint: "Cadre légal & gouvernance" },
  { label: "Axe opérationnel / SOC", hint: "Détection & réponse" },
  { label: "Axe technique", hint: "Architectures & défense" },
  { label: "Sensibilisation & formation", hint: "Culture cyber" },
  { label: "Coopération internationale", hint: "Échanges & alliances" },
];
