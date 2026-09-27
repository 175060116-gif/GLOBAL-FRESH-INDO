import React, { useState, useEffect, useRef } from 'react';
import { WholesalePricelistItem } from '../data/wholesalePricelist';
import { 
  X, Save, Package, Image as ImageIcon, Sparkles, Hash, DollarSign, 
  Layers, Upload, Camera, Link as LinkIcon, Loader2, Check 
} from 'lucide-react';
import { compressImageFile } from '../utils/imageCompressor';

interface WholesaleItemEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: WholesalePricelistItem | null; // null if adding new
  onSave: (itemData: WholesalePricelistItem) => void;
}

const CATEGORY_EMOJIS: Record<string, string> = {
  Anggur: '🍇',
  Apel: '🍎',
  Jeruk: '🍊',
  Kiwi: '🥝',
  Lemon: '🍋',
  Delima: '❤️',
  Pear: '🍐',
  Lengkeng: '🟤',
  Plum: '🟣',
};

const DEFAULT_CATEGORY_IMAGES: Record<string, string> = {
  Anggur: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=800&q=80',
  Apel: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80',
  Jeruk: 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?auto=format&fit=crop&w=800&q=80',
  Kiwi: 'https://images.unsplash.com/photo-1585059895524-72359e06133a?auto=format&fit=crop&w=800&q=80',
  Lemon: 'https://images.unsplash.com/photo-1533038590840-1cde6e668a91?auto=format&fit=crop&w=800&q=80',
  Delima: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=800&q=80',
  Pear: 'https://images.unsplash.com/photo-1615484477778-ca3b783256fd?auto=format&fit=crop&w=800&q=80',
  Lengkeng: 'https://images.unsplash.com/photo-1546548970-71785318a17b?auto=format&fit=crop&w=800&q=80',
  Plum: 'https://images.unsplash.com/photo-1527325678964-54921661f888?auto=format&fit=crop&w=800&q=80',
};

