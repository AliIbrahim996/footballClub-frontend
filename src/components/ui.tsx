import { Link } from "@/i18n/navigation";
import type { ComponentProps, ReactNode } from "react";

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg px-4 h-10 text-sm font-medium transition-[transform,background-color,border-color] duration-150 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap";
const variants = {
  primary: "bg-accent text-accent-fg hover:brightness-110",
  secondary: "bg-surface border border-line hover:border-muted/60",
  ghost: "hover:bg-surface-2",
  danger: "bg-danger/10 text-danger hover:bg-danger/20",
} as const;
type Variant = keyof typeof variants;

export function Button({ variant = "primary", className, ...p }: ComponentProps<"button"> & { variant?: Variant }) {
  return <button className={cx(base, variants[variant], className)} {...p} />;
}

export function LinkButton({ variant = "primary", className, ...p }: ComponentProps<typeof Link> & { variant?: Variant }) {
  return <Link className={cx(base, variants[variant], className)} {...p} />;
}

export function Card({ className, ...p }: ComponentProps<"div">) {
  return <div className={cx("rounded-2xl border border-line bg-surface", className)} {...p} />;
}

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block font-medium">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-danger">{error}</span>}
    </label>
  );
}

export const inputCls =
  "h-10 w-full rounded-lg border border-line bg-surface px-3 text-sm placeholder:text-muted/70 focus:border-accent focus:outline-none";

export function Input(p: ComponentProps<"input">) {
  return <input className={inputCls} {...p} />;
}

export function Avatar({ src, name, size = 40 }: { src?: string | null; name: string; size?: number }) {
  const initials = name.split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase();
  const hasPhoto = src && !src.endsWith("no_image.png");
  return hasPhoto ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="" width={size} height={size} className="rounded-full object-cover" style={{ width: size, height: size }} />
  ) : (
    <span
      aria-hidden
      className="grid shrink-0 place-items-center rounded-full bg-accent-soft font-semibold text-accent"
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {initials}
    </span>
  );
}

export function RatingBar({ value, max = 5 }: { value: number; max?: number }) {
  return (
    <div className="flex items-center gap-2" role="img" aria-label={`${value} out of ${max}`}>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
        <div className="h-full rounded-full bg-accent" style={{ width: `${(value / max) * 100}%` }} />
      </div>
      <span className="w-8 text-right font-mono text-xs text-muted">{value.toFixed(1)}</span>
    </div>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cx("inline-flex items-center gap-2 font-semibold tracking-tight", className)}>
      <svg width="26" height="26" viewBox="0 0 32 32" aria-hidden>
        <rect width="32" height="32" rx="8" fill="var(--accent)" />
        <g fill="none" stroke="var(--accent-fg)" strokeWidth="1.6">
          <rect x="6" y="8" width="20" height="16" rx="1.5" />
          <path d="M16 8v16" />
          <circle cx="16" cy="16" r="3.2" />
        </g>
      </svg>
      Pitchside
    </span>
  );
}

export function Empty({ title, hint, action }: { title: string; hint?: string; action?: ReactNode }) {
  return (
    <Card className="grid place-items-center gap-2 px-6 py-14 text-center">
      <p className="font-medium">{title}</p>
      {hint && <p className="max-w-sm text-sm text-muted">{hint}</p>}
      {action}
    </Card>
  );
}

