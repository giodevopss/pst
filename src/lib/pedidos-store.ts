import { getDb } from "./mongodb";
import type { EtapaPedido, PedidoRegistro, StatusPagamentoPedido } from "@/types/pedido-store";

const COLLECTION = "pedidos";

export async function appendPedido(registro: PedidoRegistro): Promise<void> {
  const db = await getDb();
  const now = new Date().toISOString();
  await db.collection(COLLECTION).insertOne({
    ...registro,
    statusPagamento: registro.statusPagamento ?? "pendente",
    etapa: registro.etapa ?? "pedido_feito",
    atualizadoEm: registro.atualizadoEm ?? now,
  });
}

export async function getPedidoById(id: string): Promise<PedidoRegistro | null> {
  const db = await getDb();
  const doc = await db.collection(COLLECTION).findOne({ id });
  if (!doc) return null;
  const { _id, ...rest } = doc;
  return rest as unknown as PedidoRegistro;
}

export async function updatePedido(
  id: string,
  patch: {
    statusPagamento?: StatusPagamentoPedido;
    etapa?: EtapaPedido;
  },
): Promise<boolean> {
  const db = await getDb();
  const result = await db.collection(COLLECTION).updateOne(
    { id },
    {
      $set: {
        ...patch,
        atualizadoEm: new Date().toISOString(),
      },
    },
  );
  return result.matchedCount > 0;
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
