'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Edit3, Inbox, Loader2, Plus, RotateCcw, Trash2 } from 'lucide-react';
import { useAuth } from '../../../lib/auth';
import {
  MANUAL_MOVEMENT_TYPES,
  MOVEMENT_TYPES,
  RESERVATION_STATUSES,
  adminRequest,
  jsonRequest,
  queryString,
  variantLabel,
  type InventoryBalance,
  type InventoryMovement,
  type InventoryReservation,
  type MovementType,
  type Paginated,
  type ReservationStatus,
  type Warehouse
} from '../../../lib/admin';
import {
  Alert,
  Badge,
  EmptyState,
  Field,
  PageHeader,
  Panel,
  buttonClass,
  inputClass,
  primaryButtonClass
} from '../../../components/admin/AdminUi';

type WarehouseForm = {
  id?: string;
  name: string;
  code: string;
  isActive: boolean;
};

type AdjustmentForm = {
  warehouseId: string;
  variantId: string;
  onHandDelta: string;
  type: MovementType;
  reason: string;
};

const emptyWarehouse: WarehouseForm = { name: '', code: '', isActive: true };
const emptyAdjustment: AdjustmentForm = {
  warehouseId: '',
  variantId: '',
  onHandDelta: '',
  type: 'MANUAL_ADJUSTMENT',
  reason: ''
};

