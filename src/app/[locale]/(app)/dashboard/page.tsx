import type { Metadata } from "next";
import { ClipboardList, Star, Target, Users } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { api } from "@/lib/server";
import type { Dashboard } from "@/lib/types";
import { Avatar, Card, Empty, LinkButton, PageHeader, RatingBar } from "@/components/ui";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const t = await getTranslations({ locale: (await params).locale, namespace: "nav" });
  return { title: t("dashboard") };
}

export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  setRequestLocale((await params).locale);
  const t = await getTranslations("dashboard");
  const d = await api<Dashboard>("/dashboard/");
  const stats = [
    { label: t("players"), value: d.players, icon: Users },
    { label: t("skills"), value: d.skills, icon: Target },
    { label: t("evaluations"), value: d.evaluations, icon: Star },
    { label: t("plans"), value: d.plans, icon: ClipboardList },
  ];
  return (
    <>
      <PageHeader
        title={t("title")}
        subtitle={t("subtitle")}
        actions={<><LinkButton href="/players/new" variant="secondary">{t("addPlayer")}</LinkButton><LinkButton href="/tactics">{t("newTactic")}</LinkButton></>}
      />
      <section aria-label={t("totals")} className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }, i) => (
          <Card key={label} className="rise p-4 sm:p-5" style={{ animationDelay: `${i * 60}ms` }}>
            <Icon size={18} className="text-accent" aria-hidden />
            <p className="mt-3 font-mono text-3xl font-semibold tabular-nums">{value}</p>
            <p className="text-sm text-muted">{label}</p>
          </Card>
        ))}
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        <Card className="p-5 lg:col-span-3">
          <h2 className="mb-4 font-semibold">{t("byCategory")}</h2>
          {d.category_averages.length === 0 ? <p className="text-sm text-muted">{t("noEvaluations")}</p> : (
            <ul className="space-y-4">
              {d.category_averages.map((c) => (
                <li key={c.category}>
                  <div className="mb-1 flex justify-between text-sm"><span>{c.category}</span><span className="text-muted">{t("ratingsCount", { count: c.count })}</span></div>
                  <RatingBar value={c.average} />
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card className="p-5 lg:col-span-2">
          <h2 className="mb-4 font-semibold">{t("topPlayers")}</h2>
          {d.top_players.length === 0 ? <p className="text-sm text-muted">{t("noRanking")}</p> : (
            <ol className="space-y-3">
              {d.top_players.map((p, i) => (
                <li key={p.id}>
                  <Link href={`/players/${p.id}`} className="-m-1 flex items-center gap-3 rounded-lg p-1 hover:bg-surface-2">
                    <span className="w-4 font-mono text-xs text-muted">{i + 1}</span>
                    <Avatar src={p.image} name={p.name} size={36} />
                    <span className="flex-1 truncate text-sm font-medium">{p.name}</span>
                    <span className="font-mono text-sm text-accent">{p.average.toFixed(1)}</span>
                  </Link>
                </li>
              ))}
            </ol>
          )}
        </Card>
      </div>

      <h2 className="mb-3 mt-8 font-semibold">{t("recentPlans")}</h2>
      {d.recent_plans.length === 0 ? (
        <Empty title={t("noPlans")} hint={t("noPlansHint")} action={<LinkButton href="/tactics">{t("openBoard")}</LinkButton>} />
      ) : (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {d.recent_plans.map((p) => (
            <Link key={p.id} href={`/tactics?plan=${p.id}`} className="overflow-hidden rounded-2xl border border-line bg-surface transition-transform hover:-translate-y-0.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.image} alt={p.title || p.comment} className="aspect-[4/3] w-full object-cover" />
              <p className="truncate p-3 text-sm font-medium">{p.title || p.comment}</p>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
