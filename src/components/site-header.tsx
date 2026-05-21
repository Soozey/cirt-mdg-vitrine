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
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 md:h-20 md:px-8">
        <Link to="/" aria-label="Accueil CIRT MDG" className="flex items-center">
          <BrandMark />
        </Link>

        <nav aria-label="Navigation principale" className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <div className="flex items-center gap-2">
            <Button asChild size="sm" variant="link">
              <Link to="/login">Connexion</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/quiz">
                <ShieldCheck className="size-4" /> Quiz Jobdating
              </Link>
            </Button>
          </div>
        </div>

        <button
          type="button"
          aria-label="Ouvrir le menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border md:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      <div
        className={cn(
          "border-t border-border/60 bg-background md:hidden",
          open ? "block" : "hidden",
        )}
      >
        <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
            >
              {item.label}
            </a>
          ))}
          <Button asChild size="sm" variant="outline" className="mt-2">
            <Link to="/login" onClick={() => setOpen(false)}>Connexion</Link>
          </Button>
          <Button asChild size="sm" className="mt-1">
            <Link to="/quiz" onClick={() => setOpen(false)}>
              <ShieldCheck className="size-4" /> Quiz Jobdating
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}