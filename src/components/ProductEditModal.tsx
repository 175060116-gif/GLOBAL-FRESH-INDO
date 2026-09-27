import React, { useState, useEffect } from 'react';
import { Product } from '../data/products';
import { X, Upload, Image as ImageIcon, Save, Check, AlertCircle, Loader2 } from 'lucide-react';
import { compressImageFile } from '../utils/imageCompressor';

interface ProductEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null; // null if adding new
  onSave: (productData: Product) => void;
}

export const ProductEditModal: React.FC<ProductEditModalProps> = ({
  isOpen,
  onClose,
  product,
  onSave,
}) => {
  const isEditing = Boolean(product);

  const [formData, setFormData] = useState<Partial<Product>>({
    id: '',
    name: '',
    subtitle: '',
    category: 'lokal',
    origin: 'Indonesia',
    grade: 'Grade A Super',
    unit: 'kg',
    retailPrice: 25000,
    originalRetailPrice: 30000,
    wholesalePrice: 20000,
    wholesaleUnitDesc: 'Grosir Peti (min. 10 kg)',
    wholesaleMinQty: 10,
    discountPercent: 15,
    isBestDeal: false,
    isPopular: false,
    inStock: true,
    stockKg: 100,
    rating: 4.9,
    reviewsCount: 15,
    description: '',
    sweetnessBrix: 'Manis Segar',
    shelfLife: '3-5 hari',
    storageTemp: '10-15°C',
    image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=800&q=80',
  });

  const [imagePreview, setImagePreview] = useState<string>('');
  const [imageMode, setImageMode] = useState<'url' | 'upload'>('url');

  useEffect(() => {
    if (product) {
      setFormData(product);
      setImagePreview(product.image);
    } else {
      const newId = 'buah-' + Date.now().toString().slice(-6);
      setFormData({
        id: newId,
        name: '',
        subtitle: '',
        category: 'lokal',
        origin: 'Jawa Barat, Indonesia',
        grade: 'Grade A Super',
        unit: 'kg',
        retailPrice: 25000,
        originalRetailPrice: 30000,
        wholesalePrice: 20000,
        wholesaleUnitDesc: 'Grosir Peti (min. 10 kg)',
        wholesaleMinQty: 10,
        discountPercent: 15,
        isBestDeal: false,
        isPopular: false,
        inStock: true,
        stockKg: 100,
        rating: 4.9,
        reviewsCount: 1,
        description: 'Buah segar pilihan mutu terbaik, dipetik langsung dari kebun terpercaya.',
        sweetnessBrix: 'Manis Segar',
        shelfLife: '3-5 hari',
        storageTemp: '12-16°C',
        image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=800&q=80',
      });
      setImagePreview('https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=800&q=80');
    }
  }, [product, isOpen]);

  const [isCompressing, setIsCompressing] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsCompressing(true);
      const compressed = await compressImageFile(file, {
        maxWidth: 700,
        maxHeight: 700,
        quality: 0.75,
        maxSizeKB: 90,
      });
      setImagePreview(compressed);
      setFormData(prev => ({ ...prev, image: compressed }));
    } catch (err: unknown) {
      console.error('Error compressing product photo:', err);
      alert('Gagal memproses foto produk. Silakan gunakan file lain atau gunakan tautan URL.');
    } finally {
      setIsCompressing(false);
      e.target.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      alert('Mohon isi nama produk!');
      return;
    }
    if (!formData.retailPrice || formData.retailPrice <= 0) {
      alert('Mohon masukkan harga ritel yang valid!');
      return;
    }

    const calculatedDiscount = (formData.originalRetailPrice && formData.originalRetailPrice > (formData.retailPrice || 0))
      ? Math.round(((formData.originalRetailPrice - (formData.retailPrice || 0)) / formData.originalRetailPrice) * 100)
      : 0;

    const finalProduct: Product = {
      id: formData.id || 'buah-' + Date.now(),
      name: formData.name || '',
      subtitle: formData.subtitle || `${formData.grade || 'Grade A'} Segar`,
      category: formData.category as 'lokal' | 'import' | 'parcel',
      origin: formData.origin || 'Indonesia',
      grade: formData.grade as 'Grade A Super' | 'Premium Import' | 'Best Seller' | 'Spesial Hampers',
      unit: formData.unit || 'kg',
      retailPrice: Number(formData.retailPrice),
      originalRetailPrice: formData.originalRetailPrice ? Number(formData.originalRetailPrice) : undefined,
      wholesalePrice: Number(formData.wholesalePrice || formData.retailPrice),
      wholesaleUnitDesc: formData.wholesaleUnitDesc || `Grosir Peti (min. ${formData.wholesaleMinQty || 10} ${formData.unit})`,
      wholesaleMinQty: Number(formData.wholesaleMinQty || 10),
      discountPercent: calculatedDiscount || undefined,
      isBestDeal: Boolean(formData.isBestDeal),
      isPopular: Boolean(formData.isPopular),
      inStock: (formData.stockKg || 0) > 0,
      stockKg: Number(formData.stockKg || 0),
      rating: formData.rating || 4.9,
      reviewsCount: formData.reviewsCount || 10,
      description: formData.description || 'Buah segar kualitas terbaik.',
      sweetnessBrix: formData.sweetnessBrix,
      shelfLife: formData.shelfLife,
      storageTemp: formData.storageTemp,
      image: imagePreview || formData.image || 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=800&q=80',
    };

    onSave(finalProduct);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-[#E2EBD8] overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header Modal */}
        <div className="px-6 py-4 border-b border-[#E2EBD8] bg-[#F7FAF5] flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-[#17331D]">
              {isEditing ? '✏️ Edit Detail & Harga Produk' : '➕ Tambah Produk Buah Baru'}
            </h2>
            <p className="text-xs text-[#6B7D70]">
              {isEditing ? `Mengubah data untuk ID: ${formData.id}` : 'Tambahkan varietas buah segar baru ke etalase toko'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#6B7D70] hover:text-[#17331D] hover:bg-white rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Section: Foto Produk */}
          <div className="bg-[#F0F7EC]/60 rounded-2xl p-4 border border-[#D5E8CC] space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#17331D] uppercase tracking-wider flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-[#087F23]" />
                Foto Produk Buah
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setImageMode('url')}
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-colors ${
                    imageMode === 'url' ? 'bg-[#087F23] text-white' : 'bg-white text-[#6B7D70]'
                  }`}
                >
                  Link URL Gambar
                </button>
                <button
                  type="button"
                  onClick={() => setImageMode('upload')}
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-colors ${
                    imageMode === 'upload' ? 'bg-[#087F23] text-white' : 'bg-white text-[#6B7D70]'
                  }`}
                >
                  Upload File Foto
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Preview Thumbnail */}
              <div className="relative w-24 h-24 rounded-2xl border-2 border-[#087F23] bg-white overflow-hidden shrink-0 shadow-xs flex items-center justify-center">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                ) : (
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                )}
              </div>

              <div className="flex-1 w-full space-y-2">
                {imageMode === 'url' ? (
                  <div>
                    <input
                      type="url"
                      value={formData.image || ''}
                      onChange={(e) => {
                        setFormData({ ...formData, image: e.target.value });
                        setImagePreview(e.target.value);
                      }}
                      placeholder="https://images.unsplash.com/... atau URL foto"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#CDE0C4] bg-white focus:outline-none focus:ring-2 focus:ring-[#087F23]"
                    />
                    <p className="text-[10px] text-[#6B7D70] mt-1">
                      Masukkan URL tautan gambar dari internet atau Unsplash.
                    </p>
                  </div>
                ) : (
                  <div>
                    <label className={`flex flex-col items-center justify-center border-2 border-dashed border-[#087F23]/40 hover:border-[#087F23] bg-white rounded-xl p-3 cursor-pointer transition-colors text-center ${isCompressing ? 'opacity-70 pointer-events-none' : ''}`}>
                      {isCompressing ? (
                        <>
                          <Loader2 className="w-5 h-5 text-[#087F23] mb-1 animate-spin" />
                          <span className="text-xs font-bold text-[#17331D]">Mengompres Foto Produk...</span>
                          <span className="text-[10px] text-[#6B7D70]">Menyesuaikan ukuran optimal</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-5 h-5 text-[#087F23] mb-1" />
                          <span className="text-xs font-bold text-[#17331D]">Pilih Foto dari Komputer/HP</span>
                          <span className="text-[10px] text-[#6B7D70]">Format JPG, PNG, WEBP (Otomatis Dioptimalkan)</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={isCompressing}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section: Nama dan Deskripsi Buah */}
          <div className="space-y-3">
            <h3 className="text-xs font-black text-[#087F23] uppercase tracking-wider">
              Identitas & Karakteristik Produk
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#17331D] mb-1">
                  Nama Produk Buah *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Alpukat Mentega Super Probolinggo"
                  className="w-full text-xs px-3.5 py-2 rounded-xl border border-[#CDE0C4] bg-white focus:outline-none focus:ring-2 focus:ring-[#087F23]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17331D] mb-1">
                  Subtitle / Keunggulan Utama
                </label>
                <input
                  type="text"
                  value={formData.subtitle || ''}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="Contoh: Daging Tebal Legit Tanpa Serat"
                  className="w-full text-xs px-3.5 py-2 rounded-xl border border-[#CDE0C4] bg-white focus:outline-none focus:ring-2 focus:ring-[#087F23]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#17331D] mb-1">
                  Kategori
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-[#CDE0C4] bg-white focus:outline-none focus:ring-2 focus:ring-[#087F23]"
                >
                  <option value="lokal">Buah Lokal Nusantara</option>
                  <option value="import">Buah Impor Premium</option>
                  <option value="parcel">Parcel / Hampers Buah</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17331D] mb-1">
                  Grade Kualitas
                </label>
                <select
                  value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: e.target.value as any })}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-[#CDE0C4] bg-white focus:outline-none focus:ring-2 focus:ring-[#087F23]"
                >
                  <option value="Grade A Super">Grade A Super</option>
                  <option value="Premium Import">Premium Import</option>
                  <option value="Best Seller">Best Seller</option>
                  <option value="Spesial Hampers">Spesial Hampers</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17331D] mb-1">
                  Asal Buah (Origin)
                </label>
                <input
                  type="text"
                  value={formData.origin || ''}
                  onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                  placeholder="Contoh: Malang / California / Shandong"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-[#CDE0C4] bg-white focus:outline-none focus:ring-2 focus:ring-[#087F23]"
                />
              </div>
            </div>
          </div>

          {/* Section: Penyesuaian Harga & Satuan */}
          <div className="space-y-3 bg-[#FFFDF5] p-4 rounded-2xl border border-[#F0E5BC]">
            <h3 className="text-xs font-black text-[#FF7F00] uppercase tracking-wider flex items-center gap-1.5">
              💰 Penyesuaian Harga & Diskon
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#17331D] mb-1">
                  Harga Ritel Normal (Rp) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs font-bold text-[#6B7D70]">Rp</span>
                  <input
                    type="number"
                    min="1000"
                    step="500"
                    required
                    value={formData.retailPrice || ''}
                    onChange={(e) => setFormData({ ...formData, retailPrice: Number(e.target.value) })}
                    className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-[#E0D3A8] bg-white font-bold text-[#087F23] focus:outline-none focus:ring-2 focus:ring-[#FF7F00]"
                  />
                </div>
                <span className="text-[10px] text-[#6B7D70]">Harga jual ke konsumen per {formData.unit || 'kg'}</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17331D] mb-1">
                  Harga Coret / Asli (Rp)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs font-bold text-[#6B7D70]">Rp</span>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    value={formData.originalRetailPrice || ''}
                    onChange={(e) => setFormData({ ...formData, originalRetailPrice: e.target.value ? Number(e.target.value) : undefined })}
                    placeholder="Opsional (promo)"
                    className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-[#E0D3A8] bg-white focus:outline-none focus:ring-2 focus:ring-[#FF7F00]"
                  />
                </div>
                <span className="text-[10px] text-[#6B7D70]">Jika diisi lebih besar, badge diskon % aktif</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17331D] mb-1">
                  Satuan Jual
                </label>
                <input
                  type="text"
                  value={formData.unit || 'kg'}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  placeholder="kg / pack / box / parcel"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-[#E0D3A8] bg-white focus:outline-none focus:ring-2 focus:ring-[#FF7F00]"
                />
                <span className="text-[10px] text-[#6B7D70]">Contoh: kg, pack, parcel</span>
              </div>
            </div>

            {/* Wholesale Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-[#F0E5BC]/80">
              <div>
                <label className="block text-xs font-bold text-[#17331D] mb-1">
                  Harga Grosir / B2B (Rp)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs font-bold text-[#6B7D70]">Rp</span>
                  <input
                    type="number"
                    min="1000"
                    step="500"
                    value={formData.wholesalePrice || ''}
                    onChange={(e) => setFormData({ ...formData, wholesalePrice: Number(e.target.value) })}
                    className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-[#E0D3A8] bg-white font-bold text-[#17331D] focus:outline-none focus:ring-2 focus:ring-[#FF7F00]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17331D] mb-1">
                  Min. Order Grosir
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.wholesaleMinQty || 10}
                  onChange={(e) => setFormData({ ...formData, wholesaleMinQty: Number(e.target.value) })}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-[#E0D3A8] bg-white focus:outline-none focus:ring-2 focus:ring-[#FF7F00]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17331D] mb-1">
                  Keterangan Grosir
                </label>
                <input
                  type="text"
                  value={formData.wholesaleUnitDesc || ''}
                  onChange={(e) => setFormData({ ...formData, wholesaleUnitDesc: e.target.value })}
                  placeholder="Grosir Peti (min. 20 kg)"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-[#E0D3A8] bg-white focus:outline-none focus:ring-2 focus:ring-[#FF7F00]"
                />
              </div>
            </div>
          </div>

          {/* Section: Stok & Status Etalase */}
          <div className="space-y-3">
            <h3 className="text-xs font-black text-[#087F23] uppercase tracking-wider">
              Inventori Stok & Tampilan
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#17331D] mb-1">
                  Stok Tersedia ({formData.unit || 'kg'})
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.stockKg ?? 100}
                  onChange={(e) => setFormData({ ...formData, stockKg: Number(e.target.value) })}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-[#CDE0C4] bg-white focus:outline-none focus:ring-2 focus:ring-[#087F23]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17331D] mb-1">
                  Tingkat Kemanisan (Brix)
                </label>
                <input
                  type="text"
                  value={formData.sweetnessBrix || ''}
                  onChange={(e) => setFormData({ ...formData, sweetnessBrix: e.target.value })}
                  placeholder="Contoh: 14-16° Brix Manis Legit"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-[#CDE0C4] bg-white focus:outline-none focus:ring-2 focus:ring-[#087F23]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17331D] mb-1">
                  Daya Tahan Buah
                </label>
                <input
                  type="text"
                  value={formData.shelfLife || ''}
                  onChange={(e) => setFormData({ ...formData, shelfLife: e.target.value })}
                  placeholder="Contoh: 5-7 hari sejuk"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-[#CDE0C4] bg-white focus:outline-none focus:ring-2 focus:ring-[#087F23]"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-5 pt-2">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.isBestDeal || false}
                  onChange={(e) => setFormData({ ...formData, isBestDeal: e.target.checked })}
                  className="w-4 h-4 text-[#087F23] rounded-md focus:ring-[#087F23]"
                />
                <span className="text-xs font-bold text-[#17331D]">⭐ Tandai Produk Promo / Best Deal</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.isPopular || false}
                  onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                  className="w-4 h-4 text-[#087F23] rounded-md focus:ring-[#087F23]"
                />
                <span className="text-xs font-bold text-[#17331D]">🔥 Tandai Produk Populer</span>
              </label>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#17331D] mb-1">
                Deskripsi Lengkap Buah
              </label>
              <textarea
                rows={3}
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Jelaskan kualitas rasa, kesegaran panen, tekstur daging buah..."
                className="w-full text-xs px-3 py-2 rounded-xl border border-[#CDE0C4] bg-white focus:outline-none focus:ring-2 focus:ring-[#087F23]"
              />
            </div>
          </div>

        </form>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-[#E2EBD8] bg-[#F7FAF5] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-[#6B7D70] hover:text-[#17331D] rounded-xl"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-5 py-2.5 bg-[#087F23] hover:bg-[#06631B] text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 transition-all hover:scale-102"
          >
            <Save className="w-4 h-4" />
            <span>{isEditing ? 'Simpan Perubahan Produk' : 'Simpan Produk Baru'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
