'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Boxes,
  ClipboardList,
  Headphones,
  Headset,
  LayoutDashboard,
  Loader2,
  LogOut,
  PackageSearch,
  Truck,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../lib/auth';

const STAFF_ROLES = ['admin', 'operator'];

export function hasStaffAccess(roles: string[] | undefined) {
  return Boolean(roles?.some((role) => STAFF_ROLES.includes(role)));
}

export function hasAdminAccess(roles: string[] | undefined) {
  return Boolean(roles?.includes('admin'));
}

const ADMIN_NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/orders', label: 'Buyurtmalar', icon: ClipboardList },
  { href: '/admin/catalog', label: 'Katalog', icon: PackageSearch },
  { href: '/admin/inventory', label: 'Ombor', icon: Boxes },
  { href: '/admin/delivery', label: 'Yetkazish', icon: Truck },
  { href: '/admin/operator', label: 'Operator', icon: Headphones }
];

const OPERATOR_NAV = [
  { href: '/admin/operator', label: 'Operator navbati', icon: Headset }
];

export default function AdminLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  const { hydrated, user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isLogin = pathname === '/admin/login';
  const allowed = hasStaffAccess(user?.roles);
  const isAdmin = hasAdminAccess(user?.roles);
  const nav = isAdmin ? ADMIN_NAV : OPERATOR_NAV;
  const homeHref = isAdmin ? '/admin' : '/admin/operator';

  useEffect(() => {
    if (!hydrated || isLogin) return;
    if (!user || !allowed) {
      router.replace('/admin/login');
    }
  }, [hydrated, isLogin, user, allowed, router]);

  // The login page renders standalone — no shell, no guard.
  if (isLogin) {
    return <div className="min-h-screen bg-surface">{children}</div>;
  }

  // Guard: show a spinner until we can confirm staff access.
  if (!hydrated || !user || !allowed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <Loader2 size={24} className="animate-spin text-muted" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <header className="sticky top-0 z-40 border-b border-line bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 lg:px-6">
          <Link href={homeHref as never} className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-950 text-white">
              <ShieldCheck size={16} aria-hidden="true" />
            </span>
            <span className="font-display text-sm font-bold tracking-tight text-ink">
              Texno Cam <span className="font-medium text-muted">· Boshqaruv</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 overflow-x-auto sm:flex">
            {nav.map((item) => {
              const active =
                item.href === '/admin'
                  ? pathname === '/admin'
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href as never}
                  className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                    active
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-muted hover:bg-brand-950/[0.04] hover:text-ink'
                  }`}
                >
                  <item.icon size={15} aria-hidden="true" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <span className="hidden text-xs font-medium text-muted sm:inline">
              {user.fullName?.trim() || user.phone}
            </span>
            <button
              type="button"
              onClick={async () => {
                await logout();
                router.replace('/admin/login');
              }}
              className="flex items-center gap-1.5 rounded-lg border border-line bg-white px-2.5 py-1.5 text-xs font-semibold text-muted transition hover:border-warn/40 hover:text-warn focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <LogOut size={14} aria-hidden="true" />
              Chiqish
            </button>
          </div>
        </div>
      </header>

      <nav className="border-b border-line bg-white sm:hidden">
        <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 py-2">
          {nav.map((item) => {
            const active =
              item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href as never}
                className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold ${
                  active ? 'bg-brand-50 text-brand-700' : 'text-muted'
                }`}
              >
                <item.icon size={14} aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 lg:px-6">
        {children}
      </main>
    </div>
  );
}
