"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { CountdownCopa } from "./CountdownCopa";
import { HeroAlbum3D } from "./HeroAlbum3D";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="pointer-events-none absolute -left-32 top-10 h-72 w-72 rounded-full bg-brand-green/30 blur-[120px]" />
      <div className="pointer-events-none absolute -right-32 top-40 h-96 w-96 rounded-full bg-brand-yellow/30 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-72 w-[60vw] -translate-x-1/2 rounded-full bg-brand-blue/30 blur-[140px]" />

      <div className="relative mx-auto grid min-w-0 max-w-7xl items-center gap-6 px-4 py-12 md:gap-10 md:px-8 md:py-28 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <motion.div className="order-2 min-w-0 lg:order-1">
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex max-w-full flex-wrap items-center justify-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1.5 text-center text-[10px] font-semibold uppercase tracking-wide text-muted backdrop-blur sm:px-4 sm:text-xs sm:tracking-widest"
          >
            <Sparkles className="h-3.5 w-3.5 shrink-0 text-brand-yellow" />
            <span className="min-w-0 leading-snug">
              Parceria Panini · FIFA World Cup 2026™ — Disponível
            </span>
          </motion.div>

          <motion.h1
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-4 font-display text-[2.65rem] leading-[0.95] tracking-tight text-foreground sm:mt-6 sm:text-5xl md:text-7xl lg:text-8xl"
          >
            VIVA A COPA<br />
            <span className="gradient-text">DO MUNDO 2026</span>
          </motion.h1>

          <motion.p
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-6 max-w-xl text-base leading-relaxed text-muted md:text-lg"
          >
            A FIFA e a Panini apresentam o álbum oficial da Copa do Mundo FIFA 2026™ — uma coleção que marca
            um momento histórico do futebol mundial.
            <br />
            <br />
            Com páginas criadas para eternizar craques, seleções e grandes emoções, o álbum convida os fãs a
            eternizarem cada momento dessa edição inesquecível.
          </motion.p>

          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Link href="/album" className="btn-primary">
              Quero o álbum
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/camisetas" className="btn-secondary">
              Ver camisetas
            </Link>
          </motion.div>

          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-8"
          >
            <CountdownCopa />
          </motion.div>
        </motion.div>

        <motion.div
          initial={false}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="relative order-1 mx-auto flex aspect-square w-full max-w-[min(100%,20rem)] min-w-0 items-center justify-center perspective-1000 sm:max-w-[22rem] lg:order-2 md:max-w-[36.25rem] md:aspect-auto md:h-[580px] md:w-[580px]"
        >
          <div className="absolute inset-0 animate-spin-slow gradient-conic opacity-30 blur-3xl" />
          <div className="absolute left-4 top-12 h-8 w-8 rounded-full bg-brand-yellow/80 blur-[2px] shadow-[0_0_40px_rgba(255,214,10,0.9)] md:left-6 md:top-16 md:h-10 md:w-10" />
          <div className="absolute right-4 bottom-16 h-6 w-6 rounded-full bg-brand-cyan/80 blur-[2px] shadow-[0_0_38px_rgba(0,224,255,0.8)] md:right-10 md:bottom-20 md:h-8 md:w-8" />

          <div className="relative aspect-square w-[88%] max-w-full animate-float preserve-3d md:h-[500px] md:w-[500px]">
            <div className="relative h-full w-full translate-z-16 overflow-hidden md:overflow-visible">
              <HeroAlbum3D className="rounded-none" />
            </div>
          </div>

        </motion.div>
      </div>
    </section>
  );
}
