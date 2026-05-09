import Stripe from "stripe";

/** Alinhado ao SDK instalado (`stripe/esm/apiVersion.js`). */
const STRIPE_API_VERSION = "2026-04-22.dahlia" as const;

let stripe: Stripe | null = null;

export function getStripeServer(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) return null;
  if (!stripe) {
    stripe = new Stripe(key, {
      apiVersion: STRIPE_API_VERSION,
      typescript: true,
    });
  }
  return stripe;
}
