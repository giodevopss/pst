import Stripe from "stripe";
import { NextResponse } from "next/server";
import { getStripeServer } from "@/lib/stripe-server";

export const dynamic = "force-dynamic";

/**
 * Configure o endpoint no Dashboard Stripe com o mesmo path.
 * Variável STRIPE_WEBHOOK_SECRET = Signing secret do webhook.
 */
export async function POST(req: Request) {
  const stripe = getStripeServer();
  const whSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  if (!stripe || !whSecret) {
    return NextResponse.json({ error: "Webhook não configurado" }, { status: 503 });
  }

  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Assinatura ausente" }, { status: 400 });
  }

  const raw = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, whSecret);
  } catch {
    return NextResponse.json({ error: "Assinatura inválida" }, { status: 400 });
  }

  switch (event.type) {
    case "payment_intent.succeeded": {
      const pi = event.data.object;
      if (process.env.NODE_ENV === "development" && pi.metadata?.order_id) {
        console.log("[stripe webhook] PIX pago:", pi.metadata.order_id, pi.id);
      }
      break;
    }
    case "payment_intent.payment_failed":
      break;
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
