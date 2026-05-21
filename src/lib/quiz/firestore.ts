import type { Submission } from "./types";

/**
 * Mock Firestore abstraction. Persists to localStorage so the demo is
 * usable end-to-end without a backend. Swap with real Firestore later.
 */
const KEY = "quiz_submissions_v1";

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

export function seedDemoSubmissions() {
  if (typeof window === "undefined") return;
  if (read().length > 0) return;
  const demo: Submission[] = [
    {
      id: "demo-1",
      userId: "u-candidate",
      user: {
        id: "u-candidate",
        email: "jean@cyber.io",
        firstName: "Jean",
        lastName: "Dupont",
        phone: "+261 34 12 345 67",
        profile: "Étudiant",
        role: "candidate",
        provider: "google",
        registered: true,
      },
      questions: [],
      answers: [],
      finalScore: 82,
      aiAverage: 0.12,
      submittedAt: new Date(Date.now() - 86400000).toISOString(),
      status: "pending",
    },
    {
      id: "demo-2",
      userId: "u-other",
      user: {
        id: "u-other",
        email: "marie@cyber.io",
        firstName: "Marie",
        lastName: "Rasoa",
        profile: "Professionnel",
        role: "candidate",
        provider: "facebook",
        registered: true,
      },
      questions: [],
      answers: [],
      finalScore: 67,
      aiAverage: 0.41,
      submittedAt: new Date(Date.now() - 3600_000).toISOString(),
      status: "reviewed",
      juryScore: 70,
      juryNote: "Bonnes bases, à challenger sur la partie cryptographie.",
    },
  ];
  write(demo);
}