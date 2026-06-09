export type UserRole = "candidate" | "juror" | "admin" | "superadmin";

export type RoleInviteRole = "juror" | "admin" | "superadmin";

export type RoleInviteStatus = "pending" | "used" | "revoked";

export type RoleInvite = {
  id: string;
  email?: string;
  emailKey?: string;
  phone?: string;
  phoneKey?: string;
  role: RoleInviteRole;
  status: RoleInviteStatus;
  createdBy: string;
  createdAt?: unknown;
  usedBy?: string | null;
  usedAt?: unknown;
  revokedAt?: unknown;
};

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function normalizePhone(phone: string) {
  return phone.replace(/[^\d+]/g, "");
}

export function redirectForRole(role: UserRole, registered = true) {
  if (role === "superadmin") return "/superadmin";
  if (role === "admin") return "/admin";
  if (role === "juror") return "/jury";
  return registered ? "/quiz" : "/register";
}
