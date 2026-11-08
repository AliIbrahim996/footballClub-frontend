import { NextResponse, type NextRequest } from "next/server";
import { BACKEND_URL, TOKEN_COOKIE } from "@/lib/server";

/** Same-origin proxy to Django: attaches the httpOnly token so the browser never sees it. */
async function forward(request: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  const token = request.cookies.get(TOKEN_COOKIE)?.value;
  if (!token) return NextResponse.json({ detail: "Not authenticated." }, { status: 401 });

  const target = `${BACKEND_URL}/api/${path.join("/")}/${request.nextUrl.search}`;
  const headers = new Headers({ Authorization: `Token ${token}` });
  const lang = request.headers.get("accept-language");
  if (lang) headers.set("accept-language", lang);
  const type = request.headers.get("content-type");
  if (type) headers.set("content-type", type);

  const hasBody = !["GET", "HEAD"].includes(request.method);
  const res = await fetch(target, {
    method: request.method,
    headers,
    body: hasBody ? await request.arrayBuffer() : undefined,
    cache: "no-store",
  });
  return new NextResponse(res.status === 204 ? null : res.body, {
    status: res.status,
    headers: { "content-type": res.headers.get("content-type") ?? "application/json" },
  });
}

export { forward as GET, forward as POST, forward as PUT, forward as PATCH, forward as DELETE };
