"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatBRL } from "@/lib/utils";
import { useEffect } from "react";
import { CartLineThumb } from "@/components/CartLineThumb";
import {
  PIX_CHECKOUT_EXTRA_DISCOUNT_PERCENT,
  PIX_DISCOUNT_COUPON_CODE,
  SITE_WIDE_DISCOUNT_PERCENT,
} from "@/lib/store-pricing";

export function CartDrawer() {
  const { items, isOpen, close, totalItems, totalPrice, updateQty, remove, clear } = useCart();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={close}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 36 }}
            className="fixed right-0 top-0 z-50 flex h-screen w-full max-w-md flex-col border-l border-border bg-background-elev shadow-2xl"
            aria-label="Seu carrinho"
          >
            <header className="flex items-center justify-between border-b border-border px-6 py-5">
              <div className="flex items-center gap-3">
                <ShoppingBag className="h-5 w-5 text-brand-yellow" />
                <h2 className="font-display text-xl tracking-wide">
                  Seu carrinho{" "}
                  <span className="text-muted">({totalItems})</span>
                </h2>
              </div>
              <button
                onClick={close}
                aria-label="Fechar"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted hover:bg-white/5 hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full border border-border bg-surface text-muted">
                    <ShoppingBag className="h-8 w-8" />
                  </div>
                  <div>
                    <p className="font-display text-2xl">Carrinho vazio</p>
                    <p className="mt-1 text-sm text-muted">
                      Que tal começar pelo álbum oficial ou por um pacote Brasil + figurinhas?
                    </p>
                  </div>
                  <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
                    <Link href="/pacotes" onClick={close} className="btn-secondary">
                      Ver pacotes
                    </Link>
                    <Link href="/album" onClick={close} className="btn-primary">
                      Ver o álbum
                    </Link>
                  </div>
                </div>
              ) : (
                <ul className="space-y-3">
                  {items.map((item) => {
                    return (
                      <li
                        key={`${item.produtoId}-${item.tamanho ?? "x"}`}
                        className="flex gap-3 rounded-xl border border-border bg-surface/60 p-3"
                      >
                        <CartLineThumb item={item} className="h-20 w-20" />
                        <div className="flex flex-1 flex-col">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="line-clamp-2 text-sm font-medium leading-tight">
                                {item.nome}
                              </p>
                              {item.tamanho && (
                                <p className="mt-1 text-xs text-muted">
                                  Tamanho: <span className="font-semibold text-foreground">{item.tamanho}</span>
                                </p>
                              )}
                            </div>
                            <button
                              onClick={() => remove(item.produtoId, item.tamanho)}
                              className="text-muted hover:text-brand-red"
                              aria-label="Remover item"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="mt-auto flex items-center justify-between pt-2">
                            <div className="inline-flex items-center rounded-full border border-border bg-background-elev">
                              <button
                                className="inline-flex h-8 w-8 items-center justify-center text-muted hover:text-foreground"
                                onClick={() =>
                                  updateQty(item.produtoId, item.tamanho, item.quantidade - 1)
                                }
                                aria-label="Diminuir"
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <span className="min-w-6 text-center text-sm font-semibold">
                                {item.quantidade}
                              </span>
                              <button
                                className="inline-flex h-8 w-8 items-center justify-center text-muted hover:text-foreground"
                                onClick={() =>
                                  updateQty(item.produtoId, item.tamanho, item.quantidade + 1)
                                }
                                aria-label="Aumentar"
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            <div className="text-right">
                              {item.precoCatalogoLoja != null &&
                                item.precoCatalogoLoja > item.preco + 1e-9 && (
                                  <span className="mr-2 text-xs text-muted line-through">
                                    {formatBRL(item.precoCatalogoLoja * item.quantidade)}
                                  </span>
                                )}
                              <span className="font-display text-base tracking-wide tabular-nums gradient-text">
                                {formatBRL(item.preco * item.quantidade)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <footer className="border-t border-border px-6 py-5">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-muted">Subtotal</span>
                  <span className="font-display text-2xl tracking-wide gradient-text">
                    {formatBRL(totalPrice)}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted">
                  Preços com −{SITE_WIDE_DISCOUNT_PERCENT}% na loja. No PIX, mais −
                  {PIX_CHECKOUT_EXTRA_DISCOUNT_PERCENT}% com o cupom{" "}
                  <span className="font-mono font-semibold text-brand-green">
                    {PIX_DISCOUNT_COUPON_CODE}
                  </span>
                  . Frete grátis.
                </p>
                <Link
                  href="/checkout"
                  onClick={close}
                  className="btn-primary mt-4 w-full"
                >
                  Finalizar pedido
                </Link>
                <button
                  onClick={clear}
                  className="mt-2 w-full text-center text-xs text-muted hover:text-brand-red"
                >
                  Esvaziar carrinho
                </button>
              </footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
