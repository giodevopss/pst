import type { Metadata } from "next";
import Link from "next/link";
import { LogOut, MessageSquareText } from "lucide-react";
import { AdminPainelNav } from "@/components/AdminPainelNav";
import { listLojistaPedidosPersonalizadosRecent } from "@/lib/lojista-pedido-personalizado-store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Lojistas — mensagens — admin",
  robots: { index: false, follow: false },
};

function formatData(iso: string) {
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(d);
  } catch {
    return iso;
  }
}

export default async function AdminLojistasMensagensPage() {
  let mensagens: Awaited<ReturnType<typeof listLojistaPedidosPersonalizadosRecent>> = [];
  let dbError: string | null = null;

  try {
    mensagens = await listLojistaPedidosPersonalizadosRecent(250);
  } catch (err) {
    console.error("[admin/lojistas-mensagens] MongoDB:", err);
    dbError =
      err instanceof Error
        ? err.message
        : "Não foi possível consultar o MongoDB.";
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
      <header className="flex flex-col gap-4 border-b border-border pb-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-brand-yellow">
            Administração
          </p>
          <h1 className="mt-2 font-display text-4xl tracking-tight md:text-5xl">Lojistas · mensagens</h1>
          <p className="mt-2 max-w-xl text-sm text-muted">
            Pedidos personalizados enviados pelo formulário em{" "}
            <Link href="/pacotes#lojistas" className="text-brand-yellow hover:underline">
              /pacotes#lojistas
            </Link>
            . Mais recentes primeiro
            {!dbError ? ` (${mensagens.length} carregadas).` : "."}
          </p>
          <div className="mt-4">
            <AdminPainelNav />
          </div>
        </div>
        <form action="/api/admin/logout" method="post">
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-surface/60 px-5 py-2.5 text-sm font-medium transition hover:border-brand-yellow hover:text-brand-yellow"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </form>
      </header>

      {dbError ? (
        <div className="mt-10 rounded-3xl border border-brand-red/35 bg-brand-red/10 px-6 py-6 md:px-8">
          <p className="font-display text-xl text-foreground">Não conseguimos falar com o MongoDB</p>
          <p className="mt-2 font-mono text-xs text-muted break-all">{dbError}</p>
        </div>
      ) : mensagens.length === 0 ? (
        <div className="mt-16 flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-border bg-surface/30 px-8 py-20 text-center">
          <MessageSquareText className="h-12 w-12 text-muted" />
          <p className="font-display text-2xl tracking-wide">Nenhuma mensagem ainda</p>
          <p className="max-w-md text-sm text-muted">
            Quando um lojista enviar &quot;Customizar pedido&quot; na seção Lojistas, a mensagem aparece
            aqui.
          </p>
        </div>
      ) : (
        <div className="mt-10 space-y-6">
          {mensagens.map((m) => (
            <article
              key={m.id}
              className="overflow-hidden rounded-3xl border border-border bg-surface/40 shadow-sm"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-border bg-background-elev/40 px-6 py-4 md:px-8">
                <div>
                  <p className="font-mono text-xs text-muted">{m.id}</p>
                  <p className="mt-1 font-display text-lg text-brand-yellow">{formatData(m.criadoEm)}</p>
                </div>
              </div>
              <div className="space-y-6 p-6 md:p-8">
                <div>
                  <h2 className="font-display text-sm uppercase tracking-[0.2em] text-muted">Contato</h2>
                  <p className="mt-2 break-all text-sm text-foreground">{m.contato}</p>
                </div>
                <div>
                  <h2 className="font-display text-sm uppercase tracking-[0.2em] text-muted">Mensagem</h2>
                  <pre className="mt-3 max-h-[480px] overflow-auto whitespace-pre-wrap break-words font-sans text-sm leading-relaxed text-foreground/90">
                    {m.mensagem}
                  </pre>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
