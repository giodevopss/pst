import { getSqlite } from "./db";
import type { EtapaPedido, PedidoRegistro, StatusPagamentoPedido } from "@/types/pedido-store";

export async function appendPedido(registro: PedidoRegistro): Promise<void> {
  const db = getSqlite();
  const now = new Date().toISOString();
  const full: PedidoRegistro = {
    ...registro,
    statusPagamento: registro.statusPagamento ?? "pendente",
    etapa: registro.etapa ?? "pedido_feito",
    atualizadoEm: registro.atualizadoEm ?? now,
  };
  db.prepare(`INSERT INTO pedidos (id, criado_em, payload) VALUES (?, ?, ?)`).run(
    full.id,
    full.criadoEm,
    JSON.stringify(full),
  );
}

export async function getPedidoById(id: string): Promise<PedidoRegistro | null> {
  const db = getSqlite();
  const row = db.prepare(`SELECT payload FROM pedidos WHERE id = ?`).get(id) as
    | { payload: string }
    | undefined;
  if (!row) return null;
  return JSON.parse(row.payload) as PedidoRegistro;
}

export async function updatePedido(
  id: string,
  patch: {
    statusPagamento?: StatusPagamentoPedido;
    etapa?: EtapaPedido;
  },
): Promise<boolean> {
  const existing = await getPedidoById(id);
  if (!existing) return false;

  const updated: PedidoRegistro = {
    ...existing,
    ...patch,
    atualizadoEm: new Date().toISOString(),
  };

  const db = getSqlite();
  const result = db
    .prepare(`UPDATE pedidos SET payload = ? WHERE id = ?`)
    .run(JSON.stringify(updated), id);
  return result.changes > 0;
}

export async function listPedidosRecent(limit = 300): Promise<PedidoRegistro[]> {
  const db = getSqlite();
  const safeLimit = Math.max(1, Math.min(1000, Math.floor(limit)));
  const rows = db
    .prepare(`SELECT payload FROM pedidos ORDER BY criado_em DESC LIMIT ?`)
    .all(safeLimit) as { payload: string }[];

  return rows.map((row) => JSON.parse(row.payload) as PedidoRegistro);
}
