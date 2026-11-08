"use client";

import Script from "next/script";
import { useEffect, useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { Button } from "./ui";

/**
 * Ads are OFF unless NEXT_PUBLIC_ADSENSE_CLIENT (e.g. "ca-pub-123…") is set, and never load before the visitor consents.
 * NOTE: for EU/UK traffic Google requires a certified consent platform (TCF). This banner is a minimal stand-in:
 * swap it for Google Funding Choices / Cookiebot / Usercentrics before enabling ads in production.
 */
const CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
const KEY = "pitchside.ads-consent";
const listeners = new Set<() => void>();

function read(): "granted" | "denied" | null {
  try {
    const v = window.localStorage.getItem(KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}
function write(v: "granted" | "denied") {
  try {
    window.localStorage.setItem(KEY, v);
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
}
function useConsent() {
  return useSyncExternalStore(
    (cb) => (listeners.add(cb), () => listeners.delete(cb)),
    read,
    () => "denied" as const, // server: treat as no consent
  );
}

/** Footer link that lets visitors change their mind: forgets the choice so the banner asks again. */
export function CookieSettingsLink({ label }: { label: string }) {
  if (!CLIENT) return null;
  return (
    <button
      type="button" className="text-muted hover:text-fg"
      onClick={() => { try { window.localStorage.removeItem(KEY); } catch { /* ignore */ } listeners.forEach((l) => l()); }}
    >{label}</button>
  );
}

export function ConsentBanner() {
  const t = useTranslations("ads");
  const consent = useConsent();
  if (!CLIENT || consent !== null) return null;
  return (
    <div role="dialog" aria-label={t("title")} className="fixed inset-x-3 bottom-3 z-50 mx-auto flex max-w-xl flex-col gap-3 rounded-2xl border border-line bg-surface p-4 shadow-lg sm:flex-row sm:items-center">
      <p className="text-sm text-muted">{t("body")}</p>
      <div className="flex shrink-0 gap-2">
        <Button variant="secondary" onClick={() => write("denied")}>{t("decline")}</Button>
        <Button onClick={() => write("granted")}>{t("accept")}</Button>
      </div>
    </div>
  );
}

export function AdSlot({ slot }: { slot?: string }) {
  const consent = useConsent();
  const enabled = Boolean(CLIENT && slot && consent === "granted");
  useEffect(() => {
    if (!enabled) return;
    try {
      ((window as unknown as { adsbygoogle?: unknown[] }).adsbygoogle ??= []).push({});
    } catch {
      /* ad blocked */
    }
  }, [enabled]);
  if (!enabled) return null;
  return (
    <aside aria-label="Advertisement" className="my-6 min-h-24 overflow-hidden text-center">
      <Script id="adsense" strategy="afterInteractive" crossOrigin="anonymous" src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${CLIENT}`} />
      <ins className="adsbygoogle block" data-ad-client={CLIENT} data-ad-slot={slot} data-ad-format="auto" data-full-width-responsive="true" />
    </aside>
  );
}
