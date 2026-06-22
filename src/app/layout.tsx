import type { Metadata } from 'next';
import { Manrope, Sora } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '../lib/auth';
import { CartProvider } from '../lib/cart';

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap'
});

const sora = Sora({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap'
});

export const metadata: Metadata = {
  title: 'Texno Cam — Xavfsizlik va kuzatuv tizimlari',
  description:
    'Videokuzatuv kameralari, biometrik va kodli qulflar, signalizatsiya va kirishni boshqarish tizimlari. Buyurtma bering — operator qo‘ng‘iroq qilib yakunlaydi.',
  openGraph: {
    title: 'Texno Cam — Xavfsizlik va kuzatuv tizimlari',
    description:
      'Videokuzatuv, biometrik qulflar va signalizatsiya. Operator qo‘ng‘irog‘i orqali buyurtma.',
    type: 'website'
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" className={`${manrope.variable} ${sora.variable}`}>
      <body className="flex min-h-screen flex-col bg-surface">
        <AuthProvider>
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
