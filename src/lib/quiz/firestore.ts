import type { Submission } from "./types";
import { QUESTIONS } from "./questions";

/**
 * Mock Firestore abstraction. Persists to localStorage so the demo is
 * usable end-to-end without a backend. Swap with real Firestore later.
 */
const KEY = "quiz_submissions_v1";
const SEED_VERSION_KEY = "quiz_submissions_seed_v";
const SEED_VERSION = "3";

function read(): Submission[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

function write(list: Submission[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(list));
}

export const submissionsApi = {
  list(): Submission[] {
    return read();
  },
  get(id: string): Submission | undefined {
    return read().find((s) => s.id === id);
  },
  save(sub: Submission) {
    const list = read();
    const i = list.findIndex((s) => s.id === sub.id);
    if (i >= 0) list[i] = sub;
    else list.unshift(sub);
    write(list);
  },
  remove(id: string) {
    write(read().filter((s) => s.id !== id));
  },
};

type Candidate = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profile: "Étudiant" | "Professionnel" | "Chercheur" | "Indépendant";
  provider: "google" | "facebook" | "email";
  avatarColor: string;
  finalScore: number;
  aiAverage: number;
  daysAgo: number;
  status: "pending" | "reviewed";
  juryScore?: number;
  juryNote?: string;
};

const CANDIDATES: Candidate[] = [
  { id: "c-001", firstName: "Jean", lastName: "Dupont", email: "jean.dupont@cyber.io", profile: "Étudiant", provider: "google", avatarColor: "oklch(0.55 0.22 265)", finalScore: 82, aiAverage: 0.12, daysAgo: 1, status: "pending" },
  { id: "c-002", firstName: "Marie", lastName: "Rasoa", email: "marie.rasoa@cyber.io", profile: "Professionnel", provider: "facebook", avatarColor: "oklch(0.65 0.18 320)", finalScore: 67, aiAverage: 0.41, daysAgo: 0.04, status: "reviewed", juryScore: 70, juryNote: "Bonnes bases, à challenger sur la partie cryptographie." },
  { id: "c-003", firstName: "Tahina", lastName: "Andriamana", email: "tahina.a@cirt.mg", profile: "Professionnel", provider: "email", avatarColor: "oklch(0.6 0.2 30)", finalScore: 91, aiAverage: 0.08, daysAgo: 2, status: "pending" },
  { id: "c-004", firstName: "Hery", lastName: "Rakoto", email: "hery.rakoto@cyber.io", profile: "Étudiant", provider: "google", avatarColor: "oklch(0.7 0.15 184)", finalScore: 58, aiAverage: 0.62, daysAgo: 3, status: "pending" },
  { id: "c-005", firstName: "Lalaina", lastName: "Razafy", email: "lalaina@cyber.io", profile: "Chercheur", provider: "email", avatarColor: "oklch(0.55 0.22 280)", finalScore: 88, aiAverage: 0.18, daysAgo: 4, status: "reviewed", juryScore: 86, juryNote: "Excellent niveau technique, vision claire en forensics." },
  { id: "c-006", firstName: "Naina", lastName: "Ramiandra", email: "naina@cyber.io", profile: "Indépendant", provider: "facebook", avatarColor: "oklch(0.62 0.2 145)", finalScore: 74, aiAverage: 0.27, daysAgo: 0.5, status: "pending" },
  { id: "c-007", firstName: "Fanja", lastName: "Andrianjafy", email: "fanja@cyber.io", profile: "Étudiant", provider: "google", avatarColor: "oklch(0.6 0.2 50)", finalScore: 49, aiAverage: 0.71, daysAgo: 5, status: "reviewed", juryScore: 45, juryNote: "Réponses trop génériques, signaux IA élevés." },
  { id: "c-008", firstName: "Mialy", lastName: "Andrianasolo", email: "mialy@cyber.io", profile: "Professionnel", provider: "email", avatarColor: "oklch(0.55 0.22 220)", finalScore: 79, aiAverage: 0.22, daysAgo: 6, status: "pending" },
  { id: "c-009", firstName: "Rivo", lastName: "Randrianarivelo", email: "rivo@cyber.io", profile: "Professionnel", provider: "google", avatarColor: "oklch(0.5 0.2 10)", finalScore: 65, aiAverage: 0.38, daysAgo: 7, status: "reviewed", juryScore: 68, juryNote: "Bon réseau, à approfondir sur Web/CSP." },
  { id: "c-010", firstName: "Antso", lastName: "Rakotoarisoa", email: "antso@cyber.io", profile: "Étudiant", provider: "facebook", avatarColor: "oklch(0.6 0.2 305)", finalScore: 72, aiAverage: 0.31, daysAgo: 8, status: "pending" },
  { id: "c-011", firstName: "Tiana", lastName: "Razanadrakoto", email: "tiana@cyber.io", profile: "Chercheur", provider: "email", avatarColor: "oklch(0.55 0.22 90)", finalScore: 95, aiAverage: 0.05, daysAgo: 9, status: "reviewed", juryScore: 94, juryNote: "Profil exceptionnel, recommandé en priorité." },
  { id: "c-012", firstName: "Soa", lastName: "Andriantsoa", email: "soa@cyber.io", profile: "Indépendant", provider: "google", avatarColor: "oklch(0.6 0.2 200)", finalScore: 60, aiAverage: 0.48, daysAgo: 10, status: "pending" },
];

function buildSubmission(c: Candidate): Submission {
  const qs = QUESTIONS.slice(0, 5);
  return {
    id: `sub-${c.id}`,
    userId: c.id,
    user: {
      id: c.id,
      email: c.email,
      firstName: c.firstName,
      lastName: c.lastName,
      profile: c.profile,
      role: "candidate",
      provider: c.provider,
      avatarColor: c.avatarColor,
      registered: true,
    },
    questions: qs,
    answers: qs.map((q) => ({
      questionId: q.id,
      text: `Réponse de démonstration pour la question ${q.id}. ${q.keywords.slice(0, 3).join(", ")}.`,
      aiScore: c.aiAverage,
      contentScore: Math.min(100, c.finalScore + Math.round((Math.random() - 0.5) * 10)),
      durationMs: 45_000 + Math.round(Math.random() * 30_000),
    })),
    finalScore: c.finalScore,
    aiAverage: c.aiAverage,
    submittedAt: new Date(Date.now() - c.daysAgo * 86_400_000).toISOString(),
    status: c.status,
    juryScore: c.juryScore,
    juryNote: c.juryNote,
  };
}

export function seedDemoSubmissions() {
  if (typeof window === "undefined") return;
  const currentVersion = localStorage.getItem(SEED_VERSION_KEY);
  if (currentVersion === SEED_VERSION && read().length > 0) return;
  const demo = CANDIDATES.map(buildSubmission);
  write(demo);
  localStorage.setItem(SEED_VERSION_KEY, SEED_VERSION);
}
