"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button, Card, Field, Input, inputCls } from "@/components/ui";
import { Link } from "@/i18n/navigation";
import { ApiError, call, fieldErrors } from "@/lib/client";

export function ContactForm({ locale, initialMessage }: { locale: string; initialMessage: string }) {
  const t = useTranslations("contact");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    setErrors({});
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    try {
      await call("/contact", { method: "POST", json: { ...f, locale } });
      setState("sent");
    } catch (err) {
      const fe = fieldErrors(err);
      setErrors(fe);
      setState(err instanceof ApiError && err.status === 429 ? "error" : Object.keys(fe).length ? "idle" : "error");
    }
  }

  if (state === "sent") {
    return (
      <Card className="p-6" role="status">
        <h2 className="font-semibold">{t("success")}</h2>
        <p className="mt-1 text-sm text-muted">{t("successHint")}</p>
      </Card>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={t("name")} error={errors.name}><Input name="name" required maxLength={120} autoComplete="name" /></Field>
        <Field label={t("email")} error={errors.email}><Input name="email" type="email" required autoComplete="email" /></Field>
      </div>
      <Field label={t("club")} error={errors.club}><Input name="club" maxLength={255} autoComplete="organization" /></Field>
      <Field label={t("message")} error={errors.message}>
        <textarea name="message" required maxLength={4000} rows={6} defaultValue={initialMessage} className={`${inputCls} h-auto py-2`} />
      </Field>
      {/* Honeypot: hidden from people and assistive tech; bots tend to fill it in. */}
      <div aria-hidden className="absolute -start-[9999px] h-0 w-0 overflow-hidden">
        <label>Website <input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>
      {state === "error" && <p role="alert" className="text-sm text-danger">{t("error")}</p>}
      <Button type="submit" disabled={state === "sending"}>{state === "sending" ? t("sending") : t("send")}</Button>
      <p className="text-xs text-muted">
        {t.rich("privacy", { link: (chunks) => <Link href="/privacy" className="underline underline-offset-2">{chunks}</Link> })}
      </p>
    </form>
  );
}
