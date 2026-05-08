import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SoccerBall } from "@/components/SoccerBall";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-4 py-20 text-center md:px-8">
      <div className="mb-8 h-32 w-32 animate-spin-slow opacity-90">
        <SoccerBall />
      </div>
      <p className="text-xs font-semibold uppercase tracking-[0.4em] text-brand-yellow">
        Erro 404 · Bola fora
      </p>
      <h1 className="mt-3 font-display text-5xl leading-[0.95] tracking-tight md:text-7xl">
        ESSA PÁGINA<br />
        <span className="gradient-text">SAIU PELA LATERAL.</span>
      </h1>
      <p className="mt-5 max-w-lg text-muted">
        Volta pra cobrança do escanteio: conheça o álbum oficial ou veja todas as camisetas
        das seleções.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link href="/album" className="btn-primary">
          Conhecer o álbum
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link href="/" className="btn-secondary">
          Ir para a home
        </Link>
      </div>
    </section>
  );
}
