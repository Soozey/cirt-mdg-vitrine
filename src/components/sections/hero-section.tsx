import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";

import { Countdown } from "@/components/countdown";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/project-section2.webp";
import ministere from "@/assets/partners/1-ministere.webp";
import mndpt from "@/assets/partners/2-mndpt.webp";
import cirtShield from "@/assets/partners/3-cirt-shield.png";
import prodigy from "@/assets/partners/4-prodigy.webp";
import udg from "@/assets/partners/5-udg.webp";

const PARTNERS = [
  { src: ministere, alt: "République de Madagascar", className: "h-16 sm:h-20 md:h-24" },
  { src: mndpt, alt: "Ministère du Développement Numérique, des Postes et des Télécommunications", className: "h-14 sm:h-16 md:h-20" },
  { src: cirtShield, alt: "CIRT MDG", className: "h-12 sm:h-14 md:h-16" },
  { src: prodigy, alt: "Prodigy", className: "h-8 sm:h-10 md:h-12" },
  { src: udg, alt: "Unité de Gouvernance Digitale", className: "h-20 sm:h-24 md:h-32" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

const heroEase = [0.22, 1, 0.36, 1] as [number, number, number, number];

const titleCascade = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.18,
    },
  },
};

const titleFromTop = {
  hidden: { opacity: 0, y: -34, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.72, ease: heroEase },
  },
};

const infoFromBottom = {
  hidden: { opacity: 0, y: 36, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.64, delay: 0.28, ease: heroEase },
  },
};

const countdownFromRight = {
  hidden: { opacity: 0, x: 72, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.68, delay: 0.38, ease: heroEase },
  },
};

const heroViewport = { once: false, amount: 0.35 };

export function HeroSection() {
  return (
    <section
      id="accueil"
      className="relative isolate overflow-hidden bg-[#02060f] text-white"
    >
      <img
        src={heroBg}
        alt=""
        aria-hidden
        fetchPriority="high"
        className="pointer-events-none absolute inset-0 -z-20 h-full w-full object-cover"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(180deg, rgba(2,6,15,0.55) 0%, rgba(2,6,15,0.35) 40%, rgba(2,6,15,0.75) 100%)",
        }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-[60vw] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(34,211,238,0.18), transparent 60%)" }}
        animate={{ opacity: [0.5, 0.85, 0.5], scale: [0.95, 1.05, 0.95] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="mx-auto flex min-h-[calc(100svh-4rem)] w-full max-w-[1400px] flex-col px-4 pb-16 pt-6 sm:px-6 md:min-h-[calc(100svh-5rem)] md:px-10 md:pb-24 md:pt-1">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={heroViewport}
          variants={fadeUp}
          className="flex w-full flex-wrap items-center justify-between gap-x-4 gap-y-3 sm:gap-x-6"
        >
          {PARTNERS.map((p) => (
            <img
              key={p.alt}
              src={p.src}
              alt={p.alt}
              className={`${p.className} w-auto object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]`}
              loading="eager"
            />
          ))}
        </motion.div>

        <div className="mt-8 flex flex-1 flex-col justify-center md:mt-10">
          <div className="grid gap-5 md:grid-cols-[minmax(0,max-content)_minmax(18rem,1fr)] md:items-end md:gap-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={heroViewport}
              variants={titleCascade}
              className="inline-flex min-w-0 flex-col items-start"
            >
              <div className="flex flex-col">
                {/* Ligne du haut : édition et Sommet/de la */}
                <motion.div variants={titleFromTop} className="block md:flex md:w-full md:justify-between md:items-baseline mb-3">
                  <motion.span
                    className="text-[0.7rem] tracking-wide text-white sm:text-xs md:text-sm"
                    style={{ fontFamily: "var(--font-barlow)" }}
                  >
                    1ère édition - 2026
                  </motion.span>

                  <motion.span
                    className="flex flex-col items-start 
                   text-xs sm:text-sm md:text-[clamp(0.95rem,1.35vw,1.25rem)] 
                   uppercase leading-[1.0] text-white/95 mt-2 md:mt-0"
                    style={{ fontFamily: "var(--font-enfonix)", letterSpacing: "0.06em" }}
                  >
                    <span>Sommet</span>
                    <span>de la</span>
                  </motion.span>
                </motion.div>

                {/* Ligne du bas : Cyber */}
                <motion.span
                  variants={titleFromTop}
                  className="block text-[clamp(2.75rem,9.4vw,8rem)] uppercase leading-[0.88] text-white"
                  style={{ fontFamily: "var(--font-turret)", letterSpacing: "0.01em" }}
                >
                  Cyber
                </motion.span>
              </div>

              {/* Bloc Sécurité + Madagascar */}
              <div className="inline-flex max-w-full flex-col items-end">
                <motion.span
                  variants={titleFromTop}
                  className="block max-w-full text-[clamp(2.75rem,9.4vw,8rem)] uppercase leading-[0.88] text-white"
                  style={{ fontFamily: "var(--font-turret)", letterSpacing: "0.01em" }}
                >
                  Sécurité
                </motion.span>
                <motion.span
                  variants={titleFromTop}
                  className="-mt-1 max-w-full text-right text-[clamp(0.78rem,1.65vw,1.45rem)] uppercase text-white"
                  style={{ fontFamily: "var(--font-enfonix)", letterSpacing: "0.14em" }}
                >
                  Madagascar
                </motion.span>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={heroViewport}
              variants={countdownFromRight}
              className="w-full max-w-sm justify-self-start md:mb-1 md:max-w-sm md:justify-self-end"
            >
              <div className="rounded-2xl border border-white/15 bg-[#02060f]/60 p-4 backdrop-blur-md shadow-[var(--shadow-iris)]">
                <Countdown />
              </div>
            </motion.div>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-[1.4fr_1fr] md:items-end md:gap-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={heroViewport}
              variants={infoFromBottom}
              className="space-y-5"
            >
              <p className="max-w-xl text-sm text-white/85 sm:text-base">
                <span className="font-semibold text-iris-lime">Confiance numérique</span>, votre gage de pérennité
              </p>

              <dl className="flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-white/85 sm:text-sm">
                <div className="inline-flex items-center gap-2">
                  <CalendarDays className="size-3.5 text-iris-lime" />
                  <span className="tabular-nums">22 – 23 Juin 2026</span>
                </div>
                <a
                  href="https://maps.app.goo.gl/ma6nBSgNvnjG5o39A"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 underline underline-offset-4 hover:text-white"
                >
                  <MapPin className="size-3.5 text-iris-cyan" />
                  <span>Novotel Convention, Alarobia</span>
                </a>
              </dl>

              <div className="flex flex-wrap gap-3 pt-1">
                <Button
                  asChild
                  size="lg"
                  className="h-10 bg-iris-lime px-4 text-sm text-primary-deep hover:bg-iris-lime/90 shadow-[var(--shadow-iris)]"
                >
                  <Link to="/register">
                    S'inscrire <ArrowRight className="ml-1" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-10 border-white/30 bg-transparent px-4 text-sm text-white hover:bg-white/10 hover:text-white"
                >
                  <a href="#sponsor">Devenir partenaire</a>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
