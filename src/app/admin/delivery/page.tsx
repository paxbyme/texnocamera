'use client';

import { useState } from 'react';
import { Calculator, Loader2, Search, Truck } from 'lucide-react';
import { useAuth } from '../../../lib/auth';
import { formatMoney } from '../../../lib/format';
import {
  adminRequest,
  jsonRequest,
  type DeliveryQuote,
  type Shipment
} from '../../../lib/admin';
import {
  Alert,
  Badge,
  Field,
  PageHeader,
  Panel,
  buttonClass,
  inputClass,
  primaryButtonClass
} from '../../../components/admin/AdminUi';

type QuoteForm = {
  region: string;
  city: string;
  district: string;
  weightKg: string;
};

type ShipmentForm = {
  orderId: string;
  weightKg: string;
  codAmount: string;
  recipientName: string;
  phone: string;
};

const emptyQuote: QuoteForm = { region: '', city: '', district: '', weightKg: '' };
const emptyShipment: ShipmentForm = {
  orderId: '',
  weightKg: '',
  codAmount: '',
  recipientName: '',
  phone: ''
};

export default function AdminDeliveryPage() {
  const { authFetch } = useAuth();
  const [quoteForm, setQuoteForm] = useState<QuoteForm>(emptyQuote);
  const [shipmentForm, setShipmentForm] = useState<ShipmentForm>(emptyShipment);
  const [orderId, setOrderId] = useState('');
  const [shipmentId, setShipmentId] = useState('');
  const [quote, setQuote] = useState<DeliveryQuote | null>(null);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  async function getQuote(event: React.FormEvent) {
    event.preventDefault();
    setBusy('quote');
    setError(null);
    setOk(null);
    try {
      const result = await adminRequest<DeliveryQuote>(
        authFetch,
        '/api/v1/admin/delivery/quote',
        jsonRequest('POST', {
          ...quoteForm,
          weightKg: maybeNumber(quoteForm.weightKg)
        })
      );
      setQuote(result);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(null);
    }
  }

  async function createShipment(event: React.FormEvent) {
    event.preventDefault();
    setBusy('create');
    setError(null);
    setOk(null);
    try {
      const result = await adminRequest<Shipment>(
        authFetch,
        `/api/v1/admin/delivery/orders/${shipmentForm.orderId}/shipments`,
        jsonRequest('POST', {
          weightKg: maybeNumber(shipmentForm.weightKg),
          codAmount: maybeNumber(shipmentForm.codAmount),
          recipientName: shipmentForm.recipientName,
          phone: shipmentForm.phone
        })
      );
      setShipment(result);
      setOk('Shipment yaratildi.');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(null);
    }
  }

  async function loadOrderShipments(event: React.FormEvent) {
    event.preventDefault();
    setBusy('order');
    setError(null);
    setOk(null);
    try {
      const result = await adminRequest<Shipment[]>(
        authFetch,
        `/api/v1/admin/delivery/orders/${orderId}/shipments`
      );
      setShipments(result);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(null);
    }
  }

  async function lookupShipment(event: React.FormEvent) {
    event.preventDefault();
    setBusy('lookup');
    setError(null);
    setOk(null);
    try {
      const result = await adminRequest<Shipment>(
        authFetch,
        `/api/v1/admin/delivery/shipments/${shipmentId}`
      );
      setShipment(result);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Yetkazish"
        title="BTS delivery boshqaruvi"
        description="Narx hisoblash, shipment yaratish va mavjud shipmentlarni ko'rish."
      />

      <div className="space-y-3">
        <Alert message={error} />
        <Alert message={ok} tone="ok" />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="Delivery quote">
          <form onSubmit={getQuote} className="grid gap-3 md:grid-cols-2">
            <Field label="Viloyat">
              <input
                value={quoteForm.region}
                onChange={(event) =>
                  setQuoteForm((prev) => ({ ...prev, region: event.target.value }))
                }
                className={inputClass}
              />
            </Field>
            <Field label="Shahar">
              <input
                value={quoteForm.city}
                onChange={(event) =>
                  setQuoteForm((prev) => ({ ...prev, city: event.target.value }))
                }
                className={inputClass}
              />
            </Field>
            <Field label="Tuman">
              <input
                value={quoteForm.district}
                onChange={(event) =>
                  setQuoteForm((prev) => ({ ...prev, district: event.target.value }))
                }
                className={inputClass}
              />
            </Field>
            <Field label="Og'irlik, kg">
              <input
                type="number"
                min={0}
                step="0.01"
                value={quoteForm.weightKg}
                onChange={(event) =>
                  setQuoteForm((prev) => ({ ...prev, weightKg: event.target.value }))
                }
                className={inputClass}
              />
            </Field>
            <div className="md:col-span-2">
              <button type="submit" disabled={busy === 'quote'} className={primaryButtonClass}>
                {busy === 'quote' ? (
                  <Loader2 size={14} className="animate-spin" aria-hidden="true" />
                ) : (
                  <Calculator size={14} aria-hidden="true" />
                )}
                Hisoblash
              </button>
            </div>
          </form>
          {quote ? (
            <div className="mt-4 rounded-xl bg-brand-50 p-4">
              <p className="text-sm font-bold text-ink">{formatMoney(quote.amount)}</p>
              <p className="mt-1 text-xs text-muted">
                {quote.provider} · {quote.currency}
                {quote.etaDays ? ` · ${quote.etaDays} kun` : ''}
              </p>
            </div>
          ) : null}
        </Panel>

        <Panel title="Shipment yaratish" description="Order READY_FOR_SHIPPING bo'lishi kerak.">
          <form onSubmit={createShipment} className="grid gap-3 md:grid-cols-2">
            <div className="md:col-span-2">
              <Field label="Order ID">
                <input
                  required
                  value={shipmentForm.orderId}
                  onChange={(event) =>
                    setShipmentForm((prev) => ({
                      ...prev,
                      orderId: event.target.value
                    }))
                  }
                  className={inputClass}
                />
              </Field>
            </div>
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
            <div className="md:col-span-2">
              <button type="submit" disabled={busy === 'create'} className={primaryButtonClass}>
                <Truck size={14} aria-hidden="true" />
                Shipment yaratish
              </button>
            </div>
          </form>
        </Panel>

        <Panel title="Order shipmentlari">
          <form onSubmit={loadOrderShipments} className="flex gap-2">
            <input
              value={orderId}
              onChange={(event) => setOrderId(event.target.value)}
              placeholder="Order ID"
              className={inputClass}
            />
            <button type="submit" className={buttonClass}>
              <Search size={14} aria-hidden="true" />
            </button>
          </form>
          <div className="mt-4 space-y-3">
            {shipments.map((item) => (
              <ShipmentCard key={item.id} shipment={item} />
            ))}
            {shipments.length === 0 ? (
              <p className="text-sm text-muted">Order bo'yicha shipment tanlanmagan.</p>
            ) : null}
          </div>
        </Panel>

        <Panel title="Shipment lookup">
          <form onSubmit={lookupShipment} className="flex gap-2">
            <input
              value={shipmentId}
              onChange={(event) => setShipmentId(event.target.value)}
              placeholder="Shipment ID"
              className={inputClass}
            />
            <button type="submit" className={buttonClass}>
              <Search size={14} aria-hidden="true" />
            </button>
          </form>
          {shipment ? (
            <div className="mt-4">
              <ShipmentCard shipment={shipment} />
            </div>
          ) : null}
        </Panel>
      </div>
    </div>
  );
}

function ShipmentCard({ shipment }: { shipment: Shipment }) {
  return (
    <div className="rounded-xl border border-line p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-sm font-bold text-ink">
            {shipment.trackingNumber ?? shipment.id}
          </p>
          <p className="mt-0.5 text-xs text-faint">
            Order: {shipment.orderId} · {shipment.provider}
          </p>
        </div>
        <Badge tone={shipment.status === 'DELIVERED' ? 'ok' : 'accent'}>
          {shipment.status}
        </Badge>
      </div>
      <p className="mt-2 text-sm text-muted">{formatMoney(shipment.deliveryPrice)}</p>
      {shipment.waybillUrl ? (
        <a
          href={shipment.waybillUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-flex text-xs font-semibold text-accent hover:underline"
        >
          Waybill
        </a>
      ) : null}
    </div>
  );
}

function maybeNumber(value: string) {
  return value.trim() === '' ? undefined : Number(value);
}
