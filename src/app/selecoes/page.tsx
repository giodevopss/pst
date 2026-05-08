import type { Metadata } from "next";
import { SelecaoBadge } from "@/components/SelecaoBadge";
import { SELECOES } from "@/data/selecoes";

export const metadata: Metadata = {
  title: "Seleções da Copa 2026 — Camisetas oficiais",
  description:
    "Todas as seleções com camisetas disponíveis para a Copa do Mundo 2026. Vista as cores da sua paixão.",
};

export default function SelecoesPage() {
  const ordenadas = [...SELECOES].sort((a, b) => b.popularidade - a.popularidade);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20">
      <p className="text-xs font-semibold uppercase tracking-[0.4em] text-brand-yellow">
        Seleções classificadas
      </p>
      <h1 className="mt-3 font-display text-5xl leading-[0.95] tracking-tight md:text-7xl">
        VISTA AS CORES.<br />
        <span className="gradient-text">VIVA A COPA.</span>
      </h1>
      <p className="mt-5 max-w-2xl text-base text-muted md:text-lg">
        Selecione sua seleção favorita e veja as camisetas oficiais disponíveis no nosso
        catálogo para a Copa 2026.
      </p>

      <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {ordenadas.map((s) => (
          <SelecaoBadge key={s.slug} selecao={s} />
        ))}
      </div>
    </section>
  );
}
