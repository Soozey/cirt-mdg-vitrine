import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight, CheckCircle2 } from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { INFO_PAGES, CIRT_WEBSITE } from "@/lib/event-data";
import infoBg from "@/assets/info-section.webp";
import contentBg from "@/assets/above-countdown.webp";
import { RICH_PAGES } from "@/components/informations/rich-pages";

export const Route = createFileRoute("/informations/$slug")({
  head: ({ params }) => {
    const page = INFO_PAGES.find((p) => p.slug === params.slug);
    return {
      meta: [
        { title: page ? `${page.title}, CIRT MDG 2026` : "Information, CIRT MDG 2026" },
        {
          name: "description",
          content: page?.summary ?? "Informations du Symposium de la Cybersécurité Madagascar 2026.",
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
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-40 text-center">
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
      <main className="mx-auto flex max-w-2xl flex-1 flex-col items-center justify-center px-4 pb-24 pt-40 text-center">
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
  const RichPage = RICH_PAGES[page.slug];

  if (RichPage) {
    return (
      <div className="flex min-h-screen flex-col bg-[#02082d]">
        <SiteHeader />
        <main className="information-detail-theme flex-1 pt-16 md:pt-20">
          <RichPage />
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#02082d]">
      <SiteHeader />

      <main className="information-detail-theme flex-1 pt-16 md:pt-20">
        <section
          className="relative isolate overflow-hidden border-b border-iris-cyan/25 bg-[#03164a] text-white"
        >
          <img
            src={infoBg}
            alt=""
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-20 hidden h-full w-full object-cover opacity-35 mix-blend-screen md:block"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(circle at 92% 16%, rgba(214, 255, 87, 0.18), transparent 26%), radial-gradient(circle at 10% 88%, rgba(142, 60, 255, 0.22), transparent 30%), linear-gradient(180deg, #031b59 0%, #03144a 52%, #02082d 100%)",
            }}
          />
          <div className="mx-auto max-w-5xl px-4 py-12 md:px-8 md:py-20">
            <Link
              to="/"
              hash="informations"
              className="mb-6 inline-flex items-center gap-1 rounded-md border border-iris-cyan/25 bg-[#03164a]/85 px-3 py-2 text-sm font-semibold text-iris-lime shadow-[0_14px_35px_-28px_rgba(34,211,238,0.75)] transition-colors hover:bg-[#041a5d] hover:text-iris-cyan"
            >
              <ArrowLeft className="size-4" /> Retour aux informations
            </Link>
            <h1
              className="mt-4 text-4xl uppercase leading-tight text-iris bg-iris animate-iris md:text-5xl"
              style={{ fontFamily: "var(--font-turret)", letterSpacing: "0.02em" }}
            >
              {page.title}
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-white/82">{page.summary}</p>
          </div>
        </section>

        <section className="relative isolate overflow-hidden bg-[#02082d]">
          <img
            src={contentBg}
            alt=""
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-20 h-full w-full object-cover opacity-25 mix-blend-screen"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(circle at 88% 92%, rgba(214, 255, 87, 0.16), transparent 24%), linear-gradient(180deg, rgba(3, 20, 74, 0.94), rgba(2, 8, 45, 0.98))",
            }}
          />
          <div className="mx-auto max-w-5xl px-4 py-16 md:grid md:grid-cols-[2fr_1fr] md:gap-12 md:px-8">
            <article className="space-y-6">
              <p className="text-lg leading-relaxed text-white/82">{page.description}</p>

              <Card className="border-iris-cyan/25 bg-[#03124a]/75 p-6 text-white shadow-[0_18px_55px_-26px_rgba(34,211,238,0.65)] backdrop-blur-md">
                <h2
                  className="mb-4 text-sm uppercase tracking-[0.2em] text-iris-lime"
                  style={{ fontFamily: "var(--font-barlow)" }}
                >
                  Ce qu'il faut retenir
                </h2>
                <ul className="space-y-3 text-sm text-white/82">
                  <li className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-iris-lime" />
                    Événement organisé par le CIRT MDG.
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-iris-lime" />
                    Les 22 et 23 juin 2026 au Novotel Convention, Alarobia (Antananarivo).
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-iris-lime" />
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
              <h2
                className="mb-4 text-xs uppercase tracking-[0.22em] text-iris-lime"
                style={{ fontFamily: "var(--font-barlow)" }}
              >
                Voir aussi
              </h2>
              <ul className="space-y-3">
                {others.map((o) => (
                  <li key={o.slug}>
                    <Link
                      to="/informations/$slug"
                      params={{ slug: o.slug }}
                      className="group flex items-start justify-between gap-3 rounded-lg border border-iris-cyan/25 bg-[#03124a]/75 p-4 text-white shadow-[0_18px_55px_-30px_rgba(34,211,238,0.55)] transition-colors hover:border-iris-lime/60"
                    >
                      <div>
                        <p
                          className="text-[11px] uppercase tracking-[0.22em] text-iris-lime/80"
                          style={{ fontFamily: "var(--font-barlow)" }}
                        >
                          {o.kicker}
                        </p>
                        <p className="mt-1 text-sm font-semibold text-white">{o.title}</p>
                      </div>
                      <ArrowUpRight className="size-4 shrink-0 text-iris-lime transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
