import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { BACKEND_URL, TOKEN_COOKIE } from "@/lib/server";

export async function POST() {
  const jar = await cookies();
  const token = jar.get(TOKEN_COOKIE)?.value;
  if (token) {
    await fetch(`${BACKEND_URL}/api/auth/logout/`, { method: "POST", headers: { Authorization: `Token ${token}` } }).catch(() => {});
  }
  const out = NextResponse.json({ ok: true });
  out.cookies.delete(TOKEN_COOKIE);
  return out;
}
