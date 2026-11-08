import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/ui";
import { PlayerForm } from "@/components/player-form";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const t = await getTranslations({ locale: (await params).locale, namespace: "players" });
  return { title: t("add") };
}

export default async function NewPlayerPage({ params }: { params: Promise<{ locale: string }> }) {
  setRequestLocale((await params).locale);
  const t = await getTranslations("players");
  return (
    <>
      <PageHeader title={t("add")} />
      <PlayerForm />
    </>
  );
}
