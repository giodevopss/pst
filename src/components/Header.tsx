"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ShoppingBag, Menu, User, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { useCart } from "@/lib/cart";

const NAV_ITEMS = [
  { href: "/album", label: "Álbum" },
  { href: "/camisetas", label: "Camisetas" },
  { href: "/pacotes", label: "Pacotes" },
  { href: "/sobre", label: "Sobre" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const { totalItems, open } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    fetch("/api/usuarios/me", { credentials: "same-origin" })
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { if (d?.usuario) setLoggedIn(true); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full min-w-0 transition-all duration-300",
        scrolled
          ? "border-b border-border bg-background/85 backdrop-blur-xl"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto flex min-h-16 max-w-7xl items-center gap-2 px-3 sm:min-h-20 sm:gap-3 sm:px-4 md:px-8">
        <div className="min-w-0 flex-1">
          <Logo />
        </div>

        <nav className="hidden shrink-0 items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group relative rounded-full px-4 py-2 text-sm font-medium text-muted transition-colors hover:text-foreground"
            >
              {item.label}
              <span className="absolute inset-x-4 -bottom-px h-px scale-x-0 bg-gradient-to-r from-brand-yellow to-brand-green transition-transform group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <ThemeToggle />
          <Link
            href="/conta"
            aria-label="Minha conta"
            className={cn(
              "relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border bg-surface/60 transition sm:h-11 sm:w-11",
              loggedIn
                ? "border-brand-green text-brand-green hover:bg-brand-green/10"
                : "border-border text-foreground hover:border-brand-yellow hover:text-brand-yellow",
            )}
          >
            <User className="h-[1.15rem] w-[1.15rem] sm:h-5 sm:w-5" />
          </Link>
          <button
            type="button"
            onClick={open}
            aria-label="Abrir carrinho"
            className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-surface/60 text-foreground transition hover:border-brand-yellow hover:text-brand-yellow sm:h-11 sm:w-11"
          >
            <ShoppingBag className="h-[1.15rem] w-[1.15rem] sm:h-5 sm:w-5" />
            {totalItems > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-yellow px-0.5 text-[10px] font-bold text-[#06080f] sm:-right-1.5 sm:-top-1.5 sm:h-5 sm:min-w-5 sm:px-1 sm:text-[11px]">
                {totalItems}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-surface/60 text-foreground sm:h-11 sm:w-11 md:hidden"
            aria-label="Abrir menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-[1.15rem] w-[1.15rem] sm:h-5 sm:w-5" /> : <Menu className="h-[1.15rem] w-[1.15rem] sm:h-5 sm:w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-[44] bg-black/50 backdrop-blur-[2px] md:hidden"
            aria-label="Fechar menu"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed inset-x-0 bottom-0 z-[45] max-h-[min(85dvh,calc(100dvh-env(safe-area-inset-top)-2rem))] overflow-y-auto overscroll-y-contain border-t border-border bg-background/98 px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-12px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl md:hidden">
            <nav className="mx-auto flex max-w-7xl flex-col">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-3 py-3.5 text-base font-medium text-foreground/90 transition hover:bg-white/5 hover:text-brand-yellow active:bg-white/10"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/conta"
                onClick={() => setMobileOpen(false)}
                className="mt-1 flex items-center gap-2 rounded-xl border-t border-border/50 px-3 py-3.5 text-base font-medium text-foreground/90 transition hover:bg-white/5 hover:text-brand-yellow"
              >
                <User className="h-4 w-4 shrink-0" />
                <span className="min-w-0 leading-snug">
                  {loggedIn ? "Minha conta" : "Entrar / Criar conta"}
                </span>
              </Link>
            </nav>
          </div>
        </>
      )}
    </header>
  );
}
