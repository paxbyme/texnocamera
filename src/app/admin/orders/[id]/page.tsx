'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Ban,
  CheckCircle2,
  Loader2,
  PackageCheck,
  Phone,
  Send,
  Truck
} from 'lucide-react';
import { useAuth } from '../../../../lib/auth';
import { formatMoney } from '../../../../lib/format';
import { callOutcomeLabel, orderStatusMeta } from '../../../../lib/orders';
import {
  ORDER_NEXT,
  ORDER_STATUSES,
  adminRequest,
  jsonRequest,
  type AdminOrderDetail,
  type OrderStatus,
  type Shipment
} from '../../../../lib/admin';
import {
  Alert,
  Badge,
  Field,
  PageHeader,
  Panel,
  buttonClass,
  inputClass,
  primaryButtonClass
} from '../../../../components/admin/AdminUi';

type ShipmentForm = {
  weightKg: string;
  codAmount: string;
  recipientName: string;
  phone: string;
};

const emptyShipment: ShipmentForm = {
  weightKg: '',
  codAmount: '',
  recipientName: '',
  phone: ''
};

const ADDRESS_LABELS: Record<string, string> = {
  recipientName: 'Qabul qiluvchi',
  phone: 'Telefon',
  region: 'Viloyat',
  city: 'Shahar',
  district: 'Tuman',
  addressLine: 'Manzil',
  street: 'Ko\'cha',
  landmark: 'Mo\'ljal',
  note: 'Izoh'
};

