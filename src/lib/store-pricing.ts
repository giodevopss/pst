/** Desconto fixo de vitrine/carrinho sobre o valor de lista (strike Panini/catálogo). */
export const SITE_WIDE_DISCOUNT_FRACTION = 0.3;

export const SITE_WIDE_DISCOUNT_PERCENT = Math.round(SITE_WIDE_DISCOUNT_FRACTION * 100);

/** Desconto extra no total final ao pagar com PIX (sobre subtotal já com promo da loja). */
export const PIX_CHECKOUT_EXTRA_DISCOUNT_FRACTION = 0.2;

export const PIX_CHECKOUT_EXTRA_DISCOUNT_PERCENT = Math.round(
  PIX_CHECKOUT_EXTRA_DISCOUNT_FRACTION * 100,
);

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

/** Valor de lista para tachado: MSRP Panini quando maior que o catálogo, senão o preço SKU. */
export function catalogStrikePrice(produto: { preco: number; precoOriginal?: number }): number {
  const o = produto.precoOriginal;
  if (o != null && o > produto.preco) return o;
  return produto.preco;
}

/** Preço unitário efetivo no carrinho/vitrine: desconto `SITE_WIDE` sobre o valor de lista. */
export function sitePromoUnitSale(produto: { preco: number; precoOriginal?: number }): number {
  return priceAfterSiteDiscount(catalogStrikePrice(produto));
}
