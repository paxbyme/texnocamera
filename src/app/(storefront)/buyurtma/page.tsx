'use client';

import Link from 'next/link';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Send,
  ShoppingCart
} from 'lucide-react';
import { TELEGRAM_BOT, useCheckoutViewModel } from './useCheckoutViewModel';

export default function CheckoutPage() {
  const vm = useCheckoutViewModel();

  // --- success: sent to Telegram ---------------------------------------------
  if (vm.placed) {
    return (
      <main className="mx-auto max-w-xl px-4 py-16 lg:px-8">
        <div className="flex flex-col items-center rounded-3xl border border-line bg-white p-8 text-center shadow-soft">
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-ok/10 text-ok">
            <CheckCircle2 size={34} aria-hidden="true" />
          </span>
          <h1 className="mt-5 font-display text-xl font-bold text-ink">
            Buyurtma Telegram orqali yuborildi
          </h1>
          <p className="mt-2 text-sm text-muted">
            Buyurtmangiz operatorlar chatiga yuborildi. <b>@{TELEGRAM_BOT}</b>{' '}
            botini ochib, kerak bo‘lsa qo‘shimcha xabar qoldirishingiz mumkin.
          </p>

          <button
            type="button"
            onClick={() => vm.openBot(vm.placed!.botUrl)}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-accent-hover hover:shadow-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            <Send size={17} aria-hidden="true" />
            Telegram botni qayta ochish
          </button>

          <Link
            href={'/' as never}
            className="mt-3 inline-flex items-center gap-2 rounded-xl border border-line bg-white px-5 py-2.5 text-sm font-semibold text-ink transition hover:border-brand-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            Bosh sahifaga qaytish
          </Link>
        </div>
      </main>
    );
  }

  // --- loading / empty -------------------------------------------------------
  if (!vm.hydrated) {
    return (
      <main className="mx-auto flex max-w-3xl items-center justify-center px-4 py-24">
        <Loader2 size={22} className="animate-spin text-muted" aria-hidden="true" />
        <span className="sr-only">Yuklanmoqda…</span>
      </main>
    );
  }

  if (vm.items.length === 0) {
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
              Buyurtma berish uchun avval mahsulot qo‘shing.
            </p>
          </div>
          <Link
            href={'/#katalog' as never}
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-accent-hover hover:shadow-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            Katalogga o‘tish
          </Link>
        </div>
      </main>
    );
  }

  // --- form ------------------------------------------------------------------
  const fieldClass =
    'mt-1.5 w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink shadow-soft outline-none transition placeholder:text-faint focus:border-brand-300 focus:ring-2 focus:ring-accent/30';
  const labelClass = 'block text-xs font-semibold text-ink';

  return (
    <main className="mx-auto max-w-6xl px-4 pb-16 pt-8 lg:px-8">
      <Link
        href={'/savatcha' as never}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition hover:text-ink"
      >
        <ArrowLeft size={15} aria-hidden="true" />
        Savatchaga qaytish
      </Link>

      <h1 className="mt-3 font-display text-2xl font-bold tracking-tight text-ink">
        Buyurtmani rasmiylashtirish
      </h1>
      <p className="mt-1 text-sm text-muted">
        Ism va telefon raqamingizni qoldiring — buyurtma <b>@{TELEGRAM_BOT}</b>{' '}
        boti orqali operatorlarga avtomatik yuboriladi.
      </p>

      <form
        onSubmit={vm.submit}
        className="mt-6 grid gap-6 lg:grid-cols-[1fr_20rem]"
        noValidate
      >
        <div className="flex flex-col gap-5 rounded-2xl border border-line bg-white p-5 shadow-soft sm:p-6">
          <div className="grid gap-4">
            <div>
              <label htmlFor="fullName" className={labelClass}>
                Ism familiya <span className="text-warn">*</span>
              </label>
              <input
                id="fullName"
                value={vm.form.fullName}
                onChange={(e) => vm.update('fullName', e.target.value)}
                placeholder="Masalan: Akmal Karimov"
                autoComplete="name"
                className={fieldClass}
                required
              />
            </div>

            <div>
              <label htmlFor="phone" className={labelClass}>
                Telefon raqam <span className="text-warn">*</span>
              </label>
              <div className="mt-1.5 flex items-stretch overflow-hidden rounded-xl border border-line bg-white shadow-soft focus-within:border-brand-300 focus-within:ring-2 focus-within:ring-accent/30">
                <span className="flex items-center border-r border-line bg-surface px-3 text-sm font-semibold text-muted">
                  +998
                </span>
                <input
                  id="phone"
                  value={vm.phoneDigits}
                  onChange={(e) => vm.update('phone', e.target.value)}
                  inputMode="numeric"
                  placeholder="90 123 45 67"
                  autoComplete="tel-national"
                  className="w-full bg-transparent px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-faint"
                  required
                />
              </div>
              {vm.phoneTouched && !vm.phoneValid ? (
                <p className="mt-1 text-[11px] text-warn">
                  9 xonali raqam kiriting (masalan 901234567).
                </p>
              ) : null}
            </div>
          </div>

          <div className="flex items-start gap-2 rounded-xl border border-line bg-surface px-4 py-3 text-left text-xs text-muted">
            <Send size={16} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
            <span>
              “Telegram’ga yuborish” tugmasini bossangiz, <b>@{TELEGRAM_BOT}</b>{' '}
              boti ochiladi va buyurtmangiz operatorlar chatiga yuboriladi. Operator
              siz bilan telefon orqali bog‘lanadi.
            </span>
          </div>

          {vm.error ? (
            <div className="flex items-start gap-2 rounded-xl border border-warn/30 bg-warn/5 px-4 py-3 text-left text-xs text-warn">
              <AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
              <span>{vm.error}</span>
            </div>
          ) : null}
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-line bg-white p-5 shadow-soft">
            <h2 className="font-display text-base font-bold text-ink">
              Buyurtma ({vm.count})
            </h2>
            <ul className="mt-3 divide-y divide-line">
              {vm.items.map((item) => (
                <li
                  key={item.variantId}
                  className="flex items-start justify-between gap-3 py-2.5 text-sm"
                >
                  <span className="min-w-0">
                    <span className="line-clamp-1 font-medium text-ink">
                      {item.name}
                    </span>
                    <span className="text-xs text-faint">
                      {item.variantName ?? `SKU: ${item.sku}`}
                    </span>
                  </span>
                  <span className="shrink-0 font-semibold tabular-nums text-muted">
                    × {item.quantity}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex items-center justify-between border-t border-line pt-4 text-xs text-muted">
              <span className="font-semibold text-ink">Narx</span>
              <span>Operator bilan kelishiladi</span>
            </div>

            <button
              type="submit"
              disabled={!vm.formValid || vm.submitting}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-accent-hover hover:shadow-glow active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-brand-100 disabled:text-faint disabled:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 motion-reduce:active:scale-100"
            >
              {vm.submitting ? (
                <>
                  <Loader2 size={17} className="animate-spin" aria-hidden="true" />
                  Tayyorlanmoqda…
                </>
              ) : (
                <>
                  <Send size={17} aria-hidden="true" />
                  Telegram’ga yuborish
                </>
              )}
            </button>

            <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[11px] leading-relaxed text-muted">
              <Send size={12} aria-hidden="true" />
              Operatorlar telefon orqali bog‘lanadi
            </p>
          </div>
        </aside>
      </form>
    </main>
  );
}
