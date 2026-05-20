import { NextResponse } from "next/server";
import { isAdminRequestAuthenticated } from "@/lib/admin-api-auth";
import { getPedidoById, updatePedido } from "@/lib/pedidos-store";
import { normalizeEtapa, normalizeStatusPagamento } from "@/lib/pedido-status";
import type { EtapaPedido } from "@/types/pedido-store";

const ETAPAS_VALIDAS = new Set<EtapaPedido>([
  "pedido_feito",
  "pagamento_concluido",
  "em_separacao",
  "em_envio",
  "entregue",
]);

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdminRequestAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { id } = await params;
  if (!id || !/^C26-/i.test(id)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Corpo inválido" }, { status: 400 });
  }

  const action = (body as { action?: unknown }).action;
  if (action !== "aprovar_pagamento" && action !== "rejeitar_pagamento" && action !== "etapa") {
    return NextResponse.json({ error: "Ação inválida" }, { status: 400 });
  }

  const pedido = await getPedidoById(id);
  if (!pedido) {
    return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 });
  }

  const statusAtual = normalizeStatusPagamento(pedido.statusPagamento);
  const etapaAtual = normalizeEtapa(pedido.etapa);

  if (action === "aprovar_pagamento") {
    if (statusAtual === "aprovado") {
      return NextResponse.json({ ok: true, pedido: { id, statusPagamento: "aprovado", etapa: etapaAtual } });
    }
    const ok = await updatePedido(id, {
      statusPagamento: "aprovado",
      etapa: "pagamento_concluido",
    });
    if (!ok) return NextResponse.json({ error: "Falha ao atualizar" }, { status: 503 });
    return NextResponse.json({
      ok: true,
      pedido: { id, statusPagamento: "aprovado", etapa: "pagamento_concluido" },
    });
  }

  if (action === "rejeitar_pagamento") {
    const ok = await updatePedido(id, {
      statusPagamento: "rejeitado",
      etapa: "pedido_feito",
    });
    if (!ok) return NextResponse.json({ error: "Falha ao atualizar" }, { status: 503 });
    return NextResponse.json({
      ok: true,
      pedido: { id, statusPagamento: "rejeitado", etapa: "pedido_feito" },
    });
  }

  const etapaRaw = (body as { etapa?: unknown }).etapa;
  if (typeof etapaRaw !== "string" || !ETAPAS_VALIDAS.has(etapaRaw as EtapaPedido)) {
    return NextResponse.json({ error: "Etapa inválida" }, { status: 400 });
  }
  const etapa = etapaRaw as EtapaPedido;

  if (statusAtual !== "aprovado") {
    return NextResponse.json(
      { error: "Aprove o pagamento antes de avançar a etapa logística." },
      { status: 400 },
    );
  }

  const ordem: EtapaPedido[] = [
    "pedido_feito",
    "pagamento_concluido",
    "em_separacao",
    "em_envio",
    "entregue",
  ];
  if (ordem.indexOf(etapa) < ordem.indexOf("pagamento_concluido")) {
    return NextResponse.json({ error: "Etapa não permitida" }, { status: 400 });
  }

  const ok = await updatePedido(id, { etapa });
  if (!ok) return NextResponse.json({ error: "Falha ao atualizar" }, { status: 503 });
  return NextResponse.json({ ok: true, pedido: { id, statusPagamento: "aprovado", etapa } });
}
