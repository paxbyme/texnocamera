import Image from 'next/image';
import Link from 'next/link';
import type { CatalogProduct } from '../lib/api';
import { AddToCartButton } from './AddToCartButton';

type ProductCardProps = {
  product: CatalogProduct;
};

export function ProductCard({ product }: ProductCardProps) {
  const variant = product.variants[0];
  const price = variant?.prices[0]?.amount;
  const imageUrl = product.images[0]?.imageUrl ?? '/product-placeholder.svg';
  const availableQty =
    variant?.inventoryBalances.reduce((total, balance) => {
      return total + balance.onHandQty - balance.reservedQty - balance.damagedQty;
    }, 0) ?? 0;

  const soldOut = availableQty <= 0;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-soft transition duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift active:translate-y-0 motion-reduce:transform-none">
      <div className="relative aspect-[4/3] overflow-hidden bg-white">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-contain p-4 transition duration-500 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wide text-faint">
          <span className="rounded-md bg-brand-50 px-2 py-0.5 text-brand-700">
            {product.brand?.name ?? 'Brand'}
          </span>
          <span className="truncate">{product.category?.name ?? 'Kategoriya'}</span>
        </div>

        <Link
          href={`/mahsulot/${product.slug}` as never}
          className="rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        >
          <h2 className="line-clamp-2 min-h-[2.75rem] font-display text-[15px] font-semibold leading-snug text-ink transition group-hover:text-accent">
            {product.name}
          </h2>
        </Link>

        <div className="mt-auto flex items-end justify-between gap-3 pt-1">
          <div>
            <p className="font-display text-sm font-bold tracking-tight text-accent">
              Narxni so‘rang
            </p>
            <p className="mt-0.5 text-[11px] text-faint">SKU: {variant?.sku ?? '—'}</p>
          </div>
        </div>

        <AddToCartButton
          variant="card"
          className="mt-1"
          disabled={soldOut}
          item={{
            variantId: variant?.id ?? product.id,
            slug: product.slug,
            name: product.name,
            variantName: variant?.name ?? null,
            sku: variant?.sku ?? '—',
            unitPrice: Number(price ?? 0),
            imageUrl,
            maxQty: availableQty
          }}
        />
      </div>
    </article>
  );
}
