'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { RefreshCw, Package, Loader2, ArrowLeft, ArrowRight, Phone, MapPin } from 'lucide-react';

export default function AdminOrdersPage({ params: { locale } }: { params: { locale: string } }) {
  const t = useTranslations('admin');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const isRtl = locale === 'ar';

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/orders');
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/admin/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      loadOrders();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-accent/10 shadow-2xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-accent">{t('orders')}</h1>
          <p className="text-xs text-accent/70 mt-0.5">
            {locale === 'ar' ? 'إدارة الطلبات الواردة وتحديث حالتها' : 'Gestion des commandes'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/${locale}/admin/products`}
            className="px-3.5 py-2 rounded-xl border border-accent/20 text-xs font-bold text-accent hover:bg-cream active:scale-95 transition-all shadow-2xs"
          >
            {t('products')}
          </Link>
          <button
            type="button"
            onClick={loadOrders}
            className="p-2.5 rounded-xl bg-accent text-cream hover:bg-accent/90 active:scale-95 transition-all shadow-2xs"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-accent/40" />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-accent/10 space-y-2">
          <Package className="w-12 h-12 text-accent/30 mx-auto" />
          <p className="text-accent/70 font-bold text-sm">
            {locale === 'ar' ? 'لا توجد طلبات بعد' : 'Aucune commande pour le moment'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div
              key={o.id}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-accent/10 shadow-2xs space-y-4"
            >
              {/* Order top bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-accent/10 pb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono font-black text-primary text-sm sm:text-base">
                    #{o.id.slice(-6).toUpperCase()}
                  </span>
                  <span className="text-[11px] sm:text-xs text-accent/50">
                    {new Date(o.createdAt).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={o.status}
                    onChange={(e) => updateStatus(o.id, e.target.value)}
                    className="text-xs font-bold px-3 py-1.5 rounded-xl border border-accent/20 bg-cream text-accent focus:outline-hidden"
                  >
                    <option value="pending">{t('pending')}</option>
                    <option value="confirmed">{t('confirmed')}</option>
                    <option value="delivered">{t('delivered')}</option>
                    <option value="cancelled">{t('cancelled')}</option>
                  </select>
                </div>
              </div>

              {/* Order Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
                <div className="space-y-1 bg-cream/30 p-3 rounded-xl">
                  <p className="font-black text-accent">{t('customer')}: {o.customerName}</p>
                  <a
                    href={`tel:${o.customerPhone}`}
                    className="text-accent/80 hover:text-primary flex items-center gap-1 font-semibold"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{o.customerPhone}</span>
                  </a>
                  {o.customerAddress && (
                    <p className="text-accent/70 flex items-start gap-1">
                      <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>{o.customerAddress}</span>
                    </p>
                  )}
                </div>

                <div className="space-y-1 bg-cream/30 p-3 rounded-xl">
                  <p className="font-black text-accent">
                    {o.deliveryMethod === 'delivery' ? '🛵 توصيل' : '🏪 استلام'}
                  </p>
                  <p className="text-accent/80 font-medium">
                    {o.paymentMethod === 'baridimob' ? '💳 بريدي موب' : '💵 كاش'}
                  </p>
                  {o.note && <p className="text-accent/60 italic mt-1">"{o.note}"</p>}
                </div>

                <div className="bg-cream/60 p-3.5 rounded-xl space-y-2">
                  <p className="font-black text-accent">{locale === 'ar' ? 'العناصر:' : 'Articles :'}</p>
                  <div className="space-y-1">
                    {o.items?.map((item: any) => (
                      <div key={item.id} className="flex justify-between text-accent/80">
                        <span className="truncate">{item.product?.nameAr || item.product?.nameFr} x{item.quantity}</span>
                        <span className="font-bold shrink-0">{item.price * item.quantity} دج</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-accent/15 pt-2 flex justify-between font-black text-accent text-sm sm:text-base">
                    <span>{t('total')}</span>
                    <span className="text-primary">{o.total} دج</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}