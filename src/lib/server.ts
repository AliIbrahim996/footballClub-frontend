import "server-only";
import { cookies } from "next/headers";
import { getLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";

export const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8000";
export const TOKEN_COOKIE = "fc_token";

/** Fetch from the Django API on the server with the user's token. Redirects to /login when unauthenticated. */
export async function api<T>(path: string): Promise<T> {
  const token = (await cookies()).get(TOKEN_COOKIE)?.value;
  if (!token) redirect({ href: "/login", locale: await getLocale() });
  const res = await fetch(`${BACKEND_URL}/api${path}`, {
    headers: { Authorization: `Token ${token}` },
    cache: "no-store",
  });
  if (res.status === 401) redirect({ href: "/login", locale: await getLocale() });
  if (res.status === 404) throw new Error("not-found");
  if (!res.ok) throw new Error(`API ${res.status} for ${path}`);
  return res.json() as Promise<T>;
}

export async function hasSession() {
  return Boolean((await cookies()).get(TOKEN_COOKIE)?.value);
}


