import React from 'react';
import { 
  ShieldCheck, Truck, Store, Gift, CheckCircle2, 
  ArrowRight, Phone, Clock, MapPin, Star, Building2, 
  Sparkles, Award, FileSpreadsheet, Check, Camera, ZoomIn, Package, Calculator
} from 'lucide-react';
import { Product } from '../data/products';
import { ActiveTab } from './Navbar';
import { BusinessUnitCard, DEFAULT_BUSINESS_UNITS } from '../data/businessUnits';
import { StoreSettings } from '../data/storeSettings';

interface HomeSectionsProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onNavigate: (tab: ActiveTab) => void;
  onSelectProduct: (product: Product) => void;
  onPreviewFruitPhoto?: (product: Product) => void;
  onOpenBgnModal?: () => void;
  businessUnits?: BusinessUnitCard[];
  isAdmin?: boolean;
  onEditBusinessUnit?: (card: BusinessUnitCard) => void;
  storeSettings?: StoreSettings;
  onOpenEditFarmerImage?: () => void;
}

export const HomeSections: React.FC<HomeSectionsProps> = ({
  products,
  onAddToCart,
  onNavigate,
  onSelectProduct,
  onPreviewFruitPhoto,
  onOpenBgnModal,
  businessUnits = DEFAULT_BUSINESS_UNITS,
  isAdmin = false,
  onEditBusinessUnit,
  storeSettings,
  onOpenEditFarmerImage,
}) => {
  const featured = products.slice(0, 4);

  const retailCard = businessUnits.find(u => u.id === 'retail') || DEFAULT_BUSINESS_UNITS[0];
  const b2bCard = businessUnits.find(u => u.id === 'b2b') || DEFAULT_BUSINESS_UNITS[1];
  const bgnCard = businessUnits.find(u => u.id === 'bgn') || DEFAULT_BUSINESS_UNITS[2];

  return (
    <div className="space-y-16 py-8">
      {/* 1. Unit Bisnis & Layanan (Exact match with toolbar.PNG) */}
      <section className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div className="max-w-2xl">
            <span className="text-xs font-black text-[#087F23] uppercase tracking-wider block mb-1">
              UNIT BISNIS & LAYANAN
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#17331D] tracking-tight leading-tight">
              Disesuaikan untuk Setiap Kebutuhan Konsumsi & Usaha
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#6B7D70] max-w-md leading-relaxed">
            Mulai dari meja makan keluarga hingga dapur hotel bintang lima, kami memiliki prosedur pemenuhan khusus yang terkalibrasi.
          </p>
        </div>

        {/* 3 Pillars Cards Grid matching toolbar.PNG */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          
          {/* Card 1: Ritel & Rumah Tangga */}
          <div className="bg-white rounded-3xl border border-[#E2EBD8] overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md transition-all group relative">
            <div>
              {/* Photo */}
              <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-gray-100">
                <img
                  src={retailCard.imageUrl}
                  alt={retailCard.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-[#17331D] text-[11px] font-bold px-3 py-1 rounded-full shadow-xs border border-white">
                  {retailCard.badgeLeft}
                </div>

                {/* Admin Customize Photo & Name Button */}
                {isAdmin && onEditBusinessUnit && (
                  <button
                    type="button"
                    onClick={() => onEditBusinessUnit(retailCard)}
                    className="absolute bottom-3 right-3 z-20 bg-white/95 hover:bg-[#087F23] hover:text-white text-[#17331D] text-[10.5px] font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 transition-all border border-[#CDE0C4] hover:scale-105"
                    title="Ganti foto atau nama bagian ritel"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Ganti Foto & Nama</span>
                  </button>
                )}
              </div>

              {/* Body */}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-lg font-black text-[#17331D]">
                    {retailCard.title}
                  </h3>
                  <p className="text-xs text-[#6B7D70] mt-2 leading-relaxed">
                    {retailCard.description}
                  </p>
                </div>

                {/* Checklist */}
                <ul className="space-y-2 text-xs text-[#17331D]">
                  {retailCard.checklist.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#087F23] shrink-0" strokeWidth={2.5} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Action Link */}
            <div className="px-6 pb-6 pt-3 border-t border-[#E2EBD8]/60">
              <button
                onClick={() => onNavigate('pricelist')}
                className="text-xs font-bold text-[#087F23] hover:text-[#06631B] flex items-center gap-1.5 transition-colors group-hover:translate-x-1 duration-200"
              >
                <span>{retailCard.actionLabel || 'Pesan Buah Ritel'}</span>
                <span className="font-mono text-sm">&gt;</span>
              </button>
            </div>
          </div>

          {/* Card 2: Pasokan Resto, Hotel & Katering (PALING BANYAK DIPILIH) */}
          <div className="bg-white rounded-3xl border-2 border-[#087F23] overflow-hidden flex flex-col justify-between shadow-md hover:shadow-xl transition-all group relative">
            <div>
              {/* Photo with Badges */}
              <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-gray-100">
                <img
                  src={b2bCard.imageUrl}
                  alt={b2bCard.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-[#17331D] text-[11px] font-bold px-3 py-1 rounded-full shadow-xs border border-white">
                  {b2bCard.badgeLeft}
                </div>
                {b2bCard.badgeRight && (
                  <div className="absolute top-3 right-3 bg-[#087F23] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
                    {b2bCard.badgeRight}
                  </div>
                )}

                {/* Admin Customize Photo & Name Button */}
                {isAdmin && onEditBusinessUnit && (
                  <button
                    type="button"
                    onClick={() => onEditBusinessUnit(b2bCard)}
                    className="absolute bottom-3 right-3 z-20 bg-white/95 hover:bg-[#087F23] hover:text-white text-[#17331D] text-[10.5px] font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 transition-all border border-[#CDE0C4] hover:scale-105"
                    title="Ganti foto atau nama bagian Resto, Hotel & Katering"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Ganti Foto & Nama</span>
                  </button>
                )}
              </div>

              {/* Body */}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-lg font-black text-[#17331D]">
                    {b2bCard.title}
                  </h3>
                  <p className="text-xs text-[#6B7D70] mt-2 leading-relaxed">
                    {b2bCard.description}
                  </p>
                </div>

                {/* Checklist */}
                <ul className="space-y-2 text-xs text-[#17331D]">
                  {b2bCard.checklist.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#087F23] shrink-0" strokeWidth={2.5} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Action Link */}
            <div className="px-6 pb-6 pt-3 border-t border-[#E2EBD8]/60">
              <button
                onClick={() => onNavigate('b2b')}
                className="text-xs font-bold text-[#087F23] hover:text-[#06631B] flex items-center gap-1.5 transition-colors group-hover:translate-x-1 duration-200"
              >
                <span>{b2bCard.actionLabel || 'Daftar Akun Bisnis B2B'}</span>
                <span className="font-mono text-sm">&gt;</span>
              </button>
            </div>
          </div>

          {/* Card 3: Suplai Buah Dapur Gizi & Badan Gizi Nasional (BGN) */}
          <div className="bg-white rounded-3xl border border-[#E2EBD8] overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md transition-all group relative">
            <div>
              {/* Graphic Banner or Photo matching BGN Identity in toolbar.PNG */}
              {bgnCard.imageUrl ? (
                <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-gray-900">
                  <img
                    src={bgnCard.imageUrl}
                    alt={bgnCard.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-white/95 text-[#17331D] text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 sm:py-1 rounded-full shadow-xs">
                    {bgnCard.badgeLeft}
                  </div>
                  {bgnCard.badgeRight && (
                    <div className="absolute top-3 right-3 bg-[#087F23] text-white text-[9.5px] sm:text-[10px] font-black px-2.5 py-0.5 sm:py-1 rounded-full uppercase tracking-wider shadow-xs">
                      {bgnCard.badgeRight}
                    </div>
                  )}

                  {isAdmin && onEditBusinessUnit && (
                    <button
                      type="button"
                      onClick={() => onEditBusinessUnit(bgnCard)}
                      className="absolute bottom-3 right-3 z-20 bg-white/95 hover:bg-[#087F23] hover:text-white text-[#17331D] text-[10.5px] font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 transition-all border border-[#CDE0C4] hover:scale-105"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Ganti Foto & Teks</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="relative h-48 sm:h-52 w-full bg-gradient-to-br from-[#1E2328] via-[#2D343C] to-[#181C20] p-4 flex flex-col justify-between overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(8,127,35,0.25),transparent_70%)] pointer-events-none"></div>

                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 relative z-10">
                    <div className="bg-white/95 text-[#17331D] text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 sm:py-1 rounded-full shadow-xs">
                      {bgnCard.badgeLeft}
                    </div>
                    {bgnCard.badgeRight && (
                      <div className="bg-[#087F23] text-white text-[9.5px] sm:text-[10px] font-black px-2.5 py-0.5 sm:py-1 rounded-full uppercase tracking-wider shadow-xs">
                        {bgnCard.badgeRight}
                      </div>
                    )}
                  </div>

                  {/* Center BGN Brand Emblem */}
                  <div className="flex items-center gap-3 relative z-10 my-auto">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-b from-[#FFF8E1] to-[#FFE082] p-0.5 border border-[#FFD54F] shadow-md flex items-center justify-center shrink-0">
                      <div className="w-full h-full rounded-xl bg-[#102015] flex flex-col items-center justify-center text-center p-0.5">
                        <span className="text-xs">🇮🇩</span>
                        <span className="text-[7px] text-[#FFD54F] font-black leading-none mt-0.5">BGN</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-xs sm:text-sm font-black text-white tracking-wider block">
                        BADAN GIZI NASIONAL
                      </span>
                      <span className="text-[9px] text-[#FFD54F] font-semibold tracking-wide">
                        REPUBLIK INDONESIA
                      </span>
                    </div>
                  </div>

                  {/* Bottom Overlay Text & Admin Button */}
                  <div className="relative z-10 pt-1 flex items-end justify-between">
                    <div>
                      <h4 className="text-sm sm:text-base font-black text-white leading-tight">
                        {bgnCard.bannerTitle || 'Program Makan Bergizi Gratis'}
                      </h4>
                      <p className="text-[10.5px] text-green-200/90 font-medium">
                        {bgnCard.bannerSubtitle || 'Standar Higiene PSAT & Kalori Terukur'}
                      </p>
                    </div>

                    {isAdmin && onEditBusinessUnit && (
                      <button
                        type="button"
                        onClick={() => onEditBusinessUnit(bgnCard)}
                        className="bg-white/90 hover:bg-[#087F23] hover:text-white text-[#17331D] text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 transition-all border border-[#CDE0C4]"
                        title="Kustom info BGN"
                      >
                        <Camera className="w-3 h-3" />
                        <span>Kustom</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Body */}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-lg font-black text-[#17331D]">
                    {bgnCard.title}
                  </h3>
                  <p className="text-xs text-[#6B7D70] mt-2 leading-relaxed">
                    {bgnCard.description}
                  </p>
                </div>

                {/* Checklist with Icons */}
                <ul className="space-y-2.5 text-xs text-[#17331D]">
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#087F23] shrink-0" />
                    <span className="font-semibold text-[#17331D]">{bgnCard.checklist[0] || 'Standar Kalori & Vitamin Terukur'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#087F23] shrink-0" />
                    <span className="font-semibold text-[#17331D]">{bgnCard.checklist[1] || 'Sertifikasi Uji Higiene Pangan'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#087F23] shrink-0" />
                    <span className="font-semibold text-[#17331D]">{bgnCard.checklist[2] || 'Distribusi Tepat Waktu Harian'}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom Action CTA Button */}
            <div className="p-6 pt-2">
              <button
                onClick={() => onOpenBgnModal ? onOpenBgnModal() : onNavigate('b2b')}
                className="w-full py-3 px-4 bg-[#087F23] hover:bg-[#06631B] text-white font-black text-xs rounded-2xl shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
              >
                <Phone className="w-3.5 h-3.5 fill-current" />
                <span>{bgnCard.actionLabel || 'Konsultasi Pengadaan BGN'}</span>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Featured Daily Products Showcase (Image 3 & 5) */}
      <section className="bg-white py-12 border-y border-[#E2EBD8]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#087F23] mb-1">
                <span className="w-2 h-2 rounded-full bg-[#55AA00] animate-pulse"></span>
                <span>PRICELIST HARIAN TERVERIFIKASI</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17331D]">
                Komoditas Unggulan Musim Ini
              </h2>
              <p className="text-xs text-[#6B7D70] mt-1">
                Harga berlaku per hari ini, fluktuasi panen dan sortasi tercatat langsung setiap pagi pukul 07:00 WIB.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate('pricelist')}
                className="flex items-center gap-1.5 text-xs font-bold text-[#087F23] hover:text-[#005500] bg-[#E8F5E4] px-4 py-2 rounded-lg transition-colors"
              >
                <span>Lihat 57+ Pricelist Lengkap</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((product) => (
              <div
                key={product.id}
                className="fruit-card-interactive bg-[#F7FAF5] border border-[#E2EBD8] rounded-2xl overflow-hidden hover:border-[#087F23] hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="relative">
                  {/* Image with interactive sheen and zoom lens */}
                  <div 
                    onClick={() => onPreviewFruitPhoto ? onPreviewFruitPhoto(product) : onSelectProduct(product)}
                    className="fruit-photo-sheen-container h-48 w-full overflow-hidden cursor-pointer bg-neutral-100 relative"
                    title="Klik untuk zoom foto buah"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-112 transition-transform duration-500 ease-out"
                    />
                    
                    {/* Hover Zoom Overlay */}
                    <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                      <div className="bg-white/90 backdrop-blur-xs text-[#087F23] text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 transform group-hover:scale-105 transition-transform">
                        <ZoomIn className="w-3.5 h-3.5" />
                        <span>Zoom Foto</span>
                      </div>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1 pointer-events-none">
                    <span className="bg-[#087F23] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                      {product.grade}
                    </span>
                    {product.discountPercent && (
                      <span className="bg-[#E53935] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-xs">
                        HEMAT {product.discountPercent}%
                      </span>
                    )}
                  </div>

                  <span className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-xs text-[10px] font-semibold text-[#17331D] px-2 py-0.5 rounded-md pointer-events-none">
                    {product.origin}
                  </span>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1 text-[11px] text-[#FBC02D] mb-1 font-bold">
                      <Star className="w-3.5 h-3.5 fill-[#FBC02D]" />
                      <span>{product.rating}</span>
                      <span className="text-[#6B7D70] font-normal">({product.reviewsCount} ulasan)</span>
                    </div>

                    <h3 
                      onClick={() => onSelectProduct(product)}
                      className="font-bold text-sm text-[#17331D] group-hover:text-[#087F23] cursor-pointer line-clamp-1 transition-colors"
                    >
                      {product.name}
                    </h3>
                    <p className="text-[11px] text-[#6B7D70] line-clamp-1 mt-0.5">
                      {product.subtitle}
                    </p>

                    {/* Price Section */}
                    <div className="mt-3 pt-3 border-t border-[#E2EBD8]">
                      <div className="text-[11px] text-[#6B7D70]">Harga Eceran:</div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-black text-[#087F23]">
                          Rp {product.retailPrice.toLocaleString('id-ID')}
                        </span>
                        <span className="text-xs text-[#6B7D70]">/{product.unit}</span>
                      </div>
                      {product.originalRetailPrice && (
                        <span className="text-[11px] text-[#6B7D70] line-through block">
                          Rp {product.originalRetailPrice.toLocaleString('id-ID')}
                        </span>
                      )}

                      {/* Wholesale Info */}
                      <div className="mt-2 bg-[#E8F5E4] p-2 rounded-lg text-[11px] text-[#087F23]">
                        <span className="font-bold block text-[10px] uppercase text-[#55AA00]">Harga Grosir:</span>
                        <span className="font-extrabold">Rp {product.wholesalePrice.toLocaleString('id-ID')}</span>
                        <span className="text-[10px] text-[#17331D] block">{product.wholesaleUnitDesc}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex items-center gap-2">
                    <button
                      onClick={() => onAddToCart(product)}
                      className="flex-1 bg-[#087F23] hover:bg-[#005500] text-white py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <span>+ Keranjang</span>
                    </button>
                    <button
                      onClick={() => onSelectProduct(product)}
                      className="p-2 border border-[#CDE0C4] rounded-xl hover:bg-white text-[#17331D] transition-colors"
                      title="Lihat Detail"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Banner Promo / Full pricelist button */}
          <div className="mt-8 bg-gradient-to-r from-[#E8F5E4] via-[#F0F9ED] to-[#FFF3E0] p-6 rounded-3xl border border-[#CDE0C4] flex flex-col lg:flex-row items-center justify-between gap-5 shadow-xs">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#087F23] text-white flex items-center justify-center shrink-0 shadow-md">
                <Package className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-[#FFD54F] text-[#17331D] text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Terupdate 57+ Produk
                  </span>
                  <span className="text-xs font-bold text-[#087F23]">Pricelist Dus & Karton Resmi</span>
                </div>
                <h4 className="font-extrabold text-base sm:text-lg text-[#17331D]">
                  Daftar Harga Dus & Keranjang Grosir (Kode & Harga Baru)
                </h4>
                <p className="text-xs text-[#6B7D70] max-w-xl">
                  Tersedia tabel lengkap Anggur, Apel Fuji, Jeruk Afourer, Kiwi, Lemon Huida, Delima, Pear Century, Lengkeng Emas, hingga Plum dengan kalkulator belanja terintegrasi.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full lg:w-auto">
              <button
                onClick={() => onNavigate('pricelist')}
                className="flex-1 lg:flex-none bg-[#087F23] hover:bg-[#005500] text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 hover:scale-105"
              >
                <span>Lihat 57+ Pricelist Karton</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onOpenBgnModal ? onOpenBgnModal() : onNavigate('b2b')}
                className="flex-1 lg:flex-none bg-white hover:bg-[#F7FAF5] text-[#17331D] border border-[#CDE0C4] font-bold text-xs px-4 py-3 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 hover:scale-105"
              >
                <Calculator className="w-4 h-4 text-[#087F23]" />
                <span>Kalkulator Gizi MBG</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Company Profile & Direct Farm Values (Image 3) */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E2EBD8] shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Image */}
            <div className="lg:col-span-5 relative group">
              <div className="rounded-2xl overflow-hidden shadow-lg border-2 border-white relative">
                <img
                  src={storeSettings?.farmerImageUrl || '/petani_rambutan.jpg'}
                  alt="Petani Buah Kemitraan Global Fresh Indo"
                  className="w-full h-80 object-cover"
                  referrerPolicy="no-referrer"
                />

                {/* Admin Hover Button Overlay */}
                {isAdmin && onOpenEditFarmerImage && (
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                    <button
                      onClick={onOpenEditFarmerImage}
                      className="bg-white/95 hover:bg-white text-[#17331D] hover:text-[#087F23] px-4 py-2.5 rounded-xl font-bold text-xs shadow-lg flex items-center gap-2 transform transition-transform group-hover:scale-105"
                    >
                      <Camera className="w-4 h-4 text-[#087F23]" />
                      <span>Ganti Foto Petani / Kebun</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Admin Button on Mobile/Always visible when Admin */}
              {isAdmin && onOpenEditFarmerImage && (
                <div className="mt-2.5 flex justify-end">
                  <button
                    onClick={onOpenEditFarmerImage}
                    className="text-xs bg-[#E8F5E4] hover:bg-[#D4EDCE] text-[#087F23] font-bold px-3 py-1.5 rounded-xl border border-[#CDE0C4] flex items-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>📷 Ganti Foto Petani / Kebun</span>
                  </button>
                </div>
              )}
            </div>

            {/* Right Profile Details */}
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-bold text-[#087F23] uppercase tracking-wider">
                Profil Perusahaan
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17331D] tracking-tight">
                Menghadirkan Kemurnian Panen, Memotong Rantai Distribusi yang Berliku.
              </h2>
              <p className="text-xs sm:text-sm text-[#6B7D70] leading-relaxed">
                PT Global Fresh Indo didirikan untuk menjawab tantangan rantai pasok buah di Indonesia: 
                fluktuasi harga yang tidak transparan dan penurunan kualitas buah akibat penanganan logistik yang lambat.
                Kami bermitra langsung dengan kelompok tani lokal unggulan serta importir tersertifikasi.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#F7FAF5] border border-[#E2EBD8]">
                  <CheckCircle2 className="w-4 h-4 text-[#087F23] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-[#17331D]">Standar Sortasi Ketat</h4>
                    <p className="text-[11px] text-[#6B7D70]">Tiga tahap pemilahan: brix manis, tekstur & visual</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#F7FAF5] border border-[#E2EBD8]">
                  <CheckCircle2 className="w-4 h-4 text-[#087F23] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-[#17331D]">Cold Storage Terpusat</h4>
                    <p className="text-[11px] text-[#6B7D70]">Pendingin 2-8°C higienis menjaga nutrisi buah</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#F7FAF5] border border-[#E2EBD8]">
                  <CheckCircle2 className="w-4 h-4 text-[#087F23] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-[#17331D]">Transparansi Harga Harian</h4>
                    <p className="text-[11px] text-[#6B7D70]">Katalog terupdate setiap pagi tanpa biaya tersembunyi</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#F7FAF5] border border-[#E2EBD8]">
                  <CheckCircle2 className="w-4 h-4 text-[#087F23] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-[#17331D]">Kesejahteraan Petani</h4>
                    <p className="text-[11px] text-[#6B7D70]">Penyerapan hasil panen dengan harga adil dan pasti</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Keunggulan Layanan - 4 Cards (Image 3) */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-[#087F23] bg-[#E8F5E4] px-3 py-1 rounded-full uppercase tracking-wider">
            Keunggulan Layanan
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17331D] mt-2">
            Mengapa Menjadikan GLOBAL FRESH INDO Mitra Buah Anda?
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-[#E2EBD8] shadow-xs hover:border-[#087F23] transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#E8F5E4] text-[#087F23] flex items-center justify-center font-black mb-4">
              01
            </div>
            <h3 className="font-bold text-sm text-[#17331D] mb-2">
              Direct From Farm & Direct Import
            </h3>
            <p className="text-xs text-[#6B7D70] leading-relaxed">
              Memotong jalur makelar perantara sehingga harga retail dan grosir menjadi jauh lebih hemat dengan kesegaran maksimal.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E2EBD8] shadow-xs hover:border-[#087F23] transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#E8F5E4] text-[#087F23] flex items-center justify-center font-black mb-4">
              02
            </div>
            <h3 className="font-bold text-sm text-[#17331D] mb-2">
              Teknologi Rantai Dingin Aktif
            </h3>
            <p className="text-xs text-[#6B7D70] leading-relaxed">
              Pengiriman dengan kendaraan berpendingin tertutup melindungi buah dari paparan panas jalanan dan menjaga kelembaban prima.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E2EBD8] shadow-xs hover:border-[#087F23] transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#E8F5E4] text-[#087F23] flex items-center justify-center font-black mb-4">
              03
            </div>
            <h3 className="font-bold text-sm text-[#17331D] mb-2">
              Garansi Tukar 24 Jam Pasti Manis
            </h3>
            <p className="text-xs text-[#6B7D70] leading-relaxed">
              Bila ditemukan buah yang bonyok, asam tidak wajar, atau rusak akibat kiriman, kami ganti gratis tanpa perdebatan.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E2EBD8] shadow-xs hover:border-[#087F23] transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#E8F5E4] text-[#087F23] flex items-center justify-center font-black mb-4">
              04
            </div>
            <h3 className="font-bold text-sm text-[#17331D] mb-2">
              Solusi Horeka & Tempo Pembayaran
            </h3>
            <p className="text-xs text-[#6B7D70] leading-relaxed">
              Dukungan pengiriman subuh jam 05.00 WIB untuk operasional hotel & kafe dengan term of payment (TOP) 14 hingga 30 hari.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Infrastructure & Logistics Hub (Image 3) */}
      <section className="bg-gradient-to-r from-[#17331D] to-[#087F23] text-white py-12 rounded-3xl max-w-7xl mx-auto px-6 sm:px-10 my-8 shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center gap-2 bg-white/20 text-[#FFD54F] px-3 py-1 rounded-full text-xs font-bold">
              <Truck className="w-3.5 h-3.5" />
              <span>ARMADA MANDIRI BERPENDINGIN</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Pusat Distribusi Terpadu & Jalur Logistik Cepat
            </h2>
            <p className="text-xs sm:text-sm text-green-100 leading-relaxed">
              Didukung cold room berkapasitas puluhan ton di Cilaku Cianjur dan armada mobil box berpendingin,
              memastikan pasokan buah tiba dalam kondisi renyah dan dingin di dapur Anda.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-[#FFD54F]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Hub & Gudang Utama (Cianjur)</h4>
                  <p className="text-[11px] text-green-200">Perum Graha Pratama Blok C No 4, Kec. Cilaku, Kab. Cianjur</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-[#FFD54F]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Jadwal Kirim Subuh Khusus Horeka</h4>
                  <p className="text-[11px] text-green-200">Slot pengiriman mulai 05.00 WIB, 09.00 WIB, dan 14.00 WIB</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
              <span className="text-2xl font-black text-[#FFD54F]">Cianjur</span>
              <p className="text-xs text-green-100 mt-1">Layanan Instan & Sameday dalam hitungan jam</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
              <span className="text-2xl font-black text-white">Sukabumi</span>
              <p className="text-xs text-green-100 mt-1">Jalur reguler harian resto & toko buah</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
              <span className="text-2xl font-black text-white">Bandung</span>
              <p className="text-xs text-green-100 mt-1">Koneksi jalur logistik Priangan & Horeka</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
              <span className="text-2xl font-black text-[#FFD54F]">Jabodetabek</span>
              <p className="text-xs text-green-100 mt-1">Distribusi antar-kota armada pendingin</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Testimonials (Image 3) */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold text-[#087F23] bg-[#E8F5E4] px-3 py-1 rounded-full uppercase tracking-wider">
            Testimoni Pelanggan
          </span>
          <h2 className="text-2xl font-extrabold text-[#17331D] mt-2">
            Dipercaya Oleh Pelaku Bisnis & Keluarga
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-[#E2EBD8] shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex text-[#FBC02D]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs text-[#17331D] italic leading-relaxed">
                "Sebagai kitchen manager hotel berbintang, stabilitas mutu buah dan ketepatan jam kirim adalah harga mati. Global Fresh Indo tidak pernah mengecewakan sejak 2 tahun kerja sama."
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-[#E2EBD8] flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#087F23] text-white flex items-center justify-center font-bold text-xs">
                BS
              </div>
              <div>
                <div className="text-xs font-bold text-[#17331D]">Chef Bambang Suryono</div>
                <div className="text-[10px] text-[#6B7D70]">Executive Chef - Hotel Bintang 4</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E2EBD8] shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex text-[#FBC02D]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs text-[#17331D] italic leading-relaxed">
                "Untuk kafe cold-pressed juice kami, kadar manis alami semangka dan manisnya nanas sangat menentukan rasa tanpa gula tambahan. Sortasi buah Grade A di sini konsisten 100%."
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-[#E2EBD8] flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#FF7F00] text-white flex items-center justify-center font-bold text-xs">
                RN
              </div>
              <div>
                <div className="text-xs font-bold text-[#17331D]">Rian Novriansyah</div>
                <div className="text-[10px] text-[#6B7D70]">Owner Frutta Juice Bar & Cafe</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E2EBD8] shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex text-[#FBC02D]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs text-[#17331D] italic leading-relaxed">
                "Pesan hampers parcel buah untuk kolega dokter dan keluarga yang sedang dirawat. Kemasannya mewah, buahnya segar montok dan harum. Pengiriman on-time langsung sampai kamar."
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-[#E2EBD8] flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#55AA00] text-white flex items-center justify-center font-bold text-xs">
                MA
              </div>
              <div>
                <div className="text-xs font-bold text-[#17331D]">dr. Maya Andini, Sp.GK</div>
                <div className="text-[10px] text-[#6B7D70]">Dokter Spesialis Gizi Klinis</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
