import React, { useState } from 'react';
import { 
  Calculator, Sparkles, Scale, MessageCircle, 
  CheckCircle2, Info, ChevronDown, Check, Copy
} from 'lucide-react';

export interface NutritionCalculatorData {
  studentCount: number;
  portionGrams: number;
  selectedPackage: string;
  customFruitRequest: string;
  dailyKg: number;
  estimatedPortionCost: number;
  estimatedDailyTotal: number;
}

interface NutritionPortionCalculatorProps {
  onDataChange?: (data: NutritionCalculatorData) => void;
  onSendWhatsApp?: (data: NutritionCalculatorData) => void;
  whatsappNumber?: string;
  initialStudents?: number;
  compact?: boolean;
}

export const FRUIT_PACKAGE_OPTIONS = [
  {
    id: 'banana-orange',
    label: '🍌 Pisang Cavendish & 🍊 Jeruk Santang (Energi Cepat & Vitamin C)',
    desc: 'Paket standar favorit anak sekolah, mudah dikupas & padat energi alami.',
    avgCostPerPortion: 2200,
  },
  {
    id: 'apple-watermelon',
    label: '🍎 Apel Fuji Wang Shan & 🍉 Semangka Non-Biji (Serat & Hidrasi)',
    desc: 'Kaya cairan elektrolit alami, renyah manis dan sangat menyegarkan.',
    avgCostPerPortion: 2400,
  },
  {
    id: 'melon-papaya',
    label: '🍈 Melon Golden & 🥭 Pepaya California Potong (Pencernaan Sehat)',
    desc: 'Tinggi serat larut & enzim papain untuk kesehatan lambung siswa.',
    avgCostPerPortion: 2100,
  },
  {
    id: 'grape-pear',
    label: '🍇 Anggur Red Globe / Muscat & 🍐 Pear Century (Antioksidan Super)',
    desc: 'Pilihan premium dengan rasa manis renyah mewah dan vitamin E tinggi.',
    avgCostPerPortion: 3200,
  },
  {
    id: 'kiwi-mandarin',
    label: '🥝 Kiwi Green Lucky Sheep & 🍊 Jeruk Afourer (Vitamin C Booster)',
    desc: 'Tinggi asam folat & vitamin C ganda untuk daya tahan tubuh aktif belajar.',
    avgCostPerPortion: 2800,
  },
  {
    id: 'strawberry-banana',
    label: '🍓 Stroberi Ciwidey & 🍌 Pisang Cavendish (Favorit TK/SD Awal)',
    desc: 'Warna menarik merangsang nafsu makan buah bagi anak usia dini.',
    avgCostPerPortion: 2600,
  },
  {
    id: 'avocado-banana',
    label: '🥑 Alpukat Mentega Probolinggo & 🍌 Pisang (Nutrisi Otak & Lemak Baik)',
    desc: 'Kaya asam lemak tak jenuh & kalium tinggi untuk fokus dan daya ingat.',
    avgCostPerPortion: 3000,
  },
  {
    id: 'rotation-5days',
    label: '🔄 Paket Menu Rotasi 5 Hari MBG (Variatif Berganti Setiap Hari)',
    desc: 'Senin: Pisang, Selasa: Jeruk, Rabu: Apel, Kamis: Melon, Jumat: Semangka.',
    avgCostPerPortion: 2350,
  },
  {
    id: 'custom',
    label: '✍️ Opsi Kustom Sendiri (Tuliskan Kombinasi Buah pada Kolom di Bawah)',
    desc: 'Pelanggan bebas menentukan varietas buah sesuai arahan ahli gizi satuan pelayanan.',
    avgCostPerPortion: 2500,
  },
];

