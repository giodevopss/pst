import Link from "next/link";

export function AdminPainelNav() {
  return (
    <nav
      className="flex flex-wrap gap-2 text-sm font-medium"
      aria-label="Seções do painel admin"
    >
      <Link
        href="/admin/pedidos"
        className="rounded-full border border-border bg-surface/50 px-4 py-1.5 text-muted transition hover:border-brand-yellow hover:text-brand-yellow"
      >
        Pedidos
      </Link>
      <Link
        href="/admin/lojistas-mensagens"
        className="rounded-full border border-border bg-surface/50 px-4 py-1.5 text-muted transition hover:border-brand-yellow hover:text-brand-yellow"
      >
        Lojistas · mensagens
      </Link>
    </nav>
  );
}
