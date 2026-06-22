import Link from 'next/link';
import type { Metadata } from 'next';
import { ProductCard } from '../../../components/ProductCard';
import { getCatalogProducts, type CatalogProduct } from '../../../lib/api';
import { Layers, PackageSearch, RotateCcw, Search, Boxes } from 'lucide-react';

type SortKey = 'stock';

type ProductsPageProps = {
  searchParams?: Promise<{
    q?: string;
    cat?: string;
    stock?: string;
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

/** Unique category names in first-seen order, with counts, for the given set. */
function categoryCounts(products: CatalogProduct[]) {
  const order: string[] = [];
  const counts = new Map<string, number>();
  for (const p of products) {
    const name = p.category?.name;
    if (!name) continue;
    if (!counts.has(name)) order.push(name);
    counts.set(name, (counts.get(name) ?? 0) + 1);
  }
  return order.map((name) => ({ name, count: counts.get(name) ?? 0 }));
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = (await searchParams) ?? {};
  const query = params.q?.trim();
  const cat = params.cat?.trim() || undefined;
  const stockOnly = params.stock === 'in';
  const sort = (params.sort === 'stock' ? params.sort : undefined) as
    | SortKey
    | undefined;

  // Search-filtered set drives the category chips (counts reflect the search).
  const matchingQuery = await getCatalogProducts(query);
  const categories = categoryCounts(matchingQuery);

  let filtered = matchingQuery;
  if (cat) filtered = filtered.filter((p) => p.category?.name === cat);
  if (stockOnly) filtered = filtered.filter((p) => availableQty(p) > 0);
  const products = sortProducts(filtered, sort);

  const buildHref = (
    overrides: Partial<{ cat?: string; stock: boolean; sort?: SortKey }>
  ) => {
    const nextCat = 'cat' in overrides ? overrides.cat : cat;
    const nextStock = 'stock' in overrides ? overrides.stock : stockOnly;
    const nextSort = 'sort' in overrides ? overrides.sort : sort;
    const sp = new URLSearchParams();
    if (query) sp.set('q', query);
    if (nextCat) sp.set('cat', nextCat);
    if (nextStock) sp.set('stock', 'in');
    if (nextSort) sp.set('sort', nextSort);
    const qs = sp.toString();
    return (qs ? `/mahsulotlar?${qs}` : '/mahsulotlar') as never;
  };

  const hasFilters = Boolean(cat || stockOnly || sort);

  const pill = (active: boolean) =>
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
            {query ? 'Qidiruv natijalari' : cat ?? 'Barcha mahsulotlar'}
          </h1>
          <p className="mt-1 text-sm text-muted">
            {query ? (
              <>
                “<span className="font-medium text-ink">{query}</span>” bo‘yicha{' '}
                {products.length} ta mahsulot
              </>
            ) : (
              `${products.length} ta mahsulot`
            )}
          </p>
        </div>

        {/* Search */}
        <form
          action="/mahsulotlar"
          className="flex h-11 max-w-xl items-center gap-2 rounded-xl border border-line bg-white px-3.5 shadow-soft transition focus-within:border-brand-300 focus-within:ring-2 focus-within:ring-accent/30"
        >
          {/* Keep active filters when running a new search */}
          {cat ? <input type="hidden" name="cat" value={cat} /> : null}
          {stockOnly ? <input type="hidden" name="stock" value="in" /> : null}
          {sort ? <input type="hidden" name="sort" value={sort} /> : null}
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

        {/* Category filter */}
        {categories.length > 1 ? (
          <div className="flex flex-wrap items-center gap-2">
            <Link href={buildHref({ cat: undefined })} className={pill(!cat)}>
              Barchasi
              <span className="rounded-md bg-white/20 px-1.5 text-[11px] font-semibold tabular-nums">
                {matchingQuery.length}
              </span>
            </Link>
            {categories.map((c) => {
              const active = cat === c.name;
              return (
                <Link
                  key={c.name}
                  href={buildHref({ cat: active ? undefined : c.name })}
                  className={pill(active)}
                >
                  {c.name}
                  <span
                    className={`rounded-md px-1.5 text-[11px] font-semibold tabular-nums ${
                      active ? 'bg-white/20' : 'bg-brand-50 text-brand-700'
                    }`}
                  >
                    {c.count}
                  </span>
                </Link>
              );
            })}
          </div>
        ) : null}

        {/* Toggles + reset */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={buildHref({ stock: !stockOnly })}
            className={pill(stockOnly)}
          >
            <Boxes size={15} aria-hidden="true" />
            Faqat omborda bor
          </Link>
          <Link
            href={buildHref({ sort: sort === 'stock' ? undefined : 'stock' })}
            className={pill(sort === 'stock')}
          >
            <Layers size={15} aria-hidden="true" />
            Ombor bo‘yicha
          </Link>
          {hasFilters || query ? (
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
                : 'Tanlangan filtrlarga mos mahsulot yo‘q.'}
            </p>
          </div>
          <Link
            href={'/mahsulotlar' as never}
            className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:border-brand-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            <RotateCcw size={15} aria-hidden="true" />
            Filtrlarni tozalash
          </Link>
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
