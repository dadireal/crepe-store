'use client';

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
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
  Upload,
  Camera,
  Link2,
  ImageIcon,
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

/* ───────────────────────────────────────────────
   Browser-side image compressor → base64
   No accounts / no API keys needed
─────────────────────────────────────────────── */
function compressImageToBase64(file: File, maxWidth = 900, quality = 0.78): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const blobUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(blobUrl);
      const scale = Math.min(1, maxWidth / img.width);
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Canvas not supported'));
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => { URL.revokeObjectURL(blobUrl); reject(new Error('Failed to load image')); };
    img.src = blobUrl;
  });
}

function ImageUploader({
  value,
  onChange,
  locale,
}: {
  value: string;
  onChange: (url: string) => void;
  locale: string;
}) {
  const [processing, setProcessing] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [inputMode, setInputMode] = useState<'upload' | 'url'>('upload');
  const [sizeInfo, setSizeInfo] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isRtl = locale === 'ar';

  const handleFile = useCallback(
    async (file: File) => {
      setUploadError('');
      setSizeInfo('');
      const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/heic', 'image/heif'];
      const isAllowed = allowed.includes(file.type) || file.name.match(/\.(jpe?g|png|webp|gif|heic|heif)$/i);
      if (!isAllowed) {
        setUploadError(isRtl ? 'نوع الملف غير مدعوم. استخدم JPEG أو PNG.' : 'Format non supporté. Utilisez JPEG ou PNG.');
        return;
      }
      if (file.size > 20 * 1024 * 1024) {
        setUploadError(isRtl ? 'الملف كبير جداً. الحد الأقصى 20 ميغابايت.' : 'Trop volumineux. Maximum 20 Mo.');
        return;
      }

      setProcessing(true);
      try {
        // Compress in browser → small base64 JPEG (no server, no account)
        const base64 = await compressImageToBase64(file, 900, 0.78);
        const kb = Math.round(base64.length * 0.75 / 1024);
        setSizeInfo(isRtl ? `✅ تم الضغط إلى ${kb} KB` : `✅ Compressé en ${kb} Ko`);
        onChange(base64);
      } catch (err: any) {
        setUploadError(err.message);
      } finally {
        setProcessing(false);
      }
    },
    [onChange, isRtl]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  };

  const isDataUrl = value?.startsWith('data:');
  const hasImage = value && value !== '/images/crepe-1.jpeg';

  return (
    <div className="space-y-3">
      {/* Mode tabs */}
      <div className="flex rounded-xl border border-accent/20 overflow-hidden text-xs font-bold">
        <button
          type="button"
          onClick={() => setInputMode('upload')}
          className={`flex-1 py-2 flex items-center justify-center gap-1.5 transition-colors ${inputMode === 'upload' ? 'bg-accent text-cream' : 'bg-cream/40 text-accent/70 hover:bg-cream'
            }`}
        >
          <Upload className="w-3.5 h-3.5" />
          {isRtl ? 'رفع صورة 📷' : 'Télécharger 📷'}
        </button>
        <button
          type="button"
          onClick={() => setInputMode('url')}
          className={`flex-1 py-2 flex items-center justify-center gap-1.5 transition-colors ${inputMode === 'url' ? 'bg-accent text-cream' : 'bg-cream/40 text-accent/70 hover:bg-cream'
            }`}
        >
          <Link2 className="w-3.5 h-3.5" />
          {isRtl ? 'رابط URL' : 'URL / Lien'}
        </button>
      </div>

      {inputMode === 'upload' ? (
        <>
          {/* Drop Zone / Preview */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            onClick={() => {
              if (fileInputRef.current) {
                fileInputRef.current.removeAttribute('capture');
                fileInputRef.current.click();
              }
            }}
            className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all overflow-hidden
              ${dragOver ? 'border-primary bg-primary/10 scale-[1.01]' : 'border-accent/25 hover:border-primary/60 hover:bg-cream/70'}
              ${hasImage ? 'h-52' : 'h-40 bg-cream/30'}
            `}
          >
            {/* Preview image */}
            {hasImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={value}
                alt="preview"
                className="w-full h-full object-cover opacity-85"
              />
            )}

            {/* Overlay */}
            <div className={`absolute inset-0 flex flex-col items-center justify-center gap-2 transition-opacity ${hasImage ? 'bg-black/45 opacity-0 hover:opacity-100' : 'opacity-100'
              }`}>
              {processing ? (
                <>
                  <Loader2 className="w-8 h-8 animate-spin text-white drop-shadow-md" />
                  <span className="text-xs font-bold text-white drop-shadow">
                    {isRtl ? 'جارٍ الضغط...' : 'Compression...'}
                  </span>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-full bg-white/25 backdrop-blur-sm flex items-center justify-center shadow-lg">
                    {hasImage ? <Camera className="w-5 h-5 text-white" /> : <ImageIcon className="w-5 h-5 text-accent/50" />}
                  </div>
                  <div className="text-center px-4">
                    <p className={`text-xs font-bold ${hasImage ? 'text-white drop-shadow' : 'text-accent/70'}`}>
                      {hasImage
                        ? (isRtl ? 'انقر لتغيير الصورة' : 'Cliquer pour changer')
                        : (isRtl ? 'انقر أو اسحب صورة هنا' : 'Cliquez ou glissez une image ici')}
                    </p>
                    {!hasImage && (
                      <p className="text-[10px] text-accent/45 mt-1">
                        {isRtl ? 'يتم ضغط الصورة تلقائياً — لا حاجة لإعداد أي شيء' : 'Compression automatique — aucune configuration requise'}
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>

            <input ref={fileInputRef} type="file" accept="image/*" onChange={onFileChange} className="hidden" />
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                if (fileInputRef.current) {
                  fileInputRef.current.removeAttribute('capture');
                  fileInputRef.current.click();
                }
              }}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold rounded-xl bg-cream border border-accent/20 text-accent hover:bg-accent/5 active:scale-95 transition-all"
            >
              <Upload className="w-3.5 h-3.5" />
              {isRtl ? '📁 من الجهاز' : '📁 Depuis l\'appareil'}
            </button>
            <button
              type="button"
              onClick={() => {
                if (fileInputRef.current) {
                  fileInputRef.current.setAttribute('capture', 'environment');
                  fileInputRef.current.click();
                }
              }}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold rounded-xl bg-cream border border-accent/20 text-accent hover:bg-accent/5 active:scale-95 transition-all"
            >
              <Camera className="w-3.5 h-3.5" />
              {isRtl ? '📸 الكاميرا' : '📸 Caméra'}
            </button>
            {hasImage && (
              <button
                type="button"
                onClick={() => { onChange('/images/crepe-1.jpeg'); setSizeInfo(''); }}
                className="px-3 py-2 text-xs rounded-xl bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 active:scale-95 transition-all"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Size info */}
          {sizeInfo && <p className="text-xs font-bold text-emerald-600">{sizeInfo}</p>}
        </>
      ) : (
        /* URL Mode */
        <div className="space-y-2">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="/images/crepe-1.jpeg  or  https://..."
            className="w-full p-2.5 border border-accent/20 rounded-xl text-accent bg-cream/30 text-sm focus:outline-hidden focus:border-primary font-mono"
          />
          {value && (
            <div className="relative h-36 rounded-xl overflow-hidden border border-accent/20 bg-accent/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={value} alt="preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      )}

      {/* Error message */}
      {uploadError && (
        <p className="text-xs font-bold text-red-600 bg-red-50 px-3 py-2 rounded-xl border border-red-200">
          ⚠️ {uploadError}
        </p>
      )}
    </div>
  );
}

/* ───────────────────────────────────────────────
   Main Page
─────────────────────────────────────────────── */

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
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) setProducts((prev) => prev.filter((p) => p.id !== id));
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
        const res = await fetch(`/api/products/${form.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        if (res.ok) { setShowModal(false); loadProducts(); }
      } else {
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        if (res.ok) { setShowModal(false); loadProducts(); }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const filteredProducts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.nameAr.toLowerCase().includes(q) ||
        p.nameFr.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q)
    );
  }, [products, searchQuery]);

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-8 space-y-6">
      {/* Header */}
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
            <button type="button" onClick={() => setSearchQuery('')} className="absolute top-2.5 right-2.5 text-accent/40 hover:text-accent">
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
                <div className="relative h-44 w-full rounded-xl overflow-hidden bg-accent/5">
                  <Image src={p.image} alt={displayName} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover" />
                  {p.featured && (
                    <div className="absolute top-2 left-2 bg-primary text-accent text-[10px] font-black px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                    </div>
                  )}
                  <div className={`absolute bottom-2 right-2 px-2.5 py-0.5 rounded-full text-[10px] font-black shadow-md flex items-center gap-1 ${p.available ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}>
                    {p.available ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    <span>{p.available ? t('inStock') : t('outOfStock')}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-black text-accent text-base leading-snug">{displayName}</h3>
                    <span className="font-black text-primary text-base whitespace-nowrap">{p.price} دج</span>
                  </div>
                  <p className="text-xs text-accent/60 font-medium">{subName}</p>
                  <p className="text-xs text-accent/75 line-clamp-2 pt-1">{isRtl ? p.descAr : p.descFr}</p>
                </div>

                <div className="pt-3 border-t border-accent/10 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button type="button" onClick={() => handleToggleAvailable(p)} className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all active:scale-95 border ${p.available ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'}`}>
                      {p.available ? '🟢 ' + t('inStock') : '🔴 ' + t('outOfStock')}
                    </button>
                    <button type="button" onClick={() => handleToggleFeatured(p)} className={`p-1.5 rounded-lg transition-all active:scale-95 border ${p.featured ? 'bg-amber-100 text-amber-800 border-amber-300 shadow-2xs' : 'bg-cream text-accent/60 border-accent/15 hover:text-accent'}`} title={t('toggleFeatured')}>
                      <Sparkles className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-1">
                    <button type="button" onClick={() => openEditModal(p)} className="p-2 text-accent/70 hover:text-accent hover:bg-accent/5 rounded-lg transition-colors active:scale-90" title={t('editProduct')}>
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button type="button" onClick={() => handleDeleteProduct(p.id, displayName)} disabled={deletingId === p.id} className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors active:scale-90" title={t('deleteProduct')}>
                      {deletingId === p.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-start justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl p-5 sm:p-7 max-w-lg w-full shadow-2xl my-4 space-y-5 animate-fadeIn">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-accent/10">
              <h2 className="text-lg sm:text-xl font-black text-accent flex items-center gap-2">
                {isEditing ? <Edit2 className="w-5 h-5 text-primary" /> : <Plus className="w-5 h-5 text-primary" />}
                {isEditing ? t('editProduct') : t('addProduct')}
              </h2>
              <button type="button" onClick={() => setShowModal(false)} className="w-9 h-9 rounded-full hover:bg-cream flex items-center justify-center text-accent active:scale-90 transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 text-xs sm:text-sm">
              {/* Slug */}
              <div>
                <label className="block font-bold mb-1.5 text-accent">Slug</label>
                <input
                  type="text"
                  required
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="crepe-pistache"
                  className="w-full p-2.5 border border-accent/20 rounded-xl font-mono text-accent bg-cream/30 text-sm focus:outline-hidden focus:border-primary"
                />
              </div>

              {/* Bilingual names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1.5 text-accent">الاسم بالعربية *</label>
                  <input type="text" required value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} placeholder="كريب بيستاشيو" className="w-full p-2.5 border border-accent/20 rounded-xl text-accent bg-cream/30 text-sm focus:outline-hidden focus:border-primary" />
                </div>
                <div>
                  <label className="block font-bold mb-1.5 text-accent">Nom en Français *</label>
                  <input type="text" required value={form.nameFr} onChange={(e) => setForm({ ...form, nameFr: e.target.value })} placeholder="Crêpe Pistache" className="w-full p-2.5 border border-accent/20 rounded-xl text-accent bg-cream/30 text-sm focus:outline-hidden focus:border-primary" />
                </div>
              </div>

              {/* Descriptions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1.5 text-accent">الوصف بالعربية</label>
                  <textarea rows={2} value={form.descAr} onChange={(e) => setForm({ ...form, descAr: e.target.value })} placeholder="وصف الكريب والمكونات..." className="w-full p-2.5 border border-accent/20 rounded-xl text-accent bg-cream/30 text-sm focus:outline-hidden focus:border-primary" />
                </div>
                <div>
                  <label className="block font-bold mb-1.5 text-accent">Description en Français</label>
                  <textarea rows={2} value={form.descFr} onChange={(e) => setForm({ ...form, descFr: e.target.value })} placeholder="Description de la crêpe..." className="w-full p-2.5 border border-accent/20 rounded-xl text-accent bg-cream/30 text-sm focus:outline-hidden focus:border-primary" />
                </div>
              </div>

              {/* Price */}
              <div>
                <label className="block font-bold mb-1.5 text-accent">السعر (DZD) *</label>
                <input
                  type="number"
                  required
                  min={0}
                  step={10}
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                  className="w-full p-2.5 border border-accent/20 rounded-xl text-accent bg-cream/30 text-sm focus:outline-hidden focus:border-primary font-bold"
                />
              </div>

              {/* Image Uploader */}
              <div>
                <label className="block font-bold mb-1.5 text-accent">
                  {isRtl ? 'صورة المنتج' : 'Image du Produit'} *
                </label>
                <ImageUploader
                  value={form.image}
                  onChange={(url) => setForm({ ...form, image: url })}
                  locale={locale}
                />
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" checked={form.available} onChange={(e) => setForm({ ...form, available: e.target.checked })} className="w-4 h-4 rounded accent-accent" />
                  <span className="font-bold text-xs text-accent">{t('toggleAvailable')}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4 rounded accent-accent" />
                  <span className="font-bold text-xs text-accent">{t('toggleFeatured')}</span>
                </label>
              </div>

              {/* Submit */}
              <div className="flex justify-end gap-2 pt-4 border-t border-accent/10">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2.5 border border-accent/20 rounded-xl font-bold text-accent hover:bg-cream active:scale-95 transition-all">
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-accent text-cream rounded-xl font-black shadow-md hover:bg-accent/90 active:scale-95 disabled:opacity-50 flex items-center gap-2 transition-all"
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