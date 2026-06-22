'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ImagePlus,
  Loader2,
  Plus,
  Save,
  Trash2
} from 'lucide-react';
import { useAuth } from '../../../../../lib/auth';
import { formatMoney } from '../../../../../lib/format';
import {
  PRODUCT_STATUSES,
  VARIANT_STATUSES,
  adminRequest,
  jsonRequest,
  type Brand,
  type Category,
  type Paginated,
  type PresignedUpload,
  type ProductDetail,
  type ProductStatus,
  type ProductVariant,
  type VariantStatus
} from '../../../../../lib/admin';
import {
  Alert,
  Badge,
  Field,
  PageHeader,
  Panel,
  buttonClass,
  inputClass,
  primaryButtonClass
} from '../../../../../components/admin/AdminUi';

type ProductForm = {
  name: string;
  slug: string;
  externalId: string;
  brandId: string;
  categoryId: string;
  status: ProductStatus;
  description: string;
};

type VariantForm = {
  id?: string;
  sku: string;
  barcode: string;
  name: string;
  status: VariantStatus;
  weight: string;
  length: string;
  width: string;
  height: string;
  optionsText: string;
};

type PriceForm = {
  variantId: string;
  amount: string;
  currency: string;
  compareAtAmount: string;
  startsAt: string;
  endsAt: string;
  isActive: boolean;
};

const emptyVariant: VariantForm = {
  sku: '',
  barcode: '',
  name: '',
  status: 'ACTIVE',
  weight: '',
  length: '',
  width: '',
  height: '',
  optionsText: ''
};

const emptyPrice: PriceForm = {
  variantId: '',
  amount: '',
  currency: 'UZS',
  compareAtAmount: '',
  startsAt: '',
  endsAt: '',
  isActive: true
};

