import { getDb } from "./mongodb";
import type { PedidoRegistro } from "@/types/pedido-store";

const COLLECTION = "pedidos";

export async function appendPedido(registro: PedidoRegistro): Promise<void> {
  const db = await getDb();
  await db.collection(COLLECTION).insertOne({ ...registro });
}

export async function listPedidosRecent(limit = 300): Promise<PedidoRegistro[]> {
  const db = await getDb();
  const docs = await db
    .collection(COLLECTION)
    .find({})
    .sort({ criadoEm: -1 })
    .limit(limit)
    .toArray();

  return docs.map(({ _id, ...rest }) => rest as unknown as PedidoRegistro);
}
