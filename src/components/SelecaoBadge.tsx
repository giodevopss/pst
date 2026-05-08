import Link from "next/link";
import type { Selecao } from "@/data/selecoes";

export function SelecaoBadge({ selecao }: { selecao: Selecao }) {
  return (
    <Link
      href={`/camisetas?selecao=${selecao.slug}`}
      className="group relative flex aspect-square flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border border-border p-4 transition-all duration-300 hover:-translate-y-1 hover:border-white/40"
      style={{
        background: `linear-gradient(135deg, ${selecao.cores.primaria} 0%, ${selecao.cores.secundaria} 100%)`,
      }}
    >
      <div className="absolute inset-0 bg-noise opacity-25" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-white/15" />

      <span className="relative text-5xl drop-shadow transition-transform duration-300 group-hover:scale-110 md:text-6xl">
        {selecao.bandeira}
      </span>
      <span className="relative font-display text-base tracking-[0.18em] text-white drop-shadow md:text-lg">
        {selecao.nome.toUpperCase()}
      </span>
    </Link>
  );
}
