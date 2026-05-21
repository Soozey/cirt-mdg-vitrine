import { useEffect, useMemo, useState } from "react";

import { EVENT_DATE } from "@/lib/event-data";

function useCountdown() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(t);
  }, []);
  return useMemo(() => {
    if (!now) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    const diff = Math.max(EVENT_DATE.getTime() - now.getTime(), 0);
    return {
      days: Math.floor(diff / 86_400_000),
      hours: Math.floor((diff % 86_400_000) / 3_600_000),
      minutes: Math.floor((diff % 3_600_000) / 60_000),
      seconds: Math.floor((diff % 60_000) / 1_000),
    };
  }, [now]);
}

function Cell({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-card px-3 py-4 shadow-[var(--shadow-soft)]">
      <span className="font-display text-3xl font-bold tabular-nums text-primary-deep md:text-4xl">
        {value.toString().padStart(2, "0")}
      </span>
      <span className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

export function Countdown() {
  const c = useCountdown();
  return (
    <div className="rounded-2xl border border-border bg-card/80 p-5 shadow-[var(--shadow-card)] backdrop-blur md:p-6">
      <div className="mb-4 flex items-center gap-2">
        <span className="size-2 rounded-full bg-accent" />
        <span className="text-xs font-semibold uppercase tracking-widest text-primary">
          Avant l'événement
        </span>
      </div>
      <div className="grid grid-cols-4 gap-2 md:gap-3">
        <Cell value={c.days} label="Jours" />
        <Cell value={c.hours} label="Heures" />
        <Cell value={c.minutes} label="Min" />
        <Cell value={c.seconds} label="Sec" />
      </div>
    </div>
  );
}