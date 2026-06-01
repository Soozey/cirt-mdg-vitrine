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
  options: QuizOption[];
  correctOptionId: string;
  explanation: string;
};

export type QuizOption = {
  id: string;
  text: string;
};

export type Answer = {
  questionId: string;
  selectedOptionId: string;
  selectedOptionText: string;
  correctOptionId: string;
  isCorrect: boolean;
  points: number;
  durationMs: number;
};

export type Submission = {
  id: string;
  schemaVersion: 2;
  quizMode: "qcm";
  userId: string;
  user: QuizUser;
  questions: Question[];
  answers: Answer[];
  finalScore: number;
  juryNote?: string;
  juryScore?: number;
  reviewedBy?: string;
  reviewedByEmail?: string;
  reviewedByName?: string;
  submittedAt: string;
  status: "pending" | "reviewed";
};
