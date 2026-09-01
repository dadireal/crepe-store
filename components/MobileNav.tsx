'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Home, UtensilsCrossed, ShoppingBag, MessageCircle, Globe } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

export default function MobileNav({ locale }: { locale: string }) {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const totalItems = useCartStore((state) => state.totalItems());
  const setDrawerOpen = useCartStore((state) => state.setDrawerOpen);

  const switchLocale = locale === 'ar' ? 'fr' : 'ar';
  const newPath = pathname ? pathname.replace("/" + locale, "/" + switchLocale) : "/" + switchLocale;

  const isHome = pathname === `/${locale}` || pathname === `/${locale}/`;
  const isMenu = pathname.startsWith(`/${locale}/menu`) || pathname.startsWith(`/${locale}/item`);

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '213553440229';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    locale === 'ar' ? 'السلام عليكم! أريد الاستفسار عن تلاعيش كريب 🥞' : 'Bonjour ! Je souhaite me renseigner sur TL crepes 🥞'
  )}`;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-cream/95 backdrop-blur-lg border-t border-accent/15 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] pb-safe">
      <div className="grid grid-cols-5 items-center h-16 px-1 max-w-lg mx-auto">
        {/* Home */}
        <Link
          href={`/${locale}`}
          className={`flex flex-col items-center justify-center gap-1 py-1 px-2 rounded-xl transition-all active:scale-95 ${isHome ? 'text-primary font-bold' : 'text-accent/70 hover:text-accent font-medium'
            }`}
        >
          <Home className={`w-5 h-5 ${isHome ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px] leading-tight truncate">{t('home')}</span>
        </Link>

        {/* Menu */}
        <Link
          href={`/${locale}/menu`}
          className={`flex flex-col items-center justify-center gap-1 py-1 px-2 rounded-xl transition-all active:scale-95 ${isMenu ? 'text-primary font-bold' : 'text-accent/70 hover:text-accent font-medium'
            }`}
        >
          <UtensilsCrossed className={`w-5 h-5 ${isMenu ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px] leading-tight truncate">{t('menu')}</span>
        </Link>

        {/* Cart Trigger */}
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="flex flex-col items-center justify-center gap-1 py-1 px-2 rounded-xl text-accent hover:text-primary transition-all active:scale-95 relative"
          aria-label={t('cart')}
        >
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-accent text-cream flex items-center justify-center shadow-md">
              <ShoppingBag className="w-4 h-4" />
            </div>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-accent text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow animate-pulse">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold text-accent leading-tight truncate">{t('cart')}</span>
        </button>

        {/* WhatsApp direct chat */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center gap-1 py-1 px-2 rounded-xl text-emerald-600 hover:text-emerald-700 transition-all active:scale-95"
          title="WhatsApp"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-[10px] font-medium leading-tight truncate">{t('contact')}</span>
        </a>

        {/* Language switch */}
        <Link
          href={newPath || `/${switchLocale}`}
          className="flex flex-col items-center justify-center gap-1 py-1 px-2 rounded-xl text-accent/70 hover:text-accent transition-all active:scale-95"
          title={t('switchLang')}
        >
          <Globe className="w-5 h-5" />
          <span className="text-[10px] font-bold leading-tight truncate">{t('switchLang')}</span>
        </Link>
      </div>
    </div>
  );
}
