import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { Logo } from "@/components/ui";
import { SIGNUPS_OPEN } from "@/lib/flags";
import { LoginForm } from "./login-form";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const t = await getTranslations({ locale: (await params).locale, namespace: "auth" });
  return { title: t("signIn"), robots: { index: false } };
}

export default async function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
  setRequestLocale((await params).locale);
  const t = await getTranslations("auth");
  return (
    <main className="grid min-h-dvh lg:grid-cols-2">
      <section className="flex flex-col justify-center px-6 py-12 sm:px-12">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-10 flex items-center justify-between">
            <Link href="/"><Logo /></Link>
            <LocaleSwitcher />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">{t("welcome")}</h1>
          <p className="mb-8 mt-1 text-sm text-muted">{t("subtitle")}</p>
          <Suspense><LoginForm /></Suspense>
          <p className="mt-6 text-sm text-muted">{t("noAccount")} {SIGNUPS_OPEN
            ? <Link href="/register" className="font-medium text-accent underline underline-offset-4">{t("startTrial")}</Link>
            : <Link href="/contact?topic=full" className="font-medium text-accent underline underline-offset-4">{t("contactUs")}</Link>}</p>
        </div>
      </section>
      <aside aria-hidden className="relative hidden overflow-hidden bg-[var(--pitch)] lg:block">
        <svg viewBox="0 0 400 600" className="absolute inset-0 size-full" preserveAspectRatio="xMidYMid slice">
          <g fill="none" stroke="#fff" strokeOpacity=".35" strokeWidth="3">
            <rect x="30" y="30" width="340" height="540" /><path d="M30 300h340" /><circle cx="200" cy="300" r="55" />
            <rect x="100" y="30" width="200" height="90" /><rect x="100" y="480" width="200" height="90" />
          </g>
        </svg>
      </aside>
    </main>
  );
}
