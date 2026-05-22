import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Package } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { ProductCard } from "@/components/ProductCard";
import {
  comAnuncioPrioritarioPrimeiro,
  produtosPacotesFigurinhas,
  produtosPacotesFigurinhasAtualizado,
  produtosPacotesAdrenalyn,
  produtosPacotesHeroDestaque,
} from "@/data/produtos";
import { PacotesOfertasSlider } from "@/components/PacotesOfertasSlider";
import { PacotesDestaquesStrip } from "@/components/PacotesDestaquesStrip";
import { PacotesLojistasSection } from "@/components/PacotesLojistasSection";

function pickRandom<T>(items: T[], count: number) {
  return [...items]
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.min(count, items.length));
}

export const metadata: Metadata = {
  title:
    "Promoções Brasil — camisa + álbum Panini | figurinhas e Adrenalyn XL™ Copa 2026",
  description:
    "Monte o kit: camisa oficial Brasil com álbum ouro, prata, capa dura ou capa cartão; escolha 12, 24 ou 50 pacotes de figurinhas, ou combinações com 12, 24 ou 30 envelopes Adrenalyn XL™.",
};

export default function PacotesPage() {
  const figurinhas = produtosPacotesFigurinhas();
  const pacotesFigurinhas = figurinhas.filter((p) => p.categoria === "pacote");
  const figurinhasRandom = comAnuncioPrioritarioPrimeiro(pickRandom(pacotesFigurinhas, 10));
  const figurinhasShuffled = comAnuncioPrioritarioPrimeiro(
    pickRandom(pacotesFigurinhas, pacotesFigurinhas.length),
  );
  const adrenalyn = produtosPacotesAdrenalyn();
  const figurinhasAtualizado = produtosPacotesFigurinhasAtualizado();
  const destaquesTopo = produtosPacotesHeroDestaque();

  return (
    <>
      <PacotesDestaquesStrip items={destaquesTopo} />

      <section className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute -left-32 top-0 h-72 w-72 rounded-full bg-brand-yellow/35 blur-[100px]" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-brand-green/30 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-yellow/40 bg-brand-yellow/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-brand-yellow">
              <Package className="h-3.5 w-3.5" /> Exclusivos da loja
            </span>
          </div>

          <div className="mt-8 grid min-w-0 items-start gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-14">
            <div className="min-w-0">
              <h1 className="max-w-xl font-display text-[2.35rem] leading-[0.95] tracking-tight text-balance sm:text-5xl md:text-6xl lg:text-7xl">
                COMBOS ESPECIAIS
              </h1>
              <p className="mt-6 max-w-lg text-base text-muted md:text-lg">
                Os combos especiais reúnem camiseta oficial, álbum da Copa do Mundo FIFA 2026™ e envelopes
                de figurinhas para você viver a experiência completa desde o primeiro dia.
                <br />
                <br />
                Vista a paixão pelo futebol e comece com grande estilo. Para quem quer entrar no clima da
                maior Copa da história com muito mais emoção.
              </p>
              <Link
                href="/camisetas"
                className="btn-secondary mt-8 inline-flex"
              >
                Só camisa Brasil <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="min-w-0">
              <PacotesOfertasSlider pacotes={figurinhasRandom} />
            </div>
          </div>
        </div>
      </section>

      <section
        id="pacotes-figurinhas-atualizado"
        className="border-b border-border bg-gradient-to-b from-brand-green/8 via-transparent to-brand-yellow/6"
      >
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-24">
          <SectionHeading
            eyebrow="Linha atualizada · Neymar Jr."
            title="Combos com figurinhas atualizadas"
            description="Pacotes renovados da coleção FIFA World Cup 2026™ (7 cromos cada, a partir de R$ 7,00 avulso). Monte com álbum e camisa oficial do Brasil."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {figurinhasAtualizado.map((produto) => (
              <ProductCard key={produto.id} produto={produto} />
            ))}
          </div>
        </div>
      </section>

      <section id="pacotes-figurinhas" className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-24">
        <SectionHeading
          eyebrow="Figurinhas Copa 2026™"
          title="Camisa + álbum + 12, 24 ou 50 pacotes de figurinha"
          description="Escolha a edição do álbum Panini oficial (cartão até ouro premium) e a quantidade de envelopes de figurinhas no mesmo pedido que a camisa."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {figurinhasShuffled.map((produto) => (
            <ProductCard key={produto.id} produto={produto} />
          ))}
        </div>
      </section>

      <section id="pacotes-adrenalyn" className="border-y border-border bg-surface/20">
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-24">
          <SectionHeading
            eyebrow="Adrenalyn XL™"
            title="Camisa + álbum prata ou capa dura + 12, 24 ou 30 Adrenalyn"
            description="Para quem quer também a linha de cartas oficial Adrenalyn XL™ FIFA World Cup 2026™: mesma camisa e álbum de figurinhas, com volume de envelopes de cards escolhido."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {adrenalyn.map((produto) => (
              <ProductCard key={produto.id} produto={produto} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-surface/25">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-8 px-4 py-16 md:flex-row md:items-center md:justify-between md:px-8 md:py-20">
          <div>
            <h2 className="font-display text-3xl tracking-tight md:text-4xl">
              Precisa só do álbum ou das camisas?
            </h2>
            <p className="mt-2 max-w-xl text-muted">
              As promoções exigem tamanho da camisa no carrinho. Figurinhas e Adrenalyn avulsos seguem na página do álbum.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/album" className="btn-secondary">
              Ver álbum Panini
            </Link>
            <Link href="/camisetas" className="btn-primary">
              Ver camisetas
            </Link>
          </div>
        </div>
      </section>

      <PacotesLojistasSection />
    </>
  );
}
