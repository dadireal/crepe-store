'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import {
  Plus,
  Trash2,
  Edit2,
  ArrowLeft,
  ArrowRight,
  Loader2,
  X,
  Search,
  Sparkles,
  CheckCircle2,
  XCircle,
  Eye,
} from 'lucide-react';

interface ProductItem {
  id: string;
  slug: string;
  nameAr: string;
  nameFr: string;
  descAr: string;
  descFr: string;
  price: number;
  image: string;
  available: boolean;
  featured: boolean;
}

const emptyForm = {
  id: '',
  slug: '',
  nameAr: '',
  nameFr: '',
  descAr: '',
  descFr: '',
  price: 400,
  image: '/images/crepe-1.jpeg',
  available: true,
  featured: false,
};

export default function AdminProductsPage({ params: { locale } }: { params: { locale: string } }) {
  const t = useTranslations('admin');
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const isRtl = locale === 'ar';

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const openAddModal = () => {
    setIsEditing(false);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEditModal = (p: ProductItem) => {
    setIsEditing(true);
    setForm({
      id: p.id,
      slug: p.slug,
      nameAr: p.nameAr,
      nameFr: p.nameFr,
      descAr: p.descAr || '',
      descFr: p.descFr || '',
      price: p.price,
      image: p.image,
      available: p.available,
      featured: p.featured,
    });
    setShowModal(true);
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!window.confirm(`${t('deleteConfirmProduct')} (${name})`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleAvailable = async (p: ProductItem) => {
    try {
      const res = await fetch(`/api/products/${p.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ available: !p.available }),
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((item) => (item.id === p.id ? { ...item, available: !item.available } : item))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleFeatured = async (p: ProductItem) => {
    try {
      const res = await fetch(`/api/products/${p.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !p.featured }),
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((item) => (item.id === p.id ? { ...item, featured: !item.featured } : item))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEditing && form.id) {
        // Update product
        const res = await fetch(`/api/products/${form.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        if (res.ok) {
          setShowModal(false);
          loadProducts();
        }
      } else {
        // Create new product
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        if (res.ok) {
          setShowModal(false);
          loadProducts();
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;
      return (
        p.nameAr.toLowerCase().includes(q) ||
        p.nameFr.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q)
      );
    });
  }, [products, searchQuery]);

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-accent/10 shadow-2xs">
        <div className="flex items-center gap-3">
          <Link
            href={`/${locale}/admin/orders`}
            className="text-xs sm:text-sm font-bold text-accent/70 hover:text-accent flex items-center gap-1.5 bg-cream px-3.5 py-2 rounded-xl border border-accent/10 active:scale-95 transition-all shadow-2xs"
          >
            {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            <span>📦 {t('orders')}</span>
          </Link>
          <h1 className="text-xl sm:text-2xl font-black text-accent">{t('products')}</h1>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="bg-accent hover:bg-accent/90 text-cream px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t('addProduct')}</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-accent/10 shadow-2xs flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-accent/40 absolute top-3 left-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchProducts')}
            className="w-full pl-9 pr-8 py-2 rounded-xl border border-accent/20 text-sm font-medium text-accent focus:outline-hidden focus:border-primary bg-cream/30"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute top-2.5 right-2.5 text-accent/40 hover:text-accent"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <span className="text-xs font-bold text-accent/60 shrink-0">
          {filteredProducts.length} {locale === 'ar' ? 'منتج' : 'produits'}
        </span>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="text-center py-20">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-accent/40" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-accent/10 space-y-2">
          <p className="text-accent/70 font-bold text-sm">{t('noMatchingProducts')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredProducts.map((p) => {
            const displayName = isRtl ? p.nameAr : p.nameFr;
            const subName = isRtl ? p.nameFr : p.nameAr;

            return (
              <div
                key={p.id}
                className="bg-white rounded-2xl p-4 border border-accent/10 shadow-2xs space-y-3 flex flex-col justify-between hover:shadow-xs transition-shadow relative overflow-hidden"
              >
                {/* Image Container with Badges */}
                <div className="relative h-44 w-full rounded-xl overflow-hidden bg-accent/5">
                  <Image
                    src={p.image}
                    alt={displayName}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover"
                  />

                  {/* Featured Badge */}
                  {p.featured && (
                    <div className="absolute top-2 left-2 bg-primary text-accent text-[10px] font-black px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>{t('featuredBadge')}</span>
                    </div>
                  )}

                  {/* Stock Status Badge */}
                  <div
                    className={`absolute bottom-2 right-2 px-2.5 py-0.5 rounded-full text-[10px] font-black shadow-md flex items-center gap-1 ${
                      p.available ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                    }`}
                  >
                    {p.available ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    <span>{p.available ? t('inStock') : t('outOfStock')}</span>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-black text-accent text-base leading-snug">{displayName}</h3>
                    <span className="font-black text-primary text-base whitespace-nowrap">
                      {p.price} دج
                    </span>
                  </div>
                  <p className="text-xs text-accent/60 font-medium">{subName}</p>
                  <p className="text-xs text-accent/75 line-clamp-2 pt-1 font-normal">
                    {isRtl ? p.descAr : p.descFr}
                  </p>
                </div>

                {/* Actions & Toggles */}
                <div className="pt-3 border-t border-accent/10 flex items-center justify-between gap-2">
                  {/* Quick Toggles */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleToggleAvailable(p)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all active:scale-95 border ${
                        p.available
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                          : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                      }`}
                      title={t('toggleAvailable')}
                    >
                      {p.available ? '🟢 ' + t('inStock') : '🔴 ' + t('outOfStock')}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggleFeatured(p)}
                      className={`p-1.5 rounded-lg text-xs font-bold transition-all active:scale-95 border ${
                        p.featured
                          ? 'bg-amber-100 text-amber-800 border-amber-300 shadow-2xs'
                          : 'bg-cream text-accent/60 border-accent/15 hover:text-accent'
                      }`}
                      title={t('toggleFeatured')}
                    >
                      <Sparkles className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Edit & Delete */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openEditModal(p)}
                      className="p-2 text-accent/70 hover:text-accent hover:bg-accent/5 rounded-lg transition-colors active:scale-90"
                      title={t('editProduct')}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteProduct(p.id, displayName)}
                      disabled={deletingId === p.id}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors active:scale-90"
                      title={t('deleteProduct')}
                    >
                      {deletingId === p.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-5 sm:p-7 max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl my-auto animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-accent/10">
              <h2 className="text-lg sm:text-xl font-black text-accent">
                {isEditing ? t('editProduct') : t('addProduct')}
              </h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full hover:bg-cream flex items-center justify-center text-accent"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-bold mb-1 text-accent">Slug (e.g. crepe-pistache)</label>
                <input
                  type="text"
                  required
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="crepe-pistache"
                  className="w-full p-2.5 border rounded-xl font-mono text-accent bg-cream/30 text-sm focus:outline-hidden focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1 text-accent">الاسم بالعربية *</label>
                  <input
                    type="text"
                    required
                    value={form.nameAr}
                    onChange={(e) => setForm({ ...form, nameAr: e.target.value })}
                    placeholder="كريب بيستاشيو"
                    className="w-full p-2.5 border rounded-xl text-accent bg-cream/30 text-sm focus:outline-hidden focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1 text-accent">Nom en Français *</label>
                  <input
                    type="text"
                    required
                    value={form.nameFr}
                    onChange={(e) => setForm({ ...form, nameFr: e.target.value })}
                    placeholder="Crêpe Pistache"
                    className="w-full p-2.5 border rounded-xl text-accent bg-cream/30 text-sm focus:outline-hidden focus:border-primary"
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
                    placeholder="وصف الكريب والمكونات..."
                    className="w-full p-2.5 border rounded-xl text-accent bg-cream/30 text-sm focus:outline-hidden focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1 text-accent">Description en Français</label>
                  <textarea
                    rows={2}
                    value={form.descFr}
                    onChange={(e) => setForm({ ...form, descFr: e.target.value })}
                    placeholder="Description de la crêpe..."
                    className="w-full p-2.5 border rounded-xl text-accent bg-cream/30 text-sm focus:outline-hidden focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1 text-accent">السعر (DZD) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    step={10}
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    className="w-full p-2.5 border rounded-xl text-accent bg-cream/30 text-sm focus:outline-hidden focus:border-primary font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1 text-accent">رابط الصورة (Image URL / path) *</label>
                  <input
                    type="text"
                    required
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    placeholder="/images/crepe-1.jpeg"
                    className="w-full p-2.5 border rounded-xl text-accent bg-cream/30 text-sm focus:outline-hidden focus:border-primary"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={form.available}
                    onChange={(e) => setForm({ ...form, available: e.target.checked })}
                    className="w-4 h-4 rounded text-accent accent-accent"
                  />
                  <span className="font-bold text-xs text-accent">{t('toggleAvailable')}</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                    className="w-4 h-4 rounded text-accent accent-accent"
                  />
                  <span className="font-bold text-xs text-accent">{t('toggleFeatured')}</span>
                </label>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end gap-2 pt-4 border-t border-accent/10">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 border border-accent/20 rounded-xl font-bold text-accent hover:bg-cream active:scale-95"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-accent text-cream rounded-xl font-black shadow-md hover:bg-accent/90 active:scale-95 disabled:opacity-50 flex items-center gap-2"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{t('save')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}