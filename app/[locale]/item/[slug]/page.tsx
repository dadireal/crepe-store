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

  const isRtl = locale === 'ar';
  const name = isRtl ? product.nameAr : product.nameFr;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10 space-y-5 sm:space-y-6">
      {/* Back button */}
      <Link
        href={`/${locale}/menu`}
        className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-accent/80 hover:text-accent transition-colors bg-white px-3.5 py-2 rounded-xl border border-accent/15 shadow-2xs active:scale-95"
      >
        {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
        <span>{isRtl ? 'العودة للقائمة' : 'Retour au menu'}</span>
      </Link>

      {/* Main card */}
      <div className="bg-white rounded-2xl sm:rounded-card border border-accent/10 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-6 p-4 sm:p-6 md:p-8">
        <div className="relative h-72 sm:h-96 w-full rounded-xl sm:rounded-2xl overflow-hidden bg-accent/5">
          <Image
            src={product.image}
            alt={name}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        <ProductDetailClient product={product} locale={locale} />
      </div>
    </div>
  );
}