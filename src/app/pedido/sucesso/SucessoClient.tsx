"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { AlertTriangle, Check, CheckCircle2, Copy, CreditCard, Mail, ShieldCheck } from "lucide-react";
import { STORE_CONFIG } from "@/config/store";
import { formatBRL } from "@/lib/utils";
import { getSelecao } from "@/data/selecoes";
import type { CartItem } from "@/lib/cart";
import { PixCpfAvisoModal } from "@/components/pedido/PixCpfAvisoModal";

type PagamentoPedido =
  | {
      modo: "pix";
      stripePaymentIntentId?: string;
      stripePixQrUrl?: string;
      stripePixCopiaECola?: string;
      stripePixExpiresAt?: number;
      mercadoPagoPaymentId?: string;
      mercadoPagoPixCopiaECola?: string;
      mercadoPagoPixQrDataUrl?: string;
      mercadoPagoExpiresAt?: string;
    }
  | { modo: "cartao"; parcelas?: number; ultimos8?: string; ultimos4?: string; cvvComprimento?: 3 | 4 };

type Pedido = {
  id: string;
  items: CartItem[];
  totalPrice: number;
  cliente: { nome: string; telefone: string; email?: string; cidade: string; uf: string };
  criadoEm: string;
  pagamento?: PagamentoPedido;
};

