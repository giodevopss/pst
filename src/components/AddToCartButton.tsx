"use client";

import { useState } from "react";
import { Check, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";
import type { Produto, Tamanho } from "@/data/produtos";
import { cn } from "@/lib/utils";

type Props = {
  produto: Produto;
  tamanho?: Tamanho;
  quantidade?: number;
  className?: string;
  variant?: "primary" | "secondary";
  label?: string;
  fullWidth?: boolean;
  requiresSize?: boolean;
};

export function AddToCartButton({
  produto,
  tamanho,
  quantidade = 1,
  className,
  variant = "primary",
  label = "Adicionar ao carrinho",
  fullWidth = false,
  requiresSize = false,
}: Props) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handle = () => {
    if (requiresSize && !tamanho) {
      setError("Selecione um tamanho");
      return;
    }
    setError(null);
    add(produto, { tamanho, quantidade });
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <div className={cn(fullWidth && "w-full")}>
      <button
        type="button"
        onClick={handle}
        className={cn(
          variant === "primary" ? "btn-primary" : "btn-secondary",
          fullWidth && "w-full",
          className,
        )}
      >
        {added ? (
          <>
            <Check className="h-4 w-4" /> Adicionado!
          </>
        ) : (
          <>
            <ShoppingBag className="h-4 w-4" /> {label}
          </>
        )}
      </button>
      {error && (
        <p className="mt-2 text-center text-xs font-medium text-brand-red">{error}</p>
      )}
    </div>
  );
}
