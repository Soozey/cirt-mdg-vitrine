import { THEMES } from "@/lib/event-data";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import {
  Lock,
  Token,
  StarMalagasy,
  Petal,
  UmbrellaDouble,
} from "@/components/geometric-symbols";
import themesBg from "@/assets/login-register.webp";

const SYMS = [Lock, Token, StarMalagasy, Petal, UmbrellaDouble];

export function ThemesSection() {
  return (
    <section
      id="themes"
      className="relative isolate overflow-hidden bg-primary-deep text-primary-foreground"
    >
      <img
        src={themesBg}
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 hidden h-full w-full object-cover opacity-30 md:block"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.18 0.14 295 / 0.85) 0%, oklch(0.20 0.14 290 / 0.92) 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 opacity-50 bg-iris animate-iris"
        style={{ maskImage: "linear-gradient(180deg, black, transparent)" }}
      />
      <div className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-24">
        <Reveal className="mb-12 max-w-2xl">
          <p
            className="mb-3 text-xs uppercase tracking-[0.28em] text-iris-lime"
            style={{ fontFamily: "var(--font-barlow)" }}
          >
            Programme
          </p>
          <h2
            className="max-w-full text-3xl uppercase leading-tight md:text-5xl"
            style={{ fontFamily: "var(--font-turret)", letterSpacing: "0.02em" }}
          >
            Cinq <span className="text-iris bg-iris animate-iris">axes</span> thématiques
          </h2>
          <p className="mt-4 text-base text-iris-cyan/85">
            Cinq dimensions complémentaires du cadre juridique à la coopération internationale
            pour couvrir l'ensemble du cycle de la confiance numérique.
          </p>
        </Reveal>

        <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5" stagger={0.08}>
          {THEMES.map((theme, i) => {
            const Sym = SYMS[i];
            return (
              <RevealItem
                key={theme.label}
                className="group relative flex min-w-0 flex-col gap-4 rounded-2xl border border-iris-cyan/35 bg-[#03124a]/70 p-5 backdrop-blur transition-all hover:-translate-y-1 hover:border-iris-lime/70"
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex size-12 items-center justify-center rounded-xl border border-iris-cyan/40 bg-iris-violet/10 text-iris-cyan transition-colors group-hover:text-iris-lime">
                    <Sym className="size-7" />
                  </span>
                  <span
                    className="text-xs tracking-[0.24em] text-iris-lime/65"
                    style={{ fontFamily: "var(--font-barlow)" }}
                  >
                    0{i + 1}
                  </span>
                </div>
                <div className="min-w-0">
                  <h3
                    className="max-w-full text-base uppercase leading-tight text-white [overflow-wrap:anywhere] sm:text-lg lg:text-[0.95rem] xl:text-lg"
                    style={{ fontFamily: "var(--font-enfonix)", letterSpacing: "0.04em" }}
                  >
                    {theme.label}
                  </h3>
                  <p className="mt-1.5 max-w-full text-xs text-iris-cyan/75 [overflow-wrap:anywhere]">{theme.hint}</p>
                </div>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
