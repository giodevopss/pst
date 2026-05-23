import { getSqlite } from "./db";
import type { LojistaPedidoPersonalizadoRegistro } from "@/types/lojista-pedido-personalizado";

export async function appendLojistaPedidoPersonalizado(
  registro: LojistaPedidoPersonalizadoRegistro,
): Promise<void> {
  const db = getSqlite();
  db.prepare(
    `INSERT INTO lojista_pedidos_personalizados (id, criado_em, payload) VALUES (?, ?, ?)`,
  ).run(registro.id, registro.criadoEm, JSON.stringify(registro));
}

export async function listLojistaPedidosPersonalizadosRecent(
  limit = 200,
): Promise<LojistaPedidoPersonalizadoRegistro[]> {
  const db = getSqlite();
  const safeLimit = Math.max(1, Math.min(1000, Math.floor(limit)));
  const rows = db
    .prepare(
      `SELECT payload FROM lojista_pedidos_personalizados ORDER BY criado_em DESC LIMIT ?`,
    )
    .all(safeLimit) as { payload: string }[];

  return rows.map((row) => JSON.parse(row.payload) as LojistaPedidoPersonalizadoRegistro);
}
