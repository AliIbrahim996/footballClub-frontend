"use client";

import { ClipboardList, CreditCard, LayoutDashboard, LogOut, Route, UserPlus, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { LocaleSwitcher } from "./locale-switcher";
import { Logo } from "./ui";

const BASE = [
  { href: "/dashboard", key: "dashboard", icon: LayoutDashboard },
  { href: "/players", key: "players", icon: Users },
  { href: "/tactics", key: "tactics", icon: Route },
  { href: "/plans", key: "plans", icon: ClipboardList },
] as const;
const TEAM = { href: "/team", key: "team", icon: UserPlus } as const;
const BILLING = { href: "/billing", key: "billing", icon: CreditCard } as const;

export function AppShell({ children, isOwner, clubName }: { children: React.ReactNode; isOwner: boolean; clubName: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("nav");
  const active = (href: string) => pathname === href || pathname.startsWith(href + "/");
  const main = isOwner ? [...BASE, TEAM] : BASE;
  const side = isOwner ? [...main, BILLING] : main;

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  const linkCls = (href: string) =>
    `flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors ${
      active(href) ? "bg-accent-soft text-accent" : "text-muted hover:bg-surface-2 hover:text-fg"
    }`;

  return (
    <div className="min-h-dvh md:grid md:grid-cols-[232px_1fr]">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-dvh flex-col gap-2 border-e border-line bg-surface p-4 md:flex">
        <Link href="/dashboard" className="px-2 pt-1"><Logo /></Link>
        <p className="mb-4 truncate px-2 text-xs text-muted" title={clubName}>{clubName}</p>
        <nav aria-label={t("main")} className="flex flex-1 flex-col gap-1">
          {side.map(({ href, key, icon: Icon }) => (
            <Link key={href} href={href} aria-current={active(href) ? "page" : undefined} className={linkCls(href)}>
              <Icon size={18} aria-hidden /> {t(key)}
            </Link>
          ))}
        </nav>
        <LocaleSwitcher />
        <button onClick={logout} className="flex h-10 items-center gap-3 rounded-lg px-3 text-sm text-muted hover:bg-surface-2 hover:text-fg">
          <LogOut size={18} aria-hidden /> {t("signOut")}
        </button>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-line bg-surface/90 px-4 backdrop-blur md:hidden">
        <Link href="/dashboard"><Logo /></Link>
        <div className="flex items-center gap-1">
          <LocaleSwitcher />
          {isOwner && (
            <Link href="/billing" aria-label={t("billing")} className="grid size-10 place-items-center rounded-lg text-muted hover:bg-surface-2">
              <CreditCard size={18} />
            </Link>
          )}
          <button onClick={logout} aria-label={t("signOut")} className="grid size-10 place-items-center rounded-lg text-muted hover:bg-surface-2">
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <main className="min-w-0 px-4 pb-28 pt-6 sm:px-6 md:pb-10 lg:px-10">{children}</main>

      {/* Mobile bottom tabs */}
      <nav
        aria-label={t("main")}
        className="fixed inset-x-0 bottom-0 z-30 grid border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
        style={{ gridTemplateColumns: `repeat(${main.length}, minmax(0, 1fr))` }}
      >
        {main.map(({ href, key, icon: Icon }) => (
          <Link
            key={href} href={href} aria-current={active(href) ? "page" : undefined}
            className={`flex h-14 flex-col items-center justify-center gap-0.5 text-[11px] font-medium ${active(href) ? "text-accent" : "text-muted"}`}
          >
            <Icon size={20} aria-hidden /> {t(key)}
          </Link>
        ))}
      </nav>
    </div>
  );
}
