"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LogOut,
  MapPin,
  Package,
  Save,
  ShoppingBag,
  User,
} from "lucide-react";
import { formatBRL } from "@/lib/utils";
import type { UsuarioPublico } from "@/types/usuario";
import type { PedidoRegistro } from "@/types/pedido-store";

export function ContaClient({
  usuario,
  pedidos,
}: {
  usuario: UsuarioPublico;
  pedidos: PedidoRegistro[];
}) {
  const router = useRouter();
  const [nome, setNome] = useState(usuario.nome);
  const [telefone, setTelefone] = useState(usuario.telefone);
  const [end, setEnd] = useState({
    cep: usuario.endereco?.cep ?? "",
    endereco: usuario.endereco?.endereco ?? "",
    numero: usuario.endereco?.numero ?? "",
    complemento: usuario.endereco?.complemento ?? "",
    bairro: usuario.endereco?.bairro ?? "",
    cidade: usuario.endereco?.cidade ?? "",
    uf: usuario.endereco?.uf ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/usuarios/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, telefone, endereco: end }),
        credentials: "same-origin",
      });
      if (res.ok) setSaved(true);
    } catch {}
    setSaving(false);
    setTimeout(() => setSaved(false), 3000);
  }

  async function handleLogout() {
    await fetch("/api/usuarios/logout", {
      method: "POST",
      credentials: "same-origin",
    }).catch(() => {});
    router.push("/");
    router.refresh();
  }

  const updateEnd = (key: string, val: string) =>
    setEnd((prev) => ({ ...prev, [key]: val }));

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-20" />
      <div className="pointer-events-none absolute -left-28 top-0 h-72 w-72 rounded-full bg-brand-green/20 blur-[120px]" />
      <div className="pointer-events-none absolute -right-24 top-32 h-80 w-80 rounded-full bg-brand-yellow/15 blur-[140px]" />

      <div className="relative mx-auto max-w-5xl px-4 py-16 md:px-8 md:py-20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-brand-yellow">
              Minha conta
            </p>
            <h1 className="mt-2 font-display text-4xl tracking-tight md:text-5xl">
              Olá, <span className="gradient-text">{usuario.nome.split(" ")[0]}</span>
            </h1>
            <p className="mt-2 text-sm text-muted">{usuario.email}</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface/40 px-4 py-2 text-xs font-medium text-muted transition hover:text-foreground"
          >
            <LogOut className="h-3.5 w-3.5" /> Sair
          </button>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {/* Profile */}
          <div className="rounded-3xl border border-border bg-surface/40 p-6">
            <div className="flex items-center gap-2 text-brand-yellow">
              <User className="h-5 w-5" />
              <h2 className="font-display text-xl tracking-wide">Dados pessoais</h2>
            </div>
            <div className="mt-5 space-y-4">
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-muted">Nome completo</span>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="form-input"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-muted">Telefone (WhatsApp)</span>
                <input
                  type="tel"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  className="form-input"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-muted">E-mail</span>
                <input
                  type="email"
                  value={usuario.email}
                  disabled
                  className="form-input cursor-not-allowed opacity-60"
                />
              </label>
            </div>
          </div>

          {/* Address */}
          <div className="rounded-3xl border border-border bg-surface/40 p-6">
            <div className="flex items-center gap-2 text-brand-green">
              <MapPin className="h-5 w-5" />
              <h2 className="font-display text-xl tracking-wide">Endereço</h2>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-6">
              <label className="flex flex-col gap-1.5 sm:col-span-2">
                <span className="text-xs font-medium text-muted">CEP</span>
                <input
                  type="text"
                  value={end.cep}
                  onChange={(e) =>
                    updateEnd(
                      "cep",
                      e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 8)
                        .replace(/(\d{5})(\d)/, "$1-$2"),
                    )
                  }
                  placeholder="00000-000"
                  className="form-input"
                />
              </label>
              <label className="flex flex-col gap-1.5 sm:col-span-4">
                <span className="text-xs font-medium text-muted">Endereço</span>
                <input
                  type="text"
                  value={end.endereco}
                  onChange={(e) => updateEnd("endereco", e.target.value)}
                  className="form-input"
                />
              </label>
              <label className="flex flex-col gap-1.5 sm:col-span-2">
                <span className="text-xs font-medium text-muted">Número</span>
                <input
                  type="text"
                  value={end.numero}
                  onChange={(e) => updateEnd("numero", e.target.value)}
                  className="form-input"
                />
              </label>
              <label className="flex flex-col gap-1.5 sm:col-span-4">
                <span className="text-xs font-medium text-muted">Complemento</span>
                <input
                  type="text"
                  value={end.complemento}
                  onChange={(e) => updateEnd("complemento", e.target.value)}
                  className="form-input"
                />
              </label>
              <label className="flex flex-col gap-1.5 sm:col-span-3">
                <span className="text-xs font-medium text-muted">Bairro</span>
                <input
                  type="text"
                  value={end.bairro}
                  onChange={(e) => updateEnd("bairro", e.target.value)}
                  className="form-input"
                />
              </label>
              <label className="flex flex-col gap-1.5 sm:col-span-2">
                <span className="text-xs font-medium text-muted">Cidade</span>
                <input
                  type="text"
                  value={end.cidade}
                  onChange={(e) => updateEnd("cidade", e.target.value)}
                  className="form-input"
                />
              </label>
              <label className="flex flex-col gap-1.5 sm:col-span-1">
                <span className="text-xs font-medium text-muted">UF</span>
                <input
                  type="text"
                  value={end.uf}
                  onChange={(e) => updateEnd("uf", e.target.value.slice(0, 2).toUpperCase())}
                  className="form-input uppercase"
                />
              </label>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="btn-primary"
          >
            <Save className="h-4 w-4" />
            {saving ? "Salvando..." : "Salvar alterações"}
          </button>
          {saved && (
            <span className="text-sm font-medium text-brand-green">Dados atualizados!</span>
          )}
        </div>

        {/* Orders */}
        <div className="mt-12">
          <div className="flex items-center gap-2 text-brand-yellow">
            <Package className="h-5 w-5" />
            <h2 className="font-display text-2xl tracking-wide">Meus pedidos</h2>
          </div>

          {pedidos.length === 0 ? (
            <div className="mt-6 flex flex-col items-center gap-3 rounded-3xl border border-border bg-surface/40 p-10 text-center">
              <ShoppingBag className="h-10 w-10 text-muted" />
              <p className="text-muted">Nenhum pedido ainda.</p>
              <Link href="/album" className="btn-primary">
                Começar pelo álbum
              </Link>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {pedidos.map((p) => (
                <div
                  key={p.id}
                  className="rounded-2xl border border-border bg-surface/40 p-5"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div>
                      <span className="font-mono text-sm font-semibold text-brand-yellow">
                        {p.id}
                      </span>
                      <span className="ml-3 text-xs text-muted">
                        {new Date(p.criadoEm).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <span className="font-display text-lg gradient-text">
                      {formatBRL(p.totalPrice)}
                    </span>
                  </div>
                  <ul className="mt-3 space-y-1 text-sm text-muted">
                    {p.items.map((item, idx) => (
                      <li key={idx}>
                        {item.quantidade}× {item.nome}
                        {item.tamanho && ` (${item.tamanho})`}
                      </li>
                    ))}
                  </ul>
                  {p.pagamento && (
                    <p className="mt-2 text-xs text-muted">
                      Pagamento:{" "}
                      {p.pagamento.modo === "pix"
                        ? "PIX"
                        : `Cartão ${p.pagamento.modo === "cartao" && p.pagamento.bandeira ? `(${p.pagamento.bandeira})` : ""}`}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
