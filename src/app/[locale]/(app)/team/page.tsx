import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { api } from "@/lib/server";
import type { Me, TeamData } from "@/lib/types";
import { PageHeader } from "@/components/ui";
import { TeamManager } from "./team-manager";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const t = await getTranslations({ locale: (await params).locale, namespace: "nav" });
  return { title: t("team") };
}

export default async function TeamPage({ params }: { params: Promise<{ locale: string }> }) {
  setRequestLocale((await params).locale);
  const t = await getTranslations("team");
  const [team, me] = await Promise.all([api<TeamData>("/team/"), api<Me>("/auth/me/")]);
  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle", { used: team.seats_used, limit: team.seats_limit })} />
      <TeamManager team={team} isOwner={me.club.role === "owner"} username={me.username} />
    </>
  );
}
