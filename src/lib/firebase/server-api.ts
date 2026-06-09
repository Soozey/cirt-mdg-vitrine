import { auth } from "./config";

async function authHeaders() {
  const token = await auth.currentUser?.getIdToken();
  return token ? { authorization: `Bearer ${token}` } : {};
}

async function readResponse<T>(response: Response): Promise<T> {
  const data = (await response.json().catch(() => ({}))) as { message?: string };
  if (!response.ok) throw new Error(data.message ?? "Requête impossible");
  return data as T;
}

export async function getBootstrapStatus() {
  const response = await fetch("/api/bootstrap/status");
  return readResponse<{ configured: boolean }>(response);
}

export async function createSuperadmin(data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) {
  const response = await fetch("/api/bootstrap", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(data),
  });
  return readResponse<{ uid: string; email: string; role: "superadmin" }>(response);
}

export async function createSuperadminWithGoogle() {
  const response = await fetch("/api/bootstrap/google", {
    method: "POST",
    headers: await authHeaders(),
  });
  return readResponse<{ user: import("@/lib/quiz/types").QuizUser }>(response);
}

export async function ensureAuthenticatedUser() {
  const response = await fetch("/api/users/session", {
    method: "POST",
    headers: await authHeaders(),
  });
  return readResponse<{ user: import("@/lib/quiz/types").QuizUser }>(response);
}

export async function finalizeUserProfile(data: {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  profile?: string;
  linkedin?: string;
  provider: "google" | "email";
}) {
  const response = await fetch("/api/users/finalize-profile", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(await authHeaders()),
    },
    body: JSON.stringify(data),
  });
  return readResponse<{ user: import("@/lib/quiz/types").QuizUser }>(response);
}

export async function listRoleInvites() {
  const response = await fetch("/api/role-invites", {
    headers: await authHeaders(),
  });
  return readResponse<{ invites: import("@/lib/access-control").RoleInvite[] }>(response);
}

export async function createRoleInvite(data: {
  email?: string;
  phone?: string;
  role: "admin" | "juror" | "superadmin";
}) {
  const response = await fetch("/api/role-invites", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(await authHeaders()),
    },
    body: JSON.stringify(data),
  });
  return readResponse<{ id: string }>(response);
}

export async function revokeRoleInvite(id: string) {
  const response = await fetch(`/api/role-invites/${id}/revoke`, {
    method: "POST",
    headers: await authHeaders(),
  });
  return readResponse<{ ok: true }>(response);
}

export async function listRoleUsers() {
  const response = await fetch("/api/users/roles", {
    headers: await authHeaders(),
  });
  return readResponse<{ users: import("@/lib/firebase/firestore").UserDoc[] }>(response);
}

export async function removeUserRoles(uid: string) {
  const response = await fetch(`/api/users/${uid}/roles`, {
    method: "DELETE",
    headers: await authHeaders(),
  });
  return readResponse<{ ok: true }>(response);
}

export async function listSubmissionsForStaff() {
  const response = await fetch("/api/submissions", {
    headers: await authHeaders(),
  });
  return readResponse<{ submissions: import("@/lib/quiz/types").Submission[] }>(response);
}

export async function getSubmission(id: string) {
  const response = await fetch(`/api/submissions/${id}`, {
    headers: await authHeaders(),
  });
  return readResponse<{ submission: import("@/lib/quiz/types").Submission }>(response);
}

export async function reviewSubmission(id: string, data: { juryNote: string; juryScore: number }) {
  const response = await fetch(`/api/submissions/${id}`, {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
      ...(await authHeaders()),
    },
    body: JSON.stringify(data),
  });
  return readResponse<{ submission: import("@/lib/quiz/types").Submission }>(response);
}

export async function deleteSubmission(id: string) {
  const response = await fetch(`/api/submissions/${id}`, {
    method: "DELETE",
    headers: await authHeaders(),
  });
  return readResponse<{ ok: true }>(response);
}

export async function submitQuizSubmission(submission: import("@/lib/quiz/types").Submission) {
  const response = await fetch("/api/submissions", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(await authHeaders()),
    },
    body: JSON.stringify({ submission }),
  });
  return readResponse<{ id: string }>(response);
}

export async function submitPartnershipLead(data: {
  phone: string;
  email: string;
  organization: string;
  sector: string;
  level: string;
  message?: string;
  sourcePackage?: string;
}) {
  const response = await fetch("/api/partnership-leads", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(data),
  });
  return readResponse<{ id: string; qrCode: string }>(response);
}

export async function listPartnershipLeads() {
  const response = await fetch("/api/partnership-leads", {
    headers: await authHeaders(),
  });
  return readResponse<{ leads: import("@/lib/partnerships").PartnershipLead[] }>(response);
}

export async function updatePartnershipLeadStatus(
  id: string,
  status: import("@/lib/partnerships").PartnershipLeadStatus,
) {
  const response = await fetch(`/api/partnership-leads/${id}`, {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
      ...(await authHeaders()),
    },
    body: JSON.stringify({ status }),
  });
  return readResponse<{ lead: import("@/lib/partnerships").PartnershipLead }>(response);
}

export async function deletePartnershipLead(id: string, mode: "soft" | "hard" = "soft") {
  const response = await fetch(`/api/partnership-leads/${id}?mode=${mode}`, {
    method: "DELETE",
    headers: await authHeaders(),
  });
  return readResponse<{ ok: true }>(response);
}

export async function submitEventRegistration(data: FormData) {
  const response = await fetch("/api/event-registrations", {
    method: "POST",
    body: data,
  });
  return readResponse<{ registration: import("@/lib/registrations").RegistrationRecord }>(response);
}

export async function listEventRegistrations() {
  const response = await fetch("/api/event-registrations", {
    headers: await authHeaders(),
  });
  return readResponse<{ registrations: import("@/lib/registrations").RegistrationRecord[] }>(
    response,
  );
}

export async function deleteEventRegistration(id: string, mode: "soft" | "hard" = "soft") {
  const response = await fetch(`/api/event-registrations/${id}?mode=${mode}`, {
    method: "DELETE",
    headers: await authHeaders(),
  });
  return readResponse<{ ok: true }>(response);
}

export async function downloadEventRegistrationCv(id: string, fileName = "cv") {
  const response = await fetch(`/api/event-registrations/${id}/files/cv`, {
    headers: await authHeaders(),
  });
  if (!response.ok) {
    const data = (await response.json().catch(() => ({}))) as { message?: string };
    throw new Error(data.message ?? "Téléchargement du CV impossible");
  }
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}
