import Link from 'next/link';
import Image from 'next/image';
import { Phone, Search, MapPin, Truck } from 'lucide-react';
import { CartButton } from './CartButton';

const NAV = [
  { label: 'Mahsulotlar', href: '/mahsulotlar' },
  { label: 'Kategoriyalar', href: '/#kategoriyalar' },
  { label: 'Qanday ishlaydi', href: '/#qanday-ishlaydi' }
];

export function SiteHeader() {
  return (
    <div className="sticky top-0 z-50">
      {/* Utility bar */}
      <div className="hidden border-b border-line bg-brand-50 text-muted md:block">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-4 text-xs lg:px-8">
          <div className="flex items-center gap-6">
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={13} className="text-accent" aria-hidden="true" />
              Namangan, O‘zbekiston
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Truck size={13} className="text-accent" aria-hidden="true" />
              Namangan bo‘ylab 24 soatda yetkazib berish
            </span>
          </div>
          <div className="flex items-center gap-5">
            <Link href={'/#qanday-ishlaydi' as never} className="transition hover:text-accent">
              Yordam
            </Link>
            <Link href={'/savatcha' as never} className="transition hover:text-accent">
              Savatcha
            </Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className="border-b border-line/70 glass">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 lg:px-8">
          <Link href="/" className="group flex shrink-0 items-center gap-2.5">
            <Image
              src="/logo-mark.png"
              alt="Texno Camera"
              width={40}
              height={40}
              priority
              className="h-9 w-auto"
            />
            <span className="flex flex-col leading-none">
              <span className="font-display text-base font-bold tracking-tight text-ink">
                <span className="text-accent">Texno</span> Camera
              </span>
              <span className="mt-0.5 text-[11px] font-medium uppercase tracking-[0.18em] text-faint">
                Security systems
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href as never}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted transition hover:bg-brand-900/[0.05] hover:text-accent"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Inline search */}
          <form
            action="/mahsulotlar"
            className="ml-auto hidden h-10 max-w-sm flex-1 items-center gap-2 rounded-xl border border-transparent bg-surface px-3.5 transition focus-within:border-brand-300 lg:flex"
          >
            <Search size={16} className="shrink-0 text-faint" aria-hidden="true" />
            <input
              name="q"
              placeholder="Kamera, qulf yoki komplekt qidirish…"
              aria-label="Mahsulot qidirish"
              className="min-w-0 flex-1 bg-transparent text-sm text-ink placeholder:text-faint outline-none"
            />
          </form>

          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <a
              href="tel:+998912942222"
              className="hidden items-center gap-2 rounded-xl border border-line bg-white/80 px-3.5 py-2 text-sm font-semibold text-ink shadow-soft transition hover:border-brand-300 hover:shadow-card xl:flex"
            >
              <Phone size={15} className="text-accent" aria-hidden="true" />
              +998 91 294 22 22
            </a>

            <CartButton />
          </div>
        </div>
      </header>
    </div>
  );
}
