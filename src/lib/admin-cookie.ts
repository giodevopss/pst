/**
 * Cookie de sessão admin assinado com HMAC-SHA256 (Web Crypto).
 * Funciona em Edge (middleware) e em Node (Route Handlers).
 */

const COOKIE_NAME = "copa_admin";

export const ADMIN_COOKIE_NAME = COOKIE_NAME;

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

export async function createAdminCookieValue(secret: string): Promise<string> {
  const expirySec = Math.floor(Date.now() / 1000) + 2 * 24 * 3600;
  const sig = await hmacSha256B64Url(secret, String(expirySec));
  return `${expirySec}.${sig}`;
}

export async function verifyAdminCookieValue(raw: string | undefined, secret?: string): Promise<boolean> {
  if (!raw || !secret) return false;
  const dot = raw.indexOf(".");
  if (dot < 1) return false;
  const expSec = raw.slice(0, dot);
  const sig = raw.slice(dot + 1);
  if (!expSec || !sig || !/^\d+$/.test(expSec)) return false;
  if (Number(expSec) < Math.floor(Date.now() / 1000)) return false;

  const expect = await hmacSha256B64Url(secret, expSec);

  try {
    if (sig.length !== expect.length) return false;
    let diff = 0;
    for (let i = 0; i < sig.length; i++) {
      diff |= sig.charCodeAt(i) ^ expect.charCodeAt(i);
    }
    return diff === 0;
  } catch {
    return false;
  }
}