export default function AdminOrderDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { authFetch } = useAuth();
  const [order, setOrder] = useState<AdminOrderDetail | null>(null);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [targetStatus, setTargetStatus] = useState('');
  const [reason, setReason] = useState('');
  const [shipmentForm, setShipmentForm] = useState<ShipmentForm>(emptyShipment);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [detail, shipmentList] = await Promise.all([
        adminRequest<AdminOrderDetail>(authFetch, `/api/v1/admin/orders/${id}`),
        adminRequest<Shipment[]>(
          authFetch,
          `/api/v1/admin/delivery/orders/${id}/shipments`
        ).catch(() => [])
      ]);
      setOrder(detail);
      setShipments(shipmentList);
      const next = getNextStatuses(detail.status)[0] ?? '';
      setTargetStatus(next);
      const address = (detail.deliveryAddressSnapshot ?? {}) as Record<string, unknown>;
      setShipmentForm((prev) => ({
        ...prev,
        recipientName:
          prev.recipientName ||
          String(address.recipientName ?? detail.customer?.fullName ?? ''),
        phone: prev.phone || String(address.phone ?? detail.customer?.phone ?? ''),
        codAmount: prev.codAmount || String(detail.total ?? '')
      }));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [authFetch, id]);

  useEffect(() => {
    void load();
  }, [load]);

  async function transition(event: React.FormEvent) {
    event.preventDefault();
    if (!targetStatus) return;
    setBusy('transition');
    setError(null);
    setOk(null);
    try {
      const detail = await adminRequest<AdminOrderDetail>(
        authFetch,
        `/api/v1/admin/orders/${id}/transition`,
        jsonRequest('POST', {
          status: targetStatus,
          reason
        })
      );
      setOrder(detail);
      setReason('');
      setOk('Buyurtma holati yangilandi.');
      await load();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(null);
    }
  }

  async function postAction(key: string, path: string, body?: unknown) {
    setBusy(key);
    setError(null);
    setOk(null);
    try {
      const detail = await adminRequest<AdminOrderDetail>(
        authFetch,
        `/api/v1/admin/orders/${id}/${path}`,
        jsonRequest('POST', body)
      );
      setOrder(detail);
      setReason('');
      setOk('Amal bajarildi.');
      await load();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(null);
    }
  }

  async function createShipment(event: React.FormEvent) {
    event.preventDefault();
    setBusy('shipment');
    setError(null);
    setOk(null);
    try {
      await adminRequest<Shipment>(
        authFetch,
        `/api/v1/admin/delivery/orders/${id}/shipments`,
        jsonRequest('POST', {
          weightKg: maybeNumber(shipmentForm.weightKg),
          codAmount: maybeNumber(shipmentForm.codAmount),
          recipientName: shipmentForm.recipientName,
          phone: shipmentForm.phone
        })
      );
      setShipmentForm(emptyShipment);
      setOk('Shipment yaratildi.');
      await load();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(null);
    }
  }

  if (loading || !order) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 size={22} className="animate-spin text-muted" aria-hidden="true" />
      </div>
    );
  }

  const meta = orderStatusMeta(order.status);
  const nextStatuses = getNextStatuses(order.status);
  const address = (order.deliveryAddressSnapshot ?? {}) as Record<string, unknown>;

  return (
    <div className="space-y-6">
      <Link
        href={'/admin/orders' as never}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition hover:text-ink"
      >
        <ArrowLeft size={15} aria-hidden="true" />
        Buyurtmalar
      </Link>

      <PageHeader
        eyebrow="Buyurtma"
        title={order.number}
        description={new Date(order.createdAt).toLocaleString('uz-UZ')}
        action={
          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${meta.tone}`}>
            {meta.label}
          </span>
        }
      />

      <div className="space-y-3">
        <Alert message={error} />
        <Alert message={ok} tone="ok" />
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-5">
          <Panel title="Mijoz">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="font-display text-lg font-bold text-ink">
                  {order.customer?.fullName?.trim() || 'Ism ko\'rsatilmagan'}
                </p>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
                  <Phone size={14} className="text-accent" aria-hidden="true" />
                  {order.customer?.phone ?? '-'}
                </p>
                {order.customer?.telegramUsername ? (
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-faint">
                    <Send size={12} className="text-[#229ED9]" aria-hidden="true" />
                    @{order.customer.telegramUsername}
                  </p>
                ) : null}
              </div>
              <dl className="space-y-1 text-sm">
                {Object.entries(address).map(([key, value]) =>
                  value ? (
                    <div key={key} className="flex gap-3">
                      <dt className="w-28 shrink-0 text-muted">
                        {ADDRESS_LABELS[key] ?? key}
                      </dt>
                      <dd className="font-medium text-ink">{String(value)}</dd>
                    </div>
                  ) : null
                )}
              </dl>
            </div>
          </Panel>

          <Panel title="Mahsulotlar">
            <div className="divide-y divide-line">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-start justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-ink">
                      {item.productNameSnapshot}
                    </p>
                    <p className="text-xs text-faint">
                      {item.variantNameSnapshot ? `${item.variantNameSnapshot} · ` : ''}
                      SKU: {item.skuSnapshot} · {item.quantity} x{' '}
                      {formatMoney(item.unitPrice)}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-semibold tabular-nums text-ink">
                    {formatMoney(item.total)}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-3 space-y-1 border-t border-line pt-3 text-sm">
              <MoneyRow label="Subtotal" value={order.subtotal} />
              <MoneyRow label="Yetkazish" value={order.deliveryPrice} />
              <MoneyRow label="Chegirma" value={order.discountTotal} />
              <MoneyRow label="Jami" value={order.total} strong />
            </div>
          </Panel>

          <Panel title="Shipmentlar">
            {shipments.length === 0 ? (
              <p className="text-sm text-muted">Shipment yo'q.</p>
            ) : (
              <div className="divide-y divide-line">
                {shipments.map((shipment) => (
                  <div key={shipment.id} className="py-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-ink">
                          {shipment.trackingNumber ?? shipment.id}
                        </p>
                        <p className="text-xs text-faint">
                          {shipment.provider} · {new Date(shipment.createdAt).toLocaleString('uz-UZ')}
                        </p>
                      </div>
                      <Badge tone={shipment.status === 'DELIVERED' ? 'ok' : 'accent'}>
                        {shipment.status}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted">
                      {formatMoney(shipment.deliveryPrice)}
                      {shipment.waybillUrl ? (
                        <>
                          {' '}·{' '}
                          <a
                            href={shipment.waybillUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="font-semibold text-accent hover:underline"
                          >
                            Waybill
                          </a>
                        </>
                      ) : null}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Panel>

          <Panel title="Tarix">
            <div className="space-y-4">
              {order.calls.length > 0 ? (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-faint">
                    Qo'ng'iroqlar
                  </h3>
                  <ul className="mt-2 space-y-2">
                    {order.calls.map((call) => (
                      <li key={call.id} className="text-sm">
                        <p className="font-medium text-ink">
                          {callOutcomeLabel(call.outcome)}
                          {call.operator?.fullName ? (
                            <span className="font-normal text-faint">
                              {' '}· {call.operator.fullName}
                            </span>
                          ) : null}
                        </p>
                        {call.note ? <p className="text-xs text-muted">{call.note}</p> : null}
                        <p className="text-[11px] text-faint">
                          {new Date(call.createdAt).toLocaleString('uz-UZ')}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-faint">
                  Holat tarixi
                </h3>
                <ul className="mt-2 space-y-2">
                  {order.statusHistory.map((entry) => (
                    <li key={entry.id} className="text-sm">
                      <p className="font-medium text-ink">
                        {entry.oldStatus ?? 'START'}
                        {' -> '}
                        {entry.newStatus}
                      </p>
                      {entry.reason ? (
                        <p className="text-xs text-muted">{entry.reason}</p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Panel>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-20 lg:self-start">
          <Panel title="Holatni o'zgartirish">
            {nextStatuses.length === 0 ? (
              <p className="text-sm text-muted">Bu holatdan keyingi o'tish yo'q.</p>
            ) : (
              <form onSubmit={transition} className="space-y-3">
                <Field label="Keyingi holat">
                  <select
                    value={targetStatus}
                    onChange={(event) => setTargetStatus(event.target.value)}
                    className={inputClass}
                  >
                    {nextStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Sabab">
                  <textarea
                    rows={3}
                    value={reason}
                    onChange={(event) => setReason(event.target.value)}
                    className={inputClass}
                  />
                </Field>
                <button
                  type="submit"
                  disabled={busy === 'transition'}
                  className={primaryButtonClass}
                >
                  <CheckCircle2 size={14} aria-hidden="true" />
                  O'tkazish
                </button>
              </form>
            )}

            <div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-4">
              <button
                type="button"
                onClick={() => void postAction('cancel', 'cancel', { reason })}
                disabled={busy !== null || order.status === 'CANCELLED'}
                className={buttonClass}
              >
                <Ban size={14} aria-hidden="true" />
                Bekor qilish
              </button>
              {order.status === 'RETURN_REQUESTED' ? (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      void postAction('return-approve', 'return/approve', { reason })
                    }
                    className={buttonClass}
                  >
                    Return approve
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      void postAction('return-reject', 'return/reject', { reason })
                    }
                    className={buttonClass}
                  >
                    Return reject
                  </button>
                </>
              ) : null}
            </div>
          </Panel>

          <Panel title="Shipment yaratish" description="Faqat READY_FOR_SHIPPING holatida.">
            <form onSubmit={createShipment} className="space-y-3">
              <Field label="Og'irlik, kg">
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={shipmentForm.weightKg}
                  onChange={(event) =>
                    setShipmentForm((prev) => ({ ...prev, weightKg: event.target.value }))
                  }
                  className={inputClass}
                />
              </Field>
              <Field label="COD summa">
                <input
                  type="number"
                  min={0}
                  value={shipmentForm.codAmount}
                  onChange={(event) =>
                    setShipmentForm((prev) => ({ ...prev, codAmount: event.target.value }))
                  }
                  className={inputClass}
                />
              </Field>
              <Field label="Qabul qiluvchi">
                <input
                  value={shipmentForm.recipientName}
                  onChange={(event) =>
                    setShipmentForm((prev) => ({
                      ...prev,
                      recipientName: event.target.value
                    }))
                  }
                  className={inputClass}
                />
              </Field>
              <Field label="Telefon">
                <input
                  value={shipmentForm.phone}
                  onChange={(event) =>
                    setShipmentForm((prev) => ({ ...prev, phone: event.target.value }))
                  }
                  className={inputClass}
                />
              </Field>
              <button
                type="submit"
                disabled={busy === 'shipment' || order.status !== 'READY_FOR_SHIPPING'}
                className={primaryButtonClass}
              >
                <Truck size={14} aria-hidden="true" />
                Shipment yaratish
              </button>
            </form>
          </Panel>

          <Panel title="Fulfillment">
            <div className="space-y-2 text-sm">
              <StatusRow label="Payment" value={order.paymentStatus ?? '-'} />
              <StatusRow label="Delivery" value={order.deliveryStatus ?? '-'} />
              <StatusRow label="Operator" value={order.assignedOperator?.fullName ?? '-'} />
              <StatusRow
                label="Jo'natish"
                value={order.status === 'READY_FOR_SHIPPING' ? 'Tayyor' : order.status}
              />
            </div>
            <div className="mt-4 rounded-xl bg-brand-50 p-3 text-xs text-muted">
              <PackageCheck size={14} className="mb-1 text-brand-700" aria-hidden="true" />
              Shipment yaratish buyurtmani BTS orqali band qiladi va holatni SHIPPED
              ga o'tkazadi.
            </div>
          </Panel>
        </aside>
      </div>
    </div>
  );
}

function getNextStatuses(status: string): OrderStatus[] {
  if (!ORDER_STATUSES.includes(status as OrderStatus)) return [];
  return ORDER_NEXT[status as OrderStatus];
}

function maybeNumber(value: string) {
  return value.trim() === '' ? undefined : Number(value);
}

function MoneyRow({
  label,
  value,
  strong
}: {
  label: string;
  value: string | number | null | undefined;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className={strong ? 'font-semibold text-ink' : 'text-muted'}>{label}</span>
      <span className={strong ? 'font-display text-lg font-bold text-ink' : 'text-ink'}>
        {formatMoney(value)}
      </span>
    </div>
  );
}

function StatusRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted">{label}</span>
      <span className="font-semibold text-ink">{value}</span>
    </div>
  );
}
