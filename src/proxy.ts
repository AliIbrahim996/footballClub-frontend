import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const intl = createMiddleware(routing);
const ACCOUNT_PAGES = /^\/(en|de|ar)\/(login|register|join|dashboard|players|plans|tactics|team|billing)(\/|$)/;
const PROTECTED = /^\/(en|de|ar)\/(dashboard|players|plans|tactics|team|billing)(\/|$)/;

/** Locale routing for every page + keep signed-out visitors out of the app. */
export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // Free "designer only" hosting has no backend: account pages do not exist, so send visitors to the home page.
  if (process.env.NEXT_PUBLIC_DESIGNER_ONLY === "1" && ACCOUNT_PAGES.test(pathname)) {
    return NextResponse.redirect(new URL(`/${pathname.split("/")[1]}`, request.url));
  }
  const m = PROTECTED.exec(pathname);
  if (m && !request.cookies.get("fc_token")) {
    const url = new URL(`/${m[1]}/login`, request.url);
    url.searchParams.set("next", pathname.replace(/^\/(en|de|ar)/, ""));
    return NextResponse.redirect(url);
  }
  return intl(request);
}

export const config = {
  // Everything except API routes, Next internals, media and files with an extension.
  matcher: ["/((?!api|_next|media|.*\\..*).*)"],
};
