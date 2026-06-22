import { Search, ShieldCheck, PhoneCall, Truck } from 'lucide-react';
import { Camera3D } from './Camera3D';

type HeroProps = {
  query?: string;
  total: number;
};

const STATS = [
  { icon: ShieldCheck, value: '4 000+', label: 'O‘rnatilgan tizim' },
  { icon: PhoneCall, value: '15 daq', label: 'Operator qo‘ng‘irog‘i' },
  { icon: Truck, value: '24 soat', label: 'Yetkazib berish' }
];

export function Hero({ query, total }: HeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-line bg-white text-ink">
      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:py-16 lg:px-8 lg:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-10">
          <div className="mx-auto max-w-3xl text-center lg:mx-0 lg:text-left">
            <span className="inline-flex animate-fade-up items-center gap-2 rounded-full border border-accent/20 bg-accent-soft px-3.5 py-1.5 text-xs font-semibold text-accent">
              <span className="inline-block h-1.5 w-1.5 animate-pulse-glow rounded-full bg-accent" />
              Onlayn to‘lovsiz — operator qo‘ng‘iroq qiladi
            </span>

            <h1 className="mt-6 animate-fade-up font-display text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              Obyektingizni <span className="text-accent">himoya qiling</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl animate-fade-up text-base leading-relaxed text-muted sm:text-lg lg:mx-0">
              Videokuzatuv kameralari, biometrik va kodli qulflar, signalizatsiya hamda
              kirishni boshqarish tizimlari — bir joyda, professional o‘rnatish bilan.
            </p>

            {/* Search */}
            <form
              action="/mahsulotlar"
              className="mx-auto mt-8 flex max-w-xl animate-fade-up items-center gap-2 rounded-2xl border border-line bg-white p-2 shadow-card lg:mx-0"
            >
              <span className="grid place-items-center pl-2 text-faint">
                <Search size={18} aria-hidden="true" />
              </span>
              <input
                name="q"
                defaultValue={query}
                placeholder="Kamera, qulf yoki signalizatsiya qidiring…"
                aria-label="Mahsulot qidirish"
                className="min-w-0 flex-1 bg-transparent px-1 py-2 text-sm text-ink placeholder:text-faint outline-none sm:text-base"
              />
              <button
                type="submit"
                className="shrink-0 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition duration-200 hover:bg-accent-hover active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 motion-reduce:active:scale-100"
              >
                Qidirish
              </button>
            </form>
            <p className="mt-3 animate-fade-up text-xs text-faint">
              {query ? `“${query}” bo‘yicha ${total} ta natija` : `Katalogda ${total} ta mahsulot`}
            </p>
          </div>

          {/* 3D motion centerpiece */}
          <div className="flex animate-fade-up justify-center lg:justify-end">
            <Camera3D />
          </div>
        </div>

        {/* Trust stats */}
        <div className="mx-auto mt-12 grid max-w-3xl animate-fade-up grid-cols-1 gap-3 sm:grid-cols-3">
          {STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="flex items-center gap-3 rounded-2xl border border-line bg-white px-4 py-3.5 shadow-soft"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent">
                  <Icon size={18} aria-hidden="true" />
                </span>
                <span className="flex flex-col leading-tight">
                  <span className="font-display text-lg font-bold text-ink">{stat.value}</span>
                  <span className="text-xs text-muted">{stat.label}</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
