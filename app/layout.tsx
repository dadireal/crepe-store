import './globals.css';
import { ReactNode } from 'react';
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'TL crepes | تلاعيش كريب',
  description: 'Fresh & Delicious Sweet Crepes | تلاعيش كريب - أشهى كريب حلو طازج ولذيذ',
  applicationName: 'TL crepes',
  appleWebApp: {
    capable: true,
    title: 'TL crepes',
    statusBarStyle: 'default',
  },
  formatDetection: {
    telephone: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: '#5C3D2E',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}