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
    <header className="fixed left-0 top-0 z-50 w-full border-b border-iris-cyan/25 bg-[#03124a]/95 text-white shadow-[0_18px_45px_-32px_rgba(34,211,238,0.75)] backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 md:h-20 md:px-8">
        <Link to="/" aria-label="Accueil CIRT MDG" className="flex items-center">
          <BrandMark variant="light" />
        </Link>

        <nav aria-label="Navigation principale" className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm uppercase tracking-[0.14em] text-white transition-colors hover:text-iris-lime"
              style={{ fontFamily: "var(--font-barlow)" }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <div className="flex items-center gap-2">
            <Button asChild size="sm" variant="outline" className="border-iris-cyan/35 bg-transparent text-white hover:bg-iris-cyan/10 hover:text-iris-lime">
              <Link to="/login">Connexion</Link>
            </Button>
            <Button asChild size="sm" className="bg-iris-lime text-primary-deep shadow-[0_14px_35px_-22px_rgba(214,255,87,0.85)] hover:bg-iris-lime/90">
              <Link to="/quiz">
                <ShieldCheck className="size-4" /> Quizz cybersécurité
              </Link>
            </Button>
          </div>
        </div>

        <button
          type="button"
          aria-label="Ouvrir le menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-iris-cyan/35 text-iris-cyan md:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      <div
        className={cn(
          "border-t border-iris-cyan/20 bg-[#03124a] text-white md:hidden",
          open ? "block" : "hidden",
        )}
      >
        <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2 text-sm uppercase tracking-[0.14em] text-white hover:bg-iris-cyan/10 hover:text-iris-lime"
              style={{ fontFamily: "var(--font-barlow)" }}
            >
              {item.label}
            </a>
          ))}
          <Button asChild size="sm" variant="outline" className="mt-2 border-iris-cyan/35 bg-transparent text-white hover:bg-iris-cyan/10">
            <Link to="/login" onClick={() => setOpen(false)}>Connexion</Link>
          </Button>
          <Button asChild size="sm" className="mt-1 bg-iris-lime text-primary-deep hover:bg-iris-lime/90">
            <Link to="/quiz" onClick={() => setOpen(false)}>
              <ShieldCheck className="size-4" /> Quizz cybersécurité
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
