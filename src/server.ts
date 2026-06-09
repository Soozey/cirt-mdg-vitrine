import "./lib/error-capture";

import admin from "firebase-admin";
import path from "node:path";
import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import {
  normalizeEmail,
  normalizePhone,
  type RoleInviteRole,
  type UserRole,
} from "./lib/access-control";
import { QUESTIONS, gradeAnswers, sanitizeQuestion } from "./lib/quiz/questions";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;
let adminApp: admin.app.App | undefined;

const CONFIG_DOC = "bootstrap";
const APP_CONFIG_COLLECTION = "appConfig";
const USERS_COLLECTION = "users";
const ROLE_INVITES_COLLECTION = "roleInvites";
const QUIZ_COLLECTION = "quiz";
const PARTNERSHIP_LEADS_COLLECTION = "partnershipLeads";
const EVENT_REGISTRATIONS_COLLECTION = "eventRegistrations";
const MAX_CV_BYTES = 1_000_000;

function json(data: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...(init?.headers ?? {}),
    },
  });
}

function notFoundJson() {
  return json({ message: "Not found" }, { status: 404 });
}

function notFoundHtml() {
  return new Response("Not found", {
    status: 404,
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}

function getProjectId() {
  return (
    process.env.FIREBASE_PROJECT_ID ??
    process.env.VITE_FIREBASE_PROJECT_ID ??
    import.meta.env.VITE_FIREBASE_PROJECT_ID ??
    process.env.GCLOUD_PROJECT ??
    "jobdating-cybersec"
  );
}

function getStorageBucketName() {
  return (
    process.env.FIREBASE_STORAGE_BUCKET ??
    process.env.VITE_FIREBASE_STORAGE_BUCKET ??
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ??
    ""
  );
}

function shouldUseFirebaseEmulator() {
  return (
    process.env.VITE_USE_FIREBASE_EMULATOR === "true" ||
    import.meta.env.VITE_USE_FIREBASE_EMULATOR === "true"
  );
}

function configureFirebaseAdminEnvironment() {
  if (shouldUseFirebaseEmulator()) {
    process.env.FIREBASE_AUTH_EMULATOR_HOST ??= "127.0.0.1:9099";
    process.env.FIRESTORE_EMULATOR_HOST ??= "127.0.0.1:8080";
    return;
  }

  delete process.env.FIREBASE_AUTH_EMULATOR_HOST;
  delete process.env.FIRESTORE_EMULATOR_HOST;

  if (
    process.env.GOOGLE_APPLICATION_CREDENTIALS &&
    !path.isAbsolute(process.env.GOOGLE_APPLICATION_CREDENTIALS)
  ) {
    process.env.GOOGLE_APPLICATION_CREDENTIALS = path.resolve(
      process.cwd(),
      process.env.GOOGLE_APPLICATION_CREDENTIALS,
    );
  }
}

function getAdminApp() {
  configureFirebaseAdminEnvironment();

  if (adminApp) return adminApp;

  if (admin.apps.length) {
    adminApp = admin.app();
    return adminApp;
  }

  const rawServiceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  const storageBucket = getStorageBucketName();
  if (rawServiceAccount) {
    adminApp = admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(rawServiceAccount)),
      projectId: getProjectId(),
      ...(storageBucket ? { storageBucket } : {}),
    });
    return adminApp;
  }

  adminApp = admin.initializeApp({
    projectId: getProjectId(),
    ...(storageBucket ? { storageBucket } : {}),
  });
  return adminApp;
}

function authAdmin() {
  return getAdminApp().auth();
}

function firestoreAdmin() {
  return getAdminApp().firestore();
}

async function isConfigured() {
  const snap = await firestoreAdmin().collection(APP_CONFIG_COLLECTION).doc(CONFIG_DOC).get();
  return snap.exists && snap.data()?.is_configured === true;
}

async function requireSuperadmin(request: Request) {
  const header = request.headers.get("authorization") ?? "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  if (!match) throw Object.assign(new Error("Unauthorized"), { status: 401 });

  const decoded = await authAdmin().verifyIdToken(match[1]);
  if (decoded.role !== "superadmin") {
    throw Object.assign(new Error("Forbidden"), { status: 403 });
  }
  return decoded;
}

async function requireAuth(request: Request) {
  const header = request.headers.get("authorization") ?? "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  if (!match) throw Object.assign(new Error("Unauthorized"), { status: 401 });
  return authAdmin().verifyIdToken(match[1]);
}

async function readJson(request: Request) {
  try {
    return (await request.json()) as Record<string, unknown>;
  } catch {
    return {};
  }
}

function assertString(value: unknown, field: string) {
  if (typeof value !== "string" || !value.trim()) {
    throw Object.assign(new Error(`${field} is required`), { status: 400 });
  }
  return value.trim();
}

function splitDisplayName(name: string, fallbackEmail: string) {
  const fallback = fallbackEmail.split("@")[0] || "Superadmin";
  const [firstName, ...lastNameParts] = (name || fallback).trim().split(/\s+/);
  return {
    firstName: firstName || fallback,
    lastName: lastNameParts.join(" "),
  };
}

function providerFromDecodedToken(decoded: admin.auth.DecodedIdToken) {
  const signInProvider = decoded.firebase?.sign_in_provider;
  if (signInProvider === "google.com") return "google";
  return "email";
}

