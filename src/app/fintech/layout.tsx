import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE_NAME, verifyAdminCookieValue } from "@/lib/admin-cookie";
import { getAdminPanelSecret } from "@/lib/admin-config";

export const dynamic = "force-dynamic";

export default async function FintechLayout({ children }: { children: React.ReactNode }) {
  const secret = getAdminPanelSecret();
  if (!secret?.length) {
    return (
      <section className="mx-auto max-w-lg px-4 py-24 text-center text-muted">
        <p className="text-foreground">
          Painel fintech não configurado. Defina as variáveis de ambiente:
        </p>
        <ul className="mt-4 space-y-2 text-left text-sm">
          <li>
            <code className="text-brand-yellow">ADMIN_PANEL_SECRET</code> — segredo para assinar o cookie
          </li>
          <li>
            <code className="text-brand-yellow">ADMIN_PASSWORD</code> — senha de acesso
          </li>
        </ul>
        <p className="mt-6 text-xs text-muted">
          O painel fintech usa a mesma autenticação do admin.
        </p>
      </section>
    );
  }

  const raw = (await cookies()).get(ADMIN_COOKIE_NAME)?.value;
  const ok = await verifyAdminCookieValue(raw, secret);
  if (!ok) {
    const loginUrl = `/admin/login?next=${encodeURIComponent("/fintech")}`;
    redirect(loginUrl);
  }

  return children;
}
