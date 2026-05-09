import { NextResponse } from "next/server";
import { getStripeServer } from "@/lib/stripe-server";

/** Mínimo R$ 1,00 em centavos (Stripe / PIX Brasil). */
const MIN_AMOUNT_CENTS = 100;

export async function POST(req: Request) {
  const stripe = getStripeServer();
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe não configurado. Defina STRIPE_SECRET_KEY." },
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
  if (typeof amountRaw !== "number" || Number.isNaN(amountRaw) || amountRaw <= 0) {
    return NextResponse.json({ error: "Valor inválido" }, { status: 400 });
  }
  if (!customerEmail || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(customerEmail)) {
    return NextResponse.json({ error: "E-mail obrigatório para PIX Stripe" }, { status: 400 });
  }
  if (customerName.length < 2) {
    return NextResponse.json({ error: "Nome obrigatório" }, { status: 400 });
  }

  const amountCents = Math.max(MIN_AMOUNT_CENTS, Math.round(amountRaw * 100));

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountCents,
      currency: "brl",
      payment_method_types: ["pix"],
      metadata: {
        order_id: orderId,
        customer_email: customerEmail,
      },
      receipt_email: customerEmail,
      description: `Pedido ${orderId}`,
    });

    if (!paymentIntent.client_secret) {
      return NextResponse.json({ error: "Falha ao criar intenção de pagamento" }, { status: 502 });
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erro Stripe";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
