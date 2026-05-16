import { Store } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { produtosLojistasCaixas } from "@/data/produtos";
import { LojistaCaixaCard } from "@/components/LojistaCaixaCard";

const IMG_1000_A = "/images/lojistas/caixa-1000-envelopes-1.png";
const IMG_1000_B = "/images/lojistas/caixa-1000-envelopes-2.png";
const IMG_100 = "/images/lojistas/caixa-100-envelopes.png";

export function PacotesLojistasSection() {
  const [caixa1000, caixa100] = produtosLojistasCaixas();
  if (!caixa1000 || !caixa100) return null;

  return (
    <section id="lojistas" className="border-t border-border bg-surface/15">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-cyan/40 bg-brand-cyan/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-brand-cyan">
            <Store className="h-3.5 w-3.5" />
            Atacado
          </span>
        </div>

        <SectionHeading
          className="mt-6"
          eyebrow="Lojistas"
          title="Caixas fechadas Panini"
          description="Ofertas em volume para revenda: caixa com 1000 envelopes ou 100 envelopes de figurinhas oficiais FIFA World Cup 2026™ (7 cromos por envelope). Preços de tabela para lojistas."
        />

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <LojistaCaixaCard
            produto={caixa1000}
            imageSrc={IMG_1000_A}
            caption="Referência visual — caixa 1000"
          />
          <LojistaCaixaCard
            produto={caixa1000}
            imageSrc={IMG_1000_B}
            caption="Outro ângulo — mesmo SKU 1000 envelopes"
          />
          <LojistaCaixaCard produto={caixa100} imageSrc={IMG_100} />
        </div>
      </div>
    </section>
  );
}
