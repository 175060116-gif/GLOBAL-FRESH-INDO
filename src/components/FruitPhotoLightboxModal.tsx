import React, { useState, useEffect } from 'react';
import { 
  X, ZoomIn, ZoomOut, RotateCcw, ChevronLeft, ChevronRight, 
  ShoppingBag, MessageCircle, Star, Sparkles, ShieldCheck, 
  Thermometer, Award, Check, Heart 
} from 'lucide-react';
import { Product } from '../data/products';
import { StoreSettings } from '../data/storeSettings';

interface FruitPhotoLightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  productsList: Product[];
  onSelectProduct: (p: Product) => void;
  onAddToCart: (p: Product, qty: number, tier: '1kg' | '5kg' | 'grosir') => void;
  storeSettings: StoreSettings;
  isWishlisted?: boolean;
  onToggleWishlist?: (id: string) => void;
}

export const FruitPhotoLightboxModal: React.FC<FruitPhotoLightboxModalProps> = ({
  isOpen,
  onClose,
  product,
  productsList,
  onSelectProduct,
  onAddToCart,
  storeSettings,
  isWishlisted = false,
  onToggleWishlist,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    // Reset zoom when product changes
    setZoomLevel(1);
    setIsAdded(false);
  }, [product]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || !product) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  const currentIndex = productsList.findIndex((p) => p.id === product.id);

  const handleNext = () => {
    if (currentIndex < productsList.length - 1) {
      onSelectProduct(productsList[currentIndex + 1]);
    } else {
      onSelectProduct(productsList[0]);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      onSelectProduct(productsList[currentIndex - 1]);
    } else {
      onSelectProduct(productsList[productsList.length - 1]);
    }
  };

  const toggleZoom = () => {
    setZoomLevel((prev) => (prev === 1 ? 1.6 : prev === 1.6 ? 2.2 : 1));
  };

  const handleQuickAdd = () => {
    onAddToCart(product, 1, '1kg');
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const waText = encodeURIComponent(
    `Halo ${storeSettings.storeName}, saya tertarik memesan buah *${product.name}* (Grade ${product.grade}) seharga Rp ${product.retailPrice.toLocaleString('id-ID')}/${product.unit}. Apakah stok panen hari ini tersedia?`
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      
      {/* Lightbox Container */}
      <div className="relative w-full max-w-5xl bg-[#131E15] rounded-3xl border border-[#087F23]/30 shadow-2xl overflow-hidden flex flex-col lg:flex-row text-white">
        
        {/* Close Button Top Right */}
        <button
          onClick={onClose}
          aria-label="Tutup Pratinjau Foto"
          className="absolute top-4 right-4 z-30 p-2.5 bg-black/60 hover:bg-black/90 text-white rounded-full backdrop-blur-sm transition-all hover:scale-105 border border-white/20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* LEFT / CENTER: Interactive Fruit Photo Viewer */}
        <div className="relative flex-1 bg-black/50 flex items-center justify-center min-h-[350px] sm:min-h-[460px] lg:min-h-[560px] overflow-hidden group select-none">
          
          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            aria-label="Foto Buah Sebelumnya"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/50 hover:bg-[#087F23] text-white backdrop-blur-sm border border-white/10 transition-all hover:scale-110 active:scale-95"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNext}
            aria-label="Foto Buah Selanjutnya"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/50 hover:bg-[#087F23] text-white backdrop-blur-sm border border-white/10 transition-all hover:scale-110 active:scale-95"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Interactive Zoomable Image with Smooth Scale */}
          <div 
            onClick={toggleZoom}
            className="w-full h-full flex items-center justify-center cursor-zoom-in overflow-hidden p-4 relative"
            title="Klik untuk memperbesar / zoom foto buah"
          >
            <img
              src={product.image}
              alt={product.name}
              referrerPolicy="no-referrer"
              style={{
                transform: `scale(${zoomLevel})`,
                transition: 'transform 0.4s cubic-bezier(0.2, 0, 0.2, 1)',
              }}
              className="max-h-[480px] w-auto max-w-full object-contain rounded-2xl shadow-2xl drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)]"
            />
            
            {/* Shimmer sweep overlay */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
          </div>

          {/* Floating Controls Bar at Bottom */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-black/70 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 shadow-lg text-xs font-semibold">
            <button
              onClick={() => setZoomLevel((z) => Math.max(1, +(z - 0.5).toFixed(1)))}
              disabled={zoomLevel <= 1}
              className="p-1.5 hover:text-[#55AA00] disabled:opacity-30 disabled:hover:text-white transition-colors"
              title="Perkecil"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="w-12 text-center text-[11px] font-mono font-bold text-[#FFD54F]">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(2.5, +(z + 0.5).toFixed(1)))}
              disabled={zoomLevel >= 2.5}
              className="p-1.5 hover:text-[#55AA00] disabled:opacity-30 disabled:hover:text-white transition-colors"
              title="Perbesar"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <div className="w-px h-3.5 bg-white/20 mx-1"></div>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-1.5 hover:text-[#55AA00] transition-colors"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Interactive Floating Freshness Tags */}
          <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 pointer-events-none">
            <div className="bg-[#087F23]/90 backdrop-blur-md text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-lg border border-white/20 flex items-center gap-1.5 animate-fruit-float">
              <Sparkles className="w-3.5 h-3.5 text-[#FFD54F]" />
              <span>{product.grade}</span>
            </div>
            {product.sweetnessBrix && (
              <div className="bg-[#FF7F00]/90 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-md border border-white/20 animate-fruit-float-delay">
                🍯 Brix: {product.sweetnessBrix}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDE: Interactive Fruit Intelligence & Quick Actions */}
        <div className="lg:w-96 p-6 sm:p-7 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-[#087F23]/25 bg-gradient-to-b from-[#131E15] to-[#17271A]">
          
          <div className="space-y-4">
            
            {/* Header / Origin */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-[#55AA00] uppercase tracking-wider bg-[#087F23]/20 px-2.5 py-1 rounded-lg border border-[#087F23]/30">
                {product.category === 'lokal' ? '🇮🇩 Panen Lokal Unggulan' : product.category === 'import' ? '✈️ Buah Import Premium' : '🎁 Parcel & Hampers'}
              </span>
              
              {onToggleWishlist && (
                <button
                  onClick={() => onToggleWishlist(product.id)}
                  aria-label="Favoritkan buah"
                  className={`p-2 rounded-full border transition-all ${
                    isWishlisted
                      ? 'bg-red-500/20 border-red-500 text-red-400'
                      : 'bg-white/5 border-white/15 text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-400' : ''}`} />
                </button>
              )}
            </div>

            {/* Title & Subtitle */}
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {product.name}
              </h2>
              <p className="text-xs text-[#A1B8A4] mt-1 line-clamp-2">
                {product.subtitle}
              </p>
            </div>

            {/* Interactive Rating & Origin */}
            <div className="flex items-center gap-3 text-xs bg-white/5 p-2.5 rounded-xl border border-white/10">
              <div className="flex items-center gap-1 text-[#FFD54F] font-bold">
                <Star className="w-4 h-4 fill-[#FFD54F]" />
                <span>{product.rating}</span>
                <span className="text-[#A1B8A4] font-normal">({product.reviewsCount})</span>
              </div>
              <span className="text-white/30">•</span>
              <span className="text-white/80">Asal: <strong>{product.origin}</strong></span>
              <span className="text-white/30">•</span>
              <span className="text-[#55AA00] font-semibold">Stok: {product.stockKg} kg</span>
            </div>

            {/* Fresh Fruit Specifications Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-black/30 p-2.5 rounded-xl border border-white/5">
                <div className="text-[10px] text-[#A1B8A4] flex items-center gap-1">
                  <Thermometer className="w-3 h-3 text-[#55AA00]" />
                  <span>Suhu Simpan</span>
                </div>
                <div className="font-bold text-white mt-0.5">{product.storageTemp || '2°C - 8°C'}</div>
              </div>
              <div className="bg-black/30 p-2.5 rounded-xl border border-white/5">
                <div className="text-[10px] text-[#A1B8A4] flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#FF7F00]" />
                  <span>Garansi Manis</span>
                </div>
                <div className="font-bold text-white mt-0.5">Tukar 24 Jam</div>
              </div>
            </div>

            {/* Price Showcase */}
            <div className="bg-gradient-to-r from-[#087F23]/25 to-transparent p-3.5 rounded-2xl border border-[#087F23]/40">
              <div className="text-[11px] text-[#A1B8A4]">Harga Eceran Fresh:</div>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-black text-[#55AA00]">
                  Rp {product.retailPrice.toLocaleString('id-ID')}
                </span>
                <span className="text-xs text-[#A1B8A4]">/{product.unit}</span>
              </div>
              <div className="text-[11px] text-[#FF9E40] mt-1 font-semibold flex items-center justify-between">
                <span>Grosir: Rp {product.wholesalePrice.toLocaleString('id-ID')} / {product.wholesaleUnitDesc}</span>
                <span className="text-[10px] bg-[#FF7F00]/20 px-2 py-0.5 rounded text-[#FFB74D]">Min {product.wholesaleMinQty}kg</span>
              </div>
            </div>

            {/* Quality Checklist */}
            <div className="space-y-1.5 text-[11px] text-[#A1B8A4]">
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#55AA00] shrink-0" />
                <span>Dipetik matang pohon & disortir grade premium</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#55AA00] shrink-0" />
                <span>Pengiriman armada dingin menjaga kesegaran sel buah</span>
              </div>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-5 mt-4 border-t border-white/10">
            <button
              onClick={handleQuickAdd}
              className={`w-full py-3.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all transform active:scale-95 ${
                isAdded
                  ? 'bg-[#087F23] text-white ring-2 ring-white/50 scale-102'
                  : 'bg-[#FF7F00] hover:bg-[#E67200] text-white hover:scale-102'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4 text-white animate-bounce" />
                  <span>Berhasil Masuk Keranjang!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Beli Sekarang (+ Masuk Keranjang)</span>
                </>
              )}
            </button>

            <a
              href={`https://wa.me/${storeSettings.whatsappNumber}?text=${waText}`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all border border-white/15"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>Tanya Ketersediaan Panen via WhatsApp</span>
            </a>
          </div>

        </div>

      </div>
    </div>
  );
};
