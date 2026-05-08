const FALLBACK_ORIGIN = "https://copa2026.store";

/**
 * Origin público para metadata, sitemap e robots.
 * Aceita NEXT_PUBLIC_SITE_URL vazia (Railway/build) ou inválida — cai no fallback.
 */
export function resolvePublicSiteOrigin(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return FALLBACK_ORIGIN;
  try {
    const normalized = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    return new URL(normalized).origin;
  } catch {
    return FALLBACK_ORIGIN;
  }
}

export function publicMetadataBase(): URL {
  return new URL(resolvePublicSiteOrigin());
}
