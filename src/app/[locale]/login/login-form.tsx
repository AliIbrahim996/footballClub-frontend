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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: f.get("username"), password: f.get("password") }),
    }).catch(() => null);
    if (!res?.ok) {
      setError(res && res.status < 500 ? t("invalid") : t("unavailable"));
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
