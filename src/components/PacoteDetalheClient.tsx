"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { TAMANHOS, type Produto, type Tamanho } from "@/data/produtos";
import { AddToCartButton } from "@/components/AddToCartButton";
import { cn } from "@/lib/utils";

export function PacoteDetalheClient({ produto }: { produto: Produto }) {
  const [tamanho, setTamanho] = useState<Tamanho | undefined>(undefined);
  const [qty, setQty] = useState(1);

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted">
          Tamanho da camisa inclusa
        </p>
        <div className="flex flex-wrap gap-2">
          {TAMANHOS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTamanho(t)}
              className={cn(
                "h-12 min-w-12 rounded-xl border px-4 font-display text-base tracking-wide transition-all",
                tamanho === t
                  ? "border-brand-yellow bg-brand-yellow text-[#06080f] shadow-glow-yellow"
                  : "border-border bg-surface/60 text-foreground hover:border-foreground/40",
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted">
          Quantidade de pacotes
        </p>
        <div className="inline-flex items-center rounded-full border border-border bg-surface/60">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="inline-flex h-10 w-10 items-center justify-center text-muted hover:text-foreground"
            aria-label="Diminuir"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="min-w-8 text-center font-semibold">{qty}</span>
          <button
            type="button"
            onClick={() => setQty((q) => Math.min(99, q + 1))}
            className="inline-flex h-10 w-10 items-center justify-center text-muted hover:text-foreground"
            aria-label="Aumentar"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      <AddToCartButton
        produto={produto}
        tamanho={tamanho}
        quantidade={qty}
        requiresSize
        fullWidth
        label="Adicionar pacote ao carrinho"
      />
    </div>
  );
}
