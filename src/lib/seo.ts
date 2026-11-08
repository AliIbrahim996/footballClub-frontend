import { routing } from "@/i18n/routing";
import { BASE_PATH, SITE, TRAILING_SLASH } from "./site";

/** canonical + hreflang alternates for a localized public path ("" for home). Aware of a sub-path deployment (GitHub project pages). */
export function alternates(locale: string, path = "") {
  const url = (l: string) => `${BASE_PATH}/${l}${path}${TRAILING_SLASH}`;
  return {
    canonical: url(locale),
    languages: {
      ...Object.fromEntries(routing.locales.map((l) => [l, url(l)])),
      "x-default": url(routing.defaultLocale),
    },
  };
}

/** Absolute URL for a site path; SITE.url may itself include a sub-path. */
export const absolute = (path: string) => `${SITE.url.replace(/\/+$/, "")}${path}`;
