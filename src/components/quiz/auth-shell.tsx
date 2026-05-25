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
  <div className="h-screen w-full overflow-hidden bg-slate-100/60 p-0 lg:p-4">
    <div className="mx-auto flex h-full w-full max-w-6xl flex-col overflow-hidden bg-white shadow-2xl lg:flex-row lg:rounded-3xl">
      {/* LEFT — blue brand panel */}
      <div
        className="relative flex w-full flex-col items-center justify-center overflow-hidden px-6 py-6 text-white lg:w-[44%] lg:py-10"
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
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="relative z-10 flex flex-col items-center text-center"
        >
          <p className="font-display text-sm sm:text-base lg:text-lg font-light tracking-wide text-white/90">
            {brandTitle}
          </p>
          <div className="my-4">
            <RocketLogo size={88} />
          </div>
          <p className="mx-auto mt-1 max-w-xs text-xs sm:text-sm lg:text-base leading-relaxed text-white/75">
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

      {/* RIGHT — form panel */}
      <div className="relative flex w-full flex-1 md:items-center md:justify-center overflow-y-auto bg-white px-5 py-6 sm:px-8 lg:py-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="w-full max-w-sm"
        >
          <div className="mb-4 text-center lg:text-left">
            <Link
              to="/"
              className="mb-2 inline-flex items-center text-xs sm:text-sm font-semibold uppercase tracking-wide text-primary/70 hover:text-primary"
            >
              <ArrowLeft className="mr-1 h-3 w-3" />
              Retour à l'accueil
            </Link>

            <h1 className="font-display text-lg sm:text-xl lg:text-2xl font-bold tracking-tight text-slate-900">
              {title}
            </h1>
            <p className="mt-1 text-sm sm:text-base text-slate-500">
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
