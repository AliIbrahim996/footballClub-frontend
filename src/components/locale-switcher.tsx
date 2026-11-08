"use client";

import { Languages } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { LOCALE_META, routing, type Locale } from "@/i18n/routing";

export function LocaleSwitcher({ className = "" }: { className?: string }) {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("common");

  return (
    <label className={`relative inline-flex items-center ${className}`}>
      <span className="sr-only">{t("language")}</span>
      <Languages size={16} aria-hidden className="pointer-events-none absolute start-3 text-muted" />
      <select
        value={locale}
        onChange={(e) => router.replace(pathname + window.location.search, { locale: e.target.value as Locale })}
        className="h-10 cursor-pointer appearance-none rounded-lg border border-line bg-surface ps-9 pe-3 text-sm focus:border-accent focus:outline-none"
      >
        {routing.locales.map((l) => (
          <option key={l} value={l}>{LOCALE_META[l].label}</option>
        ))}
      </select>
    </label>
  );
}
