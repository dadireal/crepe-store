'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Plus, Minus, ShoppingCart, Check, Sparkles } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

export default function ProductCard({ product, locale }: { product: any; locale: string }) {
  const t = useTranslations('menu');
  const addItem = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const name = locale === 'ar' ? product.nameAr : product.nameFr;
  const desc = locale === 'ar' ? product.descAr : product.descFr;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
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
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <div className="bg-white rounded-2xl sm:rounded-card shadow-sm hover:shadow-md transition-all duration-300 border border-accent/10 overflow-hidden flex flex-col group relative">
      {/* Featured Tag */}
      {product.featured && (
        <div className="absolute top-3 left-3 z-10 bg-primary/95 text-accent text-[11px] font-black px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 backdrop-blur-xs">
          <Sparkles className="w-3 h-3" />
          <span>{locale === 'ar' ? 'مميز' : 'Vedette'}</span>
        </div>
      )}

      {/* Product Image */}
      <Link
        href={`/${locale}/item/${product.slug}`}
        className="relative h-48 sm:h-52 w-full overflow-hidden bg-accent/5 block select-none"
      >
        <Image
          src={product.image}
          alt={name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        {!product.available && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-2xs flex items-center justify-center">
            <span className="bg-red-500 text-white font-black px-3 py-1.5 rounded-full text-xs shadow-md">
              {locale === 'ar' ? 'غير متاح حالياً' : 'Épuisé'}
            </span>
          </div>
        )}
      </Link>

      {/* Product Details */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between gap-4">
        <div>
          <Link href={`/${locale}/item/${product.slug}`} className="block group-hover:text-primary transition-colors">
            <h3 className="font-bold text-base sm:text-lg text-accent line-clamp-1">
              {name}
            </h3>
          </Link>
          <p className="text-xs sm:text-sm text-accent/70 line-clamp-2 mt-1 leading-relaxed">
            {desc}
          </p>
        </div>

        <div className="pt-3 border-t border-accent/10 space-y-3">
          {/* Price & Quantity Controls */}
          <div className="flex items-center justify-between gap-2">
            <div className="font-black text-lg sm:text-xl text-accent whitespace-nowrap">
              {product.price} <span className="text-xs font-bold text-accent/70">{t('dzd')}</span>
            </div>

            {/* Stepper */}
            <div className="flex items-center gap-1 bg-cream rounded-xl p-1 border border-accent/10 shadow-2xs">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-accent hover:bg-primary/20 transition-all active:scale-90 shadow-2xs"
                aria-label="Decrease"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-7 text-center font-black text-xs sm:text-sm text-accent select-none">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-accent hover:bg-primary/20 transition-all active:scale-90 shadow-2xs"
                aria-label="Increase"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!product.available}
            className={`w-full font-black py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed shadow-sm text-sm ${
              justAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-primary hover:bg-primary/90 text-accent'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-4 h-4" />
                <span>{locale === 'ar' ? 'تمت الإضافة !' : 'Ajouté !'}</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                <span>{t('addToCart')}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}