import { useMemo, useState } from "react";
import type React from "react";
import { Link } from "@tanstack/react-router";
import { CheckCircle2, Loader2, QrCode, Ticket } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  REGISTRATION_LABELS,
  REGISTRATION_OPTIONS,
  type RegistrationRecord,
  type RegistrationType,
} from "@/lib/registrations";
import { submitEventRegistration } from "@/lib/firebase/server-api";
import { downloadQrCodePng } from "@/lib/qr-code";
import { getErrorMessage } from "@/lib/utils";

type Props = {
  type: RegistrationType;
  label?: string;
  variant?: React.ComponentProps<typeof Button>["variant"];
  className?: string;
};

const initialCommon = {
  nom: "",
  prenom: "",
  email: "",
  telephone: "",
};

const MAX_CV_BYTES = 1_000_000;
const CV_SIZE_ERROR = "Le CV doit peser strictement moins de 1 Mo.";

export function RegistrationDialog({ type, label, variant, className }: Props) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [created, setCreated] = useState<RegistrationRecord | null>(null);
  const [values, setValues] = useState<Record<string, string>>({
    ...initialCommon,
    profil: "",
    fonction: "",
    typeBillet: type === "visitor" ? REGISTRATION_OPTIONS.ticketTypes[0] : "",
    invitationCode: "",
    statut: "",
    university: "",
    participationMode: "Individuel",
    teamName: "",
    teamCount: "1",
    technicalProfile: "",
    portfolioUrl: "",
    session: "",
    expertiseLevel: "",
  });
  const [skills, setSkills] = useState<string[]>([]);
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [newsletterConsent, setNewsletterConsent] = useState(type === "newsletter");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvError, setCvError] = useState("");

  const title = REGISTRATION_LABELS[type];
  const triggerLabel = label ?? `S'inscrire - ${title}`;
  const requiresPrivacy = type !== "newsletter";

  const helper = useMemo(() => {
    if (type === "visitor") return "Billetterie officielle avec badge et QR Code.";
    if (type === "ctf-hackathon") return "Inscription aux épreuves du 22 juin.";
    if (type === "job-dating") return "Candidature au Job Dating Cyber du 23 juin.";
    if (type === "workshop") return "Réservation d'une session atelier ou masterclass.";
    return "Ajout à la mailing list du Symposium.";
  }, [type]);

  const createdQrPayload = created
    ? JSON.stringify({
      event: "SCM2026",
      id: created.id,
      type: created.type,
      qrCode: created.qrCode,
      nom: created.nom,
      prenom: created.prenom ?? "",
    })
    : "";

  function setField(field: string, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function toggleSkill(skill: string, checked: boolean) {
    setSkills((current) =>
      checked ? [...new Set([...current, skill])] : current.filter((item) => item !== skill),
    );
  }

  function handleCvChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    if (file && file.size >= MAX_CV_BYTES) {
      setCvFile(null);
      setCvError(CV_SIZE_ERROR);
      event.target.value = "";
      toast.error(CV_SIZE_ERROR);
      return;
    }

    setCvFile(file);
    setCvError("");
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (requiresPrivacy && !privacyConsent) {
      toast.error("Veuillez accepter les conditions générales d'utilisation.");
      return;
    }
    if (type === "job-dating" && (!cvFile || cvFile.size >= MAX_CV_BYTES)) {
      setCvError(CV_SIZE_ERROR);
      toast.error(CV_SIZE_ERROR);
      return;
    }

    const data = new FormData();
    data.set("type", type);
    Object.entries(values).forEach(([key, value]) => data.set(key, value));
    data.set("technicalSkills", JSON.stringify(skills));
    data.set("privacyConsent", String(privacyConsent));
    data.set("newsletterConsent", String(newsletterConsent));
    if (cvFile) data.set("cv", cvFile);

    setSubmitting(true);
    try {
      const response = await submitEventRegistration(data);
      setCreated(response.registration);
      toast.success("Inscription enregistrée");
    } catch (error) {
      toast.error(getErrorMessage(error, "Inscription impossible"));
    } finally {
      setSubmitting(false);
    }
  }

  function resetOnOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) setCreated(null);
  }

  return (
    <Dialog open={open} onOpenChange={resetOnOpenChange}>
      <DialogTrigger asChild>
        <Button variant={variant} className={className}>
          <Ticket className="size-4" />
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{helper}</DialogDescription>
        </DialogHeader>

        {created ? (
          <div className="rounded-lg border border-iris-lime/40 bg-iris-lime/10 p-5 text-primary-deep">
            <CheckCircle2 className="size-7 text-iris-violet" />
            <p className="mt-3 font-semibold">Votre inscription est confirmée.</p>
            <p className="mt-2 text-sm">
              Référence : <span className="font-mono">{created.id}</span>
            </p>
            {created.qrCode ? (
              <p className="mt-1 inline-flex items-center gap-2 text-sm">
                <QrCode className="size-4" />
                QR Code : <span className="font-mono">{created.qrCode}</span>
              </p>
            ) : null}
            {created.qrCode ? (
              <Button
                type="button"
                className="mt-4"
                onClick={() =>
                  downloadQrCodePng({
                    payload: createdQrPayload,
                    fileName: `${created.qrCode}.png`,
                  }).catch((error) =>
                    toast.error(getErrorMessage(error, "Téléchargement du QR Code impossible")),
                  )
                }
              >
                <QrCode className="size-4" />
                Télécharger mon QR Code
              </Button>
            ) : null}
            {created.type === "job-dating" && created.cvUploadStatus !== "stored" ? (
              <p className="mt-3 text-sm text-primary-deep/75">
                Votre candidature est enregistrée. Le CV a été reçu, mais le stockage Firebase doit
                être configuré pour le téléchargement SuperAdmin.
              </p>
            ) : null}
          </div>
        ) : (
          <form onSubmit={submit} className="grid gap-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Nom" required>
                <Input
                  value={values.nom}
                  onChange={(event) => setField("nom", event.target.value)}
                  required
                />
              </Field>
              {type !== "newsletter" ? (
                <Field label="Prénom" required>
                  <Input
                    value={values.prenom}
                    onChange={(event) => setField("prenom", event.target.value)}
                    required
                  />
                </Field>
              ) : null}
              <Field label={type === "visitor" ? "Email professionnel" : "Email"} required>
                <Input
                  type="email"
                  value={values.email}
                  onChange={(event) => setField("email", event.target.value)}
                  required
                />
              </Field>
              <Field label="Téléphone" required>
                <Input
                  type="tel"
                  value={values.telephone}
                  onChange={(event) => setField("telephone", event.target.value)}
                  required
                />
              </Field>
            </div>

            {type === "visitor" ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <SelectField
                  label="Entreprise / Institution"
                  value={values.profil}
                  onChange={(value) => setField("profil", value)}
                  options={REGISTRATION_OPTIONS.visitorProfiles}
                />
                <SelectField
                  label="Fonction"
                  value={values.fonction}
                  onChange={(value) => setField("fonction", value)}
                  options={REGISTRATION_OPTIONS.visitorFunctions}
                />
                <SelectField
                  label="Type de billet"
                  value={values.typeBillet}
                  onChange={(value) => setField("typeBillet", value)}
                  options={REGISTRATION_OPTIONS.ticketTypes}
                />
                {values.typeBillet === "Sur invitation" ? (
                  <Field label="Code VIP / Sponsor" required>
                    <Input
                      value={values.invitationCode}
                      onChange={(event) => setField("invitationCode", event.target.value)}
                      required
                    />
                  </Field>
                ) : null}
              </div>
            ) : null}

            {type === "ctf-hackathon" ? (
              <div className="grid gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <SelectField
                    label="Statut"
                    value={values.statut}
                    onChange={(value) => setField("statut", value)}
                    options={REGISTRATION_OPTIONS.statuses}
                  />
                  {values.statut === "Étudiant" ? (
                    <Field label="Université" required>
                      <Input
                        value={values.university}
                        onChange={(event) => setField("university", event.target.value)}
                        required
                      />
                    </Field>
                  ) : null}
                  <SelectField
                    label="Mode de participation"
                    value={values.participationMode}
                    onChange={(value) => setField("participationMode", value)}
                    options={REGISTRATION_OPTIONS.participationModes}
                  />
                  {values.participationMode === "Équipe" ? (
                    <>
                      <Field label="Nom de l'équipe" required>
                        <Input
                          value={values.teamName}
                          onChange={(event) => setField("teamName", event.target.value)}
                          required
                        />
                      </Field>
                      <Field label="Nombre de membres" required>
                        <Input
                          min={3}
                          max={5}
                          type="number"
                          value={values.teamCount}
                          onChange={(event) => setField("teamCount", event.target.value)}
                          required
                        />
                      </Field>
                    </>
                  ) : null}
                </div>
                <div>
                  <Label>Compétences techniques</Label>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    {REGISTRATION_OPTIONS.skills.map((skill) => (
                      <CheckboxLine
                        key={skill}
                        label={skill}
                        checked={skills.includes(skill)}
                        onCheckedChange={(checked) => toggleSkill(skill, checked)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : null}

            {type === "job-dating" ? (
              <div className="grid gap-4">
                <SelectField
                  label="Profil technique"
                  value={values.technicalProfile}
                  onChange={(value) => setField("technicalProfile", value)}
                  options={REGISTRATION_OPTIONS.technicalProfiles}
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="CV" required>
                    <Input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleCvChange}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Taille maximale acceptée : strictement moins de 1 Mo.
                    </p>
                    {cvError ? <p className="text-xs text-destructive">{cvError}</p> : null}
                  </Field>
                  <Field label="Lien vers le portfolio" required>
                    <Input
                      type="url"
                      placeholder="https://..."
                      value={values.portfolioUrl}
                      onChange={(event) => setField("portfolioUrl", event.target.value)}
                      required
                    />
                  </Field>
                </div>
              </div>
            ) : null}

            {type === "workshop" ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <SelectField
                  label="Session"
                  value={values.session}
                  onChange={(value) => setField("session", value)}
                  options={REGISTRATION_OPTIONS.sessions}
                />
                <SelectField
                  label="Niveau d'expertise"
                  value={values.expertiseLevel}
                  onChange={(value) => setField("expertiseLevel", value)}
                  options={REGISTRATION_OPTIONS.expertiseLevels}
                />
              </div>
            ) : null}

            {type !== "newsletter" ? (
              <CheckboxLine
                label={
                  <>
                    J'accepte les{" "}
                    <Link
                      to="/conditions-generales-utilisation"
                      className="font-semibold text-primary hover:underline"
                    >
                      conditions générales d'utilisation
                    </Link>
                  </>
                }
                checked={privacyConsent}
                onCheckedChange={setPrivacyConsent}
              />
            ) : null}
            <CheckboxLine
              label="Je souhaite recevoir les informations et la newsletter du Symposium."
              checked={newsletterConsent}
              onCheckedChange={setNewsletterConsent}
            />

            {type === "visitor" && values.typeBillet !== "Sur invitation" ? (
              <p className="rounded-md border border-iris-cyan/25 bg-iris-cyan/10 p-3 text-sm text-primary-deep">
                Le statut paiement est initialisé à “en attente”. L'intégration de paiement
                sécurisée pourra le confirmer automatiquement.
              </p>
            ) : null}

            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <QrCode className="size-4" />
              )}
              Valider l'inscription
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <Label>
        {label}
        {required ? <span className="text-destructive"> *</span> : null}
      </Label>
      {children}
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
}) {
  return (
    <Field label={label} required>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Sélectionner" />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  );
}

function CheckboxLine({
  label,
  checked,
  onCheckedChange,
}: {
  label: React.ReactNode;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-start gap-2 text-sm text-foreground/80">
      <Checkbox
        checked={checked}
        onCheckedChange={(value) => onCheckedChange(value === true)}
        className="mt-0.5"
      />
      <span>{label}</span>
    </label>
  );
}
