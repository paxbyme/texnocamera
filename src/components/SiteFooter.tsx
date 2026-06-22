import Link from 'next/link';
import Image from 'next/image';
import { Phone, MapPin, Clock, Send } from 'lucide-react';

const COLUMNS = [
  {
    title: 'Mahsulotlar',
    links: [
      'Videokuzatuv kameralari',
      'Biometrik qulflar',
      'Kodli qulflar',
      'Signalizatsiya',
      'Kirishni boshqarish'
    ]
  },
  {
    title: 'Kompaniya',
    links: ['Biz haqimizda', 'O‘rnatish xizmati', 'Kafolat', 'Hamkorlik', 'Aloqa']
  }
];

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-line bg-brand-50 text-muted">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div className="sm:col-span-2 lg:col-span-1">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/logo-mark.png"
              alt="Texno Camera"
              width={44}
              height={44}
              className="h-10 w-auto"
            />
            <span className="font-display text-lg font-bold tracking-tight text-ink">
              <span className="text-accent">Texno</span> Camera
            </span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
            Xavfsizlik va kuzatuv tizimlari. Buyurtma bering — operatorimiz qo‘ng‘iroq
            qilib, model, narx va yetkazib berishni yakunlaydi.
          </p>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h3 className="text-sm font-semibold text-ink">{col.title}</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {col.links.map((link) => (
                <li key={link}>
                  <span className="text-muted transition hover:text-accent">{link}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h3 className="text-sm font-semibold text-ink">Aloqa</h3>
          <ul className="mt-4 space-y-3 text-sm text-muted">
            <li className="flex items-center gap-2.5">
              <Phone size={15} className="text-accent" aria-hidden="true" />
              <a href="tel:+998912942222" className="transition hover:text-accent">
                +998 91 294 22 22
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Send size={15} className="text-accent" aria-hidden="true" />
              <a
                href="https://t.me/texnocamera_admin"
                target="_blank"
                rel="noreferrer"
                className="transition hover:text-accent"
              >
                @texnocamera_admin
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin size={15} className="mt-0.5 text-accent" aria-hidden="true" />
              <a
                href="https://maps.app.goo.gl/JywC46sDBxPYwbwC7"
                target="_blank"
                rel="noreferrer"
                className="transition hover:text-accent"
              >
                Bizning manzil — xaritada ko‘rish
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Clock size={15} className="text-accent" aria-hidden="true" />
              Har kuni 08:00 — 22:00
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-faint sm:flex-row lg:px-8">
          <p>© {new Date().getFullYear()} Texno Cam. Barcha huquqlar himoyalangan.</p>
          <p className="flex items-center gap-1.5">
            <span className="inline-block h-1.5 w-1.5 animate-pulse-glow rounded-full bg-accent" />
            Operatorlar onlayn
          </p>
        </div>
      </div>
    </footer>
  );
}
