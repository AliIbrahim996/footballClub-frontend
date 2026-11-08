"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button, Field, Input } from "@/components/ui";
import { useRouter } from "@/i18n/navigation";
import { call, fieldErrors } from "@/lib/client";

export function JoinForm({ token }: { token: string }) {
  const t = useTranslations("join");
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setErrors({});
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    try {
      await call("/auth/accept-invite", { method: "POST", json: { ...f, token } });
      router.replace("/dashboard");
      router.refresh();
    } catch (err) {
      setErrors(fieldErrors(err));
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Field label={t("username")} error={errors.username}><Input name="username" autoComplete="username" required autoFocus /></Field>
      <Field label={t("password")} error={errors.password}><Input name="password" type="password" autoComplete="new-password" required minLength={8} /></Field>
      {errors.detail && <p role="alert" className="text-sm text-danger">{errors.detail}</p>}
      <Button type="submit" disabled={busy} className="w-full">{busy ? t("joining") : t("submit")}</Button>
    </form>
  );
}
