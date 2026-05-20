import { Check, Circle, X } from "lucide-react";
import {
  ETAPAS_PEDIDO,
  isEtapaAtual,
  isEtapaCompleta,
  labelStatusPagamento,
  normalizeEtapa,
  normalizeStatusPagamento,
} from "@/lib/pedido-status";
import type { PedidoRegistro } from "@/types/pedido-store";
import { cn } from "@/lib/utils";

type Props = {
  pedido: Pick<PedidoRegistro, "etapa" | "statusPagamento">;
  className?: string;
};

export function PedidoTimeline({ pedido, className }: Props) {
  const status = normalizeStatusPagamento(pedido.statusPagamento);
  const rejeitado = status === "rejeitado";

  return (
    <div className={cn("rounded-2xl border border-border bg-surface/40 p-5 md:p-6", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-xl tracking-wide text-foreground md:text-2xl">
          Acompanhar pedido
        </h2>
        <span
          className={cn(
            "rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider",
            status === "aprovado" && "border border-brand-green/40 bg-brand-green/15 text-brand-green",
            status === "rejeitado" && "border border-brand-red/40 bg-brand-red/10 text-brand-red",
            status === "pendente" && "border border-brand-yellow/40 bg-brand-yellow/10 text-brand-yellow",
          )}
        >
          {labelStatusPagamento(status)}
        </span>
      </div>

      <ol className="mt-6 space-y-0">
        {ETAPAS_PEDIDO.map((step, index) => {
          const done = isEtapaCompleta(step.id, pedido);
          const current = isEtapaAtual(step.id, pedido);
          const pagamentoRejeitado = step.id === "pagamento_concluido" && rejeitado;

          return (
            <li key={step.id} className="relative flex gap-4 pb-8 last:pb-0">
              {index < ETAPAS_PEDIDO.length - 1 && (
                <span
                  className={cn(
                    "absolute left-[15px] top-8 h-[calc(100%-8px)] w-0.5",
                    done && !pagamentoRejeitado ? "bg-brand-green/50" : "bg-border",
                  )}
                  aria-hidden
                />
              )}
              <span
                className={cn(
                  "relative z-[1] flex h-8 w-8 shrink-0 items-center justify-center rounded-full border",
                  pagamentoRejeitado && "border-brand-red/50 bg-brand-red/15 text-brand-red",
                  done && !pagamentoRejeitado && "border-brand-green/50 bg-brand-green/20 text-brand-green",
                  current && !done && !pagamentoRejeitado && "border-brand-yellow/50 bg-brand-yellow/15 text-brand-yellow",
                  !done && !current && !pagamentoRejeitado && "border-border bg-background-elev/60 text-muted",
                )}
              >
                {pagamentoRejeitado ? (
                  <X className="h-4 w-4" aria-hidden />
                ) : done ? (
                  <Check className="h-4 w-4" aria-hidden />
                ) : (
                  <Circle className="h-3 w-3 fill-current opacity-40" aria-hidden />
                )}
              </span>
              <div className="min-w-0 pt-0.5">
                <p
                  className={cn(
                    "font-semibold",
                    (done || current) && !pagamentoRejeitado ? "text-foreground" : "text-muted",
                    pagamentoRejeitado && "text-brand-red",
                  )}
                >
                  {step.label}
                  {current && !pagamentoRejeitado && (
                    <span className="ml-2 text-[10px] font-bold uppercase tracking-wider text-brand-yellow">
                      Agora
                    </span>
                  )}
                </p>
                {step.id === "pagamento_concluido" && status === "pendente" && current && (
                  <p className="mt-1 text-sm text-muted">
                    Estamos confirmando seu pagamento. Você receberá atualização por e-mail.
                  </p>
                )}
                {pagamentoRejeitado && (
                  <p className="mt-1 text-sm text-muted">
                    Pagamento não confirmado. Entre em contato com a loja se já realizou o PIX ou o cartão.
                  </p>
                )}
                {step.id === "pedido_feito" && done && (
                  <p className="mt-1 text-sm text-muted">Seu pedido foi registrado com sucesso.</p>
                )}
                {step.id === "entregue" && normalizeEtapa(pedido.etapa) === "entregue" && (
                  <p className="mt-1 text-sm text-brand-green">Pedido entregue. Obrigado pela compra!</p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
