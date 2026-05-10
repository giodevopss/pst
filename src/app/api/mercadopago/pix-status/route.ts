import { NextResponse } from "next/server";
import { getMercadoPagoAccessToken } from "@/lib/mercadopago-server";

export const dynamic = "force-dynamic";

/** Indica se o servidor tem token MP (para o checkout escolher PIX Mercado Pago sem expor o segredo). */
export async function GET() {
  const available = !!getMercadoPagoAccessToken();
  return NextResponse.json({ available });
}
