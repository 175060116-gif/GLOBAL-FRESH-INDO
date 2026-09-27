import React from 'react';
import { 
  Sparkles, Truck, ShieldCheck, Award, ArrowRight, 
  CheckCircle2, Thermometer, ShoppingBag, Store
} from 'lucide-react';
import { ActiveTab } from './Navbar';

interface HeroSectionProps {
  onNavigate: (tab: ActiveTab) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F2F8ED] via-[#F7FAF5] to-white pt-6 pb-12 md:pt-10 md:pb-16 border-b border-[#E2EBD8]">
      {/* Subtle organic background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#55AA00]/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#FF7F00]/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4">
        {/* Main Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Copy & CTAs */}
          <div className="lg:col-span-7 space-y-5">
            {/* Top pill badge */}
            <div className="inline-flex items-center gap-2 bg-[#E8F5E4] border border-[#CDE0C4] px-3.5 py-1.5 rounded-full text-xs font-bold text-[#087F23] shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#55AA00]" />
              <span>DISTRIBUTOR & SUPPLIER BUAH SEGAR RESMI CIANJUR</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#17331D] tracking-tight leading-[1.18]">
              Buah Segar Langsung ke Meja Anda dari{' '}
              <span className="text-[#087F23] underline decoration-[#55AA00]/40 decoration-wavy">
                Petani Lokal
              </span>{' '}
              dan Kebun Dunia.
            </h1>

            {/* Subtext */}
            <p className="text-[#6B7D70] text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
              Pilihan buah berkualitas untuk kebutuhan rumah tangga, bisnis kuliner, restoran, hotel bintang, 
              katering pesta, supermarket, dan distributor di Cianjur, Sukabumi, Bandung Raya, 
              Jabodetabek serta pengiriman antar-kota.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('pricelist')}
                className="flex items-center gap-2 bg-[#FF7F00] hover:bg-[#E67200] text-white px-6 py-3.5 rounded-xl font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all transform active:scale-95"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Belanja Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('b2b')}
                className="flex items-center gap-2 bg-[#087F23] hover:bg-[#005500] text-white border-2 border-[#087F23] px-6 py-3.5 rounded-xl font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all transform active:scale-95"
              >
                <Store className="w-5 h-5" />
                <span>Pesan Grosir & B2B</span>
              </button>

              <button
                onClick={() => onNavigate('fastorder')}
                className="flex items-center gap-1.5 bg-white hover:bg-[#F2F8ED] text-[#087F23] border border-[#CDE0C4] px-4 py-3.5 rounded-xl font-bold text-sm transition-all"
              >
                <span>⚡ Fast Order WA</span>
              </button>
            </div>

            {/* 4 Feature Badges matching Image 2 & 3 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#E2EBD8]">
              <div className="flex items-start gap-2 bg-white/80 p-2.5 rounded-lg border border-[#E2EBD8]">
                <div className="w-7 h-7 rounded-md bg-[#E8F5E4] text-[#087F23] flex items-center justify-center shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#17331D]">Fresh Quality</h4>
                  <p className="text-[11px] text-[#6B7D70]">Buah pilihan grade super</p>
                </div>
              </div>

              <div className="flex items-start gap-2 bg-white/80 p-2.5 rounded-lg border border-[#E2EBD8]">
                <div className="w-7 h-7 rounded-md bg-[#E8F5E4] text-[#087F23] flex items-center justify-center shrink-0">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#17331D]">Fast Delivery</h4>
                  <p className="text-[11px] text-[#6B7D70]">Mobil berpendingin sejuk</p>
                </div>
              </div>

              <div className="flex items-start gap-2 bg-white/80 p-2.5 rounded-lg border border-[#E2EBD8]">
                <div className="w-7 h-7 rounded-md bg-[#E8F5E4] text-[#087F23] flex items-center justify-center shrink-0">
                  <Store className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#17331D]">Wholesale B2B</h4>
                  <p className="text-[11px] text-[#6B7D70]">Solusi pasokan bisnis</p>
                </div>
              </div>

              <div className="flex items-start gap-2 bg-white/80 p-2.5 rounded-lg border border-[#E2EBD8]">
                <div className="w-7 h-7 rounded-md bg-[#E8F5E4] text-[#087F23] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#17331D]">Garansi 100%</h4>
                  <p className="text-[11px] text-[#6B7D70]">Tukar 24 jam pasti manis</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Showcase matching Image 3 */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-gradient-to-tr from-[#087F23]/10 to-[#FF7F00]/10">
              <img
                src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=1000&q=80"
                alt="Pilihan Buah Segar Global Fresh Indo"
                className="w-full h-[360px] sm:h-[440px] object-cover hover:scale-105 transition-transform duration-700"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>

              {/* Top Floating QC Badge */}
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-lg border border-white flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#55AA00] animate-ping"></div>
                <div className="text-left">
                  <div className="text-[10px] text-[#6B7D70] uppercase font-bold tracking-wider">Quality Control</div>
                  <div className="text-xs font-black text-[#087F23]">QC Batch Lolos Sortir: Pagi Ini</div>
                </div>
              </div>

              {/* Warehouse Temp Badge */}
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-lg border border-white flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-[#087F23]" />
                <div className="text-left">
                  <div className="text-[10px] text-[#6B7D70] font-bold">Gudang Utama</div>
                  <div className="text-xs font-black text-[#17331D]">3.8°C <span className="text-[#087F23] text-[10px]">(OPTIMAL)</span></div>
                </div>
              </div>

              {/* Bottom Floating Card */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/80">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-[#FF7F00] uppercase tracking-wider block">
                      Spesial Panen Segar Hari Ini
                    </span>
                    <h3 className="font-extrabold text-sm text-[#17331D]">
                      Apel Fuji, Shine Muscat, Alpukat Mentega Miki
                    </h3>
                  </div>
                  <button
                    onClick={() => onNavigate('pricelist')}
                    className="bg-[#087F23] hover:bg-[#005500] text-white text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1 transition-colors"
                  >
                    <span>Cek Harga</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Decorative Floating Mini Badge */}
            <div className="hidden sm:flex absolute -bottom-4 -left-4 bg-[#087F23] text-white p-3 rounded-2xl shadow-xl border-2 border-white items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-black text-lg">
                24h
              </div>
              <div className="text-left pr-2">
                <div className="text-xs font-extrabold">Garansi Penggantian</div>
                <div className="text-[10px] text-green-100">Bila buah rusak / asam</div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Metrics Numbers Bar - exact copy from Image 3 */}
        <div className="mt-12 pt-8 border-t border-[#E2EBD8] grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
          <div className="bg-white p-4 rounded-2xl border border-[#E2EBD8] shadow-xs">
            <div className="text-3xl lg:text-4xl font-black text-[#087F23]">15+ TAHUN</div>
            <p className="text-xs text-[#6B7D70] mt-1 font-medium">
              Pengalaman dedikasi menjaga rantai pasok buah nasional terpercaya
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#E2EBD8] shadow-xs">
            <div className="text-3xl lg:text-4xl font-black text-[#FF7F00]">50+ TON</div>
            <p className="text-xs text-[#6B7D70] mt-1 font-medium">
              Distribusi buah segar pilihan terkirim secara konsisten setiap bulannya
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#E2EBD8] shadow-xs">
            <div className="text-3xl lg:text-4xl font-black text-[#087F23]">450+ MITRA</div>
            <p className="text-xs text-[#6B7D70] mt-1 font-medium">
              Hotel bintang, restoran, kafe jus, katering & retail langganan setia
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#E2EBD8] shadow-xs">
            <div className="text-3xl lg:text-4xl font-black text-[#55AA00]">99.4%</div>
            <p className="text-xs text-[#6B7D70] mt-1 font-medium">
              Indeks kepuasan klien: akurasi timbangan, mutu grade & tepat waktu
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
