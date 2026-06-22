'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../lib/cart';

export function CartButton() {
  const { count, hydrated } = useCart();
  const showBadge = hydrated && count > 0;

  return (
    <Link
      href={'/savatcha' as never}
      aria-label={`Savatcha${showBadge ? `, ${count} ta mahsulot` : ''}`}
      className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-white/80 text-ink shadow-soft transition hover:border-brand-300 hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
    >
      <ShoppingCart size={18} aria-hidden="true" />
      {showBadge ? (
        <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-[1.25rem] place-items-center rounded-full bg-accent px-1 text-[11px] font-bold text-white shadow-soft tabular-nums">
          {count > 99 ? '99+' : count}
        </span>
      ) : null}
    </Link>
  );
}
