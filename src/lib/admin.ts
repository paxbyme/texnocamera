import type { OrderDetail, OrderListItem } from './orders';

export type AuthFetch = (path: string, init?: RequestInit) => Promise<Response>;

export type Pagination = {
  page: number;
  limit: number;
  total: number;
};

export type Paginated<T> = {
  data: T[];
  pagination: Pagination;
};

type ApiErrorBody = {
  error?: {
    code?: string;
    message?: string;
    details?: Record<string, unknown>;
  };
  code?: string;
  message?: string;
};

export async function adminRequest<T>(
  authFetch: AuthFetch,
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const response = await authFetch(path, init);
  const text = await response.text();
  const body = text ? safeJson(text) : null;

  if (!response.ok) {
    const error = body as ApiErrorBody | null;
    const message =
      error?.error?.message ??
      error?.message ??
      `So'rov bajarilmadi (${response.status})`;
    throw new Error(message);
  }

  return body as T;
}

export function jsonRequest(method: 'POST' | 'PATCH' | 'DELETE', body?: unknown) {
  return {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(cleanPayload(body))
  } satisfies RequestInit;
}

export function queryString(params: Record<string, string | number | undefined | null>) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      search.set(key, String(value));
    }
  }
  const value = search.toString();
  return value ? `?${value}` : '';
}

export function cleanPayload<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((entry) => cleanPayload(entry)) as T;
  }
  if (!value || typeof value !== 'object') {
    return value;
  }

  const next: Record<string, unknown> = {};
  for (const [key, entry] of Object.entries(value)) {
    if (entry === '' || entry === undefined || entry === null) continue;
    next[key] = cleanPayload(entry);
  }
  return next as T;
}

