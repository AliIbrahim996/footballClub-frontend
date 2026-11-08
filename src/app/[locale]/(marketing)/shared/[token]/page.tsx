import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getFormatter, getTranslations, setRequestLocale } from "next-intl/server";
import { AdSlot } from "@/components/ads";
import { LinkButton } from "@/components/ui";
import { BACKEND_URL } from "@/lib/server";
import type { SharedPlan } from "@/lib/types";

// Private-by-link pages: reachable by whoever has the URL, but kept out of search results.
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function SharedPlanPage({ params }: { params: Promise<{ locale: string; token: string }> }) {
  const { locale, token } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("shared");
  const fmt = await getFormatter();
  const res = await fetch(`${BACKEND_URL}/api/shared/${encodeURIComponent(token)}/`, { cache: "no-store" }).catch(() => null);
  if (!res?.ok) notFound();
  const plan: SharedPlan = await res.json();

  return (
    <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <p className="text-sm text-muted">{t("from", { club: plan.club_name })} · {fmt.dateTime(new Date(plan.created_at), { dateStyle: "medium" })}</p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight">{plan.title || plan.comment}</h1>
      {plan.title && plan.comment && <p className="mt-2 text-muted">{plan.comment}</p>}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={plan.image} alt={plan.title || plan.comment} className="mt-6 w-full rounded-2xl border border-line" />
      <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_DESIGNER} />
      <div className="mt-8 flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-surface p-5">
        <p className="flex-1 text-sm text-muted">{t("cta")}</p>
        <LinkButton href="/designer">{t("tryDesigner")}</LinkButton>
      </div>
    </section>
  );
}
