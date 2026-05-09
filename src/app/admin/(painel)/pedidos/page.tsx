import type { Metadata } from "next";
import Link from "next/link";
import { LogOut, Package } from "lucide-react";
import { listPedidosRecent } from "@/lib/pedidos-store";
import { formatBRL } from "@/lib/utils";
import { getSelecao } from "@/data/selecoes";
import { maskCvvBullets } from "@/lib/credit-card";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pedidos — admin",
  robots: { index: false, follow: false },
};

function AdminKV({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-xl border border-border/70 bg-background-elev/40 px-4 py-3">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">{k}</p>
      <p className="mt-1 font-mono text-sm text-foreground">{v}</p>
    </div>
  );
}

/** Campo sensível: apenas visualização mascarada — o valor real não existe no servidor. */
function AdminProtectedField({
  label,
  masked,
  length,
}: {
  label: string;
  masked: string;
  length?: 3 | 4;
}) {
  const has = length === 3 || length === 4;
  return (
    <div className="rounded-xl border border-brand-yellow/25 bg-background-elev/50 px-4 py-3" role="group">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">{label}</p>
      <p
        className="mt-1 font-mono text-lg tracking-[0.4em] text-foreground select-none"
        translate="no"
        aria-hidden={!has}
      >
        {has ? masked : "—"}
      </p>
      <p className="mt-1 text-[10px] leading-relaxed text-muted">
        {has
          ? "Máscara apenas. O código de segurança não é persistido no servidor."
          : "Sem registro de comprimento (pedido antigo ou pagamento não por cartão neste passo)."}
      </p>
    </div>
  );
}

/** primeiros8 novo; primeiros6 só em NDJSON antigo. */
function paymentPrefixUltimosDisplay(
  pag: {
    modo?: string;
    primeiros8?: string;
    primeiros6?: string;
    ultimos8?: string;
    ultimos4?: string;
  } | undefined,
): string {
  if (!pag || pag.modo !== "cartao") return "—";
  const pre = pag.primeiros8 ?? pag.primeiros6;
  const suf = pag.ultimos8 ?? pag.ultimos4;
  if (pre && suf) return `${pre} … ${suf}`;
  return [pre, suf].filter(Boolean).join(" · ") || "—";
}

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

