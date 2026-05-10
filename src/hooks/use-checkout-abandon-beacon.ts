"use client";

import { useEffect, useRef } from "react";
import type { CartItem } from "@/lib/cart";
import type { CheckoutAbandonPayload } from "@/types/remarketing";

const SESSION_KEY = "copa2026:checkout_abandon_sid";
const CONVERTIDO_KEY = "copa2026:checkout_convertido";
const MIN_MS_BETWEEN_SENDS = 4000;

type FormSnap = {
  email: string;
  nome: string;
  telefone: string;
  cep: string;
  cidade: string;
  uf: string;
};

type Opts = {
  items: CartItem[];
  data: FormSnap;
  paymentModo: "pix" | "cartao";
  subtotalLoja: number;
  totalComPagamentoEscolhido: number;
  checkoutBusy: boolean;
};

function getOrCreateSessionId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    try {
      return crypto.randomUUID();
    } catch {
      return null;
    }
  }
}

function payloadFromState(
  sessionId: string,
  opts: Opts,
): CheckoutAbandonPayload | null {
  const { items, data, paymentModo, subtotalLoja, totalComPagamentoEscolhido } = opts;
  if (items.length === 0) return null;

  const lineItems = items.map((i) => ({
    produtoId: String(i.produtoId),
    nome: String(i.nome ?? "").slice(0, 500),
    quantidade: Math.min(99, Math.max(1, Math.floor(Number(i.quantidade)) || 1)),
    linhaTotal: Math.round(Number(i.preco) * Number(i.quantidade) * 100) / 100,
  }));

  const email = data.email.trim();
  const nome = data.nome.trim();
  const telefone = data.telefone.trim();

  return {
    sessionId,
    paymentModo,
    subtotalLoja,
    totalComPagamentoEscolhido,
    items: lineItems,
    cliente: {
      ...(email.length >= 5 ? { email: email.toLowerCase() } : {}),
      ...(nome.length >= 2 ? { nome: nome.slice(0, 120) } : {}),
      ...(telefone.length >= 8 ? { telefone: telefone.slice(0, 32) } : {}),
      ...(data.cep.replace(/\D/g, "").length === 8
        ? { cep: data.cep.trim().slice(0, 16) }
        : {}),
      ...(data.cidade.trim().length >= 2 ? { cidade: data.cidade.trim().slice(0, 80) } : {}),
      ...(data.uf.trim().length === 2 ? { uf: data.uf.trim().toUpperCase().slice(0, 3) } : {}),
    },
    ...(typeof document !== "undefined" && document.referrer
      ? { referrer: document.referrer.slice(0, 2048) }
      : {}),
  };
}

/**
 * Ao sair do checkout (mudar aba/fechar/dispositivo), envia estado atual ao servidor
 * para remarketing por e‑mail/anúncios. Não dispara durante envio do pedido ou após compra confirmada.
 */
export function useCheckoutAbandonBeacon(opts: Opts) {
  const busyRef = useRef(opts.checkoutBusy);
  busyRef.current = opts.checkoutBusy;

  const snapRef = useRef(opts);
  snapRef.current = opts;

  const lastSentMs = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const flush = () => {
      if (busyRef.current) return;
      try {
        if (sessionStorage.getItem(CONVERTIDO_KEY) === "1") return;
      } catch {
        return;
      }

      const now = Date.now();
      if (now - lastSentMs.current < MIN_MS_BETWEEN_SENDS) return;

      const sessionId = getOrCreateSessionId();
      if (!sessionId) return;

      const snap = snapRef.current;
      if (snap.items.length === 0) return;

      const body = payloadFromState(sessionId, snap);
      if (!body) return;

      lastSentMs.current = now;

      try {
        const json = JSON.stringify(body);
        const blob = new Blob([json], { type: "application/json" });

        /* sendBeacon garante pedido mesmo ao descarregar a página */
        const ok =
          typeof navigator.sendBeacon === "function" &&
          navigator.sendBeacon("/api/remarketing/checkout-abandon", blob);

        if (!ok) {
          void fetch("/api/remarketing/checkout-abandon", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: json,
            keepalive: true,
            credentials: "same-origin",
          }).catch(() => {});
        }
      } catch {
        /* silencioso */
      }
    };

    const onVis = () => {
      if (document.visibilityState === "hidden") flush();
    };
    document.addEventListener("visibilitychange", onVis);

    const onHide = () => flush();
    window.addEventListener("pagehide", onHide);

    return () => {
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pagehide", onHide);
    };
  }, []);
}

export { CONVERTIDO_KEY as REMARKETING_CHECKOUT_CONVERTIDO_KEY };
