import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Produto } from "@/data/produtos";
import { catalogStrikePrice, sitePromoUnitSale, hasPacotesDestaqueExtraKitPromo, PACOTES_DESTAQUE_EXTRA_DISCOUNT_PERCENT } from "@/lib/store-pricing";
import { formatBRL, cn } from "@/lib/utils";

type Props = {
  items: Produto[];
  className?: string;
};

export function PacotesDestaquesStrip({ items, className }: Props) {
  if (items.length === 0) return null;

  return (
    <section
      className={cn(
        "relative border-b border-border bg-gradient-to-b from-surface/50 to-background-elev/35 backdrop-blur-sm",
        className,
      )}
    >
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.38em] text-brand-yellow">Destaques</p>
            <h2 className="mt-1 font-display text-2xl tracking-tight text-foreground md:text-3xl">
              Combos álbum + figurinhas
            </h2>
            <p className="mt-1 max-w-xl text-sm text-muted">
              Kits oficiais Panini com álbum e envelopes — <span className="font-medium text-foreground">sem camisa</span>.
              Nos três primeiros itens:{" "}
              <span className="font-medium text-brand-green">mais −{PACOTES_DESTAQUE_EXTRA_DISCOUNT_PERCENT}%</span> sobre o
              preço já promocional da loja. Abaixo, as promoções com camisa Brasil.
            </p>
          </div>
          <Link
            href="#pacotes-figurinhas"
            className="shrink-0 text-sm font-medium text-brand-cyan underline decoration-brand-cyan/35 underline-offset-4 transition hover:text-brand-yellow hover:decoration-brand-yellow/50"
          >
            Ver todas as promoções ↓
          </Link>
        </div>

        <div className="mt-6 flex gap-4 overflow-x-auto pb-1 scrollbar-none md:grid md:grid-cols-2 md:overflow-visible lg:grid-cols-4">
          {items.map((produto) => {
            const href = `/produto/${produto.slug}`;
            const sale = sitePromoUnitSale(produto);
            const strike = catalogStrikePrice(produto);
            const src = produto.imagemSrc ?? "/images/panini/album-capa-dura-ouro.jpg";

            return (
              <Link
                key={produto.id}
                href={href}
                className="group flex min-w-[240px] shrink-0 flex-col overflow-hidden rounded-2xl border border-border bg-surface/45 transition hover:-translate-y-0.5 hover:border-brand-yellow/55 hover:shadow-glow-yellow md:min-w-0"
              >
                <div className="relative aspect-[4/3] bg-background-elev/60">
                  <Image
                    src={src}
                    alt={produto.nome}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 260px, (max-width: 1024px) 50vw, 25vw"
                  />
                  {produto.badge && (
                    <span className="absolute left-3 top-3 rounded-full border border-brand-yellow/40 bg-background/80 px-2.5 py-0.5 font-display text-[10px] font-bold uppercase tracking-wider text-brand-yellow backdrop-blur-sm">
                      {produto.badge}
                    </span>
                  )}
                  {hasPacotesDestaqueExtraKitPromo(produto.id) && (
                    <span className="absolute right-3 top-3 rounded-full border border-brand-green/50 bg-[#041208]/90 px-2.5 py-0.5 font-display text-[10px] font-bold uppercase tracking-wide text-brand-green shadow-sm backdrop-blur-sm">
                      −{PACOTES_DESTAQUE_EXTRA_DISCOUNT_PERCENT}% extra
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-2 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-snug text-foreground group-hover:text-brand-yellow">
                      {produto.nome}
                    </h3>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-muted transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-yellow" />
                  </div>
                  <div className="mt-auto flex flex-wrap items-baseline gap-2">
                    <span className="font-display text-xl tabular-nums tracking-wide gradient-text">
                      {formatBRL(sale)}
                    </span>
                    {strike > sale + 1e-9 && (
                      <span className="text-xs text-muted line-through">{formatBRL(strike)}</span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
