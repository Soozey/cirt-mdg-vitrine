import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";

import { useAuth } from "@/lib/quiz/auth-context";
import type { UserRole } from "@/lib/quiz/types";

export function ProtectedRoute({
  roles,
  requireProfile = false,
  children,
}: {
  roles?: UserRole[];
  requireProfile?: boolean;
  children: React.ReactNode;
}) {
  const { user, ready } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      navigate({ to: "/login" });
      return;
    }
    if (roles && !roles.includes(user.role)) {
      navigate({ to: "/" });
      return;
    }
    if (requireProfile && !user.registered) {
      navigate({ to: "/register" });
    }
  }, [ready, user, roles, requireProfile, navigate]);

  if (!ready || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }
  return <>{children}</>;
}