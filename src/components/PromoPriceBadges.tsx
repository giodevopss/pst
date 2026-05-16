import {
  PIX_CHECKOUT_EXTRA_DISCOUNT_PERCENT,
  SITE_WIDE_DISCOUNT_PERCENT,
} from "@/lib/store-pricing";
import { cn } from "@/lib/utils";

const lojaFundo =
  "border border-brand-green/55 bg-[#041208]/95 shadow-md backdrop-blur-sm ring-1 ring-brand-green/25";

const pixFundo =
  "border border-brand-cyan/55 bg-[#050c14]/95 shadow-md backdrop-blur-sm ring-1 ring-brand-cyan/25";

/** Chip verde: desconto promocional na vitrine (cartões de preço). */
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
        "inline-flex shrink-0 items-center rounded-full font-bold uppercase tracking-wide text-brand-green",
        lojaFundo,
        size === "compact"
          ? "px-2 py-0.5 text-[9px]"
          : "px-2.5 py-1 text-[10px]",
        className,
      )}
    >
      −{SITE_WIDE_DISCOUNT_PERCENT}%
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
        "inline-flex shrink-0 items-center rounded-full font-bold uppercase tracking-wide text-brand-cyan",
        pixFundo,
        size === "compact"
          ? "px-2 py-0.5 text-[9px]"
          : "px-2.5 py-1 text-[10px]",
        className,
      )}
    >
      −{PIX_CHECKOUT_EXTRA_DISCOUNT_PERCENT}% no PIX
    </span>
  );
}

/** As duas badges lado a lado (sempre em linha). */
export function PromoBadgesPair({
  size = "default",
  className,
  badgeClassName,
}: {
  size?: "default" | "compact";
  className?: string;
  /** Classes extra aplicadas às duas badges (ex.: `px-3 py-1 text-xs`). */
  badgeClassName?: string;
}) {
  return (
    <span
      className={cn("inline-flex flex-row flex-wrap items-center gap-1.5", className)}
    >
      <LojaDiscountBadge size={size} className={badgeClassName} />
      <PixDiscountBadge size={size} className={badgeClassName} />
    </span>
  );
}
