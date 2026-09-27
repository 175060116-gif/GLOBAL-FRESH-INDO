import React, { useState } from 'react';
import { 
  X, Star, ShieldCheck, Truck, Thermometer, 
  Minus, Plus, ShoppingBag, MessageCircle, CheckCircle2, Heart 
} from 'lucide-react';
import { Product } from '../data/products';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, qty: number, weightTier?: string) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
}) => {
  if (!product) return null;

  const [selectedWeight, setSelectedWeight] = useState<'500g' | '1kg' | '2kg' | 'grosir'>('1kg');
  const [quantity, setQuantity] = useState(1);

  // Multiplier calculation for weight
  const multiplier = 
    selectedWeight === '500g' ? 0.55 :
    selectedWeight === '1kg' ? 1.0 :
    selectedWeight === '2kg' ? 1.95 :
    product.wholesaleMinQty;

  const currentPrice = selectedWeight === 'grosir' 
    ? product.wholesalePrice * multiplier 
    : Math.round(product.retailPrice * multiplier);

  const handleBuyNow = () => {
    const waUrl = `https://wa.me/6285284633214?text=${encodeURIComponent(
      `Halo Global Fresh Indo, saya ingin memesan langsung:\n• *${product.name}*\n• Pilihan: ${selectedWeight}\n• Jumlah: ${quantity}\n• Total: Rp ${(currentPrice * quantity).toLocaleString('id-ID')}\nMohon infokan nomor rekening & ongkir ke alamat saya.`
    )}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[#E2EBD8] animate-in zoom-in-95 my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="relative">
          <div className="h-64 sm:h-72 w-full overflow-hidden bg-neutral-100">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md text-[#17331D] flex items-center justify-center shadow-md hover:bg-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          <button
            onClick={() => onToggleWishlist(product)}
            className={`absolute top-4 left-4 w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center shadow-md transition-all ${
              isWishlisted ? 'bg-red-500 text-white' : 'bg-white/90 text-[#17331D] hover:text-red-500'
            }`}
          >
            <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>

          <div className="absolute bottom-4 left-4 flex gap-2">
            <span className="bg-[#087F23] text-white text-xs font-black px-3 py-1 rounded-full shadow-md">
              {product.grade}
            </span>
            <span className="bg-white/95 text-[#17331D] text-xs font-bold px-3 py-1 rounded-full shadow-md">
              Asal: {product.origin}
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-[#FBC02D] font-bold">
                <Star className="w-4 h-4 fill-current" />
                <span>{product.rating}</span>
                <span className="text-[#6B7D70] font-normal">({product.reviewsCount} review pelanggan)</span>
              </div>
              <span className="text-xs font-bold text-[#087F23] bg-[#E8F5E4] px-2.5 py-0.5 rounded-full">
                ✓ Stok Tersedia ({product.stockKg} kg)
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-[#17331D] mt-2">
              {product.name}
            </h2>
            <p className="text-xs sm:text-sm text-[#6B7D70] mt-1">
              {product.subtitle}
            </p>
          </div>

          {/* Pricing & Weight Selector matching Image 2 Screen 2 */}
          <div className="bg-[#F7FAF5] p-4 rounded-2xl border border-[#E2EBD8] space-y-3">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs text-[#6B7D70]">Harga Terpilih:</span>
                <div className="text-2xl font-black text-[#087F23]">
                  Rp {(currentPrice * quantity).toLocaleString('id-ID')}
                </div>
              </div>
              <div className="text-right text-xs text-[#6B7D70]">
                <span>Estimasi per unit: </span>
                <strong className="text-[#17331D]">Rp {currentPrice.toLocaleString('id-ID')}</strong>
              </div>
            </div>

            {/* Weight buttons */}
            <div>
              <label className="text-xs font-bold text-[#17331D] block mb-1.5">
                Pilih Ukuran / Kemasan:
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: '500g', label: '500 gram' },
                  { id: '1kg', label: '1 kilogram' },
                  { id: '2kg', label: '2 kilogram' },
                  { id: 'grosir', label: 'Grosir Peti' },
                ].map((tier) => (
                  <button
                    key={tier.id}
                    onClick={() => setSelectedWeight(tier.id as any)}
                    className={`py-2 px-1 rounded-xl text-xs font-bold transition-all ${
                      selectedWeight === tier.id
                        ? 'bg-[#087F23] text-white shadow-xs'
                        : 'bg-white text-[#17331D] border border-[#CDE0C4] hover:border-[#087F23]'
                    }`}
                  >
                    {tier.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Stepper */}
            <div className="flex items-center justify-between pt-2 border-t border-[#E2EBD8]">
              <span className="text-xs font-bold text-[#17331D]">Jumlah Pesanan:</span>
              <div className="flex items-center bg-white rounded-xl border border-[#CDE0C4] p-1 shadow-xs">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-7 h-7 rounded-lg text-[#17331D] hover:bg-neutral-100 flex items-center justify-center font-bold"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center font-black text-sm text-[#17331D]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-7 h-7 rounded-lg bg-[#087F23] text-white flex items-center justify-center font-bold hover:bg-[#005500]"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Description & Storage Specs */}
          <div className="space-y-2 text-xs text-[#6B7D70]">
            <h4 className="font-bold text-[#17331D]">Deskripsi & Keunggulan Mutu:</h4>
            <p className="leading-relaxed">{product.description}</p>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <div className="flex items-center gap-2 p-2 bg-[#F7FAF5] rounded-xl border border-[#E2EBD8]">
                <Thermometer className="w-4 h-4 text-[#087F23]" />
                <div>
                  <span className="block text-[10px] text-[#6B7D70]">Suhu Penyimpanan</span>
                  <span className="font-bold text-[#17331D]">{product.storageTemp || '2 - 8°C'}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 bg-[#F7FAF5] rounded-xl border border-[#E2EBD8]">
                <ShieldCheck className="w-4 h-4 text-[#087F23]" />
                <div>
                  <span className="block text-[10px] text-[#6B7D70]">Garansi</span>
                  <span className="font-bold text-[#17331D]">Tukar 24 Jam Pasti Manis</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => {
                onAddToCart(product, quantity, selectedWeight);
                onClose();
              }}
              className="flex-1 bg-[#087F23] hover:bg-[#005500] text-white py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Tambah ke Keranjang</span>
            </button>

            <button
              onClick={handleBuyNow}
              className="flex-1 bg-[#FF7F00] hover:bg-[#E67200] text-white py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Beli Sekarang (WA)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
