'use client';

import { useState } from 'react';
import Image from 'next/image';

type GalleryImage = {
  imageUrl: string;
  altText?: string | null;
};

type ProductGalleryProps = {
  images: GalleryImage[];
  name: string;
};

export function ProductGallery({ images, name }: ProductGalleryProps) {
  const list = images.length > 0 ? images : [{ imageUrl: '/product-placeholder.svg', altText: name }];
  const [active, setActive] = useState(0);
  const current = list[Math.min(active, list.length - 1)];

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square overflow-hidden rounded-3xl border border-line bg-white shadow-soft">
        <Image
          src={current.imageUrl}
          alt={current.altText ?? name}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-contain p-6"
        />
      </div>

      {list.length > 1 ? (
        <div className="flex flex-wrap gap-2.5">
          {list.map((img, index) => {
            const selected = index === active;
            return (
              <button
                key={`${img.imageUrl}-${index}`}
                type="button"
                onClick={() => setActive(index)}
                aria-label={`${index + 1}-rasm`}
                aria-pressed={selected}
                className={`relative h-16 w-16 overflow-hidden rounded-xl border transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
                  selected
                    ? 'border-accent shadow-soft ring-1 ring-accent'
                    : 'border-line hover:border-brand-200'
                }`}
              >
                <Image
                  src={img.imageUrl}
                  alt={img.altText ?? `${name} ${index + 1}`}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
