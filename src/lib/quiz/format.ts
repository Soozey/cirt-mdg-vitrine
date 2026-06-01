export const PHONE_PREFIXES = [
  { value: "+261", label: "+261 Madagascar" },
  { value: "+33", label: "+33 France" },
  { value: "+1", label: "+1 USA / Canada" },
  { value: "+230", label: "+230 Maurice" },
  { value: "+262", label: "+262 Réunion / Mayotte" },
  { value: "+27", label: "+27 Afrique du Sud" },
] as const;

export type PhonePrefix = (typeof PHONE_PREFIXES)[number]["value"];

function groupDigits(digits: string, pattern: number[] = [2]) {
  const groups: string[] = [];
  let rest = digits;
  for (const size of pattern) {
    if (!rest) break;
    groups.push(rest.slice(0, size));
    rest = rest.slice(size);
  }
  while (rest.length > 0) {
    groups.push(rest.slice(0, 2));
    rest = rest.slice(2);
  }
  return groups.join(" ");
}

function findKnownPrefix(cleaned: string) {
  const normalized = cleaned.startsWith("+") ? cleaned : `+${cleaned}`;
  return PHONE_PREFIXES
    .map((item) => item.value)
    .sort((a, b) => b.length - a.length)
    .find((prefix) => normalized.startsWith(prefix));
}

export function formatNationalPhone(prefix: PhonePrefix, raw: string): string {
  const rawDigits = raw.replace(/\D/g, "");
  const countryDigits = prefix.slice(1);
  const digits = rawDigits.startsWith(countryDigits) ? rawDigits.slice(countryDigits.length) : rawDigits;
  if (!digits) return "";

  if (prefix === "+261") {
    const local = digits.startsWith("261") ? digits.slice(3) : digits.startsWith("0") ? digits.slice(1) : digits;
    return local.length === 9
      ? `${local.slice(0, 2)} ${local.slice(2, 4)} ${local.slice(4, 7)} ${local.slice(7)}`
      : groupDigits(local, [2, 2, 3]);
  }

  return groupDigits(digits);
}

export function composePhone(prefix: PhonePrefix, national: string): string {
  const rawDigits = national.replace(/\D/g, "");
  const countryDigits = prefix.slice(1);
  const digits = rawDigits.startsWith(countryDigits) ? rawDigits.slice(countryDigits.length) : rawDigits;
  if (!digits) return "";
  const normalized = prefix === "+261" && digits.startsWith("0") ? digits.slice(1) : digits;
  return `${prefix}${normalized}`;
}

export function splitPhoneForInput(raw?: string): { prefix: PhonePrefix; national: string } {
  const cleaned = (raw ?? "").replace(/[^0-9+]/g, "");
  if (!cleaned) return { prefix: "+261", national: "" };

  const prefix = (findKnownPrefix(cleaned) ?? "+261") as PhonePrefix;
  const countryDigits = prefix.slice(1);
  const digits = cleaned.replace(/\D/g, "");
  const national = digits.startsWith(countryDigits) ? digits.slice(countryDigits.length) : digits;

  return {
    prefix,
    national: formatNationalPhone(prefix, national),
  };
}

export function formatPhone(raw: string): string {
  const cleaned = raw.replace(/[^0-9+]/g, "");
  if (!cleaned) return "";

  const digits = cleaned.replace(/\D/g, "");
  const knownPrefix = findKnownPrefix(cleaned);
  if (knownPrefix) {
    const countryDigits = knownPrefix.slice(1);
    const national = digits.startsWith(countryDigits) ? digits.slice(countryDigits.length) : digits;
    return `${knownPrefix} ${formatNationalPhone(knownPrefix as PhonePrefix, national)}`.trim();
  }

  if (/^261\d{9}$/.test(digits) && (cleaned.startsWith("+261") || cleaned.startsWith("261"))) {
    return `+261 ${digits.slice(3, 5)} ${digits.slice(5, 7)} ${digits.slice(7, 10)} ${digits.slice(10)}`;
  }

  const local = digits.startsWith("261") ? `0${digits.slice(3)}` : digits;

  if (/^0\d{9}$/.test(local)) {
    return `${local.slice(0, 3)} ${local.slice(3, 5)} ${local.slice(5, 8)} ${local.slice(8)}`;
  }

  const plus = cleaned.startsWith("+");
  const groups: string[] = [];
  let rest = digits;
  if (plus && rest.length >= 3) {
    groups.push("+" + rest.slice(0, 3));
    rest = rest.slice(3);
  }
  while (rest.length > 0) {
    groups.push(rest.slice(0, 2));
    rest = rest.slice(2);
  }
  return groups.join(" ");
}

export function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "à l'instant";
  if (m < 60) return `il y a ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `il y a ${h} h`;
  const d = Math.floor(h / 24);
  return `il y a ${d} j`;
}

export function initials(first?: string, last?: string): string {
  return `${(first ?? "?")[0]}${(last ?? "")[0] ?? ""}`.toUpperCase();
}
