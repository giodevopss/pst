import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { PANINI_FIFA_2026_URL } from "@/config/panini";
import { cn } from "@/lib/utils";

const FAQ = [
  {
    q: "O álbum oficial da Copa do Mundo FIFA 2026™ já está disponível?",
    a: "Sim. A coleção FIFA World Cup 2026™ da Panini inclui álbum avulso, combos com envelopes, boxes especiais e a linha Adrenalyn XL™ — como na categoria oficial em panini.com.br.",
  },
  {
    q: "Quantas figurinhas tem o álbum oficial da Copa do Mundo FIFA 2026™?",
    a: "O álbum oficial reúne 980 cromos, sendo 68 especiais.",
  },
  {
    q: "Quais versões de álbum estão disponíveis?",
    a: "A linha oficial inclui capa cartão, capa dura, capa dura prata e capa dura ouro, além de combos com envelopes e boxes.",
  },
  {
    q: "Quantas figurinhas vêm em cada envelope?",
    a: "Cada envelope oficial da coleção traz 7 cromos.",
  },
  {
    q: "Qual a diferença entre comprar só o álbum e comprar kits ou boxes?",
    a: "O álbum avulso é a porta de entrada clássica. Kits com envelopes ou boxes combinam mais pacotes desde o começo para avançar mais rápido no preenchimento das páginas.",
  },
  {
    q: "Quando e onde será a Copa do Mundo FIFA 2026™?",
    a: "O torneio ocorre de 11 de junho a 19 de julho de 2026, com jogos nos Estados Unidos, México e Canadá — primeira Copa com 48 seleções.",
  },
] as const;

export function PaniniAlbumIntro({ className }: { className?: string }) {
  return (
    <div className={cn("max-w-none space-y-4 text-sm leading-relaxed text-muted md:text-base", className)}>
      <p className="font-medium text-foreground">
        Panini FIFA World Cup 2026™
      </p>
      <p>
        A FIFA e a Panini apresentam o álbum oficial da 2026 FIFA World Cup. Mais do que uma coleção, este
        álbum marca um momento histórico do futebol mundial.
      </p>
      <p>
        Pela primeira vez, a Copa do Mundo contará com 48 seleções disputando o maior torneio do planeta, em
        uma edição inédita realizada em três países: United States, Mexico e Canada. Uma Copa gigantesca,
        multicultural e cheia de histórias que ficarão marcadas para sempre.
      </p>
      <p>
        Cada página do álbum foi criada para eternizar momentos, craques, seleções e emoções de uma edição
        que promete redefinir a história do futebol. Dos estádios lotados aos grandes confrontos, dos jovens
        talentos às lendas do esporte, tudo poderá ser revivido figurinha por figurinha.
      </p>
      <p>
        Além dos álbuns, estarão disponíveis kits especiais com envelopes, boxes completos para quem quer
        começar forte desde o primeiro dia e a coleção de cartas <strong className="text-foreground">Adrenalyn XL™</strong>,
        trazendo os maiores jogadores do mundo em versões colecionáveis e competitivas.
      </p>
      <p>
        Mais do que completar páginas, colecionar a Copa de 2026 será fazer parte da história.
      </p>
      <p>
        Para checar titularidade e catálogo integral, consulte também o site oficial em{" "}
        <Link
          href={PANINI_FIFA_2026_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-cyan no-underline hover:underline"
        >
          panini.com.br — FIFA World Cup 2026™
        </Link>
        .
      </p>
    </div>
  );
}

export function PaniniEditionHighlights({ className }: { className?: string }) {
  return (
    <section className={cn("rounded-3xl border border-border bg-background-elev/60 p-6 md:p-10", className)}>
      <h2 className="font-display text-2xl tracking-wide text-foreground md:text-3xl">
        O que esperar da edição
      </h2>
      <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted md:text-base">
        O álbum foi pensado para registrar uma edição inédita: <strong className="text-foreground">980 cromos</strong>{" "}
        (<strong className="text-foreground">68 especiais</strong>), refletindo a dimensão de uma Copa expandida.
        Formatos combinam entrada acessível (capa cartão), acabamentos capa dura (prata ou ouro) e pacotes maiores —
        combos e boxes para quem já quer turbinar a coleção.
      </p>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted md:text-base">
        Em 2026, os colecionadores terão ainda mais opções para viver essa experiência. São 3 versões
        diferentes do álbum oficial, pensadas para todos os tipos de fãs — desde quem está começando sua
        coleção até os colecionadores mais apaixonados.
      </p>
      <h3 className="mt-8 font-display text-xl text-foreground">Adrenalyn XL™ na mesma categoria</h3>
      <p className="mt-3 max-w-3xl text-sm text-muted md:text-base">
        Além do álbum de figurinhas, a linha oficial inclui starter pack, envelopes com cartas + cupom e lata tipo
        tin — experiência paralela para quem curte o jogo de deck colecionável.
      </p>
    </section>
  );
}

export function PaniniFaqAccordion({ className }: { className?: string }) {
  return (
    <section className={cn("", className)}>
      <h2 className="font-display text-2xl tracking-wide text-foreground md:text-3xl">
        Perguntas frequentes
      </h2>
      <p className="mt-3 max-w-2xl text-sm text-muted">
        Conteúdo alinhado às informações divulgadas pela Panini na categoria oficial FIFA World Cup 2026™.
      </p>
      <dl className="mt-8 space-y-2">
        {FAQ.map((item) => (
          <details
            key={item.q}
            className="group overflow-hidden rounded-2xl border border-border bg-surface/40 transition-colors open:bg-surface/60"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-4 font-display text-lg tracking-wide text-foreground md:px-5 [&::-webkit-details-marker]:hidden">
              <span>{item.q}</span>
              <ChevronDown className="h-5 w-5 shrink-0 text-muted transition group-open:rotate-180 group-open:text-brand-yellow" aria-hidden />
            </summary>
            <dd className="border-t border-border/80 px-4 pb-4 pt-2 text-sm leading-relaxed text-muted md:px-5">
              {item.a}
            </dd>
          </details>
        ))}
      </dl>
    </section>
  );
}