export const WholesaleItemEditModal: React.FC<WholesaleItemEditModalProps> = ({
  isOpen,
  onClose,
  item,
  onSave,
}) => {
  const isEditing = Boolean(item);

  const [formData, setFormData] = useState<WholesalePricelistItem>({
    code: '',
    name: '',
    category: 'Anggur',
    categoryEmoji: '🍇',
    price: 250000,
    unit: 'Dus / Karton',
    packaging: 'Dus Karton Segel Standar Pabrik',
    image: DEFAULT_CATEGORY_IMAGES['Anggur'],
    badge: '',
    stockDus: 50,
    inStock: true,
  });

  const [photoMode, setPhotoMode] = useState<'upload' | 'url'>('upload');
  const [isCompressing, setIsCompressing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (item) {
      setFormData(item);
    } else {
      setFormData({
        code: String(Math.floor(1000 + Math.random() * 9000)),
        name: '',
        category: 'Anggur',
        categoryEmoji: '🍇',
        price: 250000,
        unit: 'Dus / Karton',
        packaging: 'Dus Karton Segel Standar Pabrik',
        image: DEFAULT_CATEGORY_IMAGES['Anggur'],
        badge: '',
        stockDus: 50,
        inStock: true,
      });
    }
  }, [item, isOpen]);

  const handleProcessFile = async (file: File) => {
    if (!file || !file.type.startsWith('image/')) {
      alert('Mohon pilih file gambar yang valid.');
      return;
    }

    try {
      setIsCompressing(true);
      const compressed = await compressImageFile(file, {
        maxWidth: 800,
        maxHeight: 800,
        quality: 0.78,
        maxSizeKB: 140,
      });
      setFormData((prev) => ({ ...prev, image: compressed }));
    } catch (err) {
      console.error('Error compressing image:', err);
      alert('Gagal memproses gambar. Silakan gunakan foto lain atau gunakan tautan URL.');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleProcessFile(file);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleProcessFile(file);
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code.trim() || !formData.name.trim()) {
      alert('Mohon isi kode produk dan nama buah.');
      return;
    }

    onSave({
      ...formData,
      categoryEmoji: CATEGORY_EMOJIS[formData.category] || '🍇',
    });
    onClose();
  };

  const handleCategoryChange = (cat: WholesalePricelistItem['category']) => {
    setFormData((prev) => ({
      ...prev,
      category: cat,
      categoryEmoji: CATEGORY_EMOJIS[cat] || '🍇',
      image: prev.image === DEFAULT_CATEGORY_IMAGES[prev.category] ? DEFAULT_CATEGORY_IMAGES[cat] : prev.image,
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div 
        className="bg-white rounded-3xl border border-[#E2EBD8] shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto flex flex-col animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#E2EBD8] bg-[#F7FAF5] sticky top-0 z-10">
          <div>
            <span className="text-[10px] font-bold text-[#087F23] uppercase tracking-wider bg-[#E8F5E4] px-2.5 py-0.5 rounded-full">
              {isEditing ? 'Pembaruan Item Buah' : 'Penambahan Item Baru'}
            </span>
            <h2 className="text-xl font-black text-[#17331D] mt-1">
              {isEditing ? `Edit Item Pricelist [Kode: ${formData.code}]` : 'Tambah Buah ke Pricelist & Stok Gudang'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Row 1: Kode & Kategori */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#17331D] mb-1.5 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-[#087F23]" />
                <span>Kode Produk Resmi *</span>
              </label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="Contoh: 2021, 11119"
                className="w-full text-xs font-mono font-bold px-3.5 py-2.5 rounded-xl border border-[#CDE0C4] bg-[#F7FAF5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#087F23]"
              />
              <span className="text-[10px] text-gray-500 mt-1 block">Kode identifikasi faktur & gudang</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#17331D] mb-1.5 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#087F23]" />
                <span>Kategori Buah *</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleCategoryChange(e.target.value as any)}
                className="w-full text-xs font-bold px-3.5 py-2.5 rounded-xl border border-[#CDE0C4] bg-[#F7FAF5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#087F23]"
              >
                {Object.keys(CATEGORY_EMOJIS).map((cat) => (
                  <option key={cat} value={cat}>
                    {CATEGORY_EMOJIS[cat]} {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Nama Produk */}
          <div>
            <label className="block text-xs font-bold text-[#17331D] mb-1.5 flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-[#087F23]" />
              <span>Nama Produk & Merek Dagang *</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Contoh: ANGGUR AUTUM ROYAL WONDERFRUIT KRJ"
              className="w-full text-xs font-bold px-3.5 py-2.5 rounded-xl border border-[#CDE0C4] bg-[#F7FAF5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#087F23]"
            />
          </div>

          {/* Row 3: Harga Baru & Stok Fisik Dus */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#17331D] mb-1.5 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-[#087F23]" />
                <span>Harga Baru Resmi (Rp) *</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-xs font-bold text-gray-500">Rp</span>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="w-full text-xs font-black pl-10 pr-3.5 py-2.5 rounded-xl border border-[#CDE0C4] bg-[#F7FAF5] text-[#087F23] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#087F23]"
                />
              </div>
              <span className="text-[10px] text-gray-500 mt-1 block">Harga per dus/keranjang/karton</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#17331D] mb-1.5 flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-[#087F23]" />
                <span>Stok Fisik Gudang (Dus/Karton) *</span>
              </label>
              <input
                type="number"
                min="0"
                required
                value={formData.stockDus}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  stockDus: Number(e.target.value),
                  inStock: Number(e.target.value) > 0 
                })}
                className="w-full text-xs font-black px-3.5 py-2.5 rounded-xl border border-[#CDE0C4] bg-[#F7FAF5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#087F23]"
              />
              <span className="text-[10px] text-gray-500 mt-1 block">Stok aktual yang siap dikirim</span>
            </div>
          </div>

          {/* Row 4: Kemasan & Satuan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#17331D] mb-1.5">
                Satuan Jual (Unit)
              </label>
              <input
                type="text"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                placeholder="Contoh: Dus, Keranjang, Karton 13kg"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#CDE0C4] bg-[#F7FAF5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#087F23]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#17331D] mb-1.5">
                Deskripsi Spesifikasi Kemasan
              </label>
              <input
                type="text"
                value={formData.packaging}
                onChange={(e) => setFormData({ ...formData, packaging: e.target.value })}
                placeholder="Contoh: Keranjang Plastik / Dus Segel 5kg"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#CDE0C4] bg-[#F7FAF5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#087F23]"
              />
            </div>
          </div>

          {/* Row 5: Badge & Status Ketersediaan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#17331D] mb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Label / Badge Khusus (Opsional)</span>
              </label>
              <input
                type="text"
                value={formData.badge || ''}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                placeholder="Contoh: Best Seller, Grade Super, Favorit"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#CDE0C4] bg-[#F7FAF5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#087F23]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#17331D] mb-1.5">
                Status Ketersediaan
              </label>
              <div className="flex items-center gap-3 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.inStock}
                    onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                    className="w-4 h-4 text-[#087F23] rounded-md focus:ring-[#087F23]"
                  />
                  <span className="text-xs font-bold text-[#17331D]">
                    {formData.inStock ? '🟢 Barang Tersedia' : '🔴 Barang Kosong / Habis'}
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Row 6: Upload & Foto Buah */}
          <div className="space-y-3 pt-2 border-t border-[#E2EBD8]">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#17331D] flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-[#087F23]" />
                <span>Foto Produk Buah *</span>
              </label>

              {/* Mode Toggle */}
              <div className="flex items-center gap-1 bg-[#F0F7EC] p-0.5 rounded-lg border border-[#CDE0C4]">
                <button
                  type="button"
                  onClick={() => setPhotoMode('upload')}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all flex items-center gap-1 ${
                    photoMode === 'upload'
                      ? 'bg-white text-[#087F23] shadow-xs'
                      : 'text-[#6B7D70] hover:text-[#17331D]'
                  }`}
                >
                  <Upload className="w-3 h-3" />
                  <span>Upload Foto</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPhotoMode('url')}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all flex items-center gap-1 ${
                    photoMode === 'url'
                      ? 'bg-white text-[#087F23] shadow-xs'
                      : 'text-[#6B7D70] hover:text-[#17331D]'
                  }`}
                >
                  <LinkIcon className="w-3 h-3" />
                  <span>Tautan URL</span>
                </button>
              </div>
            </div>

            {/* Hidden file & camera inputs */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              className="hidden"
            />

            {photoMode === 'upload' ? (
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                {/* Upload Dropzone */}
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                  onDragLeave={(e) => { e.preventDefault(); setIsDragOver(false); }}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`sm:col-span-8 border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                    isDragOver 
                      ? 'border-[#087F23] bg-[#E8F5E4]/60' 
                      : 'border-[#CDE0C4] hover:border-[#087F23] bg-[#F7FAF5]'
                  }`}
                >
                  {isCompressing ? (
                    <div className="py-2 flex items-center gap-2 text-xs font-bold text-[#087F23]">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Mengompres & memproses foto...</span>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-white border border-[#CDE0C4] flex items-center justify-center text-[#087F23] shadow-2xs">
                          <Upload className="w-4 h-4" />
                        </div>
                        <div className="text-left">
                          <span className="text-xs font-bold text-[#17331D] block">
                            Pilih atau Tarik Foto ke Sini
                          </span>
                          <span className="text-[10px] text-gray-500 block">
                            Format JPG, PNG, WEBP (Otomatis Dioptimasi)
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-1">
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                          className="px-2.5 py-1 rounded-lg bg-white border border-[#CDE0C4] text-[10px] font-bold text-[#17331D] hover:border-[#087F23] flex items-center gap-1 shadow-2xs"
                        >
                          <ImageIcon className="w-3 h-3 text-[#087F23]" />
                          <span>Pilih Berkas</span>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); cameraInputRef.current?.click(); }}
                          className="px-2.5 py-1 rounded-lg bg-white border border-[#CDE0C4] text-[10px] font-bold text-[#17331D] hover:border-[#087F23] flex items-center gap-1 shadow-2xs"
                        >
                          <Camera className="w-3 h-3 text-[#087F23]" />
                          <span>Kamera HP</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {/* Preview Box */}
                <div className="sm:col-span-4 flex flex-col items-center">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-[#CDE0C4] bg-white relative shadow-2xs">
                    <img 
                      src={formData.image} 
                      alt="Pratinjau Foto" 
                      className="w-full h-full object-cover" 
                    />
                    <span className="absolute bottom-1 left-1 text-[8px] bg-black/60 text-white px-1.5 py-0.5 rounded font-bold backdrop-blur-2xs">
                      Pratinjau
                    </span>
                  </div>
                  <span className="text-[9.5px] text-gray-400 mt-1">Tampilan katalog</span>
                </div>
              </div>
            ) : (
              <div className="flex gap-3 items-center">
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-[#CDE0C4] bg-[#F7FAF5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#087F23]"
                />
                <div className="w-12 h-12 rounded-xl overflow-hidden border border-[#CDE0C4] shrink-0 bg-gray-100">
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E2EBD8]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#CDE0C4] text-xs font-bold text-[#17331D] hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#087F23] hover:bg-[#06631B] text-white text-xs font-black shadow-md flex items-center gap-2 transition-all hover:scale-102"
            >
              <Save className="w-4 h-4" />
              <span>Simpan ke Database Toko</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
