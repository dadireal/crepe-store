'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Plus, Minus, ShoppingCart, Check } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

export default function ProductDetailClient({ product, locale }: { product: any; locale: string }) {
  const t = useTranslations('product');
  const addItem = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const name = locale === 'ar' ? product.nameAr : product.nameFr;
  const desc = locale === 'ar' ? product.descAr : product.descFr;

  const handleAdd = () => {
    addItem(
      {
        id: product.id,
        slug: product.slug,
        nameAr: product.nameAr,
        nameFr: product.nameFr,
        price: product.price,
        image: product.image,
      },
      quantity
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="flex flex-col justify-between space-y-6">
      {/* Title, Price, Description */}
      <div className="space-y-4">
        <h1 className="text-2xl sm:text-3xl font-black text-accent leading-tight">{name}</h1>
        <div className="text-2xl sm:text-3xl font-black text-primary">
          {product.price} <span className="text-sm font-bold text-accent">{t('dzd')}</span>
        </div>

        <div className="space-y-2 pt-3 border-t border-accent/10">
          <h3 className="font-bold text-xs sm:text-sm text-accent/70 uppercase tracking-wider">
            {t('description')}
          </h3>
          <p className="text-sm sm:text-base text-accent/80 leading-relaxed font-normal">{desc}</p>
        </div>
      </div>

      {/* Quantity & CTA */}
      <div className="space-y-4 pt-4 border-t border-accent/10">
        <div className="flex items-center justify-between gap-4">
          <span className="font-black text-sm text-accent">{t('quantity')}</span>
          <div className="flex items-center gap-2 bg-cream rounded-xl p-1 border border-accent/15 shadow-2xs">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-10 h-10 rounded-lg bg-white text-accent flex items-center justify-center hover:bg-primary/20 shadow-2xs active:scale-90 transition-all"
              aria-label="Decrease"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center font-black text-base text-accent select-none">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              className="w-10 h-10 rounded-lg bg-white text-accent flex items-center justify-center hover:bg-primary/20 shadow-2xs active:scale-90 transition-all"
              aria-label="Increase"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          disabled={!product.available}
          className={`w-full font-black py-4 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 text-base ${
            added
              ? 'bg-emerald-600 text-white'
              : 'bg-accent hover:bg-accent/90 text-cream'
          }`}
        >
          {added ? (
            <>
              <Check className="w-5 h-5 text-green-200" />
              <span>{locale === 'ar' ? 'تمت الإضافة للسلة!' : 'Ajouté au panier !'}</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-5 h-5" />
              <span>{t('addToCart')}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}