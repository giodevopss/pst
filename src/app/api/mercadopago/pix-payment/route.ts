import { NextResponse } from "next/server";
import {
  formatMercadoPagoApiError,
  validateMercadoPagoAccessToken,
} from "@/lib/mercadopago-errors";
import { buildMercadoPagoNotificationUrl } from "@/lib/mercadopago-notify-url";
import { getMercadoPagoAccessToken, getMercadoPagoPayment } from "@/lib/mercadopago-server";

export const dynamic = "force-dynamic";

const MIN_BRL = 0.01;

function splitPayerName(full: string): { first_name: string; last_name: string } {
  const t = full.trim();
  if (!t) return { first_name: "Cliente", last_name: "Loja" };
  const parts = t.split(/\s+/);
  if (parts.length === 1) return { first_name: parts[0]!, last_name: parts[0]! };
  return { first_name: parts[0]!, last_name: parts.slice(1).join(" ") };
}

export async function POST(req: Request) {
  const accessToken = getMercadoPagoAccessToken();
  if (!accessToken) {
    return NextResponse.json(
      { error: "Mercado Pago não configurado. Defina MERCADOPAGO_ACCESS_TOKEN." },
      { status: 503 },
    );
  }

  const tokenError = validateMercadoPagoAccessToken(accessToken);
  if (tokenError) {
    return NextResponse.json({ error: tokenError }, { status: 503 });
  }

  const client = getMercadoPagoPayment();
  if (!client) {
    return NextResponse.json(
      { error: "Mercado Pago não configurado. Defina MERCADOPAGO_ACCESS_TOKEN." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
  }

  const o = body as Record<string, unknown>;
  const orderId = typeof o.orderId === "string" ? o.orderId.trim() : "";
  const amountRaw = o.amount;
  const customerEmail = typeof o.customerEmail === "string" ? o.customerEmail.trim().toLowerCase() : "";
  const customerName = typeof o.customerName === "string" ? o.customerName.trim() : "";

  if (!/^C26-/i.test(orderId) || orderId.length > 64) {
    return NextResponse.json({ error: "orderId inválido" }, { status: 400 });
  }
  if (typeof amountRaw !== "number" || Number.isNaN(amountRaw) || amountRaw < MIN_BRL) {
    return NextResponse.json(
      { error: `Valor inválido (mínimo R$ ${MIN_BRL.toFixed(2)})` },
      { status: 400 },
    );
  }
  if (!customerEmail || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(customerEmail)) {
    return NextResponse.json({ error: "E-mail obrigatório para PIX Mercado Pago" }, { status: 400 });
  }
  if (customerName.length < 2) {
    return NextResponse.json({ error: "Nome obrigatório" }, { status: 400 });
  }

  const amount = Math.round(amountRaw * 100) / 100;
  const payer = splitPayerName(customerName);

  const notificationUrl = buildMercadoPagoNotificationUrl(req);

  try {
    const result = await client.create({
      body: {
        transaction_amount: amount,
        description: `Pedido ${orderId}`,
        payment_method_id: "pix",
        external_reference: orderId,
        payer: {
          email: customerEmail,
          first_name: payer.first_name.slice(0, 60),
          last_name: payer.last_name.slice(0, 60),
        },
        ...(notificationUrl ? { notification_url: notificationUrl } : {}),
        metadata: { order_id: orderId },
      },
      requestOptions: { idempotencyKey: orderId },
    });

    const td = result.point_of_interaction?.transaction_data;
    const qrCode = td?.qr_code?.trim();
    const b64 = td?.qr_code_base64?.trim();
    const pixQrDataUrl =
      b64 != null && b64.length > 0
        ? b64.startsWith("data:")
          ? b64
          : `data:image/png;base64,${b64}`
        : undefined;

    if (!result.id) {
      return NextResponse.json({ error: "Resposta sem id de pagamento do Mercado Pago" }, { status: 502 });
    }
    if (!qrCode && !pixQrDataUrl && !td?.ticket_url) {
      return NextResponse.json(
        {
          error:
            "PIX gerado sem QR/código na resposta. Verifique a conta Mercado Pago e se o método PIX está ativo.",
        },
        { status: 502 },
      );
    }

    return NextResponse.json({
      paymentId: result.id,
      status: result.status ?? "pending",
      pixCopiaECola: qrCode ?? "",
      pixQrDataUrl: pixQrDataUrl ?? null,
      ticketUrl: td?.ticket_url ?? null,
      expiresAt: result.date_of_expiration ?? null,
    });
  } catch (e: unknown) {
    console.error("[mercadopago/pix-payment]", formatMercadoPagoApiError(e));
    return NextResponse.json({ error: formatMercadoPagoApiError(e) }, { status: 502 });
  }
}
