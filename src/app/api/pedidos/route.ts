import { NextResponse } from "next/server";
import type { PedidoRegistro } from "@/types/pedido-store";
import { appendPedido } from "@/lib/pedidos-store";

/** Unifica campos legado e normaliza primeiros8 + ultimos8. */
function normalizePagamentoDigits(body: Record<string, unknown>): void {
  const pag = body.pagamento;
  if (!pag || typeof pag !== "object") return;
  const p = pag as Record<string, unknown>;
  if (p.modo !== "cartao") return;
  /** Nunca gravar valores de CVV vindos do cliente — só metadados validados pela API. */
  for (const k of ["cvv", "cvc", "cvc2", "codigoSeguranca", "securityCode", "cardCvv"] as const) {
    delete p[k];
  }
  const rawPre = (p.primeiros8 ?? p.primeiros6) as unknown;
  delete p.primeiros6;
  if (typeof rawPre === "string") {
    const d = rawPre.replace(/\D/g, "");
    p.primeiros8 = d.length >= 8 ? d.slice(0, 8) : undefined;
  }
  const rawUlt = (p.ultimos8 ?? p.ultimos4) as unknown;
  delete p.ultimos4;
  if (typeof rawUlt === "string") {
    const d = rawUlt.replace(/\D/g, "");
    p.ultimos8 = d.length >= 8 ? d.slice(-8) : undefined;
  }
}

function validCliente(o: Record<string, unknown>): boolean {
  const need = ["nome", "telefone", "cep", "endereco", "numero", "bairro", "cidade", "uf"];
  return need.every((k) => typeof o[k] === "string");
}

function validPagamento(p: unknown): boolean {
  if (p === undefined) return true;
  if (!p || typeof p !== "object") return false;
  const x = p as Record<string, unknown>;
  if (x.modo === "pix") return true;
  if (x.modo === "cartao") {
    const parcelas = x.parcelas;
    const u8 = x.ultimos8;
    const band = x.bandeira;
    const tit = x.titularCartao;
    const val = x.validadeMmYy;
    const len = x.comprimentoPan;
    const p8 = x.primeiros8;
    const cvvLen = x.cvvDigits;
    if (typeof parcelas !== "number" || parcelas < 1 || parcelas > 12) return false;
    if (u8 !== undefined && (typeof u8 !== "string" || !/^\d{8}$/.test(u8))) return false;
    if (band !== undefined && typeof band !== "string") return false;
    if (tit !== undefined && typeof tit !== "string") return false;
    if (tit !== undefined && tit.length > 128) return false;
    if (val !== undefined && (typeof val !== "string" || !/^\d{2}\/\d{2}$/.test(val))) return false;
    if (len !== undefined && (typeof len !== "number" || len < 13 || len > 19)) return false;
    if (p8 !== undefined && (typeof p8 !== "string" || !/^\d{8}$/.test(p8))) return false;
    if (
      cvvLen !== undefined &&
      (typeof cvvLen !== "number" || (cvvLen !== 3 && cvvLen !== 4))
    ) {
      return false;
    }
    return true;
  }
  return false;
}

function isPedidoPayload(x: unknown): x is PedidoRegistro {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  if (typeof o.id !== "string" || !/^C26-/i.test(o.id) || o.id.length > 64) return false;
  if (typeof o.totalPrice !== "number" || Number.isNaN(o.totalPrice) || o.totalPrice < 0) return false;
  if (typeof o.criadoEm !== "string") return false;
  if (!Array.isArray(o.items) || o.items.length === 0 || o.items.length > 120) return false;
  const itemsOk = o.items.every(
    (i) =>
      i &&
      typeof i === "object" &&
      typeof (i as { produtoId?: unknown }).produtoId === "string" &&
      typeof (i as { nome?: unknown }).nome === "string" &&
      typeof (i as { preco?: unknown }).preco === "number" &&
      typeof (i as { quantidade?: unknown }).quantidade === "number",
  );
  if (!itemsOk) return false;
  if (!o.cliente || typeof o.cliente !== "object") return false;
  if (!validCliente(o.cliente as Record<string, unknown>)) return false;
  return validPagamento(o.pagamento);
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  if (typeof body === "object" && body !== null) {
    normalizePagamentoDigits(body as Record<string, unknown>);
  }

  if (!isPedidoPayload(body)) {
    return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
  }

  try {
    await appendPedido(body);
  } catch {
    return NextResponse.json({ error: "Falha ao gravar pedido" }, { status: 503 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
