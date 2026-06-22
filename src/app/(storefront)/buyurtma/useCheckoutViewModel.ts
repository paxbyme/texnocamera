'use client';

import { useMemo, useState } from 'react';
import { createTelegramOrderIntent } from '../../../lib/api';
import { useCart, type CartItem } from '../../../lib/cart';

/** Telegram order bot the checkout hands off to. */
export const TELEGRAM_BOT = 'texnocam_bot';

export type CheckoutForm = {
  fullName: string;
  phone: string;
};

export type PlacedOrder = {
  fullName: string;
  phone: string;
  /** `t.me/<bot>?start=<token>` deep link the shopper presses Start on. */
  botUrl: string;
};

export type CheckoutViewModel = ReturnType<typeof useCheckoutViewModel>;

/**
 * ViewModel for the guest checkout screen (MVVM). It collects the customer's
 * name and phone, then hands the order off to the Telegram order bot: the order
 * is stashed on the server and the bot's deep link is opened. When the shopper
 * presses Start, the bot auto-posts the full order into the operators' chat —
 * no copy-paste or manual typing on the shopper's side.
 */
export function useCheckoutViewModel() {
  const { hydrated, items, count, clear } = useCart();

  const [form, setForm] = useState<CheckoutForm>({ fullName: '', phone: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [placed, setPlaced] = useState<PlacedOrder | null>(null);

  const update = <K extends keyof CheckoutForm>(key: K, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  // 9 local digits after the fixed +998 prefix.
  const phoneDigits = form.phone.replace(/\D/g, '').slice(0, 9);
  const phoneValid = phoneDigits.length === 9;
  const phoneTouched = form.phone.length > 0;

  const formValid = useMemo(
    () => form.fullName.trim().length >= 2 && phoneValid,
    [form.fullName, phoneValid]
  );

  /** Re-opens the bot deep link (success screen's "open again" button). */
  function openBot(url: string) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  function intentItems(cartItems: CartItem[]) {
    return cartItems.map((item) => ({
      name: item.name,
      sku: item.sku,
      quantity: item.quantity,
      ...(item.variantName ? { variantName: item.variantName } : {})
    }));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!formValid || submitting || items.length === 0) return;

    setSubmitting(true);
    setError(null);

    const fullName = form.fullName.trim();
    const phone = `+998${phoneDigits}`;

    const result = await createTelegramOrderIntent({
      fullName,
      phone,
      items: intentItems(items)
    });

    if (result.ok && result.data.url) {
      openBot(result.data.url);
      setPlaced({ fullName, phone, botUrl: result.data.url });
      clear();
    } else {
      setError(
        result.ok
          ? 'Telegram bot topilmadi. Birozdan so‘ng qayta urinib ko‘ring.'
          : result.message
      );
    }

    setSubmitting(false);
  }

  return {
    hydrated,
    items,
    count,
    form,
    update,
    phoneDigits,
    phoneValid,
    phoneTouched,
    formValid,
    submitting,
    error,
    placed,
    submit,
    openBot
  };
}
