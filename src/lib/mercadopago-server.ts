import { MercadoPagoConfig, Payment } from "mercadopago";

let payment: Payment | null = null;

export function getMercadoPagoAccessToken(): string | undefined {
  return process.env.MERCADOPAGO_ACCESS_TOKEN?.trim() || undefined;
}

/** Cliente de pagamentos (PIX etc.). `null` se `MERCADOPAGO_ACCESS_TOKEN` não estiver definido. */
export function getMercadoPagoPayment(): Payment | null {
  const token = getMercadoPagoAccessToken();
  if (!token) return null;
  if (!payment) {
    payment = new Payment(new MercadoPagoConfig({ accessToken: token }));
  }
  return payment;
}
