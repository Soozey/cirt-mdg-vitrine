import { BrandMark } from "@/components/brand-mark";
import { CIRT_WEBSITE } from "@/lib/event-data";
import { CalendarDays, MapPin, Globe, Link as LinkIcon, Mail } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="overflow-hidden border-t border-iris-cyan/25 bg-[#03124a] text-white shadow-[0_-22px_60px_-42px_rgba(34,211,238,0.75)]">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-3 md:px-8">
        <div className="space-y-3">
          <BrandMark variant="light" />
          <p className="max-w-xs text-sm text-white">
            Bâtir la confiance numérique pour un Madagascar cyber-résilient.
          </p>
        </div>


<div className="space-y-3">
  <h3
    className="text-sm uppercase tracking-[0.18em] text-white"
    style={{ fontFamily: "var(--font-enfonix)" }}
  >
    Événement
  </h3>
  <ul className="space-y-2 text-sm text-white">
    <li className="inline-flex items-center gap-2">
      <CalendarDays className="size-4 text-iris-lime" />
      <span>22 – 23 juin 2026</span>
    </li>
    <li>
      <a
        href="https://maps.app.goo.gl/ma6nBSgNvnjG5o39A"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:underline inline-flex items-center gap-2 text-white hover:text-iris-lime"
      >
        <MapPin className="size-4 text-iris-lime" />
        <span>Novotel Convention, Alarobia</span>
      </a>
    </li>
    <li className="inline-flex items-center gap-2">
      <Globe className="size-4 text-iris-lime" />
      <span>Antananarivo, Madagascar</span>
    </li>
  </ul>
</div>

<div className="space-y-3">
  <h3
    className="text-sm uppercase tracking-[0.18em] text-white"
    style={{ fontFamily: "var(--font-enfonix)" }}
  >
    Liens
  </h3>
  <ul className="space-y-2 text-sm">
      {/* <li>
        <a
          href={CIRT_WEBSITE}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white transition-colors hover:text-iris-lime inline-flex items-center gap-2"
        >
          <LinkIcon className="size-4 text-iris-lime" />
          <span>cirt.gov.mg</span>
        </a>
      </li> */}
    <li>
      <a
        href="/#contact"
        className="text-white transition-colors hover:text-iris-lime inline-flex items-center gap-2"
      >
        <Mail className="size-4 text-iris-lime" />
        <span>Contact organisation</span>
      </a>
    </li>
  </ul>
</div>

      </div>

      <div className="border-t border-iris-cyan/20">
        <div
          className="mx-auto max-w-7xl px-4 py-5 text-center text-xs uppercase tracking-[0.12em] text-white md:px-8"
          style={{ fontFamily: "var(--font-barlow)" }}
        >
          © 2026 CIRT MDG, Sommet de la Cybersécurité Madagascar
        </div>
      </div>
    </footer>
  );
}
