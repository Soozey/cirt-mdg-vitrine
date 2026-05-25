import { BrandMark } from "@/components/brand-mark";
import { CIRT_WEBSITE } from "@/lib/event-data";
import { CalendarDays, MapPin, Globe, Link as LinkIcon, Mail } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-nav-deep text-nav-deep-foreground">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-3 md:px-8">
        <div className="space-y-3">
          <BrandMark variant="light" />
          <p className="max-w-xs text-sm text-nav-deep-foreground/70">
            Bâtir la confiance numérique pour un Madagascar cyber-résilient.
          </p>
        </div>


<div className="space-y-3">
  <h3 className="text-sm font-semibold text-nav-deep-foreground">Événement</h3>
  <ul className="space-y-2 text-sm text-nav-deep-foreground/70">
    <li className="inline-flex items-center gap-2">
      <CalendarDays className="size-4 text-iris-cyan" />
      <span>22 – 23 juin 2026</span>
    </li>
    <li>
      <a
        href="https://maps.app.goo.gl/ma6nBSgNvnjG5o39A"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:underline inline-flex items-center gap-2"
      >
        <MapPin className="size-4 text-iris-cyan" />
        <span>Novotel Convention, Alarobia</span>
      </a>
    </li>
    <li className="inline-flex items-center gap-2">
      <Globe className="size-4 text-iris-cyan" />
      <span>Antananarivo, Madagascar</span>
    </li>
  </ul>
</div>

<div className="space-y-3">
  <h3 className="text-sm font-semibold text-nav-deep-foreground">Liens</h3>
  <ul className="space-y-2 text-sm">
    <li>
      <a
        href={CIRT_WEBSITE}
        target="_blank"
        rel="noopener noreferrer"
        className="text-nav-deep-foreground/70 transition-colors hover:text-iris-lime inline-flex items-center gap-2"
      >
        <LinkIcon className="size-4 text-iris-lime" />
        <span>cirt.gov.mg</span>
      </a>
    </li>
    <li>
      <a
        href="/#contact"
        className="text-nav-deep-foreground/70 transition-colors hover:text-iris-lime inline-flex items-center gap-2"
      >
        <Mail className="size-4 text-iris-lime" />
        <span>Contact organisation</span>
      </a>
    </li>
  </ul>
</div>

      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-5 text-center text-xs text-nav-deep-foreground/60 md:px-8">
          © 2026 CIRT MDG — Sommet de la Cybersécurité Madagascar
        </div>
      </div>
    </footer>
  );
}