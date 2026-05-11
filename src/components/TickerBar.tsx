import { SITE_WIDE_DISCOUNT_PERCENT } from "@/lib/store-pricing";

const ITEMS = [
  "FIFA WORLD CUP 2026™ COLEÇÃO OFICIAL PANINI",
  "ÁLBUM E COMBOS PANINI — DISPONÍVEL",
  "980 FIGURINHAS · 68 CROMOS ESPECIAIS",
  "48 SELEÇÕES · EUA · MÉXICO · CANADÁ · 2026",
  "ENVELOPE OFICIAL: 7 CROMOS COMO NA PANINI",
  "STARTER PACK E ADRENALYN XL™",
  `${SITE_WIDE_DISCOUNT_PERCENT}% NA LOJA · EXTRA NO PIX AO FINALIZAR`,
  "ENVIO PARA TODO O BRASIL",
];

export function TickerBar() {
  const repeated = [...ITEMS, ...ITEMS, ...ITEMS];

  return (
    <div className="relative overflow-hidden border-b border-border bg-gradient-to-r from-brand-green via-brand-yellow to-brand-green text-[#06080f]">
      <div className="absolute inset-0 bg-noise opacity-30" />
      <div className="flex animate-ticker whitespace-nowrap py-2 font-display text-xs tracking-[0.28em] md:text-sm">
        {repeated.map((it, i) => (
          <span key={i} className="mx-8 inline-flex items-center gap-3">
            <span className="">{it}</span>
            <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-[#06080f]" />
          </span>
        ))}
      </div>
    </div>
  );
}
