import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles, Star, Truck } from "lucide-react";
import { Hero } from "@/components/Hero";
import { ProductCard } from "@/components/ProductCard";
import { SectionHeading } from "@/components/SectionHeading";
import { produtosDestaque, produtosPacotes, getProduto } from "@/data/produtos";
import { ProductImage } from "@/components/ProductImage";
import { formatBRL, formatBRLExact } from "@/lib/utils";
import {
  PIX_CHECKOUT_EXTRA_DISCOUNT_PERCENT,
  SITE_WIDE_DISCOUNT_PERCENT,
  catalogStrikePrice,
  sitePromoUnitSale,
} from "@/lib/store-pricing";
import { AddToCartButton } from "@/components/AddToCartButton";
import { CouponBanner } from "@/components/CouponBanner";

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Coleção Panini oficial",
    text:
      "FIFA World Cup 2026™: oficial na Panini (álbum, envelopes, boxes e Adrenalyn XL™).",
  },
  {
    icon: Truck,
    title: "Envio para todo Brasil",
    text: "Entrega em até 48h após a confirmação do pagamento.*",
  },
  {
    icon: Sparkles,
    title: "Pague com PIX",
    text: `${SITE_WIDE_DISCOUNT_PERCENT}% na loja e mais ${PIX_CHECKOUT_EXTRA_DISCOUNT_PERCENT}% no total ao pagar com PIX.`,
  },
];

