import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import ProductDetailClient from './ProductDetailClient';

export default async function ProductDetailPage({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string };
}) {
  setRequestLocale(locale);
  const product = await prisma.product.findUnique({
    where: { slug },
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <Link
        href={`/${locale}/menu`}
        className="inline-flex items-center gap-2 text-sm font-bold text-accent/70 hover:text-accent transition-colors"
      >
        {locale === 'ar' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
        <span>{locale === 'ar' ? 'العودة للقائمة' : 'Retour au menu'}</span>
      </Link>

      <div className="bg-white rounded-card border border-accent/10 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        <div className="relative h-72 md:h-96 rounded-xl overflow-hidden bg-accent/5">
          <Image
            src={product.image}
            alt={locale === 'ar' ? product.nameAr : product.nameFr}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        <ProductDetailClient product={product} locale={locale} />
      </div>
    </div>
  );
}