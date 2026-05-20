import { NextResponse } from "next/server";
import { getPedidoById } from "@/lib/pedidos-store";
import { isPedidoIdValid, toPublicPedido } from "@/lib/pedido-public";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!id || !isPedidoIdValid(id)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  try {
    const pedido = await getPedidoById(id);
    if (!pedido) {
      return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, pedido: toPublicPedido(pedido) });
  } catch {
    return NextResponse.json({ error: "Falha ao consultar pedido" }, { status: 503 });
  }
}
