import { NextResponse } from "next/server";
import type { CheckoutAbandonPayload, RemarketingCheckoutItem } from "@/types/remarketing";
import { upsertCheckoutAbandon } from "@/lib/checkout-abandon-store";

const MAX_ITEMS = 40;
const MAX_STR = 500;

function trimStr(s: unknown, max: number): string | undefined {
  if (typeof s !== "string") return undefined;
  const t = s.trim();
  if (t.length === 0) return undefined;
  return t.length > max ? t.slice(0, max) : t;
}

function parseItems(raw: unknown): RemarketingCheckoutItem[] | null {
  if (!Array.isArray(raw)) return null;
  const out: RemarketingCheckoutItem[] = [];
  for (const row of raw.slice(0, MAX_ITEMS)) {
    if (!row || typeof row !== "object") continue;
    const r = row as Record<string, unknown>;
    const produtoId = trimStr(r.produtoId, 80);
    const nome = trimStr(r.nome, MAX_STR);
    const quantidade = typeof r.quantidade === "number" && r.quantidade > 0 && r.quantidade <= 99 ? r.quantidade : null;
    const linhaTotal = typeof r.linhaTotal === "number" && Number.isFinite(r.linhaTotal) && r.linhaTotal >= 0 ? r.linhaTotal : null;
    if (!produtoId || !nome || quantidade == null || linhaTotal == null) continue;
    out.push({ produtoId, nome, quantidade, linhaTotal });
  }
  return out.length > 0 ? out : null;
}

export async function POST(req: Request) {
  if (process.env.REMARKETING_CHECKOUT_ABANDON === "0") {
    return NextResponse.json({ ok: true, skipped: true });
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

  const b = body as Record<string, unknown>;
  const sessionId = trimStr(b.sessionId, 80);
  if (!sessionId || sessionId.length < 8) {
    return NextResponse.json({ error: "sessionId inválido" }, { status: 400 });
  }

  const modo = b.paymentModo;
  const paymentModo = modo === "pix" || modo === "cartao" ? modo : null;
  if (!paymentModo) {
    return NextResponse.json({ error: "paymentModo inválido" }, { status: 400 });
  }

  const subtotalLoja =
    typeof b.subtotalLoja === "number" && Number.isFinite(b.subtotalLoja) && b.subtotalLoja >= 0
      ? b.subtotalLoja
      : null;
  const totalComPagamentoEscolhido =
    typeof b.totalComPagamentoEscolhido === "number" &&
    Number.isFinite(b.totalComPagamentoEscolhido) &&
    b.totalComPagamentoEscolhido >= 0
      ? b.totalComPagamentoEscolhido
      : null;

  if (subtotalLoja == null || totalComPagamentoEscolhido == null) {
    return NextResponse.json({ error: "totais inválidos" }, { status: 400 });
  }

  const items = parseItems(b.items);
  if (!items) {
    return NextResponse.json({ error: "items inválido" }, { status: 400 });
  }

  const clienteRaw = b.cliente;
  const cliente: CheckoutAbandonPayload["cliente"] = {};
  if (clienteRaw && typeof clienteRaw === "object") {
    const c = clienteRaw as Record<string, unknown>;
    cliente.email = trimStr(c.email, 120)?.toLowerCase();
    cliente.nome = trimStr(c.nome, 120);
    cliente.telefone = trimStr(c.telefone, 32);
    cliente.cep = trimStr(c.cep, 16);
    cliente.cidade = trimStr(c.cidade, 80);
    cliente.uf = trimStr(c.uf, 3)?.toUpperCase();
  }

  const payload: CheckoutAbandonPayload = {
    sessionId,
    cliente,
    paymentModo,
    subtotalLoja,
    totalComPagamentoEscolhido,
    items,
    referrer: trimStr(b.referrer, 2048),
  };

  try {
    await upsertCheckoutAbandon(payload);
  } catch (e) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[checkout-abandon]", e);
    }
    return NextResponse.json({ error: "Erro ao gravar" }, { status: 503 });
  }

  return NextResponse.json({ ok: true });
}
