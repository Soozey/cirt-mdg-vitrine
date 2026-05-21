import { BrandMark } from "@/components/brand-mark";
import { CIRT_WEBSITE } from "@/lib/event-data";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface-muted">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-3 md:px-8">
        <div className="space-y-3">
          <BrandMark />
          <p className="max-w-xs text-sm text-muted-foreground">
            Computer Incident Response Team Madagascar. Bâtir la confiance numérique pour un
            Madagascar cyber-résilient.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Événement</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>23 – 24 mai 2026</li>
            <li>Novotel Convention &amp; Spa</li>
            <li>Antananarivo, Madagascar</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Liens</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href={CIRT_WEBSITE}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                cirt.gov.mg
              </a>
            </li>
            <li>
              <a
                href="/#contact"
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                Contact organisation
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-2 px-4 py-5 text-xs text-muted-foreground md:flex-row md:px-8">
          <span>© 2026 CIRT MDG — Sommet de la Cybersécurité Madagascar</span>
          <span>Site vitrine en cours de préparation</span>
        </div>
      </div>
    </footer>
  );
}