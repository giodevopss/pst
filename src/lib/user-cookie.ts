const COOKIE_NAME = "copa_user";
export const USER_COOKIE_NAME = COOKIE_NAME;

const SECRET_FALLBACK =
  process.env.NODE_ENV === "development" ? "dev-user-secret-copa2026" : "";

function getUserSecret(): string {
  return process.env.USER_SESSION_SECRET || SECRET_FALLBACK;
}

function enc(s: string) {
  return new TextEncoder().encode(s);
}

async function hmacSha256B64Url(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    enc(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const buf = await crypto.subtle.sign("HMAC", key, enc(message));
  const bytes = new Uint8Array(buf);
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]!);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export async function createUserCookieValue(email: string): Promise<string> {
  const secret = getUserSecret();
  if (!secret) throw new Error("USER_SESSION_SECRET not configured");
  const expirySec = Math.floor(Date.now() / 1000) + 30 * 24 * 3600;
  const payload = `${expirySec}|${email}`;
  const sig = await hmacSha256B64Url(secret, payload);
  return `${payload}.${sig}`;
}

export async function verifyUserCookie(
  raw: string | undefined,
): Promise<string | null> {
  const secret = getUserSecret();
  if (!raw || !secret) return null;
  const lastDot = raw.lastIndexOf(".");
  if (lastDot < 1) return null;
  const payload = raw.slice(0, lastDot);
  const sig = raw.slice(lastDot + 1);

  const [expSec, email] = payload.split("|");
  if (!expSec || !email || !/^\d+$/.test(expSec)) return null;
  if (Number(expSec) < Math.floor(Date.now() / 1000)) return null;

  const expected = await hmacSha256B64Url(secret, payload);

  if (sig.length !== expected.length) return null;
  let diff = 0;
  for (let i = 0; i < sig.length; i++) {
    diff |= sig.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0 ? email : null;
}
