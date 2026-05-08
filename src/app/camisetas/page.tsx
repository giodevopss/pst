import type { Metadata } from "next";
import { produtosPorCategoria } from "@/data/produtos";
import { ProductCard } from "@/components/ProductCard";

export const metadata: Metadata = {
  title: "Camisa oficial do Brasil — Copa 2026",
  description:
    "Compre a camisa oficial do Brasil para a Copa do Mundo 2026.",
};

export default function CamisetasPage() {
  const camisetas = produtosPorCategoria("camiseta");

  return (
    <>
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-brand-yellow">
            Camisetas oficiais
          </p>
          <h1 className="mt-3 font-display text-5xl leading-[0.95] tracking-tight md:text-7xl">
            CAMISA OFICIAL DO<br />
            <span className="gradient-text">BRASIL 2026.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base text-muted md:text-lg">
            Catálogo focado na camisa do Brasil, com tecido tecnológico, escudo premium
            e modelagem moderna para jogo e dia a dia.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
        <div className="grid gap-6 md:grid-cols-2 md:max-w-3xl">
          {camisetas.map((produto) => (
            <ProductCard key={produto.id} produto={produto} />
          ))}
        </div>
      </section>
    </>
  );
}

// Garante revalidação rápida em produção
export const dynamic = "force-static";
