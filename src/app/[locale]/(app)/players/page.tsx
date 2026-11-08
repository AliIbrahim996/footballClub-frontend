import type { Metadata } from "next";
import { Search } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { api } from "@/lib/server";
import type { Paginated, Player } from "@/lib/types";
import { Avatar, Card, Empty, LinkButton, PageHeader } from "@/components/ui";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const t = await getTranslations({ locale: (await params).locale, namespace: "nav" });
  return { title: t("players") };
}

export default async function PlayersPage({
  params, searchParams,
}: { params: Promise<{ locale: string }>; searchParams: Promise<{ q?: string; page?: string }> }) {
  setRequestLocale((await params).locale);
  const t = await getTranslations("players");
  const { q = "", page = "1" } = await searchParams;
  const cur = Number(page) || 1;
  const data = await api<Paginated<Player>>(`/players/?search=${encodeURIComponent(q)}&page=${cur}`);
  const pages = Math.max(1, Math.ceil(data.count / 12));
  const href = (p: number) => `/players?${new URLSearchParams({ ...(q && { q }), page: String(p) })}`;

  return (
    <>
      <PageHeader title={t("title")} subtitle={t("inSquad", { count: data.count })} actions={<LinkButton href="/players/new">{t("add")}</LinkButton>} />
      <form role="search" className="relative mb-5 max-w-md">
        <Search size={16} aria-hidden className="absolute start-3 top-3 text-muted" />
        <input
          name="q" defaultValue={q} type="search" placeholder={t("searchPlaceholder")} aria-label={t("search")}
          className="h-10 w-full rounded-lg border border-line bg-surface ps-9 pe-3 text-sm focus:border-accent focus:outline-none"
        />
      </form>

      {data.results.length === 0 ? (
        <Empty title={q ? t("noMatch", { q }) : t("none")} action={<LinkButton href="/players/new">{t("add")}</LinkButton>} />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {data.results.map((p) => (
            <li key={p.id}>
              <Link href={`/players/${p.id}`} className="block transition-transform hover:-translate-y-0.5">
                <Card className="flex items-center gap-4 p-4">
                  <Avatar src={p.image} name={`${p.first_name} ${p.name}`} size={52} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{p.first_name} {p.name}</p>
                    <p className="truncate text-sm text-muted">{p.city} · {p.society}</p>
                  </div>
                  <div className="text-end">
                    <p className="font-mono text-lg font-semibold text-accent">{p.average_rating?.toFixed(1) ?? "–"}</p>
                    <p className="text-[11px] uppercase tracking-wide text-muted">{t("rating")}</p>
                  </div>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {pages > 1 && (
        <nav aria-label={t("pagination")} className="mt-6 flex items-center justify-center gap-3 text-sm">
          {cur > 1 && <Link className="rounded-lg border border-line px-3 py-2 hover:bg-surface-2" href={href(cur - 1)}>{t("prev")}</Link>}
          <span className="text-muted">{t("pageOf", { cur, pages })}</span>
          {cur < pages && <Link className="rounded-lg border border-line px-3 py-2 hover:bg-surface-2" href={href(cur + 1)}>{t("next")}</Link>}
        </nav>
      )}
    </>
  );
}
