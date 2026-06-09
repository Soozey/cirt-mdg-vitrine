import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  type DocumentData,
  type QueryConstraint,
} from "firebase/firestore";

import { db } from "./config";

export const COLLECTIONS = {
  users: "users",
  admin: "admin",
  jury: "jury",
  quiz: "quiz",
  roleInvites: "roleInvites",
} as const;

export async function getOne<T = DocumentData>(
  collectionName: string,
  id: string,
): Promise<(T & { id: string }) | null> {
  const snapshot = await getDoc(doc(db, collectionName, id));
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...(snapshot.data() as T) };
}

export async function list<T = DocumentData>(
  collectionName: string,
  ...constraints: QueryConstraint[]
): Promise<Array<T & { id: string }>> {
  const source = constraints.length
    ? query(collection(db, collectionName), ...constraints)
    : collection(db, collectionName);
  const snapshot = await getDocs(source);
  return snapshot.docs.map((item) => ({ id: item.id, ...(item.data() as T) }));
}

export async function upsert<T extends DocumentData>(
  collectionName: string,
  id: string,
  data: T,
): Promise<void> {
  await setDoc(
    doc(db, collectionName, id),
    { ...data, updatedAt: serverTimestamp() },
    { merge: true },
  );
}

export async function create<T extends DocumentData>(
  collectionName: string,
  data: T,
): Promise<string> {
  const ref = await addDoc(collection(db, collectionName), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function update<T extends DocumentData>(
  collectionName: string,
  id: string,
  patch: Partial<T>,
): Promise<void> {
  await updateDoc(doc(db, collectionName, id), { ...patch, updatedAt: serverTimestamp() });
}

export async function remove(collectionName: string, id: string): Promise<void> {
  await deleteDoc(doc(db, collectionName, id));
}

export type UserRole = "superadmin" | "admin" | "juror" | "candidate";

export type UserDoc = {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  profile?: "Étudiant" | "Professionnel" | "Chercheur" | "Indépendant";
  linkedinUrl?: string;
  photoURL?: string | null;
  provider: "google" | "email";
  role: UserRole;
  registered?: boolean;
  quizDone?: boolean;
  registeredAt?: unknown;
};

export const usersApi = {
  get: (uid: string) => getOne<UserDoc>(COLLECTIONS.users, uid),
  upsert: (uid: string, data: Partial<UserDoc>) =>
    upsert(COLLECTIONS.users, uid, { ...data, uid } as DocumentData),
  list: (role?: UserRole) =>
    role
      ? list<UserDoc>(COLLECTIONS.users, where("role", "==", role))
      : list<UserDoc>(COLLECTIONS.users),
  remove: (uid: string) => remove(COLLECTIONS.users, uid),
};

export type AdminAction = {
  id?: string;
  type: string;
  actorId: string;
  payload?: Record<string, unknown>;
  at?: unknown;
};

export const adminApi = {
  list: () => list<AdminAction>(COLLECTIONS.admin, orderBy("at", "desc"), limit(200)),
  log: (action: AdminAction) =>
    create(COLLECTIONS.admin, { ...action, at: serverTimestamp() } as DocumentData),
  remove: (id: string) => remove(COLLECTIONS.admin, id),
};

export type JuryRecord = {
  id?: string;
  submissionId: string;
  jurorId: string;
  jurorName: string;
  score: number;
  note: string;
  decision: "accepted" | "rejected" | "review";
  decidedAt?: unknown;
};

export const juryApi = {
  list: () => list<JuryRecord>(COLLECTIONS.jury, orderBy("decidedAt", "desc")),
  listByJuror: (jurorId: string) =>
    list<JuryRecord>(COLLECTIONS.jury, where("jurorId", "==", jurorId)),
  listBySubmission: (submissionId: string) =>
    list<JuryRecord>(COLLECTIONS.jury, where("submissionId", "==", submissionId)),
  create: (record: JuryRecord) =>
    create(COLLECTIONS.jury, { ...record, decidedAt: serverTimestamp() } as DocumentData),
  remove: (id: string) => remove(COLLECTIONS.jury, id),
};
