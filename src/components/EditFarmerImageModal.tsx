import React, { useState, useEffect } from 'react';
import { X, Upload, Link, Check, RotateCcw, Image as ImageIcon, Sparkles, Loader2, CheckCircle2 } from 'lucide-react';
import { compressImageFile } from '../utils/imageCompressor';

interface EditFarmerImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentImageUrl: string;
  onSave: (newImageUrl: string) => void;
}

const PRESET_FARMER_IMAGES = [
  {
    name: 'Petani Rambutan Lokal (Pilihan Utama)',
    url: '/petani_rambutan.jpg',
    desc: 'Petani caping memanen rambutan kebun segar di keranjang bambu',
  },
  {
    name: 'Petani Kebun Jeruk Nusantara',
    url: 'https://images.unsplash.com/photo-1592417817098-8f3d69109853?auto=format&fit=crop&w=800&q=80',
    desc: 'Petani tersenyum di hamparan kebun jeruk segar',
  },
  {
    name: 'Petani Kebun Hortikultura & Buah Segar',
    url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
    desc: 'Hasil panen buah segar berkualitas tinggi langsung dari kebun',
  },
  {
    name: 'Pemetikan Stroberi Dataran Tinggi',
    url: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=800&q=80',
    desc: 'Pemetikan buah berry segar di kebun kemitraan agrowisata',
  },
];

