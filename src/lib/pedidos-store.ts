import { mkdir, appendFile, readFile } from "fs/promises";
import path from "path";
import type { PedidoRegistro } from "@/types/pedido-store";

const DATA_DIR = path.join(process.cwd(), ".data");
const PEDIDOS_FILE = path.join(DATA_DIR, "pedidos.ndjson");

export async function appendPedido(registro: PedidoRegistro): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await appendFile(PEDIDOS_FILE, `${JSON.stringify(registro)}\n`, "utf8");
}

export async function listPedidosRecent(limit = 300): Promise<PedidoRegistro[]> {
  try {
    const raw = await readFile(PEDIDOS_FILE, "utf8");
    const lines = raw
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    const parsed: PedidoRegistro[] = [];
    for (const line of lines) {
      try {
        parsed.push(JSON.parse(line) as PedidoRegistro);
      } catch {
        // skip corrupt line
      }
    }
    return parsed.slice(-limit).reverse();
  } catch {
    return [];
  }
}
