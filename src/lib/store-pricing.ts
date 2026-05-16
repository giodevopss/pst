import { precoCharmDezena99 } from "@/lib/utils";

/** Caixas atacado (lojistas): preço de tabela fixo, sem −30% vitrine. */
const LOJISTA_CAIXA_IDS = new Set<string>(["lojista-caixa-1000-envelopes", "lojista-caixa-100-envelopes"]);

function isLojistaCaixaProdutoId(id: string | undefined): boolean {
  return id != null && LOJISTA_CAIXA_IDS.has(id);
}

/** Desconto fixo de vitrine/carrinho sobre o valor de lista (strike Panini/catálogo). */
export const SITE_WIDE_DISCOUNT_FRACTION = 0.3;

export const SITE_WIDE_DISCOUNT_PERCENT = Math.round(SITE_WIDE_DISCOUNT_FRACTION * 100);

/** Desconto extra no total final ao pagar com PIX (sobre subtotal já com promo da loja). */
export const PIX_CHECKOUT_EXTRA_DISCOUNT_FRACTION = 0.2;

export const PIX_CHECKOUT_EXTRA_DISCOUNT_PERCENT = Math.round(
  PIX_CHECKOUT_EXTRA_DISCOUNT_FRACTION * 100,
);

/**
 * Quatro produtos da barra “Destaques” em `/pacotes`: combos álbum Panini + envelopes (sem camisa).
 * Ordem fixa na página.
 */
export const PACOTES_PAGINA_DESTAQUE_IDS = [
  "album-capa-cartao-mais-12-envelopes",
  "album-capa-cartao-mais-24-envelopes",
  "box-sacola-cartao-mais-30-envelopes",
  "box-luva-premium-torcida",
] as const;

/**
 * Três primeiros destaques: −30% extra sobre o preço já com desconto da loja
 * (multiplicativo com `SITE_WIDE_DISCOUNT_FRACTION`).
 */
export const PACOTES_DESTAQUE_EXTRA_KIT_IDS = [
  "album-capa-cartao-mais-12-envelopes",
  "album-capa-cartao-mais-24-envelopes",
  "box-sacola-cartao-mais-30-envelopes",
] as const;

const PACOTES_DESTAQUE_EXTRA_KIT_SET = new Set<string>(PACOTES_DESTAQUE_EXTRA_KIT_IDS);

/** Fração extra (−30%) aplicada só aos três kits acima. */
export const PACOTES_DESTAQUE_EXTRA_DISCOUNT_FRACTION = 0.3;

export const PACOTES_DESTAQUE_EXTRA_DISCOUNT_PERCENT = Math.round(
  PACOTES_DESTAQUE_EXTRA_DISCOUNT_FRACTION * 100,
);

/** Cupom que libera o desconto extra de PIX no checkout. */
export const PIX_DISCOUNT_COUPON_CODE = "PANINI20";

/** Aceita variações de caixa/espaço do cupom de PIX. */
export function isValidPixCouponCode(raw: string | null | undefined): boolean {
  if (!raw) return false;
  return raw.trim().toUpperCase() === PIX_DISCOUNT_COUPON_CODE;
}

export function priceAfterSiteDiscount(catalogUnitPrice: number): number {
  return precoCharmDezena99(catalogUnitPrice * (1 - SITE_WIDE_DISCOUNT_FRACTION));
}

export function totalAfterPixExtraDiscount(sitePromoCartTotal: number): number {
  return precoCharmDezena99(sitePromoCartTotal * (1 - PIX_CHECKOUT_EXTRA_DISCOUNT_FRACTION));
}

/** Valor de lista para tachado: MSRP Panini quando maior que o catálogo, senão o preço SKU. */
export function catalogStrikePrice(produto: { preco: number; precoOriginal?: number }): number {
  const o = produto.precoOriginal;
  if (o != null && o > produto.preco) return o;
  return produto.preco;
}

/** Preço com desconto da loja apenas (sem o −30% extra dos três primeiros destaques em `/pacotes`). */
export function sitePromoUnitSaleStoreOnly(produto: {
  id?: string;
  preco: number;
  precoOriginal?: number;
}): number {
  if (isLojistaCaixaProdutoId(produto.id)) {
    return Math.round(produto.preco * 100) / 100;
  }
  return priceAfterSiteDiscount(catalogStrikePrice(produto));
}

export function hasPacotesDestaqueExtraKitPromo(produtoId: string | undefined): boolean {
  return produtoId != null && PACOTES_DESTAQUE_EXTRA_KIT_SET.has(produtoId);
}

/**
 * Preço unitário no carrinho/vitrine: desconto da loja sobre lista; nos 3 primeiros destaques de `/pacotes`
 * (álbum + envelopes, sem camisa), mais `PACOTES_DESTAQUE_EXTRA_DISCOUNT_FRACTION` sobre esse valor.
 */
export function sitePromoUnitSale(produto: {
  id?: string;
  preco: number;
  precoOriginal?: number;
}): number {
  if (isLojistaCaixaProdutoId(produto.id)) {
    return Math.round(produto.preco * 100) / 100;
  }
  const base = sitePromoUnitSaleStoreOnly(produto);
  if (produto.id && PACOTES_DESTAQUE_EXTRA_KIT_SET.has(produto.id)) {
    return precoCharmDezena99(base * (1 - PACOTES_DESTAQUE_EXTRA_DISCOUNT_FRACTION));
  }
  return base;
}
