import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Star, Truck } from "lucide-react";
import { ProductImage } from "@/components/ProductImage";
import { ProductCard } from "@/components/ProductCard";
import { ProductAlbumAddZone } from "@/components/ProductAlbumAddZone";
import { SectionHeading } from "@/components/SectionHeading";
import { getProduto, PRODUTOS } from "@/data/produtos";
import { PacoteDetalheClient } from "@/components/PacoteDetalheClient";
import { formatBRL, formatBRLExact } from "@/lib/utils";
import { PromoBadgesPair } from "@/components/PromoPriceBadges";
import { catalogStrikePrice, sitePromoUnitSale } from "@/lib/store-pricing";

type Params = { slug: string };

export function generateStaticParams() {
  return PRODUTOS.filter((p) => p.categoria !== "camiseta").map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const produto = getProduto(slug);
  if (!produto) return {};
  return { title: produto.nome, description: produto.descricao };
}

export default async function ProdutoDetalhe({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const produto = getProduto(slug);
  if (!produto || produto.categoria === "camiseta") notFound();

  const isLojistaCaixa = produto.id.startsWith("lojista-caixa-");

  const relacionados = PRODUTOS.filter(
    (p) =>
      p.categoria === produto.categoria &&
      p.id !== produto.id &&
      !(isLojistaCaixa && p.id.startsWith("lojista-caixa-")),
  ).slice(0, 4);

  const voltarHref = isLojistaCaixa
    ? "/pacotes#lojistas"
    : produto.categoria === "pacote"
      ? "/pacotes"
      : "/album";
  const salePrice = sitePromoUnitSale(produto);
  const strikePrice = catalogStrikePrice(produto);

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 pt-10 md:px-8">
        <Link
          href={voltarHref}
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Link>
      </div>

      <section className="mx-auto grid max-w-7xl items-start gap-12 px-4 py-10 md:px-8 md:py-16 lg:grid-cols-2">
        <div className="relative">
          <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-brand-yellow/20 via-brand-green/15 to-brand-blue/20 blur-2xl" />
          <div className="relative">
            <ProductImage
              produto={produto}
              className="aspect-[4/5] rounded-[2rem]"
              showPromoBadges={false}
            />
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-brand-yellow">
            {isLojistaCaixa && "Lojistas · atacado"}
            {!isLojistaCaixa && produto.categoria === "album" && "Álbum oficial"}
            {!isLojistaCaixa && produto.categoria === "pacote" && "Pacote promocional Brasil"}
          </p>
          <h1 className="mt-3 font-display text-4xl leading-tight tracking-tight md:text-6xl">
            {produto.nome}
          </h1>

          <div className="mt-5 flex flex-wrap items-baseline gap-3">
            <span className="font-display text-4xl gradient-text">
              {isLojistaCaixa ? formatBRLExact(salePrice) : formatBRL(salePrice)}
            </span>
            {strikePrice > salePrice + 1e-9 && (
              <span className="text-base text-muted line-through">
                {isLojistaCaixa ? formatBRLExact(strikePrice) : formatBRL(strikePrice)}
              </span>
            )}
            {!isLojistaCaixa && <PromoBadgesPair badgeClassName="px-3 py-1 text-xs" />}
          </div>

          <p className="mt-5 text-base leading-relaxed text-muted">{produto.descricao}</p>

          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {produto.destaques.map((d) => (
              <li
                key={d}
                className="flex items-start gap-2 rounded-xl border border-border bg-surface/40 p-3 text-sm"
              >
                <Star className="mt-0.5 h-4 w-4 shrink-0 text-brand-yellow" />
                <span className="text-foreground/90">{d}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8">
            {produto.categoria === "pacote" ? (
              <PacoteDetalheClient produto={produto} />
            ) : (
              <ProductAlbumAddZone produto={produto} fullWidth />
            )}
          </div>

          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-border bg-surface/40 p-4 text-sm text-muted">
            <Truck className="mt-0.5 h-4 w-4 shrink-0 text-brand-cyan" />
            <p>
              {isLojistaCaixa
                ? "Volumes atacado: frete e condições comerciais combinados no pedido."
                : "Enviamos para todo o Brasil com frete grátis nesta loja."}
            </p>
          </div>
        </div>
      </section>

      {relacionados.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
          <SectionHeading
            eyebrow="Combina com você"
            title={produto.categoria === "pacote" ? "Outros pacotes Brasil" : "Produtos relacionados"}
            cta={{
              href:
                produto.categoria === "pacote"
                  ? "/pacotes"
                  : isLojistaCaixa
                    ? "/pacotes#lojistas"
                    : "/album",
              label:
                produto.categoria === "pacote"
                  ? "Ver todos os pacotes"
                  : isLojistaCaixa
                    ? "Ver ofertas lojistas"
                    : "Ver tudo do álbum",
            }}
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {relacionados.map((p) => (
              <ProductCard key={p.id} produto={p} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