export default function AdminInventoryPage() {
  const { authFetch } = useAuth();
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [balances, setBalances] = useState<InventoryBalance[]>([]);
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [reservations, setReservations] = useState<InventoryReservation[]>([]);
  const [warehouseForm, setWarehouseForm] = useState<WarehouseForm>(emptyWarehouse);
  const [adjustmentForm, setAdjustmentForm] = useState<AdjustmentForm>(emptyAdjustment);
  const [warehouseFilter, setWarehouseFilter] = useState('');
  const [variantFilter, setVariantFilter] = useState('');
  const [movementType, setMovementType] = useState('');
  const [reservationStatus, setReservationStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const knownVariants = useMemo(() => {
    const byId = new Map<string, InventoryBalance['variant']>();
    for (const balance of balances) byId.set(balance.variantId, balance.variant);
    for (const movement of movements) byId.set(movement.variantId, movement.variant);
    for (const reservation of reservations) {
      byId.set(reservation.variantId, reservation.variant);
    }
    return [...byId.entries()].map(([id, variant]) => ({ id, variant }));
  }, [balances, movements, reservations]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [warehousePage, balancePage, movementPage, reservationPage] =
        await Promise.all([
          adminRequest<Paginated<Warehouse>>(
            authFetch,
            '/api/v1/admin/inventory/warehouses?limit=100'
          ),
          adminRequest<Paginated<InventoryBalance>>(
            authFetch,
            `/api/v1/admin/inventory/balances${queryString({
              warehouseId: warehouseFilter,
              variantId: variantFilter,
              limit: 50
            })}`
          ),
          adminRequest<Paginated<InventoryMovement>>(
            authFetch,
            `/api/v1/admin/inventory/movements${queryString({
              warehouseId: warehouseFilter,
              variantId: variantFilter,
              type: movementType,
              limit: 50
            })}`
          ),
          adminRequest<Paginated<InventoryReservation>>(
            authFetch,
            `/api/v1/admin/inventory/reservations${queryString({
              variantId: variantFilter,
              status: reservationStatus,
              limit: 50
            })}`
          )
        ]);
      setWarehouses(warehousePage.data);
      setBalances(balancePage.data);
      setMovements(movementPage.data);
      setReservations(reservationPage.data);
      setAdjustmentForm((prev) => ({
        ...prev,
        warehouseId: prev.warehouseId || warehousePage.data[0]?.id || '',
        variantId: prev.variantId || balancePage.data[0]?.variantId || ''
      }));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [authFetch, movementType, reservationStatus, variantFilter, warehouseFilter]);

  useEffect(() => {
    void load();
  }, [load]);

  async function saveWarehouse(event: React.FormEvent) {
    event.preventDefault();
    setBusy('warehouse');
    setError(null);
    setOk(null);
    try {
      const path = warehouseForm.id
        ? `/api/v1/admin/inventory/warehouses/${warehouseForm.id}`
        : '/api/v1/admin/inventory/warehouses';
      await adminRequest<Warehouse>(
        authFetch,
        path,
        jsonRequest(warehouseForm.id ? 'PATCH' : 'POST', warehouseForm)
      );
      setWarehouseForm(emptyWarehouse);
      setOk('Ombor saqlandi.');
      await load();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(null);
    }
  }

  async function deactivateWarehouse(warehouse: Warehouse) {
    if (!window.confirm(`${warehouse.code} ombori deaktiv qilinsinmi?`)) return;
    setBusy(`warehouse-${warehouse.id}`);
    setError(null);
    setOk(null);
    try {
      await adminRequest(
        authFetch,
        `/api/v1/admin/inventory/warehouses/${warehouse.id}`,
        jsonRequest('DELETE')
      );
      setOk('Ombor deaktiv qilindi.');
      await load();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(null);
    }
  }

  async function adjustStock(event: React.FormEvent) {
    event.preventDefault();
    setBusy('adjust');
    setError(null);
    setOk(null);
    try {
      await adminRequest(
        authFetch,
        '/api/v1/admin/inventory/adjustments',
        jsonRequest('POST', {
          ...adjustmentForm,
          onHandDelta: Number(adjustmentForm.onHandDelta)
        })
      );
      setAdjustmentForm((prev) => ({
        ...emptyAdjustment,
        warehouseId: prev.warehouseId,
        variantId: prev.variantId
      }));
      setOk('Qoldiq tuzatildi.');
      await load();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(null);
    }
  }

  async function releaseReservation(reservation: InventoryReservation) {
    if (!window.confirm('Rezerv qo\'lda chiqarilsinmi?')) return;
    setBusy(`reservation-${reservation.id}`);
    setError(null);
    setOk(null);
    try {
      await adminRequest(
        authFetch,
        `/api/v1/admin/inventory/reservations/${reservation.id}/release`,
        jsonRequest('POST')
      );
      setOk('Rezerv chiqarildi.');
      await load();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Ombor"
        title="Inventar boshqaruvi"
        description="Omborlar, qoldiqlar, harakatlar, rezervlar va qo'lda tuzatishlar."
        action={
          <button type="button" onClick={() => void load()} className={buttonClass}>
            Yangilash
          </button>
        }
      />

      <div className="space-y-3">
        <Alert message={error} />
        <Alert message={ok} tone="ok" />
      </div>

      <Panel>
        <div className="grid gap-3 md:grid-cols-4">
          <Field label="Ombor filter">
            <select
              value={warehouseFilter}
              onChange={(event) => setWarehouseFilter(event.target.value)}
              className={inputClass}
            >
              <option value="">Barchasi</option>
              {warehouses.map((warehouse) => (
                <option key={warehouse.id} value={warehouse.id}>
                  {warehouse.code}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Variant ID">
            <input
              value={variantFilter}
              onChange={(event) => setVariantFilter(event.target.value)}
              className={inputClass}
              placeholder="UUID"
            />
          </Field>
          <Field label="Harakat turi">
            <select
              value={movementType}
              onChange={(event) => setMovementType(event.target.value)}
              className={inputClass}
            >
              <option value="">Barchasi</option>
              {MOVEMENT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Rezerv holati">
            <select
              value={reservationStatus}
              onChange={(event) => setReservationStatus(event.target.value)}
              className={inputClass}
            >
              <option value="">Barchasi</option>
              {RESERVATION_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </Panel>

      {loading ? (
        <div className="flex justify-center rounded-2xl border border-line bg-white py-16 shadow-soft">
          <Loader2 size={22} className="animate-spin text-muted" aria-hidden="true" />
        </div>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-5">
          <Panel title="Qoldiqlar" description="available = on hand - reserved - damaged.">
            {balances.length === 0 ? (
              <EmptyState icon={Inbox} message="Qoldiq topilmadi." />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left text-sm">
                  <thead className="text-xs text-faint">
                    <tr className="border-b border-line">
                      <th className="py-2 pr-3 font-semibold">Variant</th>
                      <th className="py-2 pr-3 font-semibold">Ombor</th>
                      <th className="py-2 pr-3 font-semibold">On hand</th>
                      <th className="py-2 pr-3 font-semibold">Reserved</th>
                      <th className="py-2 pr-3 font-semibold">Damaged</th>
                      <th className="py-2 pr-3 font-semibold">Available</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {balances.map((balance) => (
                      <tr key={balance.id}>
                        <td className="py-3 pr-3">
                          <p className="font-semibold text-ink">{variantLabel(balance.variant)}</p>
                          <p className="text-xs text-faint">{balance.variantId}</p>
                        </td>
                        <td className="py-3 pr-3 text-muted">{balance.warehouse.code}</td>
                        <td className="py-3 pr-3 tabular-nums">{balance.onHandQty}</td>
                        <td className="py-3 pr-3 tabular-nums">{balance.reservedQty}</td>
                        <td className="py-3 pr-3 tabular-nums">{balance.damagedQty}</td>
                        <td className="py-3 pr-3 font-bold tabular-nums text-ink">
                          {balance.availableQty}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Panel>

          <Panel title="Harakatlar jurnali">
            {movements.length === 0 ? (
              <EmptyState icon={Inbox} message="Harakat topilmadi." />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left text-sm">
                  <thead className="text-xs text-faint">
                    <tr className="border-b border-line">
                      <th className="py-2 pr-3 font-semibold">Sana</th>
                      <th className="py-2 pr-3 font-semibold">Variant</th>
                      <th className="py-2 pr-3 font-semibold">Ombor</th>
                      <th className="py-2 pr-3 font-semibold">Turi</th>
                      <th className="py-2 pr-3 font-semibold">Qty</th>
                      <th className="py-2 pr-3 font-semibold">Sabab</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {movements.map((movement) => (
                      <tr key={movement.id}>
                        <td className="py-3 pr-3 text-xs text-faint">
                          {new Date(movement.createdAt).toLocaleString('uz-UZ')}
                        </td>
                        <td className="py-3 pr-3">{variantLabel(movement.variant)}</td>
                        <td className="py-3 pr-3 text-muted">{movement.warehouse?.code}</td>
                        <td className="py-3 pr-3">
                          <Badge>{movement.type}</Badge>
                        </td>
                        <td className="py-3 pr-3 font-semibold tabular-nums">
                          {movement.quantity}
                        </td>
                        <td className="py-3 pr-3 text-muted">{movement.reason ?? '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Panel>

          <Panel title="Rezervlar">
            {reservations.length === 0 ? (
              <EmptyState icon={Inbox} message="Rezerv topilmadi." />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left text-sm">
                  <thead className="text-xs text-faint">
                    <tr className="border-b border-line">
                      <th className="py-2 pr-3 font-semibold">Variant</th>
                      <th className="py-2 pr-3 font-semibold">Order</th>
                      <th className="py-2 pr-3 font-semibold">Ombor</th>
                      <th className="py-2 pr-3 font-semibold">Qty</th>
                      <th className="py-2 pr-3 font-semibold">Holat</th>
                      <th className="py-2 text-right font-semibold">Amal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {reservations.map((reservation) => (
                      <tr key={reservation.id}>
                        <td className="py-3 pr-3">{variantLabel(reservation.variant)}</td>
                        <td className="py-3 pr-3 text-xs text-faint">{reservation.orderId}</td>
                        <td className="py-3 pr-3 text-muted">{reservation.warehouse?.code}</td>
                        <td className="py-3 pr-3 font-semibold tabular-nums">
                          {reservation.quantity}
                        </td>
                        <td className="py-3 pr-3">
                          <Badge
                            tone={
                              reservation.status === 'ACTIVE'
                                ? 'accent'
                                : reservation.status === 'CONFIRMED'
                                  ? 'ok'
                                  : 'neutral'
                            }
                          >
                            {reservation.status}
                          </Badge>
                        </td>
                        <td className="py-3 text-right">
                          <button
                            type="button"
                            disabled={reservation.status !== 'ACTIVE'}
                            onClick={() => void releaseReservation(reservation)}
                            className={buttonClass}
                          >
                            <RotateCcw size={13} aria-hidden="true" />
                            Release
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Panel>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-20 lg:self-start">
          <Panel title={warehouseForm.id ? 'Omborni tahrirlash' : 'Yangi ombor'}>
            <form onSubmit={saveWarehouse} className="space-y-3">
              <Field label="Nomi">
                <input
                  required
                  value={warehouseForm.name}
                  onChange={(event) =>
                    setWarehouseForm((prev) => ({ ...prev, name: event.target.value }))
                  }
                  className={inputClass}
                />
              </Field>
              <Field label="Kod">
                <input
                  required
                  value={warehouseForm.code}
                  onChange={(event) =>
                    setWarehouseForm((prev) => ({
                      ...prev,
                      code: event.target.value.toUpperCase()
                    }))
                  }
                  className={inputClass}
                />
              </Field>
              <label className="flex items-center gap-2 text-sm text-muted">
                <input
                  type="checkbox"
                  checked={warehouseForm.isActive}
                  onChange={(event) =>
                    setWarehouseForm((prev) => ({ ...prev, isActive: event.target.checked }))
                  }
                />
                Faol
              </label>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={busy === 'warehouse'}
                  className={primaryButtonClass}
                >
                  <Plus size={14} aria-hidden="true" />
                  Saqlash
                </button>
                {warehouseForm.id ? (
                  <button
                    type="button"
                    onClick={() => setWarehouseForm(emptyWarehouse)}
                    className={buttonClass}
                  >
                    Bekor
                  </button>
                ) : null}
              </div>
            </form>
            <div className="mt-4 divide-y divide-line">
              {warehouses.map((warehouse) => (
                <div key={warehouse.id} className="flex items-center justify-between gap-2 py-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink">
                      {warehouse.code}
                    </p>
                    <p className="truncate text-xs text-faint">
                      {warehouse.name} · {warehouse.isActive ? 'active' : 'inactive'}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => setWarehouseForm(warehouse)}
                      className={buttonClass}
                      aria-label="Omborni tahrirlash"
                    >
                      <Edit3 size={13} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => void deactivateWarehouse(warehouse)}
                      className={buttonClass}
                      aria-label="Omborni deaktiv qilish"
                    >
                      <Trash2 size={13} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Qoldiq tuzatish" description="Manfiy delta chiqim, musbat delta kirim.">
            <form onSubmit={adjustStock} className="space-y-3">
              <Field label="Ombor">
                <select
                  required
                  value={adjustmentForm.warehouseId}
                  onChange={(event) =>
                    setAdjustmentForm((prev) => ({
                      ...prev,
                      warehouseId: event.target.value
                    }))
                  }
                  className={inputClass}
                >
                  <option value="">Tanlang</option>
                  {warehouses.map((warehouse) => (
                    <option key={warehouse.id} value={warehouse.id}>
                      {warehouse.code}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Variant">
                <select
                  value={adjustmentForm.variantId}
                  onChange={(event) =>
                    setAdjustmentForm((prev) => ({
                      ...prev,
                      variantId: event.target.value
                    }))
                  }
                  className={inputClass}
                >
                  <option value="">Tanlang yoki pastga UUID yozing</option>
                  {knownVariants.map(({ id, variant }) => (
                    <option key={id} value={id}>
                      {variantLabel(variant)}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Variant UUID">
                <input
                  required
                  value={adjustmentForm.variantId}
                  onChange={(event) =>
                    setAdjustmentForm((prev) => ({
                      ...prev,
                      variantId: event.target.value
                    }))
                  }
                  className={inputClass}
                />
              </Field>
              <Field label="Delta">
                <input
                  required
                  type="number"
                  value={adjustmentForm.onHandDelta}
                  onChange={(event) =>
                    setAdjustmentForm((prev) => ({
                      ...prev,
                      onHandDelta: event.target.value
                    }))
                  }
                  className={inputClass}
                />
              </Field>
              <Field label="Turi">
                <select
                  value={adjustmentForm.type}
                  onChange={(event) =>
                    setAdjustmentForm((prev) => ({
                      ...prev,
                      type: event.target.value as MovementType
                    }))
                  }
                  className={inputClass}
                >
                  {MANUAL_MOVEMENT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Sabab">
                <textarea
                  required
                  rows={3}
                  value={adjustmentForm.reason}
                  onChange={(event) =>
                    setAdjustmentForm((prev) => ({ ...prev, reason: event.target.value }))
                  }
                  className={inputClass}
                />
              </Field>
              <button type="submit" disabled={busy === 'adjust'} className={primaryButtonClass}>
                Qoldiqni saqlash
              </button>
            </form>
          </Panel>
        </aside>
      </div>
    </div>
  );
}
