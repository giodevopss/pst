import {
  PIX_CHECKOUT_EXTRA_DISCOUNT_PERCENT,
  SITE_WIDE_DISCOUNT_PERCENT,
} from "@/lib/store-pricing";
import { cn } from "@/lib/utils";

/** Chip verde: desconto promocional na loja (vitrine / cartões de preço). */
export function LojaDiscountBadge({
  className,
  size = "default",
}: {
  className?: string;
  /** `compact` = texto um pouco menor nos cards densos. */
  size?: "default" | "compact";
}) {
  return (
    <span
      className={cn(
        "rounded-full bg-brand-green/15 font-bold uppercase tracking-wide text-brand-green",
        size === "compact"
          ? "px-2 py-0.5 text-[9px]"
          : "px-2 py-0.5 text-[10px]",
        className,
      )}
    >
      −{SITE_WIDE_DISCOUNT_PERCENT}% na loja
    </span>
  );
}

/** Chip ciano: desconto extra no total ao pagar com PIX (checkout). */
export function PixDiscountBadge({
  className,
  size = "default",
}: {
  className?: string;
  size?: "default" | "compact";
}) {
  return (
    <span
      className={cn(
        "rounded-full border border-brand-cyan/40 bg-brand-cyan/15 font-bold uppercase tracking-wide text-brand-cyan",
        size === "compact"
          ? "px-2 py-0.5 text-[9px]"
          : "px-2 py-0.5 text-[10px]",
        className,
      )}
    >
      −{PIX_CHECKOUT_EXTRA_DISCOUNT_PERCENT}% no PIX
    </span>
  );
}
