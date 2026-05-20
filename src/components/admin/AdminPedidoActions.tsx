"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check, Loader2, Package, Truck, X } from "lucide-react";
import {
  ETAPAS_ENVIO_ADMIN,
  labelStatusPagamento,
  normalizeEtapa,
  normalizeStatusPagamento,
} from "@/lib/pedido-status";
import type { EtapaPedido, StatusPagamentoPedido } from "@/types/pedido-store";
import { cn } from "@/lib/utils";

const ETAPA_LABEL: Record<EtapaPedido, string> = {
  pedido_feito: "Pedido feito",
  pagamento_concluido: "Pagamento concluído",
  em_separacao: "Em separação",
  em_envio: "Em envio",
  entregue: "Entregue",
};

type Props = {
  pedidoId: string;
  statusPagamento?: StatusPagamentoPedido;
  etapa?: EtapaPedido;
};

export function AdminPedidoActions({ pedidoId, statusPagamento, etapa }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const status = normalizeStatusPagamento(statusPagamento);
  const etapaAtual = normalizeEtapa(etapa);

  async function patch(body: Record<string, string>) {
    setBusy(body.action + (body.etapa ?? ""));
    setErr(null);
    try {
      const res = await fetch(`/api/admin/pedidos/${encodeURIComponent(pedidoId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "same-origin",
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setErr(data.error ?? "Falha ao atualizar");
        return;
      }
      router.refresh();
    } catch {
      setErr("Erro de rede");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="border-t border-border bg-background-elev/30 px-6 py-4 md:px-8">
      <p className="font-display text-sm uppercase tracking-[0.2em] text-brand-yellow">
        Gestão do pedido
      </p>
      <p className="mt-1 text-xs text-muted">
        Pagamento: <strong className="text-foreground">{labelStatusPagamento(status)}</strong>
        {" · "}
        Etapa: <strong className="text-foreground">{ETAPA_LABEL[etapaAtual]}</strong>
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {status !== "aprovado" && (
          <button
            type="button"
            disabled={!!busy}
            onClick={() => patch({ action: "aprovar_pagamento" })}
            className="inline-flex items-center gap-2 rounded-full border border-brand-green/50 bg-brand-green/15 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-brand-green transition hover:bg-brand-green/25 disabled:opacity-50"
          >
            {busy === "aprovar_pagamento" ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Check className="h-3.5 w-3.5" />
            )}
            Aprovar pagamento
          </button>
        )}
        {status !== "rejeitado" && (
          <button
            type="button"
            disabled={!!busy}
            onClick={() => patch({ action: "rejeitar_pagamento" })}
            className="inline-flex items-center gap-2 rounded-full border border-brand-red/45 bg-brand-red/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-brand-red transition hover:bg-brand-red/20 disabled:opacity-50"
          >
            {busy === "rejeitar_pagamento" ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <X className="h-3.5 w-3.5" />
            )}
            Rejeitar pagamento
          </button>
        )}
        <a
          href={`/pedido/sucesso?id=${encodeURIComponent(pedidoId)}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted transition hover:border-brand-yellow hover:text-brand-yellow"
        >
          Ver como cliente
        </a>
      </div>

      {status === "aprovado" && (
        <div className="mt-4 flex flex-wrap gap-2">
          {ETAPAS_ENVIO_ADMIN.map((e) => (
            <button
              key={e}
              type="button"
              disabled={!!busy || etapaAtual === e}
              onClick={() => patch({ action: "etapa", etapa: e })}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider transition disabled:opacity-50",
                etapaAtual === e
                  ? "border-brand-yellow/50 bg-brand-yellow/15 text-brand-yellow"
                  : "border-border text-muted hover:border-brand-cyan/40 hover:text-brand-cyan",
              )}
            >
              {busy === `etapa${e}` ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : e === "em_envio" ? (
                <Truck className="h-3 w-3" />
              ) : (
                <Package className="h-3 w-3" />
              )}
              {ETAPA_LABEL[e]}
            </button>
          ))}
        </div>
      )}

      {err && <p className="mt-3 text-xs text-brand-red">{err}</p>}
    </div>
  );
}
