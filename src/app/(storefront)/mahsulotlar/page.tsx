import Link from 'next/link';
import type { Metadata } from 'next';
import { ProductCard } from '../../../components/ProductCard';
import { getCatalogProducts, type CatalogProduct } from '../../../lib/api';
import { Layers, PackageSearch, RotateCcw, Search } from 'lucide-react';

type SortKey = 'stock';

type ProductsPageProps = {
  searchParams?: Promise<{
    q?: string;
    sort?: string;
  }>;
};

export const metadata: Metadata = {
  title: 'Mahsulotlar — Texno Cam',
  description:
    'Hikvision videokuzatuv kameralari, NVR/DVR yozib oluvchilar va jihozlar to‘liq katalogi.'
};

function availableQty(product: CatalogProduct) {
  const variant = product.variants[0];
  return (
    variant?.inventoryBalances.reduce(
      (total, b) => total + b.onHandQty - b.reservedQty - b.damagedQty,
      0
    ) ?? 0
  );
}

function sortProducts(products: CatalogProduct[], sort?: SortKey) {
  if (sort === 'stock') {
    return [...products].sort((a, b) => availableQty(b) - availableQty(a));
  }
  return products;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = (await searchParams) ?? {};
  const query = params.q?.trim();
  const sort = (params.sort === 'stock' ? params.sort : undefined) as
    | SortKey
    | undefined;

  const products = sortProducts(await getCatalogProducts(query), sort);

  const buildHref = (next?: SortKey) => {
    const sp = new URLSearchParams();
    if (query) sp.set('q', query);
    if (next) sp.set('sort', next);
    const qs = sp.toString();
    return (qs ? `/mahsulotlar?${qs}` : '/mahsulotlar') as never;
  };

  const sortBtn = (active: boolean) =>
    `inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-medium transition duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 motion-reduce:active:scale-100 ${
      active
        ? 'border-accent bg-accent text-white shadow-soft'
        : 'border-line bg-white text-muted hover:border-brand-200 hover:text-ink'
    }`;

  return (
    <main className="mx-auto max-w-7xl px-4 pb-16 pt-8 lg:px-8">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            {query ? 'Qidiruv natijalari' : 'Barcha mahsulotlar'}
          </h1>
          <p className="mt-1 text-sm text-muted">
            {query ? (
              <>
                “<span className="font-medium text-ink">{query}</span>” bo‘yicha{' '}
                {products.length} ta mahsulot
              </>
            ) : (
              `Hikvision katalogi — ${products.length} ta mahsulot`
            )}
          </p>
        </div>

        {/* Search */}
        <form
          action="/mahsulotlar"
          className="flex h-11 max-w-xl items-center gap-2 rounded-xl border border-line bg-white px-3.5 shadow-soft transition focus-within:border-brand-300 focus-within:ring-2 focus-within:ring-accent/30"
        >
          <Search size={16} className="shrink-0 text-faint" aria-hidden="true" />
          <input
            name="q"
            defaultValue={query}
            placeholder="Model, SKU yoki kategoriya qidiring…"
            aria-label="Mahsulot qidirish"
            className="min-w-0 flex-1 bg-transparent text-sm text-ink placeholder:text-faint outline-none"
          />
          <button
            type="submit"
            className="shrink-0 rounded-lg bg-accent px-3.5 py-1.5 text-sm font-semibold text-white transition hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            Qidirish
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={buildHref(sort === 'stock' ? undefined : 'stock')}
            className={sortBtn(sort === 'stock')}
          >
            <Layers size={15} aria-hidden="true" />
            Ombor bo‘yicha
          </Link>
          {query ? (
            <Link
              href={'/mahsulotlar' as never}
              className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-3.5 py-2 text-sm font-medium text-muted transition hover:border-brand-200 hover:text-ink"
            >
              <RotateCcw size={15} aria-hidden="true" />
              Tozalash
            </Link>
          ) : null}
        </div>
      </div>

      {products.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-line bg-white py-20 text-center shadow-soft">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-500">
            <PackageSearch size={26} aria-hidden="true" />
          </span>
          <div>
            <p className="font-display text-base font-semibold text-ink">Hech narsa topilmadi</p>
            <p className="mt-1 text-sm text-muted">
              {query
                ? `“${query}” bo‘yicha mahsulot yo‘q. Boshqa so‘z bilan qidirib ko‘ring.`
                : 'Katalog hozircha bo‘sh.'}
            </p>
          </div>
          {query ? (
            <Link
              href={'/mahsulotlar' as never}
              className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:border-brand-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            >
              <RotateCcw size={15} aria-hidden="true" />
              Qidiruvni tozalash
            </Link>
          ) : null}
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}
