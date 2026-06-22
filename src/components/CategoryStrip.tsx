import Link from 'next/link';
import { Cctv, Sun, Orbit, Video, HardDrive, LayoutGrid } from 'lucide-react';

const CATEGORIES = [
  { label: 'IP kameralar', hint: 'Hikvision tarmoq kameralar', icon: Cctv, q: 'Tarmoq' },
  { label: 'ColorVu', hint: 'Kechasi rangli tasvir', icon: Sun, q: 'ColorVu' },
  { label: 'PTZ kameralar', hint: 'Aylanuvchi · optik zoom', icon: Orbit, q: 'PTZ' },
  { label: 'Turbo HD', hint: 'Analog kameralar', icon: Video, q: 'Turbo' },
  { label: 'NVR / DVR', hint: 'Yozib oluvchilar', icon: HardDrive, q: 'oluvchi' },
  { label: 'Barchasi', hint: 'Butun katalog', icon: LayoutGrid, q: '' }
];

export function CategoryStrip() {
  return (
    <section id="kategoriyalar" className="mx-auto max-w-7xl px-4 pt-10 lg:px-8">
      <div className="mb-5 flex items-end justify-between">
        <div>
          <h2 className="font-display text-xl font-bold tracking-tight text-ink sm:text-2xl">
            Kategoriyalar
          </h2>
          <p className="mt-1 text-sm text-muted">Kerakli yechimni tezda toping</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          return (
            <Link
              key={cat.label}
              href={(cat.q ? `/mahsulotlar?q=${encodeURIComponent(cat.q)}` : '/mahsulotlar') as never}
              className="group flex flex-col gap-3 rounded-2xl border border-line bg-white p-4 shadow-soft transition duration-200 hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-card active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 motion-reduce:transform-none"
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent-soft text-accent transition group-hover:bg-accent group-hover:text-white">
                <Icon size={20} aria-hidden="true" />
              </span>
              <span className="flex flex-col leading-tight">
                <span className="text-sm font-semibold text-ink">{cat.label}</span>
                <span className="mt-0.5 text-[11px] text-faint">{cat.hint}</span>
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
