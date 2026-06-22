export type OrderStatusMeta = { label: string; tone: string };

export const ORDER_STATUS_LABELS: Record<string, OrderStatusMeta> = {
  DRAFT: { label: 'Qoralama', tone: 'bg-brand-50 text-brand-700' },
  PENDING_PAYMENT: { label: 'To‘lov kutilmoqda', tone: 'bg-warn/10 text-warn' },
  PAID: { label: 'To‘langan', tone: 'bg-ok/10 text-ok' },
  AWAITING_CONFIRMATION: {
    label: 'Tasdiq kutilmoqda',
    tone: 'bg-warn/10 text-warn'
  },
  CONFIRMED: { label: 'Tasdiqlangan', tone: 'bg-ok/10 text-ok' },
  PACKING: { label: 'Qadoqlanmoqda', tone: 'bg-brand-50 text-brand-700' },
  READY_FOR_SHIPPING: {
    label: 'Jo‘natishga tayyor',
    tone: 'bg-brand-50 text-brand-700'
  },
  SHIPPED: { label: 'Jo‘natildi', tone: 'bg-brand-50 text-brand-700' },
  DELIVERED: { label: 'Yetkazildi', tone: 'bg-ok/10 text-ok' },
  CANCELLED: { label: 'Bekor qilindi', tone: 'bg-warn/10 text-warn' },
  PAYMENT_FAILED: { label: 'To‘lov amalga oshmadi', tone: 'bg-warn/10 text-warn' },
  RETURN_REQUESTED: { label: 'Qaytarish so‘ralgan', tone: 'bg-warn/10 text-warn' },
  RETURNED: { label: 'Qaytarildi', tone: 'bg-brand-100 text-muted' },
  REFUNDED: { label: 'Pul qaytarildi', tone: 'bg-brand-100 text-muted' }
};

export function orderStatusMeta(status: string): OrderStatusMeta {
  return (
    ORDER_STATUS_LABELS[status] ?? {
      label: status,
      tone: 'bg-brand-50 text-brand-700'
    }
  );
}

export type CallOutcome =
  | 'REACHED'
  | 'NO_ANSWER'
  | 'BUSY'
  | 'CALL_LATER'
  | 'WRONG_NUMBER'
  | 'CONFIRMED'
  | 'DECLINED';

export const CALL_OUTCOMES: { value: CallOutcome; label: string }[] = [
  { value: 'REACHED', label: 'Bog‘lanildi' },
  { value: 'NO_ANSWER', label: 'Javob bermadi' },
  { value: 'BUSY', label: 'Band' },
  { value: 'CALL_LATER', label: 'Keyinroq qo‘ng‘iroq' },
  { value: 'WRONG_NUMBER', label: 'Noto‘g‘ri raqam' },
  { value: 'CONFIRMED', label: 'Tasdiqladi' },
  { value: 'DECLINED', label: 'Rad etdi' }
];

export function callOutcomeLabel(outcome: string): string {
  return CALL_OUTCOMES.find((o) => o.value === outcome)?.label ?? outcome;
}

export type Customer = {
  id: string;
  fullName?: string | null;
  phone: string;
  telegramUsername?: string | null;
};

export type OrderListItem = {
  id: string;
  number: string;
  status: string;
  total: string | number;
  createdAt: string;
  customer?: Customer | null;
  items: { id: string; productNameSnapshot: string; quantity: number }[];
  assignedOperator?: { id: string; fullName?: string | null } | null;
};

export type OrderDetail = {
  id: string;
  number: string;
  status: string;
  subtotal: string | number;
  deliveryPrice: string | number;
  total: string | number;
  createdAt: string;
  customer?: Customer | null;
  assignedOperator?: { id: string; fullName?: string | null; phone?: string } | null;
  deliveryAddressSnapshot?: Record<string, unknown> | null;
  items: {
    id: string;
    productNameSnapshot: string;
    variantNameSnapshot?: string | null;
    skuSnapshot: string;
    quantity: number;
    unitPrice: string | number;
    total: string | number;
  }[];
  calls: {
    id: string;
    outcome: string;
    note?: string | null;
    createdAt: string;
    operator?: { fullName?: string | null } | null;
  }[];
  statusHistory: {
    id: string;
    oldStatus?: string | null;
    newStatus: string;
    reason?: string | null;
    createdAt: string;
  }[];
};
