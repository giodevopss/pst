import Link from "next/link";
import { Gift, Ticket } from "lucide-react";
import { PROMO_VIAGEM_COPA } from "@/config/promocao-viagem";
import { normalizeStatusPagamento } from "@/lib/pedido-status";
import type { StatusPagamentoPedido } from "@/types/pedido-store";
import { cn } from "@/lib/utils";

type Props = {
  /** Número do pedido (ex.: C26-…) — usado como cupom no sorteio. */
  orderId?: string;
  /** Quando informado com `orderId`, define a mensagem de participação no sorteio. */
  statusPagamento?: StatusPagamentoPedido;
  className?: string;
  variant?: "default" | "compact";
};

function mensagemParticipacaoSorteio(
  orderId: string | undefined,
  statusPagamento: StatusPagamentoPedido | undefined,
): string {
  if (!orderId) {
    return "Após finalizar, anote o número na confirmação.";
  }
  if (normalizeStatusPagamento(statusPagamento) === "aprovado") {
    return "Você está concorrendo à viagem para a final da Copa 2026™.";
  }
  return "Conclua o seu pagamento para participar!";
}

export function PromoViagemInformativo({
  orderId,
  statusPagamento,
  className,
  variant = "default",
}: Props) {
  const compact = variant === "compact";
  const pagamentoAprovado =
    !!orderId && normalizeStatusPagamento(statusPagamento) === "aprovado";
  const msgParticipacao = mensagemParticipacaoSorteio(orderId, statusPagamento);

  return (
    <div
      className={cn(
        "rounded-2xl border border-brand-yellow/40 bg-gradient-to-br from-brand-yellow/10 via-background-elev/40 to-brand-green/5",
        "[data-theme=light]:border-amber-300/70 [data-theme=light]:from-amber-50 [data-theme=light]:via-background-elev [data-theme=light]:to-emerald-50/90",
        compact ? "p-4" : "p-5 md:p-6",
        className,
      )}
      role="note"
      aria-label="Informativo promoção viagem Copa 2026"
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "inline-flex shrink-0 items-center justify-center rounded-xl border border-brand-yellow/35 bg-brand-yellow/15 text-brand-yellow",
            "[data-theme=light]:border-amber-400/60 [data-theme=light]:bg-amber-100 [data-theme=light]:text-amber-900",
            compact ? "h-9 w-9" : "h-11 w-11",
          )}
        >
          <Gift className={compact ? "h-4 w-4" : "h-5 w-5"} aria-hidden />
        </span>
        <div className="min-w-0 flex-1 space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-yellow [data-theme=light]:text-amber-900">
            Promoção · viagem para a Copa 2026
          </p>
          {orderId ? (
            <p className={cn("leading-snug text-foreground/95", compact ? "text-sm" : "text-base")}>
              <strong className="text-foreground">O número do seu pedido é o cupom do sorteio.</strong>{" "}
              Guarde este código — é ele que será usado na promoção:
            </p>
          ) : (
            <p className={cn("leading-snug text-muted", compact ? "text-sm" : "text-base")}>
              <strong className="text-foreground">Todo pedido finalizado</strong> na loja participa do
              sorteio. O <strong className="text-foreground">número do pedido</strong> gerado no checkout
              será o identificador usado na promoção;{" "}
              <strong className="text-foreground">apenas pedidos pagos</strong> participarão do sorteio.
            </p>
          )}

          {orderId && (
            <p
              className={cn(
                "inline-flex max-w-full items-center gap-2 rounded-xl border border-brand-yellow/50 bg-brand-yellow/10 px-4 py-2.5 font-mono font-bold tracking-wide text-brand-yellow",
                "[data-theme=light]:border-amber-400/70 [data-theme=light]:bg-amber-100 [data-theme=light]:text-amber-950",
                compact ? "text-sm" : "text-base md:text-lg",
              )}
            >
              <Ticket className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
              <span className="truncate">{orderId}</span>
            </p>
          )}

          <p
            className={cn(
              "text-sm font-medium",
              pagamentoAprovado
                ? "text-brand-green [data-theme=light]:text-brand-green-deep"
                : orderId
                  ? "text-brand-yellow [data-theme=light]:text-amber-900"
                  : "text-muted",
            )}
          >
            {msgParticipacao}
          </p>

          <Link
            href={PROMO_VIAGEM_COPA.detalhesHref}
            className="inline-block text-sm font-semibold text-brand-yellow underline decoration-brand-yellow/40 underline-offset-2 hover:text-foreground [data-theme=light]:text-brand-blue [data-theme=light]:decoration-brand-blue/40 [data-theme=light]:hover:text-brand-blue-deep"
          >
            Ver regulamento e prêmios da promoção →
          </Link>
        </div>
      </div>
    </div>
  );
}
