"use client";

import { useState } from "react";
import { MessageSquareText, SendHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

export function LojistaPedidoPersonalizadoForm() {
  const [contato, setContato] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErr(null);
    try {
      const res = await fetch("/api/lojista/pedido-personalizado", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contato, mensagem }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setErr(data.error ?? "Não foi possível enviar.");
        setStatus("err");
        return;
      }
      setStatus("ok");
      setContato("");
      setMensagem("");
    } catch {
      setErr("Falha de rede. Verifique sua conexão.");
      setStatus("err");
    }
  }

  return (
    <div className="mt-14 rounded-3xl border border-brand-cyan/25 bg-background-elev/30 p-6 shadow-inner md:p-10">
      <div className="flex flex-wrap items-start gap-4">
        <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-brand-cyan/35 bg-brand-cyan/10 text-brand-cyan">
          <MessageSquareText className="h-6 w-6" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-2xl tracking-tight text-foreground md:text-3xl">
            Customizar pedido
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
            Precisa de outro volume, prazo ou entrega? Envie uma mensagem.
          </p>
        </div>
      </div>

      {status === "ok" ? (
        <p
          className="mt-8 rounded-2xl border border-brand-green/30 bg-brand-green/10 px-4 py-4 text-sm text-foreground"
          role="status"
        >
          Recebemos seu pedido. Em breve retornamos pelo contato informado.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="mt-8 grid gap-5">
          <div>
            <label htmlFor="lojista-contato" className="text-xs font-semibold uppercase tracking-wider text-muted">
              Contato para resposta
            </label>
            <input
              id="lojista-contato"
              name="contato"
              type="text"
              autoComplete="email"
              placeholder="E-mail ou WhatsApp"
              required
              minLength={3}
              maxLength={200}
              value={contato}
              onChange={(e) => setContato(e.target.value)}
              className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none ring-brand-cyan/40 transition placeholder:text-muted/70 focus:border-brand-cyan/50 focus:ring-2"
            />
          </div>
          <div>
            <label htmlFor="lojista-mensagem" className="text-xs font-semibold uppercase tracking-wider text-muted">
              Mensagem / detalhes do pedido
            </label>
            <textarea
              id="lojista-mensagem"
              name="mensagem"
              required
              minLength={8}
              maxLength={8000}
              rows={5}
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              placeholder="Ex.: quantidade de caixas 1000 e 100, cidade/UF, prazo desejado…"
              className="mt-2 w-full resize-y rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none ring-brand-cyan/40 transition placeholder:text-muted/70 focus:border-brand-cyan/50 focus:ring-2"
            />
            <p className="mt-1.5 text-[11px] text-muted">{mensagem.length} / 8000</p>
          </div>

          {err ? (
            <p className="rounded-xl border border-brand-red/30 bg-brand-red/10 px-4 py-3 text-sm text-foreground">
              {err}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={status === "loading"}
            className={cn(
              "inline-flex items-center justify-center gap-2 self-start rounded-full border px-6 py-3 text-sm font-semibold transition",
              "border-brand-yellow/50 bg-brand-yellow/15 text-foreground hover:border-brand-yellow hover:bg-brand-yellow/25",
              "disabled:pointer-events-none disabled:opacity-50",
            )}
          >
            <SendHorizontal className="h-4 w-4" aria-hidden />
            {status === "loading" ? "Enviando…" : "Enviar mensagem"}
          </button>
        </form>
      )}
    </div>
  );
}
