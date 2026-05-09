"use client";

import { useMemo, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { displayCardNumberLine, inferBrand } from "@/lib/credit-card";

type Props = {
  numberDisplay: string;
  holderName: string;
  expiry: string;
  showBack: boolean;
  cvvDisplay: string;
};

function BrandMark({ brand }: { brand: ReturnType<typeof inferBrand> }) {
  if (brand === "visa") {
    return (
      <span className="font-display italic tracking-tighter text-xl text-[#fafafa]" aria-hidden>
        VISA
      </span>
    );
  }
  if (brand === "mastercard") {
    return (
      <div className="flex -space-x-2" aria-hidden>
        <span className="h-10 w-10 rounded-full border-2 border-white/30 bg-[#eb001b]/90" />
        <span className="h-10 w-10 rounded-full border-2 border-white/30 bg-[#f79e1b]/90" />
      </div>
    );
  }
  if (brand === "elo") {
    return (
      <span className="font-display tracking-wide text-brand-yellow drop-shadow-lg" aria-hidden>
        ELO
      </span>
    );
  }
  if (brand === "amex") {
    return (
      <span
        className="rounded bg-[#0170b9] px-2 py-1 font-display text-sm tracking-[0.25em]"
        aria-hidden
      >
        AMEX
      </span>
    );
  }
  return (
    <span className="font-display text-sm tracking-[0.35em] text-white/85" aria-hidden>
      DEB / CRÉDITO
    </span>
  );
}

function Chip() {
  return (
    <div
      aria-hidden
      className="h-11 w-[3.35rem] rounded-md border border-yellow-900/35 bg-gradient-to-br from-[#d4bc7c] via-[#c49b4b] to-[#8f6f3a]"
      style={{
        backgroundImage:
          "linear-gradient(135deg,#e8daa0 0%,#b8934a 42%,#6d4f25 100%), repeating-linear-gradient(90deg,transparent,transparent 2px,rgba(0,0,0,0.04) 2px,rgba(0,0,0,0.04) 3px)",
      }}
    />
  );
}

/** Cartão 3D com inclinação no cursor e flip para o CVV no verso. */
export function CheckoutCreditCard3D({
  numberDisplay,
  holderName,
  expiry,
  showBack,
  cvvDisplay,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  /** Inclinar no eixo X (mouse vertical) */
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [10, -10]), { stiffness: 140, damping: 22 });
  /** Leve rolamento lateral sem usar rotateY — reservamos Y para flip do cartão */
  const rotateZ = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), { stiffness: 140, damping: 22 });

  const brand = useMemo(
    () => inferBrand(numberDisplay.replace(/\s/g, "")),
    [numberDisplay],
  );

  const numLine = displayCardNumberLine(numberDisplay);

  const nameLine =
    holderName.trim().length > 0 ? holderName.toUpperCase().slice(0, 26) : "NOME IGUAL AO CARTÃO";

  const expLine =
    expiry.length >= 5 && expiry.includes("/")
      ? expiry
      : expiry.length === 0
        ? "MM/AA"
        : expiry;

  const cvvLen = cvvDisplay.replace(/\D/g, "").length;
  const cvvDots = cvvLen > 0 ? "•".repeat(Math.min(4, cvvLen)).padEnd(3, "") : "•••";

  function onMouseMove(e: React.MouseEvent) {
    if (!wrapRef.current || showBack) return;
    const r = wrapRef.current.getBoundingClientRect();
    mx.set(Math.max(-0.5, Math.min(0.5, (e.clientX - r.left) / r.width - 0.5)));
    my.set(Math.max(-0.5, Math.min(0.5, (e.clientY - r.top) / r.height - 0.5)));
  }

  function onMouseLeave() {
    mx.set(0);
    my.set(0);
  }

  return (
    <div ref={wrapRef} className="relative mx-auto w-full max-w-[420px]" style={{ perspective: 1180 }}>
      <div className="pointer-events-none absolute -inset-8 rounded-[2rem] bg-gradient-to-br from-brand-green/22 via-transparent to-brand-yellow/16 blur-2xl" />
      <motion.div
        className="relative"
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 5.8, ease: "easeInOut" }}
      >
        <motion.div
          className="relative aspect-[1000/630] w-full rounded-3xl shadow-[0_26px_55px_-12px_rgba(0,0,0,0.58)] outline outline-1 outline-white/12 preserve-3d"
          style={{
            rotateX: showBack ? 0 : rotateX,
            rotateZ: showBack ? 0 : rotateZ,
            transformStyle: "preserve-3d",
          }}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
        >
          <motion.div
            className="preserve-3d absolute inset-0 rounded-3xl transition-[transform] duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]"
            style={{ transformStyle: "preserve-3d" }}
            animate={{ rotateY: showBack ? 180 : 0 }}
          >
            {/* Frente */}
            <div
              className="absolute inset-0 flex flex-col justify-between rounded-3xl border border-white/28 bg-[#0f1419]/97 p-5 sm:p-6 [backface-visibility:hidden]"
              style={{
                backgroundImage:
                  "linear-gradient(128deg,#0f1419 0%,rgba(13,96,61,0.5) 38%,rgba(255,214,10,0.2) 100%), radial-gradient(circle at 82% -18%, rgba(255,214,10,0.38),transparent 52%)",
              }}
            >
              <div className="relative z-[1] flex items-start justify-between gap-4">
                <Chip />
                <BrandMark brand={brand} />
              </div>
              <div className="relative z-[1] space-y-4">
                <p className="min-h-[2.25rem] font-mono text-lg tracking-[0.34em] text-white/96 sm:text-xl md:text-2xl md:tracking-[0.26em]">
                  {numLine}
                </p>
                <div className="flex items-end justify-between gap-3 text-[11px] uppercase tracking-[0.2em] text-white/68">
                  <div className="min-w-0">
                    <p className="text-[9px] text-white/40">Titular</p>
                    <p className="truncate pt-1 font-display text-[15px] tracking-[0.12em] text-white/92">
                      {nameLine}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-[9px] text-white/40">Validade</p>
                    <p className="pt-1 font-mono text-base tracking-widest text-white/92">{expLine}</p>
                  </div>
                </div>
              </div>
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-tr from-transparent via-transparent to-white/[0.07] opacity-80"
                style={{ clipPath: "polygon(40% -22%,148% -10%,-10% 125%,-20% 70%)" }}
              />
            </div>

            {/* Verso */}
            <div
              className="absolute inset-0 flex flex-col rounded-3xl border border-white/25 bg-[#111820] px-5 py-5 sm:p-6 [backface-visibility:hidden] [transform:rotateY(180deg)]"
              style={{
                backgroundImage:
                  "linear-gradient(160deg,#0d1118 22%,rgba(0,177,79,0.12) 100%), radial-gradient(ellipse at 110% 0%, rgba(0,177,79,0.18),transparent 45%)",
              }}
            >
              <div className="mt-8 h-10 w-[calc(100%+2.5rem)] -translate-x-5 bg-black/78 sm:-translate-x-6" />
              <div className="mt-8 flex justify-end px-3">
                <div className="w-full max-w-[10.25rem]">
                  <p className="text-[9px] uppercase tracking-[0.25em] text-white/42">CVV</p>
                  <div className="mt-2 flex min-h-[2.25rem] items-center justify-end rounded-lg bg-[#ededed] px-3 py-2 font-mono text-base tabular-nums text-[#0c0f14]">
                    <span>{cvvDots}</span>
                  </div>
                </div>
              </div>
              <div className="mt-auto pb-3 pt-10 text-[10px] leading-relaxed text-white/42">
                Pré-visualização 3D. Número completo e CVV não são enviados ao servidor nem ao WhatsApp.
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
