'use client';

import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { CheckCircle2, MessageCircle, Home } from 'lucide-react';

export default function OrderConfirmedPage({ params: { locale } }: { params: { locale: string } }) {
  const t = useTranslations('confirmation');
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id') || '';
  const whatsappUrl = searchParams.get('whatsapp');

  return (
    <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6">
      <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
        <CheckCircle2 className="w-12 h-12" />
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-black text-accent">{t('title')}</h1>
        <p className="text-accent/80 font-medium">{t('message')}</p>
      </div>

      {orderId && (
        <div className="bg-white p-4 rounded-xl border border-accent/10 inline-block shadow-xs">
          <p className="text-xs text-accent/70 font-bold">{t('orderRef')}</p>
          <p className="text-xl font-black text-primary font-mono mt-1">#{orderId.slice(-6).toUpperCase()}</p>
        </div>
      )}

      <div className="bg-primary/10 p-4 rounded-xl border border-primary/30 text-accent text-sm font-semibold">
        {locale === 'ar'
          ? '💳 إذا اخترت بريدي موب، سنرسل لك معلومات الدفع عبر واتساب لتأكيد طلبك.'
          : '💳 Si vous avez choisi BaridiMob, nous vous enverrons les coordonnées de paiement par WhatsApp pour valider votre commande.'}
      </div>

      <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
        {whatsappUrl && (
          <a
            href={decodeURIComponent(whatsappUrl)}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
          >
            <MessageCircle className="w-5 h-5" />
            <span>{t('whatsapp')}</span>
          </a>
        )}

        <Link
          href={"/" + locale}
          className="bg-accent text-cream hover:bg-accent/90 font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all"
        >
          <Home className="w-5 h-5" />
          <span>{t('backHome')}</span>
        </Link>
      </div>
    </div>
  );
}