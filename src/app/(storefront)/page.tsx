import Link from 'next/link';
import { ProductCard } from '../../components/ProductCard';
import { Hero } from '../../components/Hero';
import { ProofBand } from '../../components/ProofBand';
import { CategoryStrip } from '../../components/CategoryStrip';
import { HowItWorks } from '../../components/HowItWorks';
import { getCatalogProducts } from '../../lib/api';
import { ArrowRight } from 'lucide-react';

const FEATURED_COUNT = 4;

export default async function HomePage() {
  const products = await getCatalogProducts();
  const featured = products.slice(0, FEATURED_COUNT);

  return (
    <main>
      <Hero total={products.length} />

      <ProofBand />

      <CategoryStrip />

      <section id="katalog" className="mx-auto max-w-7xl scroll-mt-20 px-4 pt-12 lg:px-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-xl font-bold tracking-tight text-ink sm:text-2xl">
              Ommabop mahsulotlar
            </h2>
            <p className="mt-1 text-sm text-muted">
              Hikvision katalogidan tanlangan yechimlar
            </p>
          </div>

          <Link
            href={'/mahsulotlar' as never}
            className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-3.5 py-2 text-sm font-semibold text-ink transition hover:border-brand-200 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            Barcha mahsulotlar
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href={'/mahsulotlar' as never}
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-accent-hover hover:shadow-glow active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 motion-reduce:active:scale-100"
          >
            Butun katalogni ko‘rish ({products.length})
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <HowItWorks />
    </main>
  );
}
