import { MongoClient, type Db } from "mongodb";

/** Prefer MONGODB_URI; Railway referencia o plugin Mongo como `MONGO_URL`. */
function resolveMongoUri(): string {
  const a = process.env.MONGODB_URI?.trim();
  if (a) return a;
  const b = process.env.MONGO_URL?.trim();
  if (b) return b;
  return "mongodb://localhost:27017";
}

const MONGODB_URI = resolveMongoUri();
const DB_NAME = process.env.MONGODB_DB || "copa2026";

let cached: { client: MongoClient; db: Db } | null = null;

export async function getDb(): Promise<Db> {
  if (cached) return cached.db;

  const client = new MongoClient(MONGODB_URI, {
    serverSelectionTimeoutMS: 10_000,
    connectTimeoutMS: 10_000,
    socketTimeoutMS: 45_000,
  });
  await client.connect();
  const db = client.db(DB_NAME);

  cached = { client, db };
  return db;
}

export async function getCollection<T extends Document = Document>(name: string) {
  const db = await getDb();
  return db.collection<T>(name);
}
