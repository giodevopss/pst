import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Truck, ShieldCheck, RefreshCcw, CreditCard, Mail, Gift } from "lucide-react";
import { STORE_CONFIG } from "@/config/store";
import { PaniniFaqAccordion } from "@/components/PaniniEditorial";

export const metadata: Metadata = {
  title: "Sobre a loja, frete, pagamentos e trocas",
  description:
    "Tudo o que você precisa saber sobre a Copa 2026 Store: como compramos, prazos de entrega, formas de pagamento e política de trocas.",
};

const SECTIONS = [
  {
    id: "loja",
    icon: ShieldCheck,
    title: "Quem somos",
    body:
      "Somos uma loja brasileira de colecionáveis com energia de estádio. Trabalhamos em parceria com a Panini Brasil para trazer a linha oficial FIFA World Cup 2026™ (álbum, envelopes, combos, boxes e Adrenalyn XL™) e também camisas premium inspiradas na Copa (ex.: Brasil). Para checar titularidade e catálogo completo, consulte também o site oficial da marca.",
  },
  {
    id: "pagamentos",
    icon: CreditCard,
    title: "Formas de pagamento",
    body:
      "No momento aceitamos pagamento via PIX. Após a finalização do pedido, você recebe QR Code e chave PIX para pagar direto do seu app. Assim que cair, o seu pedido entra no “placar” para produção e envio.",
  },
  {
    id: "frete",
    icon: Truck,
    title: "Frete e prazos",
    body:
      "Enviamos para todo o Brasil pelos Correios e transportadoras parceiras. O frete é calculado pelo seu CEP e combinado no WhatsApp logo após a confirmação do pedido. Despachamos em até 48h úteis após o pagamento confirmado.",
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
  const wppHref = `https://wa.me/${STORE_CONFIG.whatsapp}`;

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
                  <div className="px-6 pb-6 pt-1">
                    <p className="text-base leading-relaxed text-muted">{s.body}</p>
                  </div>
                </details>
              );
            })}
          </div>

          <aside className="rounded-[2rem] border border-border bg-surface/35 p-6 md:p-8">
            <h3 className="font-display text-3xl tracking-tight">Placar final</h3>
            <p className="mt-3 text-muted">
              Se quiser acelerar, chame no WhatsApp para confirmarmos o melhor caminho do seu pedido e
              o frete do seu CEP.
            </p>
            <div className="mt-6 space-y-3">
              <Link href={wppHref} target="_blank" className="btn-primary w-full justify-center">
                <MessageCircle className="h-4 w-4" /> Falar no WhatsApp
              </Link>
              <Link href={`mailto:${STORE_CONFIG.email}`} className="btn-secondary w-full justify-center">
                <Mail className="h-4 w-4" /> Enviar e-mail
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
                Em compras acima de <strong className="text-foreground">R$&nbsp;500</strong> você
                está automaticamente concorrendo ao sorteio de um pacote completo para assistir à
                grande final do FIFA World Cup 2026™. Sem cadastro extra — basta finalizar o pedido.
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
                  Faça uma compra de R$&nbsp;500 ou mais na nossa loja e pronto — você já está
                  concorrendo. Cada pedido acima desse valor gera uma participação. Quanto mais
                  pedidos, mais chances.
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
