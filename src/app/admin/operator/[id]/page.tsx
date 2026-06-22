'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Ban,
  CheckCircle2,
  Loader2,
  MapPin,
  Phone,
  PhoneCall,
  Send,
  UserPlus
} from 'lucide-react';
import { useAuth } from '../../../../lib/auth';
import { formatMoney } from '../../../../lib/format';
import {
  callOutcomeLabel,
  CALL_OUTCOMES,
  orderStatusMeta,
  type CallOutcome,
  type OrderDetail
} from '../../../../lib/orders';

const ADDRESS_FIELDS: { key: string; label: string }[] = [
  { key: 'recipientName', label: 'Qabul qiluvchi' },
  { key: 'region', label: 'Viloyat' },
  { key: 'district', label: 'Tuman / shahar' },
  { key: 'addressLine', label: 'Manzil' },
  { key: 'note', label: 'Izoh' }
];

const ACTIONABLE_STATUSES = ['AWAITING_CONFIRMATION'];

export default function OperatorOrderPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { authFetch } = useAuth();

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [outcome, setOutcome] = useState<CallOutcome>('REACHED');
  const [note, setNote] = useState('');
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await authFetch(`/api/v1/operator/orders/${id}`);
      if (res.status === 404) {
        setNotFound(true);
        return;
      }
      if (res.ok) {
        setOrder((await res.json()) as OrderDetail);
      }
    } finally {
      setLoading(false);
    }
  }, [authFetch, id]);

  useEffect(() => {
    void load();
  }, [load]);

  const act = useCallback(
    async (key: string, path: string, body?: unknown) => {
      setBusy(key);
      setError(null);
      try {
        const res = await authFetch(`/api/v1/operator/orders/${id}/${path}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: body ? JSON.stringify(body) : undefined
        });
        if (!res.ok) {
          const err = (await res.json().catch(() => null)) as {
            message?: string;
          } | null;
          setError(err?.message ?? 'Amal bajarilmadi.');
          return;
        }
        setOrder((await res.json()) as OrderDetail);
      } catch {
        setError('Tarmoq xatosi. Qayta urinib ko‘ring.');
      } finally {
        setBusy(null);
      }
    },
    [authFetch, id]
  );

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 size={22} className="animate-spin text-muted" aria-hidden="true" />
      </div>
    );
  }

  if (notFound || !order) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm text-muted">Buyurtma topilmadi.</p>
        <Link
          href={'/admin/operator' as never}
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
        >
          <ArrowLeft size={15} aria-hidden="true" />
          Navbatga qaytish
        </Link>
      </div>
    );
  }

  const meta = orderStatusMeta(order.status);
  const phone = order.customer?.phone;
  const canAct = ACTIONABLE_STATUSES.includes(order.status);
  const address = (order.deliveryAddressSnapshot ?? {}) as Record<string, unknown>;

  return (
    <div>
      <Link
        href={'/admin/operator' as never}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition hover:text-ink"
      >
        <ArrowLeft size={15} aria-hidden="true" />
        Navbat
      </Link>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <h1 className="font-display text-xl font-bold tracking-tight text-ink">
          {order.number}
        </h1>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${meta.tone}`}>
          {meta.label}
        </span>
        <span className="text-xs text-faint">
          {new Date(order.createdAt).toLocaleString('uz-UZ')}
        </span>
      </div>

      {error ? (
        <div className="mt-4 rounded-xl border border-warn/30 bg-warn/10 px-4 py-3 text-sm text-warn">
          {error}
        </div>
      ) : null}

      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_22rem]">
        {/* left: contact + items + history */}
        <div className="flex flex-col gap-5">
          <section className="rounded-2xl border border-line bg-white p-5 shadow-soft">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-faint">
              Mijoz
            </h2>
            <p className="mt-2 font-display text-lg font-bold text-ink">
              {order.customer?.fullName?.trim() || 'Ism ko‘rsatilmagan'}
            </p>
            {order.customer?.telegramUsername ? (
              <p className="mt-0.5 flex items-center gap-1.5 text-xs text-faint">
                <Send size={12} className="text-[#229ED9]" aria-hidden="true" />
                @{order.customer.telegramUsername}
              </p>
            ) : null}
            {phone ? (
              <a
                href={`tel:${phone}`}
                className="mt-3 inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-accent-hover hover:shadow-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              >
                <PhoneCall size={16} aria-hidden="true" />
                {phone}
              </a>
            ) : null}
          </section>

          <section className="rounded-2xl border border-line bg-white p-5 shadow-soft">
            <h2 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-faint">
              <MapPin size={13} aria-hidden="true" />
              Yetkazib berish
            </h2>
            <dl className="mt-3 space-y-1.5">
              {ADDRESS_FIELDS.map((field) => {
                const value = address[field.key];
                if (!value) return null;
                return (
                  <div key={field.key} className="flex gap-3 text-sm">
                    <dt className="w-32 shrink-0 text-muted">{field.label}</dt>
                    <dd className="font-medium text-ink">{String(value)}</dd>
                  </div>
                );
              })}
            </dl>
          </section>

          <section className="rounded-2xl border border-line bg-white p-5 shadow-soft">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-faint">
              Mahsulotlar
            </h2>
            <ul className="mt-3 divide-y divide-line">
              {order.items.map((item) => (
                <li key={item.id} className="flex items-start justify-between gap-3 py-2.5">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink">
                      {item.productNameSnapshot}
                    </p>
                    <p className="text-xs text-faint">
                      {item.variantNameSnapshot ? `${item.variantNameSnapshot} · ` : ''}
                      SKU: {item.skuSnapshot} · {item.quantity} ×{' '}
                      {formatMoney(item.unitPrice)}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-semibold tabular-nums text-ink">
                    {formatMoney(item.total)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
              <span className="text-sm font-semibold text-ink">Jami</span>
              <span className="font-display text-lg font-bold tabular-nums text-ink">
                {formatMoney(order.total)}
              </span>
            </div>
          </section>

          {order.calls.length > 0 ? (
            <section className="rounded-2xl border border-line bg-white p-5 shadow-soft">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-faint">
                Qo‘ng‘iroqlar tarixi
              </h2>
              <ul className="mt-3 space-y-2.5">
                {order.calls.map((call) => (
                  <li key={call.id} className="flex items-start gap-3 text-sm">
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-600">
                      <Phone size={12} aria-hidden="true" />
                    </span>
                    <div>
                      <p className="font-medium text-ink">
                        {callOutcomeLabel(call.outcome)}
                        {call.operator?.fullName ? (
                          <span className="font-normal text-faint">
                            {' '}· {call.operator.fullName}
                          </span>
                        ) : null}
                      </p>
                      {call.note ? (
                        <p className="text-xs text-muted">{call.note}</p>
                      ) : null}
                      <p className="text-[11px] text-faint">
                        {new Date(call.createdAt).toLocaleString('uz-UZ')}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>

        {/* right: actions */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="flex flex-col gap-4 rounded-2xl border border-line bg-white p-5 shadow-soft">
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wide text-faint">
                Amallar
              </h2>
              {order.assignedOperator ? (
                <p className="mt-1 text-xs text-muted">
                  Biriktirilgan:{' '}
                  <span className="font-semibold text-ink">
                    {order.assignedOperator.fullName ?? 'Operator'}
                  </span>
                </p>
              ) : (
                <button
                  type="button"
                  disabled={busy !== null}
                  onClick={() => act('assign', 'assign')}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-semibold text-ink transition hover:border-brand-200 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  {busy === 'assign' ? (
                    <Loader2 size={15} className="animate-spin" aria-hidden="true" />
                  ) : (
                    <UserPlus size={15} aria-hidden="true" />
                  )}
                  Menga biriktirish
                </button>
              )}
            </div>

            {/* log a call */}
            <div className="border-t border-line pt-4">
              <label className="block text-xs font-semibold text-ink">
                Qo‘ng‘iroq natijasi
              </label>
              <select
                value={outcome}
                onChange={(e) => setOutcome(e.target.value as CallOutcome)}
                className="mt-1.5 w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm text-ink shadow-soft outline-none focus:border-brand-300 focus:ring-2 focus:ring-accent/30"
              >
                {CALL_OUTCOMES.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
                placeholder="Izoh (ixtiyoriy)"
                className="mt-2 w-full resize-none rounded-xl border border-line bg-white px-3 py-2 text-sm text-ink shadow-soft outline-none placeholder:text-faint focus:border-brand-300 focus:ring-2 focus:ring-accent/30"
              />
              <button
                type="button"
                disabled={busy !== null}
                onClick={async () => {
                  await act('call', 'calls', {
                    outcome,
                    note: note.trim() || undefined
                  });
                  setNote('');
                }}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-800 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                {busy === 'call' ? (
                  <Loader2 size={15} className="animate-spin" aria-hidden="true" />
                ) : (
                  <Phone size={15} aria-hidden="true" />
                )}
                Qo‘ng‘iroqni saqlash
              </button>
            </div>

            {/* confirm / cancel */}
            {canAct ? (
              <div className="border-t border-line pt-4">
                <button
                  type="button"
                  disabled={busy !== null}
                  onClick={() => act('confirm', 'confirm', { reason: reason.trim() || undefined })}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-ok px-4 py-3 text-sm font-semibold text-white shadow-soft transition hover:brightness-105 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ok"
                >
                  {busy === 'confirm' ? (
                    <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                  ) : (
                    <CheckCircle2 size={16} aria-hidden="true" />
                  )}
                  Buyurtmani tasdiqlash
                </button>

                <input
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Bekor qilish sababi"
                  className="mt-3 w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm text-ink shadow-soft outline-none placeholder:text-faint focus:border-brand-300 focus:ring-2 focus:ring-accent/30"
                />
                <button
                  type="button"
                  disabled={busy !== null}
                  onClick={() => act('cancel', 'cancel', { reason: reason.trim() || undefined })}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-warn/40 bg-warn/5 px-4 py-2.5 text-sm font-semibold text-warn transition hover:bg-warn/10 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warn"
                >
                  {busy === 'cancel' ? (
                    <Loader2 size={15} className="animate-spin" aria-hidden="true" />
                  ) : (
                    <Ban size={15} aria-hidden="true" />
                  )}
                  Bekor qilish
                </button>
              </div>
            ) : (
              <p className="border-t border-line pt-4 text-xs text-muted">
                Bu buyurtma uchun tasdiq/bekor amali mavjud emas (joriy holat:{' '}
                {meta.label}).
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
