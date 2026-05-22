import { precoCharmDezena99, roundBRLCents } from "@/lib/utils";

/** Caixas atacado (lojistas): preço de tabela fixo, sem −30% vitrine. */
const LOJISTA_CAIXA_IDS = new Set<string>(["lojista-caixa-1000-envelopes", "lojista-caixa-100-envelopes"]);

function isLojistaCaixaProdutoId(id: string | undefined): boolean {
  return id != null && LOJISTA_CAIXA_IDS.has(id);
}

/** SKUs com preço de vitrine fixo (sem −30% da loja). */
const PRECO_FIXO_VITRINE_IDS = new Set(["envelope-figurinhas-atualizado"]);

/** Camisetas e itens avulsos com preço fechado (ex.: pacote figurinhas R$ 7,00). */
export function isPrecoFixoVitrineProdutoId(id: string | undefined): boolean {
  if (id == null) return false;
  return id.startsWith("camiseta-") || PRECO_FIXO_VITRINE_IDS.has(id);
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

/** Cupom +10% no checkout (PIX ou cartão). */
export const CHECKOUT_COUPON_NEYMAR_CODE = "NEY10";

/** Código antigo ainda aceito no checkout (alias de NEY10). */
const CHECKOUT_COUPON_NEYMAR_LEGACY = "NEYMARNACOPA10";

export const CHECKOUT_NEYMAR_DISCOUNT_FRACTION = 0.1;

export const CHECKOUT_NEYMAR_DISCOUNT_PERCENT = Math.round(
  CHECKOUT_NEYMAR_DISCOUNT_FRACTION * 100,
);

/** Textos da faixa rolante (ticker). Cupons são aplicados no checkout. */
export const TICKER_CUPOM_NEYMAR = `CUPOM ${CHECKOUT_COUPON_NEYMAR_CODE} −${CHECKOUT_NEYMAR_DISCOUNT_PERCENT}% NO CHECKOUT`;

export const TICKER_CUPOM_PIX = `CUPOM ${PIX_DISCOUNT_COUPON_CODE} −${PIX_CHECKOUT_EXTRA_DISCOUNT_PERCENT}% NO PIX`;

export type CheckoutCouponConfig = {
  code: string;
  fraction: number;
  percent: number;
  /** Desconto só quando o pagamento é PIX. */
  pixOnly: boolean;
};

export const CHECKOUT_COUPON_REGISTRY: CheckoutCouponConfig[] = [
  {
    code: PIX_DISCOUNT_COUPON_CODE,
    fraction: PIX_CHECKOUT_EXTRA_DISCOUNT_FRACTION,
    percent: PIX_CHECKOUT_EXTRA_DISCOUNT_PERCENT,
    pixOnly: true,
  },
  {
    code: CHECKOUT_COUPON_NEYMAR_CODE,
    fraction: CHECKOUT_NEYMAR_DISCOUNT_FRACTION,
    percent: CHECKOUT_NEYMAR_DISCOUNT_PERCENT,
    pixOnly: false,
  },
];

export function normalizeCheckoutCouponCode(raw: string | null | undefined): string {
  return (raw ?? "").trim().toUpperCase().replace(/\s+/g, "");
}

/** Normaliza e migra códigos legados para o registro atual. */
export function migrateCheckoutCouponCode(raw: string | null | undefined): string {
  const code = normalizeCheckoutCouponCode(raw);
  if (code === CHECKOUT_COUPON_NEYMAR_LEGACY) return CHECKOUT_COUPON_NEYMAR_CODE;
  return code;
}

export function resolveCheckoutCoupon(
  raw: string | null | undefined,
): CheckoutCouponConfig | null {
  const code = migrateCheckoutCouponCode(raw);
  if (!code) return null;
  return CHECKOUT_COUPON_REGISTRY.find((c) => c.code === code) ?? null;
}

/**
 * Cupons efetivos no checkout: válidos + PANINI20 automático no PIX (salvo opt-out).
 */
export function getEffectiveCheckoutCouponCodes(
  appliedCodes: string[],
  paymentModo: "pix" | "cartao",
  options?: { optOutAutoPixCoupon?: boolean },
): string[] {
  const unique = [
    ...new Set(
      appliedCodes
        .map((c) => migrateCheckoutCouponCode(c))
        .filter((c) => isValidCheckoutCouponCode(c)),
    ),
  ];

  if (
    paymentModo === "pix" &&
    !options?.optOutAutoPixCoupon &&
    !unique.includes(PIX_DISCOUNT_COUPON_CODE)
  ) {
    return [...unique, PIX_DISCOUNT_COUPON_CODE];
  }

  return unique;
}

export function isValidCheckoutCouponCode(raw: string | null | undefined): boolean {
  return resolveCheckoutCoupon(raw) != null;
}

export function checkoutCouponApplies(
  coupon: CheckoutCouponConfig,
  paymentModo: "pix" | "cartao",
): boolean {
  if (!coupon.pixOnly) return true;
  return paymentModo === "pix";
}

/** Aceita variações de caixa/espaço do cupom de PIX. */
export function isValidPixCouponCode(raw: string | null | undefined): boolean {
  return resolveCheckoutCoupon(raw)?.code === PIX_DISCOUNT_COUPON_CODE;
}

export type CheckoutCouponLine = {
  code: string;
  percent: number;
  discountAmount: number;
  active: boolean;
  pixOnly: boolean;
};

/** Aplica vários cupons em sequência (gerais primeiro, PIX por último). */
export function computeCheckoutWithCoupons(
  subtotal: number,
  rawCodes: string[],
  paymentModo: "pix" | "cartao",
  options?: { optOutAutoPixCoupon?: boolean },
): { totalPagar: number; descontoTotal: number; lines: CheckoutCouponLine[] } {
  const unique = getEffectiveCheckoutCouponCodes(rawCodes, paymentModo, options);
  const coupons = unique
    .map((code) => resolveCheckoutCoupon(code))
    .filter((c): c is CheckoutCouponConfig => c != null)
    .sort((a, b) => Number(a.pixOnly) - Number(b.pixOnly));

  let running = roundBRLCents(subtotal);
  const lines: CheckoutCouponLine[] = [];

  for (const coupon of coupons) {
    const active = checkoutCouponApplies(coupon, paymentModo);
    const before = running;
    if (active) {
      running = roundBRLCents(running * (1 - coupon.fraction));
    }
    lines.push({
      code: coupon.code,
      percent: coupon.percent,
      discountAmount: active ? roundBRLCents(before - running) : 0,
      active,
      pixOnly: coupon.pixOnly,
    });
  }

  return {
    totalPagar: running,
    descontoTotal: roundBRLCents(subtotal - running),
    lines,
  };
}

/** Total após um único cupom (legado). */
export function totalAfterCheckoutCoupon(
  subtotal: number,
  rawCoupon: string | null | undefined,
  paymentModo: "pix" | "cartao",
): number {
  const code = rawCoupon ? normalizeCheckoutCouponCode(rawCoupon) : "";
  return computeCheckoutWithCoupons(subtotal, code ? [code] : [], paymentModo).totalPagar;
}

export function priceAfterSiteDiscount(catalogUnitPrice: number): number {
  return precoCharmDezena99(catalogUnitPrice * (1 - SITE_WIDE_DISCOUNT_FRACTION));
}

export function totalAfterPixExtraDiscount(sitePromoCartTotal: number): number {
  return totalAfterCheckoutCoupon(sitePromoCartTotal, PIX_DISCOUNT_COUPON_CODE, "pix");
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
  if (isLojistaCaixaProdutoId(produto.id) || isPrecoFixoVitrineProdutoId(produto.id)) {
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
