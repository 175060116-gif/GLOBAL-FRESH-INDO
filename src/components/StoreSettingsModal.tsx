import React, { useState, useEffect } from 'react';
import { StoreSettings, DEFAULT_STORE_SETTINGS } from '../data/storeSettings';
import { 
  X, Upload, RotateCcw, Check, Store, Phone, 
  MapPin, Clock, Image as ImageIcon, Lock, EyeOff, Eye, Key, Sparkles, Loader2,
  Globe, ExternalLink, Copy
} from 'lucide-react';
import { compressImageFile } from '../utils/imageCompressor';

interface StoreSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: StoreSettings;
  onSave: (newSettings: StoreSettings) => void;
}

export const StoreSettingsModal: React.FC<StoreSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave,
}) => {
  const [formData, setFormData] = useState<StoreSettings>({ ...settings });
  const [logoMode, setLogoMode] = useState<'url' | 'upload'>('url');
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [isCompressingLogo, setIsCompressingLogo] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({ ...settings });
      setShowSavedToast(false);
    }
  }, [isOpen, settings]);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsCompressingLogo(true);
      // Auto-compress logo to small size (~30-60KB) to prevent localStorage quota issues
      const compressedLogo = await compressImageFile(file, {
        maxWidth: 400,
        maxHeight: 400,
        quality: 0.8,
        maxSizeKB: 60,
      });
      setFormData(prev => ({ ...prev, logoUrl: compressedLogo }));
    } catch (err: unknown) {
      console.error('Logo compress error:', err);
      alert('Gagal memproses logo. Silakan gunakan file gambar lain.');
    } finally {
      setIsCompressingLogo(false);
      e.target.value = '';
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm('Kembalikan logo dan informasi toko ke pengaturan standar Global Fresh Indo?')) {
      setFormData({ ...DEFAULT_STORE_SETTINGS });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setShowSavedToast(true);
    setTimeout(() => {
      setShowSavedToast(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-[#E2EBD8] overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header Modal */}
        <div className="px-6 py-4 border-b border-[#E2EBD8] bg-[#F7FAF5] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#087F23]/10 flex items-center justify-center text-[#087F23]">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-[#17331D]">
                ⚙️ Sesuaikan Logo & Identitas Toko
              </h2>
              <p className="text-[11px] text-[#6B7D70]">
                Ubah logo, nama toko, nomor WhatsApp, dan informasi operasional
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          
          {/* Section: Logo Toko */}
          <div className="bg-[#F0F7EC] p-4 rounded-2xl border border-[#CDE0C4] space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-[#087F23] uppercase tracking-wider flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-[#087F23]" />
                Foto / Logo Toko
              </label>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setLogoMode('url')}
                  className={`text-[10px] font-bold px-2 py-1 rounded-md transition-colors ${
                    logoMode === 'url' ? 'bg-[#087F23] text-white' : 'bg-white text-[#6B7D70]'
                  }`}
                >
                  Link URL
                </button>
                <button
                  type="button"
                  onClick={() => setLogoMode('upload')}
                  className={`text-[10px] font-bold px-2 py-1 rounded-md transition-colors ${
                    logoMode === 'upload' ? 'bg-[#087F23] text-white' : 'bg-white text-[#6B7D70]'
                  }`}
                >
                  Upload File
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Preview Box */}
              <div className="w-20 h-20 rounded-2xl bg-white border-2 border-[#087F23] p-1 shadow-xs flex items-center justify-center shrink-0 overflow-hidden">
                <img
                  src={formData.logoUrl || '/global_fresh_logo.jpg'}
                  alt="Preview Logo Toko"
                  className="w-full h-full object-contain rounded-xl"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/global_fresh_logo.jpg';
                  }}
                />
              </div>

              <div className="flex-1 space-y-2">
                {logoMode === 'url' ? (
                  <input
                    type="text"
                    value={formData.logoUrl || ''}
                    onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                    placeholder="https://... atau /global_fresh_logo.jpg"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-[#CDE0C4] bg-white focus:outline-none focus:ring-2 focus:ring-[#087F23]"
                  />
                ) : (
                  <label className={`flex items-center justify-center gap-2 border-2 border-dashed border-[#087F23]/50 hover:border-[#087F23] bg-white rounded-xl p-2.5 cursor-pointer transition-colors text-center ${isCompressingLogo ? 'opacity-70 pointer-events-none' : ''}`}>
                    {isCompressingLogo ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-[#087F23]" />
                        <span className="text-xs font-bold text-[#17331D]">Mengoptimalkan Logo...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 text-[#087F23]" />
                        <span className="text-xs font-bold text-[#17331D]">Unggah Logo Baru (PNG/JPG)</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={isCompressingLogo}
                      className="hidden"
                    />
                  </label>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#6B7D70]">
                    Logo akan langsung tampil di navbar, footer, dan seluruh aplikasi.
                  </span>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, logoUrl: '/global_fresh_logo.jpg' })}
                    className="text-[10px] text-[#087F23] hover:underline font-bold"
                  >
                    Pakai Logo Asli
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Nama Toko & Slogan */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-[#17331D] mb-1">
                Nama Toko / Merek Buah
              </label>
              <input
                type="text"
                required
                value={formData.storeName}
                onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                placeholder="GLOBAL FRESH INDO"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#CDE0C4] bg-white font-black text-[#087F23] text-sm focus:outline-none focus:ring-2 focus:ring-[#087F23]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#17331D] mb-1">
                  Tagline Toko
                </label>
                <input
                  type="text"
                  value={formData.storeTagline}
                  onChange={(e) => setFormData({ ...formData, storeTagline: e.target.value })}
                  placeholder="Toko Buah Segar & Distributor Buah Segar"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-[#CDE0C4] bg-white focus:outline-none focus:ring-2 focus:ring-[#087F23]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17331D] mb-1">
                  Slogan Pelayanan
                </label>
                <input
                  type="text"
                  value={formData.storeSlogan}
                  onChange={(e) => setFormData({ ...formData, storeSlogan: e.target.value })}
                  placeholder="Fresh Fruits • Fresh Quality • Fresh Delivery"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-[#CDE0C4] bg-white focus:outline-none focus:ring-2 focus:ring-[#087F23]"
                />
              </div>
            </div>
          </div>

          {/* Section: Kontak & Lokasi */}
          <div className="space-y-3 pt-2 border-t border-[#E2EBD8]">
            <h3 className="text-xs font-black text-[#087F23] uppercase tracking-wider">
              Kontak WhatsApp & Lokasi Toko
            </h3>

            <div>
              <label className="block text-xs font-bold text-[#17331D] mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#25D366]" />
                Nomor WhatsApp Pesanan & CS (Format Internasional: 628...)
              </label>
              <input
                type="text"
                required
                value={formData.whatsappNumber}
                onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value.replace(/[^0-9]/g, '') })}
                placeholder="6285284633214"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#CDE0C4] bg-white font-mono font-bold text-[#17331D] focus:outline-none focus:ring-2 focus:ring-[#25D366]"
              />
              <span className="text-[10px] text-[#6B7D70] mt-0.5 block">
                Semua tombol checkout WA dan chat bantuan akan terhubung otomatis ke nomor ini.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#17331D] mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#087F23]" />
                  Alamat Gudang / Toko
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Jl. Raya Cilaku No. 88"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-[#CDE0C4] bg-white focus:outline-none focus:ring-2 focus:ring-[#087F23]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17331D] mb-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#FF7F00]" />
                  Jam Operasional
                </label>
                <input
                  type="text"
                  value={formData.operatingHours}
                  onChange={(e) => setFormData({ ...formData, operatingHours: e.target.value })}
                  placeholder="Setiap Hari 07.00 - 21.00 WIB"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-[#CDE0C4] bg-white focus:outline-none focus:ring-2 focus:ring-[#087F23]"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Privasi & Penyembunyian Menu Login */}
          <div className="space-y-3 bg-[#F0F7EC] p-4 rounded-2xl border border-[#CDE0C4]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#087F23] text-white flex items-center justify-center">
                  <Lock className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-[#17331D]">
                    4. Privasi & Penyembunyian Menu Login Pengelola
                  </h3>
                  <p className="text-[10.5px] text-[#6B7D70]">
                    Cegah pengunjung/kostumer mengetahui adanya akses login admin
                  </p>
                </div>
              </div>
            </div>

            <label className="flex items-start gap-3 p-3 bg-white rounded-xl border border-[#CDE0C4] cursor-pointer hover:border-[#087F23] transition-colors">
              <input
                type="checkbox"
                checked={formData.hideLoginMenu ?? true}
                onChange={(e) => setFormData({ ...formData, hideLoginMenu: e.target.checked })}
                className="mt-0.5 w-4 h-4 text-[#087F23] rounded focus:ring-[#087F23] border-gray-300"
              />
              <div className="text-xs">
                <span className="font-bold text-[#17331D] block">
                  Sembunyikan Menu Login Pengelola dari Tampilan Web (Rekomendasi)
                </span>
                <span className="text-[11px] text-[#6B7D70] leading-relaxed block mt-0.5">
                  Tombol &quot;Login Pengelola&quot; di Navbar dan Footer akan dihapus total. Kostumer hanya melihat katalog murni tanpa ada menu login.
                </span>
              </div>
            </label>

            {/* Secret Login Instructions for Store Owner */}
            <div className="p-3 bg-white/80 rounded-xl border border-[#DCEBD5] text-[11px] text-[#17331D] space-y-1.5">
              <div className="font-bold text-[#087F23] flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5" />
                <span>3 Cara Rahasia Pemilik Toko Membuka Login saat Disembunyikan:</span>
              </div>
              <ul className="space-y-1 text-[#455A64] pl-5 list-disc">
                <li>
                  <strong className="text-[#17331D]">Klik Logo 3x Cepat (Triple-Click)</strong>: Ketuk atau klik logo toko di pojok kiri atas sebanyak 3 kali berturut-turut.
                </li>
                <li>
                  <strong className="text-[#17331D]">Tombol Pintas Keyboard</strong>: Tekan kombinasi <kbd className="bg-gray-100 border border-gray-300 px-1 py-0.5 rounded text-[10px] font-mono">Ctrl</kbd> + <kbd className="bg-gray-100 border border-gray-300 px-1 py-0.5 rounded text-[10px] font-mono">Shift</kbd> + <kbd className="bg-gray-100 border border-gray-300 px-1 py-0.5 rounded text-[10px] font-mono">A</kbd> di keyboard Anda.
                </li>
                <li>
                  <strong className="text-[#17331D]">Akses Tautan #admin</strong>: Tambahkan <code className="bg-[#E8F5E4] text-[#087F23] px-1 py-0.5 rounded font-mono text-[10px]">#admin</code> di akhir alamat browser.
                </li>
              </ul>
            </div>
          </div>

          {/* Section 5: Integrasi Google Search Console & SEO */}
          <div className="space-y-3 pt-3 border-t border-[#E2EBD8]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#087F23]/10 flex items-center justify-center text-[#087F23]">
                  <Globe className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-[#17331D]">
                    5. Integrasi Google Search Console & SEO
                  </h3>
                  <p className="text-[10.5px] text-[#6B7D70]">
                    Daftarkan website ke Google agar terindeks di mesin pencari
                  </p>
                </div>
              </div>
              <a
                href="https://search.google.com/search-console/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10.5px] font-bold text-[#087F23] hover:underline flex items-center gap-1 bg-[#E8F5E4] px-2.5 py-1 rounded-lg"
              >
                <span>Buka Search Console</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="bg-[#F7FAF5] p-3 rounded-2xl border border-[#CDE0C4] space-y-2.5">
              <div>
                <label className="block text-xs font-bold text-[#17331D] mb-1">
                  Kode Tag Verifikasi Google (HTML Tag)
                </label>
                <input
                  type="text"
                  value={formData.googleVerificationTag || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    const match = val.match(/content=["']([^"']+)["']/i);
                    const cleaned = match ? match[1] : val.trim().replace(/^google-site-verification=\s*/i, '');
                    setFormData({ ...formData, googleVerificationTag: cleaned });
                  }}
                  placeholder="Contoh: vL1X_AbCdE123456789 atau tempel seluruh tag meta..."
                  className="w-full text-xs px-3 py-2 rounded-xl border border-[#CDE0C4] bg-white font-mono text-[#17331D] focus:outline-none focus:ring-2 focus:ring-[#087F23]"
                />
                <span className="text-[10px] text-[#6B7D70] mt-1 block">
                  Tempel kode verifikasi Google Anda di sini. Tag meta di halaman web akan diperbarui secara otomatis.
                </span>
              </div>

              {/* URL & Sitemap Info with 1-click copy */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <div className="bg-white p-2.5 rounded-xl border border-[#E2EBD8]">
                  <span className="text-[10px] font-bold text-[#6B7D70] block">URL Website Anda:</span>
                  <div className="flex items-center justify-between gap-1 mt-0.5">
                    <span className="font-mono text-[10px] text-[#17331D] truncate select-all">https://global-fresh-indo.vercel.app</span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText('https://global-fresh-indo.vercel.app');
                        alert('URL website berhasil disalin: https://global-fresh-indo.vercel.app');
                      }}
                      className="text-[#087F23] hover:text-[#06631B] p-1 rounded hover:bg-[#E8F5E4]"
                      title="Salin URL"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-[#E2EBD8]">
                  <span className="text-[10px] font-bold text-[#6B7D70] block">Peta Situs (Sitemap):</span>
                  <div className="flex items-center justify-between gap-1 mt-0.5">
                    <span className="font-mono text-[10px] text-[#17331D] truncate select-all">sitemap.xml</span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText('https://global-fresh-indo.vercel.app/sitemap.xml');
                        alert('URL Sitemap berhasil disalin: https://global-fresh-indo.vercel.app/sitemap.xml');
                      }}
                      className="text-[#087F23] hover:text-[#06631B] p-1 rounded hover:bg-[#E8F5E4]"
                      title="Salin Sitemap URL"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </form>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-[#E2EBD8] bg-[#F7FAF5] flex items-center justify-between">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="flex items-center gap-1 text-[11px] font-bold text-[#6B7D70] hover:text-[#E53935]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Standar</span>
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
              onClick={handleSubmit}
              className="px-5 py-2.5 bg-[#087F23] hover:bg-[#06631B] text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 transition-all hover:scale-102"
            >
              {showSavedToast ? <Check className="w-4 h-4" /> : null}
              <span>{showSavedToast ? 'Tersimpan!' : 'Terapkan Perubahan'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
