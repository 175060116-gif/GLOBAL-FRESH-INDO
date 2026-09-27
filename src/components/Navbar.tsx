import React, { useState, useRef } from 'react';
import { BrandLogo } from './BrandLogo';
import { 
  Search, ShoppingCart, Heart, Phone, MapPin, 
  Clock, Sparkles, LayoutDashboard, Truck, MessageCircle, 
  FileText, Menu, X, ShieldCheck, Settings, Lock, LogOut, Eye
} from 'lucide-react';
import { StoreSettings } from '../data/storeSettings';

export type ActiveTab = 'home' | 'pricelist' | 'fastorder' | 'b2b' | 'hampers' | 'tracking' | 'admin';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  cartCount: number;
  onOpenCart: () => void;
  wishlistCount: number;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  storeSettings?: StoreSettings;
  onOpenStoreSettings?: () => void;
  isAdmin?: boolean;
  onLogoutAdmin?: () => void;
  onOpenAdminLogin?: () => void;
  onOpenBgnModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  cartCount,
  onOpenCart,
  wishlistCount,
  searchQuery,
  setSearchQuery,
  storeSettings,
  onOpenStoreSettings,
  isAdmin = false,
  onLogoutAdmin,
  onOpenAdminLogin,
  onOpenBgnModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const logoClickCountRef = useRef<{ count: number; lastTime: number }>({ count: 0, lastTime: 0 });

  // Triple-click on logo secretly triggers admin login PIN prompt
  const handleLogoClick = () => {
    const now = Date.now();
    if (now - logoClickCountRef.current.lastTime < 500) {
      logoClickCountRef.current.count += 1;
      if (logoClickCountRef.current.count >= 3) {
        logoClickCountRef.current.count = 0;
        if (onOpenAdminLogin) {
          onOpenAdminLogin();
        }
        return;
      }
    } else {
      logoClickCountRef.current.count = 1;
    }
    logoClickCountRef.current.lastTime = now;
    setActiveTab('home');
    setMobileMenuOpen(false);
  };

  // Filter links: Admin tab ONLY shown if logged in as Admin!
  const baseLinks: { id: ActiveTab; label: string; badge?: string; icon?: React.ReactNode }[] = [
    { id: 'home', label: 'Beranda' },
    { id: 'pricelist', label: 'Daftar Harga Buah', badge: 'Live Pagi', icon: <FileText className="w-3.5 h-3.5" /> },
    { id: 'fastorder', label: 'Order Cepat WA', badge: 'Fast', icon: <MessageCircle className="w-3.5 h-3.5 text-green-600" /> },
    { id: 'b2b', label: 'Grosir & Resto B2B' },
    { id: 'hampers', label: 'Paket Hampers' },
    { id: 'tracking', label: 'Lacak Pesanan', icon: <Truck className="w-3.5 h-3.5" /> },
  ];

  const adminLink = { 
    id: 'admin' as ActiveTab, 
    label: 'Panel Admin & Stok', 
    badge: 'Owner', 
    icon: <LayoutDashboard className="w-3.5 h-3.5" /> 
  };

  const navLinks = isAdmin ? [...baseLinks, adminLink] : baseLinks;

  return (
    <header className="sticky top-0 z-40 bg-white shadow-xs border-b border-[#E2EBD8]">
      
      {/* Top Banner when Admin is logged in */}
      {isAdmin && (
        <div className="bg-[#17331D] text-white text-[11px] py-1 px-4 border-b border-green-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse"></span>
            <span className="font-bold text-[#FFD54F]">MODE PENGELOLA TOKO (ADMIN):</span>
            <span className="hidden sm:inline text-green-200">
              Anda memiliki wewenang mengubah harga, foto & logo. Kostumer tidak dapat melihat tombol ini.
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onOpenStoreSettings && (
              <button
                onClick={onOpenStoreSettings}
                className="bg-white/15 hover:bg-white/25 text-white px-2 py-0.5 rounded text-[10.5px] font-bold flex items-center gap-1"
              >
                <Settings className="w-3 h-3" />
                <span>Ganti Logo</span>
              </button>
            )}
            <button
              onClick={onLogoutAdmin}
              className="bg-[#E53935] hover:bg-red-700 text-white px-2.5 py-0.5 rounded text-[10.5px] font-bold flex items-center gap-1 transition-colors"
              title="Kunci mode admin dan beralih ke tampilan kostumer murni"
            >
              <Eye className="w-3 h-3" />
              <span>Lihat Sbg Kostumer</span>
            </button>
          </div>
        </div>
      )}

      {/* Super Top Bar - exact match with Image 3 */}
      <div className="bg-[#087F23] text-white text-[11px] font-medium py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#55AA00] animate-pulse"></span>
            <span className="font-semibold tracking-wide">
              {storeSettings?.storeName || 'PT GLOBAL FRESH INDO'}
            </span>
            <span className="hidden md:inline text-green-200">
              • {storeSettings?.storeTagline || 'Toko Buah Segar & Distributor Buah Segar Cianjur'}
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-5 text-xs">
            <div className="hidden sm:flex items-center gap-1.5 bg-black/15 px-2 py-0.5 rounded text-[10.5px]">
              <Clock className="w-3 h-3 text-[#FFD54F]" />
              <span className="text-[#FFD54F] font-bold">HARGA TERUPDATE:</span>
              <span>HARI INI, PUKUL 07:00 WIB</span>
            </div>

            <a 
              href={`https://wa.me/${storeSettings?.whatsappNumber || '6285284633214'}`}
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-1 hover:text-[#FFD54F] transition-colors"
            >
              <Phone className="w-3 h-3 text-[#FF7F00]" />
              <span>Pesan WA: <strong className="font-bold tracking-wide">{storeSettings?.whatsappNumber || '085284633214'}</strong></span>
            </a>

            <div className="hidden lg:flex items-center gap-1 text-green-100">
              <Clock className="w-3 h-3" />
              <span>{storeSettings?.operatingHours || 'Buka Setiap Hari: 07.00 - 21.00 WIB'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 py-2.5">
        <div className="flex items-center justify-between gap-3 md:gap-6">
          {/* Logo */}
          <div onClick={handleLogoClick} className="cursor-pointer">
            <BrandLogo 
              size="md" 
              logoUrl={storeSettings?.logoUrl}
              storeName={storeSettings?.storeName}
              storeTagline={storeSettings?.storeTagline}
              storeSlogan={storeSettings?.storeSlogan}
            />
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-xl hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari buah favorit Anda (apel, anggur muscat, alpukat, pisang...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F7FAF5] border border-[#CDE0C4] rounded-full py-2.5 pl-11 pr-24 text-sm text-[#17331D] placeholder-[#6B7D70] focus:outline-none focus:ring-2 focus:ring-[#087F23] focus:border-transparent transition-all shadow-inner"
              />
              <Search className="w-4 h-4 text-[#087F23] absolute left-4 top-1/2 -translate-y-1/2" />
              <button 
                onClick={() => {
                  if (activeTab !== 'pricelist') setActiveTab('pricelist');
                }}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-[#087F23] hover:bg-[#005500] text-white text-xs font-semibold px-4 py-1.5 rounded-full transition-all"
              >
                Cari
              </button>
            </div>
          </div>

          {/* Value props & Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Quick stats / location badge */}
            <div className="hidden xl:flex items-center gap-2 border-r border-[#E2EBD8] pr-4">
              <div className="w-8 h-8 rounded-full bg-[#E8F5E4] flex items-center justify-center text-[#087F23]">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="text-left text-xs leading-tight">
                <span className="text-[#6B7D70] block text-[10px]">Lokasi Gudang</span>
                <span className="font-bold text-[#17331D]">{storeSettings?.city || 'Cianjur'}</span>
              </div>
            </div>

            {/* Wishlist */}
            <button 
              onClick={() => setActiveTab('pricelist')}
              className="relative p-2 rounded-full hover:bg-[#E8F5E4] text-[#17331D] transition-colors"
              title="Favorit Saya"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#E53935] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button 
              onClick={onOpenCart}
              className="relative flex items-center gap-2 bg-[#E8F5E4] hover:bg-[#D7EED0] text-[#087F23] px-3.5 py-2 rounded-full font-bold text-xs transition-all shadow-xs"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Keranjang</span>
              <span className="bg-[#FF7F00] text-white text-[10px] font-extrabold rounded-full px-1.5 py-0.5 min-w-5 text-center">
                {cartCount}
              </span>
            </button>

            {/* Fast WhatsApp Button */}
            <button
              onClick={() => setActiveTab('fastorder')}
              className="hidden sm:flex items-center gap-1.5 bg-[#FF7F00] hover:bg-[#E67200] text-white px-3.5 py-2 rounded-full font-bold text-xs transition-all shadow-sm"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Order WA</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-[#17331D] hover:bg-[#E8F5E4]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-2.5 md:hidden">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari buah segar hari ini..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F7FAF5] border border-[#CDE0C4] rounded-full py-2 pl-9 pr-4 text-xs text-[#17331D] placeholder-[#6B7D70] focus:outline-none focus:ring-2 focus:ring-[#087F23]"
            />
            <Search className="w-4 h-4 text-[#087F23] absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>

      {/* Desktop Navigation Links */}
      <nav className="bg-[#F7FAF5] border-t border-[#E2EBD8] hidden md:block">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <ul className="flex items-center gap-1 lg:gap-2 py-1">
              {navLinks.map((link) => {
                const isActive = activeTab === link.id;
                return (
                  <li key={link.id}>
                    <button
                      onClick={() => setActiveTab(link.id)}
                      className={`flex items-center gap-1.5 px-3 py-2 text-xs lg:text-sm font-semibold rounded-lg transition-all ${
                        isActive
                          ? 'bg-[#087F23] text-white shadow-xs'
                          : 'text-[#17331D] hover:bg-[#E8F5E4] hover:text-[#087F23]'
                      }`}
                    >
                      {link.icon}
                      <span>{link.label}</span>
                      {link.badge && (
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase ${
                          isActive 
                            ? 'bg-[#FF7F00] text-white' 
                            : 'bg-[#55AA00]/15 text-[#087F23]'
                        }`}>
                          {link.badge}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Right side: Guarantee or Mode indicator */}
            <div className="flex items-center gap-3">
              {onOpenBgnModal && (
                <button
                  onClick={onOpenBgnModal}
                  className="bg-[#17331D] hover:bg-[#087F23] text-white px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all shadow-xs group"
                  title="Konsultasi Pasokan Buah Badan Gizi Nasional (BGN)"
                >
                  <span className="text-xs">🇮🇩</span>
                  <span>Suplai Buah BGN</span>
                  <span className="bg-[#FFD54F] text-[#17331D] text-[9px] font-black px-1.5 py-0.2 rounded-full">
                    MBG
                  </span>
                </button>
              )}

              <div className="hidden xl:flex items-center gap-1.5 text-xs text-[#087F23] font-semibold">
                <ShieldCheck className="w-4 h-4 text-[#55AA00]" />
                <span>Garansi Segar 100%</span>
              </div>

              {isAdmin ? (
                <button
                  onClick={() => setActiveTab('admin')}
                  className="text-[11px] bg-[#E8F5E4] text-[#087F23] hover:bg-[#D4EDCE] flex items-center gap-1.5 font-bold px-2.5 py-1 rounded-full border border-[#CDE0C4] transition-all"
                  title="Masuk ke Panel Kontrol Pengelola"
                >
                  <LayoutDashboard className="w-3 h-3" />
                  <span>Mode Admin</span>
                </button>
              ) : !storeSettings?.hideLoginMenu && onOpenAdminLogin ? (
                <button
                  onClick={onOpenAdminLogin}
                  className="text-[11px] text-[#6B7D70] hover:text-[#087F23] flex items-center gap-1 font-semibold px-2 py-1 rounded-md hover:bg-white transition-colors"
                  title="Login khusus pemilik / admin toko"
                >
                  <Lock className="w-3 h-3" />
                  <span>Login Pengelola</span>
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-[#E2EBD8] p-4 shadow-lg animate-in slide-in-from-top-2">
          <div className="flex flex-col gap-1.5">
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    setActiveTab(link.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-[#087F23] text-white'
                      : 'text-[#17331D] hover:bg-[#F0F7EC]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {link.icon}
                    <span>{link.label}</span>
                  </div>
                  {link.badge && (
                    <span className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase bg-[#FF7F00] text-white">
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Program BGN Mobile CTA */}
            {onOpenBgnModal && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBgnModal();
                }}
                className="mt-2 bg-[#17331D] text-white p-3 rounded-xl flex items-center justify-between font-bold text-xs shadow-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">🇮🇩</span>
                  <span>Suplai Buah Badan Gizi Nasional (BGN)</span>
                </div>
                <span className="bg-[#FFD54F] text-[#17331D] text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                  MBG
                </span>
              </button>
            )}

            {isAdmin ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setActiveTab('admin');
                }}
                className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2 text-xs text-[#087F23] font-bold px-3 py-2 bg-[#E8F5E4] rounded-xl"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>⚙️ Panel Kontrol Pengelola</span>
              </button>
            ) : !storeSettings?.hideLoginMenu && onOpenAdminLogin ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdminLogin();
                }}
                className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2 text-xs text-[#6B7D70] hover:text-[#087F23] font-bold px-3 py-2"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Portal Pemilik Toko (Login PIN)</span>
              </button>
            ) : null}
          </div>
        </div>
      )}
    </header>
  );
};
