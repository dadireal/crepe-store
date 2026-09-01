'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { X, Plus, Minus, Trash2, ArrowRight, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

export default function CartDrawer({ locale }: { locale: string }) {
  const t = useTranslations('cart');
  const { items, isDrawerOpen, setDrawerOpen, updateQuantity, removeItem, totalPrice } = useCartStore();

  // Prevent background scrolling when cart drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isDrawerOpen]);

  if (!isDrawerOpen) return null;

  const isRtl = locale === 'ar';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setDrawerOpen(false)}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300 animate-fadeIn"
      />

      {/* Drawer Container */}
      <div
        className={`fixed inset-y-0 ${isRtl ? 'left-0' : 'right-0'
          } w-full sm:max-w-md bg-cream shadow-2xl flex flex-col z-50 transition-transform duration-300 ease-out`}
      >
        {/* Header */}
        <div className="p-4 border-b border-accent/10 flex items-center justify-between bg-white/80 backdrop-blur-xs">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 text-accent flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <h2 className="font-black text-lg text-accent tracking-tight">{t('title')}</h2>
          </div>

          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            className="w-10 h-10 rounded-full hover:bg-accent/10 flex items-center justify-center text-accent transition-colors active:scale-95"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 overscroll-contain">
          {items.length === 0 ? (
            <div className="text-center py-20 space-y-4 px-4">
              <span className="text-6xl inline-block filter drop-shadow-sm animate-bounce">🥞</span>
              <p className="text-accent/80 font-bold text-base">{t('empty')}</p>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="bg-accent text-cream px-6 py-2.5 rounded-xl font-bold hover:bg-accent/90 transition-all text-sm shadow-sm active:scale-95"
              >
                {t('continueShopping')}
              </button>
            </div>
          ) : (
            items.map((item) => {
              const name = isRtl ? item.nameAr : item.nameFr;
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-3.5 border border-accent/10 flex items-center gap-3.5 shadow-2xs hover:shadow-xs transition-shadow"
                >
                  {/* Thumbnail */}
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 bg-accent/5">
                    <Image
                      src={item.image}
                      alt={name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-accent text-sm sm:text-base truncate leading-snug">
                      {name}
                    </h4>
                    <p className="text-xs font-bold text-primary mt-0.5">
                      {item.price} {t('dzd')}
                    </p>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-8 h-8 rounded-lg bg-cream border border-accent/15 flex items-center justify-center text-accent hover:bg-primary/20 active:scale-90 transition-all"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-black text-sm w-6 text-center text-accent select-none">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-8 h-8 rounded-lg bg-cream border border-accent/15 flex items-center justify-center text-accent hover:bg-primary/20 active:scale-90 transition-all"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Price & Delete */}
                  <div className="text-right flex flex-col items-end justify-between h-full gap-2">
                    <p className="font-black text-accent text-sm sm:text-base whitespace-nowrap">
                      {item.price * item.quantity} {t('dzd')}
                    </p>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="w-8 h-8 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 flex items-center justify-center transition-colors active:scale-90"
                      title={t('remove')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer with Checkout CTA */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 bg-white border-t border-accent/10 space-y-3 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between items-center text-lg font-black text-accent">
              <span>{t('total')}</span>
              <span className="text-xl text-accent">
                {totalPrice()} <span className="text-sm font-bold text-accent/70">{t('dzd')}</span>
              </span>
            </div>

            <Link
              href={`/${locale}/checkout`}
              onClick={() => setDrawerOpen(false)}
              className="w-full bg-accent hover:bg-accent/90 text-cream font-black py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg text-base"
            >
              <span>{t('checkout')}</span>
              {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}