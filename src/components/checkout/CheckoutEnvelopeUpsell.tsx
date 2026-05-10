"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { Flame, Package } from "lucide-react";
import type { CartItem } from "@/lib/cart";
import { useCart } from "@/lib/cart";
import { formatBRL } from "@/lib/utils";
import { sitePromoUnitSale } from "@/lib/store-pricing";
import type { Produto } from "@/data/produtos";
import {
  FIGURINHA_KIT_12_ID,
  getFigurinhaKit12Product,
  shouldOfferFigurinhaEnvelopeUpsell,
} from "@/lib/album-envelope-upsell";

function lineAsProduto(line: CartItem): Produto {
  return {
    id: line.produtoId,
    slug: line.slug,
    nome: line.nome,
    categoria: line.categoria as Produto["categoria"],
    preco: line.preco,
    descricao: "",
    destaques: [],
    estoque: "em_estoque",
  };
}

function analyzeCart(items: CartItem[]): { nomesLinhas: string[] } | null {
  const kit = getFigurinhaKit12Product();
  if (!kit) return null;
  if (items.some((i) => i.produtoId === FIGURINHA_KIT_12_ID)) return null;

  const linhas: string[] = [];
  const seen = new Set<string>();

  for (const line of items) {
    if (!shouldOfferFigurinhaEnvelopeUpsell(lineAsProduto(line))) continue;
    if (seen.has(line.produtoId)) continue;
    seen.add(line.produtoId);
    linhas.push(line.nome);
  }

  return linhas.length > 0 ? { nomesLinhas: linhas } : null;
}

export function CheckoutEnvelopeUpsell() {
  const { items, add } = useCart();
  const kit = getFigurinhaKit12Product();
  const precoKit = kit ? sitePromoUnitSale(kit) : 0;

  const situacao = useMemo(() => analyzeCart(items), [items]);

  if (!kit || !situacao) return null;

  const kitProduto = kit;
  const [primeira, ...demais] = situacao.nomesLinhas;
  const outros = demais.length;

  function handleAdd() {
    add(kitProduto, { quantidade: 1 });
  }

  return (
    <div className="border-t border-brand-yellow/35 bg-brand-yellow/[0.04] px-6 py-5">
      <div className="relative overflow-hidden rounded-2xl border-2 border-brand-yellow/55 bg-[linear-gradient(145deg,rgba(253,216,53,0.14)_0%,rgba(6,180,106,0.12)_52%,transparent_100%)] p-5 shadow-glow-yellow">
        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-brand-yellow/30 blur-2xl" />
        <div className="absolute -bottom-10 -left-8 h-28 w-28 rounded-full bg-brand-green/22 blur-2xl" />

        <div className="relative flex flex-wrap items-start gap-3">
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-brand-red px-3 py-1.5 font-display text-[10px] font-bold uppercase tracking-[0.22em] text-white shadow-lg">
            <Flame className="h-3 w-3" /> Última chance aqui
          </span>
          <p className="min-w-[10rem] flex-1 font-display text-xl leading-snug tracking-tight text-foreground md:text-[1.35rem]">
            Complete o pedido: <span className="text-brand-yellow">+12 envelopes oficiais</span>
          </p>
        </div>

        <p className="relative mt-2 text-sm leading-relaxed text-muted">
          Álbuns só (como{" "}
          <span className="font-semibold text-foreground">
            {primeira}
          </span>
          {outros > 0 && (
            <span className="text-muted">
              {outros === 1
                ? " e mais 1 outro no carrinho"
                : ` e mais ${outros} outros no carrinho`}
            </span>
          )}
          ) <strong className="text-foreground">não trazem figurinhas</strong>. Este kit fecha a lacuna:{" "}
          <strong className="text-brand-yellow">84 figurinhas</strong> potenciais (12 × 7), preço já com promo da loja.
        </p>

        <div className="relative mt-4 flex gap-4">
          <div className="relative h-24 w-[4.65rem] shrink-0 overflow-hidden rounded-xl border border-border bg-black/35">
            {kitProduto.imagemSrc ? (
              <Image src={kitProduto.imagemSrc} alt="" fill className="object-cover" sizes="80px" />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <Package className="h-8 w-8 text-muted" />
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-yellow">
              Kit Panini Copa 2026™
            </p>
            <p className="mt-1 text-sm leading-snug text-foreground/95">{kitProduto.nome}</p>
            <p className="mt-2 font-display text-2xl text-brand-yellow">{formatBRL(precoKit)}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="relative mt-4 w-full rounded-2xl border border-brand-yellow/60 bg-brand-yellow py-4 text-center font-display text-[15px] font-bold uppercase tracking-[0.12em] text-[#06080f] shadow-glow-yellow transition hover:bg-brand-yellow/90"
        >
          + Colocar 12 envelopes neste pedido
        </button>

        <Link
          href={`/produto/${kitProduto.slug}`}
          className="relative mt-2 block text-center text-xs text-brand-cyan underline-offset-4 hover:underline"
        >
          Ver ficha completa do kit
        </Link>
      </div>
    </div>
  );
}