export default function Home() {
  const destaques = produtosDestaque();
  const combos = produtosPacotes().slice(0, 3);
  const albumDuro = getProduto("album-fifa-world-cup-2026-capa-dura-ouro")!;
  const camisaBrasil = getProduto("camiseta-selecao-brasil")!;
  const albumSale = sitePromoUnitSale(albumDuro);
  const albumStrike = catalogStrikePrice(albumDuro);
  const camisaBrasilII = getProduto("camiseta-selecao-brasil-ii")!;
  const camisaIISale = sitePromoUnitSale(camisaBrasilII);

  return (
    <>
      <Hero />

      <CouponBanner />

      <section className="border-y border-border bg-background-elev/40">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-6 md:grid-cols-3 md:px-8 md:py-8">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="group rounded-2xl border border-border/80 bg-background-elev/80 p-5 transition-all hover:-translate-y-0.5 hover:border-brand-yellow/50 hover:bg-surface/80"
              >
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-brand-yellow/35 bg-brand-yellow/10">
                  <Icon className="h-5 w-5 text-brand-yellow" />
                </div>
                <p className="mt-3 font-display text-lg tracking-wide text-foreground">
                  {f.title}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{f.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 py-24 md:px-8">
        <SectionHeading
          eyebrow="Panini x FIFA World Cup 2026™"
          title="Mais procurados"
          description="Destaques FIFA World Cup 2026™ — capa dura ouro, capa cartão, combos e Adrenalyn XL™, mais a camisa do Brasil. Tudo disponível."
          cta={{ href: "/album", label: "Ver catálogo" }}
        />

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {destaques.map((p) => (
            <ProductCard key={p.id} produto={p} />
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-brand-blue/[0.04] via-transparent to-brand-yellow/[0.05]" />
        <div className="pointer-events-none absolute -left-20 top-8 h-56 w-56 rounded-full bg-brand-cyan/12 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-1/3 h-72 w-72 rounded-full bg-brand-magenta/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-brand-yellow/12 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 gradient-conic opacity-10 blur-[90px]" />
        <div className="relative mx-auto max-w-7xl px-4 pb-24 md:px-8">
          <SectionHeading
            title="Combos"
            description="Seleção de promoções com camisa do Brasil + álbum + figurinhas/Adrenalyn para comprar tudo de uma vez."
            cta={{ href: "/pacotes", label: "Ver todos os combos" }}
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {combos.map((p) => (
              <ProductCard key={p.id} produto={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-brand-yellow/[0.04] to-transparent" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-24 md:px-8 lg:grid-cols-2">
          <div className="relative">
            <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-brand-yellow/30 via-brand-green/20 to-brand-blue/20 blur-2xl" />
            <div className="relative">
              <ProductImage produto={albumDuro} className="aspect-[4/5] rounded-[2rem]" />
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-brand-yellow">
              Coleção definitiva
            </p>
            <h2 className="mt-3 font-display text-4xl leading-tight tracking-tight md:text-6xl">
              O álbum mais esperado<br />
              <span className="gradient-text">já tem dono.</span>
            </h2>
            <p className="mt-5 max-w-xl text-base text-muted md:text-lg">
              Cada página foi criada para eternizar craques, seleções e momentos inesquecíveis da Copa de
              2026. Dos grandes confrontos aos novos talentos, tudo poderá ser revivido figurinha por
              figurinha.
            </p>

            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {albumDuro.destaques.map((d) => (
                <li key={d} className="flex items-start gap-2 text-sm text-foreground/90">
                  <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-brand-yellow" />
                  {d}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap items-baseline gap-3">
              <span className="font-display text-4xl gradient-text">{formatBRL(albumSale)}</span>
              {albumStrike > albumSale + 1e-9 && (
                <span className="text-base text-muted line-through">{formatBRL(albumStrike)}</span>
              )}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/album" className="btn-primary">
                Garantir meu álbum
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href={`/camisetas/${camisaBrasil.slug}`} className="btn-secondary">
                Ver camisa do Brasil
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-24 md:px-8">
        <SectionHeading
          eyebrow="Peça exclusiva"
          title="Camiseta oficial do Brasil 2026 II"
          description="Versão II da camisa oficial do Brasil, com tecido premium e acabamento especial."
          cta={{ href: `/camisetas/${camisaBrasilII.slug}`, label: "Ver detalhes da Camiseta II" }}
        />

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_1fr]">
          <div className="card-surface p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-brand-yellow">
              Brasil 2026 II
            </p>
            <h3 className="mt-3 font-display text-4xl md:text-5xl">
              Camiseta II com presença de estádio.
            </h3>
            <p className="mt-4 text-muted">
              Segunda versão da camisa oficial do Brasil: visual alternativo com acabamento premium para
              completar seu kit de torcedor.
            </p>
            <ul className="mt-6 space-y-3">
              {camisaBrasilII.destaques.map((d) => (
                <li key={d} className="flex items-center gap-2 text-sm">
                  <Star className="h-4 w-4 text-brand-yellow" />
                  {d}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <span className="font-display text-4xl gradient-text">{formatBRLExact(camisaIISale)}</span>
              <AddToCartButton produto={camisaBrasilII} label="Comprar Camiseta II" />
            </div>
          </div>
          <div className="rounded-3xl border border-border bg-surface/50 p-6">
            <ProductImage produto={camisaBrasilII} className="aspect-[4/5]" />
          </div>
        </div>
      </section>

      <section className="home-cta-stadium relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/crowd-copa2026.png"
            alt="Torcida brasileira em estádio"
            fill
            className="object-cover blur-[8px] scale-110"
            sizes="100vw"
            priority={false}
          />
        </div>
        <div className="absolute inset-0 bg-[#050a14]/72 [data-theme=light]:bg-[#050a14]/68" />
        <div className="absolute inset-0 gradient-conic opacity-15 blur-3xl [data-theme=light]:opacity-10" />
        <div className="relative mx-auto max-w-5xl px-4 py-24 text-center md:px-8">
          <p className="cta-eyebrow text-xs font-semibold uppercase tracking-[0.4em] text-brand-yellow">
            #Copa2026
          </p>
          <h2 className="cta-title mt-3 font-display text-4xl leading-[0.95] tracking-tight text-foreground md:text-7xl">
            DA COLEÇÃO PRO ESTÁDIO.<br />
            <span className="cta-gradient gradient-text">VOCÊ NA TORCIDA.</span>
          </h2>
          <p className="cta-desc mx-auto mt-6 max-w-2xl text-base text-muted md:text-lg">
            Garanta o álbum e os packs anunciados pela Panini e vista o Brasil — tudo alinhado ao hub oficial
            FIFA World Cup 2026™ em colecionáveis.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/album" className="btn-primary">
              Começar pelo álbum
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/camisetas" className="btn-secondary cta-btn-secondary">
              Comprar camiseta
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
