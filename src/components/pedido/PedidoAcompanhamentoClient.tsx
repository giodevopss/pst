"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  Copy,
  CreditCard,
  Mail,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { STORE_CONFIG } from "@/config/store";
import { formatBRL } from "@/lib/utils";
import { getSelecao } from "@/data/selecoes";
import type { CartItem } from "@/lib/cart";
import type { EtapaPedido, PagamentoPersistidoSeguro, StatusPagamentoPedido } from "@/types/pedido-store";
import type { PublicPedido } from "@/lib/pedido-public";
import { PixCpfAvisoModal } from "@/components/pedido/PixCpfAvisoModal";
import { PromoViagemInformativo } from "@/components/PromoViagemInformativo";
import { readCookie } from "@/lib/attribution";
import { trackMetaPurchase } from "@/lib/meta-pixel-client";
import { normalizeStatusPagamento } from "@/lib/pedido-status";

type PedidoView = {
  id: string;
  items: CartItem[];
  totalPrice: number;
  cliente: {
    nome: string;
    telefone: string;
    email?: string;
    cidade: string;
    uf: string;
  };
  criadoEm: string;
  statusPagamento?: StatusPagamentoPedido;
  etapa?: EtapaPedido;
  pagamento?: PagamentoPersistidoSeguro;
};

function normalizePedidoView(p: PedidoView): PedidoView {
  return {
    ...p,
    statusPagamento: p.statusPagamento ?? "pendente",
    etapa: p.etapa ?? "pedido_feito",
  };
}

type Props = {
  orderId?: string;
  initialPedido?: PublicPedido | null;
  timelineSlot?: ReactNode;
};

