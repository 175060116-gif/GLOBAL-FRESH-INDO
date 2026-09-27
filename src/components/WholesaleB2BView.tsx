import React, { useState } from 'react';
import { 
  Building2, Truck, ShieldCheck, Clock, FileText, 
  Send, CheckCircle2, ChevronRight, Phone, Download, 
  Sparkles, Award, Calculator, MessageCircle
} from 'lucide-react';
import { Product } from '../data/products';

interface WholesaleB2BViewProps {
  products: Product[];
  onAddToCart: (product: Product, qty: number) => void;
  onOpenBgnModal?: () => void;
}

export const WholesaleB2BView: React.FC<WholesaleB2BViewProps> = ({ 
  products, 
  onAddToCart,
  onOpenBgnModal,
}) => {
  const [businessName, setBusinessName] = useState('');
  const [picName, setPicName] = useState('');
  const [picPhone, setPicPhone] = useState('');
  const [businessType, setBusinessType] = useState('Restoran / Kafe');
  const [estimatedMonthlyVolume, setEstimatedMonthlyVolume] = useState('100 - 500 kg / bulan');
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>(['Apel Fuji', 'Pisang Cavendish', 'Jeruk Santang']);
  const [paymentTerms, setPaymentTerms] = useState('TOP 14 Hari');
  const [quoteSent, setQuoteSent] = useState(false);

  const wholesaleProducts = products.filter(p => p.wholesalePrice > 0);

  const handleToggleNeed = (fruitName: string) => {
    setSelectedNeeds(prev => 
      prev.includes(fruitName) ? prev.filter(x => x !== fruitName) : [...prev, fruitName]
    );
  };

  const handleSendQuotation = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = 
`*PERMINTAAN PENAWARAN GROSIR (B2B HOREKA)*
• Nama Bisnis: ${businessName}
• PIC: ${picName} (${picPhone})
• Tipe Usaha: ${businessType}
• Estimasi Kebutuhan: ${estimatedMonthlyVolume}
• Komoditas Buah: ${selectedNeeds.join(', ')}
• Skema Pembayaran yang diajukan: ${paymentTerms}

Mohon kirimkan surat penawaran harga resmi (Quotation) dan jadwal sampling buah ke tempat kami. Terima kasih!`;

    const waUrl = `https://wa.me/6285284633214?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');
    setQuoteSent(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      {/* Hero Wholesale matching Image 2 & 3 */}
      <div className="bg-gradient-to-r from-[#17331D] via-[#087F23] to-[#005500] text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/20 text-[#FFD54F] px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-4 h-4" />
            <span>SOLUSI PASOKAN BUAH HOREKA & RETAIL</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Kebutuhan Buah Bisnis Anda, Kami Siapkan.
          </h1>

          <p className="text-sm sm:text-base text-green-100 leading-relaxed max-w-2xl font-normal">
            Melayani pasokan rutin hotel berbintang, restoran, kafe juice bar, katering pesta, supermarket, 
            dan toko buah dengan standar mutu konsisten, jadwal kirim subuh, dan fasilitas tempo pembayaran resmi.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-3">
            <a
              href="#quote-form"
              className="bg-[#FF7F00] hover:bg-[#E67200] text-white px-6 py-3 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
            >
              <span>Request Harga Grosir</span>
              <ChevronRight className="w-4 h-4" />
            </a>

            <a
              href="https://wa.me/6285284633214?text=Halo%20Sales%20B2B%20Global%20Fresh%20Indo,%20kami%20ingin%20konsultasi%20pasokan%20buah%20rutin"
              target="_blank"
              rel="noreferrer"
              className="bg-white/15 hover:bg-white/25 text-white border border-white/30 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm transition-colors flex items-center gap-2"
            >
              <Phone className="w-4 h-4 text-[#FFD54F]" />
              <span>Hubungi Sales B2B</span>
            </a>
          </div>
        </div>

        {/* 4 Feature Badges matching Image 2 */}
        <div className="mt-10 pt-8 border-t border-white/20 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5 text-[#FFD54F]" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Harga Kompetitif</h4>
              <p className="text-[11px] text-green-200">Langsung petani & importir</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#FFD54F]" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Kualitas Terjamin</h4>
              <p className="text-[11px] text-green-200">Sortasi Grade A & Super</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-[#FFD54F]" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Tepat Waktu</h4>
              <p className="text-[11px] text-green-200">Kirim subuh 05.00 WIB</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-[#FFD54F]" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Faktur & Invoice</h4>
              <p className="text-[11px] text-green-200">Tempo TOP 14-30 hari</p>
            </div>
          </div>
        </div>
      </div>

      {/* BGN Program Makan Bergizi Spotlight Banner */}
      <div className="bg-gradient-to-r from-[#17331D] via-[#214327] to-[#087F23] text-white rounded-3xl p-6 sm:p-7 shadow-lg border border-green-700 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex flex-col items-center justify-center p-1 shrink-0 shadow-inner">
            <span className="text-2xl">🇮🇩</span>
            <span className="text-[8px] font-black text-[#FFD54F] leading-none mt-0.5">BGN</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#FFD54F] text-[#17331D] text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                PROGRAM NASIONAL
              </span>
              <span className="text-xs text-green-200 font-semibold">
                Dapur Satuan Pelayanan Gizi (SPPG)
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-white mt-1">
              Pengadaan Komoditas Buah Standar Badan Gizi Nasional (BGN)
            </h3>
            <p className="text-xs text-green-100/85 max-w-xl mt-0.5">
              Siap melayani pasokan harian skala besar untuk Program Makan Bergizi Gratis: gramasi terukur, sertifikasi keamanan pangan PSAT, dan armada subuh higienis.
            </p>
          </div>
        </div>

        {onOpenBgnModal && (
          <button
            onClick={onOpenBgnModal}
            className="bg-[#FF7F00] hover:bg-[#E67200] text-white font-black text-xs sm:text-sm px-6 py-3.5 rounded-2xl shadow-md transition-all flex items-center gap-2 shrink-0 hover:scale-105"
          >
            <Phone className="w-4 h-4 fill-current" />
            <span>Konsultasi Pengadaan BGN</span>
          </button>
        )}
      </div>

      {/* Komoditas Grosir Terlaris (Matching Image 2 Grid) */}
      <div className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs font-bold text-[#087F23] uppercase tracking-wider">
              Katalog Volume Besar
            </span>
            <h2 className="text-2xl font-black text-[#17331D]">
              Komoditas Buah Grosir & Petian Terpopuler
            </h2>
          </div>
          <span className="text-xs text-[#6B7D70] hidden sm:inline">
            Harga per peti kayu / dus karton eksklusif
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wholesaleProducts.slice(0, 8).map((p) => (
            <div
              key={p.id}
              className="fruit-card-interactive bg-white border border-[#E2EBD8] rounded-2xl p-4 hover:border-[#087F23] hover:shadow-xl transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="fruit-photo-sheen-container relative w-full h-40 rounded-xl mb-3 overflow-hidden bg-neutral-100">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                  />
                </div>
                <span className="bg-[#E8F5E4] text-[#087F23] text-[10px] font-bold px-2 py-0.5 rounded">
                  {p.wholesaleUnitDesc}
                </span>
                <h3 className="font-bold text-sm text-[#17331D] mt-2 truncate group-hover:text-[#087F23] transition-colors">{p.name}</h3>
                <p className="text-xs text-[#6B7D70] line-clamp-1">{p.subtitle}</p>
                
                <div className="mt-3 p-2.5 rounded-xl bg-[#F7FAF5] border border-[#E2EBD8]">
                  <div className="text-[10px] text-[#6B7D70]">Harga Grosir Khusus:</div>
                  <div className="text-lg font-black text-[#087F23]">
                    Rp {p.wholesalePrice.toLocaleString('id-ID')}
                    <span className="text-xs font-medium text-[#6B7D70]">/{p.unit}</span>
                  </div>
                  <div className="text-[10px] text-[#17331D] mt-0.5">
                    Minimal order: <strong>{p.wholesaleMinQty} {p.unit}</strong>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onAddToCart(p, p.wholesaleMinQty)}
                className="mt-4 w-full py-2.5 bg-[#087F23] hover:bg-[#005500] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 hover:scale-102 active:scale-95"
              >
                <span>Pesan Kuantitas Grosir</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Request Quotation Form matching Image 2 & 3 */}
      <div id="quote-form" className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E2EBD8] shadow-md scroll-mt-24">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <span className="bg-[#E8F5E4] text-[#087F23] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              Formulir Kemitraan Resmi
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#17331D]">
              Ajukan Penawaran Harga Grosir & Jadwal Sampling
            </h2>
            <p className="text-xs sm:text-sm text-[#6B7D70]">
              Dapatkan katalog harga khusus B2B, surat penawaran resmi (Quotation), dan pengiriman sampel buah ke restoran/hotel Anda.
            </p>
          </div>

          <form onSubmit={handleSendQuotation} className="space-y-4 pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#17331D] block mb-1">
                  Nama Bisnis / Hotel / Usaha *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Grand Royal Hotel Cianjur"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full bg-[#F7FAF5] border border-[#CDE0C4] rounded-xl p-2.5 text-xs text-[#17331D] focus:ring-1 focus:ring-[#087F23] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#17331D] block mb-1">
                  Tipe Usaha *
                </label>
                <select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  className="w-full bg-[#F7FAF5] border border-[#CDE0C4] rounded-xl p-2.5 text-xs text-[#17331D] focus:ring-1 focus:ring-[#087F23] focus:outline-none"
                >
                  <option value="Hotel Bintang / Resort">Hotel Bintang / Resort</option>
                  <option value="Restoran / Kafe / Bar Jus">Restoran / Kafe / Bar Jus</option>
                  <option value="Katering Pesta / Horeka">Katering Pesta / Horeka</option>
                  <option value="Supermarket / Toko Buah Retail">Supermarket / Toko Buah Retail</option>
                  <option value="Kantin Rumah Sakit / Pabrik">Kantin Rumah Sakit / Pabrik</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#17331D] block mb-1">
                  Nama PIC / Penanggung Jawab *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nama Chef / Purchasing Manager"
                  value={picName}
                  onChange={(e) => setPicName(e.target.value)}
                  className="w-full bg-[#F7FAF5] border border-[#CDE0C4] rounded-xl p-2.5 text-xs text-[#17331D] focus:ring-1 focus:ring-[#087F23] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#17331D] block mb-1">
                  Nomor WhatsApp PIC *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="0812-xxxx-xxxx"
                  value={picPhone}
                  onChange={(e) => setPicPhone(e.target.value)}
                  className="w-full bg-[#F7FAF5] border border-[#CDE0C4] rounded-xl p-2.5 text-xs text-[#17331D] focus:ring-1 focus:ring-[#087F23] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#17331D] block mb-1">
                  Estimasi Kebutuhan Bulanan
                </label>
                <select
                  value={estimatedMonthlyVolume}
                  onChange={(e) => setEstimatedMonthlyVolume(e.target.value)}
                  className="w-full bg-[#F7FAF5] border border-[#CDE0C4] rounded-xl p-2.5 text-xs text-[#17331D] focus:ring-1 focus:ring-[#087F23] focus:outline-none"
                >
                  <option value="< 100 kg / bulan">&lt; 100 kg / bulan</option>
                  <option value="100 - 500 kg / bulan">100 - 500 kg / bulan</option>
                  <option value="500 kg - 2 Ton / bulan">500 kg - 2 Ton / bulan</option>
                  <option value="> 2 Ton / bulan">&gt; 2 Ton / bulan (Kontrak Khusus)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#17331D] block mb-1">
                  Skema Pembayaran yang Diinginkan
                </label>
                <select
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  className="w-full bg-[#F7FAF5] border border-[#CDE0C4] rounded-xl p-2.5 text-xs text-[#17331D] focus:ring-1 focus:ring-[#087F23] focus:outline-none"
                >
                  <option value="Cash On Delivery (COD)">Cash On Delivery (COD)</option>
                  <option value="TOP 7 Hari">TOP 7 Hari</option>
                  <option value="TOP 14 Hari">TOP 14 Hari</option>
                  <option value="TOP 30 Hari (Kontrak Korporat)">TOP 30 Hari (Kontrak Korporat)</option>
                </select>
              </div>
            </div>

            {/* Checklist of fruits */}
            <div>
              <label className="text-xs font-bold text-[#17331D] block mb-1.5">
                Pilih Komoditas Buah yang Dibutuhkan:
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  'Apel Fuji', 'Pisang Cavendish', 'Jeruk Santang', 'Anggur Shine Muscat',
                  'Semangka Non-Biji', 'Melon Golden', 'Alpukat Mentega', 'Kiwi Gold',
                  'Mangga Harum Manis', 'Buah Naga', 'Stroberi Segar'
                ].map((fruit) => {
                  const isChecked = selectedNeeds.includes(fruit);
                  return (
                    <button
                      type="button"
                      key={fruit}
                      onClick={() => handleToggleNeed(fruit)}
                      className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-all flex items-center gap-1.5 ${
                        isChecked
                          ? 'bg-[#087F23] text-white shadow-xs'
                          : 'bg-[#F7FAF5] text-[#17331D] border border-[#CDE0C4]'
                      }`}
                    >
                      {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                      <span>{fruit}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#087F23] hover:bg-[#005500] text-white font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mt-4"
            >
              <Send className="w-4 h-4" />
              <span>Kirim Pengajuan Kemitraan via WhatsApp B2B</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
