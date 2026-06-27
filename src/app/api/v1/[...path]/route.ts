import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

type RouteContext = {
  params: Promise<{
    path?: string[];
  }>;
};

type TelegramIntentItem = {
  name?: unknown;
  sku?: unknown;
  variantName?: unknown;
  quantity?: unknown;
};

type TelegramIntentPayload = {
  fullName?: unknown;
  phone?: unknown;
  items?: unknown;
};

const HOP_BY_HOP_HEADERS = new Set([
  'connection',
  'content-encoding',
  'content-length',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailer',
  'transfer-encoding',
  'upgrade'
]);

function apiTargetBaseUrl() {
  return (
    process.env.API_URL?.trim() ||
    process.env.NEXT_PUBLIC_API_URL?.trim() ||
    ''
  ).replace(/\/+$/, '');
}

function forwardedHeaders(request: NextRequest) {
  const headers = new Headers(request.headers);
  for (const header of HOP_BY_HOP_HEADERS) {
    headers.delete(header);
  }

  const requestUrl = new URL(request.url);
  headers.set('x-forwarded-host', request.headers.get('host') ?? '');
  headers.set('x-forwarded-proto', requestUrl.protocol.replace(':', ''));
  headers.delete('host');

  return headers;
}

function responseHeaders(headers: Headers) {
  const nextHeaders = new Headers(headers);
  for (const header of HOP_BY_HOP_HEADERS) {
    nextHeaders.delete(header);
  }
  return nextHeaders;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function orderMessage(payload: {
  fullName: string;
  phone: string;
  items: Array<{
    name: string;
    sku: string;
    variantName?: string;
    quantity: number;
  }>;
}) {
  const lines = payload.items.map((item, index) => {
    const variant = item.variantName ? ` (${escapeHtml(item.variantName)})` : '';
    return `${index + 1}. ${escapeHtml(item.name)}${variant}\n   SKU: ${escapeHtml(item.sku)} x ${item.quantity}`;
  });

  return [
    '<b>Yangi buyurtma</b>',
    '',
    `<b>Mijoz:</b> ${escapeHtml(payload.fullName)}`,
    `<b>Telefon:</b> ${escapeHtml(payload.phone)}`,
    '',
    '<b>Mahsulotlar:</b>',
    ...lines
  ].join('\n');
}

async function createDirectTelegramIntent(request: NextRequest) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = process.env.TELEGRAM_ORDERS_CHAT_ID?.trim();
  const botUsername =
    process.env.TELEGRAM_BOT_USERNAME?.trim().replace(/^@/, '') || 'texnocam_bot';

  if (!botToken || !chatId) {
    return null;
  }

  const body = (await request.json().catch(() => null)) as
    | TelegramIntentPayload
    | null;
  const fullName =
    typeof body?.fullName === 'string' ? body.fullName.trim() : '';
  const phone = typeof body?.phone === 'string' ? body.phone.trim() : '';
  const rawItems = Array.isArray(body?.items) ? body.items : [];
  const items = rawItems
    .map((raw): TelegramIntentItem => (raw && typeof raw === 'object' ? raw : {}))
    .map((item) => ({
      name: typeof item.name === 'string' ? item.name.trim() : '',
      sku: typeof item.sku === 'string' ? item.sku.trim() : '',
      variantName:
        typeof item.variantName === 'string' ? item.variantName.trim() : undefined,
      quantity:
        typeof item.quantity === 'number' && Number.isFinite(item.quantity)
          ? Math.max(1, Math.floor(item.quantity))
          : 1
    }))
    .filter((item) => item.name && item.sku);

  if (!fullName || !phone || items.length === 0) {
    return NextResponse.json(
      {
        code: 'VALIDATION_ERROR',
        message: 'Buyurtma malumotlari toliq emas.'
      },
      { status: 400 }
    );
  }

  const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: orderMessage({ fullName, phone, items }),
      parse_mode: 'HTML'
    })
  });
  const telegram = (await response.json().catch(() => null)) as
    | { ok?: boolean; description?: string }
    | null;

  if (!response.ok || !telegram?.ok) {
    return NextResponse.json(
      {
        code: 'TELEGRAM_SEND_FAILED',
        message:
          telegram?.description ??
          'Telegramga yuborib bolmadi. Birozdan song qayta urinib koring.'
      },
      { status: 502 }
    );
  }

  return NextResponse.json({
    token: `direct-${Date.now()}`,
    url: `https://t.me/${botUsername}`
  });
}

async function proxy(request: NextRequest, context: RouteContext) {
  const { path = [] } = await context.params;
  const pathKey = path.join('/');

  if (request.method === 'POST' && pathKey === 'checkout/telegram-intent') {
    const directResponse = await createDirectTelegramIntent(request);
    if (directResponse) {
      return directResponse;
    }
  }

  const baseUrl = apiTargetBaseUrl();
  if (!baseUrl) {
    return NextResponse.json(
      {
        code: 'API_NOT_CONFIGURED',
        message:
          'API server sozlanmagan. Railway web servisida API_URL ni backend manziliga qoying.'
      },
      { status: 503 }
    );
  }

  const requestUrl = new URL(request.url);
  const targetUrl = new URL(
    `/api/v1/${path.map(encodeURIComponent).join('/')}${requestUrl.search}`,
    baseUrl
  );

  const init: RequestInit = {
    method: request.method,
    headers: forwardedHeaders(request),
    redirect: 'manual',
    cache: 'no-store'
  };

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    init.body = await request.arrayBuffer();
  }

  try {
    const response = await fetch(targetUrl, init);
    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders(response.headers)
    });
  } catch {
    return NextResponse.json(
      {
        code: 'API_UNREACHABLE',
        message: 'API serverga ulanib bolmadi. API_URL manzilini tekshiring.'
      },
      { status: 502 }
    );
  }
}

export function GET(request: NextRequest, context: RouteContext) {
  return proxy(request, context);
}

export function POST(request: NextRequest, context: RouteContext) {
  return proxy(request, context);
}

export function PUT(request: NextRequest, context: RouteContext) {
  return proxy(request, context);
}

export function PATCH(request: NextRequest, context: RouteContext) {
  return proxy(request, context);
}

export function DELETE(request: NextRequest, context: RouteContext) {
  return proxy(request, context);
}
