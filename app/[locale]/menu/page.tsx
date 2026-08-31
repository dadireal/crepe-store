import { getTranslations, setRequestLocale } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import ProductCard from '@/components/ProductCard';

export default async function MenuPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = await getTranslations('menu');

  let products: any[] = [];
  try {
    products = await prisma.product.findMany({
      orderBy: { price: 'asc' },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-black text-accent">{t('title')}</h1>
        <p className="text-sm text-accent/70">
          {locale === 'ar'
            ? 'تصفح قائمتنا اللذيذة واختر كريبك المفضل'
            : 'Découvrez notre menu et choisissez vos crêpes préférées'}
        </p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-card border border-accent/10">
          <p className="text-accent/70 font-semibold">{t('noProducts')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}