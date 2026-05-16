import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Arredonda para a dezena de reais mais próxima (ex.: 33 → 30, 37 → 40). */
export function roundBRLDezenas(value: number): number {
  return Math.max(0, Math.round(value / 10) * 10);
}

/**
 * Preço de vitrine: dezena mais próxima menos R$ 0,01 (ex.: 60 → 59,99; 110 → 109,99).
 */
export function precoCharmDezena99(value: number): number {
  const d = roundBRLDezenas(value);
  if (d <= 0) return 0;
  return Math.round((d - 0.01) * 100) / 100;
}

export function formatBRL(value: number) {
  const v = precoCharmDezena99(value);
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(v);
}

/** Formata valor exato em BRL (ex.: preços fixos B2B sem charme .99). */
export function formatBRLExact(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.round(value * 100) / 100);
}

export function slugify(text: string) {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}
