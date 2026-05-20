import { NextResponse } from "next/server";
import { sendMetaCapiPurchase, sha256HexLower } from "@/lib/meta-capi";
import { getMetaPixelId } from "@/lib/meta-pixel";

type Body = {
  event_id?: unknown;
  value?: unknown;
  currency?: unknown;
  contents?: unknown;
  content_ids?: unknown;
  event_source_url?: unknown;
  email?: unknown;
  fbp?: unknown;
  fbc?: unknown;
};

function isContentRow(x: unknown): x is { id: string; quantity: number } {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  return typeof o.id === "string" && o.id.length > 0 && o.id.length <= 128 && typeof o.quantity === "number" && o.quantity >= 1 && o.quantity <= 9999;
}

export async function POST(req: Request) {
  if (process.env.META_CAPI_DISABLED === "1") {
    return NextResponse.json({ ok: true, skipped: true });
  }

  const accessToken = process.env.META_ACCESS_TOKEN?.trim();
  const pixelId = getMetaPixelId();
  if (!accessToken || !pixelId) {
    return NextResponse.json({ ok: true, skipped: true, reason: "not_configured" });
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  if (!raw || typeof raw !== "object") {
    return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
  }

  const body = raw as Body;
  const eventId =
    typeof body.event_id === "string" && body.event_id.length > 0 && body.event_id.length <= 128
      ? body.event_id
      : null;
  if (!eventId) {
    return NextResponse.json({ error: "event_id obrigatório" }, { status: 400 });
  }

  const value =
    typeof body.value === "number" && Number.isFinite(body.value) && body.value >= 0 && body.value < 1_000_000
      ? body.value
      : null;
  if (value === null) {
    return NextResponse.json({ error: "value inválido" }, { status: 400 });
  }

  const currency =
    typeof body.currency === "string" && /^[A-Z]{3}$/.test(body.currency) ? body.currency : "BRL";

  const contentsRaw = Array.isArray(body.contents) ? body.contents : [];
  if (contentsRaw.length === 0 || contentsRaw.length > 120) {
    return NextResponse.json({ error: "contents inválido" }, { status: 400 });
  }
  if (!contentsRaw.every(isContentRow)) {
    return NextResponse.json({ error: "contents inválido" }, { status: 400 });
  }
  const contents = contentsRaw as { id: string; quantity: number }[];

  let contentIds: string[] = contents.map((c) => c.id);
  if (Array.isArray(body.content_ids)) {
    const ids = body.content_ids.filter((x): x is string => typeof x === "string" && x.length > 0);
    if (ids.length > 0) contentIds = ids.slice(0, 120);
  }

  const eventSourceUrl =
    typeof body.event_source_url === "string" && body.event_source_url.startsWith("http")
      ? body.event_source_url.slice(0, 2000)
      : undefined;

  let emailSha256: string | undefined;
  if (typeof body.email === "string") {
    const em = body.email.trim().toLowerCase();
    if (em.length > 3 && em.includes("@") && em.length < 320) {
      emailSha256 = sha256HexLower(em);
    }
  }

  const fbp = typeof body.fbp === "string" && body.fbp.length < 512 ? body.fbp : undefined;
  const fbc = typeof body.fbc === "string" && body.fbc.length < 512 ? body.fbc : undefined;

  const result = await sendMetaCapiPurchase(pixelId, accessToken, {
    eventId,
    eventTimeSec: Math.floor(Date.now() / 1000),
    eventSourceUrl,
    currency,
    value,
    contentIds,
    contents,
    emailSha256,
    fbp,
    fbc,
  });

  if (!result.ok) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[meta/capi]", result.status, result.text);
    }
    return NextResponse.json({ ok: false, error: "capi_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
