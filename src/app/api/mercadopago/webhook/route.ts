import { NextResponse } from "next/server";
import { getMercadoPagoPayment } from "@/lib/mercadopago-server";

export const dynamic = "force-dynamic";

/** Alguns painéis verificam a URL com GET antes de ativar notificações. */
export async function GET() {
  return NextResponse.json({ ok: true, service: "mercadopago-webhook" });
}

type MpNotifyBody = {
  type?: string;
  action?: string;
  data?: { id?: string | number };
  topic?: string;
  resource?: string;
};

function extractPaymentId(body: MpNotifyBody): string | null {
  const id = body.data?.id;
  if (id != null && String(id).length > 0) return String(id);
  if (body.resource && /\/payments\/(\d+)/.test(body.resource)) {
    const m = body.resource.match(/\/payments\/(\d+)/);
    return m?.[1] ?? null;
  }
  if (body.topic === "payment" && typeof (body as { id?: unknown }).id !== "undefined") {
    const legacy = (body as { id?: unknown }).id;
    if (legacy != null) return String(legacy);
  }
  return null;
}

/**
 * Notificações Mercado Pago — registe a URL no painel MP (mesmo path).
 * Opcional: validação de assinatura conforme doc atual do MP.
 */
export async function POST(req: Request) {
  const client = getMercadoPagoPayment();
  if (!client) {
    return NextResponse.json({ error: "Token não configurado" }, { status: 503 });
  }

  let body: MpNotifyBody;
  try {
    body = (await req.json()) as MpNotifyBody;
  } catch {
    return NextResponse.json({ received: false }, { status: 400 });
  }

  const paymentId = extractPaymentId(body);
  if (!paymentId) {
    return NextResponse.json({ received: true, skipped: true });
  }

  try {
    const pay = await client.get({ id: paymentId });
    const ref = pay.external_reference;
    const st = pay.status;
    if (process.env.NODE_ENV === "development") {
      console.log("[mercadopago webhook] payment", paymentId, "status", st, "ref", ref);
    }
    if (st === "approved" && ref) {
      console.log("[mercadopago webhook] PIX aprovado:", ref, paymentId);
    }
  } catch (e) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[mercadopago webhook] falha ao buscar pagamento", paymentId, e);
    }
  }

  return NextResponse.json({ received: true });
}
