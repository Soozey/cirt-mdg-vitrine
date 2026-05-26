import {
  createUserWithEmailAndPassword,
  FacebookAuthProvider,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";

import { auth } from "./config";

export type AuthProviderId = "google" | "facebook" | "email";

export type AuthUser = {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  provider: AuthProviderId;
};

function providerFromFirebaseUser(user: User): AuthProviderId {
  const providerId = user.providerData[0]?.providerId ?? "password";
  if (providerId.includes("google")) return "google";
  if (providerId.includes("facebook")) return "facebook";
  return "email";
}

function normalize(
  user: User,
  provider: AuthProviderId = providerFromFirebaseUser(user),
): AuthUser {
  return {
    uid: user.uid,
    email: user.email ?? "",
    displayName: user.displayName ?? "",
    photoURL: user.photoURL,
    provider,
  };
}

const googleProvider = new GoogleAuthProvider();
googleProvider.addScope("email");
googleProvider.addScope("profile");

const facebookProvider = new FacebookAuthProvider();

export async function loginWithGoogle(): Promise<AuthUser> {
  const result = await signInWithPopup(auth, googleProvider);
  return normalize(result.user, "google");
}

export async function loginWithFacebook(): Promise<AuthUser> {
  const result = await signInWithPopup(auth, facebookProvider);
  return normalize(result.user, "facebook");
}

export async function loginUser(email: string, password: string): Promise<AuthUser> {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return normalize(result.user, "email");
}

export async function registerUser(
  email: string,
  password: string,
  displayName?: string,
): Promise<AuthUser> {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName) await updateProfile(result.user, { displayName });
  return normalize(result.user, "email");
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

export function getCurrentUser(): AuthUser | null {
  return auth.currentUser ? normalize(auth.currentUser) : null;
}

export function onAuthChange(callback: (user: AuthUser | null) => void) {
  return onAuthStateChanged(auth, (user) => {
    callback(user ? normalize(user) : null);
  });
}

export async function getUserRole(): Promise<"superadmin" | "admin" | "juror" | "candidate"> {
  const user = auth.currentUser;
  if (!user) return "candidate";
  const token = await user.getIdTokenResult();
  const role = token.claims.role;
  return role === "superadmin" || role === "admin" || role === "juror" ? role : "candidate";
}
