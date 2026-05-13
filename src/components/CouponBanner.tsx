"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArrowRight, BadgePercent, Copy, Check } from "lucide-react";
import {
  PIX_CHECKOUT_EXTRA_DISCOUNT_PERCENT,
  PIX_DISCOUNT_COUPON_CODE,
} from "@/lib/store-pricing";

type CouponBannerProps = {
  className?: string;
  /** href do CTA (default `/checkout`) */
  href?: string;
};

export function CouponBanner({ className, href = "/checkout" }: CouponBannerProps) {
  const [copied, setCopied] = useState(false);

  const onCopy = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(PIX_DISCOUNT_COUPON_CODE);
      setCopied(true);
    } catch {}
  }, []);

  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 1600);
    return () => window.clearTimeout(t);
  }, [copied]);

  return (
    <section
      className={[
        "relative overflow-hidden border-y border-brand-green/40 bg-gradient-to-r from-brand-green/15 via-brand-yellow/10 to-brand-cyan/12",
        className ?? "",
      ].join(" ")}
    >
      <div className="pointer-events-none absolute -left-16 top-1/2 h-32 w-32 -translate-y-1/2 rounded-full bg-brand-green/35 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-brand-yellow/25 blur-3xl" />

      <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-5 md:flex-row md:px-8 md:py-6">
        <div className="flex items-start gap-3 md:items-center">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-brand-green/45 bg-brand-green/20 text-brand-green">
            <BadgePercent className="h-5 w-5" />
          </span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-brand-green md:text-[11px]">
              Cupom exclusivo · pagamento PIX
            </p>
            <p className="mt-1 font-display text-lg leading-tight text-foreground md:text-2xl">
              Use{" "}
              <span className="rounded-md bg-brand-green/25 px-2 py-0.5 font-mono font-bold text-brand-green">
                {PIX_DISCOUNT_COUPON_CODE}
              </span>{" "}
              e ganhe <span className="gradient-text">−{PIX_CHECKOUT_EXTRA_DISCOUNT_PERCENT}%</span> extra no PIX
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted md:text-sm">
              Aplique no checkout para liberar o desconto sobre o subtotal.
            </p>
          </div>
        </div>

        <div className="flex w-full flex-wrap items-center gap-2 sm:flex-nowrap md:w-auto">
          <button
            type="button"
            onClick={onCopy}
            aria-label={`Copiar cupom ${PIX_DISCOUNT_COUPON_CODE}`}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-brand-green/50 bg-brand-green/15 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-brand-green transition hover:bg-brand-green/25 sm:flex-none"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" /> Copiado
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" /> Copiar cupom
              </>
            )}
          </button>
          <Link
            href={href}
            className="btn-primary inline-flex flex-1 items-center justify-center sm:flex-none"
          >
            Ir ao checkout
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
