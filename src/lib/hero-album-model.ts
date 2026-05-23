export function resolveHeroAlbumModelUrl(): string {
  const fallback = "/models/album-copa-2026.glb";
  const raw = process.env.NEXT_PUBLIC_HERO_MODEL_URL?.trim();
  if (!raw) return fallback;
  if (/^https?:\/\//i.test(raw)) return raw;
  return raw.startsWith("/") ? raw : `/${raw}`;
}

export const HERO_ALBUM_MODEL_URL = resolveHeroAlbumModelUrl();
