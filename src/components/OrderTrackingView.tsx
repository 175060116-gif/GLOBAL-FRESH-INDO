import React, { useState } from 'react';
import { 
  Truck, CheckCircle2, Clock, Phone, MapPin, 
  Thermometer, User, ShieldCheck, Search, Navigation, 
  ArrowRight, MessageCircle, Package
} from 'lucide-react';

export const OrderTrackingView: React.FC = () => {
  const [orderIdInput, setOrderIdInput] = useState('GF2026001234');
  const [searchedId, setSearchedId] = useState('GF2026001234');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchedId(orderIdInput.trim() || 'GF2026001234');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Search Order Bar */}
      <div className="bg-white rounded-3xl p-6 border border-[#E2EBD8] shadow-xs">
        <h1 className="text-xl sm:text-2xl font-black text-[#17331D] mb-1">
          Lacak Pengiriman Pesanan Buah
        </h1>
        <p className="text-xs text-[#6B7D70] mb-4">
          Masukkan nomor resi atau ID pemesanan untuk memantau perjalanan armada dan suhu cold storage secara real-time.
        </p>

        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Nomor Pesanan (contoh: GF2026001234)"
              value={orderIdInput}
              onChange={(e) => setOrderIdInput(e.target.value)}
              className="w-full bg-[#F7FAF5] border border-[#CDE0C4] rounded-2xl py-2.5 pl-10 pr-3 text-xs text-[#17331D] font-mono uppercase focus:ring-2 focus:ring-[#087F23] focus:outline-none"
            />
            <Search className="w-4 h-4 text-[#6B7D70] absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>
          <button
            type="submit"
            className="bg-[#087F23] hover:bg-[#005500] text-white px-6 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-xs shrink-0"
          >
            Lacak
          </button>
        </form>
      </div>

      {/* Main Tracking Details Card matching Image 2 Screen 5 */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2EBD8] shadow-md space-y-6">
        {/* Top Status Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#E2EBD8]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#6B7D70]">Nomor Pesanan:</span>
              <span className="text-sm sm:text-base font-mono font-black text-[#087F23]">
                #{searchedId}
              </span>
            </div>
            <div className="text-xs text-[#6B7D70] mt-0.5">
              Tujuan: Jl. KH. Abdullah Bin Nuh No. 24, Cianjur Kota
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#55AA00] animate-ping"></span>
            <span className="bg-[#E8F5E4] text-[#087F23] px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
              Dalam Pengiriman (Kurir Toko)
            </span>
          </div>
        </div>

        {/* Stepper Status matching Image 2 Screen 5 */}
        <div className="py-2">
          <div className="relative pl-6 sm:pl-8 space-y-8 border-l-2 border-[#55AA00]">
            {/* Step 1 */}
            <div className="relative">
              <div className="absolute -left-[31px] sm:-left-[39px] top-0 w-6 h-6 rounded-full bg-[#087F23] text-white flex items-center justify-center text-xs font-bold">
                ✓
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-xs sm:text-sm text-[#17331D]">Pesanan Diterima</h4>
                  <span className="text-[10px] text-[#6B7D70]">08:30 WIB</span>
                </div>
                <p className="text-xs text-[#6B7D70]">Rincian buah tercatat di sistem dapur pusat Cilaku.</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="absolute -left-[31px] sm:-left-[39px] top-0 w-6 h-6 rounded-full bg-[#087F23] text-white flex items-center justify-center text-xs font-bold">
                ✓
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-xs sm:text-sm text-[#17331D]">Pembayaran Dikonfirmasi</h4>
                  <span className="text-[10px] text-[#6B7D70]">08:35 WIB</span>
                </div>
                <p className="text-xs text-[#6B7D70]">Lunas via QRIS / Bank Transfer.</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="absolute -left-[31px] sm:-left-[39px] top-0 w-6 h-6 rounded-full bg-[#087F23] text-white flex items-center justify-center text-xs font-bold">
                ✓
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-xs sm:text-sm text-[#17331D]">Sortasi & Pengemasan Berpendingin</h4>
                  <span className="text-[10px] text-[#6B7D70]">09:10 WIB</span>
                </div>
                <p className="text-xs text-[#6B7D70]">Lolos uji sortir kemanisan brix dan dipacking dengan ice gel tebal.</p>
              </div>
            </div>

            {/* Step 4 - Active */}
            <div className="relative">
              <div className="absolute -left-[31px] sm:-left-[39px] top-0 w-6 h-6 rounded-full bg-[#FF7F00] text-white flex items-center justify-center text-xs font-bold animate-pulse">
                <Truck className="w-3.5 h-3.5" />
              </div>
              <div className="bg-[#FFF8E1] p-3.5 rounded-2xl border border-[#FFE082]">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-xs sm:text-sm text-amber-900">
                    Sedang Dikirim oleh Armada Toko
                  </h4>
                  <span className="text-xs font-bold text-amber-800">Estimasi Tiba: 10:45 WIB</span>
                </div>
                <p className="text-xs text-amber-800 mt-0.5">
                  Driver sedang menuju alamat Anda. Suhu muatan box: <strong className="text-[#087F23]">3.9°C</strong>.
                </p>
              </div>
            </div>

            {/* Step 5 - Pending */}
            <div className="relative opacity-50">
              <div className="absolute -left-[31px] sm:-left-[39px] top-0 w-6 h-6 rounded-full bg-neutral-200 text-neutral-500 flex items-center justify-center text-xs font-bold">
                5
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-neutral-600">Pesanan Diterima Pemesan</h4>
                <p className="text-xs text-neutral-400">Pemeriksaan kondisi buah dan tanda tangan serah terima.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Driver Card matching Image 2 Screen 5 */}
        <div className="bg-[#F7FAF5] rounded-2xl p-4 sm:p-5 border border-[#E2EBD8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-[#087F23] text-white flex items-center justify-center font-black text-base shrink-0">
              BS
            </div>
            <div>
              <div className="text-[10px] text-[#6B7D70] uppercase font-bold">Driver Pengantar</div>
              <div className="font-extrabold text-sm text-[#17331D]">Budi Santoso</div>
              <div className="text-xs text-[#6B7D70] flex items-center gap-2 mt-0.5">
                <span>Armada Box: <strong>F 8214 WX</strong></span>
                <span>•</span>
                <span className="flex items-center gap-1 text-[#087F23]">
                  <Thermometer className="w-3.5 h-3.5" />
                  <span>3.9°C</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <a
              href="https://wa.me/6285284633214?text=Halo%20Pak%20Budi,%20mau%20konfirmasi%20posisi%20pesanan%20buah"
              target="_blank"
              rel="noreferrer"
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-[#087F23] hover:bg-[#005500] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Hubungi Driver</span>
            </a>

            <button
              onClick={() => alert('Fitur Live GPS armada terhubung langsung dengan satelit pemantau rute.')}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-white border border-[#CDE0C4] text-[#17331D] px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#E8F5E4] transition-colors"
            >
              <Navigation className="w-3.5 h-3.5 text-[#087F23]" />
              <span>Lacak di Peta</span>
            </button>
          </div>
        </div>

        {/* Order Items summary in package */}
        <div className="border-t border-[#E2EBD8] pt-4">
          <h4 className="font-bold text-xs text-[#17331D] mb-3 flex items-center gap-1.5">
            <Package className="w-4 h-4 text-[#087F23]" />
            <span>Isi Paket Pesanan ({searchedId})</span>
          </h4>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center py-1.5 border-b border-neutral-100">
              <span className="text-[#17331D]">Apel Fuji Wang Shan 88</span>
              <span className="font-bold text-[#087F23]">1 kg • Rp 34.000</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-neutral-100">
              <span className="text-[#17331D]">Jeruk Santang Daun Madu</span>
              <span className="font-bold text-[#087F23]">2 kg • Rp 65.000</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-neutral-100">
              <span className="text-[#17331D]">Alpukat Mentega Miki Super</span>
              <span className="font-bold text-[#087F23]">2 kg • Rp 56.000</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
