'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Boxes,
  ClipboardList,
  Headphones,
  Loader2,
  PackageSearch,
  Truck
} from 'lucide-react';
import { useAuth } from '../../lib/auth';
import { adminRequest, type Paginated } from '../../lib/admin';
import { hasAdminAccess } from './layout';
import { PageHeader, Panel, StatCard, buttonClass } from '../../components/admin/AdminUi';

type DashboardStats = {
  orders: number;
  products: number;
  warehouses: number;
  balances: number;
};

const MODULES = [
  {
    href: '/admin/orders',
    title: 'Buyurtmalar',
    description: 'Holatlarni boshqarish, qaytarish va bekor qilish.',
    icon: ClipboardList
  },
  {
    href: '/admin/catalog',
    title: 'Katalog',
    description: 'Brend, kategoriya, mahsulot, variant va narxlar.',
    icon: PackageSearch
  },
  {
    href: '/admin/inventory',
    title: 'Ombor',
    description: "Qoldiq, harakatlar, rezervlar va qo'lda tuzatishlar.",
    icon: Boxes
  },
  {
    href: '/admin/delivery',
    title: 'Yetkazish',
    description: 'BTS narx hisoblash, shipment yaratish va izlash.',
    icon: Truck
  },
  {
    href: '/admin/operator',
    title: 'Operator navbati',
    description: "Mijozga qo'ng'iroq qilish va leadlarni tasdiqlash.",
    icon: Headphones
  }
];

export default function AdminDashboardPage() {
  const { authFetch, hydrated, user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const isAdmin = hasAdminAccess(user?.roles);

  useEffect(() => {
    if (hydrated && user && !isAdmin) {
      router.replace('/admin/operator');
    }
  }, [hydrated, user, isAdmin, router]);

  const load = useCallback(async () => {
    if (!isAdmin) return;
    setLoading(true);
    try {
      const [orders, products, warehouses, balances] = await Promise.all([
        adminRequest<Paginated<unknown>>(authFetch, '/api/v1/admin/orders?limit=1'),
        adminRequest<Paginated<unknown>>(authFetch, '/api/v1/admin/catalog/products?limit=1'),
        adminRequest<Paginated<unknown>>(authFetch, '/api/v1/admin/inventory/warehouses?limit=1'),
        adminRequest<Paginated<unknown>>(authFetch, '/api/v1/admin/inventory/balances?limit=1')
      ]);
      setStats({
        orders: orders.pagination.total,
        products: products.pagination.total,
        warehouses: warehouses.pagination.total,
        balances: balances.pagination.total
      });
    } finally {
      setLoading(false);
    }
  }, [authFetch, isAdmin]);

  useEffect(() => {
    void load();
  }, [load]);

  if (!hydrated || !user || !isAdmin) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 size={22} className="animate-spin text-muted" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin"
        title="Boshqaruv paneli"
        description="Katalog, ombor, buyurtma va yetkazishni bitta joydan boshqaring."
        action={
          <button type="button" onClick={load} className={buttonClass}>
            Yangilash
          </button>
        }
      />

      {loading && !stats ? (
        <div className="flex justify-center rounded-2xl border border-line bg-white py-16 shadow-soft">
          <Loader2 size={22} className="animate-spin text-muted" aria-hidden="true" />
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Buyurtmalar" value={stats?.orders ?? 0} icon={ClipboardList} />
          <StatCard label="Mahsulotlar" value={stats?.products ?? 0} icon={PackageSearch} />
          <StatCard label="Omborlar" value={stats?.warehouses ?? 0} icon={Boxes} />
          <StatCard label="Qoldiq satrlari" value={stats?.balances ?? 0} icon={Truck} />
        </div>
      )}

      <Panel title="Bo'limlar" description="Roadmapdagi admin funksiyalar.">
        <div className="grid gap-3 md:grid-cols-2">
          {MODULES.map((item) => (
            <Link
              key={item.href}
              href={item.href as never}
              className="flex items-start gap-3 rounded-xl border border-line bg-white p-4 transition hover:border-brand-200 hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700">
                <item.icon size={18} aria-hidden="true" />
              </span>
              <span>
                <span className="block text-sm font-bold text-ink">{item.title}</span>
                <span className="mt-1 block text-xs text-muted">{item.description}</span>
              </span>
            </Link>
          ))}
        </div>
      </Panel>
    </div>
  );
}
