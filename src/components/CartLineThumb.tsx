"use client";

import Image from "next/image";
import { Package } from "lucide-react";
import type { CartItem } from "@/lib/cart";
import { getProduto } from "@/data/produtos";
import { getSelecao } from "@/data/selecoes";
import { cn } from "@/lib/utils";

type ThumbItem = Pick<CartItem, "slug" | "nome" | "imagemSrc" | "selecaoSlug" | "categoria">;

export function CartLineThumb({
  item,
  className,
}: {
  item: ThumbItem;
  /** Ex.: `h-14 w-14` (checkout) ou `h-20 w-20` (drawer). */
  className?: string;
}) {
  const src = item.imagemSrc ?? getProduto(item.slug)?.imagemSrc;
  const isSvg = typeof src === "string" && src.endsWith(".svg");

  const box = cn(
    "relative shrink-0 overflow-hidden rounded-lg border border-border bg-background-elev",
    className ?? "h-16 w-16",
  );

  if (src && !isSvg) {
    return (
      <div className={box}>
        <Image
          src={src}
          alt={item.nome.slice(0, 120)}
          fill
          className="object-cover"
          sizes="80px"
        />
      </div>
    );
  }

  if (src && isSvg) {
    return (
      <div className={cn(box, "flex items-center justify-center p-2")}>
        {/* eslint-disable-next-line @next/next/no-img-element -- SVG do catálogo */}
        <img
          src={src}
          alt={item.nome.slice(0, 120)}
          className="max-h-full max-w-full object-contain"
        />
      </div>
    );
  }

  const selecao = item.selecaoSlug ? getSelecao(item.selecaoSlug) : undefined;
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-lg border border-border text-xl",
        box,
      )}
      style={{
        background: selecao
          ? `linear-gradient(135deg, ${selecao.cores.primaria} 0%, ${selecao.cores.secundaria} 100%)`
          : "linear-gradient(135deg, var(--brand-green) 0%, var(--brand-yellow) 100%)",
      }}
    >
      {selecao?.bandeira ? (
        <span className="drop-shadow">{selecao.bandeira}</span>
      ) : (
        <Package className="h-8 w-8 text-white/90" aria-hidden />
      )}
    </div>
  );
}
