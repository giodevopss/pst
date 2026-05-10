"use client";

import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import type { Produto, Tamanho } from "@/data/produtos";
import { priceAfterSiteDiscount } from "@/lib/store-pricing";

export type CartItem = {
  produtoId: string;
  slug: string;
  nome: string;
  preco: number;
  precoOriginal?: number;
  /** Preço de catálogo antes do −20% da loja (para tachado no carrinho). */
  precoCatalogoLoja?: number;
  categoria: string;
  selecaoSlug?: string;
  tamanho?: Tamanho;
  quantidade: number;
};

type CartContextValue = {
  items: CartItem[];
  add: (produto: Produto, options?: { tamanho?: Tamanho; quantidade?: number }) => void;
  remove: (produtoId: string, tamanho?: Tamanho) => void;
  updateQty: (produtoId: string, tamanho: Tamanho | undefined, qty: number) => void;
  clear: () => void;
  totalItems: number;
  totalPrice: number;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  lastAddedAt: number;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "copa2026:cart:v2";

function loadFromStorage(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((i) => i && typeof i === "object");
  } catch {
    return [];
  }
}

function makeKey(produtoId: string, tamanho?: Tamanho) {
  return `${produtoId}::${tamanho ?? "default"}`;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [lastAddedAt, setLastAddedAt] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(loadFromStorage());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore quota / private mode errors
    }
  }, [items, hydrated]);

  const add = useCallback<CartContextValue["add"]>((produto, options) => {
    const tamanho = options?.tamanho;
    const quantidade = options?.quantidade ?? 1;
    setItems((prev) => {
      const key = makeKey(produto.id, tamanho);
      const existing = prev.find((i) => makeKey(i.produtoId, i.tamanho) === key);
      if (existing) {
        return prev.map((i) =>
          makeKey(i.produtoId, i.tamanho) === key
            ? { ...i, quantidade: i.quantidade + quantidade }
            : i,
        );
      }
      return [
        ...prev,
        {
          produtoId: produto.id,
          slug: produto.slug,
          nome: produto.nome,
          preco: priceAfterSiteDiscount(produto.preco),
          precoOriginal: produto.precoOriginal,
          precoCatalogoLoja: produto.preco,
          categoria: produto.categoria,
          selecaoSlug: produto.selecaoSlug,
          tamanho,
          quantidade,
        },
      ];
    });
    setLastAddedAt(Date.now());
    setIsOpen(true);
  }, []);

  const remove = useCallback<CartContextValue["remove"]>((produtoId, tamanho) => {
    setItems((prev) =>
      prev.filter((i) => makeKey(i.produtoId, i.tamanho) !== makeKey(produtoId, tamanho)),
    );
  }, []);

  const updateQty = useCallback<CartContextValue["updateQty"]>((produtoId, tamanho, qty) => {
    setItems((prev) =>
      prev
        .map((i) =>
          makeKey(i.produtoId, i.tamanho) === makeKey(produtoId, tamanho)
            ? { ...i, quantidade: Math.max(1, Math.min(99, qty)) }
            : i,
        )
        .filter((i) => i.quantidade > 0),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);

  const totalItems = useMemo(
    () => items.reduce((acc, i) => acc + i.quantidade, 0),
    [items],
  );
  const totalPrice = useMemo(
    () => items.reduce((acc, i) => acc + i.quantidade * i.preco, 0),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      add,
      remove,
      updateQty,
      clear,
      totalItems,
      totalPrice,
      isOpen,
      open,
      close,
      toggle,
      lastAddedAt,
    }),
    [items, add, remove, updateQty, clear, totalItems, totalPrice, isOpen, open, close, toggle, lastAddedAt],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart precisa estar dentro de <CartProvider>");
  return ctx;
}
