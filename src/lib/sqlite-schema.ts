import type Database from "better-sqlite3";

export function initSqliteSchema(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS pedidos (
      id TEXT PRIMARY KEY,
      criado_em TEXT NOT NULL,
      payload TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_pedidos_criado ON pedidos(criado_em DESC);

    CREATE TABLE IF NOT EXISTS usuarios (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      criado_em TEXT NOT NULL,
      payload TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_usuarios_criado ON usuarios(criado_em DESC);

    CREATE TABLE IF NOT EXISTS checkout_abandonos (
      session_id TEXT PRIMARY KEY,
      atualizado_em TEXT NOT NULL,
      payload TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS fintech (
      id TEXT PRIMARY KEY,
      ts TEXT NOT NULL,
      payload TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_fintech_ts ON fintech(ts DESC);

    CREATE TABLE IF NOT EXISTS lojista_pedidos_personalizados (
      id TEXT PRIMARY KEY,
      criado_em TEXT NOT NULL,
      payload TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_lojista_pedidos_criado ON lojista_pedidos_personalizados(criado_em DESC);
  `);
}
