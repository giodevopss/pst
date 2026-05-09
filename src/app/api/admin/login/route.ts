import { timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, createAdminCookieValue } from "@/lib/admin-cookie";
import {
  adminSessionCookieOptions,
  getAdminPanelSecret,
  getAdminPasswordExpected,
} from "@/lib/admin-config";

function safeEqualPw(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

export async function POST(req: Request) {
  const expectedPw = getAdminPasswordExpected();
  const secret = getAdminPanelSecret();

  if (!expectedPw?.length || !secret?.length) {
    return NextResponse.json(
      { error: "Painel não configurado. Defina ADMIN_PASSWORD e ADMIN_PANEL_SECRET." },
      { status: 503 },
    );
  }

  let body: { password?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const password = typeof body.password === "string" ? body.password : "";

  if (!safeEqualPw(password, expectedPw)) {
    return NextResponse.json({ error: "Senha incorreta." }, { status: 401 });
  }

  const value = await createAdminCookieValue(secret);

  const res = NextResponse.json({ ok: true });
  res.cookies.set(
    ADMIN_COOKIE_NAME,
    value,
    adminSessionCookieOptions({ maxAgeSeconds: 2 * 24 * 3600 }),
  );
  return res;
}
