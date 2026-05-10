import { getDb } from "./mongodb";
import type { CheckoutAbandonPayload } from "@/types/remarketing";

const COLLECTION = "checkout_abandonos";

/** Mantém uma linha por sessão (`sessionId`): último estado antes de sair do checkout. */
export async function upsertCheckoutAbandon(payload: CheckoutAbandonPayload): Promise<void> {
  const now = new Date().toISOString();
  const db = await getDb();
  const col = db.collection(COLLECTION);

  const doc = {
    ...payload,
    path: "/checkout" as const,
    ultimaCapturaClienteEm: now,
    atualizadoEm: now,
  };

  await col.updateOne(
    { sessionId: payload.sessionId },
    {
      $set: doc,
      $setOnInsert: { criadoEm: now },
    },
    { upsert: true },
  );
}
