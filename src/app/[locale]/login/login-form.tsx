"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button, Field, Input } from "@/components/ui";
import { useRouter } from "@/i18n/navigation";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const t = useTranslations("auth");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const f = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept-Language": document.documentElement.lang || "en" },
      body: JSON.stringify({ username: f.get("username"), password: f.get("password") }),
    }).catch(() => null);
    if (!res?.ok) {
      const reasons: Record<number, string> = { 400: t("invalid"), 403: t("noClub"), 429: t("tooMany") };
      setError((res && reasons[res.status]) || t("unavailable"));
      setBusy(false);
      return;
    }
    const next = params.get("next");
    router.replace(next && next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Field label={t("username")}><Input name="username" autoComplete="username" required autoFocus /></Field>
      <Field label={t("password")}><Input name="password" type="password" autoComplete="current-password" required /></Field>
      {error && <p role="alert" className="text-sm text-danger">{error}</p>}
      <Button type="submit" disabled={busy} className="w-full">{busy ? t("signingIn") : t("signIn")}</Button>
    </form>
  );
}
