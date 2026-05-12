"use client";

import { useEffect, useState } from "react";
import { Info, MapPin, ShieldCheck, X } from "lucide-react";

type Props = {
  pedidoId: string;
  cidade?: string;
  uf?: string;
};

const STORAGE_PREFIX = "copa2026:pix-cpf-aviso:";

/**
 * Modal informando que o PIX é direcionado ao CPF do revendedor cadastrado
 * Panini mais próximo do endereço de entrega. Só aparece 1× por pedido.
 */
export function PixCpfAvisoModal({ pedidoId, cidade, uf }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!pedidoId) return;
    try {
      const k = STORAGE_PREFIX + pedidoId;
      if (window.sessionStorage.getItem(k)) return;
      setOpen(true);
    } catch {
      setOpen(true);
    }
  }, [pedidoId]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function close() {
    try {
      if (pedidoId) {
        window.sessionStorage.setItem(STORAGE_PREFIX + pedidoId, "1");
      }
    } catch {}
    setOpen(false);
  }

  if (!open) return null;

  const regiao =
    cidade && uf ? `${cidade}/${uf}` : uf ? uf : cidade ? cidade : "sua região";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pix-cpf-aviso-title"
      className="fixed inset-0 z-[100] flex items-center justify-center px-4"
    >
      <button
        type="button"
        aria-label="Fechar aviso"
        onClick={close}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-brand-yellow/40 bg-background-elev shadow-glow-yellow">
        <div className="flex items-start justify-between gap-3 border-b border-border bg-gradient-to-r from-brand-yellow/15 via-transparent to-brand-green/10 px-6 py-5">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-yellow/20 text-brand-yellow">
              <Info className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-brand-yellow">
                Antes de pagar
              </p>
              <h2
                id="pix-cpf-aviso-title"
                className="mt-1 font-display text-xl tracking-wide text-foreground md:text-2xl"
              >
                PIX para o revendedor cadastrado Panini
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={close}
            className="-m-1 rounded-full p-1 text-muted transition hover:bg-surface/60 hover:text-foreground"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 px-6 py-5 text-sm leading-relaxed text-muted">
          <p>
            <strong className="text-foreground">Atenção:</strong> o PIX pode ser direcionado a um{" "}
            <strong className="text-foreground">CPF de pessoa física</strong> — é o{" "}
            <strong className="text-foreground">revendedor cadastrado Panini mais próximo</strong>{" "}
            de você, definido pelo cálculo de frete da loja para sua região. O pedido segue
            registrado no site em nome da{" "}
            <strong className="text-foreground">Panini World Cup 2026</strong>.
          </p>
          <div className="flex items-start gap-2 rounded-2xl border border-border bg-surface/50 px-4 py-3 text-xs">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-cyan" />
            <span>
              Região atendida: <span className="text-foreground">{regiao}</span>
            </span>
          </div>
          <div className="flex items-start gap-2 rounded-2xl border border-brand-green/35 bg-brand-green/10 px-4 py-3 text-xs text-foreground/90">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" />
            <span>
              Pague apenas pelo QR/copia e cola desta tela. Nunca solicitamos PIX por mensagem
              fora do site.
            </span>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-border bg-surface/30 px-6 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={close}
            className="rounded-full bg-brand-yellow px-5 py-2.5 font-display text-xs font-bold uppercase tracking-[0.18em] text-[#06080f] shadow-glow-yellow transition hover:bg-brand-yellow/90"
          >
            Entendi, mostrar QR
          </button>
        </div>
      </div>
    </div>
  );
}
