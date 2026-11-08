"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button, Field, Input } from "@/components/ui";
import { useRouter } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { call, fieldErrors } from "@/lib/client";
import { LEGAL_VERSION } from "@/lib/legal";

export function RegisterForm() {
  const t = useTranslations("register");
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setErrors({});
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    try {
      await call("/auth/register", { method: "POST", json: { ...f, accept_terms: f.accept_terms === "on", terms_version: LEGAL_VERSION } });
      router.replace("/dashboard");
      router.refresh();
    } catch (err) {
      setErrors(fieldErrors(err));
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Field label={t("club")} error={errors.club_name}><Input name="club_name" required autoFocus maxLength={255} /></Field>
      <Field label={t("username")} error={errors.username}><Input name="username" autoComplete="username" required /></Field>
      <Field label={t("email")} error={errors.email}><Input name="email" type="email" autoComplete="email" required /></Field>
      <Field label={t("password")} error={errors.password}><Input name="password" type="password" autoComplete="new-password" required minLength={8} /></Field>
      <div>
        <label className="flex items-start gap-2 text-sm">
          <input type="checkbox" name="accept_terms" required className="mt-1 size-4 accent-[var(--accent)]" />
          <span>
            {t.rich("acceptTerms", {
              terms: (c) => <Link href="/terms" target="_blank" className="font-medium text-accent underline underline-offset-2">{c}</Link>,
              privacy: (c) => <Link href="/privacy" target="_blank" className="font-medium text-accent underline underline-offset-2">{c}</Link>,
            })}
          </span>
        </label>
        {errors.accept_terms && <p className="mt-1 text-xs text-danger">{errors.accept_terms}</p>}
      </div>
      {errors.detail && <p role="alert" className="text-sm text-danger">{errors.detail}</p>}
      <Button type="submit" disabled={busy} className="w-full">{busy ? t("creating") : t("submit")}</Button>
      <p className="text-xs text-muted">{t("trialNote")}</p>
    </form>
  );
}
