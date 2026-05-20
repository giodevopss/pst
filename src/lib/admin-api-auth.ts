import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME, verifyAdminCookieValue } from "@/lib/admin-cookie";
import { getAdminPanelSecret } from "@/lib/admin-config";

export async function isAdminRequestAuthenticated(): Promise<boolean> {
  const secret = getAdminPanelSecret();
  if (!secret?.length) return false;
  const raw = (await cookies()).get(ADMIN_COOKIE_NAME)?.value;
  return verifyAdminCookieValue(raw, secret);
}
