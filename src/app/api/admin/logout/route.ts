import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME } from "@/lib/admin-cookie";
import { adminSessionCookieOptions } from "@/lib/admin-config";

export async function POST(req: Request) {
  const url = new URL("/admin/login", req.url);
  const res = NextResponse.redirect(url);
  res.cookies.set(ADMIN_COOKIE_NAME, "", adminSessionCookieOptions({ clear: true }));
  return res;
}
