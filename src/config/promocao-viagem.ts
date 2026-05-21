/** Promoção: viagem para a final da Copa 2026™ (sorteio). */
export const PROMO_VIAGEM_COPA = {
  /** Todos os pedidos finalizados participam — sem valor mínimo. */
  todosPedidosElegiveis: true,
  detalhesHref: "/sobre#promocao",
} as const;

/** Qualquer pedido registrado na loja entra no sorteio. */
export function elegivelPromoViagem(_valorTotal?: number): boolean {
  return PROMO_VIAGEM_COPA.todosPedidosElegiveis;
}
