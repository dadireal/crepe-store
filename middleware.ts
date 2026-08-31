import createMiddleware from 'next-intl/middleware';
import { locales } from './i18n';

export default createMiddleware({
  locales,
  defaultLocale: 'ar',
  localePrefix: 'always'
});

export const config = {
  matcher: ['/', '/(ar|fr)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)']
};