import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminLoginForm } from "./AdminLoginForm";

export const metadata: Metadata = {
  title: "Painel admin — login",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16">
      <div className="overflow-hidden rounded-3xl border border-border bg-surface/40 p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-brand-yellow">
          Copa 2026 Store
        </p>
        <h1 className="mt-3 font-display text-3xl tracking-tight">Painel admin</h1>
        <p className="mt-2 text-sm text-muted">
          Entre com a senha para ver os pedidos registrados no servidor.
        </p>
        <Suspense fallback={<p className="mt-8 text-sm text-muted">Carregando…</p>}>
          <AdminLoginForm />
        </Suspense>
      </div>
    </section>
  );
}
