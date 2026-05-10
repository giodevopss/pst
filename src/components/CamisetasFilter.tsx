"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { ProductCard } from "./ProductCard";
import { SELECOES, getSelecao } from "@/data/selecoes";
import type { Produto } from "@/data/produtos";
import { cn } from "@/lib/utils";
import { sitePromoUnitSale } from "@/lib/store-pricing";

type SortKey = "destaque" | "preco-asc" | "preco-desc";

export function CamisetasFilter({ produtos }: { produtos: Produto[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialSelecao = searchParams.get("selecao") ?? "todas";
  const [selecaoSlug, setSelecaoSlug] = useState<string>(initialSelecao);
  const [sort, setSort] = useState<SortKey>("destaque");

  useEffect(() => {
    const sp = new URLSearchParams(searchParams.toString());
    if (selecaoSlug === "todas") sp.delete("selecao");
    else sp.set("selecao", selecaoSlug);
    const qs = sp.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selecaoSlug]);

  const lista = useMemo(() => {
    let arr =
      selecaoSlug === "todas"
        ? produtos
        : produtos.filter((p) => p.selecaoSlug === selecaoSlug);

    if (sort === "preco-asc") {
      arr = [...arr].sort(
        (a, b) => sitePromoUnitSale(a) - sitePromoUnitSale(b),
      );
    } else if (sort === "preco-desc") {
      arr = [...arr].sort(
        (a, b) => sitePromoUnitSale(b) - sitePromoUnitSale(a),
      );
    } else {
      arr = [...arr].sort((a, b) => {
        const sa = a.selecaoSlug ? getSelecao(a.selecaoSlug)?.popularidade ?? 0 : 0;
        const sb = b.selecaoSlug ? getSelecao(b.selecaoSlug)?.popularidade ?? 0 : 0;
        return sb - sa;
      });
    }
    return arr;
  }, [produtos, selecaoSlug, sort]);

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="-mx-4 overflow-x-auto px-4 scrollbar-none">
          <div className="flex min-w-max gap-2">
            <FilterChip
              active={selecaoSlug === "todas"}
              onClick={() => setSelecaoSlug("todas")}
            >
              Todas as seleções
            </FilterChip>
            {SELECOES.map((s) => (
              <FilterChip
                key={s.slug}
                active={selecaoSlug === s.slug}
                onClick={() => setSelecaoSlug(s.slug)}
              >
                <span className="text-base">{s.bandeira}</span>
                <span>{s.nome}</span>
              </FilterChip>
            ))}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <label htmlFor="sort" className="text-xs uppercase tracking-widest text-muted">
            Ordenar
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-full border border-border bg-surface/60 px-4 py-2 text-sm text-foreground focus:border-brand-yellow focus:outline-none"
          >
            <option value="destaque">Destaque</option>
            <option value="preco-asc">Menor preço</option>
            <option value="preco-desc">Maior preço</option>
          </select>
        </div>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {lista.map((p) => (
          <ProductCard key={p.id} produto={p} />
        ))}
      </div>

      {lista.length === 0 && (
        <p className="mt-16 text-center text-muted">
          Nenhuma camiseta encontrada para esse filtro.
        </p>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-all",
        active
          ? "border-brand-yellow bg-brand-yellow text-[#06080f] shadow-glow-yellow"
          : "border-border bg-surface/60 text-muted hover:border-foreground/30 hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
