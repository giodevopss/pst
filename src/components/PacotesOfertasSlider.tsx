"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Produto } from "@/data/produtos";
import { hrefProduto } from "@/data/produtos";
import { visualSlidePacote } from "@/lib/pacote-slide-visual";
import { cn, formatBRL } from "@/lib/utils";
import { catalogStrikePrice, sitePromoUnitSale } from "@/lib/store-pricing";

type Props = {
  pacotes: Produto[];
  className?: string;
};

function isInteractiveTarget(target: EventTarget | null) {
  return Boolean((target as HTMLElement | null)?.closest("a,button"));
}

export function PacotesOfertasSlider({ pacotes, className }: Props) {
  const pacotesExibiveis = useMemo(
    () => pacotes.filter((p) => visualSlidePacote(p) != null),
    [pacotes],
  );
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const total = pacotesExibiveis.length;
  const produto = pacotesExibiveis[index];
  const visual = produto ? visualSlidePacote(produto) : null;
  const produtoHref = produto ? hrefProduto(produto) : "#";

  const go = useCallback(
    (dir: -1 | 1) => {
      if (total === 0) return;
      setIndex((i) => (i + dir + total) % total);
    },
    [total],
  );

  useEffect(() => {
    if (index >= total && total > 0) setIndex(0);
  }, [index, total]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  const onTouchStart = (e: React.TouchEvent) => {
    if (isInteractiveTarget(e.target)) return;
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (isInteractiveTarget(e.target)) return;
    const start = touchStartX.current;
    touchStartX.current = null;
    if (start == null) return;
    const end = e.changedTouches[0]?.clientX;
    if (end == null) return;
    const delta = end - start;
    if (Math.abs(delta) < 48) return;
    go(delta < 0 ? 1 : -1);
  };

  if (total === 0 || !produto || !visual) return null;

  const salePrice = sitePromoUnitSale(produto);
  const strikePrice = catalogStrikePrice(produto);
  const ctaLabel =
    produto.categoria === "pacote"
      ? "Ver promoção e escolher tamanho"
      : "Ver oferta";

  return (
    <div
      className={cn(
        "relative min-w-0 overflow-hidden rounded-[1.75rem] border border-border bg-surface/40 shadow-2xl backdrop-blur-sm",
        className,
      )}
      role="region"
      aria-roledescription="carousel"
      aria-label="Ofertas em destaque"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-green/10 via-transparent to-brand-yellow/10" />

      <div className="relative min-w-0 p-4 md:p-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <span className="rounded-full border border-brand-yellow/35 bg-brand-yellow/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-brand-yellow">
            {visual.tipo}
          </span>
          <span className="text-xs text-muted tabular-nums">
            {index + 1} / {total}
          </span>
        </div>

        <div className="min-w-0 overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={produto.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="min-w-0"
            >
              <div className="-mx-1 flex gap-3 overflow-x-auto overscroll-x-contain px-1 pb-2 scrollbar-none snap-x snap-mandatory md:mx-0 md:grid md:grid-cols-3 md:gap-4 md:overflow-visible md:pb-0 md:snap-none">
                {visual.itens.map((item) => (
                  <Link
                    key={`${produto.id}-${item.src}`}
                    href={produtoHref}
                    className="group relative aspect-[3/4] w-[min(72vw,16.5rem)] shrink-0 snap-center overflow-hidden rounded-2xl border border-white/10 bg-background-elev/80 shadow-inner touch-manipulation md:w-auto md:min-w-0"
                  >
                    <Image
                      src={item.src}
                      alt={item.legenda}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-[1.03]"
                      sizes="(max-width: 768px) 72vw, (max-width: 1200px) 30vw, 360px"
                      quality={92}
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                    <figcaption className="pointer-events-none absolute bottom-0 left-0 right-0 p-3 md:p-4">
                      <span className="inline-block max-w-full rounded-lg bg-black/55 px-2.5 py-1 font-display text-[10px] uppercase leading-snug tracking-[0.16em] text-white/95 backdrop-blur-sm md:text-[11px] md:tracking-[0.2em]">
                        {item.legenda}
                      </span>
                    </figcaption>
                  </Link>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`meta-${produto.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="mt-5 min-w-0 md:mt-8"
          >
            <Link href={produtoHref} className="block touch-manipulation">
              <h2 className="font-display text-xl leading-tight tracking-tight text-balance text-foreground transition-colors hover:text-brand-yellow sm:text-2xl md:text-3xl lg:text-[1.85rem]">
                {produto.nome}
              </h2>
            </Link>
            <div className="mt-3 flex flex-wrap items-baseline gap-2 md:mt-4 md:gap-3">
              <span className="font-display text-3xl gradient-text sm:text-4xl">
                {formatBRL(salePrice)}
              </span>
              {strikePrice > salePrice + 1e-9 && (
                <span className="text-sm text-muted line-through sm:text-base">
                  {formatBRL(strikePrice)}
                </span>
              )}
            </div>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted md:mt-4">
              {produto.descricao}
            </p>
            <Link
              href={produtoHref}
              className="btn-primary relative z-[1] mt-5 inline-flex w-full touch-manipulation justify-center sm:mt-6 sm:w-auto"
            >
              {ctaLabel}
            </Link>
          </motion.div>
        </AnimatePresence>

        <div className="mt-6 flex min-w-0 items-center justify-between gap-2 sm:mt-8 sm:justify-center sm:gap-4">
          <button
            type="button"
            onClick={() => go(-1)}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-surface/70 text-foreground shadow-lg transition hover:border-brand-yellow hover:text-brand-yellow sm:h-12 sm:w-12"
            aria-label="Oferta anterior"
          >
            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>

          <div className="flex min-w-0 flex-1 justify-center overflow-x-auto px-1 scrollbar-none sm:max-w-[min(100%,20rem)] sm:flex-none sm:px-2">
            <div className="flex gap-1.5 sm:gap-2">
              {pacotesExibiveis.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setIndex(i)}
                  className={cn(
                    "h-2 shrink-0 rounded-full transition-all duration-300",
                    i === index ? "w-8 bg-brand-yellow sm:w-10" : "w-2 bg-border hover:bg-muted-foreground/50",
                  )}
                  aria-label={`Ir para oferta ${i + 1}`}
                  aria-current={i === index}
                />
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => go(1)}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-surface/70 text-foreground shadow-lg transition hover:border-brand-yellow hover:text-brand-yellow sm:h-12 sm:w-12"
            aria-label="Próxima oferta"
          >
            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