export const NutritionPortionCalculator: React.FC<NutritionPortionCalculatorProps> = ({
  onDataChange,
  onSendWhatsApp,
  whatsappNumber = '6285284633214',
  initialStudents = 500,
  compact = false,
}) => {
  // Input Jumlah Penerima/Siswa:
  // - Menggunakan input type="number"
  // - Bisa dihapus sampai angka 0 (tidak crash / glitch)
  // - Tidak dibatasi preset
  // - Validasi agar angka tidak bisa negatif
  const [studentInput, setStudentInput] = useState<string>(initialStudents.toString());
  const [portionGrams, setPortionGrams] = useState<number>(85);
  const [selectedPackage, setSelectedPackage] = useState<string>(FRUIT_PACKAGE_OPTIONS[0].label);
  const [customFruitRequest, setCustomFruitRequest] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // Parsed number safe non-negative
  const parsedStudents = Math.max(0, parseInt(studentInput, 10) || 0);

  // Perhitungan realtime
  const dailyKg = Math.round((parsedStudents * portionGrams) / 1000);
  const currentPkg = FRUIT_PACKAGE_OPTIONS.find(p => p.label === selectedPackage) || FRUIT_PACKAGE_OPTIONS[0];
  const isCustomSelected = selectedPackage.includes('✍️') || selectedPackage.includes('Kustom');
  const estimatedPortionCost = currentPkg.avgCostPerPortion;
  const estimatedDailyTotal = parsedStudents * estimatedPortionCost;

  // Handle student number input change safely
  const handleStudentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    if (rawVal === '') {
      setStudentInput('');
      return;
    }
    const num = parseInt(rawVal, 10);
    if (!isNaN(num)) {
      // Validasi agar angka tidak bisa negatif
      const safeNum = Math.max(0, num);
      setStudentInput(safeNum.toString());
    }
  };

  // Prevent typing negative sign or scientific notation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === '-' || e.key === 'e' || e.key === 'E' || e.key === '+') {
      e.preventDefault();
    }
  };

  // Fallback to 0 if left empty on blur
  const handleBlur = () => {
    if (studentInput === '' || isNaN(parseInt(studentInput, 10))) {
      setStudentInput('0');
    }
  };

  const currentData: NutritionCalculatorData = {
    studentCount: parsedStudents,
    portionGrams,
    selectedPackage,
    customFruitRequest,
    dailyKg,
    estimatedPortionCost,
    estimatedDailyTotal,
  };

  // Sync to parent if callback provided
  React.useEffect(() => {
    if (onDataChange) {
      onDataChange(currentData);
    }
  }, [parsedStudents, portionGrams, selectedPackage, customFruitRequest]);

  const generateSummaryText = () => {
    return `*SIMULASI KALKULATOR GIZI & PORSI SISWA (MBG)*
PT Global Fresh Indo - Penyedia Buah Segar Terverifikasi

📋 *Spesifikasi Perhitungan Porsi:*
• Jumlah Penerima Manfaat: *${parsedStudents.toLocaleString('id-ID')} Siswa / Hari*
• Standar Gramasi: *${portionGrams} gram / porsi*
• Total Kebutuhan Buah Harian: *± ${dailyKg.toLocaleString('id-ID')} Kg / Hari*
• Paket Buah Pilihan: ${selectedPackage}
${customFruitRequest.trim() ? `• Request Khusus Kombinasi Buah:\n  "${customFruitRequest.trim()}"\n` : ''}
💰 *Estimasi Anggaran Acuan:*
• Estimasi per Porsi: Rp ${estimatedPortionCost.toLocaleString('id-ID')}
• Estimasi Harian Total: Rp ${estimatedDailyTotal.toLocaleString('id-ID')}

Mohon informasi penawaran resmi (RAB) dan ketersediaan jadwal pengiriman subuh ke Satuan Pelayanan kami. Terima kasih!`;
  };

  const handleCopySummary = async () => {
    try {
      await navigator.clipboard.writeText(generateSummaryText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDirectWhatsApp = () => {
    if (onSendWhatsApp) {
      onSendWhatsApp(currentData);
      return;
    }

    const message = generateSummaryText();
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="bg-[#F7FAF5] border border-[#CDE0C4] rounded-2xl sm:rounded-3xl p-4 sm:p-6 space-y-5 shadow-xs transition-all">
      {/* Title & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#CDE0C4]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#087F23] text-white flex items-center justify-center shadow-xs shrink-0">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black text-[#17331D] flex items-center gap-1.5">
              <span>Kalkulator Kebutuhan Porsi Siswa & Gizi</span>
              <Sparkles className="w-3.5 h-3.5 text-[#087F23]" />
            </h3>
            <p className="text-[11px] text-[#6B7D70]">
              Simulasi gramasi akurat & rekomendasi buah berstandar Program BGN / MBG
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-[10.5px] bg-white border border-[#CDE0C4] text-[#087F23] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-2xs">
            <Scale className="w-3 h-3" />
            <span>Kalkulasi Presisi</span>
          </span>
        </div>
      </div>

      {/* Form Fields Grid */}
      <div className="space-y-4">
        
        {/* Row 1: Input Siswa & Standar Gramasi */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* 1. Input Jumlah Penerima/Siswa */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="student-count-input" className="text-xs font-bold text-[#17331D] flex items-center gap-1">
                <span>Jumlah Penerima / Siswa</span>
                <span className="text-red-500 font-bold">*</span>
              </label>
              <span className="text-[10px] text-[#6B7D70] font-medium">Bebas ketik (min. 0)</span>
            </div>

            <div className="relative">
              <input
                id="student-count-input"
                type="number"
                min="0"
                step="1"
                placeholder="0"
                value={studentInput}
                onChange={handleStudentChange}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                className="w-full bg-[#F7FAF5] border border-[#CDE0C4] rounded-xl px-3.5 py-2.5 text-xs font-semibold text-[#17331D] placeholder:text-[#8FA393] transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#087F23] focus:border-[#087F23]"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#087F23] pointer-events-none select-none">
                Siswa
              </span>
            </div>

            <div className="flex items-center justify-between gap-1 mt-1.5">
              <p className="text-[10.5px] text-[#6B7D70]">
                Bisa dihapus sampai angka 0 & tervalidasi non-negatif.
              </p>

              {/* Quick Helper Chips (helpful, without locking input) */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => setStudentInput('250')}
                  className="text-[10px] px-1.5 py-0.5 rounded-md bg-white border border-[#CDE0C4] text-[#17331D] hover:bg-[#E8F5E4] hover:text-[#087F23] transition-colors"
                  title="Pilih 250 Siswa"
                >
                  250
                </button>
                <button
                  type="button"
                  onClick={() => setStudentInput('500')}
                  className="text-[10px] px-1.5 py-0.5 rounded-md bg-white border border-[#CDE0C4] text-[#17331D] hover:bg-[#E8F5E4] hover:text-[#087F23] transition-colors"
                  title="Pilih 500 Siswa"
                >
                  500
                </button>
                <button
                  type="button"
                  onClick={() => setStudentInput('1000')}
                  className="text-[10px] px-1.5 py-0.5 rounded-md bg-white border border-[#CDE0C4] text-[#17331D] hover:bg-[#E8F5E4] hover:text-[#087F23] transition-colors"
                  title="Pilih 1000 Siswa"
                >
                  1K
                </button>
              </div>
            </div>
          </div>

          {/* Standar Gramasi per Siswa */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="portion-grams-select" className="text-xs font-bold text-[#17331D]">
                Standar Gramasi Buah per Siswa
              </label>
              <span className="text-[10px] text-[#087F23] font-bold bg-[#E8F5E4] px-1.5 py-0.5 rounded">
                {portionGrams} gram
              </span>
            </div>

            <div className="relative">
              <select
                id="portion-grams-select"
                value={portionGrams}
                onChange={(e) => setPortionGrams(Number(e.target.value))}
                className="w-full bg-[#F7FAF5] border border-[#CDE0C4] rounded-xl px-3.5 py-2.5 text-xs font-semibold text-[#17331D] transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#087F23] focus:border-[#087F23] appearance-none pr-9 cursor-pointer"
              >
                <option value={75}>75 gram / porsi — TK & SD Kelas 1-3 (Porsi Ringan)</option>
                <option value={85}>85 gram / porsi — SD Kelas 4-6 (Standar Nasional)</option>
                <option value={100}>100 gram / porsi — SMP / SMA / Santri (Porsi Penuh)</option>
                <option value={120}>120 gram / porsi — Asrama & Atlet Pelajar (Ekstra)</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#6B7D70]">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
            <p className="text-[10.5px] text-[#6B7D70] mt-1.5">
              Disarankan 85g untuk standar seimbang vitamin dan kecukupan energi harian.
            </p>
          </div>

        </div>

        {/* Row 2: Dropdown Rekomendasi Buah (minimal 6-8 variasi + emoji + rotasi 5 hari + opsi kustom) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="fruit-recommendation-select" className="text-xs font-bold text-[#17331D] flex items-center gap-1">
              <span>Dropdown Rekomendasi Buah</span>
              <span className="text-[10.5px] font-normal text-[#6B7D70]">({FRUIT_PACKAGE_OPTIONS.length} Pilihan Paket Segar)</span>
            </label>
            <span className="text-[10px] text-[#087F23] font-bold">Variasi Higienis</span>
          </div>

          <div className="relative">
            <select
              id="fruit-recommendation-select"
              value={selectedPackage}
              onChange={(e) => setSelectedPackage(e.target.value)}
              className="w-full bg-[#F7FAF5] border border-[#CDE0C4] rounded-xl px-3.5 py-2.5 text-xs font-semibold text-[#17331D] transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#087F23] focus:border-[#087F23] appearance-none pr-9 cursor-pointer"
            >
              {FRUIT_PACKAGE_OPTIONS.map((pkg) => (
                <option key={pkg.id} value={pkg.label}>
                  {pkg.label}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#6B7D70]">
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>

          {/* Description hint of active package */}
          <div className="mt-2 text-[11px] text-[#17331D] bg-white p-2.5 rounded-xl border border-[#CDE0C4] flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-[#087F23] shrink-0" />
            <span className="font-medium">{currentPkg.desc}</span>
          </div>
        </div>

        {/* Row 3: Input Text Request Khusus (kolom teks fleksibel tepat di bawah dropdown) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="custom-fruit-text" className="text-xs font-bold text-[#17331D] flex items-center gap-1.5">
              <span>Input Text Request Khusus Kombinasi Buah</span>
              {isCustomSelected && (
                <span className="text-[10px] bg-[#087F23] text-white font-bold px-2 py-0.5 rounded-full animate-pulse">
                  Wajib Diisi untuk Opsi Kustom
                </span>
              )}
            </label>
            <span className="text-[10px] text-[#6B7D70] font-medium">Kolom Teks Fleksibel</span>
          </div>

          <textarea
            id="custom-fruit-text"
            rows={2}
            value={customFruitRequest}
            onChange={(e) => setCustomFruitRequest(e.target.value)}
            placeholder={
              isCustomSelected 
                ? "Tuliskan manual kombinasi buah spesifik yang Anda inginkan (misal: 'Senin Pisang Ambon Lumajang, Selasa Jeruk Santang Manis, Rabu Apel Fuji, Kamis Semangka Potong, Jumat Melon Golden')..."
                : "Ketik manual kombinasi buah spesifik atau catatan potong/kemasan yang diinginkan (Contoh: 'Senin Pisang + Jeruk, Kamis Apel + Melon, tanpa biji tajam')..."
            }
            className={`w-full bg-[#F7FAF5] border rounded-xl px-3.5 py-2.5 text-xs font-semibold text-[#17331D] placeholder:text-[#8FA393] transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#087F23] focus:border-[#087F23] resize-y ${
              isCustomSelected ? 'border-[#087F23] ring-1 ring-[#087F23]/30 bg-white' : 'border-[#CDE0C4]'
            }`}
          />
          <p className="text-[10.5px] text-[#6B7D70] mt-1.5">
            Kolom teks fleksibel tempat pelanggan bisa mengetik manual kombinasi buah spesifik, jadwal rotasi khusus, atau catatan alergi sekolah.
          </p>
        </div>

      </div>

      {/* Real-time Calculation Result Banner */}
      <div className="bg-gradient-to-br from-[#17331D] via-[#1C3E23] to-[#087F23] text-white p-4 sm:p-5 rounded-2xl shadow-md space-y-3.5 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-48 h-48 bg-white/5 rounded-full blur-xl pointer-events-none"></div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 relative z-10">
          
          <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-xl border border-white/15">
            <span className="text-[10px] text-green-200 uppercase font-black block tracking-wider">
              Total Buah Bersih Harian:
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl sm:text-2xl font-black text-[#FFD54F]">
                ± {dailyKg.toLocaleString('id-ID')}
              </span>
              <span className="text-xs font-bold text-white">Kg / Hari</span>
            </div>
            <span className="text-[9.5px] text-green-200/80 block mt-0.5">
              {parsedStudents.toLocaleString('id-ID')} siswa × {portionGrams}g standar
            </span>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-xl border border-white/15">
            <span className="text-[10px] text-green-200 uppercase font-black block tracking-wider">
              Estimasi Porsi & Dus:
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl sm:text-2xl font-black text-white">
                ± {Math.ceil(dailyKg / 15) || 0}
              </span>
              <span className="text-xs font-bold text-white">Dus / Keranjang</span>
            </div>
            <span className="text-[9.5px] text-green-200/80 block mt-0.5">
              Acuan dus 13 - 17 Kg berpendingin
            </span>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-xl border border-white/15">
            <span className="text-[10px] text-green-200 uppercase font-black block tracking-wider">
              Estimasi Anggaran Harian:
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-lg sm:text-xl font-black text-[#FFD54F]">
                Rp {estimatedDailyTotal.toLocaleString('id-ID')}
              </span>
            </div>
            <span className="text-[9.5px] text-green-200/80 block mt-0.5">
              Acuan ± Rp {estimatedPortionCost.toLocaleString('id-ID')} / porsi anak
            </span>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10 border-t border-white/15">
          <div className="flex items-center gap-2 text-[11px] text-green-100">
            <CheckCircle2 className="w-4 h-4 text-[#FFD54F] shrink-0" />
            <span>Kapasitas suplai harian hingga 15.000+ porsi / hari di Cianjur & Jabar.</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleCopySummary}
              className="flex-1 sm:flex-none bg-white/15 hover:bg-white/25 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 border border-white/20 active:scale-95"
              title="Salin Rincian Simulasi"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#FFD54F]" />
                  <span className="text-[#FFD54F]">Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin Teks</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDirectWhatsApp}
              className="flex-1 sm:flex-none bg-[#FFD54F] hover:bg-[#FFCA28] text-[#17331D] font-black text-xs px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 shrink-0"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Kirim Simulasi ke WhatsApp</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
