import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";

import { ArrowLeft } from "lucide-react";

import loginBg from "@/assets/login-register.webp";
import { CloudDivider, RocketLogo } from "./rocket-logo";

export function AuthShell({
  title,
  subtitle,
  brandTitle = "Bienvenue sur",
  brandTagline = "Evaluez vos compétences et rencontrez les meilleurs employeurs du secteur.",
  children,
}: {
  title: string;
  subtitle: string;
  brandTitle?: string;
  brandTagline?: string;
  children: React.ReactNode;
}) {
return (
  <div className="min-h-dvh w-full overflow-x-hidden bg-slate-100/60 p-0 sm:p-4">
    <div className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col overflow-hidden bg-white shadow-2xl sm:min-h-[calc(100dvh-2rem)] sm:rounded-3xl lg:flex-row">
      {/* LEFT: blue brand panel */}
      <div
        className="relative flex w-full shrink-0 flex-col items-center justify-center overflow-hidden px-5 pb-7 pt-5 text-white sm:px-6 sm:py-7 md:py-8 lg:w-[44%] lg:py-10"
        style={{
          backgroundImage:
            "linear-gradient(160deg, oklch(0.55 0.22 265) 0%, oklch(0.38 0.22 275) 55%, oklch(0.30 0.20 280) 100%)",
        }}
      >
        {/* subtle brand image texture */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.10] mix-blend-screen"
          style={{
            backgroundImage: `url(${loginBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="relative z-10 flex flex-col items-center text-center"
        >
          <p className="font-display text-sm font-light tracking-wide text-white/90 sm:text-base lg:text-lg">
            {brandTitle}
          </p>
          <div className="my-2 sm:my-3 lg:my-4">
            <RocketLogo size={78} />
          </div>
          <p className="mx-auto mt-1 max-w-xs text-xs leading-relaxed text-white/75 sm:text-sm lg:text-base">
            {brandTagline}
          </p>
        </motion.div>

        <div className="absolute bottom-3 left-0 right-0 z-10 hidden items-center justify-center gap-6 text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] text-white/60 lg:flex">
          <span>Cybersécurité</span>
          <span>Madagascar</span>
        </div>

        <div className="hidden lg:block">
          <CloudDivider vertical />
        </div>
        <div className="absolute inset-x-0 bottom-0 lg:hidden">
          <CloudDivider />
        </div>
      </div>

      {/* RIGHT: form panel */}
      <div className="relative flex w-full flex-1 justify-center overflow-y-visible bg-white px-4 py-5 sm:px-6 sm:py-7 md:px-8 lg:items-center lg:overflow-y-auto lg:py-8">
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="w-full max-w-sm sm:max-w-md lg:max-w-sm"
        >
          <div className="mb-4 text-center lg:text-left">
            <Link
              to="/"
              className="mb-3 inline-flex min-h-9 items-center rounded-full px-2 text-xs font-semibold uppercase tracking-wide text-primary/70 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 sm:text-sm"
            >
              <ArrowLeft className="mr-1 h-3 w-3 shrink-0" />
              Retour à l'accueil
            </Link>

            <h1 className="font-display text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              {title}
            </h1>
            <p className="mt-1 text-sm leading-relaxed text-slate-500 sm:text-base">
              {subtitle}
            </p>
          </div>
          {children}
        </motion.div>
      </div>
    </div>
  </div>
);

}
