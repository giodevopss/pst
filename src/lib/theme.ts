export const THEME_STORAGE_KEY = "copa2026-theme";

export type SiteTheme = "light" | "dark";

export function getStoredTheme(): SiteTheme | null {
  if (typeof window === "undefined") return null;
  try {
    const v = localStorage.getItem(THEME_STORAGE_KEY);
    return v === "light" || v === "dark" ? v : null;
  } catch {
    return null;
  }
}

/** Padrão do site: modo claro. Modo escuro remove `data-theme="light"` do `<html>`. */
export const DEFAULT_THEME: SiteTheme = "light";

export function applyTheme(theme: SiteTheme) {
  const root = document.documentElement;
  if (theme === "light") root.setAttribute("data-theme", "light");
  else root.removeAttribute("data-theme");
}

export function themeColorFor(theme: SiteTheme): string {
  return theme === "light" ? "#eef1f8" : "#06080f";
}
