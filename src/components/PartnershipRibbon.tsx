import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { PANINI_FIFA_2026_URL } from "@/config/panini";

export function PartnershipRibbon() {
  return (
    <div className="relative z-40 border-b border-white/10 bg-surface text-center">
      <p className="mx-auto max-w-4xl px-4 py-2 text-[11px] leading-snug text-muted md:text-xs">
        <span className="font-semibold text-foreground">
          Coleção oficial Panini — FIFA World Cup 2026™
        </span>
        · Esta loja trabalha em{" "}
        <span className="text-brand-yellow">parceria com a Panini</span> para oferecer{" "}
        <span className="text-foreground/90">
          os mesmos lançamentos de álbum, envelopes, boxes e cartas Adrenalyn XL™{" "}
        </span>
        divulgados em{" "}
        <Link
          href={PANINI_FIFA_2026_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-medium text-brand-cyan underline decoration-brand-cyan/40 underline-offset-2 hover:text-brand-yellow hover:decoration-brand-yellow"
        >
          ver na loja Panini
          <ExternalLink className="h-3 w-3 shrink-0 opacity-70" aria-hidden />
        </Link>
        .
      </p>
    </div>
  );
}
