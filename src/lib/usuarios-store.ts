import { getSqlite } from "./db";
import type { Usuario } from "@/types/usuario";

export async function findByEmail(email: string): Promise<Usuario | null> {
  const db = getSqlite();
  const normalized = email.trim().toLowerCase();
  const row = db.prepare(`SELECT payload FROM usuarios WHERE email = ?`).get(normalized) as
    | { payload: string }
    | undefined;
  if (!row) return null;
  return JSON.parse(row.payload) as Usuario;
}

export async function createUsuario(user: Usuario): Promise<void> {
  const db = getSqlite();
  db.prepare(
    `INSERT INTO usuarios (id, email, criado_em, payload) VALUES (?, ?, ?, ?)`,
  ).run(user.id, user.email.trim().toLowerCase(), user.criadoEm, JSON.stringify(user));
}

export async function updateUsuario(
  email: string,
  patch: Partial<Omit<Usuario, "id" | "email" | "senhaHash" | "criadoEm">>,
): Promise<Usuario | null> {
  const existing = await findByEmail(email);
  if (!existing) return null;

  const updated: Usuario = {
    ...existing,
    ...patch,
    atualizadoEm: new Date().toISOString(),
  };

  const db = getSqlite();
  db.prepare(`UPDATE usuarios SET payload = ? WHERE email = ?`).run(
    JSON.stringify(updated),
    email.trim().toLowerCase(),
  );
  return updated;
}

export async function listUsuarios(limit = 300): Promise<Usuario[]> {
  const db = getSqlite();
  const safeLimit = Math.max(1, Math.min(1000, Math.floor(limit)));
  const rows = db
    .prepare(`SELECT payload FROM usuarios ORDER BY criado_em DESC LIMIT ?`)
    .all(safeLimit) as { payload: string }[];

  return rows.map((row) => JSON.parse(row.payload) as Usuario);
}
