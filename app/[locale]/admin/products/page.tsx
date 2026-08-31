'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Plus, ArrowLeft, ArrowRight, Loader2, X } from 'lucide-react';

export default function AdminProductsPage({ params: { locale } }: { params: { locale: string } }) {
  const t = useTranslations('admin');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    slug: '',
    nameAr: '',
    nameFr: '',
    descAr: '',
    descFr: '',
    price: 350,
    image: '/images/crepe-1.jpeg',
    available: true,
  });

  const isRtl = locale === 'ar';

  const loadProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setShowModal(false);
        setForm({
          slug: '',
          nameAr: '',
          nameFr: '',
          descAr: '',
          descFr: '',
          price: 350,
          image: '/images/crepe-1.jpeg',
          available: true,
        });
        loadProducts();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-accent/10 shadow-2xs">
        <div className="flex items-center gap-3">
          <Link
            href={`/${locale}/admin/orders`}
            className="text-xs font-bold text-accent/70 hover:text-accent flex items-center gap-1 bg-cream px-3 py-2 rounded-xl border border-accent/10 active:scale-95 transition-all"
          >
            {isRtl ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
            <span>{t('orders')}</span>
          </Link>
          <h1 className="text-xl sm:text-2xl font-black text-accent">{t('products')}</h1>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="bg-accent hover:bg-accent/90 text-cream px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t('addProduct')}</span>
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="text-center py-20">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-accent/40" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {products.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl p-4 border border-accent/10 shadow-2xs space-y-3">
              <div className="relative h-40 rounded-xl overflow-hidden bg-accent/5">
                <Image src={p.image} alt={p.nameAr} fill className="object-cover" />
              </div>
              <div>
                <h3 className="font-bold text-accent text-sm sm:text-base leading-snug">{p.nameAr}</h3>
                <p className="text-xs text-accent/60 mt-0.5">{p.nameFr}</p>
                <p className="text-sm font-black text-primary mt-2">{p.price} دج</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Responsive Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-5 sm:p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl my-auto">
            <div className="flex items-center justify-between pb-2 border-b border-accent/10">
              <h2 className="text-lg font-black text-accent">{t('addProduct')}</h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full hover:bg-cream flex items-center justify-center text-accent"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs sm:text-sm">
              <div>
                <label className="block font-bold mb-1 text-accent">Slug (e.g. crepe-caramel)</label>
                <input
                  type="text"
                  required
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="w-full p-2.5 border rounded-xl font-mono text-accent bg-cream/30"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1 text-accent">الاسم بالعربية</label>
                  <input
                    type="text"
                    required
                    value={form.nameAr}
                    onChange={(e) => setForm({ ...form, nameAr: e.target.value })}
                    className="w-full p-2.5 border rounded-xl text-accent bg-cream/30"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1 text-accent">Nom en Français</label>
                  <input
                    type="text"
                    required
                    value={form.nameFr}
                    onChange={(e) => setForm({ ...form, nameFr: e.target.value })}
                    className="w-full p-2.5 border rounded-xl text-accent bg-cream/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1 text-accent">الوصف بالعربية</label>
                  <textarea
                    rows={2}
                    value={form.descAr}
                    onChange={(e) => setForm({ ...form, descAr: e.target.value })}
                    className="w-full p-2.5 border rounded-xl text-accent bg-cream/30"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1 text-accent">Description en Français</label>
                  <textarea
                    rows={2}
                    value={form.descFr}
                    onChange={(e) => setForm({ ...form, descFr: e.target.value })}
                    className="w-full p-2.5 border rounded-xl text-accent bg-cream/30"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1 text-accent">السعر (DZD)</label>
                <input
                  type="number"
                  required
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                  className="w-full p-2.5 border rounded-xl text-accent bg-cream/30"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-accent">رابط الصورة (Image URL / path)</label>
                <input
                  type="text"
                  required
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  className="w-full p-2.5 border rounded-xl text-accent bg-cream/30"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-accent/10">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 border border-accent/20 rounded-xl font-bold text-accent hover:bg-cream active:scale-95"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-accent text-cream rounded-xl font-bold shadow-md hover:bg-accent/90 active:scale-95"
                >
                  {t('save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}