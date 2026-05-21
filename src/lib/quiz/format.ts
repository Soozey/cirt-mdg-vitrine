export function formatPhone(raw: string): string {
  const cleaned = raw.replace(/[^0-9+]/g, "");
  if (!cleaned) return "";
  const plus = cleaned.startsWith("+");
  const digits = cleaned.replace(/\+/g, "");
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