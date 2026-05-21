import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight, CheckCircle2 } from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { INFO_PAGES, CIRT_WEBSITE } from "@/lib/event-data";

export const Route = createFileRoute("/informations/$slug")({
  head: ({ params }) => {
    const page = INFO_PAGES.find((p) => p.slug === params.slug);
    return {
      meta: [
        { title: page ? `${page.title} — CIRT MDG 2026` : "Information — CIRT MDG 2026" },
        {
          name: "description",
          content: page?.summary ?? "Informations du Sommet de la Cybersécurité Madagascar 2026.",
        },
      ],
    };
  },
  loader: ({ params }) => {
    const page = INFO_PAGES.find((p) => p.slug === params.slug);
    if (!page) throw notFound();
    return { page };
  },
  notFoundComponent: NotFoundPage,
  errorComponent: ({ error, reset }) => (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-primary-deep">Une erreur est survenue</h1>
        <p className="mt-2 text-muted-foreground">{error.message}</p>
        <Button className="mt-6" onClick={reset}>Réessayer</Button>
      </div>
      <SiteFooter />
    </div>
  ),
  component: DetailPage,
});

function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="mx-auto flex max-w-2xl flex-1 flex-col items-center justify-center px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-bold text-primary-deep">Information introuvable</h1>
        <p className="mt-3 text-muted-foreground">
          La page demandée n'existe pas ou a été déplacée.
        </p>
        <Button asChild className="mt-6">
          <Link to="/" hash="informations">
            <ArrowLeft /> Retour aux informations
          </Link>
        </Button>
      </main>
      <SiteFooter />
    </div>
  );
}

function DetailPage() {
  const { page } = Route.useLoaderData();
  const others = INFO_PAGES.filter((p) => p.slug !== page.slug).slice(0, 3);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />

      <main className="flex-1">
        <section
          className="border-b border-border"
          style={{
            background:
              "radial-gradient(ellipse at 15% 10%, color-mix(in oklch, var(--accent) 22%, transparent), transparent 45%), linear-gradient(180deg, var(--surface-muted), var(--background) 75%)",
          }}
        >
          <div className="mx-auto max-w-5xl px-4 py-12 md:px-8 md:py-20">
            <Link
              to="/"
              hash="informations"
              className="mb-6 inline-flex items-center gap-1 text-sm font-semibold text-primary transition-colors hover:text-primary-deep"
            >
              <ArrowLeft className="size-4" /> Retour aux informations
            </Link>
            <Badge variant="secondary" className="bg-accent-soft text-primary-deep border-transparent">
              {page.kicker}
            </Badge>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-primary-deep md:text-5xl">
              {page.title}
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{page.summary}</p>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-16 md:grid md:grid-cols-[2fr_1fr] md:gap-12 md:px-8">
          <article className="space-y-6">
            <p className="text-lg leading-relaxed text-foreground/80">{page.description}</p>

            <Card className="border-border/60 bg-surface-muted p-6">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-primary">
                Ce qu'il faut retenir
              </h2>
              <ul className="space-y-3 text-sm text-foreground/80">
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-accent" />
                  Événement organisé par le CIRT MDG.
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-accent" />
                  Les 23 et 24 mai 2026 au Novotel Convention &amp; Spa, Antananarivo.
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-accent" />
                  Détails complémentaires publiés dès validation officielle.
                </li>
              </ul>
            </Card>

            <div className="flex flex-wrap gap-3 pt-2">
              {page.externalPending ? (
                <Button asChild variant="outline">
                  <Link to="/" hash="contact">Lien CTF à confirmer</Link>
                </Button>
              ) : (
                <Button asChild>
                  <Link to="/" hash="contact">Demander des informations</Link>
                </Button>
              )}
              <Button asChild variant="ghost">
                <a href={CIRT_WEBSITE} target="_blank" rel="noopener noreferrer">
                  Site du CIRT <ArrowUpRight />
                </a>
              </Button>
            </div>
          </article>

          <aside className="mt-12 md:mt-0">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Voir aussi
            </h2>
            <ul className="space-y-3">
              {others.map((o) => (
                <li key={o.slug}>
                  <Link
                    to="/informations/$slug"
                    params={{ slug: o.slug }}
                    className="group flex items-start justify-between gap-3 rounded-lg border border-border/60 bg-card p-4 transition-colors hover:border-primary/30"
                  >
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                        {o.kicker}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-primary-deep">{o.title}</p>
                    </div>
                    <ArrowUpRight className="size-4 shrink-0 text-primary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}