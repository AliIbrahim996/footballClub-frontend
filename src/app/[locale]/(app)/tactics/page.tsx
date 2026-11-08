import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { api } from "@/lib/server";
import type { Plan } from "@/lib/types";
import { PageHeader } from "@/components/ui";
import { TacticsBoard } from "@/components/board/tactics-board";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const t = await getTranslations({ locale: (await params).locale, namespace: "nav" });
  return { title: t("tactics") };
}

export default async function TacticsPage({
  params, searchParams,
}: { params: Promise<{ locale: string }>; searchParams: Promise<{ plan?: string }> }) {
  setRequestLocale((await params).locale);
  const t = await getTranslations("tactics");
  const { plan: planId } = await searchParams;
  const plan = planId ? await api<Plan>(`/plans/${Number(planId)}/`).catch(() => undefined) : undefined;
  return (
    <>
      <PageHeader title={t("title")} subtitle={plan ? plan.title || plan.comment : t("subtitle")} />
      {/* key forces a fresh editor when switching plans */}
      <TacticsBoard key={plan?.id ?? "new"} plan={plan} />
    </>
  );
}
