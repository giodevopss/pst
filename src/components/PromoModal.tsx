"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, X } from "lucide-react";

const STORAGE_KEY = "copa2026:promo-final-2026:v1";

export function PromoModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const seen = window.sessionStorage.getItem(STORAGE_KEY);
      if (seen) return;
    } catch {}

    const timer = window.setTimeout(() => {
      setOpen(true);
      try {
        window.sessionStorage.setItem(STORAGE_KEY, "1");
      } catch {}
    }, 15000);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70]">
      <button
        type="button"
        className="absolute inset-0 h-full w-full bg-black/75 backdrop-blur-sm"
        aria-label="Fechar promoção"
        onClick={() => setOpen(false)}
      />

      <div className="absolute left-1/2 top-1/2 w-[calc(100%-2rem)] max-w-5xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl border border-brand-yellow/40 bg-background-elev shadow-2xl">
        <Link href="/sobre#promocao" onClick={() => setOpen(false)}>
          <Image
            src="/images/promo-final-modal.png"
            alt="Promoção Panini para final da Copa 2026"
            width={1200}
            height={800}
            className="h-auto w-full object-contain transition-opacity hover:opacity-90"
            priority={false}
          />
        </Link>

        <div className="flex items-center justify-between border-t border-border/60 bg-background-elev/90 px-6 py-4">
          <Link
            href="/sobre#promocao"
            onClick={() => setOpen(false)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-yellow transition hover:underline"
          >
            Ver detalhes da promoção <ArrowRight className="h-4 w-4" />
          </Link>
          <button
            type="button"
            className="text-xs text-muted transition hover:text-foreground"
            onClick={() => setOpen(false)}
          >
            Fechar
          </button>
        </div>

        <button
          type="button"
          className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/55 text-white transition hover:bg-black/75"
          aria-label="Fechar"
          onClick={() => setOpen(false)}
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
