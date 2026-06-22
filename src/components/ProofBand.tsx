import { ShieldCheck, BadgeCheck, Wrench, Truck } from 'lucide-react';

const BRANDS = ['HIKVISION', 'Dahua', 'ZKTeco', 'Commax', 'Anviz', 'Tiandy'];

const GUARANTEES = [
  { icon: BadgeCheck, title: 'Rasmiy mahsulot', desc: 'Distribyutordan, original' },
  { icon: ShieldCheck, title: '24 oygacha kafolat', desc: 'Servis markazi qo‘llab-quvvatlaydi' },
  { icon: Wrench, title: 'Professional o‘rnatish', desc: 'Sertifikatlangan ustalar' },
  { icon: Truck, title: 'Tez yetkazib berish', desc: 'Namangan bo‘ylab 24 soatda' }
];

export function ProofBand() {
  return (
    <section aria-label="Ishonch va hamkorlar" className="border-b border-line bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        {/* Partner brands */}
        <p className="text-center text-xs font-medium uppercase tracking-[0.18em] text-faint">
          Rasmiy hamkor brendlar
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 sm:gap-x-12">
          {BRANDS.map((brand) => (
            <span
              key={brand}
              className="font-display text-base font-bold tracking-tight text-brand-300 grayscale transition hover:text-brand-700 hover:grayscale-0 sm:text-lg"
            >
              {brand}
            </span>
          ))}
        </div>

        {/* Guarantees */}
        <div className="mt-8 grid grid-cols-2 gap-3 border-t border-line pt-8 lg:grid-cols-4">
          {GUARANTEES.map((g) => {
            const Icon = g.icon;
            return (
              <div key={g.title} className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent">
                  <Icon size={18} aria-hidden="true" />
                </span>
                <span className="flex flex-col leading-tight">
                  <span className="text-sm font-semibold text-ink">{g.title}</span>
                  <span className="mt-0.5 text-xs text-muted">{g.desc}</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
