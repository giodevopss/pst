import Image from "next/image";
import type { Produto } from "@/data/produtos";
import { LojaDiscountBadge, PixDiscountBadge } from "@/components/PromoPriceBadges";
import { getSelecao } from "@/data/selecoes";
import { cn } from "@/lib/utils";

type Props = {
  produto: Produto;
  className?: string;
  showBadges?: boolean;
  /** Larguras responsivas para o otimizador (default mais alto para telas retina) */
  sizes?: string;
  quality?: number;
};

const DEFAULT_IMG_SIZES = "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 28vw";
const DEFAULT_IMG_QUALITY = 92;

export function ProductImage({
  produto,
  className,
  showBadges = true,
  sizes = DEFAULT_IMG_SIZES,
  quality = DEFAULT_IMG_QUALITY,
}: Props) {
  const selecao = produto.selecaoSlug ? getSelecao(produto.selecaoSlug) : undefined;

  const background = selecao
    ? `linear-gradient(135deg, ${selecao.cores.primaria} 0%, ${selecao.cores.secundaria} 60%, ${selecao.cores.terciaria ?? selecao.cores.primaria} 100%)`
    : produto.categoria === "album"
      ? "linear-gradient(135deg, #1a1f2e 0%, #0d1220 50%, #162032 100%)"
      : produto.categoria === "pacote"
        ? "linear-gradient(135deg, #004d2c 0%, #ffd60a 42%, #0050a8 100%)"
        : "linear-gradient(135deg, #0050a8 0%, #00b14f 100%)";

  const initials = (selecao?.nome ?? produto.nome)
    .split(" ")
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join("");

  const label =
    produto.categoria === "camiseta" && selecao
      ? selecao.nome.toUpperCase()
      : produto.categoria === "album"
        ? "ÁLBUM"
        : produto.categoria === "pacote"
          ? "PACOTE"
          : "26";

  const symbol =
    produto.categoria === "camiseta"
      ? selecao?.bandeira ?? "👕"
      : produto.categoria === "album"
        ? "📖"
        : produto.categoria === "pacote"
          ? "📦"
          : "👕";

  if (produto.imagemSrc) {
    const isSvg = produto.imagemSrc.endsWith(".svg");
    const prioritize =
      produto.slug.includes("capa-dura") ||
      produto.slug.includes("camiseta-selecao") ||
      produto.slug.includes("capa-cartao-mais") ||
      produto.categoria === "pacote";

    return (
      <div
        className={cn(
          "group relative aspect-square overflow-hidden rounded-2xl bg-background-elev",
          className,
        )}
        style={{ background }}
      >
        <div className="absolute inset-0 p-5 md:p-7">
          <div className="relative h-full w-full">
            {isSvg ? (
              <div className="flex h-full w-full items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element -- SVGs vetoriais do catálogo */}
                <img
                  src={produto.imagemSrc}
                  alt={produto.nome}
                  className="max-h-full max-w-full object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-[1.03]"
                  width={400}
                  height={400}
                  loading={prioritize ? "eager" : "lazy"}
                  decoding="async"
                />
              </div>
            ) : (
              <Image
                src={produto.imagemSrc}
                alt={produto.nome}
                fill
                sizes={sizes}
                quality={quality}
                className="object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-[1.03]"
                priority={prioritize}
              />
            )}
          </div>
        </div>
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-t from-black/35 via-transparent to-white/5" />

        {showBadges && produto.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-foreground/95 px-3 py-1 font-display text-[10px] tracking-[0.2em] text-background">
            {produto.badge}
          </span>
        )}
        {showBadges && (
          <div className="absolute right-3 top-3 flex max-w-[min(92vw,12rem)] flex-col items-end gap-1">
            <LojaDiscountBadge size="compact" className="shadow-md" />
            <PixDiscountBadge size="compact" className="shadow-md" />
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "group relative aspect-square overflow-hidden rounded-2xl perspective-1000",
        className,
      )}
      style={{ background }}
    >
      <div className="absolute inset-0 bg-noise opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-white/15" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.5),transparent_45%)] mix-blend-screen" />
      <div className="absolute -left-1/3 top-8 h-24 w-[170%] -rotate-12 bg-white/15 blur-xl" />

      <div className="absolute inset-0 preserve-3d flex flex-col items-center justify-center text-center text-white">
        <div className="product-symbol text-7xl drop-shadow-lg transition-transform duration-500 group-hover:scale-110 md:text-8xl">
          {symbol}
        </div>
        <div className="mt-4 font-display text-2xl tracking-[0.3em] text-white/90 drop-shadow md:text-3xl">
          {label}
        </div>
        {selecao && (
          <div className="mt-1 font-display text-sm tracking-[0.5em] text-white/70">
            {initials} · 2026
          </div>
        )}
      </div>

      <span className="pointer-events-none absolute -inset-x-1/2 inset-y-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-all duration-700 group-hover:translate-x-full group-hover:opacity-100" />

      {showBadges && produto.badge && (
        <span className="absolute left-3 top-3 rounded-full bg-foreground/95 px-3 py-1 font-display text-[10px] tracking-[0.2em] text-background">
          {produto.badge}
        </span>
      )}
      {showBadges && (
        <div className="absolute right-3 top-3 flex max-w-[min(92vw,12rem)] flex-col items-end gap-1">
          <LojaDiscountBadge size="compact" className="shadow-md" />
          <PixDiscountBadge size="compact" className="shadow-md" />
        </div>
      )}
    </div>
  );
}
