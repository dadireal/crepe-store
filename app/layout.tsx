import './globals.css';
import { ReactNode } from 'react';
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Crepe Store | كريب بيتي',
  description: 'Fresh & Delicious Sweet Crepes | كريب حلو طازج ولذيذ',
  applicationName: 'Crepe Store',
  appleWebApp: {
    capable: true,
    title: 'Crepe Store',
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