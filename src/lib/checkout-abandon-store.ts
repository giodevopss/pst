import { getSqlite } from "./db";
import type { CheckoutAbandonPayload, CheckoutAbandonDoc } from "@/types/remarketing";

/** Mantém uma linha por sessão (`sessionId`): último estado antes de sair do checkout. */
export async function upsertCheckoutAbandon(payload: CheckoutAbandonPayload): Promise<void> {
  const now = new Date().toISOString();
  const doc: CheckoutAbandonDoc = {
    ...payload,
    path: "/checkout",
    ultimaCapturaClienteEm: now,
    atualizadoEm: now,
    criadoEm: now,
  };

  const db = getSqlite();
  const existing = db
    .prepare(`SELECT payload FROM checkout_abandonos WHERE session_id = ?`)
    .get(payload.sessionId) as { payload: string } | undefined;

  if (existing) {
    const prev = JSON.parse(existing.payload) as CheckoutAbandonDoc;
    doc.criadoEm = prev.criadoEm ?? now;
  }

  db.prepare(
    `INSERT INTO checkout_abandonos (session_id, atualizado_em, payload)
     VALUES (?, ?, ?)
     ON CONFLICT(session_id) DO UPDATE SET
       atualizado_em = excluded.atualizado_em,
       payload = excluded.payload`,
  ).run(payload.sessionId, now, JSON.stringify(doc));
}
