import { createFileRoute, useRouter } from "@tanstack/react-router";
import { ArrowLeft, Mail } from "lucide-react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/conditions-generales-utilisation")({
  head: () => ({
    meta: [
      { title: "Conditions générales d'utilisation · CIRT MDG 2026" },
      {
        name: "description",
        content:
          "Conditions générales d'utilisation de la plateforme d'inscription au Sommet de la Cybersécurité Madagascar 2026.",
      },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  const { history } = useRouter();

  const sections = [
    {
      title: "Objet",
      content:
        "Ces conditions encadrent l'utilisation de la plateforme d'inscription et des espaces numériques associés au Sommet de la Cybersécurité Madagascar 2026.",
    },
    {
      title: "Compte utilisateur",
      content:
        "L'utilisateur s'engage à fournir des informations exactes lors de son inscription et à préserver la confidentialité de ses identifiants.",
    },
    {
      title: "Utilisation autorisée",
      content:
        "La plateforme doit être utilisée uniquement pour l'inscription, la participation aux activités du Sommet et l'accès aux services liés à l'événement.",
    },
    {
      title: "Données personnelles",
      content:
        "Les informations transmises servent à gérer l'inscription, la participation, les communications utiles et l'organisation des activités liées au Sommet.",
    },
    {
      title: "Sécurité",
      content:
        "Toute tentative d'accès non autorisé, d'altération du service, de contournement technique ou d'utilisation abusive peut entraîner la suspension du compte.",
    },
    {
      title: "Mise à jour",
      content:
        "Les conditions peuvent être adaptées pour refléter l'organisation de l'événement, les exigences de sécurité ou les obligations applicables.",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-[#02082d] text-white">
      <SiteHeader />
      <main className="flex-1 pt-16 md:pt-20">
        <section className="relative isolate overflow-hidden bg-[#03164a]">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(circle at 90% 12%, rgba(214, 255, 87, 0.16), transparent 24%), radial-gradient(circle at 8% 90%, rgba(142, 60, 255, 0.2), transparent 28%), linear-gradient(180deg, #031b59 0%, #02082d 100%)",
            }}
          />
          <div className="mx-auto w-full max-w-4xl px-4 py-12 md:px-8 md:py-16">
            <Button
              variant="outline"
              onClick={() => history.go(-1)}
              className="border-iris-cyan/35 bg-transparent text-white hover:bg-iris-cyan/10 hover:text-iris-lime"
            >
              <ArrowLeft className="size-4" /> Retour
            </Button>

            <h1
              className="mt-8 text-3xl uppercase leading-tight text-iris bg-iris animate-iris md:text-5xl"
              style={{ fontFamily: "var(--font-turret)", letterSpacing: "0.02em" }}
            >
              Conditions générales d'utilisation
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/78 md:text-base">
              Veuillez lire ces conditions avant de créer votre compte. En validant votre
              inscription, vous confirmez les accepter.
            </p>
          </div>
        </section>

        <section className="bg-background text-foreground">
          <div className="mx-auto w-full max-w-4xl px-4 py-12 md:px-8 md:py-16">
            <div className="grid gap-4">
              {sections.map((section) => (
                <Card key={section.title} className="border-border/60 p-6">
                  <h2 className="font-display text-lg font-semibold text-primary-deep">
                    {section.title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/75">
                    {section.content}
                  </p>
                </Card>
              ))}
            </div>

            <Card className="mt-6 border-border/60 p-6">
              <h2 className="font-display text-lg font-semibold text-primary-deep">
                Contact
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-foreground/75">
                Pour toute question relative aux conditions d'utilisation ou à vos données,
                contactez l'organisation du Sommet.
              </p>
              <Button asChild className="mt-4">
                <a href="mailto:contact@cybersecurite-madagascar.mg?subject=Conditions%20g%C3%A9n%C3%A9rales%20d'utilisation%20-%20CIRT%20MDG%202026">
                  <Mail className="size-4" /> Contacter l'organisation
                </a>
              </Button>
            </Card>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
