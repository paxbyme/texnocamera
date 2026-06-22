'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Edit3, Inbox, Loader2, PackagePlus, Search, Trash2 } from 'lucide-react';
import { useAuth } from '../../../lib/auth';
import {
  adminRequest,
  jsonRequest,
  PRODUCT_STATUSES,
  queryString,
  shortId,
  type Brand,
  type Category,
  type Paginated,
  type Product,
  type ProductStatus
} from '../../../lib/admin';
import {
  Alert,
  Badge,
  EmptyState,
  Field,
  PageHeader,
  PaginationControls,
  Panel,
  buttonClass,
  inputClass,
  primaryButtonClass
} from '../../../components/admin/AdminUi';

type BrandForm = {
  id?: string;
  name: string;
  slug: string;
  logoUrl: string;
};

type CategoryForm = {
  id?: string;
  name: string;
  slug: string;
  parentId: string;
  position: string;
  isActive: boolean;
};

type ProductForm = {
  name: string;
  slug: string;
  externalId: string;
  brandId: string;
  categoryId: string;
  status: ProductStatus;
  description: string;
};

const emptyBrand: BrandForm = { name: '', slug: '', logoUrl: '' };
const emptyCategory: CategoryForm = {
  name: '',
  slug: '',
  parentId: '',
  position: '0',
  isActive: true
};
const emptyProduct: ProductForm = {
  name: '',
  slug: '',
  externalId: '',
  brandId: '',
  categoryId: '',
  status: 'DRAFT',
  description: ''
};

