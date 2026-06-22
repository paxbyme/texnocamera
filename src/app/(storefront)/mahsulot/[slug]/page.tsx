import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ProductGallery } from '../../../../components/ProductGallery';
import { AddToCartButton } from '../../../../components/AddToCartButton';
import { getProductBySlug, type CatalogProductDetail } from '../../../../lib/api';
import {
  ChevronRight,
  Headset,
  ShieldCheck,
  Truck,
  RotateCcw,
  ShoppingBag
} from 'lucide-react';

const PHONE = '+998912942222';
const PHONE_LABEL = '+998 91 294 22 22';

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

function availableQty(product: CatalogProductDetail) {
  const variant = product.variants[0];
  return (
    variant?.inventoryBalances.reduce(
      (total, b) => total + b.onHandQty - b.reservedQty - b.damagedQty,
      0
    ) ?? 0
  );
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) {
    return { title: 'Mahsulot topilmadi — Texno Cam' };
  }
  return {
    title: `${product.name} — Texno Cam`,
    description:
      product.description?.slice(0, 160) ??
      `${product.name}. Buyurtma bering — operator qo‘ng‘iroq qilib yakunlaydi.`
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const variant = product.variants[0];
  const price = variant?.prices[0]?.amount;
  const qty = availableQty(product);
  const soldOut = qty <= 0;
  const low = !soldOut && qty < 5;

  const stock = soldOut
    ? { label: 'Hozircha tugagan', className: 'border-warn/30 bg-warn/10 text-warn', dot: 'bg-warn' }
    : low
      ? { label: `Kam qoldi · ${qty} dona`, className: 'border-warn/30 bg-warn/10 text-warn', dot: 'bg-warn' }
      : { label: `Sotuvda · ${qty} dona`, className: 'border-ok/25 bg-ok/10 text-ok', dot: 'bg-ok' };

  const options = variant?.options ?? [];

  return (
    <main className="mx-auto max-w-7xl px-4 pb-16 pt-6 lg:px-8">
      <nav aria-label="Yo‘l xaritasi" className="flex items-center gap-1.5 text-xs font-medium text-muted">
        <Link href="/" className="transition hover:text-ink">
          Bosh sahifa
        </Link>
        <ChevronRight size={13} aria-hidden="true" className="text-faint" />
        <Link href={'/#katalog' as never} className="transition hover:text-ink">
          {product.category?.name ?? 'Katalog'}
        </Link>
        <ChevronRight size={13} aria-hidden="true" className="text-faint" />
        <span className="truncate text-ink">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-12">
        <ProductGallery images={product.images} name={product.name} />

        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wide text-faint">
            <span className="rounded-md bg-brand-50 px-2 py-0.5 text-brand-700">
              {product.brand?.name ?? 'Brand'}
            </span>
            <span className="truncate">{product.category?.name ?? 'Kategoriya'}</span>
          </div>

          <h1 className="mt-3 font-display text-2xl font-bold leading-tight tracking-tight text-ink sm:text-3xl">
            {product.name}
          </h1>

          <span
            className={`mt-4 inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${stock.className}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${stock.dot}`} />
            {stock.label}
          </span>

          <div className="mt-5 rounded-2xl border border-line bg-white p-5 shadow-soft">
            <p className="text-xs font-medium uppercase tracking-wide text-faint">Narx</p>
            <p className="mt-1 font-display text-xl font-bold tracking-tight text-accent">
              Operator bilan kelishiladi
            </p>
            <p className="mt-1 text-xs text-faint">SKU: {variant?.sku ?? '—'}</p>

            {options.length > 0 ? (
              <dl className="mt-4 flex flex-wrap gap-2">
                {options.map((opt) => (
                  <div
                    key={opt.id}
                    className="rounded-lg border border-line bg-surface px-3 py-1.5 text-xs"
                  >
                    <dt className="inline text-faint">{opt.name}: </dt>
                    <dd className="inline font-semibold text-ink">{opt.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}

            <AddToCartButton
              variant="detail"
              className="mt-5"
              disabled={soldOut}
              item={{
                variantId: variant?.id ?? product.id,
                slug: product.slug,
                name: product.name,
                variantName: variant?.name ?? null,
                sku: variant?.sku ?? '—',
                unitPrice: Number(price ?? 0),
                imageUrl: product.images[0]?.imageUrl ?? '/product-placeholder.svg',
                maxQty: qty
              }}
            />

            <Link
              href={'/savatcha' as never}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-semibold text-ink transition hover:border-brand-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            >
              <ShoppingBag size={16} aria-hidden="true" />
              Savatchaga o‘tish
            </Link>

            <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-muted">
              <Headset size={14} className="text-accent" aria-hidden="true" />
              Buyurtmadan so‘ng operator qo‘ng‘iroq qilib model, narx va yetkazib berishni tasdiqlaydi.
            </p>
            <a
              href={`tel:${PHONE}`}
              className="mt-1 block text-center text-xs font-semibold text-accent hover:underline"
            >
              Yoki hoziroq qo‘ng‘iroq qiling: {PHONE_LABEL}
            </a>
          </div>

          <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { icon: ShieldCheck, title: 'Rasmiy kafolat', text: 'Brend kafolati' },
              { icon: Truck, title: 'Yetkazib berish', text: 'BTS orqali butun O‘zbekiston' },
              { icon: RotateCcw, title: 'Qaytarish', text: 'Qabuldan keyin 14 kun' }
            ].map((item) => (
              <li
                key={item.title}
                className="flex items-start gap-2.5 rounded-xl border border-line bg-white p-3 shadow-soft"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600">
                  <item.icon size={17} aria-hidden="true" />
                </span>
                <div>
                  <p className="text-xs font-semibold text-ink">{item.title}</p>
                  <p className="mt-0.5 text-[11px] text-muted">{item.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {product.description ? (
        <section className="mt-12">
          <h2 className="font-display text-xl font-bold tracking-tight text-ink">Tavsif</h2>
          <p className="mt-3 max-w-3xl whitespace-pre-line text-sm leading-relaxed text-muted">
            {product.description}
          </p>
        </section>
      ) : null}

      {product.attributes.length > 0 ? (
        <section className="mt-10">
          <h2 className="font-display text-xl font-bold tracking-tight text-ink">Xususiyatlar</h2>
          <dl className="mt-4 max-w-2xl divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white shadow-soft">
            {product.attributes.map((attr) => (
              <div key={attr.id} className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
                <dt className="text-muted">{attr.attributeName}</dt>
                <dd className="text-right font-medium text-ink">{attr.attributeValue}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}
    </main>
  );
}
