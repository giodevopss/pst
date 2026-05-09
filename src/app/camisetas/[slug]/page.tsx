import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Star, Truck } from "lucide-react";
import { getProduto, PRODUTOS, produtosPorCategoria } from "@/data/produtos";
import { getSelecao } from "@/data/selecoes";
import { CamisetaGaleria } from "@/components/CamisetaGaleria";
import { ProductImage } from "@/components/ProductImage";
import { ProductCard } from "@/components/ProductCard";
import { CamisetaDetalheClient } from "./CamisetaDetalheClient";
import { formatBRL } from "@/lib/utils";
import { SectionHeading } from "@/components/SectionHeading";

type Params = { slug: string };

export function generateStaticParams() {
  return PRODUTOS.filter((p) => p.categoria === "camiseta").map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const produto = getProduto(slug);
  if (!produto) return {};
  return {
    title: produto.nome,
    description: produto.descricao,
  };
}

export default async function CamisetaDetalhe({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const produto = getProduto(slug);
  if (!produto || produto.categoria !== "camiseta") notFound();

  const selecao = produto.selecaoSlug ? getSelecao(produto.selecaoSlug) : undefined;

  const sugeridas = produtosPorCategoria("camiseta")
    .filter((p) => p.id !== produto.id)
    .slice(0, 4);

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 pt-10 md:px-8">
        <Link
          href="/camisetas"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar para camisetas
        </Link>
      </div>

      <section className="mx-auto grid max-w-7xl items-start gap-12 px-4 py-10 md:px-8 md:py-16 lg:grid-cols-2">
        <div className="relative">
          <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-brand-yellow/20 via-brand-green/15 to-brand-blue/20 blur-2xl" />
          <div className="relative">
            {produto.galeria && produto.galeria.length > 0 ? (
              <CamisetaGaleria produto={produto} className="aspect-[4/5] rounded-[2rem]" showBadges />
            ) : (
              <ProductImage
                produto={produto}
                className="aspect-[4/5] rounded-[2rem]"
                showBadges
                sizes="(max-width: 1024px) 100vw, (max-width: 1280px) 50vw, 640px"
                quality={95}
              />
            )}
          </div>
          {selecao && (
            <div className="mt-6 flex items-center justify-center gap-3 rounded-2xl border border-border bg-surface/60 p-4">
              <span className="text-3xl">{selecao.bandeira}</span>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted">Seleção</p>
                <p className="font-display text-lg tracking-wide">
                  {selecao.nome}
                  {selecao.apelido && (
                    <span className="ml-2 text-sm text-muted">{selecao.apelido}</span>
                  )}
                </p>
              </div>
            </div>
          )}
        </div>

        <div>
          {selecao && (
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-brand-yellow">
              Seleção {selecao.nome}
            </p>
          )}
          <h1 className="mt-3 font-display text-4xl leading-tight tracking-tight md:text-6xl">
            {produto.nome}
          </h1>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="font-display text-4xl gradient-text">
              {formatBRL(produto.preco)}
            </span>
            {produto.precoOriginal && (
              <>
                <span className="text-base text-muted line-through">
                  {formatBRL(produto.precoOriginal)}
                </span>
                <span className="rounded-full bg-brand-red/15 px-3 py-1 text-xs font-semibold text-brand-red">
                  {Math.round(((produto.precoOriginal - produto.preco) / produto.precoOriginal) * 100)}% OFF
                </span>
              </>
            )}
          </div>

          <p className="mt-5 text-base leading-relaxed text-muted">
            {produto.descricao}
          </p>

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

          <CamisetaDetalheClient produto={produto} />

          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-border bg-surface/40 p-4 text-sm text-muted">
            <Truck className="mt-0.5 h-4 w-4 shrink-0 text-brand-cyan" />
            <p>
              Enviamos para todo o Brasil pelos Correios e transportadoras parceiras.
              Frete grátis em todo o Brasil nesta loja.
            </p>
          </div>
        </div>
      </section>

      {sugeridas.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
          <SectionHeading
            eyebrow="Você também vai gostar"
            title="Mais camisetas"
            cta={{ href: "/camisetas", label: "Ver catálogo completo" }}
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {sugeridas.map((p) => (
              <ProductCard key={p.id} produto={p} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
