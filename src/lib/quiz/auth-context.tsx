import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { MOCK_USERS } from "./mock-users";
import type { QuizUser, UserRole } from "./types";

type Ctx = {
  user: QuizUser | null;
  ready: boolean;
  loginWithEmail: (email: string, password: string) => Promise<QuizUser>;
  loginWithProvider: (p: "google" | "facebook") => Promise<QuizUser>;
  completeProfile: (patch: Partial<QuizUser>) => void;
  logout: () => void;
};

const AuthCtx = createContext<Ctx | null>(null);
const STORAGE = "quiz_user_v1";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<QuizUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      // ignore
    }
    setReady(true);
  }, []);

  const persist = (u: QuizUser | null) => {
    if (typeof window === "undefined") return;
    if (u) localStorage.setItem(STORAGE, JSON.stringify(u));
    else localStorage.removeItem(STORAGE);
  };

  const loginWithEmail = useCallback(async (email: string, password: string) => {
    await new Promise((r) => setTimeout(r, 500));
    const found = MOCK_USERS.find((u) => u.email === email && u.password === password);
    if (!found) throw new Error("Identifiants invalides");
    const { password: _p, ...safe } = found;
    setUser(safe);
    persist(safe);
    return safe;
  }, []);

  const loginWithProvider = useCallback(async (p: "google" | "facebook") => {
    await new Promise((r) => setTimeout(r, 600));
    const u: QuizUser = {
      id: `oauth-${p}-${Date.now()}`,
      email: p === "google" ? "jean.google@cyber.io" : "jean.fb@cyber.io",
      firstName: "Jean",
      lastName: "Dupont",
      role: "candidate",
      provider: p,
      registered: false,
    };
    setUser(u);
    persist(u);
    return u;
  }, []);

  const completeProfile = useCallback((patch: Partial<QuizUser>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...patch, registered: true };
      persist(next);
      return next;
    });
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    persist(null);
  }, []);

  const value = useMemo(
    () => ({ user, ready, loginWithEmail, loginWithProvider, completeProfile, logout }),
    [user, ready, loginWithEmail, loginWithProvider, completeProfile, logout],
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