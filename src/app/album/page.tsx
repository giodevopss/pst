import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star, Trophy } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { SectionHeading } from "@/components/SectionHeading";
import { ProductAlbumAddZone } from "@/components/ProductAlbumAddZone";
import { HeroAlbum3D } from "@/components/HeroAlbum3D";
import { getProduto, produtosPorCategoria } from "@/data/produtos";
import { formatBRL } from "@/lib/utils";
import { PromoBadgesPair } from "@/components/PromoPriceBadges";
import { catalogStrikePrice, sitePromoUnitSale } from "@/lib/store-pricing";
import {
  PaniniAlbumIntro,
  PaniniEditionHighlights,
  PaniniFaqAccordion,
} from "@/components/PaniniEditorial";

export const metadata: Metadata = {
  title: "FIFA World Cup 2026™ — álbum oficial Panini na loja parceira",
  description:
    "Mesmos anúncios da Panini Brasil: FIFA World Cup 2026™ com álbum capa cartão ou capa dura (Ouro e Prata), combos 12 e 24 envelopes, BOX Sacola, BOX Luva Premium, kit envelopes e linha ADRENALYN XL™ Starter Pack / envelope / tin.",
};

export default function AlbumPage() {
  const albumDuro = getProduto("album-fifa-world-cup-2026-capa-dura-ouro")!;
  const albumSale = sitePromoUnitSale(albumDuro);
  const albumStrike = catalogStrikePrice(albumDuro);
  const produtosAlbum = produtosPorCategoria("album");
  const figurinhas = produtosAlbum.filter((p) => !p.id.startsWith("adrenalyn-xl-"));
  const adrenalynLinha = produtosAlbum.filter((p) => p.id.startsWith("adrenalyn-xl-"));

  return (
    <>
      <section className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute -left-40 top-10 h-80 w-80 rounded-full bg-brand-yellow/30 blur-[120px]" />
        <div className="pointer-events-none absolute -right-40 bottom-10 h-80 w-80 rounded-full bg-brand-green/30 blur-[120px]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 md:px-8 md:py-28 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-brand-yellow">
              Parceria Panini Brasil · FIFA World Cup 2026™ — Disponível
            </p>
            <h1 className="mt-4 font-display text-5xl leading-[0.95] tracking-tight md:text-7xl">
              O ÁLBUM OFICIAL<br />
              <span className="gradient-text">DA COPA 2026.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base text-muted md:text-lg">
              A maior Copa da história começa aqui.
              <br />
              Colecione cada momento da FIFA World Cup 2026™ com o álbum oficial da Panini Brasil e faça
              parte de uma geração que vai viver emoções inesquecíveis figurinha por figurinha.
            </p>

            <div className="mt-8 flex flex-wrap items-baseline gap-3">
              <span className="font-display text-5xl gradient-text">{formatBRL(albumSale)}</span>
              {albumStrike > albumSale + 1e-9 && (
                <span className="text-base text-muted line-through">{formatBRL(albumStrike)}</span>
              )}
              <PromoBadgesPair badgeClassName="px-3 py-1 text-xs" />
              <span className="rounded-full bg-brand-red/15 px-3 py-1 text-xs font-semibold text-brand-red">
                Capa dura ouro Panini
              </span>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <ProductAlbumAddZone produto={albumDuro} label="Comprar álbum oficial" />
              <Link href="/camisetas" className="btn-secondary">Ver camisa do Brasil</Link>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              {albumDuro.destaques.map((d) => (
                <div
                  key={d}
                  className="flex items-start gap-3 rounded-xl border border-border bg-surface/50 p-4"
                >
                  <Star className="mt-0.5 h-4 w-4 shrink-0 text-brand-yellow" />
                  <p className="text-sm text-foreground/90">{d}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg lg:max-w-2xl xl:max-w-[44rem]">
            <div className="pointer-events-none absolute -inset-12 rounded-full bg-gradient-to-r from-brand-yellow/30 via-brand-green/25 to-brand-blue/30 opacity-60 blur-3xl" />
            <div className="relative isolate z-[1] overflow-hidden">
              {albumDuro.badge && (
                <span className="absolute left-4 top-4 z-[2] rounded-full bg-foreground px-3 py-1.5 font-display text-[10px] tracking-[0.25em] text-background">
                  {albumDuro.badge}
                </span>
              )}
              <div className="h-[min(88vw,420px)] w-full md:h-[500px] lg:h-[560px]">
                <HeroAlbum3D className="rounded-none" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-background-elev/35">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 md:px-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.95fr)] lg:py-24">
          <PaniniAlbumIntro />
          <PaniniEditionHighlights />
        </div>
      </section>

      <section id="album-figurinhas" className="mx-auto max-w-7xl px-4 py-24 md:px-8">
        <SectionHeading
          eyebrow="Categoria oficial Panini"
          title="Álbum de figurinhas, combos e boxes"
        />

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {figurinhas.map((produto) => (
            <ProductCard key={produto.id} produto={produto} />
          ))}
        </div>
      </section>

      <section id="adrenalyn-xl" className="border-y border-border bg-surface/20">
        <div className="mx-auto max-w-7xl px-4 py-24 md:px-8">
          <SectionHeading
            eyebrow="Linha Adrenalyn XL™ oficial"
            title="Adrenalyn XL™ FIFA World Cup 2026™"
            description="Starter pack para começar, envelopes com cartas + cupom e latinha tipo classic tin — os mesmos itens destacados pela Panini na mesma coleção."
          />

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {adrenalynLinha.map((produto) => (
              <ProductCard key={produto.id} produto={produto} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-20 md:px-8 lg:py-28">
        <PaniniFaqAccordion />
      </section>

      <section className="mx-auto max-w-5xl px-4 py-24 text-center md:px-8">
        <div className="relative mx-auto h-36 w-36">
          <div className="pointer-events-none absolute inset-0 rounded-full bg-brand-yellow/20 blur-3xl" />
          <div className="pointer-events-none absolute inset-4 rounded-full bg-brand-yellow/30 blur-2xl" />
          <Image
            src="/images/trofeu-copa.png"
            alt="Troféu da Copa do Mundo"
            width={220}
            height={220}
            className="relative mx-auto h-36 w-36 object-contain mix-blend-screen"
            priority={false}
          />
        </div>
        <h2 className="mt-4 font-display text-4xl tracking-tight md:text-6xl">
          Complete a coleção da<br />
          <span className="gradient-text">Copa que vai entrar pra história.</span>
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-muted">
          Mais do que preencher o álbum Panini oficial: registrar a primeira Copa do Mundo com 48 seleções nos
          EUA, México e Canadá — e ainda garantir suas cartas Adrenalyn XL™ e a camisa do Brasil.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <ProductAlbumAddZone produto={albumDuro} label="Comprar álbum capa dura" />
          <Link href="/camisetas" className="btn-secondary">
            Ver camisetas
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
