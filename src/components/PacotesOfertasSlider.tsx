"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Produto } from "@/data/produtos";
import { visualSlidePacote } from "@/lib/pacote-slide-visual";
import { cn, formatBRL } from "@/lib/utils";
import { catalogStrikePrice, sitePromoUnitSale } from "@/lib/store-pricing";

type Props = {
  pacotes: Produto[];
  className?: string;
};

export function PacotesOfertasSlider({ pacotes, className }: Props) {
  const [index, setIndex] = useState(0);
  const total = pacotes.length;
  const produto = pacotes[index];
  const visual = produto ? visualSlidePacote(produto) : null;

  const go = useCallback(
    (dir: -1 | 1) => {
      if (total === 0) return;
      setIndex((i) => (i + dir + total) % total);
    },
    [total],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  if (total === 0 || !produto || !visual) return null;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[1.75rem] border border-border bg-surface/40 shadow-2xl backdrop-blur-sm",
        className,
      )}
      role="region"
      aria-roledescription="carousel"
      aria-label="Ofertas em destaque"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-green/10 via-transparent to-brand-yellow/10" />

      <div className="relative p-4 md:p-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <span className="rounded-full border border-brand-yellow/35 bg-brand-yellow/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-brand-yellow">
            {visual.tipo}
          </span>
          <span className="text-xs text-muted">
            {index + 1} / {total}
          </span>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={produto.id}
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -28 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="grid gap-3 md:grid-cols-3 md:gap-4"
          >
            {visual.itens.map((item) => (
              <figure
                key={`${produto.id}-${item.src}`}
                className="group relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/10 bg-background-elev/80 shadow-inner"
              >
                <Image
                  src={item.src}
                  alt={item.legenda}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 40vw, 360px"
                  quality={92}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                <figcaption className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                  <span className="inline-block rounded-lg bg-black/55 px-2.5 py-1 font-display text-[10px] uppercase tracking-[0.2em] text-white/95 backdrop-blur-sm md:text-[11px]">
                    {item.legenda}
                  </span>
                </figcaption>
              </figure>
            ))}
          </motion.div>
        </AnimatePresence>

        <motion.div
          key={`meta-${produto.id}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.08 }}
          className="mt-6 md:mt-8"
        >
          <h2 className="font-display text-2xl leading-tight tracking-tight text-foreground md:text-3xl lg:text-[1.85rem]">
            {produto.nome}
          </h2>
          <div className="mt-4 flex flex-wrap items-baseline gap-3">
            <span className="font-display text-4xl gradient-text">{formatBRL(sitePromoUnitSale(produto))}</span>
            {catalogStrikePrice(produto) > sitePromoUnitSale(produto) + 1e-9 && (
              <span className="text-base text-muted line-through">{formatBRL(catalogStrikePrice(produto))}</span>
            )}
          </div>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">{produto.descricao}</p>
          <Link href={`/produto/${produto.slug}`} className="btn-primary mt-6 inline-flex">
            Ver promoção e escolher tamanho
          </Link>
        </motion.div>

        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => go(-1)}
            className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface/70 text-foreground shadow-lg transition hover:border-brand-yellow hover:text-brand-yellow"
            aria-label="Oferta anterior"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <div className="flex max-w-[min(100%,280px)] flex-wrap justify-center gap-2 px-2">
            {pacotes.map((_, i) => (
              <button
                key={pacotes[i]!.id}
                type="button"
                onClick={() => setIndex(i)}
                className={cn(
                  "h-2.5 rounded-full transition-all duration-300",
                  i === index ? "w-10 bg-brand-yellow" : "w-2.5 bg-border hover:bg-muted-foreground/50",
                )}
                aria-label={`Ir para oferta ${i + 1}`}
                aria-current={i === index}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => go(1)}
            className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface/70 text-foreground shadow-lg transition hover:border-brand-yellow hover:text-brand-yellow"
            aria-label="Próxima oferta"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
