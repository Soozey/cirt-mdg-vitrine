import { cn } from "@/lib/utils";

type SymbolProps = { className?: string };

/**
 * Symboles inspirés de la direction artistique du Symposium de la Cybersécurité Madagascar.
 * Tracés au trait, prêts à recevoir un gradient iridescent (currentColor / stroke).
 */

export function StarMalagasy({ className }: SymbolProps) {
  // X malagasy / étoile à 4 branches concaves
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" stroke="currentColor" strokeWidth={1.5}>
      <circle cx="32" cy="32" r="28" />
      <path d="M32 4 C 30 22 30 22 4 32 C 30 42 30 42 32 60 C 34 42 34 42 60 32 C 34 22 34 22 32 4 Z" />
    </svg>
  );
}

export function UmbrellaDouble({ className }: SymbolProps) {
  // Double parapluie → protection
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path d="M6 30 A 26 26 0 0 1 58 30" />
      <path d="M14 44 A 18 18 0 0 1 50 44" />
    </svg>
  );
}

export function Flower({ className }: SymbolProps) {
  // Fleur trèfle → croissance
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" stroke="currentColor" strokeWidth={1.5}>
      <circle cx="32" cy="16" r="12" />
      <circle cx="32" cy="48" r="12" />
      <circle cx="16" cy="32" r="12" />
      <circle cx="48" cy="32" r="12" />
      <circle cx="32" cy="32" r="5" />
    </svg>
  );
}

export function Token({ className }: SymbolProps) {
  // Jeton concentrique
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" stroke="currentColor" strokeWidth={1.5}>
      <circle cx="32" cy="32" r="28" />
      <circle cx="32" cy="32" r="18" />
      <circle cx="32" cy="32" r="8" />
    </svg>
  );
}

export function Lock({ className }: SymbolProps) {
  // Serrure abstraite : cercle au-dessus d'un carré
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" stroke="currentColor" strokeWidth={1.5}>
      <circle cx="32" cy="22" r="12" />
      <rect x="20" y="34" width="24" height="22" rx="2" />
    </svg>
  );
}

export function Diamond({ className }: SymbolProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" stroke="currentColor" strokeWidth={1.5}>
      <circle cx="32" cy="32" r="28" />
      <rect x="32" y="12" width="28" height="28" transform="rotate(45 32 32)" />
    </svg>
  );
}

export function Petal({ className }: SymbolProps) {
  // Fleur à 4 pétales
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path d="M32 4 C 24 24 24 24 4 32 C 24 40 24 40 32 60 C 40 40 40 40 60 32 C 40 24 40 24 32 4 Z" />
    </svg>
  );
}

export function HalfArch({ className }: SymbolProps) {
  // Arche / demi-cercle empilé
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path d="M4 32 A 28 28 0 0 1 60 32" />
      <rect x="4" y="32" width="56" height="28" />
    </svg>
  );
}

export function Fist({ className }: SymbolProps) {
  // Poing fermé stylisé → volonté (cercle + carré aligné)
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" stroke="currentColor" strokeWidth={1.5}>
      <circle cx="32" cy="20" r="10" />
      <rect x="16" y="32" width="32" height="24" rx="4" />
      <line x1="24" y1="40" x2="40" y2="40" />
      <line x1="24" y1="48" x2="40" y2="48" />
    </svg>
  );
}

export const SYMBOLS = [
  Token, StarMalagasy, UmbrellaDouble,
  Lock, Diamond, Flower,
  Petal, HalfArch, Fist,
] as const;

/**
 * Grille géométrique inspirée des "Pistes" du PDF : 12 cases de symboles
 * sur fond indigo profond, contours en dégradé iridescent.
 */
export function GeometricGrid({
  className,
  columns = 4,
  rows = 3,
  density = "default",
}: {
  className?: string;
  columns?: number;
  rows?: number;
  density?: "default" | "sparse";
}) {
  const cells = Array.from({ length: columns * rows });
  return (
    <div
      className={cn(
        "grid h-full w-full",
        density === "sparse" ? "opacity-30" : "opacity-60",
        className,
      )}
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
      }}
      aria-hidden
    >
      {cells.map((_, i) => {
        const Sym = SYMBOLS[i % SYMBOLS.length];
        return (
          <div
            key={i}
            className="flex items-center justify-center border-l border-t border-iris-violet/15 first:border-l-0"
            style={{ borderLeftWidth: i % columns === 0 ? 0 : 1, borderTopWidth: i < columns ? 0 : 1 }}
          >
            <Sym className="size-2/3 text-iris-violet/70" />
          </div>
        );
      })}
    </div>
  );
}