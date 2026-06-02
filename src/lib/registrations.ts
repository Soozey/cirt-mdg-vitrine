export type RegistrationType =
  | "visitor"
  | "ctf-hackathon"
  | "job-dating"
  | "workshop"
  | "newsletter";

export type RegistrationRecord = {
  id: string;
  type: RegistrationType;
  nom: string;
  prenom?: string;
  email: string;
  telephone: string;
  profil?: string;
  fonction?: string;
  typeBillet?: string;
  invitationCode?: string;
  paiementStatus?: boolean;
  newsletterConsent?: boolean;
  privacyConsent?: boolean;
  statut?: string;
  university?: string;
  technicalSkills?: string[];
  participationMode?: string;
  teamName?: string;
  teamCount?: number;
  technicalProfile?: string;
  cvFileName?: string;
  cvStoragePath?: string;
  cvUploadStatus?: string;
  portfolioUrl?: string;
  session?: string;
  expertiseLevel?: string;
  qrCode?: string;
  badgeStatus?: "pending" | "generated";
  deleted?: boolean;
  createdAt?: string;
};

export const REGISTRATION_LABELS: Record<RegistrationType, string> = {
  visitor: "Visiteur",
  "ctf-hackathon": "CTF & Hackathon",
  "job-dating": "Job Dating",
  workshop: "Ateliers & Masterclass",
  newsletter: "Newsletter",
};

export const REGISTRATION_OPTIONS = {
  visitorProfiles: ["Entreprise", "Institution", "Université", "Indépendant"],
  visitorFunctions: ["RSSI", "DSI", "Décideur", "Acheteur", "Consultant", "Autre"],
  ticketTypes: ["Billet Visiteur (1 000 000 Ar)", "Sur invitation"],
  statuses: ["Étudiant", "Jeune professionnel"],
  skills: ["Pentest", "Forensic", "IA", "DevSec"],
  participationModes: ["Individuel", "Équipe"],
  technicalProfiles: ["Analyste", "Auditeur", "Juriste cyber", "Pentester", "SOC", "DevSecOps"],
  sessions: ["SIEM", "Forensic", "Hardening", "Réponse à incident", "Malware analysis"],
  expertiseLevels: ["Débutant", "Intermédiaire", "Avancé"],
} as const;