function quizUserFromDoc(id: string, data: admin.firestore.DocumentData) {
  return {
    id,
    email: data.email ?? "",
    firstName: data.firstName ?? "",
    lastName: data.lastName ?? "",
    phone: data.phone,
    profile: data.profile,
    linkedin: data.linkedinUrl,
    role: data.role ?? "candidate",
    provider: data.provider ?? "email",
    registered: data.registered ?? Boolean(data.phone && data.profile),
  };
}

function timestampToIso(value: unknown) {
  if (typeof value === "string") return value;
  if (
    value &&
    typeof value === "object" &&
    "toDate" in value &&
    typeof value.toDate === "function"
  ) {
    return value.toDate().toISOString();
  }
  return new Date().toISOString();
}

function submissionFromDoc(id: string, data: admin.firestore.DocumentData) {
  return {
    ...data,
    id,
    submittedAt: timestampToIso(data.submittedAt),
    schemaVersion: data.schemaVersion ?? 2,
    quizMode: data.quizMode ?? "qcm",
    status: data.status === "reviewed" ? "reviewed" : "pending",
  };
}

function registrationFromDoc(id: string, data: admin.firestore.DocumentData) {
  return {
    ...data,
    id,
    createdAt: timestampToIso(data.createdAt),
  };
}

function partnershipLeadFromDoc(id: string, data: admin.firestore.DocumentData) {
  return {
    ...data,
    id,
    createdAt: timestampToIso(data.createdAt),
  };
}

function stripUndefined<T extends Record<string, unknown>>(data: T) {
  return Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined),
  ) as Partial<T>;
}

function isStaffRole(role: unknown) {
  return role === "superadmin" || role === "admin" || role === "juror";
}

function canDeleteSubmission(role: unknown) {
  return role === "superadmin" || role === "admin";
}

async function displayNameForUid(uid: string) {
  const snap = await firestoreAdmin().collection(USERS_COLLECTION).doc(uid).get();
  const data = snap.data();
  const fullName = `${data?.firstName ?? ""} ${data?.lastName ?? ""}`.trim();
  return fullName || data?.email || uid;
}

