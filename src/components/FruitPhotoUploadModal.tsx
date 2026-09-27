import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Upload, Camera, Link as LinkIcon, Image as ImageIcon, 
  Sparkles, Check, RotateCcw, Loader2, AlertCircle, ArrowRight
} from 'lucide-react';
import { compressImageFile } from '../utils/imageCompressor';

export interface FruitPhotoTarget {
  id?: string;
  code?: string;
  name: string;
  category?: string;
  categoryEmoji?: string;
  image: string;
  unit?: string;
}

interface FruitPhotoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  fruit: FruitPhotoTarget | null;
  onSave: (newImageUrl: string) => void;
}

// Curated high quality presets by fruit category
const CURATED_FRUIT_PRESETS: Record<string, { label: string; url: string }[]> = {
  Anggur: [
    { label: 'Anggur Merah Autumn Royal Segar', url: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=800&q=80' },
    { label: 'Anggur Hitam Manis Tanpa Biji', url: 'https://images.unsplash.com/photo-1596363505729-4190a9506133?auto=format&fit=crop&w=800&q=80' },
    { label: 'Anggur Shine Muscat Hijau Crunchy', url: 'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&w=800&q=80' },
    { label: 'Anggur Red Globe Australia Premium', url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80' },
  ],
  Apel: [
    { label: 'Apel Fuji Super Merah Manis', url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80' },
    { label: 'Apel Malang Segar Lokal', url: 'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?auto=format&fit=crop&w=800&q=80' },
    { label: 'Apel Hijau Granny Smith Renyah', url: 'https://images.unsplash.com/photo-1576179635662-9d1983e97e1e?auto=format&fit=crop&w=800&q=80' },
    { label: 'Apel Envy Selandia Baru', url: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?auto=format&fit=crop&w=800&q=80' },
  ],
  Jeruk: [
    { label: 'Jeruk Santang Daun Manis Madu', url: 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?auto=format&fit=crop&w=800&q=80' },
    { label: 'Jeruk Medan Brastagi Segar', url: 'https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=800&q=80' },
    { label: 'Jeruk Navel Sunkist Impor', url: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=800&q=80' },
    { label: 'Jeruk Ponkan Mandarin Imlek', url: 'https://images.unsplash.com/photo-1557800636-894a64c1696f?auto=format&fit=crop&w=800&q=80' },
  ],
  Kiwi: [
    { label: 'Kiwi Hijau Segar Penuh Vitamin C', url: 'https://images.unsplash.com/photo-1585059895524-72359e06133a?auto=format&fit=crop&w=800&q=80' },
    { label: 'Kiwi Gold Manis Zespri', url: 'https://images.unsplash.com/photo-1518492104633-130d0cc84637?auto=format&fit=crop&w=800&q=80' },
  ],
  Lemon: [
    { label: 'Lemon California Kuning Segar', url: 'https://images.unsplash.com/photo-1533038590840-1cde6e668a91?auto=format&fit=crop&w=800&q=80' },
    { label: 'Lemon Lokal Tanpa Biji', url: 'https://images.unsplash.com/photo-1587496679742-bad502958fbf?auto=format&fit=crop&w=800&q=80' },
  ],
  Delima: [
    { label: 'Delima Merah Super Manis', url: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=800&q=80' },
    { label: 'Biji Delima Segar Siap Konsumsi', url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80' },
  ],
  Pear: [
    { label: 'Pear Century Segar Berair', url: 'https://images.unsplash.com/photo-1615484477778-ca3b783256fd?auto=format&fit=crop&w=800&q=80' },
    { label: 'Pear Xiang Lie Wangi Renyah', url: 'https://images.unsplash.com/photo-1514756331096-242fdeb7004a?auto=format&fit=crop&w=800&q=80' },
    { label: 'Pear Singo Madu Korea', url: 'https://images.unsplash.com/photo-1587132137056-bfbf0166836e?auto=format&fit=crop&w=800&q=80' },
  ],
  Lengkeng: [
    { label: 'Lengkeng Bangkok Manis Daging Tebal', url: 'https://images.unsplash.com/photo-1546548970-71785318a17b?auto=format&fit=crop&w=800&q=80' },
    { label: 'Lengkeng Diamond River Lokal', url: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=800&q=80' },
  ],
  Plum: [
    { label: 'Plum Hitam Manis Impor Segar', url: 'https://images.unsplash.com/photo-1527325678964-54921661f888?auto=format&fit=crop&w=800&q=80' },
    { label: 'Plum Merah Merona Segar', url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80' },
  ],
};

export const FruitPhotoUploadModal: React.FC<FruitPhotoUploadModalProps> = ({
  isOpen,
  onClose,
  fruit,
  onSave,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'url' | 'presets'>('upload');
  const [currentPreview, setCurrentPreview] = useState<string>('');
  const [urlInput, setUrlInput] = useState<string>('');
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const [fileDetails, setFileDetails] = useState<{ name: string; sizeKB: number } | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [showSavedFeedback, setShowSavedFeedback] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (fruit) {
      setCurrentPreview(fruit.image || '');
      setUrlInput(fruit.image || '');
      setFileDetails(null);
      setShowSavedFeedback(false);
    }
  }, [fruit, isOpen]);

  if (!isOpen || !fruit) return null;

  const handleProcessFile = async (file: File) => {
    if (!file) return;

    // Check if image
    if (!file.type.startsWith('image/')) {
      alert('Mohon pilih file gambar yang valid (JPG, PNG, WebP, dsb).');
      return;
    }

    try {
      setIsCompressing(true);
      // Auto compress to lightweight webp/jpeg data URL (max 80-130KB) so localStorage doesn't hit quota
      const compressedDataUrl = await compressImageFile(file, {
        maxWidth: 800,
        maxHeight: 800,
        quality: 0.76,
        maxSizeKB: 130,
      });

      const approxSizeKB = Math.round((compressedDataUrl.length * 3) / 4 / 1024);
      setFileDetails({
        name: file.name,
        sizeKB: approxSizeKB,
      });
      setCurrentPreview(compressedDataUrl);
      setUrlInput(compressedDataUrl);
    } catch (err) {
      console.error('Error compressing fruit photo:', err);
      alert('Gagal memproses foto buah. Silakan coba file lain atau masukkan tautan URL.');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleApplyUrl = () => {
    if (!urlInput.trim()) return;
    setCurrentPreview(urlInput.trim());
    setFileDetails(null);
  };

  const handleSelectPreset = (url: string) => {
    setCurrentPreview(url);
    setUrlInput(url);
    setFileDetails(null);
  };

  const handleResetDefault = () => {
    setCurrentPreview(fruit.image);
    setUrlInput(fruit.image);
    setFileDetails(null);
  };

  const handleSave = () => {
    let finalImage = currentPreview;
    if (activeTab === 'url' && urlInput.trim()) {
      finalImage = urlInput.trim();
    }

    if (!finalImage) {
      alert('Foto buah tidak boleh kosong.');
      return;
    }

    onSave(finalImage);
    setShowSavedFeedback(true);
    setTimeout(() => {
      setShowSavedFeedback(false);
      onClose();
    }, 700);
  };

  const categoryPresets = (fruit.category && CURATED_FRUIT_PRESETS[fruit.category]) || 
    CURATED_FRUIT_PRESETS['Anggur'];

  const hasChanged = currentPreview !== fruit.image;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl border border-[#E2EBD8] shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E2EBD8] bg-[#F7FAF5] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E8F5E4] text-[#087F23] flex items-center justify-center font-bold text-lg shrink-0 shadow-2xs">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                {fruit.code && (
                  <span className="font-mono text-[10px] font-black bg-[#17331D] text-[#FFD54F] px-2 py-0.5 rounded-md">
                    KODE: #{fruit.code}
                  </span>
                )}
                {fruit.category && (
                  <span className="text-[10px] font-bold bg-[#E8F5E4] text-[#087F23] px-2 py-0.5 rounded-md">
                    {fruit.categoryEmoji || '🍎'} {fruit.category}
                  </span>
                )}
              </div>
              <h2 className="text-base sm:text-lg font-black text-[#17331D] line-clamp-1 mt-0.5">
                Upload & Ganti Foto: {fruit.name}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* Tab Navigation */}
          <div className="flex items-center gap-1.5 p-1 bg-[#F0F7EC] rounded-2xl border border-[#CDE0C4]">
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'upload'
                  ? 'bg-white text-[#087F23] shadow-xs'
                  : 'text-[#6B7D70] hover:text-[#17331D]'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Unggah File / Kamera</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('url')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'url'
                  ? 'bg-white text-[#087F23] shadow-xs'
                  : 'text-[#6B7D70] hover:text-[#17331D]'
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>Tautan URL Gambar</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('presets')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'presets'
                  ? 'bg-white text-[#087F23] shadow-xs'
                  : 'text-[#6B7D70] hover:text-[#17331D]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Koleksi Foto HD</span>
            </button>
          </div>

          {/* TAB 1: Upload File / Camera */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
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

              {/* Drag and Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-3xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
                  isDragOver
                    ? 'border-[#087F23] bg-[#E8F5E4]/50 scale-[1.01]'
                    : 'border-[#CDE0C4] hover:border-[#087F23] bg-[#F7FAF5] hover:bg-[#F0F7EC]/50'
                }`}
              >
                {isCompressing ? (
                  <div className="py-6 flex flex-col items-center gap-2">
                    <Loader2 className="w-8 h-8 text-[#087F23] animate-spin" />
                    <span className="text-xs font-bold text-[#17331D]">
                      Mengoptimalkan & mengompres foto buah...
                    </span>
                    <span className="text-[10px] text-gray-500">
                      Menyesuaikan ukuran agar cepat dimuat & hemat memori
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="w-14 h-14 rounded-2xl bg-white shadow-xs border border-[#CDE0C4] flex items-center justify-center text-[#087F23]">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#17331D]">
                        Tarik & Lepaskan Foto Buah ke Sini
                      </h4>
                      <p className="text-xs text-gray-500 mt-0.5">
                        atau klik untuk memilih foto dari galeri komputer / smartphone
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          fileInputRef.current?.click();
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-white border border-[#CDE0C4] hover:border-[#087F23] text-xs font-bold text-[#17331D] flex items-center gap-1.5 shadow-2xs"
                      >
                        <ImageIcon className="w-3.5 h-3.5 text-[#087F23]" />
                        <span>Pilih dari Galeri</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          cameraInputRef.current?.click();
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-white border border-[#CDE0C4] hover:border-[#087F23] text-xs font-bold text-[#17331D] flex items-center gap-1.5 shadow-2xs"
                      >
                        <Camera className="w-3.5 h-3.5 text-[#087F23]" />
                        <span>Ambil dari Kamera HP</span>
                      </button>
                    </div>

                    <span className="text-[10px] text-gray-400">
                      Mendukung format JPG, PNG, WEBP (Otomatis dikompres secara instan)
                    </span>
                  </>
                )}
              </div>

              {fileDetails && (
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="font-bold text-[#17331D] line-clamp-1">{fileDetails.name}</span>
                  </div>
                  <span className="font-mono text-[10px] font-bold text-[#087F23] bg-white px-2 py-0.5 rounded-md border border-emerald-200">
                    {fileDetails.sizeKB} KB (Ringan)
                  </span>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: URL Input */}
          {activeTab === 'url' && (
            <div className="space-y-3">
              <label className="block text-xs font-bold text-[#17331D]">
                Masukkan Alamat URL Foto Gambar Buah:
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="flex-1 text-xs font-mono px-3.5 py-2.5 rounded-xl border border-[#CDE0C4] bg-[#F7FAF5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#087F23]"
                />
                <button
                  type="button"
                  onClick={handleApplyUrl}
                  className="px-4 py-2 rounded-xl bg-[#087F23] hover:bg-[#06631B] text-white text-xs font-bold transition-colors"
                >
                  Terapkan
                </button>
              </div>
              <p className="text-[10px] text-gray-500">
                Gunakan tautan gambar langsung (URL gambar dengan ekstensi .jpg, .png, atau dari Unsplash / CDN toko Anda).
              </p>
            </div>
          )}

          {/* TAB 3: Curated Fruit Presets */}
          {activeTab === 'presets' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#17331D]">
                  Pilihan Foto Berkualitas Tinggi untuk Kategori {fruit.category || 'Buah'}:
                </span>
                <span className="text-[10px] text-gray-500">Klik untuk langsung memilih</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {categoryPresets.map((preset, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSelectPreset(preset.url)}
                    className={`group relative rounded-2xl overflow-hidden border-2 cursor-pointer transition-all aspect-square bg-gray-50 ${
                      currentPreview === preset.url
                        ? 'border-[#087F23] shadow-md ring-2 ring-[#087F23]/20 scale-102'
                        : 'border-[#E2EBD8] hover:border-[#087F23]'
                    }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.label}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2">
                      <span className="text-[9.5px] font-bold text-white line-clamp-2 leading-tight">
                        {preset.label}
                      </span>
                    </div>
                    {currentPreview === preset.url && (
                      <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[#087F23] text-white flex items-center justify-center shadow-xs">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comparison / Live Preview Box */}
          <div className="bg-[#F7FAF5] p-4 rounded-3xl border border-[#CDE0C4] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-[#17331D] flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-[#087F23]" />
                <span>Pratinjau Tampilan Foto Buah</span>
              </span>
              {hasChanged && (
                <button
                  type="button"
                  onClick={handleResetDefault}
                  className="text-[10px] font-bold text-[#E53935] hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Kembalikan Foto Awal</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              {/* Current/Old Photo */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                  Foto Saat Ini di Sistem:
                </span>
                <div className="w-full h-36 rounded-2xl overflow-hidden border border-[#CDE0C4] bg-white relative">
                  <img
                    src={fruit.image}
                    alt="Foto Asli"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-2 left-2 text-[9px] font-bold bg-black/60 text-white px-2 py-0.5 rounded backdrop-blur-2xs">
                    Asal
                  </span>
                </div>
              </div>

              {/* New Photo Preview */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-[#087F23] uppercase tracking-wider block flex items-center gap-1">
                  <span>Foto Baru Terpilih</span>
                  {hasChanged && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>}
                </span>
                <div className={`w-full h-36 rounded-2xl overflow-hidden border-2 bg-white relative ${
                  hasChanged ? 'border-[#087F23] shadow-md' : 'border-[#CDE0C4]'
                }`}>
                  <img
                    src={currentPreview}
                    alt="Pratinjau Baru"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                    <span className="text-[9px] font-bold bg-[#087F23] text-white px-2 py-0.5 rounded shadow-2xs">
                      {hasChanged ? '✨ Siap Diperbarui' : 'Sama dengan aslinya'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-[#E2EBD8] bg-white flex items-center justify-between">
          <div className="text-[11px] text-[#6B7D70]">
            {hasChanged ? (
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Foto telah diubah, klik Simpan untuk menerapkan
              </span>
            ) : (
              <span>Pilih foto baru dari file, tautan, atau koleksi di atas</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#CDE0C4] text-xs font-bold text-[#17331D] hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isCompressing}
              className={`px-6 py-2.5 rounded-xl text-xs font-black shadow-md flex items-center gap-2 transition-all ${
                showSavedFeedback
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#087F23] hover:bg-[#06631B] text-white hover:scale-102'
              }`}
            >
              {showSavedFeedback ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Foto Berhasil Disimpan!</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Simpan Perubahan Foto</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
