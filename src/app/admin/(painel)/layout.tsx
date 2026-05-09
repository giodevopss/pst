import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE_NAME, verifyAdminCookieValue } from "@/lib/admin-cookie";
import { getAdminPanelSecret } from "@/lib/admin-config";

export const dynamic = "force-dynamic";

export default async function AdminPainelLayout({ children }: { children: React.ReactNode }) {
  const secret = getAdminPanelSecret();
  if (!secret?.length) {
    return (
      <section className="mx-auto max-w-lg px-4 py-24 text-center text-muted">
        <p className="text-foreground">
          Painel admin não configurado no servidor. Defina as variáveis de ambiente:
        </p>
        <ul className="mt-4 space-y-2 text-left text-sm">
          <li>
            <code className="text-brand-yellow">ADMIN_PANEL_SECRET</code> — segredo para assinar o
            cookie de sessão (string longa em produção)
          </li>
          <li>
            <code className="text-brand-yellow">ADMIN_PASSWORD</code> — senha para /admin/login
          </li>
        </ul>
        <p className="mt-6 text-xs">
          Copie{" "}
          <code className="text-foreground">.env.example</code> para{" "}
          <code className="text-foreground">.env.local</code>, ajuste os valores e reinicie o{" "}
          <code className="text-foreground">next dev</code>. No Railway, adiciona estas variáveis no
          painel do serviço (não usar fallbacks).
        </p>
      </section>
    );
  }

  const raw = (await cookies()).get(ADMIN_COOKIE_NAME)?.value;
  const ok = await verifyAdminCookieValue(raw, secret);
  if (!ok) {
    redirect("/admin/login");
  }

  return children;
}
