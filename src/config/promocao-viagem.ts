/** Promoção: viagem para a final da Copa 2026™ (sorteio). */
export const PROMO_VIAGEM_COPA = {
  /** Valor mínimo do pedido (após descontos) para participar. */
  minValorReais: 500,
  detalhesHref: "/sobre#promocao",
} as const;

export function elegivelPromoViagem(valorTotal: number): boolean {
  return valorTotal >= PROMO_VIAGEM_COPA.minValorReais;
}
