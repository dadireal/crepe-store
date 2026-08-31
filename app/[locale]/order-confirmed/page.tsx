'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { CheckCircle2, MessageCircle, Home, Loader2, Sparkles } from 'lucide-react';

export default function OrderConfirmedPage({ params: { locale } }: { params: { locale: string } }) {
  const t = useTranslations('confirmation');
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id') || '';
  const [whatsappUrl, setWhatsappUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    // 1. Try to read from sessionStorage first
    const cachedUrl = sessionStorage.getItem('last_whatsapp_url_' + orderId);
    if (cachedUrl) {
      setWhatsappUrl(cachedUrl);
      setLoading(false);
      return;
    }

    // 2. Fetch from API
    fetch(`/api/orders/${orderId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.whatsappUrl) {
          setWhatsappUrl(data.whatsappUrl);
        }
      })
      .catch((err) => console.error('Error loading order:', err))
      .finally(() => setLoading(false));
  }, [orderId]);

  return (
    <div className="max-w-lg mx-auto px-4 py-10 sm:py-16 text-center space-y-6">
      {/* Animated Success Badge */}
      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner animate-bounce">
        <CheckCircle2 className="w-12 h-12 sm:w-14 sm:h-14" />
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black text-accent tracking-tight">{t('title')}</h1>
        <p className="text-sm sm:text-base text-accent/80 font-medium px-2 leading-relaxed">
          {t('message')}
        </p>
      </div>

      {orderId && (
        <div className="bg-white p-5 rounded-2xl border border-accent/10 shadow-2xs inline-block min-w-[220px]">
          <p className="text-xs text-accent/70 font-bold uppercase tracking-wider">{t('orderRef')}</p>
          <p className="text-2xl font-black text-primary font-mono mt-1 tracking-wider">
            #{orderId.slice(-6).toUpperCase()}
          </p>
        </div>
      )}

      {/* Payment info banner */}
      <div className="bg-primary/15 p-4 rounded-2xl border border-primary/30 text-accent text-xs sm:text-sm font-semibold leading-relaxed">
        {locale === 'ar'
          ? '💳 إذا اخترت بريدي موب، سنرسل لك معلومات الدفع عبر واتساب لتأكيد طلبك وتجهيزه فوراً.'
          : '💳 Si vous avez choisi BaridiMob, nous vous enverrons les coordonnées de paiement par WhatsApp pour valider votre commande.'}
      </div>

      {/* Action Buttons */}
      <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
        {loading ? (
          <div className="bg-emerald-600 text-white font-black py-4 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-md opacity-80 text-base">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>{t('whatsapp')}</span>
          </div>
        ) : whatsappUrl ? (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all active:scale-95 text-base cursor-pointer"
          >
            <MessageCircle className="w-5 h-5" />
            <span>{t('whatsapp')}</span>
          </a>
        ) : null}

        <Link
          href={`/${locale}`}
          className="bg-accent text-cream hover:bg-accent/90 font-black py-4 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 text-base"
        >
          <Home className="w-5 h-5" />
          <span>{t('backHome')}</span>
        </Link>
      </div>
    </div>
  );
}