async function handleBootstrap(request: Request) {
  const url = new URL(request.url);
  if (url.pathname === "/api/bootstrap/status" && request.method === "GET") {
    return json({ configured: await isConfigured() });
  }

  if (url.pathname === "/api/bootstrap/google" && request.method === "POST") {
    if (await isConfigured()) return notFoundJson();

    const decoded = await requireAuth(request);
    const signInProvider = decoded.firebase?.sign_in_provider;
    if (signInProvider !== "google.com") {
      return json({ message: "Google OAuth is required" }, { status: 400 });
    }

    const email = normalizeEmail(decoded.email ?? "");
    if (!email) return json({ message: "Google account email is required" }, { status: 400 });

    const { firstName, lastName } = splitDisplayName(String(decoded.name ?? ""), email);
    const db = firestoreAdmin();
    await authAdmin().setCustomUserClaims(decoded.uid, { role: "superadmin" });
    await db
      .collection(USERS_COLLECTION)
      .doc(decoded.uid)
      .set(
        {
          uid: decoded.uid,
          email,
          firstName,
          lastName,
          photoURL: decoded.picture ?? null,
          provider: "google",
          role: "superadmin",
          registered: true,
          quizDone: false,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true },
      );
    await db.collection(APP_CONFIG_COLLECTION).doc(CONFIG_DOC).set({
      is_configured: true,
      superadminUid: decoded.uid,
      configuredAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return json({
      user: {
        id: decoded.uid,
        email,
        firstName,
        lastName,
        role: "superadmin",
        provider: "google",
        registered: true,
      },
    });
  }

  if (url.pathname !== "/api/bootstrap" || request.method !== "POST") return undefined;
  if (await isConfigured()) return notFoundJson();

  const body = await readJson(request);
  const email = normalizeEmail(assertString(body.email, "email"));
  const password = assertString(body.password, "password");
  const firstName = assertString(body.firstName, "firstName");
  const lastName = assertString(body.lastName, "lastName");

  const auth = authAdmin();
  const db = firestoreAdmin();
  const displayName = `${firstName} ${lastName}`;
  let user: admin.auth.UserRecord;

  try {
    user = await auth.createUser({ email, password, displayName, emailVerified: true });
  } catch (error) {
    const code = (error as { code?: string }).code;
    if (code !== "auth/email-already-exists") throw error;
    user = await auth.getUserByEmail(email);
    await auth.updateUser(user.uid, { password, displayName, emailVerified: true });
  }

  await auth.setCustomUserClaims(user.uid, { role: "superadmin" });
  await db.collection(USERS_COLLECTION).doc(user.uid).set(
    {
      uid: user.uid,
      email,
      firstName,
      lastName,
      provider: "email",
      role: "superadmin",
      registered: true,
      quizDone: false,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true },
  );
  await db.collection(APP_CONFIG_COLLECTION).doc(CONFIG_DOC).set({
    is_configured: true,
    superadminUid: user.uid,
    configuredAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return json({ uid: user.uid, email, role: "superadmin" });
}

async function handleAuthSession(request: Request) {
  const url = new URL(request.url);
  if (url.pathname !== "/api/users/session" || request.method !== "POST") return undefined;

  try {
    const decoded = await requireAuth(request);
    const db = firestoreAdmin();
    const ref = db.collection(USERS_COLLECTION).doc(decoded.uid);
    const existing = await ref.get();
    const email = normalizeEmail(decoded.email ?? "");

    if (existing.exists) {
      const data = existing.data() ?? {};
      const invite = await findPendingInvite(email || data.email);
      if (invite) {
        const invitedRole = invite.data().role as UserRole | undefined;
        if (invitedRole === "superadmin" || invitedRole === "admin" || invitedRole === "juror") {
          await authAdmin().setCustomUserClaims(decoded.uid, { role: invitedRole });
          await ref.set(
            {
              role: invitedRole,
              updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            },
            { merge: true },
          );
          await invite.ref.set(
            {
              status: "used",
              usedBy: decoded.uid,
              usedAt: admin.firestore.FieldValue.serverTimestamp(),
            },
            { merge: true },
          );
          const updated = await ref.get();
          return json({ user: quizUserFromDoc(updated.id, updated.data() ?? {}) });
        }
      }

      return json({ user: quizUserFromDoc(existing.id, data) });
    }

    const provider = providerFromDecodedToken(decoded);
    if (!email) {
      return json(
        {
          message: "Google doit fournir une adresse email pour créer le compte.",
        },
        { status: 400 },
      );
    }

    const { firstName, lastName } = splitDisplayName(String(decoded.name ?? ""), email);
    const invite = await findPendingInvite(email);
    const invitedRole = invite?.data().role as UserRole | undefined;
    const role: UserRole =
      invitedRole === "superadmin" || invitedRole === "admin" || invitedRole === "juror"
        ? invitedRole
        : "candidate";
    const userDoc = {
      uid: decoded.uid,
      email,
      firstName,
      lastName,
      photoURL: decoded.picture ?? null,
      provider,
      role,
      registered: false,
      quizDone: false,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await authAdmin().setCustomUserClaims(decoded.uid, { role });
    await ref.set(userDoc, { merge: true });

    if (invite) {
      await invite.ref.set(
        {
          status: "used",
          usedBy: decoded.uid,
          usedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true },
      );
    }

    return json({
      user: {
        id: decoded.uid,
        email,
        firstName,
        lastName,
        role,
        provider,
        registered: false,
      },
    });
  } catch (error) {
    const status = (error as { status?: number }).status ?? 500;
    return json({ message: error instanceof Error ? error.message : "Server error" }, { status });
  }
}

async function handleRoleInvites(request: Request) {
  const url = new URL(request.url);
  if (!url.pathname.startsWith("/api/role-invites")) return undefined;

  try {
    const actor = await requireSuperadmin(request);
    const db = firestoreAdmin();

    if (url.pathname === "/api/role-invites" && request.method === "GET") {
      const snap = await db
        .collection(ROLE_INVITES_COLLECTION)
        .orderBy("createdAt", "desc")
        .limit(100)
        .get();
      return json({ invites: snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) });
    }

    if (url.pathname === "/api/role-invites" && request.method === "POST") {
      const body = await readJson(request);
      const role =
        body.role === "admin" || body.role === "juror" || body.role === "superadmin"
          ? (body.role as RoleInviteRole)
          : null;
      const email = typeof body.email === "string" ? body.email.trim() : "";

      if (!role) {
        return json({ message: "role must be superadmin, admin or juror" }, { status: 400 });
      }
      if (!email) return json({ message: "email is required" }, { status: 400 });

      const ref = await db.collection(ROLE_INVITES_COLLECTION).add({
        email,
        emailKey: normalizeEmail(email),
        phone: "",
        phoneKey: "",
        role,
        status: "pending",
        createdBy: actor.uid,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        usedBy: null,
        usedAt: null,
      });

      return json({ id: ref.id }, { status: 201 });
    }

    const revokeMatch = url.pathname.match(/^\/api\/role-invites\/([^/]+)\/revoke$/);
    if (revokeMatch && request.method === "POST") {
      await db.collection(ROLE_INVITES_COLLECTION).doc(revokeMatch[1]).set(
        {
          status: "revoked",
          revokedAt: admin.firestore.FieldValue.serverTimestamp(),
          revokedBy: actor.uid,
        },
        { merge: true },
      );
      return json({ ok: true });
    }

    return notFoundJson();
  } catch (error) {
    const status = (error as { status?: number }).status ?? 500;
    return json({ message: error instanceof Error ? error.message : "Server error" }, { status });
  }
}

async function handleUserRoles(request: Request) {
  const url = new URL(request.url);
  if (url.pathname !== "/api/users/roles" && !/^\/api\/users\/[^/]+\/roles$/.test(url.pathname)) {
    return undefined;
  }

  try {
    const actor = await requireSuperadmin(request);
    const db = firestoreAdmin();

    if (url.pathname === "/api/users/roles" && request.method === "GET") {
      const snap = await db.collection(USERS_COLLECTION).get();
      const users = snap.docs
        .map((doc) => ({ uid: doc.id, ...doc.data() }))
        .sort((a, b) => {
          const roleOrder: Record<string, number> = {
            superadmin: 0,
            admin: 1,
            juror: 2,
            candidate: 3,
          };
          return (roleOrder[String(a.role)] ?? 99) - (roleOrder[String(b.role)] ?? 99);
        });
      return json({ users });
    }

    const removeRolesMatch = url.pathname.match(/^\/api\/users\/([^/]+)\/roles$/);
    if (removeRolesMatch && request.method === "DELETE") {
      const uid = removeRolesMatch[1];
      if (uid === actor.uid) {
        return json({ message: "Vous ne pouvez pas retirer vos propres rôles." }, { status: 400 });
      }

      const ref = db.collection(USERS_COLLECTION).doc(uid);
      const snap = await ref.get();
      if (!snap.exists) return notFoundJson();

      const data = snap.data() ?? {};
      if (data.role === "superadmin") {
        const superadmins = await db
          .collection(USERS_COLLECTION)
          .where("role", "==", "superadmin")
          .limit(2)
          .get();
        if (superadmins.size <= 1) {
          return json(
            { message: "Impossible de retirer le dernier superadministrateur." },
            { status: 400 },
          );
        }
      }

      await authAdmin().setCustomUserClaims(uid, { role: "candidate" });
      await ref.set(
        {
          role: "candidate",
          rolesRemovedAt: admin.firestore.FieldValue.serverTimestamp(),
          rolesRemovedBy: actor.uid,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true },
      );

      return json({ ok: true });
    }

    return undefined;
  } catch (error) {
    const status = (error as { status?: number }).status ?? 500;
    return json({ message: error instanceof Error ? error.message : "Server error" }, { status });
  }
}

async function handleCurrentUserDeletion(request: Request) {
  const url = new URL(request.url);
  if (url.pathname !== "/api/users/me" || request.method !== "DELETE") return undefined;

  try {
    const decoded = await requireAuth(request);
    if (decoded.role !== "candidate") {
      return json(
        { message: "Seuls les candidats peuvent supprimer leur compte ici." },
        { status: 403 },
      );
    }

    const db = firestoreAdmin();
    const submissions = await db
      .collection(QUIZ_COLLECTION)
      .where("userId", "==", decoded.uid)
      .get();
    const batch = db.batch();
    submissions.docs.forEach((doc) => batch.delete(doc.ref));
    batch.delete(db.collection(USERS_COLLECTION).doc(decoded.uid));
    await batch.commit();

    await authAdmin().deleteUser(decoded.uid);
    return json({ ok: true });
  } catch (error) {
    const status = (error as { status?: number }).status ?? 500;
    return json({ message: error instanceof Error ? error.message : "Server error" }, { status });
  }
}

async function handleSubmissions(request: Request) {
  const url = new URL(request.url);
  if (!url.pathname.startsWith("/api/submissions")) return undefined;

  try {
    const decoded = await requireAuth(request);

    if (url.pathname === "/api/submissions" && request.method === "POST") {
      const body = await readJson(request);
      const submission = body.submission as admin.firestore.DocumentData | undefined;

      if (!submission || typeof submission !== "object") {
        return json({ message: "submission is required" }, { status: 400 });
      }
      if (submission.userId !== decoded.uid) {
        return json({ message: "Forbidden" }, { status: 403 });
      }

      const id = typeof submission.id === "string" ? submission.id : `sub-${Date.now()}`;
      const submittedAt =
        typeof submission.submittedAt === "string"
          ? admin.firestore.Timestamp.fromDate(new Date(submission.submittedAt))
          : admin.firestore.FieldValue.serverTimestamp();
      const submittedQuestions = Array.isArray(submission.questions) ? submission.questions : [];
      const canonicalQuestions = submittedQuestions
        .map((question: admin.firestore.DocumentData) =>
          QUESTIONS.find((item) => item.id === question?.id),
        )
        .filter(Boolean);

      if (!canonicalQuestions.length) {
        return json({ message: "questions are required" }, { status: 400 });
      }

      const selected = Array.isArray(submission.answers)
        ? Object.fromEntries(
            submission.answers
              .filter(
                (answer: admin.firestore.DocumentData) => typeof answer?.questionId === "string",
              )
              .map((answer: admin.firestore.DocumentData) => [
                answer.questionId,
                typeof answer.selectedOptionId === "string" ? answer.selectedOptionId : "",
              ]),
          )
        : {};
      const startedAt =
        typeof submission.startedAt === "number"
          ? submission.startedAt
          : Date.now() - canonicalQuestions.length * 30_000;
      const graded = gradeAnswers(canonicalQuestions, selected, startedAt);
      const sanitizedQuestions = canonicalQuestions.map((question) => sanitizeQuestion(question));

      await firestoreAdmin().collection(QUIZ_COLLECTION).doc(id).set(
        {
          id,
          schemaVersion: 2,
          quizMode: "qcm",
          userId: decoded.uid,
          user: submission.user,
          questions: sanitizedQuestions,
          answers: graded.answers,
          finalScore: graded.finalScore,
          correctCount: graded.correctCount,
          totalQuestions: sanitizedQuestions.length,
          submittedAt,
          status: "pending",
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true },
      );

      await firestoreAdmin().collection(USERS_COLLECTION).doc(decoded.uid).set(
        {
          quizDone: true,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true },
      );

      return json({ id }, { status: 201 });
    }

    const detailMatch = url.pathname.match(/^\/api\/submissions\/([^/]+)$/);
    if (detailMatch && request.method === "GET") {
      const snap = await firestoreAdmin().collection(QUIZ_COLLECTION).doc(detailMatch[1]).get();
      if (!snap.exists) return notFoundJson();

      const submission = submissionFromDoc(snap.id, snap.data() ?? {});
      if (!isStaffRole(decoded.role) && submission.userId !== decoded.uid) {
        return json({ message: "Forbidden" }, { status: 403 });
      }

      return json({ submission });
    }

    if (detailMatch && request.method === "PATCH") {
      if (decoded.role !== "juror") {
        return json({ message: "Forbidden" }, { status: 403 });
      }

      const body = await readJson(request);
      const juryScore = Number(body.juryScore);
      const juryNote = typeof body.juryNote === "string" ? body.juryNote : "";
      const reviewedByName = await displayNameForUid(decoded.uid);
      const reviewedByEmail = normalizeEmail(decoded.email ?? "");

      if (!Number.isFinite(juryScore) || juryScore < 0 || juryScore > 100) {
        return json({ message: "juryScore must be between 0 and 100" }, { status: 400 });
      }

      await firestoreAdmin().collection(QUIZ_COLLECTION).doc(detailMatch[1]).set(
        {
          juryNote,
          juryScore,
          status: "reviewed",
          reviewedBy: decoded.uid,
          reviewedByEmail,
          reviewedByName,
          reviewedAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true },
      );

      const snap = await firestoreAdmin().collection(QUIZ_COLLECTION).doc(detailMatch[1]).get();
      return json({ submission: submissionFromDoc(snap.id, snap.data() ?? {}) });
    }

    if (detailMatch && request.method === "DELETE") {
      if (!canDeleteSubmission(decoded.role)) {
        return json({ message: "Forbidden" }, { status: 403 });
      }

      await firestoreAdmin().collection(QUIZ_COLLECTION).doc(detailMatch[1]).delete();
      return json({ ok: true });
    }

    if (url.pathname !== "/api/submissions" || request.method !== "GET") return notFoundJson();

    if (!isStaffRole(decoded.role)) {
      return json({ message: "Forbidden" }, { status: 403 });
    }

    const snap = await firestoreAdmin()
      .collection(QUIZ_COLLECTION)
      .orderBy("submittedAt", "desc")
      .get();

    return json({ submissions: snap.docs.map((doc) => submissionFromDoc(doc.id, doc.data())) });
  } catch (error) {
    const status = (error as { status?: number }).status ?? 500;
    return json({ message: error instanceof Error ? error.message : "Server error" }, { status });
  }
}

async function handlePartnershipLeads(request: Request) {
  const url = new URL(request.url);
  if (!url.pathname.startsWith("/api/partnership-leads")) return undefined;

  try {
    const db = firestoreAdmin();

    if (url.pathname === "/api/partnership-leads" && request.method === "GET") {
      const decoded = await requireAuth(request);
      if (!isStaffRole(decoded.role)) return json({ message: "Forbidden" }, { status: 403 });

      const snap = await db
        .collection(PARTNERSHIP_LEADS_COLLECTION)
        .orderBy("createdAt", "desc")
        .limit(1000)
        .get();

      return json({ leads: snap.docs.map((doc) => partnershipLeadFromDoc(doc.id, doc.data())) });
    }

    if (url.pathname !== "/api/partnership-leads" || request.method !== "POST") {
      const detailMatch = url.pathname.match(/^\/api\/partnership-leads\/([^/]+)$/);

      if (detailMatch && request.method === "PATCH") {
        const decoded = await requireAuth(request);
        if (!isStaffRole(decoded.role)) return json({ message: "Forbidden" }, { status: 403 });

        const body = await readJson(request);
        const status = typeof body.status === "string" ? body.status : "";
        const allowedStatuses = ["new", "contacted", "qualified", "archived"];
        if (!allowedStatuses.includes(status)) {
          return json({ message: "Statut partenaire invalide." }, { status: 400 });
        }

        const ref = db.collection(PARTNERSHIP_LEADS_COLLECTION).doc(detailMatch[1]);
        await ref.set(
          {
            status,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedBy: decoded.uid,
          },
          { merge: true },
        );
        const snap = await ref.get();
        if (!snap.exists) return notFoundJson();
        return json({ lead: partnershipLeadFromDoc(snap.id, snap.data() ?? {}) });
      }

      if (detailMatch && request.method === "DELETE") {
        const decoded = await requireAuth(request);
        if (decoded.role !== "superadmin" && decoded.role !== "admin") {
          return json({ message: "Forbidden" }, { status: 403 });
        }

        if (url.searchParams.get("mode") === "hard") {
          await db.collection(PARTNERSHIP_LEADS_COLLECTION).doc(detailMatch[1]).delete();
        } else {
          await db.collection(PARTNERSHIP_LEADS_COLLECTION).doc(detailMatch[1]).set(
            {
              deleted: true,
              status: "archived",
              deletedAt: admin.firestore.FieldValue.serverTimestamp(),
              deletedBy: decoded.uid,
              updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            },
            { merge: true },
          );
        }
        return json({ ok: true });
      }

      return notFoundJson();
    }

    const body = await readJson(request);
    const labels: Record<string, string> = {
      phone: "Numéro",
      email: "Email",
      organization: "Nom de la société",
      sector: "Secteur d'activité",
      level: "Niveau de partenariat",
    };
    const requiredLeadString = (field: string) => {
      const value = typeof body[field] === "string" ? body[field].trim() : "";
      if (!value) {
        throw Object.assign(new Error(`${labels[field] ?? field} est requis.`), { status: 400 });
      }
      return value;
    };
    const phone = requiredLeadString("phone");
    const email = normalizeEmail(requiredLeadString("email"));
    const organization = requiredLeadString("organization");
    const sector = requiredLeadString("sector");
    const level = requiredLeadString("level");
    const message = typeof body.message === "string" ? body.message.trim() : "";
    const sourcePackage = typeof body.sourcePackage === "string" ? body.sourcePackage.trim() : "";

    if (!email) return json({ message: "Email invalide." }, { status: 400 });

    const ref = db.collection(PARTNERSHIP_LEADS_COLLECTION).doc();
    const qrCode = `SCM2026-PARTNER-${ref.id}`;
    await ref.set({
      id: ref.id,
      phone,
      email,
      organization,
      sector,
      level,
      message,
      sourcePackage,
      status: "new",
      qrCode,
      qrPayload: JSON.stringify({ event: "SCM2026", id: ref.id, type: "partnership" }),
      deleted: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return json({ id: ref.id, qrCode }, { status: 201 });
  } catch (error) {
    const status = (error as { status?: number }).status ?? 500;
    return json({ message: error instanceof Error ? error.message : "Server error" }, { status });
  }
}

function optionalFormString(form: FormData, field: string) {
  const value = form.get(field);
  return typeof value === "string" ? value.trim() : "";
}

function requiredFormString(form: FormData, field: string) {
  const value = optionalFormString(form, field);
  if (!value) {
    const labels: Record<string, string> = {
      type: "Type de formulaire",
      nom: "Nom",
      prenom: "Prénom",
      email: "Email",
      telephone: "Téléphone",
      privacyConsent: "Politique de confidentialité",
      profil: "Entreprise / Institution",
      fonction: "Fonction",
      typeBillet: "Type de billet",
      invitationCode: "Code VIP / Sponsor",
      statut: "Statut",
      university: "Université",
      participationMode: "Mode de participation",
      teamName: "Nom de l'équipe",
      teamCount: "Nombre de membres",
      technicalProfile: "Profil technique",
      portfolioUrl: "Lien vers le portfolio",
      session: "Session",
      expertiseLevel: "Niveau d'expertise",
    };
    throw Object.assign(new Error(`${labels[field] ?? field} est requis.`), { status: 400 });
  }
  return value;
}

function formBoolean(form: FormData, field: string) {
  return optionalFormString(form, field) === "true";
}

function formNumber(form: FormData, field: string) {
  const raw = optionalFormString(form, field);
  if (!raw) return undefined;
  const value = Number(raw);
  return Number.isFinite(value) ? value : undefined;
}

function parseSkills(form: FormData) {
  const raw = optionalFormString(form, "technicalSkills");
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

async function uploadRegistrationFile(id: string, field: string, file: FormDataEntryValue | null) {
  if (!file || typeof file === "string" || !("arrayBuffer" in file)) return null;

  const fileName = "name" in file && typeof file.name === "string" ? file.name : `${field}.bin`;
  const safeName = fileName.replace(/[^\w.-]+/g, "_");
  const storagePath = `event-registrations/${id}/${field}-${Date.now()}-${safeName}`;
  const bucketName = getStorageBucketName();

  if (!bucketName) {
    return { fileName, storagePath: "", uploadStatus: "bucket-not-configured" };
  }

  const contentType = "type" in file && typeof file.type === "string" ? file.type : undefined;
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    await admin
      .storage()
      .bucket(bucketName)
      .file(storagePath)
      .save(buffer, {
        metadata: contentType ? { contentType } : undefined,
      });

    return { fileName, storagePath, uploadStatus: "stored" };
  } catch (error) {
    console.error("Registration file upload failed", error);
    return { fileName, storagePath: "", uploadStatus: "failed" };
  }
}

async function handleEventRegistrations(request: Request) {
  const url = new URL(request.url);
  if (!url.pathname.startsWith("/api/event-registrations")) return undefined;

  try {
    const db = firestoreAdmin();

    if (url.pathname === "/api/event-registrations" && request.method === "POST") {
      const form = await request.formData();
      const type = requiredFormString(form, "type");
      const allowedTypes = ["visitor", "ctf-hackathon", "job-dating", "workshop", "newsletter"];
      if (!allowedTypes.includes(type)) {
        return json({ message: "type is invalid" }, { status: 400 });
      }

      const nom = requiredFormString(form, "nom");
      const email = normalizeEmail(requiredFormString(form, "email"));
      const telephone = requiredFormString(form, "telephone");
      if (type !== "newsletter" && !formBoolean(form, "privacyConsent")) {
        return json({ message: "privacyConsent is required" }, { status: 400 });
      }

      if (type !== "newsletter") requiredFormString(form, "prenom");
      if (type === "visitor") {
        requiredFormString(form, "profil");
        requiredFormString(form, "fonction");
        const ticket = requiredFormString(form, "typeBillet");
        if (ticket === "Sur invitation") requiredFormString(form, "invitationCode");
      }
      if (type === "ctf-hackathon") {
        const statut = requiredFormString(form, "statut");
        if (statut === "Étudiant") requiredFormString(form, "university");
        const participationMode = requiredFormString(form, "participationMode");
        if (participationMode === "Équipe") {
          requiredFormString(form, "teamName");
          const teamCount = Number(requiredFormString(form, "teamCount"));
          if (!Number.isFinite(teamCount) || teamCount < 3 || teamCount > 5) {
            return json(
              { message: "Le nombre de membres par équipe doit être compris entre 3 et 5." },
              { status: 400 },
            );
          }
        }
      }
      if (type === "job-dating") {
        requiredFormString(form, "technicalProfile");
        requiredFormString(form, "portfolioUrl");
        const cvFile = form.get("cv");
        if (!cvFile || typeof cvFile === "string") {
          return json({ message: "Le CV est requis." }, { status: 400 });
        }
        if ("size" in cvFile && typeof cvFile.size === "number" && cvFile.size >= MAX_CV_BYTES) {
          return json({ message: "Le CV doit peser strictement moins de 1 Mo." }, { status: 400 });
        }
        try {
          new URL(requiredFormString(form, "portfolioUrl"));
        } catch {
          return json(
            { message: "Le lien vers le portfolio doit être une URL valide." },
            { status: 400 },
          );
        }
      }
      if (type === "workshop") {
        requiredFormString(form, "session");
        requiredFormString(form, "expertiseLevel");
      }

      const ref = db.collection(EVENT_REGISTRATIONS_COLLECTION).doc();
      const qrCode = `SCM2026-${type.toUpperCase()}-${ref.id}`;
      const cv = await uploadRegistrationFile(ref.id, "cv", form.get("cv"));
      const typeBillet = optionalFormString(form, "typeBillet");
      const invitationCode = optionalFormString(form, "invitationCode");
      const isInvitation = typeBillet === "Sur invitation";

      const record = {
        id: ref.id,
        type,
        nom,
        prenom: optionalFormString(form, "prenom"),
        email,
        telephone,
        profil: optionalFormString(form, "profil"),
        fonction: optionalFormString(form, "fonction"),
        typeBillet,
        invitationCode,
        paiementStatus: type === "visitor" ? isInvitation : undefined,
        privacyConsent: formBoolean(form, "privacyConsent"),
        newsletterConsent: formBoolean(form, "newsletterConsent"),
        statut: optionalFormString(form, "statut"),
        university: optionalFormString(form, "university"),
        technicalSkills: parseSkills(form),
        participationMode: optionalFormString(form, "participationMode"),
        teamName: optionalFormString(form, "teamName"),
        teamCount: formNumber(form, "teamCount"),
        technicalProfile: optionalFormString(form, "technicalProfile"),
        cvFileName: cv?.fileName ?? "",
        cvStoragePath: cv?.storagePath ?? "",
        cvUploadStatus: cv?.uploadStatus ?? "",
        portfolioUrl: optionalFormString(form, "portfolioUrl"),
        session: optionalFormString(form, "session"),
        expertiseLevel: optionalFormString(form, "expertiseLevel"),
        qrCode,
        qrPayload: JSON.stringify({ event: "SCM2026", id: ref.id, type }),
        badgeStatus: "pending",
        deleted: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      await ref.set(stripUndefined(record));
      const snap = await ref.get();
      return json(
        { registration: registrationFromDoc(snap.id, snap.data() ?? {}) },
        { status: 201 },
      );
    }

    if (url.pathname === "/api/event-registrations" && request.method === "GET") {
      const decoded = await requireAuth(request);
      if (!isStaffRole(decoded.role)) return json({ message: "Forbidden" }, { status: 403 });

      const snap = await db
        .collection(EVENT_REGISTRATIONS_COLLECTION)
        .orderBy("createdAt", "desc")
        .limit(1000)
        .get();
      return json({
        registrations: snap.docs.map((doc) => registrationFromDoc(doc.id, doc.data())),
      });
    }

    const detailMatch = url.pathname.match(/^\/api\/event-registrations\/([^/]+)$/);
    const fileMatch = url.pathname.match(/^\/api\/event-registrations\/([^/]+)\/files\/cv$/);
    if (fileMatch && request.method === "GET") {
      const decoded = await requireAuth(request);
      if (!isStaffRole(decoded.role)) return json({ message: "Forbidden" }, { status: 403 });

      const snap = await db.collection(EVENT_REGISTRATIONS_COLLECTION).doc(fileMatch[1]).get();
      if (!snap.exists) return notFoundJson();
      const data = snap.data() ?? {};
      const storagePath = typeof data.cvStoragePath === "string" ? data.cvStoragePath : "";
      const fileName =
        typeof data.cvFileName === "string" && data.cvFileName ? data.cvFileName : "cv";
      if (!storagePath) {
        return json(
          { message: "Le CV n'est pas disponible au téléchargement. Vérifiez Firebase Storage." },
          { status: 404 },
        );
      }

      const bucketName = getStorageBucketName();
      if (!bucketName)
        return json({ message: "Firebase Storage n'est pas configuré." }, { status: 500 });
      const [buffer] = await admin.storage().bucket(bucketName).file(storagePath).download();
      return new Response(buffer, {
        headers: {
          "content-type": "application/octet-stream",
          "content-disposition": `attachment; filename="${fileName.replace(/"/g, "")}"`,
        },
      });
    }

    if (detailMatch && request.method === "DELETE") {
      const decoded = await requireAuth(request);
      if (decoded.role !== "superadmin" && decoded.role !== "admin") {
        return json({ message: "Forbidden" }, { status: 403 });
      }

      if (url.searchParams.get("mode") === "hard") {
        await db.collection(EVENT_REGISTRATIONS_COLLECTION).doc(detailMatch[1]).delete();
      } else {
        await db.collection(EVENT_REGISTRATIONS_COLLECTION).doc(detailMatch[1]).set(
          {
            deleted: true,
            deletedAt: admin.firestore.FieldValue.serverTimestamp(),
            deletedBy: decoded.uid,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          },
          { merge: true },
        );
      }
      return json({ ok: true });
    }

    return notFoundJson();
  } catch (error) {
    const status = (error as { status?: number }).status ?? 500;
    return json({ message: error instanceof Error ? error.message : "Server error" }, { status });
  }
}

async function findPendingInvite(email: string) {
  const db = firestoreAdmin();
  const emailKey = normalizeEmail(email);

  const byEmail = emailKey
    ? await db
        .collection(ROLE_INVITES_COLLECTION)
        .where("emailKey", "==", emailKey)
        .where("status", "==", "pending")
        .limit(1)
        .get()
    : null;
  return byEmail && !byEmail.empty ? byEmail.docs[0] : null;
}

async function handleFinalizeProfile(request: Request) {
  const url = new URL(request.url);
  if (url.pathname !== "/api/users/finalize-profile" || request.method !== "POST") return undefined;

  try {
    const decoded = await requireAuth(request);
    const body = await readJson(request);
    const email = normalizeEmail(assertString(body.email, "email"));
    const firstName = assertString(body.firstName, "firstName");
    const lastName = assertString(body.lastName, "lastName");
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const profile = typeof body.profile === "string" ? body.profile : "";
    const linkedin = typeof body.linkedin === "string" ? body.linkedin.trim() : "";
    const provider = body.provider === "google" ? body.provider : "email";

    const invite = await findPendingInvite(email);
    const invitedRole = invite?.data().role as UserRole | undefined;
    const existingRole = decoded.role as UserRole | undefined;
    const role: UserRole =
      invitedRole === "superadmin" || invitedRole === "admin" || invitedRole === "juror"
        ? invitedRole
        : existingRole === "superadmin" || existingRole === "admin" || existingRole === "juror"
          ? existingRole
          : "candidate";

    const db = firestoreAdmin();
    await authAdmin().setCustomUserClaims(decoded.uid, { role });

    await db.collection(USERS_COLLECTION).doc(decoded.uid).set(
      {
        uid: decoded.uid,
        email,
        firstName,
        lastName,
        phone,
        profile,
        linkedinUrl: linkedin,
        provider,
        role,
        registered: true,
        quizDone: false,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true },
    );

    if (invite) {
      await invite.ref.set(
        {
          status: "used",
          usedBy: decoded.uid,
          usedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true },
      );
    }

    return json({
      user: {
        id: decoded.uid,
        email,
        firstName,
        lastName,
        phone,
        profile,
        linkedin,
        role,
        provider,
        registered: true,
      },
    });
  } catch (error) {
    const status = (error as { status?: number }).status ?? 500;
    return json({ message: error instanceof Error ? error.message : "Server error" }, { status });
  }
}

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m as { default?: ServerEntry }).default ?? (m as unknown as ServerEntry),
    );
  }
  return serverEntryPromise;
}

function brandedErrorResponse(): Response {
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isCatastrophicSsrErrorBody(body: string, responseStatus: number): boolean {
  let payload: unknown;
  try {
    payload = JSON.parse(body);
  } catch {
    return false;
  }

  if (!payload || Array.isArray(payload) || typeof payload !== "object") {
    return false;
  }

  const fields = payload as Record<string, unknown>;
  const expectedKeys = new Set(["message", "status", "unhandled"]);
  if (!Object.keys(fields).every((key) => expectedKeys.has(key))) {
    return false;
  }

  return (
    fields.unhandled === true &&
    fields.message === "HTTPError" &&
    (fields.status === undefined || fields.status === responseStatus)
  );
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"}; try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isCatastrophicSsrErrorBody(body, response.status)) {
    return response;
  }

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return brandedErrorResponse();
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const url = new URL(request.url);
      if (url.pathname === "/bootstrap" && request.method === "GET" && (await isConfigured())) {
        return notFoundHtml();
      }

      const bootstrapResponse = await handleBootstrap(request);
      if (bootstrapResponse) return bootstrapResponse;

      const authSessionResponse = await handleAuthSession(request);
      if (authSessionResponse) return authSessionResponse;

      const userRolesResponse = await handleUserRoles(request);
      if (userRolesResponse) return userRolesResponse;

      const currentUserDeletionResponse = await handleCurrentUserDeletion(request);
      if (currentUserDeletionResponse) return currentUserDeletionResponse;

      const roleInviteResponse = await handleRoleInvites(request);
      if (roleInviteResponse) return roleInviteResponse;

      const submissionsResponse = await handleSubmissions(request);
      if (submissionsResponse) return submissionsResponse;

      const partnershipLeadsResponse = await handlePartnershipLeads(request);
      if (partnershipLeadsResponse) return partnershipLeadsResponse;

      const eventRegistrationsResponse = await handleEventRegistrations(request);
      if (eventRegistrationsResponse) return eventRegistrationsResponse;

      const finalizeProfileResponse = await handleFinalizeProfile(request);
      if (finalizeProfileResponse) return finalizeProfileResponse;

      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return brandedErrorResponse();
    }
  },
};
