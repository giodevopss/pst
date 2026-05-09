const enc = new TextEncoder();

async function sha256(data: string): Promise<string> {
  const hash = await crypto.subtle.digest("SHA-256", enc.encode(data));
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function hashPassword(plain: string): Promise<string> {
  const salt = crypto.randomUUID().replace(/-/g, "").slice(0, 16);
  const digest = await sha256(salt + plain);
  return `${salt}:${digest}`;
}

export async function verifyPassword(
  plain: string,
  stored: string,
): Promise<boolean> {
  const [salt, digest] = stored.split(":");
  if (!salt || !digest) return false;
  const check = await sha256(salt + plain);
  return check === digest;
}
