"use client";

import Image from "next/image";
import { useState } from "react";
import type { Produto } from "@/data/produtos";
import { getSelecao } from "@/data/selecoes";
import { cn } from "@/lib/utils";

type Props = {
  produto: Produto;
  className?: string;
  showBadges?: boolean;
};

export function CamisetaGaleria({ produto, className, showBadges = true }: Props) {
  const selecao = produto.selecaoSlug ? getSelecao(produto.selecaoSlug) : undefined;
  const imgs = produto.galeria?.length ? produto.galeria : [];
  const [idx, setIdx] = useState(0);

  const background = selecao
    ? `linear-gradient(135deg, ${selecao.cores.primaria} 0%, ${selecao.cores.secundaria} 60%, ${selecao.cores.terciaria ?? selecao.cores.primaria} 100%)`
    : "linear-gradient(135deg, #0050a8 0%, #00b14f 100%)";

  if (!imgs.length) return null;

  const prioritize =
    produto.slug.includes("camiseta-selecao") || produto.categoria === "pacote";

  return (
    <div className="space-y-4">
      <div
        className={cn(
          "group relative aspect-square overflow-hidden rounded-2xl bg-background-elev",
          className,
        )}
        style={{ background }}
      >
        <div className="absolute inset-0 p-5 md:p-7">
          <div className="relative h-full w-full">
            <Image
              src={imgs[idx]!}
              alt={`${produto.nome} — imagem ${idx + 1} de ${imgs.length}`}
              fill
              sizes="(max-width: 1024px) 100vw, (max-width: 1536px) 50vw, 720px"
              className="object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-[1.03]"
              priority={prioritize && idx === 0}
              unoptimized
            />
          </div>
        </div>
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-t from-black/35 via-transparent to-white/5" />

        {showBadges && produto.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-foreground/95 px-3 py-1 font-display text-[10px] tracking-[0.2em] text-background">
            {produto.badge}
          </span>
        )}
        {showBadges && produto.precoOriginal && produto.precoOriginal > produto.preco && (
          <span className="absolute right-3 top-3 rounded-full bg-brand-red px-3 py-1 font-display text-[10px] tracking-[0.2em] text-white">
            {Math.round(((produto.precoOriginal - produto.preco) / produto.precoOriginal) * 100)}% OFF
          </span>
        )}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 pt-1 [scrollbar-width:thin]">
        {imgs.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => setIdx(i)}
            aria-label={`Mostrar imagem ${i + 1}`}
            aria-current={i === idx}
            className={cn(
              "relative h-[4.5rem] w-16 shrink-0 overflow-hidden rounded-xl border-2 bg-background-elev transition",
              i === idx ? "border-brand-yellow shadow-glow-yellow" : "border-border opacity-80 hover:opacity-100",
            )}
          >
            <Image
              src={src}
              alt={`Miniatura ${i + 1}`}
              fill
              className="object-contain p-0.5"
              sizes="80px"
              unoptimized
            />
          </button>
        ))}
      </div>
    </div>
  );
}
