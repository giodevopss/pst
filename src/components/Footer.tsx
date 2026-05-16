import Link from "next/link";
import { Mail } from "lucide-react";
import { Logo } from "./Logo";
import { InstagramIcon, TiktokIcon } from "./SocialIcons";
import { STORE_CONFIG } from "@/config/store";
import { PANINI_FIFA_2026_URL } from "@/config/panini";

export function Footer() {
  const ano = new Date().getFullYear();

  return (
    <footer className="relative mt-32 border-t border-border bg-background-elev/60">
      <div className="absolute inset-x-0 -top-px mx-auto h-px max-w-5xl bg-gradient-to-r from-transparent via-brand-yellow to-transparent" />

      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 md:grid-cols-4 md:px-8">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
            {STORE_CONFIG.tagline}. Produtos da categoria oficial Panini (álbum, envelopes, boxes e
            Adrenalyn XL™) mais camisas da Copa.
          </p>

          <div className="mt-6 flex items-center gap-3">
            <Link
              href={STORE_CONFIG.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted transition hover:border-brand-yellow hover:text-brand-yellow"
              aria-label="Instagram"
            >
              <InstagramIcon className="h-4 w-4" />
            </Link>
            <Link
              href={STORE_CONFIG.social.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted transition hover:border-brand-magenta hover:text-brand-magenta"
              aria-label="TikTok"
            >
              <TiktokIcon className="h-4 w-4" />
            </Link>
            <Link
              href={`mailto:${STORE_CONFIG.email}`}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted transition hover:border-brand-cyan hover:text-brand-cyan"
              aria-label="E-mail"
            >
              <Mail className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div>
          <h4 className="font-display text-lg tracking-wider text-foreground">Loja</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            <li><Link href="/album" className="hover:text-brand-yellow">Álbum oficial</Link></li>
            <li>
              <Link
                href={PANINI_FIFA_2026_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-brand-yellow"
              >
                Categoria oficial Panini
              </Link>
            </li>
            <li><Link href="/camisetas" className="hover:text-brand-yellow">Camisetas</Link></li>
            <li><Link href="/pacotes" className="hover:text-brand-yellow">Promoções</Link></li>
            <li><Link href="/checkout" className="hover:text-brand-yellow">Carrinho</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg tracking-wider text-foreground">Ajuda</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            <li><Link href="/sobre" className="hover:text-brand-yellow">Sobre a loja</Link></li>
            <li>
              <Link href={`mailto:${STORE_CONFIG.email}`} className="hover:text-brand-yellow">
                Contato por e-mail
              </Link>
            </li>
            <li><Link href="/sobre#frete" className="hover:text-brand-yellow">Frete e prazos</Link></li>
            <li><Link href="/sobre#trocas" className="hover:text-brand-yellow">Trocas e devoluções</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-muted md:flex-row md:px-8">
          <span>© Panini World Cup 2026 Store. Todos os direitos reservados.</span>
          <span>
            Parceria comercial com a coleção oficial Panini — FIFA World Cup 2026™, Adrenalyn XL™,
            Copa do Mundo™ e símbolos FIFA são marcas dos respectivos titulares.
          </span>
        </div>
      </div>
    </footer>
  );
}
