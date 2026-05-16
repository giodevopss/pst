"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Produto } from "@/data/produtos";
import { AddToCartButton } from "@/components/AddToCartButton";
import { cn, formatBRLExact } from "@/lib/utils";
import { sitePromoUnitSale } from "@/lib/store-pricing";

type Props = {
  produto: Produto;
  imageSrc: string;
  /** Texto curto opcional (ex.: segunda foto da mesma caixa 1000). */
  caption?: string;
};

export function LojistaCaixaCard({ produto, imageSrc, caption }: Props) {
  const href = `/produto/${produto.slug}`;
  const sale = sitePromoUnitSale(produto);

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-2xl border border-border bg-surface/40 shadow-lg",
      )}
    >
      <Link href={href} className="group relative block aspect-[4/3] bg-background-elev/50">
        <Image
          src={imageSrc}
          alt={produto.nome}
          fill
          className="object-contain p-4 transition duration-300 group-hover:scale-[1.02]"
          sizes="(max-width: 1024px) 100vw, 33vw"
        />
        {produto.badge && (
          <span className="absolute left-3 top-3 rounded-full border border-brand-yellow/45 bg-background/90 px-2.5 py-0.5 font-display text-[10px] font-bold uppercase tracking-wider text-brand-yellow backdrop-blur-sm">
            {produto.badge}
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-5">
        {caption && <p className="text-[11px] font-medium uppercase tracking-wider text-muted">{caption}</p>}
        <Link href={href} className="group flex items-start justify-between gap-2">
          <h3 className="min-h-[2.75rem] text-sm font-semibold leading-snug text-foreground group-hover:text-brand-yellow">
            {produto.nome}
          </h3>
          <ArrowUpRight className="h-4 w-4 shrink-0 text-muted transition group-hover:text-brand-yellow" />
        </Link>
        <p className="text-xs leading-relaxed text-muted line-clamp-3">{produto.descricao}</p>
        <div className="mt-auto flex flex-wrap items-baseline gap-2 border-t border-border/60 pt-4">
          <span className="font-display text-2xl tabular-nums tracking-wide text-brand-yellow">
            {formatBRLExact(sale)}
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">Preço lojista</span>
        </div>
        <AddToCartButton produto={produto} label="Adicionar caixa" className="w-full" fullWidth />
      </div>
    </div>
  );
}
