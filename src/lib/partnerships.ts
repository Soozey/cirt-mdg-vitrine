export type PartnershipLeadStatus = "new" | "contacted" | "qualified" | "archived";

export type PartnershipLead = {
  id: string;
  phone: string;
  email: string;
  organization: string;
  sector: string;
  level: string;
  message?: string;
  sourcePackage?: string;
  status: PartnershipLeadStatus;
  qrCode?: string;
  deleted?: boolean;
  createdAt?: string;
};

export const PARTNERSHIP_STATUS_LABELS: Record<PartnershipLeadStatus, string> = {
  new: "Nouveau",
  contacted: "Contacté",
  qualified: "Qualifié",
  archived: "Archivé",
};
