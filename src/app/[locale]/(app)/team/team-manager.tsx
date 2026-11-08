"use client";

import { Copy, Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { Button, Card, Field, Input, inputCls } from "@/components/ui";
import { useRouter } from "@/i18n/navigation";
import { call, fieldErrors } from "@/lib/client";
import type { TeamData } from "@/lib/types";

export function TeamManager({ team, isOwner, username }: { team: TeamData; isOwner: boolean; username: string }) {
  const t = useTranslations("team");
  const locale = useLocale();
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const full = team.seats_used >= team.seats_limit;
  const link = (token: string) => `${window.location.origin}/${locale}/join?token=${token}`;

  async function invite(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setErrors({});
    const form = e.currentTarget;
    const f = Object.fromEntries(new FormData(form)) as Record<string, string>;
    try {
      await call("/team/invites/", { method: "POST", json: f });
      form.reset();
      router.refresh();
    } catch (err) {
      setErrors(fieldErrors(err));
    }
    setBusy(false);
  }

  async function remove(path: string, confirm?: string) {
    if (confirm && !window.confirm(confirm)) return;
    await call(path, { method: "DELETE" });
    router.refresh();
  }

  async function copy(token: string) {
    await navigator.clipboard.writeText(link(token));
    setCopied(token);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="space-y-6">
        <Card className="p-5">
          <h2 className="mb-3 font-semibold">{t("members")}</h2>
          <ul className="divide-y divide-line">
            {team.members.map((m) => (
              <li key={m.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{m.username}{m.username === username && <span className="ms-2 text-xs text-muted">({t("you")})</span>}</p>
                  <p className="truncate text-xs text-muted">{m.email}</p>
                </div>
                <span className="rounded-full bg-surface-2 px-2.5 py-1 text-xs">{t(`roles.${m.role}`)}</span>
                {isOwner && m.role !== "owner" && (
                  <button aria-label={t("remove")} onClick={() => remove(`/team/members/${m.id}/`, t("confirmRemove", { name: m.username }))} className="grid size-9 place-items-center rounded-lg text-danger hover:bg-danger/10">
                    <Trash2 size={16} />
                  </button>
                )}
              </li>
            ))}
          </ul>
        </Card>

        {team.invites.length > 0 && (
          <Card className="p-5">
            <h2 className="mb-3 font-semibold">{t("pending")}</h2>
            <ul className="divide-y divide-line">
              {team.invites.map((i) => (
                <li key={i.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0"><p className="truncate text-sm">{i.email}</p><p className="text-xs text-muted">{t(`roles.${i.role}`)}</p></div>
                  {isOwner && (
                    <div className="flex gap-1">
                      <Button variant="secondary" className="h-9 px-3 text-xs" onClick={() => copy(i.token)}><Copy size={14} aria-hidden /> {copied === i.token ? t("copied") : t("copyLink")}</Button>
                      <button aria-label={t("revoke")} onClick={() => remove(`/team/invites/${i.id}/`)} className="grid size-9 place-items-center rounded-lg text-danger hover:bg-danger/10"><Trash2 size={16} /></button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </Card>
        )}
      </div>

      {isOwner ? (
        <Card className="h-fit p-5">
          <h2 className="mb-3 font-semibold">{t("invite")}</h2>
          <form onSubmit={invite} className="space-y-3">
            <Field label={t("email")} error={errors.email}><Input name="email" type="email" required disabled={full} /></Field>
            <Field label={t("role")}>
              <select name="role" defaultValue="coach" disabled={full} className={inputCls}>
                <option value="coach">{t("roles.coach")}</option>
                <option value="viewer">{t("roles.viewer")}</option>
              </select>
            </Field>
            {(errors.detail || full) && <p role="alert" className="text-sm text-danger">{errors.detail ?? t("seatsFull")}</p>}
            <Button type="submit" disabled={busy || full} className="w-full">{t("sendInvite")}</Button>
            <p className="text-xs text-muted">{t("inviteHint")}</p>
          </form>
        </Card>
      ) : (
        <p className="text-sm text-muted">{t("ownerOnly")}</p>
      )}
    </div>
  );
}
