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
  if (rawServiceAccount) {
    adminApp = admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(rawServiceAccount)),
      projectId: getProjectId(),
    });
    return adminApp;
  }

  adminApp = admin.initializeApp({ projectId: getProjectId() });
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
  if (signInProvider === "facebook.com") return "facebook";
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
    await db.collection(USERS_COLLECTION).doc(decoded.uid).set(
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

    if (existing.exists) {
      return json({ user: quizUserFromDoc(existing.id, existing.data() ?? {}) });
    }

    const provider = providerFromDecodedToken(decoded);
    const email = normalizeEmail(decoded.email ?? "");
    if (!email) {
      return json(
        {
          message:
            provider === "facebook"
              ? "Facebook n'a pas fourni d'email pour ce compte. Utilisez Google ou l'inscription par email."
              : "Account email is required",
        },
        { status: 400 },
      );
    }

    const { firstName, lastName } = splitDisplayName(String(decoded.name ?? ""), email);
    const userDoc = {
      uid: decoded.uid,
      email,
      firstName,
      lastName,
      photoURL: decoded.picture ?? null,
      provider,
      role: "candidate",
      registered: false,
      quizDone: false,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await ref.set(userDoc, { merge: true });

    return json({
      user: {
        id: decoded.uid,
        email,
        firstName,
        lastName,
        role: "candidate",
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
        body.role === "admin" || body.role === "juror" ? (body.role as RoleInviteRole) : null;
      const email = typeof body.email === "string" ? body.email.trim() : "";
      const phone = typeof body.phone === "string" ? body.phone.trim() : "";

      if (!role) return json({ message: "role must be admin or juror" }, { status: 400 });
      if (!email && !phone) return json({ message: "email or phone is required" }, { status: 400 });

      const ref = await db.collection(ROLE_INVITES_COLLECTION).add({
        email,
        emailKey: email ? normalizeEmail(email) : "",
        phone,
        phoneKey: phone ? normalizePhone(phone) : "",
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
              .filter((answer: admin.firestore.DocumentData) => typeof answer?.questionId === "string")
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

      await firestoreAdmin()
        .collection(QUIZ_COLLECTION)
        .doc(id)
        .set(
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

      await firestoreAdmin()
        .collection(QUIZ_COLLECTION)
        .doc(detailMatch[1])
        .set(
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

async function findPendingInvite(email: string, phone: string) {
  const db = firestoreAdmin();
  const emailKey = normalizeEmail(email);
  const phoneKey = normalizePhone(phone);

  const byEmail = emailKey
    ? await db
        .collection(ROLE_INVITES_COLLECTION)
        .where("emailKey", "==", emailKey)
        .where("status", "==", "pending")
        .limit(1)
        .get()
    : null;
  if (byEmail && !byEmail.empty) return byEmail.docs[0];

  const byPhone = phoneKey
    ? await db
        .collection(ROLE_INVITES_COLLECTION)
        .where("phoneKey", "==", phoneKey)
        .where("status", "==", "pending")
        .limit(1)
        .get()
    : null;
  return byPhone && !byPhone.empty ? byPhone.docs[0] : null;
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
    const provider =
      body.provider === "google" || body.provider === "facebook" ? body.provider : "email";

    const invite = await findPendingInvite(email, phone);
    const invitedRole = invite?.data().role as UserRole | undefined;
    const existingRole = decoded.role as UserRole | undefined;
    const role: UserRole =
      invitedRole === "admin" || invitedRole === "juror"
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

      const roleInviteResponse = await handleRoleInvites(request);
      if (roleInviteResponse) return roleInviteResponse;

      const submissionsResponse = await handleSubmissions(request);
      if (submissionsResponse) return submissionsResponse;

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
