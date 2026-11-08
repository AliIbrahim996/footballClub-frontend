/** Browser-side helper: calls the same-origin proxy (`/api/...`), which attaches the auth token. */
export class ApiError extends Error {
  constructor(public status: number, public data: unknown) {
    super(typeof data === "object" && data && "detail" in data ? String((data as { detail: unknown }).detail) : `Request failed (${status})`);
  }
}

export async function call<T = unknown>(path: string, init: RequestInit & { json?: unknown } = {}): Promise<T> {
  const { json, headers, ...rest } = init;
  const res = await fetch(`/api${path}`, {
    ...rest,
    headers: { ...(json !== undefined ? { "Content-Type": "application/json" } : {}), ...headers },
    body: json !== undefined ? JSON.stringify(json) : rest.body,
  });
  if (res.status === 204) return undefined as T;
  const data = await res.json().catch(() => null);
  if (res.status === 401 && typeof window !== "undefined") window.location.href = `/${document.documentElement.lang || "en"}/login`;
  if (!res.ok) throw new ApiError(res.status, data);
  return data as T;
}

/** Flatten DRF field errors into a { field: message } map. */
export function fieldErrors(e: unknown): Record<string, string> {
  if (!(e instanceof ApiError) || typeof e.data !== "object" || !e.data) return {};
  return Object.fromEntries(
    Object.entries(e.data as Record<string, unknown>).map(([k, v]) => [k, Array.isArray(v) ? String(v[0]) : String(v)]),
  );
}

