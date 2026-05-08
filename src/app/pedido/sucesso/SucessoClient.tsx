"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Check, CheckCircle2, Copy, MessageCircle, ShieldCheck } from "lucide-react";
import { STORE_CONFIG } from "@/config/store";
import { formatBRL } from "@/lib/utils";
import { getSelecao } from "@/data/selecoes";
import type { CartItem } from "@/lib/cart";

type Pedido = {
  id: string;
  items: CartItem[];
  totalPrice: number;
  cliente: { nome: string; telefone: string; email?: string; cidade: string; uf: string };
  criadoEm: string;
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

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(STORE_CONFIG.pix.key);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  const wppHref = pedido
    ? `https://wa.me/${STORE_CONFIG.whatsapp}?text=${encodeURIComponent(
        `Olá! Acabei de fazer o pedido ${pedido.id} no site e gostaria de combinar o pagamento e o frete.`,
      )}`
    : `https://wa.me/${STORE_CONFIG.whatsapp}`;

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
            Em alguns segundos abriremos o WhatsApp para acertarmos o frete e te enviarmos o
            comprovante. Enquanto isso, você já pode adiantar o pagamento via PIX abaixo.
          </p>
        </header>

        <div className="grid gap-10 p-8 md:grid-cols-[1fr_1.1fr] md:p-10">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-muted">
              Pague com PIX
            </p>
            <p className="mt-2 font-display text-3xl gradient-text">
              {formatBRL(pedido?.totalPrice ?? 0)}
            </p>

            <div className="mx-auto mt-6 inline-flex rounded-3xl bg-white p-4 shadow-glow-yellow">
              <QRCodeSVG
                value={`${STORE_CONFIG.pix.key} | Pedido ${id || pedido?.id || ""}`}
                size={200}
                bgColor="#ffffff"
                fgColor="#06080f"
                level="M"
              />
            </div>

            <button
              type="button"
              onClick={copy}
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-4 py-2 text-sm font-medium hover:border-brand-yellow"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-brand-green" /> Copiada!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" /> Copiar chave PIX
                </>
              )}
            </button>
            <p className="mt-3 text-xs text-muted">
              {STORE_CONFIG.pix.keyType}: <span className="text-foreground">{STORE_CONFIG.pix.key}</span>
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl tracking-wide">Próximos passos</h2>
            <ol className="mt-5 space-y-4">
              {[
                {
                  title: "Pague com o PIX",
                  text: "Use o QR Code ou cole a chave PIX no app do seu banco.",
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
              ].map((step, i) => (
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
              Abrir WhatsApp para enviar comprovante
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