export const EditFarmerImageModal: React.FC<EditFarmerImageModalProps> = ({
  isOpen,
  onClose,
  currentImageUrl,
  onSave,
}) => {
  const [imageUrl, setImageUrl] = useState<string>(currentImageUrl || '/petani_rambutan.jpg');
  const [mode, setMode] = useState<'upload' | 'url' | 'presets'>('upload');
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  // Sync state whenever modal is opened or currentImageUrl changes
  useEffect(() => {
    if (isOpen) {
      setImageUrl(currentImageUrl || '/petani_rambutan.jpg');
      setUploadedFileName(null);
      setShowSavedToast(false);
    }
  }, [isOpen, currentImageUrl]);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsCompressing(true);
      // Auto-compress photo to avoid localStorage quota exceeded error and fit Firestore
      const compressedDataUrl = await compressImageFile(file, {
        maxWidth: 900,
        maxHeight: 700,
        quality: 0.72,
        maxSizeKB: 140,
      });
      setImageUrl(compressedDataUrl);
      setUploadedFileName(file.name);
      onSave(compressedDataUrl);
      setShowSavedToast(true);
    } catch (err: unknown) {
      console.error('Compress error:', err);
      alert('Gagal mengompres foto. Silakan coba foto lain atau gunakan tautan URL.');
    } finally {
      setIsCompressing(false);
      // Reset input value so re-selecting same file works
      e.target.value = '';
    }
  };

  const handleResetDefault = () => {
    setImageUrl('/petani_rambutan.jpg');
    setUploadedFileName(null);
  };

  const handleSave = () => {
    onSave(imageUrl);
    setShowSavedToast(true);
    setTimeout(() => {
      setShowSavedToast(false);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-[#E2EBD8] overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header Modal */}
        <div className="px-6 py-4 border-b border-[#E2EBD8] bg-[#F7FAF5] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#087F23]/10 flex items-center justify-center text-[#087F23]">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-[#17331D]">
                📷 Ganti Foto Petani & Profil Kebun
              </h2>
              <p className="text-[11px] text-[#6B7D70]">
                Unggah foto dari perangkat Anda atau masukkan tautan gambar
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#6B7D70] hover:text-[#17331D] hover:bg-white rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          
          {/* Live Preview */}
          <div>
            <label className="block text-xs font-bold text-[#17331D] mb-1.5">
              Pratinjau Foto Tampilan Beranda:
            </label>
            <div className="relative rounded-2xl overflow-hidden border-2 border-[#CDE0C4] bg-gray-50 h-52 sm:h-64 shadow-inner flex items-center justify-center">
              <img
                src={imageUrl}
                alt="Pratinjau Petani Buah"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/petani_rambutan.jpg';
                }}
              />
              <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[11px] px-3 py-1.5 rounded-lg flex items-center justify-between">
                <span className="font-semibold">Petani Buah Kemitraan Global Fresh Indo</span>
                <span className="text-[10px] text-[#FFD54F]">Rasio Asli Tampil Otomatis</span>
              </div>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="grid grid-cols-3 gap-1 bg-[#F0F7EC] p-1 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setMode('upload')}
              className={`py-2 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                mode === 'upload' ? 'bg-[#087F23] text-white shadow-xs' : 'text-[#17331D] hover:bg-white'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload File</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('url')}
              className={`py-2 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                mode === 'url' ? 'bg-[#087F23] text-white shadow-xs' : 'text-[#17331D] hover:bg-white'
              }`}
            >
              <Link className="w-3.5 h-3.5" />
              <span>Tautan URL</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('presets')}
              className={`py-2 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                mode === 'presets' ? 'bg-[#087F23] text-white shadow-xs' : 'text-[#17331D] hover:bg-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Foto Pilihan</span>
            </button>
          </div>

          {/* Mode: Upload File */}
          {mode === 'upload' && (
            <div className="p-4 border-2 border-dashed border-[#CDE0C4] rounded-2xl bg-[#F7FAF5] text-center space-y-2">
              <Upload className="w-8 h-8 text-[#087F23] mx-auto" />
              <div>
                <p className="text-xs font-bold text-[#17331D]">
                  Pilih foto dari Galeri HP atau Folder Komputer
                </p>
                <p className="text-[11px] text-[#6B7D70]">
                  Format JPG, PNG, atau WEBP (Maksimal 5 MB)
                </p>
              </div>
              <label className={`inline-flex items-center gap-2 cursor-pointer bg-[#087F23] hover:bg-[#06631B] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-xs ${isCompressing ? 'opacity-70 pointer-events-none' : ''}`}>
                {isCompressing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Mengompres & Menyiapkan Foto...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" />
                    <span>Pilih Foto dari Perangkat</span>
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

              {uploadedFileName && (
                <div className="flex items-center justify-center gap-1.5 text-xs text-[#087F23] font-bold bg-[#E8F5E4] py-1.5 px-3 rounded-lg border border-[#CDE0C4]">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate max-w-xs">Foto Siap: {uploadedFileName}</span>
                </div>
              )}
            </div>
          )}

          {/* Mode: Tautan URL */}
          {mode === 'url' && (
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#17331D]">
                Masukkan Alamat URL Foto:
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#CDE0C4] bg-white focus:outline-none focus:ring-2 focus:ring-[#087F23]"
              />
              <p className="text-[10.5px] text-[#6B7D70]">
                Tips: Anda dapat menempelkan URL gambar langsung dari hosting web atau penyedia foto.
              </p>
            </div>
          )}

          {/* Mode: Foto Pilihan / Presets */}
          {mode === 'presets' && (
            <div className="space-y-2.5">
              <label className="block text-xs font-bold text-[#17331D]">
                Pilih Dari Galeri Rekomendasi:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto p-1">
                {PRESET_FARMER_IMAGES.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setImageUrl(preset.url)}
                    className={`flex items-center gap-2.5 p-2 rounded-xl border text-left transition-all ${
                      imageUrl === preset.url
                        ? 'border-[#087F23] bg-[#E8F5E4] ring-2 ring-[#087F23]/30'
                        : 'border-[#E2EBD8] bg-white hover:border-[#087F23]'
                    }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 object-cover rounded-lg shrink-0 border border-gray-100"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-bold text-[#17331D] truncate">{preset.name}</p>
                      <p className="text-[9.5px] text-[#6B7D70] line-clamp-1">{preset.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-[#E2EBD8] bg-[#F7FAF5] flex items-center justify-between">
          <button
            type="button"
            onClick={handleResetDefault}
            className="flex items-center gap-1.5 text-[11px] font-bold text-[#6B7D70] hover:text-[#087F23] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Bawaan (Foto Petani Rambutan)</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-[#6B7D70] hover:text-[#17331D] rounded-xl"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2.5 bg-[#087F23] hover:bg-[#06631B] text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 transition-all hover:scale-102"
            >
              {showSavedToast ? <Check className="w-4 h-4" /> : null}
              <span>{showSavedToast ? 'Tersimpan!' : 'Simpan Foto'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