function safeJson(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

export type Brand = {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type Category = {
  id: string;
  parentId?: string | null;
  name: string;
  slug: string;
  position: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type ProductStatus = 'DRAFT' | 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
export type VariantStatus = 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';

export type Price = {
  id: string;
  amount: string | number;
  currency: string;
  compareAtAmount?: string | number | null;
  startsAt?: string | null;
  endsAt?: string | null;
  isActive: boolean;
  createdAt: string;
};

export type ProductVariant = {
  id: string;
  productId: string;
  sku: string;
  barcode?: string | null;
  name?: string | null;
  weight?: string | number | null;
  length?: string | number | null;
  width?: string | number | null;
  height?: string | number | null;
  status: VariantStatus;
  options: { id?: string; name: string; value: string }[];
  prices: Price[];
};

export type ProductImage = {
  id: string;
  imageUrl: string;
  altText?: string | null;
  position: number;
  variantId?: string | null;
};

export type Product = {
  id: string;
  externalId?: string | null;
  name: string;
  slug: string;
  brandId?: string | null;
  categoryId?: string | null;
  description?: string | null;
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
  brand?: Brand | null;
  category?: Category | null;
};

export type ProductDetail = Product & {
  attributes: { id: string; attributeName: string; attributeValue: string }[];
  images: ProductImage[];
  variants: ProductVariant[];
};

export type PresignedUpload = {
  uploadUrl: string;
  objectKey: string;
  publicUrl: string;
  expiresIn: number;
};

export type Warehouse = {
  id: string;
  name: string;
  code: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type InventoryVariantSummary = {
  id: string;
  sku: string;
  name?: string | null;
  product?: { name: string } | null;
};

export type InventoryBalance = {
  id: string;
  warehouseId: string;
  variantId: string;
  onHandQty: number;
  reservedQty: number;
  damagedQty: number;
  availableQty: number;
  updatedAt: string;
  warehouse: Warehouse;
  variant: InventoryVariantSummary;
};

export type MovementType =
  | 'PURCHASE_RECEIVED'
  | 'ORDER_RESERVED'
  | 'ORDER_RELEASED'
  | 'ORDER_SHIPPED'
  | 'RETURN_RECEIVED'
  | 'DAMAGED'
  | 'MANUAL_ADJUSTMENT'
  | 'SYNC_FROM_1C';

export type InventoryMovement = {
  id: string;
  warehouseId: string;
  variantId: string;
  type: MovementType;
  quantity: number;
  referenceType?: string | null;
  referenceId?: string | null;
  reason?: string | null;
  createdAt: string;
  warehouse?: { code: string } | null;
  variant: InventoryVariantSummary;
};

export type ReservationStatus = 'ACTIVE' | 'CONFIRMED' | 'RELEASED' | 'EXPIRED';

export type InventoryReservation = {
  id: string;
  orderId: string;
  warehouseId: string;
  variantId: string;
  quantity: number;
  status: ReservationStatus;
  expiresAt?: string | null;
  releasedAt?: string | null;
  createdAt: string;
  warehouse?: { code: string } | null;
  variant: InventoryVariantSummary;
};

export type Shipment = {
  id: string;
  orderId: string;
  provider: string;
  trackingNumber?: string | null;
  status: DeliveryStatus;
  deliveryPrice: string | number;
  waybillUrl?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type DeliveryStatus =
  | 'NOT_STARTED'
  | 'PENDING'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'FAILED'
  | 'RETURNED';

export type DeliveryQuote = {
  provider: string;
  amount: number;
  currency: string;
  etaDays?: number;
  raw?: unknown;
};

export type AdminOrder = OrderListItem & {
  paymentStatus?: string;
  deliveryStatus?: DeliveryStatus;
  deliveryPrice?: string | number;
  subtotal?: string | number;
  discountTotal?: string | number;
};

export type AdminOrderDetail = OrderDetail & {
  customerId: string;
  paymentStatus?: string;
  deliveryStatus?: DeliveryStatus;
  discountTotal?: string | number;
  shipments?: Shipment[];
};

export const PRODUCT_STATUSES: ProductStatus[] = [
  'DRAFT',
  'ACTIVE',
  'INACTIVE',
  'ARCHIVED'
];

export const VARIANT_STATUSES: VariantStatus[] = ['ACTIVE', 'INACTIVE', 'ARCHIVED'];

export const ORDER_STATUSES = [
  'DRAFT',
  'PENDING_PAYMENT',
  'PAID',
  'AWAITING_CONFIRMATION',
  'CONFIRMED',
  'PACKING',
  'READY_FOR_SHIPPING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
  'PAYMENT_FAILED',
  'RETURN_REQUESTED',
  'RETURNED',
  'REFUNDED'
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const ORDER_NEXT: Record<OrderStatus, OrderStatus[]> = {
  DRAFT: ['PENDING_PAYMENT', 'CANCELLED'],
  PENDING_PAYMENT: ['PAID', 'PAYMENT_FAILED', 'CANCELLED'],
  PAID: ['AWAITING_CONFIRMATION', 'CANCELLED', 'REFUNDED'],
  AWAITING_CONFIRMATION: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['PACKING', 'CANCELLED'],
  PACKING: ['READY_FOR_SHIPPING', 'CANCELLED'],
  READY_FOR_SHIPPING: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['DELIVERED'],
  DELIVERED: ['RETURN_REQUESTED'],
  PAYMENT_FAILED: ['PENDING_PAYMENT', 'CANCELLED'],
  RETURN_REQUESTED: ['RETURNED', 'DELIVERED'],
  RETURNED: ['REFUNDED'],
  CANCELLED: [],
  REFUNDED: []
};

export const MOVEMENT_TYPES: MovementType[] = [
  'MANUAL_ADJUSTMENT',
  'PURCHASE_RECEIVED',
  'RETURN_RECEIVED',
  'DAMAGED',
  'ORDER_RESERVED',
  'ORDER_RELEASED',
  'ORDER_SHIPPED',
  'SYNC_FROM_1C'
];

export const MANUAL_MOVEMENT_TYPES: MovementType[] = [
  'MANUAL_ADJUSTMENT',
  'PURCHASE_RECEIVED',
  'RETURN_RECEIVED',
  'DAMAGED'
];

export const RESERVATION_STATUSES: ReservationStatus[] = [
  'ACTIVE',
  'CONFIRMED',
  'RELEASED',
  'EXPIRED'
];

export function shortId(id: string) {
  return id.slice(0, 8);
}

export function variantLabel(variant?: InventoryVariantSummary | ProductVariant | null) {
  if (!variant) return '-';
  const productName =
    'product' in variant && variant.product ? `${variant.product.name} / ` : '';
  const variantName = variant.name ? `${variant.name} / ` : '';
  return `${productName}${variantName}${variant.sku}`;
}
