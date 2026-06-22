'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ChevronRight,
  Inbox,
  Loader2,
  Phone,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../../../lib/auth';
import { formatMoney } from '../../../lib/format';
import { orderStatusMeta, type OrderListItem } from '../../../lib/orders';

type Scope = 'all' | 'unassigned' | 'mine';

const SCOPES: { value: Scope; label: string }[] = [
  { value: 'all', label: 'Barchasi' },
  { value: 'unassigned', label: 'Yangi (biriktirilmagan)' },
  { value: 'mine', label: 'Mening' }
];

export default function OperatorQueuePage() {
  const { authFetch } = useAuth();
  const [scope, setScope] = useState<Scope>('all');
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(
    async (nextScope: Scope) => {
      setLoading(true);
      try {
        const res = await authFetch(
          `/api/v1/operator/orders?scope=${nextScope}&limit=50`
        );
        if (res.ok) {
          const body = (await res.json()) as { data: OrderListItem[] };
          setOrders(body.data ?? []);
        } else {
          setOrders([]);
        }
      } finally {
        setLoading(false);
      }
    },
    [authFetch]
  );

  useEffect(() => {
    void load(scope);
  }, [scope, load]);

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-xl font-bold tracking-tight text-ink">
            Operator navbati
          </h1>
          <p className="mt-1 text-sm text-muted">
            Tasdiq kutayotgan buyurtmalar. Mijozga qo‘ng‘iroq qilib tasdiqlang.
          </p>
        </div>
        <button
          type="button"
          onClick={() => load(scope)}
          className="flex items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-2 text-xs font-semibold text-muted transition hover:border-brand-200 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <RefreshCw size={14} aria-hidden="true" />
          Yangilash
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {SCOPES.map((s) => (
          <button
            key={s.value}
            type="button"
            onClick={() => setScope(s.value)}
            className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
              scope === s.value
                ? 'border-accent bg-accent text-white'
                : 'border-line bg-white text-muted hover:border-brand-200 hover:text-ink'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="mt-6 flex justify-center rounded-2xl border border-line bg-white py-16 shadow-soft">
          <Loader2 size={22} className="animate-spin text-muted" aria-hidden="true" />
        </div>
      ) : orders.length === 0 ? (
        <div className="mt-6 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-line bg-white py-16 text-center shadow-soft">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand-500">
            <Inbox size={22} aria-hidden="true" />
          </span>
          <p className="text-sm text-muted">Bu bo‘limda buyurtma yo‘q.</p>
        </div>
      ) : (
        <ul className="mt-6 flex flex-col gap-3">
          {orders.map((order) => {
            const meta = orderStatusMeta(order.status);
            const itemCount = order.items.reduce((s, i) => s + i.quantity, 0);
            return (
              <li key={order.id}>
                <Link
                  href={`/admin/operator/${order.id}` as never}
                  className="flex items-center gap-4 rounded-2xl border border-line bg-white p-4 shadow-soft transition hover:border-brand-200 hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-display text-sm font-bold text-ink">
                        {order.number}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${meta.tone}`}
                      >
                        {meta.label}
                      </span>
                      {order.assignedOperator ? (
                        <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-medium text-brand-700">
                          {order.assignedOperator.fullName ?? 'Operator'}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-ink">
                      <Phone size={13} className="text-accent" aria-hidden="true" />
                      {order.customer?.phone ?? '—'}
                      {order.customer?.fullName ? (
                        <span className="font-normal text-muted">
                          · {order.customer.fullName}
                        </span>
                      ) : null}
                    </p>
                    <p className="mt-0.5 line-clamp-1 text-xs text-faint">
                      {itemCount} ta ·{' '}
                      {order.items.map((i) => i.productNameSnapshot).join(', ')}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    <span className="font-display text-sm font-bold tabular-nums text-ink">
                      {formatMoney(order.total)}
                    </span>
                    <ChevronRight size={18} className="text-faint" aria-hidden="true" />
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
