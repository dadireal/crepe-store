'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ShoppingBag, Globe, Lock } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

export default function Navbar({ locale }: { locale: string }) {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const totalItems = useCartStore((state) => state.totalItems());
  const setDrawerOpen = useCartStore((state) => state.setDrawerOpen);

  const switchLocale = locale === 'ar' ? 'fr' : 'ar';
  const newPath = pathname ? pathname.replace("/" + locale, "/" + switchLocale) : "/" + switchLocale;

  return (
    <header className="sticky top-0 z-40 bg-cream/90 backdrop-blur-md border-b border-accent/10 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href={"/" + locale} className="flex items-center gap-2 group">
          <span className="text-2xl">🥞</span>
          <span className="font-extrabold text-xl md:text-2xl text-accent group-hover:text-primary transition-colors">
            {locale === 'ar' ? 'كريب بيتي' : 'Crêpe Store'}
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-4 md:gap-8">
          <Link
            href={"/" + locale}
            className="text-sm font-semibold text-accent/80 hover:text-accent transition-colors"
          >
            {t('home')}
          </Link>
          <Link
            href={"/" + locale + "/menu"}
            className="text-sm font-semibold text-accent/80 hover:text-accent transition-colors"
          >
            {t('menu')}
          </Link>

          {/* Language Switch */}
          <Link
            href={newPath || ("/" + switchLocale)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-accent/20 text-xs font-bold text-accent hover:bg-primary/20 transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{t('switchLang')}</span>
          </Link>

          {/* Cart Button */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="relative p-2.5 rounded-full bg-accent text-cream hover:bg-accent/90 transition-transform active:scale-95 shadow-md flex items-center justify-center"
            aria-label="Open cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-accent text-xs font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow">
                {totalItems}
              </span>
            )}
          </button>

          {/* Admin link */}
          <Link
            href={"/" + locale + "/admin"}
            className="text-accent/40 hover:text-accent transition-colors p-1"
            title={t('admin')}
          >
            <Lock className="w-4 h-4" />
          </Link>
        </nav>
      </div>
    </header>
  );
}