export default function AdminCatalogPage() {
  const { authFetch } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0 });
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const [brandForm, setBrandForm] = useState<BrandForm>(emptyBrand);
  const [categoryForm, setCategoryForm] = useState<CategoryForm>(emptyCategory);
  const [productForm, setProductForm] = useState<ProductForm>(emptyProduct);

  const load = useCallback(
    async (page = pagination.page) => {
      setLoading(true);
      setError(null);
      try {
        const [productPage, brandPage, categoryPage] = await Promise.all([
          adminRequest<Paginated<Product>>(
            authFetch,
            `/api/v1/admin/catalog/products${queryString({ q, page, limit: 20 })}`
          ),
          adminRequest<Paginated<Brand>>(
            authFetch,
            '/api/v1/admin/catalog/brands?limit=100'
          ),
          adminRequest<Paginated<Category>>(
            authFetch,
            '/api/v1/admin/catalog/categories?limit=100'
          )
        ]);
        setProducts(productPage.data);
        setPagination(productPage.pagination);
        setBrands(brandPage.data);
        setCategories(categoryPage.data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    },
    [authFetch, pagination.page, q]
  );

  useEffect(() => {
    void load(1);
  }, [load]);

  async function saveBrand(event: React.FormEvent) {
    event.preventDefault();
    setBusy('brand');
    setError(null);
    setOk(null);
    try {
      const path = brandForm.id
        ? `/api/v1/admin/catalog/brands/${brandForm.id}`
        : '/api/v1/admin/catalog/brands';
      await adminRequest<Brand>(
        authFetch,
        path,
        jsonRequest(brandForm.id ? 'PATCH' : 'POST', brandForm)
      );
      setBrandForm(emptyBrand);
      setOk('Brend saqlandi.');
      await load();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(null);
    }
  }

  async function saveCategory(event: React.FormEvent) {
    event.preventDefault();
    setBusy('category');
    setError(null);
    setOk(null);
    try {
      const payload = {
        ...categoryForm,
        position: Number(categoryForm.position || 0)
      };
      const path = categoryForm.id
        ? `/api/v1/admin/catalog/categories/${categoryForm.id}`
        : '/api/v1/admin/catalog/categories';
      await adminRequest<Category>(
        authFetch,
        path,
        jsonRequest(categoryForm.id ? 'PATCH' : 'POST', payload)
      );
      setCategoryForm(emptyCategory);
      setOk('Kategoriya saqlandi.');
      await load();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(null);
    }
  }

  async function saveProduct(event: React.FormEvent) {
    event.preventDefault();
    setBusy('product');
    setError(null);
    setOk(null);
    try {
      const product = await adminRequest<Product>(
        authFetch,
        '/api/v1/admin/catalog/products',
        jsonRequest('POST', productForm)
      );
      setProductForm(emptyProduct);
      setOk(`Mahsulot yaratildi: ${product.name}`);
      await load(1);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(null);
    }
  }

  async function remove(path: string, label: string) {
    if (!window.confirm(`${label} o'chirilsinmi?`)) return;
    setBusy(path);
    setError(null);
    setOk(null);
    try {
      await adminRequest(authFetch, path, jsonRequest('DELETE'));
      setOk('Yozuv o\'chirildi.');
      await load();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Katalog"
        title="Mahsulot katalogi"
        description="Brend, kategoriya, mahsulot, variant, narx va rasm boshqaruvi."
      />

      <div className="space-y-3">
        <Alert message={error} />
        <Alert message={ok} tone="ok" />
      </div>

      <Panel>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void load(1);
          }}
          className="flex flex-col gap-3 sm:flex-row"
        >
          <div className="relative flex-1">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-faint"
              aria-hidden="true"
            />
            <input
              value={q}
              onChange={(event) => setQ(event.target.value)}
              placeholder="Mahsulot yoki SKU bo'yicha qidirish"
              className={`${inputClass} pl-9`}
            />
          </div>
          <button type="submit" className={primaryButtonClass}>
            Qidirish
          </button>
        </form>
      </Panel>

      <div className="grid gap-5 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-5">
          <Panel title="Mahsulotlar" description="To'liq sozlash uchun mahsulotni oching.">
            {loading ? (
              <div className="flex justify-center py-16">
                <Loader2 size={22} className="animate-spin text-muted" aria-hidden="true" />
              </div>
            ) : products.length === 0 ? (
              <EmptyState icon={Inbox} message="Mahsulot topilmadi." />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead className="text-xs text-faint">
                    <tr className="border-b border-line">
                      <th className="py-2 pr-3 font-semibold">Mahsulot</th>
                      <th className="py-2 pr-3 font-semibold">Brend</th>
                      <th className="py-2 pr-3 font-semibold">Kategoriya</th>
                      <th className="py-2 pr-3 font-semibold">Holat</th>
                      <th className="py-2 pr-3 font-semibold">ID</th>
                      <th className="py-2 text-right font-semibold">Amal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td className="py-3 pr-3">
                          <p className="font-semibold text-ink">{product.name}</p>
                          <p className="text-xs text-faint">{product.slug}</p>
                        </td>
                        <td className="py-3 pr-3 text-muted">
                          {product.brand?.name ?? '-'}
                        </td>
                        <td className="py-3 pr-3 text-muted">
                          {product.category?.name ?? '-'}
                        </td>
                        <td className="py-3 pr-3">
                          <Badge tone={product.status === 'ACTIVE' ? 'ok' : 'neutral'}>
                            {product.status}
                          </Badge>
                        </td>
                        <td className="py-3 pr-3 text-xs text-faint">
                          {shortId(product.id)}
                        </td>
                        <td className="py-3 text-right">
                          <Link
                            href={`/admin/catalog/products/${product.id}` as never}
                            className={buttonClass}
                          >
                            Ochish
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <PaginationControls
              page={pagination.page}
              limit={pagination.limit}
              total={pagination.total}
              onPage={(next) => void load(next)}
            />
          </Panel>

          <Panel title="Yangi mahsulot" description="Variant, narx va rasm keyingi sahifada qo'shiladi.">
            <form onSubmit={saveProduct} className="grid gap-3 md:grid-cols-2">
              <Field label="Nomi">
                <input
                  required
                  value={productForm.name}
                  onChange={(event) =>
                    setProductForm((prev) => ({ ...prev, name: event.target.value }))
                  }
                  className={inputClass}
                />
              </Field>
              <Field label="Slug">
                <input
                  value={productForm.slug}
                  onChange={(event) =>
                    setProductForm((prev) => ({ ...prev, slug: event.target.value }))
                  }
                  placeholder="auto"
                  className={inputClass}
                />
              </Field>
              <Field label="External ID">
                <input
                  value={productForm.externalId}
                  onChange={(event) =>
                    setProductForm((prev) => ({ ...prev, externalId: event.target.value }))
                  }
                  className={inputClass}
                />
              </Field>
              <Field label="Holat">
                <select
                  value={productForm.status}
                  onChange={(event) =>
                    setProductForm((prev) => ({
                      ...prev,
                      status: event.target.value as ProductStatus
                    }))
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
                    setProductForm((prev) => ({ ...prev, brandId: event.target.value }))
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
                    setProductForm((prev) => ({ ...prev, categoryId: event.target.value }))
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
                    value={productForm.description}
                    onChange={(event) =>
                      setProductForm((prev) => ({
                        ...prev,
                        description: event.target.value
                      }))
                    }
                    rows={3}
                    className={inputClass}
                  />
                </Field>
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={busy === 'product'}
                  className={primaryButtonClass}
                >
                  {busy === 'product' ? (
                    <Loader2 size={14} className="animate-spin" aria-hidden="true" />
                  ) : (
                    <PackagePlus size={14} aria-hidden="true" />
                  )}
                  Mahsulot yaratish
                </button>
              </div>
            </form>
          </Panel>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-20 lg:self-start">
          <Panel title={brandForm.id ? 'Brendni tahrirlash' : 'Yangi brend'}>
            <form onSubmit={saveBrand} className="space-y-3">
              <Field label="Nomi">
                <input
                  required
                  value={brandForm.name}
                  onChange={(event) =>
                    setBrandForm((prev) => ({ ...prev, name: event.target.value }))
                  }
                  className={inputClass}
                />
              </Field>
              <Field label="Slug">
                <input
                  value={brandForm.slug}
                  onChange={(event) =>
                    setBrandForm((prev) => ({ ...prev, slug: event.target.value }))
                  }
                  className={inputClass}
                />
              </Field>
              <Field label="Logo URL">
                <input
                  value={brandForm.logoUrl}
                  onChange={(event) =>
                    setBrandForm((prev) => ({ ...prev, logoUrl: event.target.value }))
                  }
                  className={inputClass}
                />
              </Field>
              <div className="flex gap-2">
                <button type="submit" disabled={busy === 'brand'} className={primaryButtonClass}>
                  Saqlash
                </button>
                {brandForm.id ? (
                  <button
                    type="button"
                    onClick={() => setBrandForm(emptyBrand)}
                    className={buttonClass}
                  >
                    Bekor
                  </button>
                ) : null}
              </div>
            </form>
            <div className="mt-4 divide-y divide-line">
              {brands.map((brand) => (
                <div key={brand.id} className="flex items-center justify-between gap-2 py-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink">{brand.name}</p>
                    <p className="truncate text-xs text-faint">{brand.slug}</p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() =>
                        setBrandForm({
                          id: brand.id,
                          name: brand.name,
                          slug: brand.slug,
                          logoUrl: brand.logoUrl ?? ''
                        })
                      }
                      className={buttonClass}
                      aria-label="Brendni tahrirlash"
                    >
                      <Edit3 size={13} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        remove(`/api/v1/admin/catalog/brands/${brand.id}`, brand.name)
                      }
                      className={buttonClass}
                      aria-label="Brendni o'chirish"
                    >
                      <Trash2 size={13} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title={categoryForm.id ? 'Kategoriyani tahrirlash' : 'Yangi kategoriya'}>
            <form onSubmit={saveCategory} className="space-y-3">
              <Field label="Nomi">
                <input
                  required
                  value={categoryForm.name}
                  onChange={(event) =>
                    setCategoryForm((prev) => ({ ...prev, name: event.target.value }))
                  }
                  className={inputClass}
                />
              </Field>
              <Field label="Slug">
                <input
                  value={categoryForm.slug}
                  onChange={(event) =>
                    setCategoryForm((prev) => ({ ...prev, slug: event.target.value }))
                  }
                  className={inputClass}
                />
              </Field>
              <Field label="Parent">
                <select
                  value={categoryForm.parentId}
                  onChange={(event) =>
                    setCategoryForm((prev) => ({ ...prev, parentId: event.target.value }))
                  }
                  className={inputClass}
                >
                  <option value="">Yo'q</option>
                  {categories
                    .filter((category) => category.id !== categoryForm.id)
                    .map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                </select>
              </Field>
              <Field label="Pozitsiya">
                <input
                  type="number"
                  min={0}
                  value={categoryForm.position}
                  onChange={(event) =>
                    setCategoryForm((prev) => ({ ...prev, position: event.target.value }))
                  }
                  className={inputClass}
                />
              </Field>
              <label className="flex items-center gap-2 text-sm text-muted">
                <input
                  type="checkbox"
                  checked={categoryForm.isActive}
                  onChange={(event) =>
                    setCategoryForm((prev) => ({ ...prev, isActive: event.target.checked }))
                  }
                />
                Faol
              </label>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={busy === 'category'}
                  className={primaryButtonClass}
                >
                  Saqlash
                </button>
                {categoryForm.id ? (
                  <button
                    type="button"
                    onClick={() => setCategoryForm(emptyCategory)}
                    className={buttonClass}
                  >
                    Bekor
                  </button>
                ) : null}
              </div>
            </form>
            <div className="mt-4 divide-y divide-line">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center justify-between gap-2 py-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink">
                      {category.name}
                    </p>
                    <p className="truncate text-xs text-faint">
                      {category.slug} · {category.isActive ? 'active' : 'inactive'}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() =>
                        setCategoryForm({
                          id: category.id,
                          name: category.name,
                          slug: category.slug,
                          parentId: category.parentId ?? '',
                          position: String(category.position),
                          isActive: category.isActive
                        })
                      }
                      className={buttonClass}
                      aria-label="Kategoriyani tahrirlash"
                    >
                      <Edit3 size={13} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        remove(
                          `/api/v1/admin/catalog/categories/${category.id}`,
                          category.name
                        )
                      }
                      className={buttonClass}
                      aria-label="Kategoriyani o'chirish"
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
