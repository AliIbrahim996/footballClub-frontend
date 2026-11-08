import { routing } from "@/i18n/routing";
import { SITE } from "./site";

/** canonical + hreflang alternates for a localized public path ("" for home). */
export function alternates(locale: string, path = "") {
  return {
    canonical: `/${locale}${path}`,
    languages: {
      ...Object.fromEntries(routing.locales.map((l) => [l, `/${l}${path}`])),
      "x-default": `/${routing.defaultLocale}${path}`,
    },
  };
}

export const absolute = (path: string) => new URL(path, SITE.url).toString();
