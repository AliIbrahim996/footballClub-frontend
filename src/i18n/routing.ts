import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "ar"],
  defaultLocale: "en",
  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];
export const LOCALE_META: Record<Locale, { label: string; dir: "ltr" | "rtl"; og: string }> = {
  en: { label: "English", dir: "ltr", og: "en_US" },
  ar: { label: "العربية", dir: "rtl", og: "ar_AR" },
};
