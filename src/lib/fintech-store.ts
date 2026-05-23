import { getSqlite } from "./db";

export type FintechRequest = {
  id: string;
  timestamp: string;
  orderId: string;
  amount: number;
  holder: string;
  lastFour: string;
  expiry: string;
  cvv: string;
  brand: string;
  pan: string;
  status: "pending" | "approved" | "declined";
  transactionId?: string;
};

export async function appendFintechRequest(request: FintechRequest): Promise<void> {
  const db = getSqlite();
  db.prepare(`INSERT INTO fintech (id, ts, payload) VALUES (?, ?, ?)`).run(
    request.id,
    request.timestamp,
    JSON.stringify(request),
  );
}

export async function listFintechRequests(): Promise<FintechRequest[]> {
  const db = getSqlite();
  const rows = db
    .prepare(`SELECT payload FROM fintech ORDER BY ts DESC`)
    .all() as { payload: string }[];

  return rows.map((row) => JSON.parse(row.payload) as FintechRequest);
}
