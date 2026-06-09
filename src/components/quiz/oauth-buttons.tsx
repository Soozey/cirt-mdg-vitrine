import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";

import { redirectForRole } from "@/lib/access-control";
import { useAuth } from "@/lib/quiz/auth-context";
import { cn, getErrorMessage } from "@/lib/utils";

function getOAuthErrorMessage(error: unknown) {
  const message = getErrorMessage(error, "Connexion impossible");

  if (message.includes("auth/popup-closed-by-user")) {
    return "Connexion annulée : la fenêtre d'authentification a été fermée.";
  }

  if (message.includes("auth/unauthorized-domain")) {
    return "Connexion OAuth impossible : ajoutez le domaine public de ce site dans Firebase Authentication > Settings > Authorized domains.";
  }

  return message;
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.2 1.3-1.6 3.9-5.5 3.9-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.5 14.6 2.5 12 2.5 6.7 2.5 2.5 6.7 2.5 12s4.2 9.5 9.5 9.5c5.5 0 9.1-3.9 9.1-9.3 0-.6-.1-1.1-.2-1.6L12 10.2z"
      />
    </svg>
  );
}

export function OAuthButtons({ mode = "login" }: { mode?: "login" | "register" }) {
  const { loginWithProvider } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    setLoading(true);
    try {
      const u = await loginWithProvider();
      toast.success("Connecté via Google");
      navigate({ to: redirectForRole(u.role, u.registered) });
    } catch (error) {
      toast.error(getOAuthErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-2">
      <button
        type="button"
        onClick={handle}
        disabled={loading}
        className={cn(
          "group inline-flex h-11 cursor-pointer items-center justify-center gap-2.5 rounded-full border border-input bg-background px-4 text-sm font-semibold text-foreground shadow-sm transition-all hover:bg-muted hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60",
        )}
      >
        <GoogleIcon />
        <span>{mode === "login" ? "Se connecter avec Google" : "S'enregistrer avec Google"}</span>
        {loading && (
          <span className="size-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
      </button>
    </div>
  );
}
