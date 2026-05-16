import { NextResponse } from "next/server";
import { appendLojistaPedidoPersonalizado } from "@/lib/lojista-pedido-personalizado-store";
import type { LojistaPedidoPersonalizadoRegistro } from "@/types/lojista-pedido-personalizado";

const MAX_CONTATO = 200;
const MAX_MENSAGEM = 8000;
const MIN_MENSAGEM = 8;

function asTrimmedString(v: unknown, max: number): string | null {
  if (typeof v !== "string") return null;
  const s = v.trim();
  if (!s.length) return null;
  return s.length > max ? s.slice(0, max) : s;
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "JSON inválido." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false, error: "Corpo inválido." }, { status: 400 });
  }

  const o = body as Record<string, unknown>;
  const contato = asTrimmedString(o.contato, MAX_CONTATO);
  const mensagem = asTrimmedString(o.mensagem, MAX_MENSAGEM);

  if (!contato || contato.length < 3) {
    return NextResponse.json(
      { ok: false, error: "Informe um contato válido (e-mail ou telefone, pelo menos 3 caracteres)." },
      { status: 400 },
    );
  }
  if (!mensagem || mensagem.length < MIN_MENSAGEM) {
    return NextResponse.json(
      {
        ok: false,
        error: `Descreva seu pedido com pelo menos ${MIN_MENSAGEM} caracteres.`,
      },
      { status: 400 },
    );
  }

  const registro: LojistaPedidoPersonalizadoRegistro = {
    id: crypto.randomUUID(),
    criadoEm: new Date().toISOString(),
    contato,
    mensagem,
  };

  try {
    await appendLojistaPedidoPersonalizado(registro);
  } catch (err) {
    console.error("[api/lojista/pedido-personalizado]", err);
    return NextResponse.json(
      { ok: false, error: "Não foi possível registrar agora. Tente de novo em instantes." },
      { status: 503 },
    );
  }

  return NextResponse.json({ ok: true, id: registro.id });
}
