import type { Metadata } from "next";
import { Check } from "lucide-react";
import { getFormatter, getTranslations, setRequestLocale } from "next-intl/server";
import { api } from "@/lib/server";
import type { Me } from "@/lib/types";
import { Card, PageHeader } from "@/components/ui";
import { BillingActions } from "./billing-actions";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const t = await getTranslations({ locale: (await params).locale, namespace: "nav" });
  return { title: t("billing") };
}

export default async function BillingPage({
  params, searchParams,
}: { params: Promise<{ locale: string }>; searchParams: Promise<{ checkout?: string }> }) {
  setRequestLocale((await params).locale);
  const t = await getTranslations("billing");
  const fmt = await getFormatter();
  const { club } = await api<Me>("/auth/me/");
  const { checkout } = await searchParams;
  const date = (iso: string | null) => (iso ? fmt.dateTime(new Date(iso), { dateStyle: "long" }) : "–");
  const isOwner = club.role === "owner";

  return (
    <>
      <PageHeader title={t("title")} subtitle={club.name} />
      {checkout === "success" && <p role="status" className="mb-4 rounded-xl bg-accent-soft px-4 py-3 text-sm text-accent">{t("success")}</p>}
      {checkout === "cancelled" && <p role="status" className="mb-4 rounded-xl bg-surface-2 px-4 py-3 text-sm">{t("cancelled")}</p>}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <p className="text-xs uppercase tracking-wide text-muted">{t("status")}</p>
          <p className="mt-1 text-2xl font-semibold">{t(`states.${club.status}`)}</p>
          <dl className="mt-4 space-y-2 text-sm">
            {club.status === "trialing" && <div className="flex justify-between"><dt className="text-muted">{t("trialEnds")}</dt><dd>{date(club.trial_ends_at)}</dd></div>}
            {club.status !== "trialing" && <div className="flex justify-between"><dt className="text-muted">{club.status === "active" ? t("renews") : t("accessUntil")}</dt><dd>{date(club.current_period_end)}</dd></div>}
          </dl>
          {!club.entitled && <p className="mt-4 rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{t("blocked")}</p>}
          {!isOwner && <p className="mt-4 text-sm text-muted">{t("ownerOnly")}</p>}
          {isOwner && <BillingActions status={club.status} configured={club.billing_configured} />}
        </Card>

        <Card className="p-6">
          <h2 className="font-semibold">{t("includes")}</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {(["players", "ratings", "plans", "team", "share"] as const).map((k) => (
              <li key={k} className="flex gap-2"><Check size={16} className="mt-0.5 shrink-0 text-accent" aria-hidden />{t(`features.${k}`)}</li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-muted">{t("designerFree")}</p>
        </Card>
      </div>
    </>
  );
}
