import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AppShell } from "@/components/app-shell";
import { Link } from "@/i18n/navigation";
import { api } from "@/lib/server";
import type { Me } from "@/lib/types";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function AppLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  setRequestLocale((await params).locale);
  const t = await getTranslations("billing");
  const me = await api<Me>("/auth/me/");
  const { club } = me;
  const daysLeft = club.trial_days_left;

  return (
    <AppShell isOwner={club.role === "owner"} clubName={club.name}>
      {club.status === "trialing" && club.entitled && (
        <div role="status" className="mb-5 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-accent/40 bg-accent-soft px-4 py-3 text-sm">
          <span>{t("trialBanner", { days: daysLeft })}</span>
          {club.role === "owner" && <Link href="/billing" className="font-semibold text-accent underline underline-offset-4">{t("subscribe")}</Link>}
        </div>
      )}
      {club.status === "past_due" && (
        <div role="alert" className="mb-5 rounded-xl border border-danger/40 bg-danger/10 px-4 py-3 text-sm">
          {t("pastDue")} {club.role === "owner" && <Link href="/billing" className="font-semibold underline">{t("manage")}</Link>}
        </div>
      )}
      {children}
    </AppShell>
  );
}
