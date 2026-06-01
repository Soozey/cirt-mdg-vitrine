import {
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  collection,
  type DocumentData,
} from "firebase/firestore";

import { db } from "@/lib/firebase/config";
import { COLLECTIONS } from "@/lib/firebase/firestore";
import type { Submission } from "./types";

function timestampToIso(value: unknown): string {
  if (value instanceof Timestamp) return value.toDate().toISOString();
  if (typeof value === "string") return value;
  return new Date().toISOString();
}

function fromFirestore(id: string, data: DocumentData): Submission {
  return {
    ...(data as Submission),
    id,
    submittedAt: timestampToIso(data.submittedAt),
    schemaVersion: data.schemaVersion ?? 2,
    quizMode: data.quizMode ?? "qcm",
    status: data.status === "reviewed" ? "reviewed" : "pending",
  };
}

function toFirestore(submission: Submission): DocumentData {
  return {
    ...submission,
    submittedAt: submission.submittedAt
      ? Timestamp.fromDate(new Date(submission.submittedAt))
      : serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
}

export const submissionsApi = {
  async list(): Promise<Submission[]> {
    const snapshot = await getDocs(
      query(collection(db, COLLECTIONS.quiz), orderBy("submittedAt", "desc")),
    );
    return snapshot.docs.map((item) => fromFirestore(item.id, item.data()));
  },

  async get(id: string): Promise<Submission | null> {
    const snapshot = await getDoc(doc(db, COLLECTIONS.quiz, id));
    if (!snapshot.exists()) return null;
    return fromFirestore(snapshot.id, snapshot.data());
  },

  async save(submission: Submission): Promise<void> {
    await setDoc(doc(db, COLLECTIONS.quiz, submission.id), toFirestore(submission), {
      merge: true,
    });
  },

  async review(
    id: string,
    patch: Pick<Submission, "juryNote" | "juryScore" | "status">,
  ): Promise<void> {
    await updateDoc(doc(db, COLLECTIONS.quiz, id), { ...patch, updatedAt: serverTimestamp() });
  },

  async remove(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTIONS.quiz, id));
  },
};
