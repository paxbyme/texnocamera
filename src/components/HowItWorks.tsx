import { MousePointerClick, PhoneCall, Truck } from 'lucide-react';

const STEPS = [
  {
    icon: MousePointerClick,
    step: '01',
    title: 'Mahsulotni tanlang',
    desc: 'Katalogdan kerakli kamera yoki tizimni tanlab, buyurtma qoldiring. Onlayn to‘lov shart emas.'
  },
  {
    icon: PhoneCall,
    step: '02',
    title: 'Operator qo‘ng‘iroq qiladi',
    desc: 'Mutaxassisimiz 15 daqiqa ichida bog‘lanib, model, narx va o‘rnatishni aniqlashtiradi.'
  },
  {
    icon: Truck,
    step: '03',
    title: 'Yetkazib beramiz',
    desc: 'Kelishilgan vaqtda yetkazamiz va o‘rnatamiz. To‘lov yetkazib berishda amalga oshiriladi.'
  }
];

export function HowItWorks() {
  return (
    <section id="qanday-ishlaydi" className="mx-auto max-w-7xl px-4 pt-16 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl border border-line bg-brand-50 p-8 shadow-soft sm:p-12">
        <div className="pointer-events-none absolute inset-0 bg-radial-accent" aria-hidden="true" />
        <div className="relative">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Qanday ishlaydi
            </span>
            <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              Buyurtma berish — uch oddiy qadam
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
              Bizda onlayn to‘lov yo‘q. Siz buyurtma qoldirasiz, qolganini operatorimiz
              telefon orqali hal qiladi — shaffof va xavfsiz.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {STEPS.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.step}
                  className="relative rounded-2xl border border-line bg-white p-5 shadow-soft"
                >
                  <div className="flex items-center justify-between">
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent-soft text-accent">
                      <Icon size={20} aria-hidden="true" />
                    </span>
                    <span className="font-display text-3xl font-bold text-brand-200">{s.step}</span>
                  </div>
                  <h3 className="mt-4 font-display text-base font-semibold text-ink">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
