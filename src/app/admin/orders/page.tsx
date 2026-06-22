'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Inbox, Loader2, Search } from 'lucide-react';
import { useAuth } from '../../../lib/auth';
import { formatMoney } from '../../../lib/format';
import { orderStatusMeta } from '../../../lib/orders';
import {
  ORDER_STATUSES,
  adminRequest,
  queryString,
  type AdminOrder,
  type OrderStatus,
  type Paginated
} from '../../../lib/admin';
import {
  EmptyState,
  Field,
  PageHeader,
  PaginationControls,
  Panel,
  buttonClass,
  inputClass
} from '../../../components/admin/AdminUi';

export default function AdminOrdersPage() {
  const { authFetch } = useAuth();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (nextPage = page) => {
      setLoading(true);
      setError(null);
      try {
        const result = await adminRequest<Paginated<AdminOrder>>(
          authFetch,
          `/api/v1/admin/orders${queryString({
            page: nextPage,
            limit,
            status,
            customerId
          })}`
        );
        setOrders(result.data);
        setPage(result.pagination.page);
        setLimit(result.pagination.limit);
        setTotal(result.pagination.total);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    },
    [authFetch, customerId, limit, page, status]
  );

  useEffect(() => {
    void load(1);
  }, [load]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Buyurtmalar"
        title="Admin buyurtma boshqaruvi"
        description="Buyurtma holatini yuritish, bekor qilish, qaytarish va fulfillment."
        action={
          <button type="button" onClick={() => void load(page)} className={buttonClass}>
            Yangilash
          </button>
        }
      />

      <Panel>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void load(1);
          }}
          className="grid gap-3 md:grid-cols-[1fr_1fr_auto]"
        >
          <Field label="Holat">
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className={inputClass}
            >
              <option value="">Barchasi</option>
              {ORDER_STATUSES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Customer ID">
            <input
              value={customerId}
              onChange={(event) => setCustomerId(event.target.value)}
              placeholder="UUID"
              className={inputClass}
            />
          </Field>
          <div className="flex items-end">
            <button type="submit" className={buttonClass}>
              <Search size={14} aria-hidden="true" />
              Qidirish
            </button>
          </div>
        </form>
      </Panel>

      <Panel title="Buyurtmalar">
        {error ? (
          <div className="rounded-xl border border-warn/30 bg-warn/10 px-4 py-3 text-sm text-warn">
            {error}
          </div>
        ) : null}
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 size={22} className="animate-spin text-muted" aria-hidden="true" />
          </div>
        ) : orders.length === 0 ? (
          <EmptyState icon={Inbox} message="Buyurtma topilmadi." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="text-xs text-faint">
                <tr className="border-b border-line">
                  <th className="py-2 pr-3 font-semibold">Raqam</th>
                  <th className="py-2 pr-3 font-semibold">Holat</th>
                  <th className="py-2 pr-3 font-semibold">Mahsulotlar</th>
                  <th className="py-2 pr-3 font-semibold">Sana</th>
                  <th className="py-2 pr-3 text-right font-semibold">Jami</th>
                  <th className="py-2 text-right font-semibold">Amal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {orders.map((order) => {
                  const meta = orderStatusMeta(order.status);
                  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
                  return (
                    <tr key={order.id}>
                      <td className="py-3 pr-3">
                        <p className="font-semibold text-ink">{order.number}</p>
                        <p className="text-xs text-faint">{order.id}</p>
                      </td>
                      <td className="py-3 pr-3">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${meta.tone}`}
                        >
                          {meta.label}
                        </span>
                      </td>
                      <td className="py-3 pr-3">
                        <p className="text-sm text-ink">{itemCount} ta</p>
                        <p className="line-clamp-1 text-xs text-faint">
                          {order.items.map((item) => item.productNameSnapshot).join(', ')}
                        </p>
                      </td>
                      <td className="py-3 pr-3 text-xs text-faint">
                        {new Date(order.createdAt).toLocaleString('uz-UZ')}
                      </td>
                      <td className="py-3 pr-3 text-right font-semibold tabular-nums">
                        {formatMoney(order.total)}
                      </td>
                      <td className="py-3 text-right">
                        <Link href={`/admin/orders/${order.id}` as never} className={buttonClass}>
                          Ochish
                          <ChevronRight size={14} aria-hidden="true" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        <PaginationControls page={page} limit={limit} total={total} onPage={(next) => void load(next)} />
      </Panel>
    </div>
  );
}
