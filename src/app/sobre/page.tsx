import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Truck, ShieldCheck, RefreshCcw, CreditCard, Mail, Gift } from "lucide-react";
import { STORE_CONFIG } from "@/config/store";
import { PaniniFaqAccordion } from "@/components/PaniniEditorial";

export const metadata: Metadata = {
  title: "Sobre a loja, frete, pagamentos e trocas",
  description:
    "Tudo o que você precisa saber sobre a Copa 2026 Store: como compramos, prazos de entrega, formas de pagamento e política de trocas.",
};

type SobreSection = {
  id: string;
  icon: typeof ShieldCheck;
  title: string;
  body?: string;
  paragraphs?: string[];
};

const SECTIONS: SobreSection[] = [
  {
    id: "loja",
    icon: ShieldCheck,
    title: "Quem somos",
    paragraphs: [
      "Somos a Panini Brasil em parceria com a FIFA World Cup 2026™. Trazemos a linha oficial da Copa com álbuns, envelopes, combos, boxes e cartas Adrenalyn XL™, além de camisetas premium inspiradas nas maiores seleções do mundo. ⚽🏆",
      "Nossa missão é levar a emoção da Copa para colecionadores e fãs que vivem o futebol dentro e fora dos estádios.",
    ],
  },
  {
    id: "pagamentos",
    icon: CreditCard,
    title: "Formas de pagamento",
    body:
      "No momento aceitamos pagamento via PIX. Após a finalização do pedido, você recebe QR Code e chave PIX para pagar direto do seu app. Assim que cair, o seu pedido entra no “placar” para produção e envio.",
  },
  {
    id: "pix-revendedor",
    icon: CreditCard,
    title: "PIX em nome de CPF — por quê?",
    body:
      "É o revendedor cadastrado Panini mais próximo de você, definido pelo cálculo de frete da loja para sua região. O pedido segue registrado no site em nome da Panini World Cup 2026.",
  },
  {
    id: "frete",
    icon: Truck,
    title: "Frete e prazos",
    body:
      "Enviamos para todo o Brasil pelos Correios e transportadoras parceiras com frete grátis. Informe CEP e endereço no checkout. Despachamos em até 48h úteis após o pagamento confirmado.",
  },
  {
    id: "trocas",
    icon: RefreshCcw,
    title: "Trocas e devoluções",
    body:
      "Você tem 7 dias corridos após o recebimento para solicitar troca ou devolução (conforme o CDC). Para camisetas, pedimos sem uso e com etiqueta original. Álbuns e itens lacrados seguem a mesma regra para garantir “jogo justo” pra todo mundo.",
  },
];

