'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Plus, Minus, ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

export default function ProductCard({ product, locale }: { product: any; locale: string }) {
  const t = useTranslations('menu');
  const addItem = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState(1);

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
  };

  return (
    <div className="bg-white rounded-card shadow-sm hover:shadow-md transition-all border border-accent/10 overflow-hidden flex flex-col group">
      {/* Product Image */}
      <Link href={"/" + locale + "/item/" + product.slug} className="relative h-48 w-full overflow-hidden bg-accent/5">
        <Image
          src={product.image}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {!product.available && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="bg-red-500 text-white font-bold px-3 py-1 rounded-full text-xs">
              {locale === 'ar' ? 'غير متاح' : 'Épuisé'}
            </span>
          </div>
        )}
      </Link>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-grow justify-between">
        <div>
          <Link href={"/" + locale + "/item/" + product.slug}>
            <h3 className="font-bold text-lg text-accent hover:text-primary transition-colors">
              {name}
            </h3>
          </Link>
          <p className="text-sm text-accent/70 line-clamp-2 mt-1 mb-3">{desc}</p>
        </div>

        <div className="pt-3 border-t border-accent/10">
          <div className="flex items-center justify-between mb-3">
            <span className="font-black text-xl text-accent">
              {product.price} <span className="text-xs font-bold text-accent/70">{t('dzd')}</span>
            </span>

            {/* Quantity Selector */}
            <div className="flex items-center gap-2 bg-cream rounded-lg p-1 border border-accent/10">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-7 h-7 flex items-center justify-center rounded bg-white text-accent hover:bg-primary/20 transition-colors shadow-xs"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-6 text-center font-bold text-sm text-accent">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-7 h-7 flex items-center justify-center rounded bg-white text-accent hover:bg-primary/20 transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={!product.available}
            className="w-full bg-primary hover:bg-primary/90 text-accent font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>{t('addToCart')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}