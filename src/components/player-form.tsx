"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { call, fieldErrors } from "@/lib/client";
import type { Player } from "@/lib/types";
import { Button, Card, Field, Input } from "./ui";

const FIELDS = [
  ["first_name", "text", "firstName"], ["name", "text", "lastName"],
  ["date_of_birth", "date", "dob"], ["email_address", "email", "email"],
  ["phone_number", "tel", "phone"], ["society", "text", "club"],
  ["address", "text", "address"], ["post_code", "text", "postCode"], ["city", "text", "city"],
] as const;

export function PlayerForm({ player }: { player?: Player }) {
  const t = useTranslations("players");
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setErrors({});
    const fd = new FormData(e.currentTarget);
    if (!(fd.get("image") as File)?.size) fd.delete("image");
    try {
      const saved = await call<Player>(player ? `/players/${player.id}/` : "/players/", { method: player ? "PATCH" : "POST", body: fd });
      router.replace(`/players/${saved.id}`);
      router.refresh();
    } catch (err) {
      setErrors(fieldErrors(err));
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-3xl space-y-5">
      <Card className="grid gap-4 p-5 sm:grid-cols-2">
        {FIELDS.map(([name, type, label]) => (
          <Field key={name} label={t(`form.${label}`)} error={errors[name]}>
            <Input name={name} type={type} defaultValue={player?.[name] ?? ""} required={name !== "phone_number"} />
          </Field>
        ))}
        <div className="sm:col-span-2">
          <Field label={t("form.photo")} error={errors.image}>
            <input
              name="image" type="file" accept="image/*"
              className="block w-full text-sm text-muted file:me-3 file:h-10 file:cursor-pointer file:rounded-lg file:border-0 file:bg-accent-soft file:px-4 file:font-medium file:text-accent"
            />
          </Field>
        </div>
      </Card>
      {errors.detail && <p role="alert" className="text-sm text-danger">{errors.detail}</p>}
      <div className="flex gap-2">
        <Button type="submit" disabled={busy}>{busy ? t("form.saving") : t("form.save")}</Button>
        <Button type="button" variant="ghost" onClick={() => router.back()}>{t("form.cancel")}</Button>
      </div>
    </form>
  );
}
