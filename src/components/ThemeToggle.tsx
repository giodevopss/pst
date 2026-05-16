"use client";

import { Moon, Sun } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { applyTheme, THEME_STORAGE_KEY, type SiteTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

function readDomTheme(): SiteTheme {
  return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
}

export function ThemeToggle({ className }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<SiteTheme>("dark");

  useEffect(() => {
    setTheme(readDomTheme());
    setMounted(true);
    const obs = new MutationObserver(() => setTheme(readDomTheme()));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next: SiteTheme = prev === "light" ? "dark" : "light";
      try {
        if (next === "dark") localStorage.removeItem(THEME_STORAGE_KEY);
        else localStorage.setItem(THEME_STORAGE_KEY, next);
      } catch {
        /* ignore */
      }
      applyTheme(next);
      return next;
    });
  }, []);

  if (!mounted) {
    return (
      <div
        className={cn(
          "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-surface/60 sm:h-11 sm:w-11",
          className,
        )}
        aria-hidden
      />
    );
  }

  const isLight = theme === "light";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isLight ? "Ativar modo escuro" : "Ativar modo claro"}
      className={cn(
        "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-surface/60 text-foreground transition hover:border-brand-yellow hover:text-brand-yellow sm:h-11 sm:w-11",
        className,
      )}
    >
      {isLight ? (
        <Moon className="h-[1.15rem] w-[1.15rem] sm:h-5 sm:w-5" strokeWidth={2} />
      ) : (
        <Sun className="h-[1.15rem] w-[1.15rem] sm:h-5 sm:w-5" strokeWidth={2} />
      )}
    </button>
  );
}
