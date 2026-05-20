/**
 * Meta Pixel (browser). Só dispara se `NEXT_PUBLIC_META_PIXEL_ID` existir e `fbq` estiver carregado.
 * @see https://developers.facebook.com/docs/meta-pixel
 */

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

import { getMetaPixelId } from "@/lib/meta-pixel";

function pixelId(): string | undefined {
  return getMetaPixelId();
}

export function metaPixelReady(): boolean {
  return typeof window !== "undefined" && typeof window.fbq === "function" && !!pixelId();
}

function whenFbqReady(fn: () => void, maxAttempts = 40, intervalMs = 100): void {
  if (typeof window === "undefined") return;
  let n = 0;
  const tick = () => {
    if (metaPixelReady()) {
      fn();
      return;
    }
    n += 1;
    if (n >= maxAttempts) return;
    window.setTimeout(tick, intervalMs);
  };
  tick();
}

export function trackMetaPageView(): void {
  if (!metaPixelReady()) return;
  window.fbq!("track", "PageView");
}

export function trackMetaInitiateCheckout(payload: {
  value: number;
  currency: string;
  num_items?: number;
  contents?: { id: string; quantity: number }[];
}): void {
  whenFbqReady(() => {
    window.fbq!("track", "InitiateCheckout", {
      value: payload.value,
      currency: payload.currency,
      num_items: payload.num_items,
      contents: payload.contents,
      content_type: "product",
    });
  });
}

export function trackMetaPurchase(
  payload: {
    value: number;
    currency: string;
    contents: { id: string; quantity: number }[];
    content_ids?: string[];
  },
  options: { eventID: string },
): void {
  whenFbqReady(() => {
    const custom: Record<string, unknown> = {
      value: payload.value,
      currency: payload.currency,
      contents: payload.contents,
      content_type: "product",
    };
    if (payload.content_ids?.length) {
      custom.content_ids = payload.content_ids;
    }
    window.fbq!("track", "Purchase", custom, { eventID: options.eventID });
  });
}