export default function AdminProductDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const router = useRouter();
  const { authFetch } = useAuth();

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [productForm, setProductForm] = useState<ProductForm | null>(null);
  const [variantForm, setVariantForm] = useState<VariantForm>(emptyVariant);
  const [priceForm, setPriceForm] = useState<PriceForm>(emptyPrice);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageVariantId, setImageVariantId] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [imagePosition, setImagePosition] = useState('0');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [detail, brandPage, categoryPage] = await Promise.all([
        adminRequest<ProductDetail>(authFetch, `/api/v1/admin/catalog/products/${id}`),
        adminRequest<Paginated<Brand>>(authFetch, '/api/v1/admin/catalog/brands?limit=100'),
        adminRequest<Paginated<Category>>(
          authFetch,
          '/api/v1/admin/catalog/categories?limit=100'
        )
      ]);
      setProduct(detail);
      setBrands(brandPage.data);
      setCategories(categoryPage.data);
      setProductForm({
        name: detail.name,
        slug: detail.slug,
        externalId: detail.externalId ?? '',
        brandId: detail.brandId ?? '',
        categoryId: detail.categoryId ?? '',
        status: detail.status,
        description: detail.description ?? ''
      });
      setPriceForm((prev) => ({
        ...prev,
        variantId: prev.variantId || detail.variants[0]?.id || ''
      }));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [authFetch, id]);

  useEffect(() => {
    void load();
  }, [load]);

  const selectedVariant = useMemo(
    () => product?.variants.find((variant) => variant.id === priceForm.variantId),
    [priceForm.variantId, product?.variants]
  );

  async function saveProduct(event: React.FormEvent) {
    event.preventDefault();
    if (!productForm) return;
    setBusy('product');
    setError(null);
    setOk(null);
    try {
      const updated = await adminRequest<ProductDetail>(
        authFetch,
        `/api/v1/admin/catalog/products/${id}`,
        jsonRequest('PATCH', productForm)
      );
      setOk(`Mahsulot saqlandi: ${updated.name}`);
      await load();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(null);
    }
  }

  async function archiveProduct() {
    if (!product || !window.confirm(`${product.name} arxivlansinmi?`)) return;
    setBusy('archive');
    setError(null);
    setOk(null);
    try {
      await adminRequest(authFetch, `/api/v1/admin/catalog/products/${id}`, jsonRequest('DELETE'));
      router.replace('/admin/catalog');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(null);
    }
  }

  async function saveVariant(event: React.FormEvent) {
    event.preventDefault();
    setBusy('variant');
    setError(null);
    setOk(null);
    try {
      const payload = {
        productId: id,
        sku: variantForm.sku,
        barcode: variantForm.barcode,
        name: variantForm.name,
        status: variantForm.status,
        weight: maybeNumber(variantForm.weight),
        length: maybeNumber(variantForm.length),
        width: maybeNumber(variantForm.width),
        height: maybeNumber(variantForm.height),
        options: parseOptions(variantForm.optionsText)
      };
      const path = variantForm.id
        ? `/api/v1/admin/catalog/variants/${variantForm.id}`
        : '/api/v1/admin/catalog/variants';
      await adminRequest<ProductVariant>(
        authFetch,
        path,
        jsonRequest(variantForm.id ? 'PATCH' : 'POST', payload)
      );
      setVariantForm(emptyVariant);
      setOk('Variant saqlandi.');
      await load();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(null);
    }
  }

  async function removeVariant(variant: ProductVariant) {
    if (!window.confirm(`${variant.sku} arxivlansinmi?`)) return;
    setBusy(`variant-${variant.id}`);
    setError(null);
    setOk(null);
    try {
      await adminRequest(
        authFetch,
        `/api/v1/admin/catalog/variants/${variant.id}`,
        jsonRequest('DELETE')
      );
      setOk('Variant arxivlandi.');
      await load();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(null);
    }
  }

  async function addPrice(event: React.FormEvent) {
    event.preventDefault();
    if (!priceForm.variantId) return;
    setBusy('price');
    setError(null);
    setOk(null);
    try {
      await adminRequest(
        authFetch,
        `/api/v1/admin/catalog/variants/${priceForm.variantId}/prices`,
        jsonRequest('POST', {
          amount: Number(priceForm.amount),
          currency: priceForm.currency,
          compareAtAmount: maybeNumber(priceForm.compareAtAmount),
          startsAt: priceForm.startsAt,
          endsAt: priceForm.endsAt,
          isActive: priceForm.isActive
        })
      );
      setPriceForm((prev) => ({ ...emptyPrice, variantId: prev.variantId }));
      setOk('Narx qo\'shildi.');
      await load();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(null);
    }
  }

  async function removePrice(variantId: string, priceId: string) {
    setBusy(`price-${priceId}`);
    setError(null);
    setOk(null);
    try {
      await adminRequest(
        authFetch,
        `/api/v1/admin/catalog/variants/${variantId}/prices/${priceId}`,
        jsonRequest('DELETE')
      );
      setOk('Narx o\'chirildi.');
      await load();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(null);
    }
  }

  async function uploadImage(event: React.FormEvent) {
    event.preventDefault();
    if (!imageFile) return;
    setBusy('image');
    setError(null);
    setOk(null);
    try {
      const presigned = await adminRequest<PresignedUpload>(
        authFetch,
        '/api/v1/admin/catalog/uploads/presign',
        jsonRequest('POST', {
          mimeType: imageFile.type,
          sizeBytes: imageFile.size
        })
      );
      const uploaded = await fetch(presigned.uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': imageFile.type },
        body: imageFile
      });
      if (!uploaded.ok) {
        throw new Error(`Rasm yuklanmadi (${uploaded.status})`);
      }
      await adminRequest(
        authFetch,
        `/api/v1/admin/catalog/products/${id}/images`,
        jsonRequest('POST', {
          objectKey: presigned.objectKey,
          mimeType: imageFile.type,
          sizeBytes: imageFile.size,
          variantId: imageVariantId,
          altText: imageAlt,
          position: Number(imagePosition || 0)
        })
      );
      setImageFile(null);
      setImageVariantId('');
      setImageAlt('');
      setImagePosition('0');
      setOk('Rasm qo\'shildi.');
      await load();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(null);
    }
  }

  async function removeImage(imageId: string) {
    setBusy(`image-${imageId}`);
    setError(null);
    setOk(null);
    try {
      await adminRequest(
        authFetch,
        `/api/v1/admin/catalog/products/${id}/images/${imageId}`,
        jsonRequest('DELETE')
      );
      setOk('Rasm o\'chirildi.');
      await load();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(null);
    }
  }

  if (loading || !product || !productForm) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 size={22} className="animate-spin text-muted" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        href={'/admin/catalog' as never}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition hover:text-ink"
      >
        <ArrowLeft size={15} aria-hidden="true" />
        Katalog
      </Link>

      <PageHeader
        eyebrow="Mahsulot"
        title={product.name}
        description={`${product.slug} · ${product.brand?.name ?? 'Brendsiz'} · ${
          product.category?.name ?? 'Kategoriyasiz'
        }`}
        action={<Badge tone={product.status === 'ACTIVE' ? 'ok' : 'neutral'}>{product.status}</Badge>}
      />

      <div className="space-y-3">
        <Alert message={error} />
        <Alert message={ok} tone="ok" />
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-5">
          <Panel title="Asosiy ma'lumotlar">
            <form onSubmit={saveProduct} className="grid gap-3 md:grid-cols-2">
              <Field label="Nomi">
                <input
                  required
                  value={productForm.name}
                  onChange={(event) =>
                    setProductForm((prev) => prev && { ...prev, name: event.target.value })
                  }
                  className={inputClass}
                />
              </Field>
              <Field label="Slug">
                <input
                  value={productForm.slug}
                  onChange={(event) =>
                    setProductForm((prev) => prev && { ...prev, slug: event.target.value })
                  }
                  className={inputClass}
                />
              </Field>
              <Field label="External ID">
                <input
                  value={productForm.externalId}
                  onChange={(event) =>
                    setProductForm((prev) =>
                      prev && { ...prev, externalId: event.target.value }
                    )
                  }
                  className={inputClass}
                />
              </Field>
              <Field label="Holat">
                <select
                  value={productForm.status}
                  onChange={(event) =>
                    setProductForm(
                      (prev) =>
                        prev && { ...prev, status: event.target.value as ProductStatus }
                    )
                  }
                  className={inputClass}
                >
                  {PRODUCT_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Brend">
                <select
                  value={productForm.brandId}
                  onChange={(event) =>
                    setProductForm((prev) => prev && { ...prev, brandId: event.target.value })
                  }
                  className={inputClass}
                >
                  <option value="">Tanlanmagan</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Kategoriya">
                <select
                  value={productForm.categoryId}
                  onChange={(event) =>
                    setProductForm(
                      (prev) => prev && { ...prev, categoryId: event.target.value }
                    )
                  }
                  className={inputClass}
                >
                  <option value="">Tanlanmagan</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </Field>
              <div className="md:col-span-2">
                <Field label="Tavsif">
                  <textarea
                    rows={4}
                    value={productForm.description}
                    onChange={(event) =>
                      setProductForm(
                        (prev) => prev && { ...prev, description: event.target.value }
                      )
                    }
                    className={inputClass}
                  />
                </Field>
              </div>
              <div className="flex flex-wrap gap-2 md:col-span-2">
                <button
                  type="submit"
                  disabled={busy === 'product'}
                  className={primaryButtonClass}
                >
                  <Save size={14} aria-hidden="true" />
                  Saqlash
                </button>
                <button
                  type="button"
                  disabled={busy === 'archive'}
                  onClick={archiveProduct}
                  className={buttonClass}
                >
                  <Trash2 size={14} aria-hidden="true" />
                  Arxivlash
                </button>
              </div>
            </form>
          </Panel>

          <Panel title="Variantlar" description="SKU, o'lchamlar va optionlar.">
            <form onSubmit={saveVariant} className="mb-5 grid gap-3 md:grid-cols-2">
              <Field label="SKU">
                <input
                  required
                  value={variantForm.sku}
                  onChange={(event) =>
                    setVariantForm((prev) => ({ ...prev, sku: event.target.value }))
                  }
                  className={inputClass}
                />
              </Field>
              <Field label="Nomi">
                <input
                  value={variantForm.name}
                  onChange={(event) =>
                    setVariantForm((prev) => ({ ...prev, name: event.target.value }))
                  }
                  className={inputClass}
                />
              </Field>
              <Field label="Barcode">
                <input
                  value={variantForm.barcode}
                  onChange={(event) =>
                    setVariantForm((prev) => ({ ...prev, barcode: event.target.value }))
                  }
                  className={inputClass}
                />
              </Field>
              <Field label="Holat">
                <select
                  value={variantForm.status}
                  onChange={(event) =>
                    setVariantForm((prev) => ({
                      ...prev,
                      status: event.target.value as VariantStatus
                    }))
                  }
                  className={inputClass}
                >
                  {VARIANT_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </Field>
              {(['weight', 'length', 'width', 'height'] as const).map((key) => (
                <Field key={key} label={key}>
                  <input
                    type="number"
                    min={0}
                    step="0.001"
                    value={variantForm[key]}
                    onChange={(event) =>
                      setVariantForm((prev) => ({ ...prev, [key]: event.target.value }))
                    }
                    className={inputClass}
                  />
                </Field>
              ))}
              <div className="md:col-span-2">
                <Field label="Optionlar" hint="Har qatorda: rang=oq yoki xotira=64GB">
                  <textarea
                    rows={3}
                    value={variantForm.optionsText}
                    onChange={(event) =>
                      setVariantForm((prev) => ({
                        ...prev,
                        optionsText: event.target.value
                      }))
                    }
                    className={inputClass}
                  />
                </Field>
              </div>
              <div className="flex flex-wrap gap-2 md:col-span-2">
                <button
                  type="submit"
                  disabled={busy === 'variant'}
                  className={primaryButtonClass}
                >
                  <Plus size={14} aria-hidden="true" />
                  {variantForm.id ? 'Variantni saqlash' : 'Variant qo\'shish'}
                </button>
                {variantForm.id ? (
                  <button
                    type="button"
                    onClick={() => setVariantForm(emptyVariant)}
                    className={buttonClass}
                  >
                    Bekor
                  </button>
                ) : null}
              </div>
            </form>

            <div className="divide-y divide-line">
              {product.variants.map((variant) => (
                <div key={variant.id} className="py-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-ink">{variant.sku}</p>
                        <Badge tone={variant.status === 'ACTIVE' ? 'ok' : 'neutral'}>
                          {variant.status}
                        </Badge>
                      </div>
                      <p className="mt-0.5 text-sm text-muted">
                        {variant.name || 'Variant nomi yo\'q'}
                      </p>
                      {variant.options.length > 0 ? (
                        <p className="mt-1 text-xs text-faint">
                          {variant.options.map((option) => `${option.name}: ${option.value}`).join(' · ')}
                        </p>
                      ) : null}
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setVariantForm(toVariantForm(variant))}
                        className={buttonClass}
                      >
                        Tahrirlash
                      </button>
                      <button
                        type="button"
                        onClick={() => void removeVariant(variant)}
                        className={buttonClass}
                      >
                        <Trash2 size={13} aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                  {variant.prices.length > 0 ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {variant.prices.map((price) => (
                        <span
                          key={price.id}
                          className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-2.5 py-1 text-xs text-brand-700"
                        >
                          {formatMoney(price.amount)}
                          {price.isActive ? <b>active</b> : null}
                          <button
                            type="button"
                            onClick={() => void removePrice(variant.id, price.id)}
                            className="text-faint hover:text-warn"
                            aria-label="Narxni o'chirish"
                          >
                            <Trash2 size={12} aria-hidden="true" />
                          </button>
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-20 lg:self-start">
          <Panel title="Narx qo'shish">
            <form onSubmit={addPrice} className="space-y-3">
              <Field label="Variant">
                <select
                  required
                  value={priceForm.variantId}
                  onChange={(event) =>
                    setPriceForm((prev) => ({ ...prev, variantId: event.target.value }))
                  }
                  className={inputClass}
                >
                  <option value="">Tanlang</option>
                  {product.variants.map((variant) => (
                    <option key={variant.id} value={variant.id}>
                      {variant.sku} {variant.name ? `· ${variant.name}` : ''}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Summa">
                <input
                  required
                  type="number"
                  min={0}
                  value={priceForm.amount}
                  onChange={(event) =>
                    setPriceForm((prev) => ({ ...prev, amount: event.target.value }))
                  }
                  className={inputClass}
                />
              </Field>
              <Field label="Valyuta">
                <input
                  value={priceForm.currency}
                  onChange={(event) =>
                    setPriceForm((prev) => ({ ...prev, currency: event.target.value }))
                  }
                  className={inputClass}
                />
              </Field>
              <Field label="Compare-at">
                <input
                  type="number"
                  min={0}
                  value={priceForm.compareAtAmount}
                  onChange={(event) =>
                    setPriceForm((prev) => ({
                      ...prev,
                      compareAtAmount: event.target.value
                    }))
                  }
                  className={inputClass}
                />
              </Field>
              <Field label="Boshlanish">
                <input
                  type="datetime-local"
                  value={priceForm.startsAt}
                  onChange={(event) =>
                    setPriceForm((prev) => ({ ...prev, startsAt: event.target.value }))
                  }
                  className={inputClass}
                />
              </Field>
              <Field label="Tugash">
                <input
                  type="datetime-local"
                  value={priceForm.endsAt}
                  onChange={(event) =>
                    setPriceForm((prev) => ({ ...prev, endsAt: event.target.value }))
                  }
                  className={inputClass}
                />
              </Field>
              <label className="flex items-center gap-2 text-sm text-muted">
                <input
                  type="checkbox"
                  checked={priceForm.isActive}
                  onChange={(event) =>
                    setPriceForm((prev) => ({ ...prev, isActive: event.target.checked }))
                  }
                />
                Active price
              </label>
              <button type="submit" disabled={busy === 'price'} className={primaryButtonClass}>
                Narx qo'shish
              </button>
            </form>
            {selectedVariant ? (
              <p className="mt-3 text-xs text-faint">
                Tanlangan variant: {selectedVariant.sku}
              </p>
            ) : null}
          </Panel>

          <Panel title="Rasmlar">
            <form onSubmit={uploadImage} className="space-y-3">
              <Field label="Fayl">
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
                  className={inputClass}
                />
              </Field>
              <Field label="Variant">
                <select
                  value={imageVariantId}
                  onChange={(event) => setImageVariantId(event.target.value)}
                  className={inputClass}
                >
                  <option value="">Mahsulot rasmi</option>
                  {product.variants.map((variant) => (
                    <option key={variant.id} value={variant.id}>
                      {variant.sku}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Alt text">
                <input
                  value={imageAlt}
                  onChange={(event) => setImageAlt(event.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label="Pozitsiya">
                <input
                  type="number"
                  min={0}
                  value={imagePosition}
                  onChange={(event) => setImagePosition(event.target.value)}
                  className={inputClass}
                />
              </Field>
              <button type="submit" disabled={!imageFile || busy === 'image'} className={primaryButtonClass}>
                <ImagePlus size={14} aria-hidden="true" />
                Rasm qo'shish
              </button>
            </form>

            <div className="mt-4 grid grid-cols-2 gap-3">
              {product.images.map((image) => (
                <div key={image.id} className="overflow-hidden rounded-xl border border-line">
                  <img
                    src={image.imageUrl}
                    alt={image.altText ?? product.name}
                    className="aspect-square w-full object-cover"
                  />
                  <div className="flex items-center justify-between gap-2 p-2">
                    <span className="truncate text-[11px] text-faint">
                      #{image.position}
                    </span>
                    <button
                      type="button"
                      onClick={() => void removeImage(image.id)}
                      className="text-faint hover:text-warn"
                      aria-label="Rasmni o'chirish"
                    >
                      <Trash2 size={13} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </aside>
      </div>
    </div>
  );
}

function maybeNumber(value: string) {
  return value.trim() === '' ? undefined : Number(value);
}

function parseOptions(value: string) {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [name, ...rest] = line.split('=');
      return { name: name.trim(), value: rest.join('=').trim() };
    })
    .filter((option) => option.name && option.value);
}

function toVariantForm(variant: ProductVariant): VariantForm {
  return {
    id: variant.id,
    sku: variant.sku,
    barcode: variant.barcode ?? '',
    name: variant.name ?? '',
    status: variant.status,
    weight: variant.weight === null || variant.weight === undefined ? '' : String(variant.weight),
    length: variant.length === null || variant.length === undefined ? '' : String(variant.length),
    width: variant.width === null || variant.width === undefined ? '' : String(variant.width),
    height: variant.height === null || variant.height === undefined ? '' : String(variant.height),
    optionsText: variant.options.map((option) => `${option.name}=${option.value}`).join('\n')
  };
}
