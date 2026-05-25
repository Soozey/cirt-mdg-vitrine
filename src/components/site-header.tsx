import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, ShieldCheck, X } from "lucide-react";

import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/#projet", label: "Projet" },
  { href: "/#informations", label: "Informations" },
  { href: "/#themes", label: "Axes" },
  { href: "/#contact", label: "Contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-nav-deep/95 text-nav-deep-foreground backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 md:h-20 md:px-8">
        <Link to="/" aria-label="Accueil CIRT MDG" className="flex items-center">
          <BrandMark variant="light" />
        </Link>

        <nav aria-label="Navigation principale" className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-nav-deep-foreground/75 transition-colors hover:text-nav-deep-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <div className="flex items-center gap-2">
            <Button asChild size="sm" variant="outline" className="border-white/25 bg-transparent text-nav-deep-foreground hover:bg-white/10 hover:text-nav-deep-foreground">
              <Link to="/login">Connexion</Link>
            </Button>
            <Button asChild size="sm" className="bg-iris-lime text-primary-deep hover:bg-iris-lime/90">
              <Link to="/quiz">
                <ShieldCheck className="size-4" /> Quiz cybersécurité
              </Link>
            </Button>
          </div>
        </div>

        <button
          type="button"
          aria-label="Ouvrir le menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/20 text-nav-deep-foreground md:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      <div
        className={cn(
          "border-t border-white/10 bg-nav-deep text-nav-deep-foreground md:hidden",
          open ? "block" : "hidden",
        )}
      >
        <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2 text-sm font-medium text-nav-deep-foreground/90 hover:bg-white/10"
            >
              {item.label}
            </a>
          ))}
          <Button asChild size="sm" variant="outline" className="mt-2 border-white/25 bg-transparent text-nav-deep-foreground hover:bg-white/10">
            <Link to="/login" onClick={() => setOpen(false)}>Connexion</Link>
          </Button>
          <Button asChild size="sm" className="mt-1 bg-iris-lime text-primary-deep hover:bg-iris-lime/90">
            <Link to="/quiz" onClick={() => setOpen(false)}>
              <ShieldCheck className="size-4" /> Quiz cybersécurité
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}