import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";

import { useAuth } from "@/lib/quiz/auth-context";
import { cn } from "@/lib/utils";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.3-1.6 3.9-5.5 3.9-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.5 14.6 2.5 12 2.5 6.7 2.5 2.5 6.7 2.5 12s4.2 9.5 9.5 9.5c5.5 0 9.1-3.9 9.1-9.3 0-.6-.1-1.1-.2-1.6L12 10.2z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <path fill="#fff" d="M22 12a10 10 0 1 0-11.6 9.9V15h-2.5v-3h2.5V9.7c0-2.5 1.5-3.8 3.7-3.8 1.1 0 2.2.2 2.2.2v2.4h-1.3c-1.3 0-1.7.8-1.7 1.6V12h2.9l-.5 3h-2.4v6.9A10 10 0 0 0 22 12z" />
    </svg>
  );
}

export function OAuthButtons({ mode = "login" }: { mode?: "login" | "register" }) {
  const { loginWithProvider } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<"google" | "facebook" | null>(null);

  const handle = async (p: "google" | "facebook") => {
    setLoading(p);
    try {
      const u = await loginWithProvider(p);
      toast.success(`Connecté via ${p === "google" ? "Google" : "Facebook"}`);
      navigate({ to: u.registered ? "/quiz" : "/register" });
    } catch (e) {
      toast.error("Connexion impossible");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="grid gap-2">
      <button
        type="button"
        onClick={() => handle("google")}
        disabled={loading !== null}
        className={cn(
          "group inline-flex h-9 items-center justify-center gap-2.5 rounded-lg border border-input bg-background px-3 text-xs font-medium text-foreground shadow-sm transition-all hover:bg-muted hover:shadow-md disabled:opacity-60",
        )}
      >
        <GoogleIcon />
        <span>
          {mode === "login" ? "Continuer avec Google" : "S'inscrire avec Google"}
        </span>
        {loading === "google" && (
          <span className="size-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
      </button>
      <button
        type="button"
        onClick={() => handle("facebook")}
        disabled={loading !== null}
        className="group inline-flex h-9 items-center justify-center gap-2.5 rounded-lg px-3 text-xs font-medium text-white shadow-sm transition-all hover:shadow-md disabled:opacity-60"
        style={{ backgroundColor: "#1877F2" }}
      >
        <FacebookIcon />
        <span>
          {mode === "login" ? "Continuer avec Facebook" : "S'inscrire avec Facebook"}
        </span>
        {loading === "facebook" && (
          <span className="size-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
      </button>
    </div>
  );
}