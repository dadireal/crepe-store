import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Crepe Store | كريب بيتي',
  description: 'Fresh & Delicious Sweet Crepes | كريب حلو طازج ولذيذ',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}