/** ID do Meta Pixel (Events Manager). Override com `NEXT_PUBLIC_META_PIXEL_ID` no build/deploy. */
export const META_PIXEL_ID_DEFAULT = "2545916985811236";

export function getMetaPixelId(): string | undefined {
  const raw = (process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim() || META_PIXEL_ID_DEFAULT).trim();
  if (!/^\d{8,20}$/.test(raw)) return undefined;
  return raw;
}
