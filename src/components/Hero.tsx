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

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 md:px-8 md:py-28 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-muted backdrop-blur"
          >
            <Sparkles className="h-3.5 w-3.5 text-brand-yellow" />
            <span>Parceria Panini · FIFA World Cup 2026™ — Disponível</span>
          </motion.div>

          <motion.h1
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-6 font-display text-5xl leading-[0.95] tracking-tight text-foreground md:text-7xl lg:text-8xl"
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
        </div>

        <motion.div
          initial={false}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="relative mx-auto flex h-[460px] w-[460px] items-center justify-center perspective-1000 md:h-[580px] md:w-[580px]"
        >
          <div className="absolute inset-0 animate-spin-slow gradient-conic opacity-30 blur-3xl" />
          <div className="absolute left-6 top-16 h-10 w-10 rounded-full bg-brand-yellow/80 blur-[2px] shadow-[0_0_40px_rgba(255,214,10,0.9)]" />
          <div className="absolute right-10 bottom-20 h-8 w-8 rounded-full bg-brand-cyan/80 blur-[2px] shadow-[0_0_38px_rgba(0,224,255,0.8)]" />

          <div className="relative h-[380px] w-[380px] animate-float preserve-3d md:h-[500px] md:w-[500px]">
            <div className="relative h-full w-full translate-z-16 overflow-visible">
              <HeroAlbum3D className="rounded-none" />
            </div>
          </div>

        </motion.div>
      </div>
    </section>
  );
}
