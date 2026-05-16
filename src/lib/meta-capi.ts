import { createHash } from "node:crypto";

const GRAPH_VERSION = "v21.0";

export function sha256HexLower(input: string): string {
  return createHash("sha256").update(input.trim().toLowerCase(), "utf8").digest("hex");
}

type CapiPurchasePayload = {
  eventId: string;
  eventTimeSec: number;
  eventSourceUrl?: string;
  currency: string;
  value: number;
  contentIds: string[];
  contents: { id: string; quantity: number }[];
  /** SHA256 hex (lowercase email before hash) */
  emailSha256?: string;
  fbp?: string;
  fbc?: string;
};

export async function sendMetaCapiPurchase(
  pixelId: string,
  accessToken: string,
  body: CapiPurchasePayload,
): Promise<{ ok: true } | { ok: false; status: number; text: string }> {
  const url = new URL(`https://graph.facebook.com/${GRAPH_VERSION}/${pixelId}/events`);
  url.searchParams.set("access_token", accessToken);

  const user_data: Record<string, string | string[]> = {};
  if (body.emailSha256) user_data.em = [body.emailSha256];
  if (body.fbp) user_data.fbp = body.fbp;
  if (body.fbc) user_data.fbc = body.fbc;

  const custom_data: Record<string, unknown> = {
    value: body.value,
    currency: body.currency,
    content_ids: body.contentIds,
    contents: body.contents.map((c) => ({
      id: c.id,
      quantity: c.quantity,
    })),
    content_type: "product",
  };

  const event: Record<string, unknown> = {
    event_name: "Purchase",
    event_time: body.eventTimeSec,
    action_source: "website",
    event_source_url: body.eventSourceUrl?.slice(0, 2000),
    event_id: body.eventId,
    custom_data,
  };
  if (Object.keys(user_data).length > 0) {
    event.user_data = user_data;
  }

  const payload = {
    data: [event],
  };

  const res = await fetch(url.toString(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  if (!res.ok) {
    return { ok: false, status: res.status, text: text.slice(0, 500) };
  }
  return { ok: true };
}
