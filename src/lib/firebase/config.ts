import { initializeApp, getApp, getApps, type FirebaseApp } from "firebase/app";
import { connectAuthEmulator, getAuth, type Auth } from "firebase/auth";
import {
  getFirestore,
  initializeFirestore,
  memoryLocalCache,
  persistentLocalCache,
  persistentMultipleTabManager,
  type Firestore,
  type FirestoreSettings,
} from "firebase/firestore";

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? "REPLACE_ME_API_KEY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? "REPLACE_ME.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? "REPLACE_ME_PROJECT_ID",
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? "REPLACE_ME_APP_ID",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? "REPLACE_ME_SENDER_ID",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? "REPLACE_ME.appspot.com",
};

export const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth: Auth = getAuth(app);

const useFirebaseEmulator = import.meta.env.VITE_USE_FIREBASE_EMULATOR === "true";

function createFirestoreInstance(): Firestore {
  const settings: FirestoreSettings = {
    ...(useFirebaseEmulator ? { host: "127.0.0.1:8080", ssl: false } : {}),
    localCache:
      typeof window === "undefined"
        ? memoryLocalCache()
        : persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
  };

  try {
    return initializeFirestore(app, settings);
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "failed-precondition"
    ) {
      return getFirestore(app);
    }

    throw error;
  }
}

export const db: Firestore = createFirestoreInstance();

export function bindFirebaseLocalServicesOnce() {
  if (typeof window === "undefined") return;
  if (!useFirebaseEmulator) return;

  try {
    connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
    console.info("[firebase] Connected to local emulators (auth:9099, firestore:8080)");
  } catch (error) {
    console.warn("[firebase] Emulator binding failed:", error);
  }
}

bindFirebaseLocalServicesOnce();
