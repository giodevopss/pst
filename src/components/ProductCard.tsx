import Link from "next/link";
import type { Produto } from "@/data/produtos";
import { hrefProduto } from "@/data/produtos";
import { formatBRL, formatBRLExact } from "@/lib/utils";
import { catalogStrikePrice, isPrecoFixoVitrineProdutoId, sitePromoUnitSale } from "@/lib/store-pricing";
import { ProductImage } from "./ProductImage";
import { ArrowUpRight } from "lucide-react";

export function ProductCard({ produto }: { produto: Produto }) {
  const salePrice = sitePromoUnitSale(produto);
  const strikePrice = catalogStrikePrice(produto);
  const formatPrice = isPrecoFixoVitrineProdutoId(produto.id) ? formatBRLExact : formatBRL;
  return (
    <Link
      href={hrefProduto(produto)}
      className="group relative z-[1] block touch-manipulation overflow-hidden rounded-2xl border border-border bg-surface/40 transition-all duration-300 hover:-translate-y-1 hover:border-brand-yellow/60 hover:shadow-glow-yellow"
    >
      <ProductImage produto={produto} className="rounded-b-none" showBadges={false} showPromoBadges={false} />

      <div className="flex flex-col gap-2 p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 text-sm font-semibold leading-tight text-foreground transition-colors group-hover:text-brand-yellow">
            {produto.nome}
          </h3>
          <ArrowUpRight className="h-4 w-4 shrink-0 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-yellow" />
        </div>

        <div className="mt-1 flex flex-wrap items-baseline gap-2">
          <span className="font-display text-2xl tracking-wide tabular-nums gradient-text">
            {formatPrice(salePrice)}
          </span>
          {strikePrice > salePrice + 1e-9 && (
            <span className="text-sm text-muted line-through">{formatPrice(strikePrice)}</span>
          )}
        </div>

        <span className="text-[11px] font-medium uppercase tracking-widest text-muted">
          {produto.estoque === "ultimas_unidades" ? "Últimas unidades" : "Disponível"}
        </span>
      </div>
    </Link>
  );
}
