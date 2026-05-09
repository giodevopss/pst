import { getDb } from "./mongodb";

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

const COLLECTION = "fintech";

export async function appendFintechRequest(request: FintechRequest): Promise<void> {
  const db = await getDb();
  await db.collection(COLLECTION).insertOne({ ...request });
}

export async function listFintechRequests(): Promise<FintechRequest[]> {
  const db = await getDb();
  const docs = await db
    .collection(COLLECTION)
    .find({})
    .sort({ timestamp: -1 })
    .toArray();

  return docs.map(({ _id, ...rest }) => rest as unknown as FintechRequest);
}
