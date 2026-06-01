import { Link } from "@tanstack/react-router";
import { ArrowRight, ExternalLink } from "lucide-react";

import { INFO_PAGES } from "@/lib/event-data";
import { Card } from "@/components/ui/card";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import infoBg from "@/assets/info-section.webp";

export function InfoSection() {
  return (
    <section id="informations" className="relative isolate overflow-hidden bg-[#03164a] text-white">
      <img
        src={infoBg}
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 hidden h-full w-full object-cover opacity-35 mix-blend-screen md:block"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(circle at 92% 16%, rgba(214, 255, 87, 0.18), transparent 26%), radial-gradient(circle at 10% 88%, rgba(142, 60, 255, 0.22), transparent 30%), linear-gradient(180deg, #031b59 0%, #03144a 52%, #02082d 100%)",
        }}
      />
      <div className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-24">
        <Reveal className="mb-12 max-w-2xl">
          <p
            className="mb-3 text-xs uppercase tracking-[0.28em] text-iris-lime"
            style={{ fontFamily: "var(--font-barlow)" }}
          >
            Les temps forts
          </p>
          <h2
            className="max-w-full text-3xl uppercase leading-tight text-iris bg-iris animate-iris md:text-5xl"
            style={{ fontFamily: "var(--font-turret)", letterSpacing: "0.02em" }}
          >
            Informations essentielles
          </h2>
          <div className="mt-4 h-1 w-16 bg-iris" />
        </Reveal>

        <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.08} amount={0.05}>
          {INFO_PAGES.map((item) => (
            <RevealItem key={item.slug}>
            <Link
              to="/informations/$slug"
              params={{ slug: item.slug }}
              className="group block"
            >
              <Card className="h-full min-w-0 overflow-hidden border-iris-cyan/25 bg-[#03124a]/75 p-6 text-white shadow-[0_18px_55px_-26px_rgba(34,211,238,0.65)] backdrop-blur-md transition-[transform,border-color,background-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-iris-lime/60 hover:bg-[#041a5d]/85 hover:shadow-[0_24px_70px_-22px_rgba(214,255,87,0.42)]">
                <div className="mb-4 h-1 w-10 rounded-full bg-iris" />
                <p
                  className="mb-2 text-[11px] uppercase tracking-[0.24em] text-iris-lime/80"
                  style={{ fontFamily: "var(--font-barlow)" }}
                >
                  {item.kicker}
                </p>
                <h3
                  className="mb-2 max-w-full text-xl uppercase leading-tight text-white [overflow-wrap:anywhere]"
                  style={{ fontFamily: "var(--font-enfonix)", letterSpacing: "0.04em" }}
                >
                  {item.title}
                </h3>
                <p className="mb-6 max-w-full text-sm text-iris-cyan/78 line-clamp-2 [overflow-wrap:anywhere]">{item.summary}</p>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-iris-lime">
                  {item.externalPending ? (
                    <>
                      Lien externe à venir <ExternalLink className="size-3.5" />
                    </>
                  ) : (
                    <>
                      Voir la page{" "}
                      <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                    </>
                  )}
                </span>
              </Card>
            </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
