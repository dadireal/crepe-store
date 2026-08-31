import createNextIntlPlugin from 'next-intl/plugin';
const withNextIntl = createNextIntlPlugin('./i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow any remote image source (Cloudinary, external URLs, etc.)
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' },
    ],
    // Disable optimization for local uploads so they always display
    unoptimized: false,
  },
};

export default withNextIntl(nextConfig);