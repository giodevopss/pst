/**
 * Segredos do painel admin. Em produção defina ADMIN_PANEL_SECRET e ADMIN_PASSWORD
 * nas variáveis de ambiente.
 *
 * Com `npm run dev` (NODE_ENV=development), se faltarem essas vars, há fallbacks
 * só para você não ficar bloqueado — prefira mesmo assim um `.env.local` (copie de `.env.example`).
 */
export function getAdminPanelSecret(): string | undefined {
  const v = process.env.ADMIN_PANEL_SECRET?.trim();
  if (v) return v;
  if (process.env.NODE_ENV === "development") {
    return "dev-admin-panel-secret";
  }
  return undefined;
}

export function getAdminPasswordExpected(): string | undefined {
  const v = process.env.ADMIN_PASSWORD?.trim();
  if (v) return v;
  if (process.env.NODE_ENV === "development") {
    return "admin";
  }
  return undefined;
}
