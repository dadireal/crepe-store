'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { RefreshCw, Package, Loader2 } from 'lucide-react';

export default function AdminOrdersPage({ params: { locale } }: { params: { locale: string } }) {
  const t = useTranslations('admin');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
      await fetch("/api/admin/orders/" + id, {
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
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-accent">{t('orders')}</h1>
          <p className="text-xs text-accent/70">
            {locale === 'ar' ? 'إدارة الطلبات الواردة وتحديث حالتها' : 'Gestion des commandes'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={"/" + locale + "/admin/products"}
            className="px-3 py-1.5 rounded-xl border border-accent/20 text-xs font-bold text-accent hover:bg-cream"
          >
            {t('products')}
          </Link>
          <button
            onClick={loadOrders}
            className="p-2 rounded-xl bg-accent text-cream hover:bg-accent/90"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-accent/40" />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-card border border-accent/10">
          <Package className="w-12 h-12 text-accent/30 mx-auto mb-2" />
          <p className="text-accent/70 font-bold text-sm">
            {locale === 'ar' ? 'لا توجد طلبات بعد' : 'Aucune commande pour le moment'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div
              key={o.id}
              className="bg-white rounded-card p-5 border border-accent/10 shadow-xs space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-accent/10 pb-3">
                <div>
                  <span className="font-mono font-bold text-primary text-sm">#{o.id.slice(-6).toUpperCase()}</span>
                  <span className="text-xs text-accent/50 ml-2 mr-2">
                    {new Date(o.createdAt).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={o.status}
                    onChange={(e) => updateStatus(o.id, e.target.value)}
                    className="text-xs font-bold px-3 py-1.5 rounded-lg border border-accent/20 bg-cream text-accent"
                  >
                    <option value="pending">{t('pending')}</option>
                    <option value="confirmed">{t('confirmed')}</option>
                    <option value="delivered">{t('delivered')}</option>
                    <option value="cancelled">{t('cancelled')}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <p className="font-bold text-accent">{t('customer')}: {o.customerName}</p>
                  <p className="text-accent/70">📱 {o.customerPhone}</p>
                  {o.customerAddress && <p className="text-accent/70">📍 {o.customerAddress}</p>}
                </div>

                <div>
                  <p className="font-bold text-accent">
                    {o.deliveryMethod === 'delivery' ? '🛵 توصيل' : '🏪 استلام'}
                  </p>
                  <p className="text-accent/70">
                    {o.paymentMethod === 'baridimob' ? '💳 بريدي موب' : '💵 كاش'}
                  </p>
                  {o.note && <p className="text-accent/60 italic mt-1">"{o.note}"</p>}
                </div>

                <div className="bg-cream/50 p-3 rounded-lg">
                  <p className="font-bold text-accent mb-1">{locale === 'ar' ? 'العناصر:' : 'Articles :'}</p>
                  <div className="space-y-1">
                    {o.items?.map((item: any) => (
                      <div key={item.id} className="flex justify-between text-accent/80">
                        <span>{item.product?.nameAr || item.product?.nameFr} x{item.quantity}</span>
                        <span className="font-bold">{item.price * item.quantity} دج</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-accent/10 mt-2 pt-1 flex justify-between font-black text-accent text-sm">
                    <span>{t('total')}</span>
                    <span>{o.total} دج</span>
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