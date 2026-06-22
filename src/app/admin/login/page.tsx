'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, ArrowLeft, KeyRound, Loader2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../../lib/auth';
import { requestOtp, verifyOtp } from '../../../lib/api';
import { hasStaffAccess } from '../layout';

type Step = 'phone' | 'code';

export default function AdminLoginPage() {
  const { hydrated, user, login, logout } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [devCode, setDevCode] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Already a signed-in staff member → straight to the queue.
  useEffect(() => {
    if (hydrated && user && hasStaffAccess(user.roles)) {
      router.replace('/admin/operator');
    }
  }, [hydrated, user, router]);

  const phoneDigits = phone.replace(/\D/g, '').slice(0, 9);
  const phoneValid = phoneDigits.length === 9;
  const fullPhone = `+998${phoneDigits}`;

  async function handleRequest(event: React.FormEvent) {
    event.preventDefault();
    if (!phoneValid || busy) return;
    setBusy(true);
    setError(null);
    const result = await requestOtp(fullPhone);
    setBusy(false);
    if (result.ok) {
      setDevCode(result.data.devCode ?? null);
      setStep('code');
    } else {
      setError(result.message);
    }
  }

  async function handleVerify(event: React.FormEvent) {
    event.preventDefault();
    if (code.trim().length < 4 || busy) return;
    setBusy(true);
    setError(null);
    const result = await verifyOtp(fullPhone, code.trim(), 'Admin panel');
    if (!result.ok) {
      setBusy(false);
      setError(result.message);
      return;
    }
    if (!hasStaffAccess(result.data.user.roles)) {
      setBusy(false);
      setError(
        'Bu raqamda boshqaruv paneliga ruxsat yo‘q. Operator yoki admin hisobi bilan kiring.'
      );
      await logout();
      return;
    }
    login({
      accessToken: result.data.accessToken,
      refreshToken: result.data.refreshToken,
      user: result.data.user
    });
    router.replace('/admin/operator');
  }

  const fieldClass =
    'mt-1.5 w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink shadow-soft outline-none transition placeholder:text-faint focus:border-brand-300 focus:ring-2 focus:ring-accent/30';

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-12">
      <div className="rounded-3xl border border-line bg-white p-8 shadow-soft">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-accent text-white shadow-soft">
          <ShieldCheck size={22} aria-hidden="true" />
        </span>
        <h1 className="mt-5 font-display text-xl font-bold tracking-tight text-ink">
          Boshqaruv paneli
        </h1>
        <p className="mt-1 text-sm text-muted">
          Operator yoki admin raqamingiz bilan kiring.
        </p>

        {step === 'phone' ? (
          <form onSubmit={handleRequest} className="mt-6" noValidate>
            <label htmlFor="phone" className="block text-xs font-semibold text-ink">
              Telefon raqam
            </label>
            <div className="mt-1.5 flex items-stretch overflow-hidden rounded-xl border border-line bg-white shadow-soft focus-within:border-brand-300 focus-within:ring-2 focus-within:ring-accent/30">
              <span className="flex items-center border-r border-line bg-surface px-3 text-sm font-semibold text-muted">
                +998
              </span>
              <input
                id="phone"
                value={phoneDigits}
                onChange={(e) => setPhone(e.target.value)}
                inputMode="numeric"
                placeholder="90 123 45 67"
                autoComplete="tel-national"
                className="w-full bg-transparent px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-faint"
              />
            </div>

            {error ? <FormError message={error} /> : null}

            <button
              type="submit"
              disabled={!phoneValid || busy}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:bg-brand-100 disabled:text-faint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            >
              {busy ? (
                <Loader2 size={17} className="animate-spin" aria-hidden="true" />
              ) : (
                <KeyRound size={17} aria-hidden="true" />
              )}
              Kod yuborish
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="mt-6" noValidate>
            <button
              type="button"
              onClick={() => {
                setStep('phone');
                setCode('');
                setError(null);
              }}
              className="mb-3 inline-flex items-center gap-1.5 text-xs font-medium text-muted transition hover:text-ink"
            >
              <ArrowLeft size={14} aria-hidden="true" />
              Raqamni o‘zgartirish
            </button>

            <label htmlFor="code" className="block text-xs font-semibold text-ink">
              {fullPhone} ga yuborilgan kod
            </label>
            <input
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              inputMode="numeric"
              placeholder="••••••"
              autoFocus
              className={`${fieldClass} text-center text-lg font-bold tracking-[0.5em]`}
            />

            {devCode ? (
              <p className="mt-2 rounded-lg bg-brand-50 px-3 py-2 text-center text-xs text-brand-700">
                Dev kod: <span className="font-bold">{devCode}</span>
              </p>
            ) : null}

            {error ? <FormError message={error} /> : null}

            <button
              type="submit"
              disabled={code.trim().length < 4 || busy}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:bg-brand-100 disabled:text-faint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            >
              {busy ? (
                <Loader2 size={17} className="animate-spin" aria-hidden="true" />
              ) : null}
              Kirish
            </button>
          </form>
        )}
      </div>
    </main>
  );
}

function FormError({ message }: { message: string }) {
  return (
    <div className="mt-4 flex items-start gap-2 rounded-xl border border-warn/30 bg-warn/10 px-4 py-3 text-sm text-warn">
      <AlertCircle size={17} className="mt-0.5 shrink-0" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}
