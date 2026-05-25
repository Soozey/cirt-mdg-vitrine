import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckCircle2, Mail } from "lucide-react";
import { z } from "zod";

import { AuthShell } from "@/components/quiz/auth-shell";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { submissionsApi } from "@/lib/quiz/firestore";
import type { Submission } from "@/lib/quiz/types";

const search = z.object({ id: z.string().optional() });

export const Route = createFileRoute("/done")({
  validateSearch: (s) => search.parse(s),
  head: () => ({
    meta: [{ title: "Quiz terminé · CIRT" }],
  }),
  component: DonePage,
});

function DonePage() {
  const { id } = Route.useSearch();
  const [sub, setSub] = useState<Submission | null>(null);

  useEffect(() => {
    if (id) setSub(submissionsApi.get(id) ?? null);
  }, [id]);

  return (
    <AuthShell title="Quiz envoyé !" subtitle="Merci pour votre participation. Le jury va évaluer vos réponses.">
      <div className="grid gap-5 text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-accent-soft text-primary-deep">
          <CheckCircle2 className="size-8" />
        </div>

        {sub ? (
          <div className="rounded-xl border border-border bg-surface-muted/40 p-5 text-left">
            <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-wider text-muted-foreground">
              <span>Score préliminaire</span>
              <span>{sub.finalScore}/100</span>
            </div>
            <Progress value={sub.finalScore} />
            <p className="mt-3 text-xs text-muted-foreground">
              Probabilité IA moyenne : {(sub.aiAverage * 100).toFixed(0)}% · {sub.questions.length} questions
            </p>
          </div>
        ) : null}

        <p className="text-sm text-muted-foreground">
          Vous serez recontacté par email si votre profil correspond.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button asChild variant="outline">
            <Link to="/">Retour à l'accueil</Link>
          </Button>
          <Button asChild>
            <a href="mailto:cirt@cirt.gov.mg" className="inline-flex items-center gap-2">
              <Mail className="size-4" /> Contacter le CIRT
            </a>
          </Button>
        </div>
      </div>
    </AuthShell>
  );
}