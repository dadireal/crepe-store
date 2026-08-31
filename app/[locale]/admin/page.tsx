'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Lock, User } from 'lucide-react';

export default function AdminLoginPage({ params: { locale } }: { params: { locale: string } }) {
  const t = useTranslations('admin');
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'oussama' && password === 'oussama2000') {
      localStorage.setItem('admin_auth', 'authenticated');
      localStorage.setItem('admin_user', username);
      router.push("/" + locale + "/admin/orders");
    } else {
      setError(t('wrongPassword'));
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-accent text-cream rounded-full flex items-center justify-center mx-auto shadow-md">
          <Lock className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-accent">{t('title')}</h1>
        <p className="text-xs text-accent/70">{t('enterPassword')}</p>
      </div>

      <form onSubmit={handleLogin} className="bg-white rounded-card p-6 border border-accent/10 shadow-sm space-y-4">
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-lg text-xs font-bold border border-red-200">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-accent mb-1">{locale === 'ar' ? 'اسم المستخدم' : "Nom d'utilisateur"}</label>
          <div className="relative">
            <User className="w-4 h-4 text-accent/40 absolute top-3 left-3" />
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="oussama"
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-accent/20 font-medium text-sm text-accent focus:outline-hidden focus:border-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-accent mb-1">{t('password')}</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-accent/40 absolute top-3 left-3" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-accent/20 font-medium text-sm text-accent focus:outline-hidden focus:border-primary"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-accent hover:bg-accent/90 text-cream font-bold py-2.5 rounded-xl text-sm transition-all shadow-md active:scale-[0.98]"
        >
          {t('login')}
        </button>
      </form>
    </div>
  );
}