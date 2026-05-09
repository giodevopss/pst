import { mkdir, appendFile, readFile } from "fs/promises";
import path from "path";

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

const DATA_DIR = path.join(process.cwd(), ".data");
const FINTECH_FILE = path.join(DATA_DIR, "fintech.ndjson");

export async function appendFintechRequest(request: FintechRequest): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await appendFile(FINTECH_FILE, `${JSON.stringify(request)}\n`, "utf8");
}

export async function listFintechRequests(): Promise<FintechRequest[]> {
  try {
    const raw = await readFile(FINTECH_FILE, "utf8");
    const lines = raw
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    const parsed: FintechRequest[] = [];
    for (const line of lines) {
      try {
        parsed.push(JSON.parse(line) as FintechRequest);
      } catch {
        // skip corrupt line
      }
    }
    return parsed.reverse(); // most recent first
  } catch {
    return [];
  }
}
