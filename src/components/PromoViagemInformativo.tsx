import Link from "next/link";
import { Gift, Ticket } from "lucide-react";
import { PROMO_VIAGEM_COPA } from "@/config/promocao-viagem";
import { cn } from "@/lib/utils";

type Props = {
  /** Número do pedido (ex.: C26-…) — usado como cupom no sorteio. */
  orderId?: string;
  className?: string;
  variant?: "default" | "compact";
};

export function PromoViagemInformativo({
  orderId,
  className,
  variant = "default",
}: Props) {
  const compact = variant === "compact";

  return (
    <div
      className={cn(
        "rounded-2xl border border-brand-yellow/40 bg-gradient-to-br from-brand-yellow/10 via-background-elev/40 to-brand-green/5",
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
            compact ? "h-9 w-9" : "h-11 w-11",
          )}
        >
          <Gift className={compact ? "h-4 w-4" : "h-5 w-5"} aria-hidden />
        </span>
        <div className="min-w-0 flex-1 space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-yellow">
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
              será o identificador usado na promoção — sem valor mínimo.
            </p>
          )}

          {orderId && (
            <p
              className={cn(
                "inline-flex max-w-full items-center gap-2 rounded-xl border border-brand-yellow/50 bg-brand-yellow/10 px-4 py-2.5 font-mono font-bold tracking-wide text-brand-yellow",
                compact ? "text-sm" : "text-base md:text-lg",
              )}
            >
              <Ticket className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
              <span className="truncate">{orderId}</span>
            </p>
          )}

          <p className="text-sm font-medium text-brand-green">
            {orderId
              ? "Você está concorrendo à viagem para a final da Copa 2026™."
              : "Após finalizar, anote o número na confirmação — sem cadastro extra."}
          </p>

          <Link
            href={PROMO_VIAGEM_COPA.detalhesHref}
            className="inline-block text-sm font-semibold text-brand-yellow underline decoration-brand-yellow/40 underline-offset-2 hover:text-foreground"
          >
            Ver regulamento e prêmios da promoção →
          </Link>
        </div>
      </div>
    </div>
  );
}
