import Link from 'next/link';
import {
  Cctv,
  Sun,
  Orbit,
  Video,
  HardDrive,
  DoorOpen,
  ScanFace,
  Siren,
  Thermometer,
  LayoutGrid
} from 'lucide-react';

// `param: 'cat'` filters by exact category; `'q'` runs a text search (ColorVu is a
// cross-category feature, not a category). Empty href -> full catalog.
const CATEGORIES = [
  { label: 'IP kameralar', hint: 'Hikvision tarmoq kameralar', icon: Cctv, param: 'cat', value: 'Tarmoq (IP) kameralar' },
  { label: 'ColorVu', hint: 'Kechasi rangli tasvir', icon: Sun, param: 'q', value: 'ColorVu' },
  { label: 'PTZ kameralar', hint: 'Aylanuvchi · optik zoom', icon: Orbit, param: 'cat', value: 'PTZ kameralar' },
  { label: 'Turbo HD', hint: 'Analog kameralar', icon: Video, param: 'cat', value: 'Turbo HD (analog) kameralar' },
  { label: 'NVR / DVR', hint: 'Yozib oluvchilar', icon: HardDrive, param: 'cat', value: 'Yozib oluvchilar (NVR/DVR)' },
  { label: 'Domofon', hint: 'Videodomofon tizimlari', icon: DoorOpen, param: 'cat', value: 'Domofon (videodomofon)' },
  { label: 'Kirish nazorati', hint: 'Yuz · barmoq izi · karta', icon: ScanFace, param: 'cat', value: 'Kirishni boshqarish' },
  { label: 'Signalizatsiya', hint: 'AX PRO datchiklar', icon: Siren, param: 'cat', value: 'Signalizatsiya' },
  { label: 'Termal', hint: 'Issiqlikni aniqlash', icon: Thermometer, param: 'cat', value: 'Termal kameralar' },
  { label: 'Barchasi', hint: 'Butun katalog', icon: LayoutGrid, param: 'cat', value: '' }
] as const;

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
              href={(cat.value ? `/mahsulotlar?${cat.param}=${encodeURIComponent(cat.value)}` : '/mahsulotlar') as never}
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