export default function SobrePage() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-20" />
      <div className="pointer-events-none absolute -left-28 top-0 h-72 w-72 rounded-full bg-brand-green/20 blur-[120px]" />
      <div className="pointer-events-none absolute -right-24 top-32 h-80 w-80 rounded-full bg-brand-yellow/15 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-brand-cyan/10 blur-[170px]" />

      <div className="relative mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-20">
        <div className="rounded-[2rem] border border-border bg-surface/25 p-8 backdrop-blur md:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-brand-yellow">
            FAQ · Brasil & futebol
          </p>
          <h1 className="mt-3 font-display text-5xl leading-[0.95] tracking-tight md:text-6xl">
            Perguntas que viram <span className="gradient-text">gol</span>.
          </h1>
          <p className="mt-5 max-w-2xl text-muted">
            Respostas rápidas sobre compra, pagamento, frete e trocas — pra você entrar em campo com
            tranquilidade e fechar o kit do jeito certo.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div className="space-y-4">
            {SECTIONS.map((s, idx) => {
              const Icon = s.icon;
              return (
                <details
                  key={s.id}
                  id={s.id}
                  open={idx === 0}
                  className="group rounded-3xl border border-border/80 bg-background-elev/40 p-0 transition-colors"
                >
                  <summary className="cursor-pointer list-none px-6 py-5">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-brand-yellow/35 bg-brand-yellow/10 text-brand-yellow">
                          <Icon className="h-5 w-5" />
                        </span>
                        <h2 className="font-display text-2xl tracking-wide">{s.title}</h2>
                      </div>
                      <span className="text-muted text-sm font-semibold transition-transform group-open:rotate-45">
                        +
                      </span>
                    </div>
                  </summary>
                  <div className="space-y-3 px-6 pb-6 pt-1">
                    {s.paragraphs ? (
                      s.paragraphs.map((paragraph) => (
                        <p key={paragraph.slice(0, 24)} className="text-base leading-relaxed text-muted">
                          {paragraph}
                        </p>
                      ))
                    ) : (
                      <p className="text-base leading-relaxed text-muted">{s.body}</p>
                    )}
                  </div>
                </details>
              );
            })}
          </div>

          <aside className="rounded-[2rem] border border-border bg-surface/35 p-6 md:p-8">
            <h3 className="font-display text-3xl tracking-tight">Placar final</h3>
            <p className="mt-3 text-muted">
              Frete grátis para compras nesta loja. Suporte oficial:{" "}
              <a href={`mailto:${STORE_CONFIG.email}`} className="text-brand-yellow hover:underline">
                {STORE_CONFIG.email}
              </a>
            </p>
            <div className="mt-6 space-y-3">
              <Link href={`mailto:${STORE_CONFIG.email}`} className="btn-primary w-full justify-center">
                <Mail className="h-4 w-4" /> Enviar e-mail
              </Link>
              <Link
                href={STORE_CONFIG.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary w-full justify-center"
              >
                Instagram
              </Link>
            </div>

            <div className="mt-6 rounded-2xl border border-border/70 bg-background-elev/30 p-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-yellow">
                Dica rápida
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Para camisetas, confira tamanhos antes de finalizar. Para figurinhas/álbuns, mantenha itens
                lacrados para evitar qualquer problema no retorno.
              </p>
            </div>
          </aside>
        </div>

        <div
          id="promocao"
          className="mt-10 scroll-mt-24 rounded-[2rem] border-2 border-brand-yellow/40 bg-gradient-to-br from-brand-yellow/5 via-background-elev/60 to-brand-green/5 p-8 md:p-10"
        >
          <div className="flex flex-col gap-8 md:flex-row md:items-center">
            <div className="flex-1 space-y-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-brand-yellow/30 bg-brand-yellow/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-brand-yellow">
                <Gift className="h-3.5 w-3.5" /> Promoção ativa
              </span>
              <h2 className="font-display text-4xl tracking-tight md:text-5xl">
                Concorra a uma viagem para a <span className="gradient-text">Final da Copa 2026</span>
              </h2>
              <p className="text-base leading-relaxed text-muted">
                <strong className="text-foreground">Todo pedido finalizado</strong> na loja entra
                automaticamente no sorteio de um pacote completo para assistir à grande final do FIFA
                World Cup 2026™ — sem valor mínimo e sem cadastro extra.
              </p>

              <div className="rounded-2xl border border-brand-green/25 bg-brand-green/5 p-5">
                <p className="mb-3 text-sm font-bold uppercase tracking-widest text-brand-green">
                  O que você ganha
                </p>
                <ul className="space-y-2.5 text-sm text-muted">
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 inline-block h-2 w-2 shrink-0 rounded-full bg-brand-green" />
                    <span><strong className="text-foreground">2 passagens aéreas</strong> ida e volta para a cidade da final</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 inline-block h-2 w-2 shrink-0 rounded-full bg-brand-green" />
                    <span><strong className="text-foreground">Hospedagem inclusa</strong> — hotel durante os dias do evento</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 inline-block h-2 w-2 shrink-0 rounded-full bg-brand-green" />
                    <span><strong className="text-foreground">2 ingressos</strong> para assistir à final da Copa do Mundo</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border border-border/70 bg-background-elev/30 p-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-brand-yellow">
                  Como participar
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  Finalize qualquer compra na nossa loja e pronto — você já está concorrendo. Cada
                  pedido gera uma participação no sorteio. Quanto mais pedidos, mais chances.
                </p>
              </div>

              <div className="rounded-2xl border-2 border-brand-yellow/45 bg-brand-yellow/10 p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-brand-yellow">
                  Importante — número do pedido
                </p>
                <p className="mt-2 text-sm leading-relaxed text-foreground/95">
                  Ao finalizar a compra, você recebe um código de pedido (ex.:{" "}
                  <strong className="font-mono text-brand-yellow">C26-XXXXXXXX</strong>).{" "}
                  <strong className="text-foreground">
                    Esse número é o que será usado no sorteio
                  </strong>{" "}
                  — guarde-o ou tire um print da tela de confirmação. Não é necessário cadastro
                  extra além do pedido.
                </p>
              </div>

              <div className="pt-2">
                <Link href="/" className="btn-primary inline-flex items-center justify-center">
                  Comprar e concorrer
                </Link>
              </div>
            </div>

            <div className="w-full shrink-0 md:w-[340px]">
              <div className="overflow-hidden rounded-2xl border border-brand-yellow/25 shadow-lg">
                <Image
                  src="/images/promo-final-modal.png"
                  alt="Banner da promoção final da Copa 2026"
                  width={680}
                  height={453}
                  className="h-auto w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 rounded-3xl border border-border bg-surface/30 p-6 md:p-8">
          <PaniniFaqAccordion />
        </div>
      </div>
    </section>
  );
}
