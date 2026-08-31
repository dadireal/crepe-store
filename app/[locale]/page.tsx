import Link from 'next/link';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import ProductCard from '@/components/ProductCard';
import { ArrowRight, ArrowLeft, Sparkles, Utensils } from 'lucide-react';

export default async function HomePage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = await getTranslations('home');
  const isRtl = locale === 'ar';

  let featuredProducts: any[] = [];
  try {
    featuredProducts = await prisma.product.findMany({
      where: { available: true },
      take: 6,
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
    });
  } catch (error) {
    console.error('Error fetching featured products:', error);
  }

  return (
    <div className="space-y-12 sm:space-y-16 pb-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/30 via-cream/80 to-cream py-12 sm:py-18 md:py-24 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-5 sm:space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-xs px-4 py-1.5 rounded-full border border-accent/15 shadow-2xs text-xs sm:text-sm font-black text-accent animate-fade-in">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>{locale === 'ar' ? 'كريب حلو طازج يومياً 🥞' : 'Crêpes fraîches faites maison 🥞'}</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-accent leading-[1.15] tracking-tight">
            {t('hero')}
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-lg md:text-xl text-accent/80 max-w-2xl mx-auto font-medium px-2 leading-relaxed">
            {t('heroSub')}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2 max-w-md mx-auto sm:max-w-none">
            <Link
              href={`/${locale}/menu`}
              className="w-full sm:w-auto bg-accent text-cream hover:bg-accent/90 px-8 py-4 rounded-2xl font-black text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
            >
              <span>{t('orderNow')}</span>
              {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </Link>

            <Link
              href={`/${locale}/menu`}
              className="w-full sm:w-auto bg-white/80 backdrop-blur-xs text-accent hover:bg-primary/20 border border-accent/20 px-8 py-4 rounded-2xl font-black text-base shadow-xs transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Utensils className="w-4 h-4 text-primary" />
              <span>{t('viewAll')}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-accent/10 text-center space-y-2 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="w-12 h-12 bg-primary/20 text-accent rounded-full flex items-center justify-center mx-auto text-2xl shadow-inner">
              🍫
            </div>
            <h3 className="font-black text-sm sm:text-base text-accent">
              {locale === 'ar' ? 'مكونات أصلية 100%' : 'Ingrédients de Qualité'}
            </h3>
            <p className="text-xs sm:text-sm text-accent/70 leading-relaxed">
              {locale === 'ar' ? 'نوتيلا، لوتس، وفواكه طازجة بأعلى جودة' : 'Nutella authentique, Lotus et fruits frais'}
            </p>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-accent/10 text-center space-y-2 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="w-12 h-12 bg-primary/20 text-accent rounded-full flex items-center justify-center mx-auto text-2xl shadow-inner">
              ⚡
            </div>
            <h3 className="font-black text-sm sm:text-base text-accent">
              {locale === 'ar' ? 'تحضير سريع وطازج' : 'Préparation Minute'}
            </h3>
            <p className="text-xs sm:text-sm text-accent/70 leading-relaxed">
              {locale === 'ar' ? 'يتم تحضير كل كريب مباشرة بعد طلبك' : 'Chaque crêpe est préparée à la commande'}
            </p>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-accent/10 text-center space-y-2 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="w-12 h-12 bg-primary/20 text-accent rounded-full flex items-center justify-center mx-auto text-2xl shadow-inner">
              🛵
            </div>
            <h3 className="font-black text-sm sm:text-base text-accent">
              {locale === 'ar' ? 'توصيل أو استلام' : 'Livraison ou Emporté'}
            </h3>
            <p className="text-xs sm:text-sm text-accent/70 leading-relaxed">
              {locale === 'ar' ? 'توصيل سريع أو استلام مباشر بكل سهولة' : 'Livraison rapide à domicile ou retrait sur place'}
            </p>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-6xl mx-auto px-4 space-y-6 sm:space-y-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-accent tracking-tight">{t('featured')}</h2>
            <p className="text-xs sm:text-sm text-accent/70 mt-0.5">
              {locale === 'ar' ? 'الكريبات الأكثر طلباً ولذة لدينا' : 'Nos crêpes les plus populaires et gourmandes'}
            </p>
          </div>

          <Link
            href={`/${locale}/menu`}
            className="text-accent font-bold hover:text-primary transition-colors flex items-center gap-1.5 text-xs sm:text-sm shrink-0 bg-white px-3 py-2 rounded-xl border border-accent/15 shadow-2xs"
          >
            <span>{t('viewAll')}</span>
            {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {featuredProducts.map((p) => (
            <ProductCard key={p.id} product={p} locale={locale} />
          ))}
        </div>
      </section>
    </div>
  );
}