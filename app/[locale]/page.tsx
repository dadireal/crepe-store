import Link from 'next/link';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import ProductCard from '@/components/ProductCard';
import { ArrowRight, Sparkles } from 'lucide-react';

export default async function HomePage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = await getTranslations('home');

  let featuredProducts: any[] = [];
  try {
    featuredProducts = await prisma.product.findMany({
      where: { available: true },
      take: 3,
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.error('Error fetching featured products:', error);
  }

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/30 to-cream py-16 md:py-24 px-4">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-xs px-4 py-1.5 rounded-full border border-accent/10 shadow-xs text-xs font-bold text-accent">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>{locale === 'ar' ? 'كريب حلو طازج يومياً 🥞' : 'Crêpes fraîches faites maison 🥞'}</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-accent leading-tight">
            {t('hero')}
          </h1>

          <p className="text-lg md:text-xl text-accent/80 max-w-2xl mx-auto font-medium">
            {t('heroSub')}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href={`/${locale}/menu`}
              className="bg-accent text-cream hover:bg-accent/90 px-8 py-3.5 rounded-xl font-bold text-base shadow-lg hover:shadow-xl transition-all flex items-center gap-2 active:scale-95"
            >
              <span>{t('orderNow')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href={`/${locale}/menu`}
              className="bg-white text-accent hover:bg-primary/20 border border-accent/20 px-8 py-3.5 rounded-xl font-bold text-base shadow-xs transition-all"
            >
              {t('viewAll')}
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-card border border-accent/10 text-center space-y-2 shadow-xs">
            <div className="w-12 h-12 bg-primary/20 text-accent rounded-full flex items-center justify-center mx-auto text-xl">
              🍫
            </div>
            <h3 className="font-extrabold text-accent">
              {locale === 'ar' ? 'مكونات أصلية 100%' : 'Ingrédients de Qualité'}
            </h3>
            <p className="text-xs text-accent/70">
              {locale === 'ar' ? 'نوتيلا، لوتس، وفواكه طازجة بأعلى جودة' : 'Nutella authentique, Lotus et fruits frais'}
            </p>
          </div>

          <div className="bg-white p-6 rounded-card border border-accent/10 text-center space-y-2 shadow-xs">
            <div className="w-12 h-12 bg-primary/20 text-accent rounded-full flex items-center justify-center mx-auto text-xl">
              ⚡
            </div>
            <h3 className="font-extrabold text-accent">
              {locale === 'ar' ? 'تحضير سريع وطازج' : 'Préparation Minute'}
            </h3>
            <p className="text-xs text-accent/70">
              {locale === 'ar' ? 'يتم تحضير كل كريب مباشرة بعد طلبك' : 'Chaque crêpe est préparée à la commande'}
            </p>
          </div>

          <div className="bg-white p-6 rounded-card border border-accent/10 text-center space-y-2 shadow-xs">
            <div className="w-12 h-12 bg-primary/20 text-accent rounded-full flex items-center justify-center mx-auto text-xl">
              🛵
            </div>
            <h3 className="font-extrabold text-accent">
              {locale === 'ar' ? 'توصيل أو استلام' : 'Livraison ou Emporté'}
            </h3>
            <p className="text-xs text-accent/70">
              {locale === 'ar' ? 'توصيل سريع أو استلام مباشر بكل سهولة' : 'Livraison rapide à domicile ou retrait sur place'}
            </p>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-6xl mx-auto px-4 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-accent">{t('featured')}</h2>
            <p className="text-sm text-accent/70 mt-1">
              {locale === 'ar' ? 'الكريبات الأكثر طلباً لدينا' : 'Nos crêpes les plus populaires'}
            </p>
          </div>

          <Link
            href={`/${locale}/menu`}
            className="text-accent font-bold hover:text-primary transition-colors flex items-center gap-1 text-sm"
          >
            <span>{t('viewAll')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredProducts.map((p) => (
            <ProductCard key={p.id} product={p} locale={locale} />
          ))}
        </div>
      </section>
    </div>
  );
}