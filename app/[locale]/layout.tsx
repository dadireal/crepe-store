import { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import Navbar from '@/components/Navbar';
import MobileNav from '@/components/MobileNav';
import CartDrawer from '@/components/CartDrawer';
import { locales } from '@/i18n';

export const dynamic = 'force-dynamic';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);

  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }

  const isRtl = locale === 'ar';

  return (
    <html lang={locale} dir={isRtl ? 'rtl' : 'ltr'}>
      <body className={`min-h-screen flex flex-col ${isRtl ? 'font-cairo' : 'font-poppins'}`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Navbar locale={locale} />
          <CartDrawer locale={locale} />
          <main className="flex-grow pb-20 md:pb-8">{children}</main>
          <MobileNav locale={locale} />
          <footer className="bg-accent text-cream/90 py-8 px-4 text-center border-t border-accent/20 pb-24 md:pb-8">
            <div className="max-w-4xl mx-auto space-y-2">
              <p className="font-bold text-lg text-primary">🥞 Crepe Store | كريب بيتي</p>
              <p className="text-sm text-cream/70">
                {locale === 'ar' ? 'أشهى كريب حلو طازج محضر بأجود المكونات' : 'Délicieuses crêpes sucrées faites maison avec amour'}
              </p>
              <p className="text-xs text-cream/50 pt-2">
                © {new Date().getFullYear()} All Rights Reserved | 📱 0550 92 62 71
              </p>
            </div>
          </footer>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}