'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import {
  RefreshCw,
  Package,
  Loader2,
  Phone,
  MapPin,
  Search,
  MessageCircle,
  Trash2,
  DollarSign,
  Clock,
  CheckCircle,
  Truck,
  Store,
  Filter,
  X,
} from 'lucide-react';

export default function AdminOrdersPage({ params: { locale } }: { params: { locale: string } }) {
  const t = useTranslations('admin');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deliveryFilter, setDeliveryFilter] = useState<string>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);

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
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status } : o))
      );
    } catch (e) {
      console.error(e);
    }
  };

  const deleteOrder = async (id: string) => {
    if (!window.confirm(t('deleteConfirmOrder'))) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setOrders((prev) => prev.filter((o) => o.id !== id));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setDeletingId(null);
    }
  };

  // Filtered orders calculation
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const shortId = order.id.slice(-6).toLowerCase();
      const q = searchQuery.toLowerCase().trim();

      const matchesSearch =
        !q ||
        order.customerName.toLowerCase().includes(q) ||
        order.customerPhone.toLowerCase().includes(q) ||
        (order.customerAddress && order.customerAddress.toLowerCase().includes(q)) ||
        shortId.includes(q);

      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      const matchesDelivery = deliveryFilter === 'all' || order.deliveryMethod === deliveryFilter;

      return matchesSearch && matchesStatus && matchesDelivery;
    });
  }, [orders, searchQuery, statusFilter, deliveryFilter]);

  // Statistics calculation
  const stats = useMemo(() => {
    const totalRevenue = orders
      .filter((o) => o.status !== 'cancelled')
      .reduce((sum, o) => sum + (o.total || 0), 0);
    const totalCount = orders.length;
    const pendingCount = orders.filter((o) => o.status === 'pending').length;
    const deliveredCount = orders.filter((o) => o.status === 'delivered').length;
    return { totalRevenue, totalCount, pendingCount, deliveredCount };
  }, [orders]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-cream text-accent border-accent/20';
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
            className="px-4 py-2.5 rounded-xl border border-accent/20 text-xs sm:text-sm font-black text-accent hover:bg-cream active:scale-95 transition-all shadow-2xs"
          >
            🥞 {t('products')}
          </Link>
          <button
            type="button"
            onClick={loadOrders}
            className="p-2.5 rounded-xl bg-accent text-cream hover:bg-accent/90 active:scale-95 transition-all shadow-2xs"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Analytics / Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-accent/10 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-accent/70">
            <span className="text-xs font-bold">{t('statsTotalRevenue')}</span>
            <DollarSign className="w-4 h-4 text-primary" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-accent">{stats.totalRevenue} دج</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-accent/10 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-accent/70">
            <span className="text-xs font-bold">{t('statsTotalOrders')}</span>
            <Package className="w-4 h-4 text-primary" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-accent">{stats.totalCount}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-accent/10 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-amber-700">
            <span className="text-xs font-bold">{t('statsPending')}</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-amber-600">{stats.pendingCount}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-accent/10 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-emerald-700">
            <span className="text-xs font-bold">{t('delivered')}</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-emerald-600">{stats.deliveredCount}</p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-accent/10 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Live Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-accent/40 absolute top-3.5 left-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchOrders')}
              className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-accent/20 text-sm font-medium text-accent focus:outline-hidden focus:border-primary bg-cream/30"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute top-3 right-3 text-accent/40 hover:text-accent"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Status Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs sm:text-sm font-bold px-3 py-2.5 rounded-xl border border-accent/20 bg-cream text-accent focus:outline-hidden"
            >
              <option value="all">{t('allStatuses')}</option>
              <option value="pending">⏳ {t('pending')}</option>
              <option value="confirmed">👍 {t('confirmed')}</option>
              <option value="delivered">✅ {t('delivered')}</option>
              <option value="cancelled">❌ {t('cancelled')}</option>
            </select>

            <select
              value={deliveryFilter}
              onChange={(e) => setDeliveryFilter(e.target.value)}
              className="text-xs sm:text-sm font-bold px-3 py-2.5 rounded-xl border border-accent/20 bg-cream text-accent focus:outline-hidden"
            >
              <option value="all">{t('allMethods')}</option>
              <option value="delivery">{t('deliveryOnly')}</option>
              <option value="pickup">{t('pickupOnly')}</option>
            </select>
          </div>
        </div>

        {/* Results summary tag */}
        <div className="flex items-center justify-between text-xs text-accent/70 pt-1">
          <span>
            {locale === 'ar'
              ? `عرض ${filteredOrders.length} من أصل ${orders.length} طلب`
              : `Affichage de ${filteredOrders.length} sur ${orders.length} commandes`}
          </span>
          {(searchQuery || statusFilter !== 'all' || deliveryFilter !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setDeliveryFilter('all');
              }}
              className="text-primary font-bold hover:underline"
            >
              {locale === 'ar' ? 'إعادة ضبط الفلاتر' : 'Réinitialiser les filtres'}
            </button>
          )}
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="text-center py-20">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-accent/40" />
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-accent/10 space-y-2">
          <Package className="w-12 h-12 text-accent/30 mx-auto" />
          <p className="text-accent/70 font-bold text-sm">
            {searchQuery || statusFilter !== 'all' ? t('noMatchingOrders') : t('noMatchingOrders')}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((o) => {
            const shortId = o.id.slice(-6).toUpperCase();
            const cleanPhone = o.customerPhone.replace(/\D/g, '');
            const customerWhatsApp = `https://wa.me/${cleanPhone.startsWith('0') ? '213' + cleanPhone.slice(1) : cleanPhone}?text=${encodeURIComponent(
              locale === 'ar'
                ? `السلام عليكم ${o.customerName}! نتواصل معك بخصوص طلبك #${shortId} من تلاعيش كريب 🥞`
                : `Bonjour ${o.customerName} ! Nous vous contactons concernant votre commande #${shortId} chez TL crepes 🥞`
            )}`;

            return (
              <div
                key={o.id}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-accent/10 shadow-2xs space-y-4 hover:shadow-xs transition-shadow"
              >
                {/* Order Top Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-accent/10 pb-3">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-mono font-black text-primary text-sm sm:text-base">
                      #{shortId}
                    </span>
                    <span className="text-[11px] sm:text-xs text-accent/60">
                      {new Date(o.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Status selector */}
                    <select
                      value={o.status}
                      onChange={(e) => updateStatus(o.id, e.target.value)}
                      className={`text-xs font-black px-3 py-1.5 rounded-xl border focus:outline-hidden cursor-pointer transition-colors ${getStatusColor(
                        o.status
                      )}`}
                    >
                      <option value="pending">{t('pending')}</option>
                      <option value="confirmed">{t('confirmed')}</option>
                      <option value="delivered">{t('delivered')}</option>
                      <option value="cancelled">{t('cancelled')}</option>
                    </select>

                    {/* Delete Order Button */}
                    <button
                      type="button"
                      onClick={() => deleteOrder(o.id)}
                      disabled={deletingId === o.id}
                      className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors active:scale-90"
                      title={t('deleteOrder')}
                    >
                      {deletingId === o.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Order Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
                  {/* Customer Contact */}
                  <div className="space-y-2 bg-cream/30 p-3.5 rounded-xl">
                    <p className="font-black text-accent">{t('customer')}: {o.customerName}</p>

                    <div className="flex items-center gap-2 flex-wrap">
                      <a
                        href={`tel:${o.customerPhone}`}
                        className="inline-flex items-center gap-1 font-bold text-accent bg-white px-2.5 py-1 rounded-lg border border-accent/15 hover:bg-primary/20 transition-all text-xs"
                      >
                        <Phone className="w-3 h-3" />
                        <span>{o.customerPhone}</span>
                      </a>

                      <a
                        href={customerWhatsApp}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200 transition-all text-xs"
                        title={t('whatsappCustomer')}
                      >
                        <MessageCircle className="w-3 h-3" />
                        <span>{t('whatsappCustomer')}</span>
                      </a>
                    </div>

                    {o.customerAddress && (
                      <p className="text-accent/70 flex items-start gap-1 pt-1">
                        <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span>{o.customerAddress}</span>
                      </p>
                    )}
                  </div>

                  {/* Delivery & Payment */}
                  <div className="space-y-1.5 bg-cream/30 p-3.5 rounded-xl">
                    <p className="font-black text-accent flex items-center gap-1.5">
                      {o.deliveryMethod === 'delivery' ? (
                        <>
                          <Truck className="w-4 h-4 text-primary" />
                          <span>{locale === 'ar' ? 'توصيل للمنزل' : 'Livraison à Domicile'}</span>
                        </>
                      ) : (
                        <>
                          <Store className="w-4 h-4 text-primary" />
                          <span>{locale === 'ar' ? 'استلام من المحل' : 'Retrait en Magasin'}</span>
                        </>
                      )}
                    </p>
                    <p className="text-accent/80 font-semibold">
                      {o.paymentMethod === 'baridimob' ? '💳 بريدي موب (BaridiMob)' : '💵 دفع نقداً (Cash)'}
                    </p>
                    {o.note && (
                      <p className="text-accent/60 italic text-xs mt-1 bg-white/70 p-2 rounded-lg border border-accent/10">
                        "{o.note}"
                      </p>
                    )}
                  </div>

                  {/* Item List & Total */}
                  <div className="bg-cream/60 p-3.5 rounded-xl space-y-2">
                    <p className="font-black text-accent">{locale === 'ar' ? 'العناصر:' : 'Articles :'}</p>
                    <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
                      {o.items?.map((item: any) => (
                        <div key={item.id} className="flex justify-between text-accent/85 text-xs">
                          <span className="truncate">
                            {item.product?.nameAr || item.product?.nameFr || 'كريب'} x{item.quantity}
                          </span>
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
            );
          })}
        </div>
      )}
    </div>
  );
}