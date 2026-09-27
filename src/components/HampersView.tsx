import React from 'react';
import { Gift, Sparkles, CheckCircle2, ShoppingBag, MessageCircle, Heart, ArrowRight } from 'lucide-react';
import { Product } from '../data/products';

interface HampersViewProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
}

export const HampersView: React.FC<HampersViewProps> = ({
  products,
  onAddToCart,
  onSelectProduct,
}) => {
  const hampers = products.filter(p => p.category === 'parcel');

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      {/* Hampers Header */}
      <div className="bg-gradient-to-r from-[#FFF3E0] via-[#FDF8EE] to-[#E8F5E4] rounded-3xl p-8 sm:p-12 border border-[#FFE0B2] text-center max-w-4xl mx-auto space-y-3">
        <span className="bg-[#FF7F00] text-white text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5">
          <Gift className="w-3.5 h-3.5" />
          <span>Eksklusif & Mewah</span>
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#17331D]">
          Katalog Paket Hampers Buah Segar
        </h1>
        <p className="text-xs sm:text-sm text-[#6B7D70] max-w-2xl mx-auto">
          Ungkapkan perhatian dan apresiasi terbaik dengan bingkisan buah pilihan premium.
          Cocok untuk hantaran, perayaan hari besar, ucapan lekas sembuh, atau bingkisan korporat.
        </p>

        <div className="pt-2 flex flex-wrap justify-center gap-4 text-xs font-semibold text-[#17331D]">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#087F23]" />
            <span>Keranjang Anyam Premium</span>
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#087F23]" />
            <span>Gratis Pita & Custom Kartu Ucapan</span>
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#087F23]" />
            <span>Garansi Buah Segar Saat Sampai</span>
          </span>
        </div>
      </div>

      {/* Hampers Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {hampers.map((item) => (
          <div
            key={item.id}
            className="fruit-card-interactive bg-white rounded-3xl border border-[#E2EBD8] overflow-hidden shadow-sm hover:border-[#087F23] hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row group"
          >
            <div 
              onClick={() => onSelectProduct(item)}
              className="fruit-photo-sheen-container md:w-1/2 h-64 md:h-auto overflow-hidden relative cursor-pointer bg-neutral-100"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
              />
              <span className="absolute top-3 left-3 bg-[#FF7F00] text-white text-[10px] font-extrabold px-3 py-1 rounded-full shadow-xs">
                Pilihan Favorit
              </span>
            </div>

            <div className="p-6 md:w-1/2 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-xs font-bold text-[#087F23] block">{item.grade}</span>
                <h3 
                  onClick={() => onSelectProduct(item)}
                  className="text-lg font-black text-[#17331D] group-hover:text-[#087F23] cursor-pointer mt-1"
                >
                  {item.name}
                </h3>
                <p className="text-xs text-[#6B7D70] mt-2 leading-relaxed">
                  {item.description}
                </p>

                <div className="mt-4 pt-3 border-t border-[#E2EBD8] space-y-1">
                  <span className="text-[11px] text-[#6B7D70] block">Harga Per Paket:</span>
                  <div className="text-2xl font-black text-[#087F23]">
                    Rp {item.retailPrice.toLocaleString('id-ID')}
                  </div>
                  <span className="text-[11px] text-[#FF7F00] font-bold block">
                    Grosir Kantor: Rp {item.wholesalePrice.toLocaleString('id-ID')} (min. 5 paket)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => onAddToCart(item)}
                  className="flex-1 bg-[#087F23] hover:bg-[#005500] text-white py-2.5 rounded-xl font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Pesan Sekarang</span>
                </button>

                <a
                  href={`https://wa.me/6285284633214?text=${encodeURIComponent(
                    `Halo Global Fresh Indo, saya ingin memesan *${item.name}* seharga Rp ${item.retailPrice.toLocaleString('id-ID')}. Mohon info desain kartu ucapan & estimasi kirim.`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded-xl text-xs font-bold transition-colors"
                  title="Pesan via WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
