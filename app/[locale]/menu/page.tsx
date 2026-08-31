import { getTranslations, setRequestLocale } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import ProductCard from '@/components/ProductCard';

export default async function MenuPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = await getTranslations('menu');

  let products: any[] = [];
  try {
    products = await prisma.product.findMany({
      orderBy: [{ featured: 'desc' }, { price: 'asc' }],
    });
  } catch (error) {
    console.error('Error fetching products:', error);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-10 space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto px-2">
        <h1 className="text-3xl sm:text-4xl font-black text-accent tracking-tight">{t('title')}</h1>
        <p className="text-xs sm:text-sm text-accent/75 font-medium leading-relaxed">
          {locale === 'ar'
            ? 'تصفح قائمتنا اللذيذة واختر كريبك المفضل المحضر طازجاً على الفور'
            : 'Découvrez notre menu gourmand et choisissez vos crêpes préférées préparées minute'}
        </p>
      </div>

      {/* Grid */}
      {products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl sm:rounded-card border border-accent/10 space-y-3">
          <span className="text-5xl inline-block">🥞</span>
          <p className="text-accent/70 font-bold text-sm">{t('noProducts')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}