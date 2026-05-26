export type UserRole = "candidate" | "juror" | "admin" | "superadmin";

export type QuizUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  profile?: "Étudiant" | "Professionnel" | "Chercheur" | "Indépendant";
  linkedin?: string;
  role: UserRole;
  provider: "google" | "facebook" | "email";
  avatarColor?: string;
  registered?: boolean;
};

export type Domain = "Réseaux" | "Web" | "Cryptographie" | "Forensics" | "Reverse";
export type Level = "Débutant" | "Intermédiaire" | "Avancé";

export type Question = {
  id: string;
  domain: Domain;
  level: Level;
  text: string;
  keywords: string[];
};

export type Answer = {
  questionId: string;
  text: string;
  aiScore: number;
  contentScore: number;
  durationMs: number;
};

export type Submission = {
  id: string;
  userId: string;
  user: QuizUser;
  questions: Question[];
  answers: Answer[];
  finalScore: number;
  aiAverage: number;
  juryNote?: string;
  juryScore?: number;
  reviewedBy?: string;
  reviewedByEmail?: string;
  reviewedByName?: string;
  submittedAt: string;
  status: "pending" | "reviewed";
};
