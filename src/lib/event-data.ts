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
    slug: "ctf-hackathon",
    title: "CTF & HACKATHON",
    kicker: "Challenge",
    summary:
      "CTF et Hackathon Cyber organisés le 22 juin pour étudiants et jeunes professionnels.",
    description:
      "CTF (Capture The Flag) et Hackathon Cyber organisés le 22 juin pour étudiants et jeunes professionnels. Épreuves techniques en conditions réelles : pentest, forensique, IA, dev sécurité. Plateforme de détection et de valorisation des talents cyber du territoire.",
  },
  {
    slug: "exposition-networking",
    title: "EXPOSITION & NETWORKING",
    kicker: "Partenaires",
    summary: "Espaces partenaires, plénière,\ndémonstrations live.",
    description:
      "Un espace commun pour les stands partenaires, la plénière, les démonstrations live et les temps de networking avec les acteurs de l'écosystème cyber malgache.",
  },
  {
    slug: "job-dating",
    title: "Job Dating",
    kicker: "Carrière",
    summary: "Opportunités partenaires.",
    description:
      "Des entretiens courts (10 à 15 min) entre candidats et recruteurs des entreprises engagées dans la cybersécurité à Madagascar et à l'international.",
  },
  {
    slug: "conferences",
    title: "CONFÉRENCES & TABLES RONDES",
    kicker: "Conférences",
    summary: "Experts nationaux & internationaux",
    description:
      "Sessions plénières et panels thématiques pour décrypter les cybermenaces, l'IA défensive, la réglementation locale et la coopération régionale.",
  },
  {
    slug: "programme",
    title: "Programme",
    kicker: "Agenda",
    summary: "Les deux journées du Symposium, temps fort par temps fort.",
    description:
      "Le programme officiel réunit cérémonies, conférences, ateliers techniques, CTF, Hackathon, Job Dating, networking et remise des prix sur deux journées.",
  },
  {
    slug: "ateliers",
    title: "ATELIERS & MASTERCLASS",
    kicker: "Pratique",
    summary: "Sessions pratiques : sécurité des systèmes, gestion de cyber-crise, sensibilisation et démonstrations.",
    description:
      "Des ateliers pratiques animés par des experts pour manipuler les outils du terrain : SIEM, EDR, forensic, hardening systèmes & réseaux, réponse à incident.",
  },
];

export const THEMES = [
  { label: "Axe juridique", hint: "Cadre légal & gouvernance" },
  { label: "Axe opérationnel / SOC", hint: "Détection & réponse" },
  { label: "Axe technique", hint: "Architectures & défense" },
  { label: "Sensibilisation & formation", hint: "Culture cyber" },
  { label: "Coopération internationale", hint: "Échanges & alliances" },
];
