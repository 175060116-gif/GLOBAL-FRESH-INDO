import React, { useRef } from 'react';
import { BrandLogo } from './BrandLogo';
import { 
  MapPin, Clock, Phone, Mail, ShieldCheck, 
  Truck, ArrowRight, MessageCircle, Heart, Lock 
} from 'lucide-react';
import { ActiveTab } from './Navbar';
import { StoreSettings } from '../data/storeSettings';

interface FooterProps {
  onNavigate: (tab: ActiveTab) => void;
  storeSettings?: StoreSettings;
  isAdmin?: boolean;
  onOpenAdminLogin?: () => void;
  onLogoutAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ 
  onNavigate, 
  storeSettings,
  isAdmin = false,
  onOpenAdminLogin,
  onLogoutAdmin,
}) => {
  const copyrightClickRef = useRef<{ count: number; lastTime: number }>({ count: 0, lastTime: 0 });

  // Secret triple click on copyright text to open admin PIN modal
  const handleCopyrightClick = () => {
    const now = Date.now();
    if (now - copyrightClickRef.current.lastTime < 500) {
      copyrightClickRef.current.count += 1;
      if (copyrightClickRef.current.count >= 3) {
        copyrightClickRef.current.count = 0;
        if (onOpenAdminLogin) onOpenAdminLogin();
        return;
      }
    } else {
      copyrightClickRef.current.count = 1;
    }
    copyrightClickRef.current.lastTime = now;
  };
  return (
    <footer className="bg-[#17331D] text-white pt-14 pb-8 border-t-4 border-[#087F23]">
      <div className="max-w-7xl mx-auto px-4 space-y-12">
        {/* Main Footer Grid matching Image 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          {/* Col 1: Brand & Slogan (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <BrandLogo 
              size="lg" 
              inverted={true} 
              logoUrl={storeSettings?.logoUrl}
              storeName={storeSettings?.storeName}
              storeTagline={storeSettings?.storeTagline}
              storeSlogan={storeSettings?.storeSlogan}
            />

            <p className="text-xs text-green-100/80 leading-relaxed max-w-sm pt-2">
              Distributor buah segar terlengkap dan terpercaya untuk kebutuhan rumah tangga, 
              hotel berbintang, restoran, kafe juice bar, katering pesta, dan retail. 
              Menjaga kemurnian panen langsung dari kebun hingga meja Anda.
            </p>

            <div className="pt-2 text-xs font-semibold text-[#FFD54F]">
              <em>"{storeSettings?.storeSlogan || 'Fresh Fruits • Fresh Quality • Fresh Delivery'}"</em>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={`https://wa.me/${storeSettings?.whatsappNumber || '6285284633214'}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat WhatsApp: {storeSettings?.whatsappNumber || '0852-8463-3214'}</span>
              </a>
            </div>
          </div>

          {/* Col 2: Lokasi & Jam Kerja matching Image 3 (3 cols) */}
          <div className="lg:col-span-3 space-y-3 text-xs">
            <h4 className="font-extrabold text-sm text-white uppercase tracking-wider text-[#55AA00]">
              Lokasi & Jam Kerja
            </h4>

            <div className="flex items-start gap-2.5 text-green-100/90">
              <MapPin className="w-4 h-4 text-[#FFD54F] shrink-0 mt-0.5" />
              <span>
                {storeSettings?.address || 'Perum Graha Pratama Blok C No 4, Kec. Cilaku, Kab. Cianjur, Jawa Barat'}
              </span>
            </div>

            <div className="flex items-start gap-2.5 text-green-100/90">
              <Clock className="w-4 h-4 text-[#FFD54F] shrink-0 mt-0.5" />
              <div>
                <p>{storeSettings?.operatingHours || 'Buka Setiap Hari: 07.00 - 21.00 WIB'}</p>
                <p className="text-[11px] text-green-200">Pengiriman armada mulai <strong>08.00 WIB</strong></p>
                <p className="text-[11px] text-[#FFD54F]">Slot Subuh Horeka: <strong>05.00 WIB</strong></p>
              </div>
            </div>

            <div className="pt-2">
              <span className="text-[11px] bg-white/10 px-2.5 py-1 rounded-full text-green-200 inline-block">
                Gudang Aktif 24 Jam • Pengiriman Setiap Hari
              </span>
            </div>
          </div>

          {/* Col 3: Area Pengiriman matching Image 3 (2 cols) */}
          <div className="lg:col-span-2 space-y-3 text-xs">
            <h4 className="font-extrabold text-sm text-white uppercase tracking-wider text-[#55AA00]">
              Area Pengiriman
            </h4>

            <ul className="space-y-2 text-green-100/90">
              <li className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-[#FFD54F]" />
                <span>Cianjur (Instant & Sameday)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-[#FFD54F]" />
                <span>Sukabumi & Priangan Barat</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-[#FFD54F]" />
                <span>Bandung Raya & Sekitarnya</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-[#FFD54F]" />
                <span>Jabodetabek (Antar Kota)</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Navigasi Cepat & Kontak (3 cols) */}
          <div className="lg:col-span-3 space-y-3 text-xs">
            <h4 className="font-extrabold text-sm text-white uppercase tracking-wider text-[#55AA00]">
              Customer Care & Navigasi
            </h4>

            <div className="space-y-1.5 text-green-100/90">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#FFD54F]" />
                <span>Hotline: 085284633214</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#FFD54F]" />
                <span>info@globalfreshindo.com</span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-2 text-xs">
              <button 
                onClick={() => onNavigate('pricelist')} 
                className="text-green-200 hover:text-white underline underline-offset-2"
              >
                Pricelist Harian
              </button>
              <span>•</span>
              <button 
                onClick={() => onNavigate('fastorder')} 
                className="text-green-200 hover:text-white underline underline-offset-2"
              >
                Order WA Cepat
              </button>
              <span>•</span>
              <button 
                onClick={() => onNavigate('b2b')} 
                className="text-green-200 hover:text-white underline underline-offset-2"
              >
                Grosir B2B
              </button>
              {isAdmin ? (
                <>
                  <span>•</span>
                  <button 
                    onClick={() => onNavigate('admin')} 
                    className="text-[#FFD54F] hover:text-white underline underline-offset-2 font-bold"
                  >
                    ⚙️ Panel Pengelola
                  </button>
                </>
              ) : !storeSettings?.hideLoginMenu && onOpenAdminLogin ? (
                <>
                  <span>•</span>
                  <button 
                    onClick={onOpenAdminLogin} 
                    className="text-green-200/80 hover:text-white underline underline-offset-2 flex items-center gap-1 inline-flex"
                  >
                    <span>🔒 Portal Pemilik Toko</span>
                  </button>
                </>
              ) : null}
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Legal matching Image 3 */}
        <div className="pt-8 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-green-100/70">
          <div 
            onClick={handleCopyrightClick}
            className="cursor-pointer select-none"
            title=""
          >
            © {new Date().getFullYear()} <strong>{storeSettings?.storeName || 'PT GLOBAL FRESH INDO'}</strong>. Seluruh Hak Cipta Dilindungi.
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button onClick={() => alert('Kebijakan Garansi Kesegaran 24 Jam: Buah rusak/asam diganti 100% baru.')} className="hover:text-white">
              Kebijakan Garansi Kesegaran
            </button>
            <span>•</span>
            <button onClick={() => alert('Ketentuan Grosir & Pengembalian Horeka berlaku untuk faktur resmi.')} className="hover:text-white">
              Ketentuan Grosir & Pengembalian
            </button>
            <span>•</span>
            <button onClick={() => alert('Privasi data konsumen dijaga aman sesuai undang-undang perlindungan data.')} className="hover:text-white">
              Privasi Konsumen
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
