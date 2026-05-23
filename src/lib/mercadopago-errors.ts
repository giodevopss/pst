/** Valida formato básico do Access Token antes de chamar a API. */
export function validateMercadoPagoAccessToken(token: string): string | null {
  const t = token.trim();
  if (!t) return "MERCADOPAGO_ACCESS_TOKEN não definido.";
  if (
    (t.startsWith('"') && t.endsWith('"')) ||
    (t.startsWith("'") && t.endsWith("'"))
  ) {
    return "O token parece incluir aspas extras. No Fly, use: fly secrets set MERCADOPAGO_ACCESS_TOKEN=APP_USR-... (sem aspas no valor).";
  }
  if (!/^APP_USR-/.test(t) && !/^TEST-/.test(t)) {
    return "O token deve começar com APP_USR- (produção) ou TEST- (sandbox). Copie em Suas integrações → Credenciais de produção.";
  }
  if (process.env.NODE_ENV === "production" && /^TEST-/.test(t)) {
    return "Em produção use credencial APP_USR- (produção), não TEST- (sandbox).";
  }
  return null;
}

type MpCause = { description?: string; code?: string };

/** Mensagem legível para o checkout / logs. */
export function formatMercadoPagoApiError(e: unknown): string {
  if (e && typeof e === "object") {
    const o = e as Record<string, unknown>;

    if (Array.isArray(o.cause)) {
      const parts = (o.cause as MpCause[])
        .map((c) => c.description || c.code)
        .filter((x): x is string => typeof x === "string" && x.length > 0);
      if (parts.length > 0) return parts.join("; ");
    }

    if (typeof o.message === "string" && o.message.length > 0) {
      if (/invalid json/i.test(o.message)) {
        return (
          "Mercado Pago retornou resposta inválida (token incorreto ou conta sem PIX). " +
          "Confira MERCADOPAGO_ACCESS_TOKEN no Fly: credencial de produção APP_USR-..., sem aspas, PIX ativo no painel."
        );
      }
      return o.message;
    }

    if (typeof o.error === "string" && o.error.length > 0) {
      if (o.error === "invalid_credentials" || o.error === "unauthorized") {
        return "Access Token do Mercado Pago inválido ou expirado. Gere um novo em Credenciais de produção (APP_USR-...).";
      }
      return o.error;
    }

    if (typeof o.status === "number" && o.status === 401) {
      return "Access Token do Mercado Pago recusado (401). Verifique APP_USR-... no app Fly correto (pst-gs1z4w).";
    }
  }

  const raw = e instanceof Error ? e.message : String(e);
  if (/invalid json/i.test(raw)) {
    return (
      "Mercado Pago retornou resposta inválida. Verifique MERCADOPAGO_ACCESS_TOKEN (APP_USR- produção) no Fly."
    );
  }
  return raw || "Erro ao comunicar com o Mercado Pago.";
}
