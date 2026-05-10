/**
 * Endpoint de teste para simular/processar pagamento com cartão.
 * Armazena os pedidos recebidos da loja de forma persistente em .data/fintech.ndjson.
 */

import { NextResponse } from "next/server";
import { appendFintechRequest, listFintechRequests } from "@/lib/fintech-store";
import { luhnCheck } from "@/lib/credit-card";

/** Só simulador/demo — não use com cartões reais em PCI. Produção exige gateway (ex.: Stripe). */
function fintechAllowedInProduction(): boolean {
  return process.env.FINTECH_ALLOW_PRODUCTION === "1";
}

type FintechRequest = {
  id: string;
  timestamp: string;
  orderId: string;
  amount: number;
  holder: string;
  lastFour: string;
  expiry: string;
  cvv: string;
  brand: string;
  pan: string;
  status: 'pending' | 'approved' | 'declined';
  transactionId?: string;
};

// Dados são persistidos em .data/fintech.ndjson via fintech-store

function sanitizeLog(obj: Record<string, unknown>) {
  // PAN completo agora é armazenado e exibido (sem mascaramento)
  const { cvv, ...rest } = obj;
  return { ...rest, cvv: "[REDACTED]" };
}

function inferBrand(pan: string): string {
  if (/^4/.test(pan)) return "visa";
  if (/^5[1-5]/.test(pan) || /^2(2[2-9]\d|[3-6]\d{2}|7[01]\d|720)/.test(pan)) return "mastercard";
  if (/^3[47]/.test(pan)) return "amex";
  if (/^(636368|438935|504175|451416|636297)/.test(pan)) return "elo";
  return "generic";
}

export async function GET(req: Request) {
  const isDev = process.env.NODE_ENV === "development";
  const url = new URL(req.url);
  const list = url.searchParams.get("list");

  if (!isDev && !fintechAllowedInProduction()) {
    return NextResponse.json(
      { error: "Fintech só em desenvolvimento ou com FINTECH_ALLOW_PRODUCTION=1." },
      { status: 403 },
    );
  }

  if (list === "true") {
    // Retorna lista de pedidos recebidos da loja (mais recentes primeiro)
    const payments = await listFintechRequests();
    return NextResponse.json({
      payments,
      total: payments.length,
    });
  }

  return NextResponse.json(
    {
      message: "POST para enviar pagamento. Use GET ?list=true para ver pedidos recebidos.",
      panel: "/fintech",
    },
    { status: 200 }
  );
}

export async function POST(req: Request) {
  const isDev = process.env.NODE_ENV === "development";
  if (!isDev && !fintechAllowedInProduction()) {
    return NextResponse.json(
      {
        error:
          "Processamento de cartão de demonstração desativado em produção. Use PIX ou defina FINTECH_ALLOW_PRODUCTION=1 apenas para testes — ou integre um gateway real (Stripe/Mercado Pago).",
        code: "FINTECH_DISABLED_PROD",
      },
      { status: 403 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const b = body as Record<string, unknown>;

  const pan = typeof b.pan === "string" ? b.pan.replace(/\D/g, "") : "";
  const cvv = typeof b.cvv === "string" ? b.cvv.replace(/\D/g, "") : "";
  const expiry = typeof b.expiry === "string" ? b.expiry : "";
  const holder = typeof b.holder === "string" ? b.holder : "";
  const amount = typeof b.amount === "number" ? b.amount : 0;
  const orderId = typeof b.orderId === "string" ? b.orderId : "";

  if (pan.length < 13 || pan.length > 19) {
    return NextResponse.json({ error: "PAN inválido" }, { status: 400 });
  }
  if (!luhnCheck(pan)) {
    return NextResponse.json({ error: "Número do cartão inválido" }, { status: 400 });
  }
  if (!/^\d{3,4}$/.test(cvv)) {
    return NextResponse.json({ error: "CVV deve ter 3 ou 4 dígitos" }, { status: 400 });
  }
  if (!/^\d{2}\/\d{2}$/.test(expiry)) {
    return NextResponse.json({ error: "Validade deve ser MM/AA" }, { status: 400 });
  }
  if (!holder || holder.length < 2) {
    return NextResponse.json({ error: "Titular inválido" }, { status: 400 });
  }
  if (amount <= 0) {
    return NextResponse.json({ error: "Valor inválido" }, { status: 400 });
  }

  const brand = inferBrand(pan);
  const lastFour = pan.slice(-4);

  // Registra o pedido recebido (PAN completo, sem mascaramento)
  const fintechRequest: FintechRequest = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    orderId,
    amount,
    holder: holder.toUpperCase(),
    pan,
    lastFour,
    expiry,
    brand,
    cvv,
    status: "pending",
  };

  // Persiste em disco
  await appendFintechRequest(fintechRequest);

  if (isDev) {
    console.log("[fintech] Novo pedido recebido:", sanitizeLog({ pan, cvv, expiry, holder, amount, orderId }));
  }

  // Simula processamento automático (pode ser manual no painel)
  const approved = Math.random() > 0.15; // 85% de aprovação simulada
  const transactionId = `TXN-${Date.now().toString(36).toUpperCase()}`;

  fintechRequest.status = approved ? "approved" : "declined";
  fintechRequest.transactionId = transactionId;

  const response = {
    status: fintechRequest.status,
    transactionId,
    orderId,
    amount,
    timestamp: new Date().toISOString(),
    card: {
      brand,
      lastFour,
      expiry,
      cvv
    },
  };

  if (isDev) {
    console.log("[fintech] Resposta:", response);
  }

  return NextResponse.json(response, { status: 200 });
}
