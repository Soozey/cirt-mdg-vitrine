import udgLogo from "@/assets/partners/5-udg.webp";
import { CalendarDays, Globe, MapPin } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="overflow-hidden border-t border-iris-cyan/25 bg-[#03124a] text-white shadow-[0_-22px_60px_-42px_rgba(34,211,238,0.75)]">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 sm:py-12 md:grid-cols-[minmax(0,1fr)_minmax(220px,0.42fr)] md:gap-10 md:px-8 lg:grid-cols-[minmax(0,1.55fr)_minmax(240px,0.55fr)] lg:items-start">
        <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(210px,0.8fr)_minmax(0,1fr)] lg:items-stretch lg:gap-8">
          <h3
            className="max-w-none text-2xl uppercase leading-tight sm:text-3xl lg:flex lg:h-full lg:flex-col lg:justify-around"
            style={{ fontFamily: "var(--font-enfonix)" }}
          >
            <span className="block w-fit whitespace-nowrap bg-gradient-to-r from-iris-violet to-iris-cyan bg-clip-text text-transparent">
              Organisateur
            </span>
            <span className="block w-fit whitespace-nowrap bg-gradient-to-r from-iris-violet to-iris-cyan bg-clip-text text-transparent">
              principal <span className="text-iris-lime">&amp;</span>
            </span>
            <span className="block w-fit whitespace-nowrap bg-gradient-to-r from-iris-violet to-iris-cyan bg-clip-text text-transparent">
              initiateur
            </span>
          </h3>

          <div className="grid min-w-0 gap-5 text-sm leading-relaxed text-white sm:max-w-xl lg:max-w-none lg:pt-1">
            <div className="flex min-w-0 items-center gap-3 sm:gap-4">
              <div className="flex w-28 shrink-0 justify-start sm:w-36 lg:w-44">
                <img
                  src="/cirt-shield.png"
                  alt="CIRT MDG"
                  className="h-12 w-auto object-contain sm:h-16"
                />
              </div>
              <p className="min-w-0 [overflow-wrap:anywhere]">
                CIRT MDG – Computer Incident Response Team Madagascar
              </p>
            </div>

            <div className="flex min-w-0 items-center gap-3 sm:gap-4">
              <div className="flex w-28 shrink-0 justify-start sm:w-36 lg:w-44">
                <img
                  src={udgLogo}
                  alt="Unité de Gouvernance Digitale"
                  className="h-28 w-auto object-contain sm:h-32 lg:h-40"
                />
              </div>
              <p className="min-w-0 [overflow-wrap:anywhere]">
                Projet PRODIGY : Présidence de la République • IDA 6780-MG (Banque Mondiale)
              </p>
            </div>
          </div>
        </div>

        <div className="min-w-0 space-y-3 md:pt-1">
          <h3
            className="text-sm uppercase tracking-[0.18em] text-white"
            style={{ fontFamily: "var(--font-enfonix)" }}
          >
            Événement
          </h3>
          <ul className="space-y-2 text-sm text-white">
            <li className="flex min-w-0 items-center gap-2">
              <CalendarDays className="size-4 shrink-0 text-iris-lime" />
              <span>22 – 23 juin 2026</span>
            </li>
            <li>
              <a
                href="https://maps.app.goo.gl/ma6nBSgNvnjG5o39A"
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-w-0 items-center gap-2 text-white hover:text-iris-lime hover:underline"
              >
                <MapPin className="size-4 shrink-0 text-iris-lime" />
                <span className="min-w-0 [overflow-wrap:anywhere]">
                  Novotel Convention, Alarobia
                </span>
              </a>
            </li>
            <li className="flex min-w-0 items-center gap-2">
              <Globe className="size-4 shrink-0 text-iris-lime" />
              <span className="min-w-0 [overflow-wrap:anywhere]">Antananarivo, Madagascar</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-iris-cyan/20">
        <div
          className="mx-auto max-w-7xl px-4 py-5 text-center text-[11px] uppercase leading-relaxed tracking-[0.08em] text-white sm:px-6 sm:text-xs sm:tracking-[0.12em] md:px-8"
          style={{ fontFamily: "var(--font-barlow)" }}
        >
          © 2026 CIRT MDG, Sommet de la Cybersécurité Madagascar
        </div>
      </div>
    </footer>
  );
}
