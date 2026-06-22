'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Headset,
  Loader2,
  Minus,
  Plus,
  ShoppingCart,
  Trash2
} from 'lucide-react';
import { useCart } from '../../../lib/cart';

export default function CartPage() {
  const { hydrated, items, count, setQuantity, removeItem, clear } = useCart();

  if (!hydrated) {
    return (
      <main className="mx-auto flex max-w-3xl items-center justify-center px-4 py-24">
        <Loader2 size={22} className="animate-spin text-muted" aria-hidden="true" />
        <span className="sr-only">Yuklanmoqda…</span>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 lg:px-8">
        <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-line bg-white py-20 text-center shadow-soft">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-500">
            <ShoppingCart size={26} aria-hidden="true" />
          </span>
          <div>
            <h1 className="font-display text-lg font-bold text-ink">
              Savatcha bo‘sh
            </h1>
            <p className="mt-1 text-sm text-muted">
              Katalogdan mahsulot tanlab, savatga qo‘shing.
            </p>
          </div>
          <Link
            href={'/#katalog' as never}
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-accent-hover hover:shadow-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            Katalogga o‘tish
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 pb-16 pt-8 lg:px-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-ink">
            Savatcha
          </h1>
          <p className="mt-1 text-sm text-muted">{count} ta mahsulot</p>
        </div>
        <button
          type="button"
          onClick={clear}
          className="text-xs font-semibold text-muted transition hover:text-warn"
        >
          Tozalash
        </button>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_20rem]">
        <ul className="flex flex-col gap-3">
          {items.map((item) => {
            const atMax = item.maxQty > 0 && item.quantity >= item.maxQty;
            return (
              <li
                key={item.variantId}
                className="flex gap-4 rounded-2xl border border-line bg-white p-3 shadow-soft sm:p-4"
              >
                <Link
                  href={`/mahsulot/${item.slug}` as never}
                  className="relative aspect-square h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-brand-50 to-surface sm:h-24 sm:w-24"
                >
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </Link>

                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <Link
                      href={`/mahsulot/${item.slug}` as never}
                      className="rounded font-display text-sm font-semibold leading-snug text-ink transition hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 line-clamp-2"
                    >
                      {item.name}
                    </Link>
                    <button
                      type="button"
                      onClick={() => removeItem(item.variantId)}
                      aria-label="O‘chirish"
                      className="shrink-0 rounded-lg p-1.5 text-faint transition hover:bg-warn/10 hover:text-warn focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                      <Trash2 size={16} aria-hidden="true" />
                    </button>
                  </div>

                  <p className="mt-0.5 text-[11px] text-faint">
                    {item.variantName ? `${item.variantName} · ` : ''}SKU: {item.sku}
                  </p>

                  <div className="mt-auto flex items-end justify-between gap-3 pt-3">
                    <div className="flex items-center rounded-lg border border-line">
                      <button
                        type="button"
                        onClick={() =>
                          setQuantity(item.variantId, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                        aria-label="Kamaytirish"
                        className="grid h-8 w-8 place-items-center rounded-l-lg text-muted transition hover:bg-surface disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                      >
                        <Minus size={14} aria-hidden="true" />
                      </button>
                      <span className="grid h-8 w-9 place-items-center text-sm font-semibold tabular-nums text-ink">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setQuantity(item.variantId, item.quantity + 1)
                        }
                        disabled={atMax}
                        aria-label="Ko‘paytirish"
                        className="grid h-8 w-8 place-items-center rounded-r-lg text-muted transition hover:bg-surface disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                      >
                        <Plus size={14} aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-line bg-white p-5 shadow-soft">
            <h2 className="font-display text-base font-bold text-ink">
              Buyurtma xulosasi
            </h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-muted">Mahsulotlar</dt>
                <dd className="font-semibold tabular-nums text-ink">{count} dona</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted">Narx va yetkazib berish</dt>
                <dd className="text-xs font-medium text-faint">
                  Operator bilan kelishiladi
                </dd>
              </div>
            </dl>

            <Link
              href={'/buyurtma' as never}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-accent-hover hover:shadow-glow active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 motion-reduce:active:scale-100"
            >
              Buyurtmani rasmiylashtirish
              <ArrowRight size={16} aria-hidden="true" />
            </Link>

            <p className="mt-3 flex items-start gap-1.5 text-[11px] leading-relaxed text-muted">
              <Headset size={13} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
              Onlayn to‘lov yo‘q. Operator qo‘ng‘iroq qilib narx va yetkazib
              berishni tasdiqlaydi.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
