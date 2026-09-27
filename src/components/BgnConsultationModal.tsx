import React, { useState } from 'react';
import { 
  X, ShieldCheck, CheckCircle2, Truck, Phone, 
  Building2, Users, Calendar, Award, FileText, Send, Sparkles, Scale, Info
} from 'lucide-react';
import { StoreSettings } from '../data/storeSettings';
import { FRUIT_PACKAGE_OPTIONS } from './NutritionPortionCalculator';

interface BgnConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  storeSettings?: StoreSettings;
}

export const BgnConsultationModal: React.FC<BgnConsultationModalProps> = ({
  isOpen,
  onClose,
  storeSettings,
}) => {
  // Input Jumlah Penerima/Siswa: bisa dihapus sampai 0, tidak dibatasi preset, validasi non-negatif
  const [studentInput, setStudentInput] = useState<string>('1000');
  const [portionGrams, setPortionGrams] = useState<number>(85);
  const [selectedFruit, setSelectedFruit] = useState<string>(FRUIT_PACKAGE_OPTIONS[0].label);
  const [customFruitRequest, setCustomFruitRequest] = useState<string>('');
  
  const [picName, setPicName] = useState<string>('');
  const [picPhone, setPicPhone] = useState<string>('');
  const [institutionName, setInstitutionName] = useState<string>('SPPG / Dapur Gizi ');
  const [deliveryArea, setDeliveryArea] = useState<string>('Cianjur (Kota / Cilaku / Warungkondang)');
  const [deliveryFrequency, setDeliveryFrequency] = useState<string>('Harian Pagi (04.00 - 06.00 WIB) - Sebelum Masak');
  const [notes, setNotes] = useState<string>('Dibutuhkan dokumen sertifikat higiene PSAT dan faktur pajak resmi.');

  if (!isOpen) return null;

  // Safe non-negative calculation
  const parsedPortions = Math.max(0, parseInt(studentInput, 10) || 0);
  const dailyKg = Math.round((parsedPortions * portionGrams) / 1000);
  const activePackageObj = FRUIT_PACKAGE_OPTIONS.find(p => p.label === selectedFruit) || FRUIT_PACKAGE_OPTIONS[0];
  const estimatedCostPerPortion = activePackageObj.avgCostPerPortion;
  const estimatedDailyTotal = parsedPortions * estimatedCostPerPortion;

  const handleStudentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    if (rawVal === '') {
      setStudentInput('');
      return;
    }
    const num = parseInt(rawVal, 10);
    if (!isNaN(num)) {
      setStudentInput(Math.max(0, num).toString());
    }
  };

  const handleStudentBlur = () => {
    if (studentInput === '' || isNaN(parseInt(studentInput, 10))) {
      setStudentInput('0');
    }
  };

  const handleSendWa = (e: React.FormEvent) => {
    e.preventDefault();
    const waNumber = storeSettings?.whatsappNumber || '6285284633214';
    const message = `*FORM KONSULTASI PENGADAAN BUAH BGN (BADAN GIZI NASIONAL)*
*Program Makan Bergizi Gratis (MBG)*

Kepada Yth. Tim Pengadaan BGN PT Global Fresh Indo,
Saya ingin berkonsultasi mengenai pasokan buah segar untuk Satuan Pelayanan Pemenuhan Gizi (SPPG):

📋 *Data Satuan Pelayanan:*
• PIC / Penanggung Jawab: ${picName || '-'}
• No. Kontak: ${picPhone || '-'}
• Nama SPPG / Dapur: ${institutionName}
• Wilayah Distribusi: ${deliveryArea}
• Jadwal Distribusi: ${deliveryFrequency}

🍎 *Spesifikasi Kebutuhan Buah & Kalkulasi Gizi:*
• Target Penerima Manfaat: *${parsedPortions.toLocaleString('id-ID')} Siswa / Porsi per Hari*
• Standar Gramasi: *${portionGrams} gram per porsi*
• Total Kebutuhan Buah Harian: *± ${dailyKg.toLocaleString('id-ID')} Kg per Hari*
• Estimasi Dus / Keranjang: *± ${Math.ceil(dailyKg / 15)} Dus / Hari*
• Pilihan Rekomendasi Buah: ${selectedFruit}
${customFruitRequest.trim() ? `• Request Khusus Kombinasi Buah:\n  "${customFruitRequest.trim()}"\n` : ''}
💰 *Estimasi Anggaran Acuan:*
• Estimasi per Porsi: Rp ${estimatedCostPerPortion.toLocaleString('id-ID')}
• Total Estimasi Harian: Rp ${estimatedDailyTotal.toLocaleString('id-ID')}

📄 *Kebutuhan Kepatuhan Regulasi:*
• Sertifikasi Higiene Pangan Segar Asal Tumbuhan (PSAT): *Ya*
• Uji Bebas Residu Pestisida & Logam Berat: *Ya*
• Faktur Pajak & Invoice Legalitas Badan Hukum: *Ya*
• Catatan Tambahan: ${notes || '-'}

Mohon informasi katalog penawaran harga resmi (RAB) dan jadwal survei gudang/cold storage. Terima kasih.`;

    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-[#E2EBD8] overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[92vh]">
        
        {/* Official Header matching BGN identity */}
        <div className="bg-gradient-to-r from-[#17331D] via-[#1E4626] to-[#087F23] text-white px-6 py-5 border-b border-green-800 flex items-start justify-between relative overflow-hidden shrink-0">
          <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
          
          <div className="flex items-center gap-3.5 relative z-10">
            {/* Garuda / BGN Circular Emblem */}
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 p-1 flex items-center justify-center shrink-0 shadow-inner">
              <span className="text-2xl">🇮🇩</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-[#FFD54F] text-[#17331D] text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Program Nasional
                </span>
                <span className="text-xs text-green-200 font-semibold">
                  Badan Gizi Nasional (BGN)
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white mt-0.5">
                Konsultasi Suplai Buah SPPG & Dapur Gizi
              </h2>
              <p className="text-[11px] text-green-100/80">
                Penyedia komoditas buah segar berstandar gizi terukur & bersertifikasi PSAT resmi
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors shrink-0"
            title="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSendWa} className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs text-[#17331D]">
          
          {/* Key Standards Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div className="bg-[#E8F5E4] p-3 rounded-2xl border border-[#CDE0C4] flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-[#087F23] shrink-0" />
              <div>
                <strong className="block text-[11px] text-[#087F23]">PSAT Terverifikasi</strong>
                <span className="text-[10px] text-[#6B7D70]">Bebas residu pestisida</span>
              </div>
            </div>

            <div className="bg-[#FFF8E1] p-3 rounded-2xl border border-[#FFE082] flex items-center gap-2.5">
              <Scale className="w-5 h-5 text-[#FF8F00] shrink-0" />
              <div>
                <strong className="block text-[11px] text-[#E65100]">Gramasi Presisi</strong>
                <span className="text-[10px] text-[#6B7D70]">75g - 100g per porsi siswa</span>
              </div>
            </div>

            <div className="bg-[#E0F2FE] p-3 rounded-2xl border border-[#BAE6FD] flex items-center gap-2.5">
              <Truck className="w-5 h-5 text-[#0284C7] shrink-0" />
              <div>
                <strong className="block text-[11px] text-[#0369A1]">Kirim Subuh Terjadwal</strong>
                <span className="text-[10px] text-[#6B7D70]">Armada berpendingin higienis</span>
              </div>
            </div>
          </div>

          {/* Interactive Calculator Section matching the User Specifications */}
          <div className="bg-[#F7FAF5] p-4 sm:p-5 rounded-3xl border border-[#CDE0C4] space-y-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#087F23] font-bold">
                <Sparkles className="w-4 h-4" />
                <h3 className="text-sm font-black text-[#17331D]">
                  Kalkulator Kebutuhan Porsi Siswa (SPPG & Dapur Gizi)
                </h3>
              </div>
              <span className="text-[10px] text-[#087F23] bg-white px-2.5 py-0.5 rounded-full border border-[#CDE0C4] font-bold">
                Simulasi Otomatis
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 1. Input Jumlah Penerima/Siswa */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="modal-student-count" className="block text-[11px] font-bold text-[#17331D]">
                    Target Jumlah Penerima Manfaat (Siswa / Hari) *
                  </label>
                  <span className="text-[10px] text-[#6B7D70]">Bebas ketik</span>
                </div>
                <div className="relative">
                  <input
                    id="modal-student-count"
                    type="number"
                    min="0"
                    step="1"
                    placeholder="0"
                    value={studentInput}
                    onChange={handleStudentChange}
                    onKeyDown={(e) => { if (e.key === '-' || e.key === 'e' || e.key === 'E' || e.key === '+') e.preventDefault(); }}
                    onBlur={handleStudentBlur}
                    className="w-full bg-[#F7FAF5] border border-[#CDE0C4] rounded-xl px-3.5 py-2.5 text-xs font-semibold text-[#17331D] transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#087F23] focus:border-[#087F23]"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#087F23] pointer-events-none">
                    Siswa
                  </span>
                </div>
                <p className="text-[10px] text-[#6B7D70] mt-1">
                  Dapat dihapus hingga angka 0 dan tervalidasi tanpa angka negatif.
                </p>
              </div>

              {/* 2. Standar Gramasi */}
              <div>
                <label htmlFor="modal-portion-grams" className="block text-[11px] font-bold text-[#17331D] mb-1">
                  Standar Gramasi per Anak *
                </label>
                <select
                  id="modal-portion-grams"
                  value={portionGrams}
                  onChange={(e) => setPortionGrams(Number(e.target.value))}
                  className="w-full bg-[#F7FAF5] border border-[#CDE0C4] rounded-xl px-3.5 py-2.5 text-xs font-semibold text-[#17331D] transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#087F23] focus:border-[#087F23]"
                >
                  <option value={75}>75 gram / porsi (TK / SD Kelas 1-3)</option>
                  <option value={85}>85 gram / porsi (SD Kelas 4-6 / Standar Nasional)</option>
                  <option value={100}>100 gram / porsi (SMP / SMA / Santri)</option>
                  <option value={120}>120 gram / porsi (Asrama & Atlet Pelajar)</option>
                </select>
                <p className="text-[10px] text-[#6B7D70] mt-1">
                  Standar rekomendasi gizi kementerian: 85g per sajian buah.
                </p>
              </div>
            </div>

            {/* Calculated Results Banner */}
            <div className="bg-[#17331D] text-white p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-inner">
              <div>
                <span className="text-[10px] text-green-200 uppercase font-black block tracking-wider">
                  Kebutuhan Pasokan Buah Bersih Harian:
                </span>
                <span className="text-xl sm:text-2xl font-black text-[#FFD54F]">
                  ± {dailyKg.toLocaleString('id-ID')} Kg / Hari
                </span>
                <span className="text-[10px] text-green-200/90 block mt-0.5">
                  Estimasi ± {Math.ceil(dailyKg / 15) || 0} Dus / Keranjang (15kg/dus)
                </span>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-[10px] text-green-200 block font-medium">Estimasi Anggaran Acuan:</span>
                <span className="text-base sm:text-lg font-black text-white">
                  Rp {estimatedDailyTotal.toLocaleString('id-ID')}
                </span>
                <span className="text-[10px] text-[#FFD54F] font-bold block">
                  Ready kapasitas 15 Ton / Hari
                </span>
              </div>
            </div>

            {/* 3. Dropdown Rekomendasi Buah (minimal 6-8 variasi + emoji + rotasi 5 hari + kustom) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="modal-fruit-dropdown" className="block text-[11px] font-bold text-[#17331D]">
                  Dropdown Rekomendasi Paket Buah Bergizi Tinggi *
                </label>
                <span className="text-[10px] text-[#087F23] font-bold">8+ Pilihan Paket</span>
              </div>
              <select
                id="modal-fruit-dropdown"
                value={selectedFruit}
                onChange={(e) => setSelectedFruit(e.target.value)}
                className="w-full bg-[#F7FAF5] border border-[#CDE0C4] rounded-xl px-3.5 py-2.5 text-xs font-semibold text-[#17331D] transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#087F23] focus:border-[#087F23]"
              >
                {FRUIT_PACKAGE_OPTIONS.map((pkg) => (
                  <option key={pkg.id} value={pkg.label}>
                    {pkg.label}
                  </option>
                ))}
              </select>
              <p className="text-[10.5px] text-[#6B7D70] mt-1">
                {activePackageObj.desc}
              </p>
            </div>

            {/* 4. Input Text Request Khusus (kolom teks fleksibel tepat di bawah dropdown) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="modal-custom-fruit-text" className="block text-[11px] font-bold text-[#17331D]">
                  Input Text Request Khusus Kombinasi Buah
                </label>
                <span className="text-[10px] text-[#6B7D70]">Bebas Ketik Manual</span>
              </div>
              <textarea
                id="modal-custom-fruit-text"
                rows={2}
                value={customFruitRequest}
                onChange={(e) => setCustomFruitRequest(e.target.value)}
                placeholder="Ketik manual kombinasi buah spesifik yang Anda inginkan (misal: 'Senin Cavendish + Santang, Selasa Apel Wangshan, Kamis Pear Century, tanpa biji keras')..."
                className="w-full bg-[#F7FAF5] border border-[#CDE0C4] rounded-xl px-3.5 py-2.5 text-xs font-semibold text-[#17331D] placeholder-neutral-400 transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#087F23] focus:border-[#087F23]"
              />
              <p className="text-[10px] text-[#6B7D70] mt-1">
                Tim ahli logistik buah kami akan menyesuaikan pesanan sesuai catatan khusus Anda.
              </p>
            </div>

          </div>

          {/* SPPG & Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="pic-name-input" className="block text-[11px] font-bold text-[#17331D] mb-1">
                Nama PIC / Koordinator SPPG *
              </label>
              <input
                id="pic-name-input"
                type="text"
                required
                value={picName}
                onChange={(e) => setPicName(e.target.value)}
                placeholder="Contoh: Ibu Rina (Koord. SPPG Cianjur)"
                className="w-full bg-[#F7FAF5] border border-[#CDE0C4] rounded-xl px-3.5 py-2.5 text-xs font-semibold text-[#17331D] transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#087F23] focus:border-[#087F23]"
              />
            </div>

            <div>
              <label htmlFor="pic-phone-input" className="block text-[11px] font-bold text-[#17331D] mb-1">
                Nomor WhatsApp Aktif *
              </label>
              <input
                id="pic-phone-input"
                type="tel"
                required
                value={picPhone}
                onChange={(e) => setPicPhone(e.target.value)}
                placeholder="Contoh: 081234567890"
                className="w-full bg-[#F7FAF5] border border-[#CDE0C4] rounded-xl px-3.5 py-2.5 text-xs font-semibold text-[#17331D] transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#087F23] focus:border-[#087F23]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="institution-name-input" className="block text-[11px] font-bold text-[#17331D] mb-1">
                Nama Satuan Pelayanan (SPPG) / Dapur Gizi *
              </label>
              <input
                id="institution-name-input"
                type="text"
                required
                value={institutionName}
                onChange={(e) => setInstitutionName(e.target.value)}
                placeholder="Contoh: SPPG Dapur Gizi Cilaku 1"
                className="w-full bg-[#F7FAF5] border border-[#CDE0C4] rounded-xl px-3.5 py-2.5 text-xs font-semibold text-[#17331D] transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#087F23] focus:border-[#087F23]"
              />
            </div>

            <div>
              <label htmlFor="delivery-area-input" className="block text-[11px] font-bold text-[#17331D] mb-1">
                Wilayah Pengiriman (Kecamatan / Kabupaten)
              </label>
              <input
                id="delivery-area-input"
                type="text"
                value={deliveryArea}
                onChange={(e) => setDeliveryArea(e.target.value)}
                placeholder="Cianjur Kota, Cilaku, Sukabumi, dll."
                className="w-full bg-[#F7FAF5] border border-[#CDE0C4] rounded-xl px-3.5 py-2.5 text-xs font-semibold text-[#17331D] transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#087F23] focus:border-[#087F23]"
              />
            </div>
          </div>

          <div>
            <label htmlFor="delivery-frequency-select" className="block text-[11px] font-bold text-[#17331D] mb-1">
              Jadwal Waktu Tiba di Dapur Gizi
            </label>
            <select
              id="delivery-frequency-select"
              value={deliveryFrequency}
              onChange={(e) => setDeliveryFrequency(e.target.value)}
              className="w-full bg-[#F7FAF5] border border-[#CDE0C4] rounded-xl px-3.5 py-2.5 text-xs font-semibold text-[#17331D] transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#087F23] focus:border-[#087F23]"
            >
              <option value="Harian Pagi (04.00 - 06.00 WIB) - Sebelum Masak">
                Harian Pagi Subuh (04.00 - 06.00 WIB) - Sebelum Proses Masak Dapur
              </option>
              <option value="Harian Pagi (06.00 - 07.30 WIB) - Siap Packing">
                Harian Pagi (06.00 - 07.30 WIB) - Langsung Packing Ompreng/Box
              </option>
              <option value="H-1 Sore (16.00 - 18.00 WIB) - Simpan Chiller Dapur">
                H-1 Sore Hari (16.00 - 18.00 WIB) - Standby Chiller Dapur
              </option>
            </select>
          </div>

          <div>
            <label htmlFor="notes-textarea" className="block text-[11px] font-bold text-[#17331D] mb-1">
              Catatan / Permintaan Khusus Dokumen Pengadaan
            </label>
            <textarea
              id="notes-textarea"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Faktur pajak PT, sertifikat PSAT, atau kunjungan sampling buah."
              className="w-full bg-[#F7FAF5] border border-[#CDE0C4] rounded-xl px-3.5 py-2.5 text-xs font-semibold text-[#17331D] transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#087F23] focus:border-[#087F23]"
            />
          </div>

          {/* Footer Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 bg-[#087F23] hover:bg-[#06631B] text-white font-black text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-95"
            >
              <Phone className="w-4 h-4" />
              <span>Kirim Pengajuan & Konsultasi Langsung via WhatsApp</span>
            </button>
            <p className="text-[10px] text-center text-[#6B7D70] mt-2">
              Tim Divisi Pengadaan Pemerintah & BGN PT Global Fresh Indo akan segera merespons dengan surat penawaran harga resmi (RAB).
            </p>
          </div>
        </form>

      </div>
    </div>
  );
};
