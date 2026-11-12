import type { Metadata } from "next";
import { getFormatter, getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { api } from "@/lib/server";
import type { Paginated, Plan } from "@/lib/types";
import { Card, Empty, LinkButton, PageHeader, inputCls } from "@/components/ui";
import { DeleteButton } from "@/components/delete-button";
import { SharePlanButton } from "@/components/share-plan-button";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const t = await getTranslations({ locale: (await params).locale, namespace: "nav" });
  return { title: t("plans") };
}

export default async function PlansPage({
  params, searchParams,
}: { params: Promise<{ locale: string }>; searchParams: Promise<{ q?: string; manager?: string; tag?: string; page?: string }> }) {
  setRequestLocale((await params).locale);
  const t = await getTranslations("plans");
  const tt = await getTranslations("tactics.tags.presets");
  const fmt = await getFormatter();
  const { q = "", manager = "", tag = "", page = "1" } = await searchParams;
  const cur = Number(page) || 1;
  const qs = new URLSearchParams({ search: q, page: String(cur), ...(manager && { created_by: manager }), ...(tag && { tag }) });
  const [data, managers, tags] = await Promise.all([
    api<Paginated<Plan>>(`/plans/?${qs}`), api<string[]>("/plans/managers/"), api<string[]>("/plans/tags/"),
  ]);
  // Preset tags are translated; custom tags are shown as the coach typed them.
  const tagLabel = (x: string) => (tt.has(x) ? tt(x) : x);
  const pages = Math.max(1, Math.ceil(data.count / 12));
  const href = (p: number) => `/plans?${new URLSearchParams({ ...(q && { q }), ...(manager && { manager }), ...(tag && { tag }), page: String(p) })}`;

  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} actions={<LinkButton href="/tactics">{t("new")}</LinkButton>} />
      <form role="search" className="mb-5 flex flex-wrap gap-2">
        <input name="q" defaultValue={q} type="search" placeholder={t("search")} aria-label={t("search")} className={`${inputCls} max-w-xs`} />
        <select name="manager" defaultValue={manager} aria-label={t("manager")} className={`${inputCls} max-w-[200px]`}>
          <option value="">{t("allManagers")}</option>
          {managers.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
        {tags.length > 0 && (
          <select name="tag" defaultValue={tag} aria-label={t("tag")} className={`${inputCls} max-w-[200px]`}>
            <option value="">{t("allTags")}</option>
            {tags.map((x) => <option key={x} value={x}>{tagLabel(x)}</option>)}
          </select>
        )}
        <button className="h-10 rounded-lg border border-line bg-surface px-4 text-sm font-medium hover:bg-surface-2">{t("filter")}</button>
      </form>

      {data.results.length === 0 ? (
        <Empty title={t("none")} hint={t("noneHint")} action={<LinkButton href="/tactics">{t("new")}</LinkButton>} />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {data.results.map((p) => (
            <li key={p.id}>
              <Card className="overflow-hidden">
                <Link href={`/tactics?plan=${p.id}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image} alt={p.title || p.comment} loading="lazy" className="aspect-[4/3] w-full bg-surface-2 object-cover" />
                </Link>
                <div className="flex items-start justify-between gap-2 p-4">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{p.title || p.comment}</p>
                    {p.title && <p className="truncate text-sm text-muted">{p.comment}</p>}
                    <p className="mt-1 text-xs text-muted">{p.created_by} · {fmt.dateTime(new Date(p.created_at), { dateStyle: "medium" })}</p>
                    {p.tags.length > 0 && (
                      <ul className="mt-2 flex flex-wrap gap-1" aria-label={t("tag")}>
                        {p.tags.map((x) => <li key={x} className="rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-medium text-accent">{tagLabel(x)}</li>)}
                      </ul>
                    )}
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1.5">
                    <SharePlanButton planId={p.id} shareToken={p.share_token} />
                    <DeleteButton path={`/plans/${p.id}/`} redirectTo="/plans" confirmText={t("confirmDelete")} />
                  </div>
                </div>
              </Card>
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
