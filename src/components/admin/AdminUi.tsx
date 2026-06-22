import type { LucideIcon } from 'lucide-react';

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
};

export function PageHeader({ eyebrow, title, description, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow ? (
          <p className="text-[11px] font-semibold uppercase tracking-wide text-faint">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="font-display text-xl font-bold tracking-tight text-ink">
          {title}
        </h1>
        {description ? <p className="mt-1 text-sm text-muted">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function Panel({
  title,
  description,
  children,
  action
}: {
  title?: string;
  description?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-line bg-white p-5 shadow-soft">
      {title || description || action ? (
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            {title ? <h2 className="text-sm font-bold text-ink">{title}</h2> : null}
            {description ? (
              <p className="mt-0.5 text-xs text-muted">{description}</p>
            ) : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}

export function StatCard({
  label,
  value,
  icon: Icon
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
}) {
  return (
    <div className="rounded-2xl border border-line bg-white p-4 shadow-soft">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-medium text-muted">{label}</span>
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-50 text-brand-700">
          <Icon size={16} aria-hidden="true" />
        </span>
      </div>
      <p className="mt-3 font-display text-2xl font-bold tabular-nums text-ink">
        {value}
      </p>
    </div>
  );
}

export function Field({
  label,
  children,
  hint
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-ink">{label}</span>
      <div className="mt-1.5">{children}</div>
      {hint ? <span className="mt-1 block text-[11px] text-faint">{hint}</span> : null}
    </label>
  );
}

export const inputClass =
  'w-full rounded-xl border border-line bg-white px-3 py-2 text-sm text-ink shadow-soft outline-none placeholder:text-faint focus:border-brand-300 focus:ring-2 focus:ring-accent/30 disabled:bg-brand-50 disabled:text-faint';

export const buttonClass =
  'inline-flex items-center justify-center gap-2 rounded-lg border border-line bg-white px-3 py-2 text-xs font-semibold text-muted transition hover:border-brand-200 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-50';

export const primaryButtonClass =
  'inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-3 py-2 text-xs font-semibold text-white shadow-soft transition hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-brand-100 disabled:text-faint';

export function Alert({
  message,
  tone = 'warn'
}: {
  message: string | null;
  tone?: 'warn' | 'ok';
}) {
  if (!message) return null;
  const className =
    tone === 'ok'
      ? 'border-ok/20 bg-ok/10 text-ok'
      : 'border-warn/30 bg-warn/10 text-warn';
  return (
    <div className={`rounded-xl border px-4 py-3 text-sm ${className}`}>
      {message}
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  message
}: {
  icon: LucideIcon;
  message: string;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-line bg-white py-12 text-center shadow-soft">
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand-500">
        <Icon size={22} aria-hidden="true" />
      </span>
      <p className="text-sm text-muted">{message}</p>
    </div>
  );
}

export function Badge({
  children,
  tone = 'neutral'
}: {
  children: React.ReactNode;
  tone?: 'neutral' | 'ok' | 'warn' | 'accent';
}) {
  const tones = {
    neutral: 'bg-brand-50 text-brand-700',
    ok: 'bg-ok/10 text-ok',
    warn: 'bg-warn/10 text-warn',
    accent: 'bg-accent/10 text-accent'
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function PaginationControls({
  page,
  limit,
  total,
  onPage
}: {
  page: number;
  limit: number;
  total: number;
  onPage: (page: number) => void;
}) {
  const pages = Math.max(1, Math.ceil(total / limit));
  return (
    <div className="flex items-center justify-between gap-3 border-t border-line pt-4 text-xs text-muted">
      <span>
        {total} ta yozuv · {page}/{pages}
      </span>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onPage(page - 1)}
          disabled={page <= 1}
          className={buttonClass}
        >
          Oldingi
        </button>
        <button
          type="button"
          onClick={() => onPage(page + 1)}
          disabled={page >= pages}
          className={buttonClass}
        >
          Keyingi
        </button>
      </div>
    </div>
  );
}
