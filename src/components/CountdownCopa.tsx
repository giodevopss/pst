"use client";

import { useEffect, useState } from "react";
import { STORE_CONFIG } from "@/config/store";

function diff(target: Date) {
  const now = new Date();
  const ms = Math.max(0, target.getTime() - now.getTime());
  const dias = Math.floor(ms / (1000 * 60 * 60 * 24));
  const horas = Math.floor((ms / (1000 * 60 * 60)) % 24);
  const minutos = Math.floor((ms / (1000 * 60)) % 60);
  const segundos = Math.floor((ms / 1000) % 60);
  return { dias, horas, minutos, segundos };
}

const LABELS: Array<["dias" | "horas" | "minutos" | "segundos", string]> = [
  ["dias", "Dias"],
  ["horas", "Horas"],
  ["minutos", "Min"],
  ["segundos", "Seg"],
];

export function CountdownCopa({ compact = false }: { compact?: boolean }) {
  const target = new Date(STORE_CONFIG.worldCup.startDate);
  const [mounted, setMounted] = useState(false);
  const [t, setT] = useState({ dias: 0, horas: 0, minutos: 0, segundos: 0 });

  useEffect(() => {
    setMounted(true);
    setT(diff(target));
    const id = setInterval(() => setT(diff(target)), 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const display = mounted ? t : { dias: 0, horas: 0, minutos: 0, segundos: 0 };

  return (
    <div
      className={
        compact
          ? "inline-flex flex-col gap-2 rounded-full border border-border bg-surface/60 px-4 py-2 text-xs sm:flex-row sm:items-center"
          : "inline-flex flex-col gap-3 rounded-2xl border border-border bg-surface/60 p-4 backdrop-blur md:gap-2"
      }
    >
      {!compact && (
        <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-brand-yellow/95 md:text-xs">
          Copa do Mundo FIFA 2026™ — abertura
        </p>
      )}
      <div
        className={`flex flex-wrap items-end gap-x-3 gap-y-1 ${compact ? "" : "md:items-baseline"}`}
      >
        <span
          className={
            compact
              ? "max-w-[11rem] text-[10px] font-semibold uppercase leading-tight tracking-wider text-muted"
              : "shrink-0 text-xs font-semibold uppercase tracking-widest text-muted"
          }
        >
          {compact ? "Falta p/ a Copa" : "Falta para a Copa"}
        </span>
        <div className="flex flex-wrap items-baseline gap-2">
        {LABELS.map(([key, label], i) => (
          <div key={key} className="flex items-baseline gap-1">
            <span
              suppressHydrationWarning
              className={
                compact
                  ? "font-display text-base tabular-nums text-foreground"
                  : "font-display text-3xl tabular-nums text-foreground md:text-4xl"
              }
            >
              {String(display[key]).padStart(2, "0")}
            </span>
            <span
              className={
                compact
                  ? "text-[10px] font-medium uppercase tracking-wider text-muted"
                  : "text-[10px] font-medium uppercase tracking-wider text-muted md:text-xs"
              }
            >
              {label}
            </span>
            {i < LABELS.length - 1 && <span className="text-muted">·</span>}
          </div>
        ))}
        </div>
      </div>
    </div>
  );
}
