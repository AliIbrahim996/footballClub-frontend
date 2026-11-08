"use client";

import { Link2, LinkIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { call } from "@/lib/client";
import { Button } from "./ui";

export function SharePlanButton({ planId, shareToken }: { planId: number; shareToken: string | null }) {
  const t = useTranslations("plans");
  const locale = useLocale();
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  async function share() {
    const token = shareToken ?? (await call<{ share_token: string }>(`/plans/${planId}/share/`, { method: "POST" })).share_token;
    await navigator.clipboard.writeText(`${window.location.origin}/${locale}/shared/${token}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    router.refresh();
  }

  async function stop() {
    await call(`/plans/${planId}/share/`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="flex items-center gap-1">
      <Button variant="secondary" className="h-9 px-3 text-xs" onClick={share}>
        <Link2 size={14} aria-hidden /> {copied ? t("linkCopied") : shareToken ? t("copyLink") : t("share")}
      </Button>
      {shareToken && (
        <button onClick={stop} aria-label={t("stopSharing")} title={t("stopSharing")} className="grid size-9 place-items-center rounded-lg text-muted hover:bg-surface-2">
          <LinkIcon size={14} className="opacity-70" />
        </button>
      )}
    </div>
  );
}
