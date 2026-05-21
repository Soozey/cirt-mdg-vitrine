import { createFileRoute } from "@tanstack/react-router";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { HeroSection } from "@/components/sections/hero-section";
import { ProjectSection } from "@/components/sections/project-section";
import { InfoSection } from "@/components/sections/info-section";
import { ThemesSection } from "@/components/sections/themes-section";
import { ContactSection } from "@/components/sections/contact-section";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sommet de la Cybersécurité Madagascar 2026 — CIRT MDG" },
      {
        name: "description",
        content:
          "1ère édition du Sommet de la Cybersécurité Madagascar. 23–24 mai 2026, Novotel Convention & Spa, Antananarivo. Bâtir la confiance numérique pour un Madagascar cyber-résilient.",
      },
      { property: "og:title", content: "Sommet de la Cybersécurité Madagascar 2026" },
      {
        property: "og:description",
        content: "1ère édition · 23–24 mai 2026 · Antananarivo. Organisé par le CIRT MDG.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <HeroSection />
        <ProjectSection />
        <InfoSection />
        <ThemesSection />
        <ContactSection />
      </main>
      <SiteFooter />
    </div>
  );
}
