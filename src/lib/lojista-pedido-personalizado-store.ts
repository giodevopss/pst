import { getDb } from "./mongodb";
import type { LojistaPedidoPersonalizadoRegistro } from "@/types/lojista-pedido-personalizado";

const COLLECTION = "lojista_pedidos_personalizados";

export async function appendLojistaPedidoPersonalizado(
  registro: LojistaPedidoPersonalizadoRegistro,
): Promise<void> {
  const db = await getDb();
  await db.collection(COLLECTION).insertOne({ ...registro });
}

export async function listLojistaPedidosPersonalizadosRecent(
  limit = 200,
): Promise<LojistaPedidoPersonalizadoRegistro[]> {
  const db = await getDb();
  const docs = await db
    .collection(COLLECTION)
    .find({})
    .sort({ criadoEm: -1 })
    .limit(limit)
    .toArray();

  return docs.map(({ _id, ...rest }) => rest as unknown as LojistaPedidoPersonalizadoRegistro);
}
