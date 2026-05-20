import type { EtapaPedido, PedidoRegistro, StatusPagamentoPedido } from "@/types/pedido-store";

export const ETAPAS_PEDIDO = [
  { id: "pedido_feito" as const, label: "Pedido feito" },
  { id: "pagamento_concluido" as const, label: "Pagamento concluído" },
  { id: "em_separacao" as const, label: "Em separação" },
  { id: "em_envio" as const, label: "Em envio" },
  { id: "entregue" as const, label: "Entregue" },
] satisfies { id: EtapaPedido; label: string }[];

const ETAPA_INDEX: Record<EtapaPedido, number> = {
  pedido_feito: 0,
  pagamento_concluido: 1,
  em_separacao: 2,
  em_envio: 3,
  entregue: 4,
};

export function normalizeStatusPagamento(
  raw: StatusPagamentoPedido | undefined,
): StatusPagamentoPedido {
  return raw ?? "pendente";
}

export function normalizeEtapa(raw: EtapaPedido | undefined): EtapaPedido {
  return raw ?? "pedido_feito";
}

export function etapaIndex(etapa: EtapaPedido): number {
  return ETAPA_INDEX[etapa];
}

export function labelStatusPagamento(status: StatusPagamentoPedido): string {
  if (status === "aprovado") return "Pagamento aprovado";
  if (status === "rejeitado") return "Pagamento rejeitado";
  return "Aguardando confirmação";
}

export function isEtapaCompleta(
  step: EtapaPedido,
  pedido: Pick<PedidoRegistro, "etapa" | "statusPagamento">,
): boolean {
  const status = normalizeStatusPagamento(pedido.statusPagamento);
  const etapa = normalizeEtapa(pedido.etapa);
  const stepIdx = ETAPA_INDEX[step];
  const currentIdx = ETAPA_INDEX[etapa];

  if (step === "pedido_feito") return true;

  if (step === "pagamento_concluido") {
    if (status === "rejeitado") return false;
    return status === "aprovado" || currentIdx >= ETAPA_INDEX.pagamento_concluido;
  }

  if (status !== "aprovado") return false;
  return currentIdx >= stepIdx;
}

export function isEtapaAtual(
  step: EtapaPedido,
  pedido: Pick<PedidoRegistro, "etapa" | "statusPagamento">,
): boolean {
  const status = normalizeStatusPagamento(pedido.statusPagamento);
  const etapa = normalizeEtapa(pedido.etapa);

  if (status === "rejeitado" && step === "pagamento_concluido") return true;
  if (status === "pendente" && step === "pagamento_concluido") return true;
  return etapa === step;
}

export const ETAPAS_ENVIO_ADMIN: EtapaPedido[] = ["em_separacao", "em_envio", "entregue"];
