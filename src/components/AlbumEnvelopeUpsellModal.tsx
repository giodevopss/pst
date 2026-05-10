"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Package, Sparkles, X } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatBRL } from "@/lib/utils";
import { sitePromoUnitSale } from "@/lib/store-pricing";
import type { Produto } from "@/data/produtos";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onClose: () => void;
  kitProduto: Produto;
  /** Nome do álbum comprado — personaliza o texto. */
  triggerAlbumNome?: string;
};

export function AlbumEnvelopeUpsellModal({
  open,
  onClose,
  kitProduto,
  triggerAlbumNome,
}: Props) {
  const { add } = useCart();
  const precoPromo = sitePromoUnitSale(kitProduto);

  function handleAddKit() {
    add(kitProduto, { quantidade: 1 });
    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="upsell-envelopes-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/72 backdrop-blur-sm"
            onClick={onClose}
            aria-label="Fechar"
          />

          <motion.div
            className={cn(
              "relative max-w-lg overflow-hidden rounded-3xl border-2 border-brand-yellow/55",
              "bg-[linear-gradient(135deg,var(--surf)_0%,rgba(253,216,53,0.08)_45%,rgba(0,176,79,0.12)_100%)]",
              "shadow-glow-yellow p-7 shadow-2xl",
            )}
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.22 }}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 rounded-xl border border-border bg-surface/80 p-2 text-muted transition hover:text-foreground"
              aria-label="Fechar"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full border border-brand-green/35 bg-brand-green/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-green">
                <Sparkles className="h-3 w-3" /> Oferta combinada
              </span>
              <span className="rounded-full bg-brand-yellow/25 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-yellow">
                Mais figurinhas
              </span>
            </div>

            <h2
              id="upsell-envelopes-title"
              className="mt-4 font-display text-3xl tracking-tight text-foreground md:text-[2rem]"
            >
              Álbum só?
              <br />
              <span className="gradient-text">Encha as páginas agora.</span>
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-muted">
              Com o{" "}
              {triggerAlbumNome ? (
                <span className="font-semibold text-foreground/90">{triggerAlbumNome}</span>
              ) : (
                "seu álbum"
              )}{" "}
              você ainda não leva envelopes: cada pacote oficial traz{" "}
              <strong className="text-foreground">7 figurinhas</strong> — com{" "}
              <strong className="text-brand-yellow">12 envelopes</strong> são até{" "}
              <strong className="text-foreground">84 figurinhas</strong> já neste pedido.
            </p>

            <div className="mt-5 flex gap-4 rounded-2xl border border-brand-yellow/25 bg-black/25 p-4">
              <div className="relative h-28 w-24 shrink-0 overflow-hidden rounded-xl border border-border bg-background-elev">
                {kitProduto.imagemSrc ? (
                  <Image
                    src={kitProduto.imagemSrc}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Package className="h-10 w-10 text-muted" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-display text-lg leading-snug tracking-wide text-foreground">
                  {kitProduto.nome}
                </p>
                <p className="mt-2 font-display text-2xl text-brand-yellow">
                  {formatBRL(precoPromo)}
                  <span className="ml-2 text-xs font-normal text-muted">no carrinho (promo loja)</span>
                </p>
                <Link
                  href={`/produto/${kitProduto.slug}`}
                  onClick={() => onClose()}
                  className="mt-1 inline-block text-xs text-brand-cyan underline-offset-4 hover:underline"
                >
                  Ver ficha do kit
                </Link>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={handleAddKit}
                className="btn-primary flex-1 shrink-0 py-4 text-[15px]"
              >
                Sim — adicionar +12 envelopes
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-2xl border border-border px-5 py-3.5 text-sm font-semibold text-muted transition hover:border-brand-yellow/40 hover:text-foreground"
              >
                Continuar só com o álbum
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
