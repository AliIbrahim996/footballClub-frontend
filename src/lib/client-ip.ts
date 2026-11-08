import "server-only";

/** Real client address for the API's rate limiting (Django trusts NUM_PROXIES entries of X-Forwarded-For). */
export function forwardedFor(request: Request): string | null {
  return request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip");
}
