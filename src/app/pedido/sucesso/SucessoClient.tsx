"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Check, CheckCircle2, Copy, CreditCard, MessageCircle, ShieldCheck } from "lucide-react";
import { STORE_CONFIG } from "@/config/store";
import { formatBRL } from "@/lib/utils";
import { getSelecao } from "@/data/selecoes";
import type { CartItem } from "@/lib/cart";

type PagamentoPedido =
  | {
      modo: "pix";
      stripePaymentIntentId?: string;
      stripePixQrUrl?: string;
      stripePixCopiaECola?: string;
      stripePixExpiresAt?: number;
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

  const copy = async () => {
    try {
      const text =
        pedido?.pagamento?.modo === "pix" && pedido.pagamento.stripePixCopiaECola
          ? pedido.pagamento.stripePixCopiaECola
          : `${STORE_CONFIG.pix.key} | Pedido ${id || pedido?.id || ""}`;
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  const isPix = !pedido?.pagamento || pedido.pagamento.modo === "pix";

  const wppHref = pedido
    ? `https://wa.me/${STORE_CONFIG.whatsapp}?text=${encodeURIComponent(
        isPix
          ? `Olá! Acabei de fazer o pedido ${pedido.id} no site e gostaria de combinar o pagamento e o frete.`
          : `Olá! Pedido ${pedido.id} — escolhi pagar com cartão. Quero finalizar o pagamento e o frete com vocês.`,
      )}`
    : `https://wa.me/${STORE_CONFIG.whatsapp}`;

  const stepsPix = [
    {
      title: "Pague com o PIX",
      text: pixStripe
        ? "Escaneie o QR Code do Stripe ou use o código copia e cola (Pix) no app do banco."
        : "Use o QR Code ou cole a chave PIX no app do seu banco.",
    },
    {
      title: "Envie o comprovante",
      text: "Mande o comprovante para nós no WhatsApp junto do número do pedido.",
    },
    {
      title: "Frete combinado",
      text: "Calculamos o frete pelo seu CEP e te enviamos o valor final.",
    },
    {
      title: "Pedido despachado",
      text: "Após confirmação, despachamos em até 48h e enviamos o código de rastreio.",
    },
  ] as const;

  const stepsCartao = [
    {
      title: "Fale com a loja no WhatsApp",
      text: "Confirmamos os dados do pedido, parcelas e forma segura de pagamento com cartão.",
    },
    {
      title: "Finalize o cartão com segurança",
      text: "Enviamos link ou instruções conforme a operadora — nunca peça senha do cartão fora do fluxo oficial.",
    },
    {
      title: "Frete combinado",
      text: "Calculamos o frete pelo seu CEP e fechamos o valor total.",
    },
    {
      title: "Pedido despachado",
      text: "Após confirmação do pagamento, despachamos em até 48h com rastreio.",
    },
  ] as const;

  const steps = isPix ? stepsPix : stepsCartao;

  return (
    <section className="mx-auto max-w-5xl px-4 py-16 md:px-8 md:py-20">
      <div className="overflow-hidden rounded-3xl border border-border bg-surface/40">
        <header className="border-b border-border bg-gradient-to-r from-brand-green/20 via-transparent to-brand-yellow/20 px-8 py-10 text-center">
          <CheckCircle2 className="mx-auto h-14 w-14 text-brand-green" />
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.4em] text-brand-yellow">
            Pedido recebido
          </p>
          <h1 className="mt-2 font-display text-4xl tracking-tight md:text-5xl">
            Boa! Seu pedido <span className="gradient-text">{id || pedido?.id}</span> foi registrado.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm text-muted">
            {isPix ? (
              <>
                {pixStripe ? (
                  <>
                    Pagamento via <span className="font-medium text-foreground">Stripe</span>. Use o
                    QR ou o código abaixo. Também abrimos o WhatsApp para acertar frete e enviar o
                    comprovante.
                  </>
                ) : (
                  <>
                    Em alguns segundos abrimos o WhatsApp para acertarmos o frete e o comprovante.
                    Enquanto isso, você já pode pagar com PIX abaixo.
                  </>
                )}
              </>
            ) : (
              <>
                Você escolheu <span className="font-medium text-foreground">cartão</span>. Abrimos o
                WhatsApp para concluir o pagamento com segurança — não enviamos dados sensíveis pelo
                chat.
              </>
            )}
          </p>
        </header>

        <div className="grid gap-10 p-8 md:grid-cols-[1fr_1.1fr] md:p-10">
          <div className="text-center">
            {isPix ? (
              <>
                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-muted">
                  {pixStripe ? "PIX (Stripe)" : "Pague com PIX"}
                </p>
                <p className="mt-2 font-display text-3xl gradient-text">
                  {formatBRL(pedido?.totalPrice ?? 0)}
                </p>

                {pixStripe && pedido?.pagamento?.modo === "pix" && pedido.pagamento.stripePixQrUrl ? (
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
                      value={`${STORE_CONFIG.pix.key} | Pedido ${id || pedido?.id || ""}`}
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
                      {pixStripe ? "Copiar código Pix (copia e cola)" : "Copiar chave PIX"}
                    </>
                  )}
                </button>
                {!pixStripe && (
                  <p className="mt-3 text-xs text-muted">
                    {STORE_CONFIG.pix.keyType}:{" "}
                    <span className="text-foreground">{STORE_CONFIG.pix.key}</span>
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
                  Pedido com cartão: siga no WhatsApp para fechar parcelas e receber o link ou maquininha
                  conforme combinarmos.
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

            <Link href={wppHref} target="_blank" className="btn-primary mt-7 w-full">
              <MessageCircle className="h-4 w-4" />
              {isPix ? "Abrir WhatsApp para enviar comprovante" : "Abrir WhatsApp — finalizar cartão"}
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
                    <span className="font-medium tabular-nums">
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
