import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { auth } from "@/lib/firebase/config";
import {
  getUserRole,
  loginUser,
  loginWithFacebook,
  loginWithGoogle,
  logoutUser,
  onAuthChange,
  registerUser,
  type AuthUser,
} from "@/lib/firebase/auth";
import { usersApi, type UserDoc } from "@/lib/firebase/firestore";
import {
  createSuperadminWithGoogle,
  ensureAuthenticatedUser,
  finalizeUserProfile,
} from "@/lib/firebase/server-api";
import type { QuizUser, UserRole } from "./types";

type Ctx = {
  user: QuizUser | null;
  ready: boolean;
  loginWithEmail: (email: string, password: string) => Promise<QuizUser>;
  loginWithProvider: (p: "google" | "facebook") => Promise<QuizUser>;
  bootstrapWithGoogle: () => Promise<QuizUser>;
  signUp: (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => Promise<QuizUser>;
  completeProfile: (patch: Partial<QuizUser>) => Promise<QuizUser | null>;
  logout: () => Promise<void>;
};

const AuthCtx = createContext<Ctx | null>(null);

async function hydrate(authUser: AuthUser): Promise<QuizUser> {
  const claimedRole = await getUserRole();

  if (authUser.provider === "google" || authUser.provider === "facebook") {
    const session = await ensureAuthenticatedUser();
    return session.user;
  }

  const existing = await usersApi.get(authUser.uid);

  if (existing) {
    return {
      id: existing.uid,
      email: existing.email,
      firstName: existing.firstName,
      lastName: existing.lastName,
      phone: existing.phone,
      profile: existing.profile,
      linkedin: existing.linkedinUrl,
      role: (existing.role ?? claimedRole) as UserRole,
      provider: existing.provider,
      registered: existing.registered ?? Boolean(existing.phone && existing.profile),
    };
  }

  const [firstName, ...lastNameParts] = (authUser.displayName || "").trim().split(/\s+/);
  const profile: UserDoc = {
    uid: authUser.uid,
    email: authUser.email,
    firstName: firstName || "",
    lastName: lastNameParts.join(" "),
    photoURL: authUser.photoURL,
    provider: authUser.provider,
    role: claimedRole,
    registered: false,
    quizDone: false,
  };

  await usersApi.upsert(authUser.uid, profile);

  return {
    id: authUser.uid,
    email: authUser.email,
    firstName: profile.firstName,
    lastName: profile.lastName,
    role: claimedRole,
    provider: authUser.provider,
    registered: false,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<QuizUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (authUser) => {
      if (!authUser) {
        setUser(null);
        setReady(true);
        return;
      }

      try {
        setUser(await hydrate(authUser));
      } catch (error) {
        console.error("[auth] user hydration failed:", error);
        setUser(null);
      } finally {
        setReady(true);
      }
    });

    return unsubscribe;
  }, []);

  const loginWithEmail = useCallback(async (email: string, password: string) => {
    const authUser = await loginUser(email, password);
    const next = await hydrate(authUser);
    setUser(next);
    return next;
  }, []);

  const loginWithProvider = useCallback(async (p: "google" | "facebook") => {
    const authUser = p === "google" ? await loginWithGoogle() : await loginWithFacebook();
    const next = await hydrate(authUser);
    setUser(next);
    return next;
  }, []);

  const bootstrapWithGoogle = useCallback(async () => {
    await loginWithGoogle();
    const finalized = await createSuperadminWithGoogle();
    await auth.currentUser?.getIdToken(true);
    setUser(finalized.user);
    return finalized.user;
  }, []);

  const signUp = useCallback(
    async (data: { firstName: string; lastName: string; email: string; password: string }) => {
      const authUser = await registerUser(
        data.email,
        data.password,
        `${data.firstName} ${data.lastName}`,
      );
      await usersApi.upsert(authUser.uid, {
        uid: authUser.uid,
        email: authUser.email,
        firstName: data.firstName,
        lastName: data.lastName,
        provider: "email",
        role: "candidate",
        registered: false,
        quizDone: false,
      });
      const next = await hydrate(authUser);
      setUser(next);
      return next;
    },
    [],
  );

  const completeProfile = useCallback(
    async (patch: Partial<QuizUser>) => {
      if (!user) return null;

      const finalized = await finalizeUserProfile({
        email: patch.email ?? user.email,
        firstName: patch.firstName ?? user.firstName,
        lastName: patch.lastName ?? user.lastName,
        phone: patch.phone ?? user.phone,
        profile: patch.profile ?? user.profile,
        linkedin: patch.linkedin ?? user.linkedin,
        provider: patch.provider ?? user.provider,
      });

      await auth.currentUser?.getIdToken(true);
      setUser(finalized.user);
      return finalized.user;
    },
    [user],
  );

  const logout = useCallback(async () => {
    await logoutUser();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      ready,
      loginWithEmail,
      loginWithProvider,
      bootstrapWithGoogle,
      signUp,
      completeProfile,
      logout,
    }),
    [
      user,
      ready,
      loginWithEmail,
      loginWithProvider,
      bootstrapWithGoogle,
      signUp,
      completeProfile,
      logout,
    ],
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function useRequireAuth(roles?: UserRole[]) {
  const ctx = useAuth();
  const ok = ctx.user && (!roles || roles.includes(ctx.user.role));
  return { ...ctx, allowed: !!ok };
}
