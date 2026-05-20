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
    <section
      data-pedido-ui="timeline-v2"
      className={cn(
        "rounded-2xl border-2 border-brand-yellow/30 bg-surface/60 p-5 md:p-7",
        className,
      )}
      aria-label="Acompanhamento do pedido"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/80 pb-4">
        <h2 className="font-display text-2xl tracking-wide text-foreground md:text-3xl">
          Acompanhar pedido
        </h2>
        <span
          className={cn(
            "rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider",
            status === "aprovado" && "border border-brand-green/50 bg-brand-green/20 text-brand-green",
            status === "rejeitado" && "border border-brand-red/50 bg-brand-red/15 text-brand-red",
            status === "pendente" && "border border-brand-yellow/50 bg-brand-yellow/15 text-brand-yellow",
          )}
        >
          {labelStatusPagamento(status)}
        </span>
      </div>

      {/* Mobile: vertical */}
      <ol className="mt-6 space-y-0 md:hidden">
        {ETAPAS_PEDIDO.map((step, index) => (
          <TimelineStep
            key={step.id}
            step={step}
            index={index}
            total={ETAPAS_PEDIDO.length}
            pedido={pedido}
            rejeitado={rejeitado}
            layout="vertical"
          />
        ))}
      </ol>

      {/* Desktop: horizontal */}
      <ol className="mt-8 hidden gap-2 md:grid md:grid-cols-5">
        {ETAPAS_PEDIDO.map((step, index) => (
          <TimelineStep
            key={step.id}
            step={step}
            index={index}
            total={ETAPAS_PEDIDO.length}
            pedido={pedido}
            rejeitado={rejeitado}
            layout="horizontal"
          />
        ))}
      </ol>
    </section>
  );
}

type StepProps = {
  step: (typeof ETAPAS_PEDIDO)[number];
  index: number;
  total: number;
  pedido: Pick<PedidoRegistro, "etapa" | "statusPagamento">;
  rejeitado: boolean;
  layout: "vertical" | "horizontal";
};

function TimelineStep({ step, index, total, pedido, rejeitado, layout }: StepProps) {
  const done = isEtapaCompleta(step.id, pedido);
  const current = isEtapaAtual(step.id, pedido);
  const pagamentoRejeitado = step.id === "pagamento_concluido" && rejeitado;
  const status = normalizeStatusPagamento(pedido.statusPagamento);

  const icon = (
    <span
      className={cn(
        "relative z-[1] flex shrink-0 items-center justify-center rounded-full border-2",
        layout === "vertical" ? "h-9 w-9" : "mx-auto h-11 w-11",
        pagamentoRejeitado && "border-brand-red/60 bg-brand-red/20 text-brand-red",
        done && !pagamentoRejeitado && "border-brand-green/60 bg-brand-green/25 text-brand-green",
        current && !done && !pagamentoRejeitado && "border-brand-yellow/60 bg-brand-yellow/20 text-brand-yellow shadow-[0_0_20px_rgba(234,179,8,0.25)]",
        !done && !current && !pagamentoRejeitado && "border-border bg-background-elev/80 text-muted",
      )}
    >
      {pagamentoRejeitado ? (
        <X className="h-5 w-5" aria-hidden />
      ) : done ? (
        <Check className="h-5 w-5" aria-hidden />
      ) : (
        <Circle className="h-4 w-4 fill-current opacity-50" aria-hidden />
      )}
    </span>
  );

  const label = (
    <p
      className={cn(
        "font-semibold leading-snug",
        layout === "horizontal" && "mt-3 text-center text-sm",
        (done || current) && !pagamentoRejeitado ? "text-foreground" : "text-muted",
        pagamentoRejeitado && "text-brand-red",
      )}
    >
      {step.label}
      {current && !pagamentoRejeitado && (
        <span className="ml-1.5 text-[10px] font-bold uppercase tracking-wider text-brand-yellow">
          Agora
        </span>
      )}
    </p>
  );

  const hint =
    step.id === "pagamento_concluido" && status === "pendente" && current ? (
      <p className={cn("text-xs text-muted", layout === "horizontal" ? "mt-1 text-center" : "mt-1")}>
        Confirmando pagamento — atualize esta página.
      </p>
    ) : pagamentoRejeitado ? (
      <p className={cn("text-xs text-muted", layout === "horizontal" ? "mt-1 text-center" : "mt-1")}>
        Pagamento não confirmado. Fale com o suporte.
      </p>
    ) : step.id === "pedido_feito" && done ? (
      <p className={cn("text-xs text-muted", layout === "horizontal" ? "mt-1 text-center" : "mt-1")}>
        Pedido registrado.
      </p>
    ) : step.id === "entregue" && normalizeEtapa(pedido.etapa) === "entregue" ? (
      <p className={cn("text-xs text-brand-green", layout === "horizontal" ? "mt-1 text-center" : "mt-1")}>
        Entregue!
      </p>
    ) : null;

  if (layout === "horizontal") {
    return (
      <li className="relative flex flex-col items-center px-1 text-center">
        {index < total - 1 && (
          <span
            className={cn(
              "absolute left-[calc(50%+28px)] top-[22px] h-0.5 w-[calc(100%-56px)]",
              done && !pagamentoRejeitado ? "bg-brand-green/50" : "bg-border",
            )}
            aria-hidden
          />
        )}
        {icon}
        {label}
        {hint}
      </li>
    );
  }

  return (
    <li className="relative flex gap-4 pb-8 last:pb-0">
      {index < total - 1 && (
        <span
          className={cn(
            "absolute left-[17px] top-9 h-[calc(100%-12px)] w-0.5",
            done && !pagamentoRejeitado ? "bg-brand-green/50" : "bg-border",
          )}
          aria-hidden
        />
      )}
      {icon}
      <div className="min-w-0 pt-1">
        {label}
        {hint}
      </div>
    </li>
  );
}
