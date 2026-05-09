import { getDb } from "./mongodb";
import type { Usuario } from "@/types/usuario";

const COLLECTION = "usuarios";

export async function findByEmail(email: string): Promise<Usuario | null> {
  const db = await getDb();
  const normalized = email.trim().toLowerCase();
  const doc = await db.collection(COLLECTION).findOne({ email: normalized });
  if (!doc) return null;
  const { _id, ...rest } = doc;
  return rest as unknown as Usuario;
}

export async function createUsuario(user: Usuario): Promise<void> {
  const db = await getDb();
  await db.collection(COLLECTION).insertOne({ ...user });
}

export async function updateUsuario(
  email: string,
  patch: Partial<Omit<Usuario, "id" | "email" | "senhaHash" | "criadoEm">>,
): Promise<Usuario | null> {
  const db = await getDb();
  const normalized = email.trim().toLowerCase();
  const result = await db.collection(COLLECTION).findOneAndUpdate(
    { email: normalized },
    { $set: { ...patch, atualizadoEm: new Date().toISOString() } },
    { returnDocument: "after" },
  );
  if (!result) return null;
  const { _id, ...rest } = result;
  return rest as unknown as Usuario;
}

export async function listUsuarios(limit = 300): Promise<Usuario[]> {
  const db = await getDb();
  const docs = await db
    .collection(COLLECTION)
    .find({})
    .sort({ criadoEm: -1 })
    .limit(limit)
    .toArray();

  return docs.map(({ _id, ...rest }) => rest as unknown as Usuario);
}
