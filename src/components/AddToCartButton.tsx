'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, Plus, ShoppingCart } from 'lucide-react';
import { useCart, type CartItem } from '../lib/cart';

type AddToCartButtonProps = {
  item: Omit<CartItem, 'quantity'>;
  quantity?: number;
  disabled?: boolean;
  /** 'card' = compact catalog button, 'detail' = full-width product page CTA. */
  variant?: 'card' | 'detail';
  className?: string;
};

export function AddToCartButton({
  item,
  quantity = 1,
  disabled = false,
  variant = 'card',
  className = ''
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    []
  );

  const handleClick = () => {
    if (disabled) return;
    addItem(item, quantity);
    setAdded(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), 1600);
  };

  const base =
    'flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 active:scale-[0.97] motion-reduce:active:scale-100';
  const size = variant === 'detail' ? 'w-full px-4 py-3' : 'w-full px-3 py-2.5';

  if (disabled) {
    return (
      <span
        className={`${base} ${size} cursor-not-allowed bg-brand-100 text-faint ${className}`}
      >
        <Check size={16} aria-hidden="true" />
        Mavjud emas
      </span>
    );
  }

  const tone = added
    ? 'bg-ok text-white shadow-soft'
    : variant === 'detail'
      ? 'bg-accent text-white shadow-soft hover:bg-accent-hover hover:shadow-glow'
      : 'bg-accent text-white hover:bg-accent-hover hover:shadow-glow';

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-live="polite"
      className={`${base} ${size} ${tone} ${className}`}
    >
      {added ? (
        <>
          <Check size={16} aria-hidden="true" />
          Savatga qo‘shildi
        </>
      ) : variant === 'detail' ? (
        <>
          <ShoppingCart size={17} aria-hidden="true" />
          Savatga qo‘shish
        </>
      ) : (
        <>
          <Plus size={16} aria-hidden="true" />
          Savatga
        </>
      )}
    </button>
  );
}