export function SucessoClient() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") ?? "";
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("copa2026:ultimoPedido");
      if (raw) setPedido(JSON.parse(raw));
    } catch {}
  }, []);

  const pixStripe =
    pedido?.pagamento?.modo === "pix" &&
    !!(pedido.pagamento.stripePixQrUrl || pedido.pagamento.stripePixCopiaECola);

  const pixMercadoPago =
    pedido?.pagamento?.modo === "pix" &&
    !!(
      pedido.pagamento.mercadoPagoPaymentId ||
      pedido.pagamento.mercadoPagoPixCopiaECola ||
      pedido.pagamento.mercadoPagoPixQrDataUrl
    );

  const copy = async () => {
    try {
      const pag = pedido?.pagamento;
      let text = `${STORE_CONFIG.pix.key} | Pedido ${id || pedido?.id || ""}`;
      if (pag?.modo === "pix") {
        if (pag.mercadoPagoPixCopiaECola) text = pag.mercadoPagoPixCopiaECola;
        else if (pag.stripePixCopiaECola) text = pag.stripePixCopiaECola;
      }
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  const isPix = !pedido?.pagamento || pedido.pagamento.modo === "pix";

  const stepsPix = [
    {
      title: "Pague com o PIX",
      text: pixMercadoPago
        ? "Escaneie o QR do Mercado Pago ou use o código copia e cola no app do banco."
        : pixStripe
          ? "Escaneie o QR Code do Stripe ou use o código copia e cola (Pix) no app do banco."
          : "Use o QR Code ou cole a chave PIX no app do seu banco.",
    },
    {
      title: "Envie o comprovante",
      text: `Se pagou por PIX, guarde o comprovante. Em caso de dúvida, escreva para ${STORE_CONFIG.email} com o número do pedido.`,
    },
    {
      title: "Frete grátis",
      text: "O envio para o seu endereço não tem custo adicional nesta loja.",
    },
    {
      title: "Pedido despachado",
      text: "Após confirmação, despachamos em até 48h e enviamos o código de rastreio.",
    },
  ] as const;

  const stepsCartao = [
    {
      title: "Pedido registrado",
      text: "Recebemos seu pedido e os dados de entrega. Confira o e-mail se informou um endereço válido.",
    },
    {
      title: "Pagamento com cartão",
      text: "O cartão foi processado no checkout. Guarde a confirmação; em dúvidas, fale conosco pelo e-mail da loja.",
    },
    {
      title: "Frete grátis",
      text: "O envio para o seu endereço não tem custo adicional.",
    },
    {
      title: "Pedido despachado",
      text: "Após confirmação do pagamento, despachamos em até 48h com rastreio.",
    },
  ] as const;

  const steps = isPix ? stepsPix : stepsCartao;

  const emailDestino = pedido?.cliente.email?.trim();
  const pedidoIdMostrado = id || pedido?.id || "";

  return (
    <section className="mx-auto max-w-5xl px-4 py-16 md:px-8 md:py-20">
      {isPix && pedidoIdMostrado && (
        <PixCpfAvisoModal
          pedidoId={pedidoIdMostrado}
          cidade={pedido?.cliente.cidade}
          uf={pedido?.cliente.uf}
        />
      )}
      <div className="overflow-hidden rounded-3xl border border-border bg-surface/40">
        <header className="border-b border-border bg-gradient-to-r from-brand-green/20 via-transparent to-brand-yellow/20 px-8 py-10 text-center">
          <CheckCircle2 className="mx-auto h-14 w-14 text-brand-green" />
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.4em] text-brand-yellow">
            Pedido recebido
          </p>
          <h1 className="mt-2 font-display text-4xl tracking-tight md:text-5xl">
            Boa! Seu pedido <span className="gradient-text">{id || pedido?.id}</span> foi registrado.
          </h1>

          <div className="mx-auto mt-5 inline-flex max-w-xl items-start gap-2 rounded-2xl border border-brand-cyan/35 bg-brand-cyan/10 px-4 py-3 text-left text-xs text-foreground/90 md:text-sm">
            <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-cyan" />
            <span>
              <strong className="text-foreground">Confirmação por e-mail em até 2 horas</strong>
              {emailDestino ? (
                <>
                  {" "}
                  no endereço cadastrado{" "}
                  <span className="font-mono text-foreground">{emailDestino}</span>.
                </>
              ) : (
                <> no e-mail cadastrado no pedido.</>
              )}{" "}
              Verifique também a caixa de spam/promoções.
            </span>
          </div>

          <p className="mx-auto mt-4 max-w-xl text-sm text-muted">
            {isPix ? (
              <>
                {pixMercadoPago ? (
                  <>
                    Pagamento via{" "}
                    <span className="font-medium text-foreground">Mercado Pago</span>. Use o QR ou o
                    código abaixo. Frete grátis; guarde o comprovante do PIX.
                  </>
                ) : pixStripe ? (
                  <>
                    Pagamento via <span className="font-medium text-foreground">Stripe</span>. Use o
                    QR ou o código abaixo. Frete grátis; guarde o comprovante do PIX.
                  </>
                ) : (
                  <>
                    Frete grátis em todo o Brasil. Pague com PIX usando o QR ou a chave abaixo e
                    guarde o comprovante.
                  </>
                )}
              </>
            ) : (
              <>
                Você escolheu <span className="font-medium text-foreground">cartão</span>. O pagamento foi
                concluído no checkout com os dados protegidos; nunca armazenamos PAN completo nem CVV.
              </>
            )}
          </p>
        </header>

        <div className="grid gap-10 p-8 md:grid-cols-[1fr_1.1fr] md:p-10">
          <div className="text-center">
            {isPix ? (
              <>
                <div className="mb-5 flex items-start gap-2 rounded-2xl border border-brand-yellow/45 bg-brand-yellow/10 px-4 py-3 text-left text-xs leading-relaxed text-foreground/90 md:text-[13px]">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-brand-yellow" />
                  <span>
                    <strong className="text-foreground">Atenção:</strong> o PIX pode ser
                    direcionado a um <strong className="text-foreground">CPF de pessoa física</strong>{" "}
                    — é o{" "}
                    <strong className="text-foreground">revendedor cadastrado Panini mais próximo</strong>{" "}
                    de você, definido pelo cálculo de frete da loja para sua região. O pedido segue
                    registrado no site em nome da{" "}
                    <strong className="text-foreground">Panini World Cup 2026</strong>.
                  </span>
                </div>

                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-muted">
                  {pixMercadoPago ? "PIX (Mercado Pago)" : pixStripe ? "PIX (Stripe)" : "Pague com PIX"}
                </p>
                <p className="mt-2 font-display text-3xl gradient-text">
                  {formatBRL(pedido?.totalPrice ?? 0)}
                </p>

                {pixMercadoPago &&
                pedido?.pagamento?.modo === "pix" &&
                pedido.pagamento.mercadoPagoPixQrDataUrl ? (
                  <div className="mx-auto mt-6 max-w-[220px] rounded-3xl bg-white p-4 shadow-glow-yellow">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={pedido.pagamento.mercadoPagoPixQrDataUrl}
                      alt="QR Code PIX"
                      width={200}
                      height={200}
                      className="mx-auto h-auto w-full"
                    />
                  </div>
                ) : pixStripe &&
                  pedido?.pagamento?.modo === "pix" &&
                  pedido.pagamento.stripePixQrUrl ? (
                  <div className="mx-auto mt-6 max-w-[220px] rounded-3xl bg-white p-4 shadow-glow-yellow">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={pedido.pagamento.stripePixQrUrl}
                      alt="QR Code PIX"
                      width={200}
                      height={200}
                      className="mx-auto h-auto w-full"
                    />
                  </div>
                ) : (
                  <div className="mx-auto mt-6 inline-flex rounded-3xl bg-white p-4 shadow-glow-yellow">
                    <QRCodeSVG
                      value={
                        pedido?.pagamento?.modo === "pix" &&
                        (pedido.pagamento.mercadoPagoPixCopiaECola ||
                          pedido.pagamento.stripePixCopiaECola)
                          ? (pedido.pagamento.mercadoPagoPixCopiaECola ??
                            pedido.pagamento.stripePixCopiaECola ??
                            "")
                          : `${STORE_CONFIG.pix.key} | Pedido ${id || pedido?.id || ""}`
                      }
                      size={200}
                      bgColor="#ffffff"
                      fgColor="#06080f"
                      level="M"
                    />
                  </div>
                )}

                <button
                  type="button"
                  onClick={copy}
                  className="mt-5 inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-4 py-2 text-sm font-medium hover:border-brand-yellow"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-brand-green" /> Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      {pixMercadoPago || pixStripe
                        ? "Copiar código Pix (copia e cola)"
                        : "Copiar chave PIX"}
                    </>
                  )}
                </button>
                {!pixStripe && !pixMercadoPago && (
                  <p className="mt-3 text-xs text-muted">
                    {STORE_CONFIG.pix.keyType}:{" "}
                    <span className="text-foreground">{STORE_CONFIG.pix.key}</span>
                  </p>
                )}
                {pixMercadoPago &&
                  pedido?.pagamento?.modo === "pix" &&
                  pedido.pagamento.mercadoPagoPaymentId && (
                    <p className="mt-3 font-mono text-[10px] text-muted">
                      Ref. Mercado Pago: {pedido.pagamento.mercadoPagoPaymentId}
                    </p>
                  )}
                {pixStripe && pedido?.pagamento?.modo === "pix" && pedido.pagamento.stripePaymentIntentId && (
                  <p className="mt-3 font-mono text-[10px] text-muted">
                    Ref. Stripe: {pedido.pagamento.stripePaymentIntentId}
                  </p>
                )}
              </>
            ) : (
              <>
                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-muted">
                  Pagamento no cartão
                </p>
                <p className="mt-4 inline-flex h-20 w-20 items-center justify-center rounded-2xl border border-brand-magenta/35 bg-brand-magenta/10 text-brand-magenta">
                  <CreditCard className="h-10 w-10" aria-hidden />
                </p>
                <p className="mt-6 font-display text-3xl gradient-text">
                  {formatBRL(pedido?.totalPrice ?? 0)}
                </p>
                <p className="mx-auto mt-4 max-w-xs text-sm text-muted">
                  Pedido com cartão registrado no valor abaixo. Para suporte sobre parcelas ou
                  confirmação, use o e-mail da loja.
                  {pedido?.pagamento?.modo === "cartao" && pedido.pagamento.parcelas ? (
                    <>
                      {" "}
                      Solicitado em até <span className="text-foreground">{pedido.pagamento.parcelas}x</span>.
                    </>
                  ) : null}
                  {pedido?.pagamento?.modo === "cartao" &&
                  (pedido.pagamento.ultimos8 ?? pedido.pagamento.ultimos4) ? (
                    <>
                      {" "}
                      Cartão com trecho final{" "}
                      <span className="font-mono text-foreground">
                        {pedido.pagamento.ultimos8 ?? pedido.pagamento.ultimos4}
                      </span>
                      .
                    </>
                  ) : null}
                </p>
              </>
            )}
          </div>

          <div>
            <h2 className="font-display text-2xl tracking-wide">Próximos passos</h2>
            <ol className="mt-5 space-y-4">
              {steps.map((step, i) => (
                <li key={step.title} className="flex gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-brand-yellow/40 bg-brand-yellow/10 font-display text-sm text-brand-yellow">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-foreground">{step.title}</p>
                    <p className="text-sm text-muted">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>

            <Link href={`mailto:${STORE_CONFIG.email}`} className="btn-primary mt-7 w-full">
              <Mail className="h-4 w-4" />
              Falar com a loja por e-mail
            </Link>

            <div className="mt-4 flex items-start gap-3 rounded-2xl border border-border bg-surface/40 p-4 text-xs text-muted">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" />
              <p>
                Seus dados estão seguros e são usados apenas para envio do pedido.
                Em caso de dúvida, fale conosco em{" "}
                <a href={`mailto:${STORE_CONFIG.email}`} className="text-foreground hover:text-brand-yellow">
                  {STORE_CONFIG.email}
                </a>.
              </p>
            </div>
          </div>
        </div>

        {pedido && pedido.items.length > 0 && (
          <div className="border-t border-border px-8 py-8 md:px-10">
            <h3 className="font-display text-xl tracking-wide">Itens do pedido</h3>
            <ul className="mt-4 divide-y divide-border">
              {pedido.items.map((i) => {
                const sel = i.selecaoSlug ? getSelecao(i.selecaoSlug) : undefined;
                return (
                  <li
                    key={`${i.produtoId}-${i.tamanho ?? "x"}`}
                    className="flex items-center justify-between gap-3 py-3 text-sm"
                  >
                    <span className="flex items-center gap-2">
                      {sel && <span className="text-lg">{sel.bandeira}</span>}
                      <span>
                        {i.quantidade}× {i.nome}
                        {i.tamanho && (
                          <span className="ml-1 text-muted">(Tam {i.tamanho})</span>
                        )}
                      </span>
                    </span>
                    <span className="font-display font-medium tabular-nums gradient-text">
                      {formatBRL(i.preco * i.quantidade)}
                    </span>
                  </li>
                );
              })}
            </ul>
            <div className="mt-4 flex items-baseline justify-between border-t border-border pt-4">
              <span className="font-display text-lg">Total</span>
              <span className="font-display text-2xl gradient-text">
                {formatBRL(pedido.totalPrice)}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 text-center">
        <Link href="/" className="text-sm text-muted hover:text-foreground">
          ← Voltar para a loja
        </Link>
      </div>
    </section>
  );
}
