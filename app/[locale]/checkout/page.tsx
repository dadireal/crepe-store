'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { Truck, Store, CreditCard, Banknote, Loader2 } from 'lucide-react';

export default function CheckoutPage({ params: { locale } }: { params: { locale: string } }) {
  const t = useTranslations('checkout');
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');
  const [paymentMethod, setPaymentMethod] = useState<'baridimob' | 'cash'>('baridimob');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <span className="text-5xl">🛒</span>
        <p className="text-accent/70 font-semibold">{t('cartEmpty')}</p>
        <Link
          href={"/" + locale + "/menu"}
          className="inline-block bg-accent text-cream px-6 py-2.5 rounded-xl font-bold text-sm shadow-sm"
        >
          {t('backToMenu')}
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!customerName.trim() || !customerPhone.trim()) {
      setError(locale === 'ar' ? 'يرجى إدخال الاسم ورقم الهاتف' : "Veuillez renseigner votre nom et téléphone");
      return;
    }

    if (deliveryMethod === 'delivery' && !customerAddress.trim()) {
      setError(locale === 'ar' ? 'يرجى إدخال عنوان التوصيل' : "Veuillez renseigner l'adresse de livraison");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerPhone,
          customerAddress: deliveryMethod === 'delivery' ? customerAddress : null,
          deliveryMethod,
          paymentMethod,
          note,
          items: items.map((i) => ({
            id: i.id,
            slug: i.slug,
            nameAr: i.nameAr,
            nameFr: i.nameFr,
            quantity: i.quantity,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to place order');
      }

      clearCart();
      
      const whatsappUrlParam = data.whatsappUrl ? encodeURIComponent(data.whatsappUrl) : '';
      router.push("/" + locale + "/order-confirmed?id=" + data.orderId + "&whatsapp=" + whatsappUrlParam);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-black text-accent">{t('title')}</h1>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm font-semibold border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-card p-6 border border-accent/10 shadow-sm space-y-6">
        {/* Customer Information */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-accent mb-1">{t('name')} *</label>
            <input
              type="text"
              required
              placeholder={t('namePlaceholder')}
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-accent/20 focus:outline-hidden focus:border-primary font-medium text-accent"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-accent mb-1">{t('phone')} *</label>
            <input
              type="tel"
              required
              placeholder={t('phonePlaceholder')}
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-accent/20 focus:outline-hidden focus:border-primary font-medium text-accent"
            />
          </div>
        </div>

        {/* Delivery Method */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-accent">{t('deliveryMethod')}</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setDeliveryMethod('delivery')}
              className={"p-3 rounded-xl border flex flex-col items-center gap-2 font-bold text-sm transition-all " + (
                deliveryMethod === 'delivery'
                  ? 'border-primary bg-primary/10 text-accent ring-2 ring-primary/40'
                  : 'border-accent/20 text-accent/70 hover:bg-cream'
              )}
            >
              <Truck className="w-5 h-5 text-accent" />
              <span>{t('delivery')}</span>
            </button>

            <button
              type="button"
              onClick={() => setDeliveryMethod('pickup')}
              className={"p-3 rounded-xl border flex flex-col items-center gap-2 font-bold text-sm transition-all " + (
                deliveryMethod === 'pickup'
                  ? 'border-primary bg-primary/10 text-accent ring-2 ring-primary/40'
                  : 'border-accent/20 text-accent/70 hover:bg-cream'
              )}
            >
              <Store className="w-5 h-5 text-accent" />
              <span>{t('pickup')}</span>
            </button>
          </div>
        </div>

        {/* Address if delivery */}
        {deliveryMethod === 'delivery' && (
          <div>
            <label className="block text-sm font-bold text-accent mb-1">{t('address')} *</label>
            <input
              type="text"
              required
              placeholder={t('addressPlaceholder')}
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-accent/20 focus:outline-hidden focus:border-primary font-medium text-accent"
            />
          </div>
        )}

        {/* Payment Method */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-accent">{t('paymentMethod')}</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setPaymentMethod('baridimob')}
              className={"p-3 rounded-xl border flex flex-col items-center gap-2 font-bold text-sm transition-all " + (
                paymentMethod === 'baridimob'
                  ? 'border-primary bg-primary/10 text-accent ring-2 ring-primary/40'
                  : 'border-accent/20 text-accent/70 hover:bg-cream'
              )}
            >
              <CreditCard className="w-5 h-5 text-accent" />
              <span>{t('baridimob')}</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('cash')}
              className={"p-3 rounded-xl border flex flex-col items-center gap-2 font-bold text-sm transition-all " + (
                paymentMethod === 'cash'
                  ? 'border-primary bg-primary/10 text-accent ring-2 ring-primary/40'
                  : 'border-accent/20 text-accent/70 hover:bg-cream'
              )}
            >
              <Banknote className="w-5 h-5 text-accent" />
              <span>{t('cash')}</span>
            </button>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-bold text-accent mb-1">{t('note')}</label>
          <textarea
            rows={2}
            placeholder={t('notePlaceholder')}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-accent/20 focus:outline-hidden focus:border-primary font-medium text-accent"
          />
        </div>

        {/* Summary & Submit */}
        <div className="pt-4 border-t border-accent/10 space-y-4">
          <div className="flex justify-between items-center text-lg font-black text-accent">
            <span>{locale === 'ar' ? 'المبلغ الإجمالي:' : 'Total à payer :'}</span>
            <span>{totalPrice()} دج</span>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-accent hover:bg-accent/90 text-cream font-black py-4 px-6 rounded-xl flex items-center justify-center gap-2 text-base shadow-lg transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{t('submitting')}</span>
              </>
            ) : (
              <span>{t('submit')}</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}