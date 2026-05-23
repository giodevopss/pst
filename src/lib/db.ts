import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import { initSqliteSchema } from "@/lib/sqlite-schema";

let db: Database.Database | null = null;

/** Diretório de dados: Fly volume `/data` ou `./data` em dev. */
export function resolveDataDir(): string {
  const raw = process.env.DATA_DIR?.trim();
  if (raw) return raw;
  if (process.env.NODE_ENV === "production") return "/data";
  return path.join(process.cwd(), "data");
}

export function resolveDbPath(): string {
  return path.join(resolveDataDir(), "copa2026.db");
}

export function getSqlite(): Database.Database {
  if (db) return db;

  const dir = resolveDataDir();
  fs.mkdirSync(dir, { recursive: true });

  const filePath = resolveDbPath();
  db = new Database(filePath);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  initSqliteSchema(db);

  return db;
}

/** Fecha conexão (testes / shutdown). */
export function closeSqlite(): void {
  if (db) {
    db.close();
    db = null;
  }
}
