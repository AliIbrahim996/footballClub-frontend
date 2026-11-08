"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui";
import { call } from "@/lib/client";

export function BillingActions({ status, configured }: { status: string; configured: boolean }) {
  const t = useTranslations("billing");
  const [busy, setBusy] = useState<"checkout" | "portal" | null>(null);
  const [error, setError] = useState("");

  async function go(kind: "checkout" | "portal") {
    setBusy(kind);
    setError("");
    try {
      const { url } = await call<{ url: string }>(`/billing/${kind}/`, { method: "POST" });
      window.location.href = url;
    } catch {
      setError(t("error"));
      setBusy(null);
    }
  }

  if (!configured) return <p className="mt-4 text-sm text-muted">{t("notConfigured")}</p>;
  return (
    <div className="mt-5 space-y-2">
      <div className="flex flex-wrap gap-2">
        {status !== "active" && <Button onClick={() => go("checkout")} disabled={busy !== null}>{busy === "checkout" ? t("redirecting") : t("subscribe")}</Button>}
        {status !== "trialing" && <Button variant="secondary" onClick={() => go("portal")} disabled={busy !== null}>{t("manage")}</Button>}
      </div>
      {error && <p role="alert" className="text-sm text-danger">{error}</p>}
    </div>
  );
}
