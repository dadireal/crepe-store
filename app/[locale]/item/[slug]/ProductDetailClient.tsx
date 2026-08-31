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
      <div className="space-y-4">
        <h1 className="text-2xl md:text-3xl font-black text-accent">{name}</h1>
        <div className="text-2xl font-black text-primary">
          {product.price} <span className="text-sm font-bold text-accent">{t('dzd')}</span>
        </div>

        <div className="space-y-2 pt-2 border-t border-accent/10">
          <h3 className="font-bold text-sm text-accent">{t('description')}</h3>
          <p className="text-sm text-accent/80 leading-relaxed">{desc}</p>
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-accent/10">
        <div className="flex items-center justify-between">
          <span className="font-bold text-sm text-accent">{t('quantity')}</span>
          <div className="flex items-center gap-3 bg-cream rounded-lg p-1 border border-accent/10">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-8 h-8 rounded bg-white text-accent flex items-center justify-center hover:bg-primary/20 shadow-xs"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center font-bold text-accent">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="w-8 h-8 rounded bg-white text-accent flex items-center justify-center hover:bg-primary/20 shadow-xs"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        <button
          onClick={handleAdd}
          disabled={!product.available}
          className="w-full bg-accent hover:bg-accent/90 text-cream font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] disabled:opacity-50"
        >
          {added ? (
            <>
              <Check className="w-5 h-5 text-green-400" />
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