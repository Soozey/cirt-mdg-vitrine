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
    <div className="flex flex-col items-center justify-center rounded-lg border border-iris-violet/25 bg-primary-deep/60 px-2 py-2.5 backdrop-blur">
      <span className="font-display text-xl font-bold tabular-nums text-iris-lime md:text-2xl">
        {value.toString().padStart(2, "0")}
      </span>
      <span className="mt-1 text-[8px] font-semibold uppercase tracking-widest text-primary-foreground/60">
        {label}
      </span>
    </div>
  );
}

export function Countdown() {
  const c = useCountdown();
  return (
    <div className="rounded-xl border border-iris-violet/25 bg-primary-deep/40 p-2.5 backdrop-blur">
      <div className="mb-2.5 flex items-center gap-2">
        <span className="size-2 rounded-full bg-iris-lime animate-pulse" />
        <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-primary-foreground/70">
          Avant l'événement
        </span>
      </div>
      <div className="grid grid-cols-4 gap-1.5">
        <Cell value={c.days} label="Jours" />
        <Cell value={c.hours} label="Heures" />
        <Cell value={c.minutes} label="Min" />
        <Cell value={c.seconds} label="Sec" />
      </div>
    </div>
  );
}
