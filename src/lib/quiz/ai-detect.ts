import type { Answer, Question } from "./types";

/**
 * Simulated AI detection. Returns a probability (0-1) that the answer is
 * AI-generated. Replace with a real Anthropic call later.
 */
export async function detectAI(question: Question, answer: string): Promise<number> {
  await new Promise((r) => setTimeout(r, 350));
  const text = answer.trim().toLowerCase();
  if (text.length < 40) return 0.05;
  let score = 0.2;
  const aiMarkers = ["en conclusion", "il est important de noter", "tout d'abord", "deuxièmement", "en résumé"];
  for (const m of aiMarkers) if (text.includes(m)) score += 0.18;
  const avgSentenceLen = text.split(/[.!?]/).filter(Boolean).reduce((a, s) => a + s.length, 0) /
    Math.max(1, text.split(/[.!?]/).filter(Boolean).length);
  if (avgSentenceLen > 140) score += 0.15;
  const punctuationRatio = (text.match(/[,;:]/g)?.length ?? 0) / Math.max(1, text.length);
  if (punctuationRatio > 0.04) score += 0.1;
  return Math.min(0.95, score);
}

export function contentScore(question: Question, answer: string): number {
  const text = answer.trim().toLowerCase();
  if (text.length < 20) return 0;
  const hits = question.keywords.filter((k) => text.includes(k.toLowerCase())).length;
  const ratio = hits / question.keywords.length;
  const lenBonus = Math.min(1, text.length / 400);
  return Math.round((ratio * 0.7 + lenBonus * 0.3) * 100);
}

export function computeFinalScore(answers: Answer[]): { final: number; aiAvg: number; contentAvg: number } {
  if (!answers.length) return { final: 0, aiAvg: 0, contentAvg: 0 };
  const contentAvg = Math.round(answers.reduce((a, x) => a + x.contentScore, 0) / answers.length);
  const aiAvg = answers.reduce((a, x) => a + x.aiScore, 0) / answers.length;
  const aiPenalty = Math.round(aiAvg * 40);
  const final = Math.max(0, Math.min(100, contentAvg - aiPenalty));
  return { final, aiAvg, contentAvg };
}