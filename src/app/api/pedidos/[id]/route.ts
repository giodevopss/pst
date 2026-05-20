import { NextResponse } from "next/server";
import { getPedidoById } from "@/lib/pedidos-store";
import type { PagamentoPersistidoSeguro, PedidoRegistro } from "@/types/pedido-store";

function sanitizePagamento(pag?: PagamentoPersistidoSeguro): PagamentoPersistidoSeguro | undefined {
  if (!pag) return undefined;
  if (pag.modo === "pix") return pag;
  return {
    modo: "cartao",
    parcelas: pag.parcelas,
    bandeira: pag.bandeira,
    ultimos8: pag.ultimos8,
    ultimos4: pag.ultimos4,
  };
}

function toPublicPedido(p: PedidoRegistro) {
  return {
    id: p.id,
    items: p.items,
    totalPrice: p.totalPrice,
    cliente: {
      nome: p.cliente.nome,
      telefone: p.cliente.telefone,
      email: p.cliente.email,
      cidade: p.cliente.cidade,
      uf: p.cliente.uf,
      cep: p.cliente.cep,
      endereco: p.cliente.endereco,
      numero: p.cliente.numero,
      complemento: p.cliente.complemento,
      bairro: p.cliente.bairro,
    },
    criadoEm: p.criadoEm,
    atualizadoEm: p.atualizadoEm,
    statusPagamento: p.statusPagamento ?? "pendente",
    etapa: p.etapa ?? "pedido_feito",
    pagamento: sanitizePagamento(p.pagamento),
  };
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!id || !/^C26-/i.test(id) || id.length > 64) {
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
