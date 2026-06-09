import { Link } from "@tanstack/react-router";

import { cn } from "@/lib/utils";

export function AuthModeSwitch({ mode }: { mode: "login" | "register" }) {
  const options = [
    { mode: "register" as const, label: "S'enregistrer", to: "/register" },
    { mode: "login" as const, label: "Se connecter", to: "/login" },
  ];

  return (
    <div className="mb-4 grid grid-cols-2 rounded-full border border-slate-200 bg-slate-100 p-1 text-xs font-semibold shadow-inner">
      {options.map((option) => {
        const active = option.mode === mode;
        return (
          <Link
            key={option.mode}
            to={option.to}
            className={cn(
              "flex h-9 items-center justify-center rounded-full px-3 text-center transition-colors",
              active
                ? "bg-white text-primary shadow-sm"
                : "text-slate-500 hover:bg-white/70 hover:text-slate-800",
            )}
          >
            {option.label}
          </Link>
        );
      })}
    </div>
  );
}
