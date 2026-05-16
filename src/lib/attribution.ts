/** Persistência de UTMs / fbclid para cruzar com conversões (ex.: Meta Ads). */
export const ATTRIBUTION_STORAGE_KEY = "copa2026:attribution:v1";

export type StoredAttribution = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  fbclid?: string;
  capturedAt: string;
};

function pickParam(search: URLSearchParams, key: string): string | undefined {
  const v = search.get(key)?.trim();
  return v && v.length > 0 ? v.slice(0, 512) : undefined;
}

/** Mescla parâmetros da URL atual no objeto guardado em `sessionStorage`. */
export function captureAttributionFromSearch(search: string): void {
  if (typeof window === "undefined") return;
  let sp: URLSearchParams;
  try {
    sp = new URLSearchParams(search.startsWith("?") ? search : `?${search}`);
  } catch {
    return;
  }

  const patch: Partial<StoredAttribution> = {};
  const utmKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;
  for (const k of utmKeys) {
    const v = pickParam(sp, k);
    if (v) patch[k] = v;
  }
  const fbclid = pickParam(sp, "fbclid");
  if (fbclid) patch.fbclid = fbclid;

  if (Object.keys(patch).length === 0) return;

  let prev: StoredAttribution = { capturedAt: new Date().toISOString() };
  try {
    const raw = window.sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY);
    if (raw) prev = { ...prev, ...JSON.parse(raw) };
  } catch {
    /* ignore */
  }

  const next: StoredAttribution = {
    ...prev,
    ...patch,
    capturedAt: new Date().toISOString(),
  };

  try {
    window.sessionStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
}

export function getStoredAttribution(): StoredAttribution | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY);
    if (!raw) return null;
    const o = JSON.parse(raw) as StoredAttribution;
    return o && typeof o === "object" ? o : null;
  } catch {
    return null;
  }
}

export function readCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return m?.[1] ? decodeURIComponent(m[1]) : undefined;
}
