'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Lock, User, ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage({ params: { locale } }: { params: { locale: string } }) {
  const t = useTranslations('admin');
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const isRtl = locale === 'ar';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'oussama' && password === 'oussama2000') {
      localStorage.setItem('admin_auth', 'authenticated');
      localStorage.setItem('admin_user', username);
      router.push(`/${locale}/admin/orders`);
    } else {
      setError(t('wrongPassword'));
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-16 space-y-6">
      <Link
        href={`/${locale}`}
        className="inline-flex items-center gap-2 text-xs font-bold text-accent/70 hover:text-accent transition-colors"
      >
        {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
        <span>{locale === 'ar' ? 'العودة للمتجر' : 'Retour à la boutique'}</span>
      </Link>

      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-accent text-cream rounded-full flex items-center justify-center mx-auto shadow-md">
          <Lock className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-accent">{t('title')}</h1>
        <p className="text-xs sm:text-sm text-accent/70">{t('enterPassword')}</p>
      </div>

      <form onSubmit={handleLogin} className="bg-white rounded-2xl sm:rounded-card p-6 border border-accent/10 shadow-sm space-y-4">
        {error && (
          <div className="bg-red-50 text-red-700 p-3.5 rounded-xl text-xs font-bold border border-red-200">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-accent mb-1.5">{locale === 'ar' ? 'اسم المستخدم' : "Nom d'utilisateur"}</label>
          <div className="relative">
            <User className="w-4 h-4 text-accent/40 absolute top-3.5 left-3.5" />
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="oussama"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-accent/20 font-medium text-base text-accent focus:outline-hidden focus:border-primary bg-cream/30"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-accent mb-1.5">{t('password')}</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-accent/40 absolute top-3.5 left-3.5" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-accent/20 font-medium text-base text-accent focus:outline-hidden focus:border-primary bg-cream/30"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-accent hover:bg-accent/90 text-cream font-black py-3.5 rounded-xl text-sm transition-all shadow-md active:scale-[0.98] cursor-pointer"
        >
          {t('login')}
        </button>
      </form>
    </div>
  );
}