export function PedidoAcompanhamentoClient({
  orderId: orderIdProp = "",
  initialPedido = null,
  timelineSlot,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idParam = (orderIdProp || searchParams.get("id") || "").trim();
  const [pedido, setPedido] = useState<PedidoView | null>(() =>
    initialPedido ? normalizePedidoView(initialPedido as PedidoView) : null,
  );
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(() => !initialPedido && !!idParam);

  const mergeFromStorage = useCallback((base: PedidoView | null): PedidoView | null => {
    try {
      const raw = window.localStorage.getItem("copa2026:ultimoPedido");
      if (!raw) return base ? normalizePedidoView(base) : null;
      const stored = normalizePedidoView(JSON.parse(raw) as PedidoView);
      if (!base) return stored;
      if (base.id !== stored.id) return normalizePedidoView(base);
      return normalizePedidoView({
        ...base,
        pagamento: base.pagamento ?? stored.pagamento,
        items: base.items?.length ? base.items : stored.items,
        statusPagamento: base.statusPagamento ?? stored.statusPagamento,
        etapa: base.etapa ?? stored.etapa,
      });
    } catch {
      return base ? normalizePedidoView(base) : null;
    }
  }, []);

  const fetchPedido = useCallback(async () => {
    const id = idParam.trim();
    if (!id) {
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`/api/pedidos/${encodeURIComponent(id)}`, {
        credentials: "same-origin",
      });
      if (res.ok) {
        const data = (await res.json()) as { pedido?: PedidoView };
        if (data.pedido) {
          setPedido(mergeFromStorage(normalizePedidoView(data.pedido)));
          setLoading(false);
          router.refresh();
          return;
        }
      }
    } catch {
      /* fallback storage */
    }
    try {
      const raw = window.localStorage.getItem("copa2026:ultimoPedido");
      if (raw) {
        const stored = normalizePedidoView(JSON.parse(raw) as PedidoView);
        if (stored.id === id) setPedido(stored);
      }
    } catch {}
    setLoading(false);
  }, [idParam, mergeFromStorage, router]);

  useEffect(() => {
    void fetchPedido();
  }, [fetchPedido]);

  useEffect(() => {
    const status = normalizeStatusPagamento(pedido?.statusPagamento);
    if (status !== "pendente" || !idParam) return;
    const t = window.setInterval(() => void fetchPedido(), 30_000);
    return () => window.clearInterval(t);
  }, [pedido?.statusPagamento, idParam, fetchPedido]);

  useEffect(() => {
    if (!pedido?.id || !Array.isArray(pedido.items) || pedido.items.length === 0) return;
    const eventId = `purchase_${pedido.id}`;
    const sentKey = `copa2026:metaPurchase:${pedido.id}`;
    try {
      if (window.sessionStorage.getItem(sentKey)) return;
    } catch {
      return;
    }

    const contents = pedido.items.map((i) => ({
      id: i.produtoId,
      quantity: i.quantidade,
    }));
    const content_ids = pedido.items.map((i) => i.produtoId);

    trackMetaPurchase(
      { value: pedido.totalPrice, currency: "BRL", contents, content_ids },
      { eventID: eventId },
    );

    const email = pedido.cliente?.email?.trim();
    void fetch("/api/meta/purchase", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event_id: eventId,
        value: pedido.totalPrice,
        currency: "BRL",
        contents,
        content_ids,
        event_source_url: window.location.href,
        email: email && email.includes("@") ? email : undefined,
        fbp: readCookie("_fbp"),
        fbc: readCookie("_fbc"),
      }),
    }).catch(() => {});

    try {
      window.sessionStorage.setItem(sentKey, "1");
    } catch {}
  }, [pedido]);

  const pedidoId = idParam || pedido?.id || "";
  const pag = pedido?.pagamento;
  const isPix = !pag || pag.modo === "pix";
  const statusPag = normalizeStatusPagamento(pedido?.statusPagamento);
  const showPixPay = isPix && statusPag === "pendente" && pag?.modo === "pix";

  const pixStripe =
    pag?.modo === "pix" && !!(pag.stripePixQrUrl || pag.stripePixCopiaECola);
  const pixMercadoPago =
    pag?.modo === "pix" &&
    !!(pag.mercadoPagoPaymentId || pag.mercadoPagoPixCopiaECola || pag.mercadoPagoPixQrDataUrl);

  const copy = async () => {
    try {
      let text = `${STORE_CONFIG.pix.key} | Pedido ${pedidoId}`;
      if (pag?.modo === "pix") {
        if (pag.mercadoPagoPixCopiaECola) text = pag.mercadoPagoPixCopiaECola;
        else if (pag.stripePixCopiaECola) text = pag.stripePixCopiaECola;
      }
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center text-muted">
        Carregando seu pedido...
      </div>
    );
  }

  if (!pedido || !pedidoId) {
    return (
      <section className="mx-auto max-w-lg px-4 py-24 text-center">
        <p className="font-display text-2xl text-foreground">Pedido não encontrado</p>
        <p className="mt-2 text-sm text-muted">
          Confira o link no e-mail ou finalize uma nova compra.
        </p>
        <Link href="/" className="btn-primary mt-6 inline-flex">
          Voltar à loja
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-16 md:px-8 md:py-20">
      {isPix && pedidoId && (
        <PixCpfAvisoModal pedidoId={pedidoId} cidade={pedido.cliente.cidade} uf={pedido.cliente.uf} />
      )}

      <div className="overflow-hidden rounded-3xl border border-border bg-surface/40 shadow-lg">
        <header className="border-b border-border bg-gradient-to-r from-brand-green/20 via-transparent to-brand-yellow/20 px-6 py-8 text-center md:px-10 md:py-10">
          <CheckCircle2 className="mx-auto h-14 w-14 text-brand-green" />
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.4em] text-brand-yellow">
            Pedido recebido
          </p>
          <h1 className="mt-2 font-display text-4xl leading-tight tracking-tight md:text-5xl">
            Boa! Seu pedido <span className="gradient-text">{pedidoId}</span> foi registrado.
          </h1>

          <div className="mx-auto mt-6 max-w-3xl text-left">
            {timelineSlot ?? (
              <p className="rounded-2xl border border-border bg-surface/40 p-6 text-sm text-muted">
                Carregando acompanhamento do pedido…
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() => void fetchPedido()}
            className="mt-5 inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted transition hover:border-brand-yellow hover:text-brand-yellow"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Atualizar status
          </button>

          <PromoViagemInformativo className="mx-auto mt-6 max-w-3xl text-left" orderId={pedidoId} />

          <p className="mx-auto mt-5 max-w-xl text-sm text-muted">
            {isPix ? (
              pixMercadoPago ? (
                <>
                  Pagamento via <span className="font-medium text-foreground">Mercado Pago</span>. Use o
                  QR ou o código abaixo. Frete grátis; guarde o comprovante do PIX.
                </>
              ) : pixStripe ? (
                <>
                  Pagamento via <span className="font-medium text-foreground">Stripe</span>. Use o QR ou
                  o código abaixo. Frete grátis; guarde o comprovante do PIX.
                </>
              ) : (
                <>
                  Frete grátis em todo o Brasil. Pague com PIX usando o QR ou a chave abaixo e guarde o
                  comprovante.
                </>
              )
            ) : (
              <>
                Pagamento com <span className="font-medium text-foreground">cartão</span> registrado.
                Aguardamos confirmação da loja — acompanhe as etapas acima.
              </>
            )}
          </p>
        </header>

        {showPixPay && (
          <div className="grid gap-8 border-b border-border p-6 md:grid-cols-2 md:p-10">
            <div className="text-center">
              <div className="mb-5 flex items-start gap-2 rounded-2xl border border-brand-yellow/45 bg-brand-yellow/10 px-4 py-3 text-left text-xs leading-relaxed text-foreground/90 md:text-[13px]">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-brand-yellow" />
                <span>
                  <strong className="text-foreground">Atenção:</strong> o PIX pode ser direcionado a um CPF
                  de pessoa física — revendedor Panini mais próximo da sua região.
                </span>
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-muted">
                {pixMercadoPago ? "PIX (Mercado Pago)" : pixStripe ? "PIX (Stripe)" : "Pague com PIX"}
              </p>
              <p className="mt-2 font-display text-3xl gradient-text">{formatBRL(pedido.totalPrice)}</p>

              {pixMercadoPago && pag.mercadoPagoPixQrDataUrl ? (
                <div className="mx-auto mt-6 max-w-[220px] rounded-3xl bg-white p-4 shadow-glow-yellow">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={pag.mercadoPagoPixQrDataUrl}
                    alt="QR Code PIX"
                    width={200}
                    height={200}
                    className="mx-auto h-auto w-full"
                  />
                </div>
              ) : pixStripe && pag.stripePixQrUrl ? (
                <div className="mx-auto mt-6 max-w-[220px] rounded-3xl bg-white p-4 shadow-glow-yellow">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={pag.stripePixQrUrl}
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
                      pag.mercadoPagoPixCopiaECola ??
                      pag.stripePixCopiaECola ??
                      `${STORE_CONFIG.pix.key} | Pedido ${pedidoId}`
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
                    {pixMercadoPago || pixStripe ? "Copiar código Pix" : "Copiar chave PIX"}
                  </>
                )}
              </button>
            </div>
            <div className="flex flex-col justify-center text-sm text-muted">
              <p className="text-foreground/90">
                Teve algum problema com a sua compra? Entre em contato com nossa equipe.
              </p>
              <Link href={`mailto:${STORE_CONFIG.email}`} className="btn-secondary mt-6 inline-flex w-fit">
                <Mail className="h-4 w-4" />
                Falar com suporte
              </Link>
            </div>
          </div>
        )}

        {!isPix && pag?.modo === "cartao" && statusPag === "pendente" && (
          <div className="border-b border-border px-6 py-10 text-center md:px-10">
            <CreditCard className="mx-auto h-10 w-10 text-brand-magenta" />
            <p className="mt-4 font-display text-2xl gradient-text">{formatBRL(pedido.totalPrice)}</p>
            <p className="mt-2 text-sm text-muted">
              Cartão registrado no checkout
              {pag.parcelas ? ` · ${pag.parcelas}x` : ""}. Aguardando confirmação da loja.
            </p>
          </div>
        )}

        {pedido.items.length > 0 && (
          <div className="px-6 py-8 md:px-10">
            <h3 className="font-display text-xl tracking-wide">Itens do pedido</h3>
            <ul className="mt-4 divide-y divide-border">
              {pedido.items.map((i) => {
                const sel = i.selecaoSlug ? getSelecao(i.selecaoSlug) : undefined;
                return (
                  <li
                    key={`${i.produtoId}-${i.tamanho ?? "x"}`}
                    className="flex items-center justify-between gap-3 py-3 text-sm"
                  >
                    <span>
                      {sel && <span className="mr-1">{sel.bandeira}</span>}
                      {i.quantidade}× {i.nome}
                      {i.tamanho && <span className="ml-1 text-muted">(Tam {i.tamanho})</span>}
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
              <span className="font-display text-2xl gradient-text">{formatBRL(pedido.totalPrice)}</span>
            </div>
          </div>
        )}

        <div className="border-t border-border px-6 py-5 md:px-10">
          <div className="flex items-start gap-3 text-xs text-muted">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" />
            <p>
              Dúvidas?{" "}
              <a href={`mailto:${STORE_CONFIG.email}`} className="text-foreground hover:text-brand-yellow">
                {STORE_CONFIG.email}
              </a>
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link href="/" className="text-sm text-muted hover:text-foreground">
          ← Voltar para a loja
        </Link>
      </div>
    </section>
  );
}

/** Alias usado em rotas legadas. */
export const AcompanharPedidoClient = PedidoAcompanhamentoClient;