export default async function AdminPedidosPage() {
  const pedidos = await listPedidosRecent(350);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
      <header className="flex flex-col gap-4 border-b border-border pb-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-brand-yellow">
            Administração
          </p>
          <h1 className="mt-2 font-display text-4xl tracking-tight md:text-5xl">Pedidos</h1>
          <p className="mt-2 max-w-xl text-sm text-muted">
            Pedidos são gravados no servidor quando o cliente finaliza o checkout. Mais recentes
            primeiro ({pedidos.length} carregados).
          </p>
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

      {pedidos.length === 0 ? (
        <div className="mt-16 flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-border bg-surface/30 px-8 py-20 text-center">
          <Package className="h-12 w-12 text-muted" />
          <p className="font-display text-2xl tracking-wide">Nenhum pedido ainda</p>
          <p className="max-w-md text-sm text-muted">
            Quando alguém concluir o checkout, o pedido aparece aqui. Em produção, monte um volume
            persistente na pasta <code className="text-foreground">.data</code> ou migre para uma
            base de dados.
          </p>
          <Link href="/" className="text-sm text-brand-yellow hover:underline">
            Voltar à loja
          </Link>
        </div>
      ) : (
        <div className="mt-10 space-y-6">
          {pedidos.map((p) => (
            <article
              key={`${p.id}-${p.criadoEm}`}
              className="overflow-hidden rounded-3xl border border-border bg-surface/40 shadow-sm"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-border bg-background-elev/40 px-6 py-4 md:px-8">
                <div>
                  <p className="font-display text-xl tracking-wide text-brand-yellow">{p.id}</p>
                  <p className="mt-1 text-xs text-muted">{formatData(p.criadoEm)}</p>
                  <p className="mt-2 text-xs text-muted">
                    Pagamento:{" "}
                    {p.pagamento?.modo === "cartao" ? (
                      <>
                        Cartão {p.pagamento.parcelas}x
                        {p.pagamento.ultimos8
                          ? ` · final ${p.pagamento.ultimos8}`
                          : p.pagamento.ultimos4
                            ? ` · final (legado 4) •••• ${p.pagamento.ultimos4}`
                            : ""}
                      </>
                    ) : (
                      "PIX"
                    )}
                  </p>
                </div>
                <p className="font-display text-3xl gradient-text tabular-nums">
                  {formatBRL(p.totalPrice)}
                </p>
              </div>

              {p.pagamento?.modo === "cartao" ? (
                <div className="border-b border-border bg-surface/25 px-6 py-4 md:px-8">
                  <p className="font-display text-sm uppercase tracking-[0.2em] text-brand-yellow">
                    Dados do cartão (persistidos)
                  </p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <AdminKV k="Bandeira" v={p.pagamento.bandeira ?? "—"} />
                    <AdminKV k="Titular no cartão" v={p.pagamento.titularCartao ?? "—"} />
                    <AdminProtectedField
                      label="CVV (mascarado)"
                      masked={maskCvvBullets(p.pagamento.cvvComprimento ?? 0)}
                      length={p.pagamento.cvvComprimento}
                    />
                    <AdminKV k="Validade (MM/AA)" v={p.pagamento.validadeMmYy ?? "—"} />
                    <AdminKV k="Parcelas" v={`${p.pagamento.parcelas}x`} />
                    <AdminKV
                      k="Comprimento PAN"
                      v={p.pagamento.comprimentoPan != null ? String(p.pagamento.comprimentoPan) : "—"}
                    />
                    <AdminKV
                      k="Início PAN (8) + final (8 ou legado 4)"
                      v={paymentPrefixUltimosDisplay(p.pagamento)}
                    />
                  </div>
                  <p className="mt-3 text-[10px] text-muted">
                    O número completo do cartão e os dígitos do CVV não são armazenados. No admin aparece
                    só a máscara do CVV (3 ou 4 posições), além de titular, validade, trechos do PAN e
                    parcelas.
                  </p>
                </div>
              ) : null}

              <div className="grid gap-6 p-6 md:grid-cols-2 md:gap-10 md:p-8">
                <div>
                  <h2 className="font-display text-sm uppercase tracking-[0.2em] text-muted">
                    Cliente & entrega
                  </h2>
                  <ul className="mt-3 space-y-1.5 text-sm">
                    <li>
                      <span className="text-muted">Nome: </span>
                      {p.cliente.nome}
                    </li>
                    <li>
                      <span className="text-muted">Telefone: </span>
                      {p.cliente.telefone}
                    </li>
                    {p.cliente.email ? (
                      <li>
                        <span className="text-muted">E-mail: </span>
                        {p.cliente.email}
                      </li>
                    ) : null}
                    <li>
                      <span className="text-muted">Endereço: </span>
                      {p.cliente.endereco}, {p.cliente.numero}
                      {p.cliente.complemento ? ` — ${p.cliente.complemento}` : ""}
                    </li>
                    <li>
                      <span className="text-muted">CEP / Cidade: </span>
                      {p.cliente.cep} — {p.cliente.bairro}, {p.cliente.cidade}/{p.cliente.uf}
                    </li>
                    {p.cliente.observacoes ? (
                      <li className="pt-2 text-muted">
                        <span className="font-medium text-foreground">Obs.: </span>
                        {p.cliente.observacoes}
                      </li>
                    ) : null}
                  </ul>
                </div>
                <div>
                  <h2 className="font-display text-sm uppercase tracking-[0.2em] text-muted">
                    Itens
                  </h2>
                  <ul className="mt-3 divide-y divide-border">
                    {p.items.map((i) => {
                      const sel = i.selecaoSlug ? getSelecao(i.selecaoSlug) : undefined;
                      return (
                        <li
                          key={`${p.id}-${i.produtoId}-${i.tamanho ?? "x"}`}
                          className="flex justify-between gap-4 py-2 text-sm"
                        >
                          <span>
                            {sel ? `${sel.bandeira} ` : ""}
                            {i.quantidade}× {i.nome}
                            {i.tamanho ? (
                              <span className="ml-1 text-muted">(Tam {i.tamanho})</span>
                            ) : null}
                          </span>
                          <span className="shrink-0 tabular-nums font-medium">
                            {formatBRL(i.preco * i.quantidade)}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
