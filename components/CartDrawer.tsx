'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { X, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

export default function CartDrawer({ locale }: { locale: string }) {
  const t = useTranslations('cart');
  const { items, isDrawerOpen, setDrawerOpen, updateQuantity, removeItem, totalPrice } = useCartStore();

  if (!isDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setDrawerOpen(false)}
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer */}
      <div className={"fixed inset-y-0 " + (locale === 'ar' ? 'left-0' : 'right-0') + " max-w-md w-full bg-cream shadow-2xl flex flex-col z-50"}>
        {/* Header */}
        <div className="p-4 border-b border-accent/10 flex items-center justify-between bg-white">
          <h2 className="font-extrabold text-lg text-accent flex items-center gap-2">
            <span>🛒</span> {t('title')}
          </h2>
          <button
            onClick={() => setDrawerOpen(false)}
            className="p-2 rounded-full hover:bg-cream transition-colors text-accent"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <span className="text-5xl">🥞</span>
              <p className="text-accent/70 font-semibold">{t('empty')}</p>
              <button
                onClick={() => setDrawerOpen(false)}
                className="text-primary font-bold hover:underline text-sm"
              >
                {t('continueShopping')}
              </button>
            </div>
          ) : (
            items.map((item) => {
              const name = locale === 'ar' ? item.nameAr : item.nameFr;
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-xl p-3 border border-accent/10 flex items-center gap-3 shadow-xs"
                >
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-accent/5">
                    <Image src={item.image} alt={name} fill className="object-cover" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-accent text-sm truncate">{name}</h4>
                    <p className="text-xs font-semibold text-accent/70">
                      {item.price} {t('dzd')}
                    </p>

                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-6 h-6 rounded bg-cream border border-accent/10 flex items-center justify-center text-accent hover:bg-primary/20"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-bold text-xs w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-6 h-6 rounded bg-cream border border-accent/10 flex items-center justify-center text-accent hover:bg-primary/20"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-black text-accent text-sm">
                      {item.price * item.quantity} {t('dzd')}
                    </p>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-700 mt-2 p-1"
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

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 bg-white border-t border-accent/10 space-y-3">
            <div className="flex justify-between items-center text-lg font-black text-accent">
              <span>{t('total')}</span>
              <span>
                {totalPrice()} {t('dzd')}
              </span>
            </div>

            <Link
              href={"/" + locale + "/checkout"}
              onClick={() => setDrawerOpen(false)}
              className="w-full bg-accent hover:bg-accent/90 text-cream font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-md"
            >
              <span>{t('checkout')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}