'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { Plus, Minus, Trash2, ArrowRight, ArrowLeft } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

export default function CartPage({ params: { locale } }: { params: { locale: string } }) {
  const t = useTranslations('cart');
  const { items, updateQuantity, removeItem, totalPrice } = useCartStore();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <h1 className="text-3xl font-black text-accent">{t('title')}</h1>

      {items.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-card border border-accent/10 space-y-4">
          <span className="text-5xl">🥞</span>
          <p className="text-accent/70 font-semibold">{t('empty')}</p>
          <Link
            href={"/" + locale + "/menu"}
            className="inline-flex items-center gap-2 bg-accent text-cream px-6 py-2.5 rounded-xl font-bold text-sm shadow-sm"
          >
            <span>{t('continueShopping')}</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-3">
            {items.map((item) => {
              const name = locale === 'ar' ? item.nameAr : item.nameFr;
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-card p-4 border border-accent/10 flex items-center gap-4 shadow-xs"
                >
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-accent/5">
                    <Image src={item.image} alt={name} fill className="object-cover" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-accent text-base truncate">{name}</h3>
                    <p className="text-xs font-semibold text-accent/70">
                      {item.price} {t('dzd')}
                    </p>

                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-7 h-7 rounded bg-cream border border-accent/10 flex items-center justify-center text-accent hover:bg-primary/20"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-bold text-sm w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-7 h-7 rounded bg-cream border border-accent/10 flex items-center justify-center text-accent hover:bg-primary/20"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-black text-accent text-base">
                      {item.price * item.quantity} {t('dzd')}
                    </p>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-700 mt-3 p-1 inline-flex items-center gap-1 text-xs"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>{t('remove')}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-white rounded-card p-6 border border-accent/10 shadow-sm h-fit space-y-4">
            <h3 className="font-black text-lg text-accent border-b border-accent/10 pb-3">
              {locale === 'ar' ? 'ملخص الطلب' : 'Récapitulatif'}
            </h3>

            <div className="flex justify-between text-base font-bold text-accent/80">
              <span>{t('total')}</span>
              <span>
                {totalPrice()} {t('dzd')}
              </span>
            </div>

            <Link
              href={"/" + locale + "/checkout"}
              className="w-full bg-primary hover:bg-primary/90 text-accent font-black py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98]"
            >
              <span>{t('checkout')}</span>
              {locale === 'ar' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}