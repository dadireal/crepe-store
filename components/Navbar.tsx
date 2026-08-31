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

  const isHome = pathname === `/${locale}` || pathname === `/${locale}/`;
  const isMenu = pathname.startsWith(`/${locale}/menu`);

  return (
    <header className="sticky top-0 z-40 bg-cream/95 backdrop-blur-md border-b border-accent/10 shadow-xs transition-shadow">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 h-16 flex items-center justify-between gap-2">
        {/* Brand */}
        <Link
          href={`/${locale}`}
          className="flex items-center gap-2 group shrink-0 select-none py-1"
        >
          <span className="text-2xl sm:text-3xl filter drop-shadow-xs transition-transform group-hover:scale-110">
            🥞
          </span>
          <span className="font-black text-lg sm:text-2xl text-accent group-hover:text-primary transition-colors tracking-tight">
            {locale === 'ar' ? 'كريب بيتي' : 'Crêpe Store'}
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          <Link
            href={`/${locale}`}
            className={`text-sm font-bold transition-colors ${
              isHome ? 'text-primary' : 'text-accent/80 hover:text-accent'
            }`}
          >
            {t('home')}
          </Link>
          <Link
            href={`/${locale}/menu`}
            className={`text-sm font-bold transition-colors ${
              isMenu ? 'text-primary' : 'text-accent/80 hover:text-accent'
            }`}
          >
            {t('menu')}
          </Link>
        </nav>

        {/* Actions & Utilities */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Switch */}
          <Link
            href={newPath || `/${switchLocale}`}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full border border-accent/20 text-xs font-extrabold text-accent hover:bg-primary/20 transition-all active:scale-95 shadow-2xs"
            title={t('switchLang')}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{t('switchLang')}</span>
          </Link>

          {/* Cart Button */}
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="relative p-2.5 rounded-full bg-accent text-cream hover:bg-accent/90 transition-all active:scale-95 shadow-md flex items-center justify-center cursor-pointer min-w-[40px] min-h-[40px]"
            aria-label={t('cart')}
          >
            <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-accent text-[10px] sm:text-xs font-black w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </button>

          {/* Admin Link */}
          <Link
            href={`/${locale}/admin`}
            className="text-accent/40 hover:text-accent transition-colors p-2 rounded-lg hover:bg-accent/5"
            title={t('admin')}
          >
            <Lock className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}