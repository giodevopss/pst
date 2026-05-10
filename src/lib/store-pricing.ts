/** Desconto fixo aos preços de catálogo (vitrine + carrinho). */
export const SITE_WIDE_DISCOUNT_FRACTION = 0.2;

/** Desconto extra no total final ao pagar com PIX (sobre subtotal já com promo da loja). */
export const PIX_CHECKOUT_EXTRA_DISCOUNT_FRACTION = 0.2;

export function priceAfterSiteDiscount(catalogUnitPrice: number): number {
  const n =
    Math.round(catalogUnitPrice * (1 - SITE_WIDE_DISCOUNT_FRACTION) * 100) / 100;
  return Math.max(0, n);
}

export function totalAfterPixExtraDiscount(sitePromoCartTotal: number): number {
  const n =
    Math.round(sitePromoCartTotal * (1 - PIX_CHECKOUT_EXTRA_DISCOUNT_FRACTION) * 100) / 100;
  return Math.max(0, n);
}

/** Para tachado na vitrine quando não há Panini/original maior. */
export function catalogStrikePrice(produto: { preco: number; precoOriginal?: number }): number {
  const o = produto.precoOriginal;
  if (o != null && o > produto.preco) return o;
  return produto.preco;
}
