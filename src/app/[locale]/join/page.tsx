import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { Card, Logo } from "@/components/ui";
import { BACKEND_URL } from "@/lib/server";
import { JoinForm } from "./join-form";

export const metadata: Metadata = { robots: { index: false, follow: false } };

type Invite = { club_name: string; email: string; role: string };

export default async function JoinPage({
  params, searchParams,
}: { params: Promise<{ locale: string }>; searchParams: Promise<{ token?: string }> }) {
  setRequestLocale((await params).locale);
  const t = await getTranslations("join");
  const { token = "" } = await searchParams;
  const res = token
    ? await fetch(`${BACKEND_URL}/api/auth/invite/?token=${encodeURIComponent(token)}`, { cache: "no-store" }).catch(() => null)
    : null;
  const invite: Invite | null = res?.ok ? await res.json() : null;

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-6 py-12">
      <div className="mb-8 flex items-center justify-between">
        <Link href="/"><Logo /></Link>
        <LocaleSwitcher />
      </div>
      {invite ? (
        <>
          <h1 className="text-2xl font-semibold tracking-tight">{t("title", { club: invite.club_name })}</h1>
          <p className="mb-6 mt-1 text-sm text-muted">{t("subtitle", { email: invite.email })}</p>
          <JoinForm token={token} />
        </>
      ) : (
        <Card className="p-6">
          <h1 className="font-semibold">{t("invalid")}</h1>
          <p className="mt-1 text-sm text-muted">{t("invalidHint")}</p>
        </Card>
      )}
    </main>
  );
}
