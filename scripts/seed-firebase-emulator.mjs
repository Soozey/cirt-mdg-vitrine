import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import admin from "firebase-admin";

process.env.FIREBASE_AUTH_EMULATOR_HOST ??= "127.0.0.1:9099";
process.env.FIRESTORE_EMULATOR_HOST ??= "127.0.0.1:8080";

function readProjectId() {
  try {
    const raw = readFileSync(resolve(".firebaserc"), "utf8");
    const rc = JSON.parse(raw);
    return rc.projects?.default ?? "jobdating-cybersec";
  } catch {
    return "jobdating-cybersec";
  }
}

const projectId = process.env.FIREBASE_PROJECT_ID ?? readProjectId();

admin.initializeApp({ projectId });

const auth = admin.auth();
const db = admin.firestore();

const users = [
  {
    uid: "local-superadmin",
    email: "superadmin@local.dev",
    password: "superadmin123",
    displayName: "Superadmin Local",
    provider: "email",
    role: "superadmin",
    firstName: "Superadmin",
    lastName: "Local",
    providerData: [],
  },
  {
    uid: "local-google-candidate",
    email: "google.candidate@local.dev",
    password: "candidate123",
    displayName: "Google Candidate",
    provider: "google",
    role: "candidate",
    firstName: "Google",
    lastName: "Candidate",
    phone: "+261 34 11 111 11",
    profile: "Étudiant",
    linkedinUrl: "linkedin.com/in/google-candidate-local",
    providerData: [
      {
        providerId: "google.com",
        uid: "google-candidate-local",
        email: "google.candidate@local.dev",
        displayName: "Google Candidate",
        photoURL: "https://lh3.googleusercontent.com/a/local-google-candidate",
      },
    ],
  },
  {
    uid: "local-facebook-candidate",
    email: "facebook.candidate@local.dev",
    password: "candidate123",
    displayName: "Facebook Candidate",
    provider: "facebook",
    role: "candidate",
    firstName: "Facebook",
    lastName: "Candidate",
    phone: "+261 34 22 222 22",
    profile: "Professionnel",
    linkedinUrl: "linkedin.com/in/facebook-candidate-local",
    providerData: [
      {
        providerId: "facebook.com",
        uid: "facebook-candidate-local",
        email: "facebook.candidate@local.dev",
        displayName: "Facebook Candidate",
        photoURL: "https://graph.facebook.com/local-facebook-candidate/picture",
      },
    ],
  },
  {
    uid: "local-email-candidate",
    email: "candidate@local.dev",
    password: "candidate123",
    displayName: "Email Candidate",
    provider: "email",
    role: "candidate",
    firstName: "Email",
    lastName: "Candidate",
    phone: "+261 34 33 333 33",
    profile: "Chercheur",
    linkedinUrl: "linkedin.com/in/email-candidate-local",
    providerData: [],
  },
  {
    uid: "local-juror",
    email: "jury@local.dev",
    password: "jury123",
    displayName: "Jury Local",
    provider: "email",
    role: "juror",
    firstName: "Jury",
    lastName: "Local",
    providerData: [],
  },
  {
    uid: "local-admin",
    email: "admin@local.dev",
    password: "admin123",
    displayName: "Admin Local",
    provider: "email",
    role: "admin",
    firstName: "Admin",
    lastName: "Local",
    providerData: [],
  },
];

async function deleteIfExists(uid) {
  try {
    await auth.deleteUser(uid);
  } catch (error) {
    if (error?.code !== "auth/user-not-found") throw error;
  }
}

for (const user of users) {
  await deleteIfExists(user.uid);
}

const superadmin = users.find((user) => user.role === "superadmin");
if (superadmin) {
  await db.collection("appConfig").doc("bootstrap").set(
    {
      is_configured: true,
      superadminUid: superadmin.uid,
      configuredAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true },
  );
}

await auth.importUsers(
  users.map((user) => ({
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    emailVerified: true,
    providerData: user.providerData,
  })),
);

for (const user of users) {
  await auth.updateUser(user.uid, { password: user.password });
  await auth.setCustomUserClaims(user.uid, { role: user.role });
  await db
    .collection("users")
    .doc(user.uid)
    .set(
      {
        uid: user.uid,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone ?? "",
        profile: user.profile ?? "Professionnel",
        linkedinUrl: user.linkedinUrl ?? "",
        provider: user.provider,
        role: user.role,
        registered: true,
        quizDone: false,
        seededAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true },
    );
}

console.info(`Firebase emulator seeded for project "${projectId}".`);
console.info("Comptes disponibles:");
for (const user of users) {
  console.info(
    `- ${user.role.padEnd(9)} ${user.provider.padEnd(8)} ${user.email} / ${user.password}`,
  );
}
