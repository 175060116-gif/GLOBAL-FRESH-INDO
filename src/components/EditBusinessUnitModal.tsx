import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Upload, Image as ImageIcon, Check, RotateCcw, 
  Sparkles, ShieldCheck, Tag, FileText, CheckCircle2, Loader2 
} from 'lucide-react';
import { BusinessUnitCard, DEFAULT_BUSINESS_UNITS } from '../data/businessUnits';
import { compressImageFile } from '../utils/imageCompressor';

interface EditBusinessUnitModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: BusinessUnitCard | null;
  onSave: (updated: BusinessUnitCard) => void;
}

const PRESET_PHOTOS = [
  {
    name: 'Chef Resto & Buah (Bawaan)',
    url: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Dapur Komersial & Bahan Segar',
    url: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Gudang & Peti Buah Segar',
    url: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Buffet Buah Segar Hotel Mewah',
    url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Resto Dining & Buah Potong Higienis',
    url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Ibu & Anak di Dapur Ritel',
    url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
  },
];

export const EditBusinessUnitModal: React.FC<EditBusinessUnitModalProps> = ({
  isOpen,
  onClose,
  card,
  onSave,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [badgeLeft, setBadgeLeft] = useState('');
  const [badgeRight, setBadgeRight] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [checklist1, setChecklist1] = useState('');
  const [checklist2, setChecklist2] = useState('');
  const [checklist3, setChecklist3] = useState('');
  const [actionLabel, setActionLabel] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isCompressing, setIsCompressing] = useState(false);

  useEffect(() => {
    if (card) {
      setTitle(card.title || '');
      setBadgeLeft(card.badgeLeft || '');
      setBadgeRight(card.badgeRight || '');
      setDescription(card.description || '');
      setImageUrl(card.imageUrl || '');
      setChecklist1(card.checklist?.[0] || '');
      setChecklist2(card.checklist?.[1] || '');
      setChecklist3(card.checklist?.[2] || '');
      setActionLabel(card.actionLabel || '');
      setSuccessMessage('');
    }
  }, [card]);

  if (!isOpen || !card) return null;

  // Handle local file upload with auto-compression to avoid localStorage quota exceeded
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsCompressing(true);
      const compressed = await compressImageFile(file, {
        maxWidth: 800,
        maxHeight: 600,
        quality: 0.75,
        maxSizeKB: 120,
      });
      setImageUrl(compressed);
    } catch (err: unknown) {
      console.error('Error compressing unit photo:', err);
      alert('Gagal memproses gambar. Silakan gunakan file lain atau gunakan tautan URL.');
    } finally {
      setIsCompressing(false);
      e.target.value = '';
    }
  };

  const handleResetToDefault = () => {
    const defaultCard = DEFAULT_BUSINESS_UNITS.find((u) => u.id === card.id);
    if (defaultCard) {
      setTitle(defaultCard.title);
      setBadgeLeft(defaultCard.badgeLeft);
      setBadgeRight(defaultCard.badgeRight || '');
      setDescription(defaultCard.description);
      setImageUrl(defaultCard.imageUrl);
      setChecklist1(defaultCard.checklist?.[0] || '');
      setChecklist2(defaultCard.checklist?.[1] || '');
      setChecklist3(defaultCard.checklist?.[2] || '');
      setActionLabel(defaultCard.actionLabel);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: BusinessUnitCard = {
      ...card,
      title: title.trim(),
      badgeLeft: badgeLeft.trim(),
      badgeRight: badgeRight.trim() || undefined,
      description: description.trim(),
      imageUrl: imageUrl.trim(),
      checklist: [checklist1, checklist2, checklist3].filter(Boolean),
      actionLabel: actionLabel.trim() || card.actionLabel,
    };

    onSave(updated);
    setSuccessMessage('Berhasil disimpan!');
    setTimeout(() => {
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-[#E2EBD8] overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-[#17331D] text-white px-6 py-4 flex items-center justify-between border-b border-green-800 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#FFD54F] text-[#17331D] text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                Mode Pengelola (Admin)
              </span>
              <span className="text-xs text-green-200">
                Pilar: {card.id.toUpperCase()}
              </span>
            </div>
            <h2 className="text-lg font-black text-white mt-1">
              Kustom Foto & Teks Unit Bisnis
            </h2>
          </div>

          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-xs text-[#17331D]">
          
          {/* Live Preview Image & Upload Area */}
          <div className="space-y-3 bg-[#F7FAF5] p-4 rounded-2xl border border-[#E2EBD8]">
            <label className="block text-xs font-black text-[#17331D]">
              1. Foto / Gambar Kartu Layanan
            </label>

            {/* Preview Box */}
            <div className="relative h-48 w-full rounded-2xl overflow-hidden bg-gray-200 border border-gray-300 shadow-inner group">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={title || 'Preview foto'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                  <ImageIcon className="w-10 h-10 mb-2 opacity-50" />
                  <span className="text-xs font-semibold">Belum ada foto</span>
                </div>
              )}

              {/* Overlaid Badges Preview */}
              <div className="absolute top-3 left-3 bg-white/95 text-[#17331D] text-[10px] font-bold px-3 py-1 rounded-full shadow-xs">
                {badgeLeft || 'Badge Kiri'}
              </div>
              {badgeRight && (
                <div className="absolute top-3 right-3 bg-[#087F23] text-white text-[9.5px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
                  {badgeRight}
                </div>
              )}
            </div>

            {/* Upload & Preset Actions */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                disabled={isCompressing}
                onClick={() => fileInputRef.current?.click()}
                className={`px-3.5 py-2 bg-[#087F23] hover:bg-[#06631B] text-white font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs ${isCompressing ? 'opacity-70 pointer-events-none' : ''}`}
              >
                {isCompressing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Mengompres Foto...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Foto dari Perangkat (Komputer / HP)</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleResetToDefault}
                className="px-3 py-2 bg-white hover:bg-gray-100 text-[#6B7D70] font-semibold rounded-xl border border-gray-300 flex items-center gap-1.5 transition-colors"
                title="Kembalikan foto dan teks bawaan"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Foto Bawaan</span>
              </button>
            </div>

            {/* URL Input */}
            <div>
              <span className="text-[11px] font-semibold text-[#6B7D70] block mb-1">
                Atau tempelkan tautan URL gambar (https://...):
              </span>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2 bg-white rounded-xl border border-[#CDE0C4] text-xs font-mono text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#087F23]"
              />
            </div>

            {/* Preset Picker */}
            <div>
              <span className="text-[11px] font-semibold text-[#6B7D70] block mb-1.5">
                Pilihan foto cepat bertema resto & dapur:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {PRESET_PHOTOS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setImageUrl(preset.url)}
                    className={`flex items-center gap-2 p-1.5 rounded-xl border text-left transition-all ${
                      imageUrl === preset.url
                        ? 'border-[#087F23] bg-[#E8F5E4] font-bold text-[#087F23]'
                        : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.name}
                      className="w-8 h-8 rounded-lg object-cover shrink-0"
                    />
                    <span className="text-[10px] leading-tight line-clamp-2">
                      {preset.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Title & Badges */}
          <div className="space-y-3">
            <label className="block text-xs font-black text-[#17331D]">
              2. Judul & Label Layanan
            </label>

            <div>
              <span className="text-[11px] font-semibold text-[#17331D] block mb-1">
                Nama / Judul Bagian *
              </span>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Pasokan Resto, Hotel & Katering"
                className="w-full px-3.5 py-2.5 bg-[#F7FAF5] rounded-xl border border-[#CDE0C4] text-xs font-bold text-[#17331D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#087F23]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-[11px] font-semibold text-[#17331D] block mb-1">
                  Badge Kiri (Pill Putih)
                </span>
                <input
                  type="text"
                  value={badgeLeft}
                  onChange={(e) => setBadgeLeft(e.target.value)}
                  placeholder="Contoh: Grosir & Suplai B2B"
                  className="w-full px-3 py-2 bg-[#F7FAF5] rounded-xl border border-[#CDE0C4] text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#087F23]"
                />
              </div>

              <div>
                <span className="text-[11px] font-semibold text-[#17331D] block mb-1">
                  Badge Kanan (Pill Hijau - Opsional)
                </span>
                <input
                  type="text"
                  value={badgeRight}
                  onChange={(e) => setBadgeRight(e.target.value)}
                  placeholder="Contoh: PALING BANYAK DIPILIH"
                  className="w-full px-3 py-2 bg-[#F7FAF5] rounded-xl border border-[#CDE0C4] text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#087F23]"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-black text-[#17331D] mb-1">
              3. Deskripsi Penjelasan
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tuliskan keterangan lengkap mengenai unit layanan ini..."
              className="w-full px-3.5 py-2 bg-[#F7FAF5] rounded-xl border border-[#CDE0C4] text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#087F23] leading-relaxed"
            />
          </div>

          {/* 3 Checklist Items */}
          <div className="space-y-2">
            <label className="block text-xs font-black text-[#17331D]">
              4. Poin Keunggulan / Checklist (3 Poin)
            </label>

            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#087F23] shrink-0" />
              <input
                type="text"
                value={checklist1}
                onChange={(e) => setChecklist1(e.target.value)}
                placeholder="Poin 1 (contoh: Pengiriman subuh 04.00 - 08.00 WIB)"
                className="w-full px-3 py-2 bg-[#F7FAF5] rounded-xl border border-[#CDE0C4] text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#087F23]"
              />
            </div>

            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#087F23] shrink-0" />
              <input
                type="text"
                value={checklist2}
                onChange={(e) => setChecklist2(e.target.value)}
                placeholder="Poin 2 (contoh: Harga grosir khusus & kontrak berkala)"
                className="w-full px-3 py-2 bg-[#F7FAF5] rounded-xl border border-[#CDE0C4] text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#087F23]"
              />
            </div>

            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#087F23] shrink-0" />
              <input
                type="text"
                value={checklist3}
                onChange={(e) => setChecklist3(e.target.value)}
                placeholder="Poin 3 (contoh: Dedicated Account Manager khusus B2B)"
                className="w-full px-3 py-2 bg-[#F7FAF5] rounded-xl border border-[#CDE0C4] text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#087F23]"
              />
            </div>
          </div>

          {/* Action Link Label */}
          <div>
            <label className="block text-xs font-black text-[#17331D] mb-1">
              5. Teks Tautan Tombol Aksi
            </label>
            <input
              type="text"
              value={actionLabel}
              onChange={(e) => setActionLabel(e.target.value)}
              placeholder="Contoh: Daftar Akun Bisnis B2B"
              className="w-full px-3 py-2 bg-[#F7FAF5] rounded-xl border border-[#CDE0C4] text-xs font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#087F23]"
            />
          </div>

          {successMessage && (
            <div className="bg-[#E8F5E4] text-[#087F23] p-3 rounded-xl font-bold text-center flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Submit / Cancel Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 font-bold text-xs transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#087F23] hover:bg-[#06631B] text-white font-black text-xs shadow-md transition-all flex items-center gap-2 hover:scale-102"
            >
              <Check className="w-4 h-4" />
              <span>Simpan Foto & Nama</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
