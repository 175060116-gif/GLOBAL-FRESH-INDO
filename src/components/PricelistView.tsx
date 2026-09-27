import React, { useState, useMemo } from 'react';
import { 
  FileDown, Share2, Sparkles, Search, Filter, 
  ArrowUpDown, Plus, Minus, Trash2, ShoppingCart, 
  Check, Phone, ShieldCheck, Clock, Download, ExternalLink,
  Info, MessageCircle, AlertCircle, ZoomIn, Eye, Tag, Package, Calculator, Layers,
  Camera
} from 'lucide-react';
import { Product } from '../data/products';
import { WHOLESALE_PRICELIST, WholesalePricelistItem } from '../data/wholesalePricelist';
import { NutritionPortionCalculator, NutritionCalculatorData } from './NutritionPortionCalculator';
import { FruitPhotoUploadModal, FruitPhotoTarget } from './FruitPhotoUploadModal';

interface PricelistViewProps {
  products: Product[];
  wholesaleItems?: WholesalePricelistItem[];
  onAddToCart: (product: Product, qty?: number) => void;
  onSelectProduct: (product: Product) => void;
  onPreviewFruitPhoto?: (product: Product) => void;
  onOpenBgnModal?: () => void;
  onUpdateWholesaleItem?: (item: WholesalePricelistItem) => void;
  isAdmin?: boolean;
}

export const PricelistView: React.FC<PricelistViewProps> = ({
  products,
  wholesaleItems = WHOLESALE_PRICELIST,
  onAddToCart,
  onSelectProduct,
  onPreviewFruitPhoto,
  onOpenBgnModal,
  onUpdateWholesaleItem,
  isAdmin,
}) => {
  // Main view tab: 'wholesale-official' (the requested 57 items with Kode & Harga Baru), 'retail-catalog', or 'nutrition-calculator'
  const [activeMainTab, setActiveMainTab] = useState<'wholesale-official' | 'retail-catalog' | 'nutrition-calculator'>('wholesale-official');

  // Wholesale filters
  const [wholesaleCategory, setWholesaleCategory] = useState<string>('All');
  const [wholesaleSearch, setWholesaleSearch] = useState<string>('');
  const [wholesaleSortBy, setWholesaleSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'name-asc'>('default');

  // Retail filters
  const [retailCategory, setRetailCategory] = useState<'all' | 'lokal' | 'import' | 'parcel'>('all');
  const [retailSearch, setRetailSearch] = useState('');
  const [retailSortBy, setRetailSortBy] = useState<'recommended' | 'price-asc' | 'price-desc' | 'popular'>('recommended');
  
  // Kalkulator Belanja local state (can contain both retail products and wholesale carton items)
  const [calcItems, setCalcItems] = useState<{ 
    [id: string]: { name: string; price: number; unit: string; qty: number; isWholesale?: boolean; code?: string } 
  }>({
    'alpukat-mentega': { name: 'Alpukat Mentega Miki Super', price: 28000, unit: 'kg', qty: 2 },
    '15133': { name: 'ANGGUR SHINE MUSCAT CHN BUNCH KRJ 5KG', price: 255000, unit: 'Keranjang 5kg', qty: 1, isWholesale: true, code: '15133' },
    '1408': { name: "APEL FUJI CHINA MERAK 72' (17KG)", price: 575000, unit: 'Karton 17kg', qty: 1, isWholesale: true, code: '1408' },
  });

  const [deliveryNote, setDeliveryNote] = useState('');
  const [useFreeIceGel, setUseFreeIceGel] = useState(true);
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  // Active photo preview modal state
  const [previewWholesaleItem, setPreviewWholesaleItem] = useState<WholesalePricelistItem | null>(null);

  // Fruit Photo Upload state
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [photoModalFruit, setPhotoModalFruit] = useState<FruitPhotoTarget | null>(null);
  const [photoToast, setPhotoToast] = useState<string | null>(null);

  const handleOpenPhotoUpload = (item: WholesalePricelistItem) => {
    setPhotoModalFruit({
      code: item.code,
      name: item.name,
      category: item.category,
      categoryEmoji: item.categoryEmoji,
      image: item.image,
      unit: item.unit,
    });
    setIsPhotoModalOpen(true);
  };

  const handleSavePhoto = (newImageUrl: string) => {
    if (!photoModalFruit) return;

    if (onUpdateWholesaleItem) {
      const match = wholesaleItems.find((w) => w.code === photoModalFruit.code);
      if (match) {
        const updated = { ...match, image: newImageUrl };
        onUpdateWholesaleItem(updated);
        if (previewWholesaleItem && previewWholesaleItem.code === match.code) {
          setPreviewWholesaleItem(updated);
        }
        setPhotoToast(`Foto buah [${match.name}] berhasil disimpan ke database!`);
        setTimeout(() => setPhotoToast(null), 3500);
      }
    }
    setIsPhotoModalOpen(false);
  };

  // Filtered Wholesale items (The 57 official items)
  const filteredWholesale = useMemo(() => {
    return wholesaleItems
      .filter((item) => {
        if (wholesaleCategory !== 'All' && item.category !== wholesaleCategory) return false;
        if (wholesaleSearch.trim() !== '') {
          const q = wholesaleSearch.toLowerCase();
          return (
            item.code.toLowerCase().includes(q) ||
            item.name.toLowerCase().includes(q) ||
            item.packaging.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => {
        if (wholesaleSortBy === 'price-asc') return a.price - b.price;
        if (wholesaleSortBy === 'price-desc') return b.price - a.price;
        if (wholesaleSortBy === 'name-asc') return a.name.localeCompare(b.name);
        return 0;
      });
  }, [wholesaleItems, wholesaleCategory, wholesaleSearch, wholesaleSortBy]);

  // Categories list for wholesale filter
  const wholesaleCategoryList = useMemo(() => {
    const counts: { [cat: string]: number } = { All: wholesaleItems.length };
    wholesaleItems.forEach(item => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });

    return [
      { id: 'All', label: 'Semua Produk', emoji: '✨', count: counts.All },
      { id: 'Anggur', label: 'Anggur', emoji: '🍇', count: counts.Anggur || 0 },
      { id: 'Apel', label: 'Apel', emoji: '🍎', count: counts.Apel || 0 },
      { id: 'Jeruk', label: 'Jeruk', emoji: '🍊', count: counts.Jeruk || 0 },
      { id: 'Kiwi', label: 'Kiwi', emoji: '🥝', count: counts.Kiwi || 0 },
      { id: 'Lemon', label: 'Lemon', emoji: '🍋', count: counts.Lemon || 0 },
      { id: 'Delima', label: 'Delima', emoji: '❤️', count: counts.Delima || 0 },
      { id: 'Pear', label: 'Pear', emoji: '🍐', count: counts.Pear || 0 },
      { id: 'Lengkeng', label: 'Lengkeng', emoji: '🟤', count: counts.Lengkeng || 0 },
      { id: 'Plum', label: 'Plum', emoji: '🟣', count: counts.Plum || 0 },
    ];
  }, [wholesaleItems]);

  // Filtered Retail products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (retailCategory !== 'all' && p.category !== retailCategory) return false;
        if (retailSearch.trim() !== '') {
          const query = retailSearch.toLowerCase();
          return (
            p.name.toLowerCase().includes(query) ||
            p.origin.toLowerCase().includes(query) ||
            p.subtitle.toLowerCase().includes(query)
          );
        }
        return true;
      })
      .sort((a, b) => {
        if (retailSortBy === 'price-asc') return a.retailPrice - b.retailPrice;
        if (retailSortBy === 'price-desc') return b.retailPrice - a.retailPrice;
        if (retailSortBy === 'popular') return b.reviewsCount - a.reviewsCount;
        return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
      });
  }, [products, retailCategory, retailSearch, retailSortBy]);

  // Promo items for the top row
  const bestDeals = products.filter((p) => p.isBestDeal);

  // Kalkulator calculations
  const calcSubtotal = useMemo(() => {
    let sum = 0;
    Object.values(calcItems).forEach((item) => {
      if (item.qty > 0) {
        sum += item.price * item.qty;
      }
    });
    return sum;
  }, [calcItems]);

  const handleUpdateCalcQty = (id: string, delta: number) => {
    setCalcItems((prev) => {
      const current = prev[id];
      if (!current) return prev;
      const nextQty = current.qty + delta;
      if (nextQty <= 0) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: { ...current, qty: nextQty } };
    });
  };

  const handleAddRetailToCalc = (product: Product) => {
    setCalcItems((prev) => ({
      ...prev,
      [product.id]: {
        name: product.name,
        price: product.retailPrice,
        unit: product.unit,
        qty: (prev[product.id]?.qty || 0) + 1,
      },
    }));
  };

  const handleAddWholesaleToCalc = (item: WholesalePricelistItem) => {
    setCalcItems((prev) => ({
      ...prev,
      [item.code]: {
        name: item.name,
        price: item.price,
        unit: item.unit,
        qty: (prev[item.code]?.qty || 0) + 1,
        isWholesale: true,
        code: item.code,
      },
    }));
  };

  const generateWhatsAppCalcUrl = () => {
    const lines = [
      '*PESANAN DAFTAR HARGA BUAH - PT GLOBAL FRESH INDO*',
      `_Waktu Order: ${new Date().toLocaleDateString('id-ID')} - ${new Date().toLocaleTimeString('id-ID')}_`,
      '',
      '*Daftar Item Buah Pesanan:*',
    ];

    Object.values(calcItems).forEach((item) => {
      if (item.qty > 0) {
        const codeText = item.code ? `[Kode: ${item.code}] ` : '';
        lines.push(`• ${codeText}${item.name} (${item.qty} ${item.unit}) = Rp ${(item.price * item.qty).toLocaleString('id-ID')}`);
      }
    });

    lines.push('');
    lines.push(`*Total Estimasi: Rp ${calcSubtotal.toLocaleString('id-ID')}*`);
    if (useFreeIceGel) lines.push('✓ Tambahan: Dus Tebal & Ice Gel Pendingin (GRATIS)');
    if (deliveryNote) lines.push(`*Lokasi/Catatan Pengiriman:* ${deliveryNote}`);
    lines.push('');
    lines.push('Mohon konfirmasi ketersediaan stok fisik gudang dan jadwal armada kirim ke alamat kami. Terima kasih!');

    return `https://wa.me/6285284633214?text=${encodeURIComponent(lines.join('\n'))}`;
  };

  const handleShareCatalog = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Pricelist Resmi Buah PT Global Fresh Indo',
        text: 'Cek daftar harga buah segar & grosir karton terupdate harian dari PT Global Fresh Indo Cianjur.',
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 2500);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* 1. Header & Live Indicator Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2EBD8] shadow-xs relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#F7FAF5] rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#087F23] mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#55AA00] animate-ping"></span>
              <span className="bg-[#E8F5E4] px-2.5 py-0.5 rounded-full uppercase tracking-wider text-[10px] font-black">
                Realtime Market Feed
              </span>
              <span className="text-[#6B7D70]">Update Pagi 07:00 WIB • Resmi Cold Storage</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#17331D] tracking-tight">
              Daftar Harga & Pricelist Buah Segar Resmi
            </h1>
            <p className="text-xs sm:text-sm text-[#6B7D70] mt-1.5 max-w-2xl leading-relaxed">
              Daftar harga komoditas buah import & lokal terlengkap dengan kode SKU resmi, spesifikasi karton/keranjang grosir, 
              serta eceran kiloan berstandar sortir mutu ketat.
            </p>
          </div>

          {/* Action buttons: PDF, Excel, Share */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setShowExportModal(true)}
              className="flex items-center gap-2 bg-[#F7FAF5] hover:bg-[#E8F5E4] text-[#087F23] border border-[#CDE0C4] px-4 py-2.5 rounded-xl font-bold text-xs transition-all hover:scale-105"
            >
              <FileDown className="w-4 h-4" />
              <span>Download PDF</span>
            </button>

            <button
              onClick={() => setShowExportModal(true)}
              className="flex items-center gap-2 bg-[#F7FAF5] hover:bg-[#E8F5E4] text-[#087F23] border border-[#CDE0C4] px-4 py-2.5 rounded-xl font-bold text-xs transition-all hover:scale-105"
            >
              <Download className="w-4 h-4" />
              <span>Format Excel (XLSX)</span>
            </button>

            <button
              onClick={handleShareCatalog}
              className="flex items-center gap-2 bg-[#087F23] hover:bg-[#005500] text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-xs transition-all hover:scale-105"
            >
              <Share2 className="w-4 h-4" />
              <span>{copiedNotification ? 'Link Tersalin!' : 'Bagikan Katalog'}</span>
            </button>
          </div>
        </div>

        {/* 2. Top Best Deals / Promo Hari Ini */}
        <div className="mt-8 pt-6 border-t border-[#E2EBD8]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FF7F00] animate-sparkle" />
              <h3 className="font-extrabold text-sm text-[#17331D] uppercase tracking-wide">
                Promo & Best Deal Pilihan Hari Ini
              </h3>
            </div>
            <span className="text-[11px] text-[#6B7D70]">Stok panen langsung sortir cold storage</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {bestDeals.map((deal) => (
              <div
                key={deal.id}
                className="fruit-card-interactive bg-gradient-to-r from-[#F0F9ED] to-[#FFF8E1] border border-[#CDE0C4] p-4 rounded-2xl flex items-center gap-4 transition-all group"
              >
                {/* Photo with interactive lens & sheen */}
                <div 
                  onClick={() => onPreviewFruitPhoto ? onPreviewFruitPhoto(deal) : onSelectProduct(deal)}
                  className="fruit-photo-sheen-container relative w-16 h-16 rounded-xl overflow-hidden bg-neutral-100 shrink-0 border border-white shadow-xs cursor-pointer group"
                >
                  <img
                    src={deal.image}
                    alt={deal.name}
                    className="w-full h-full object-cover group-hover:scale-115 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <ZoomIn className="w-4 h-4 text-white drop-shadow-md" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#E53935] text-white text-[9.5px] font-extrabold px-2 py-0.5 rounded-full">
                      HEMAT {deal.discountPercent}%
                    </span>
                    <span className="text-[10px] text-[#6B7D70] font-medium truncate">{deal.origin}</span>
                  </div>
                  <h4 
                    onClick={() => onSelectProduct(deal)}
                    className="font-bold text-xs text-[#17331D] truncate mt-1 hover:text-[#087F23] cursor-pointer"
                  >
                    {deal.name}
                  </h4>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="text-sm font-black text-[#087F23]">
                      Rp {deal.retailPrice.toLocaleString('id-ID')}
                    </span>
                    <span className="text-[10px] text-[#6B7D70] line-through">
                      Rp {deal.originalRetailPrice?.toLocaleString('id-ID')}
                    </span>
                    <span className="text-[10px] text-[#6B7D70]">/{deal.unit}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleAddRetailToCalc(deal)}
                  className="bg-[#087F23] hover:bg-[#005500] text-white p-2 rounded-xl text-xs font-bold transition-transform active:scale-95 shrink-0"
                  title="Tambah ke Kalkulator"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Main Navigation Mode Tabs (Wholesale Official 57 Items vs Retail Catalog vs Nutrition Calculator) */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2 rounded-2xl border border-[#E2EBD8] shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          
          <button
            onClick={() => setActiveMainTab('wholesale-official')}
            className={`px-4 py-2.5 rounded-xl font-black text-xs transition-all flex items-center gap-2 ${
              activeMainTab === 'wholesale-official'
                ? 'bg-[#087F23] text-white shadow-sm scale-[1.02]'
                : 'bg-[#F7FAF5] text-[#17331D] hover:bg-[#E8F5E4]'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Pricelist Dus & Karton Resmi (Kode & Harga Baru)</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${
              activeMainTab === 'wholesale-official' ? 'bg-[#55AA00] text-white' : 'bg-[#E2EBD8] text-[#087F23]'
            }`}>
              57 Item
            </span>
          </button>

          <button
            onClick={() => setActiveMainTab('retail-catalog')}
            className={`px-4 py-2.5 rounded-xl font-black text-xs transition-all flex items-center gap-2 ${
              activeMainTab === 'retail-catalog'
                ? 'bg-[#087F23] text-white shadow-sm scale-[1.02]'
                : 'bg-[#F7FAF5] text-[#17331D] hover:bg-[#E8F5E4]'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Katalog Buah Segar (Eceran & Kiloan)</span>
          </button>

          <button
            onClick={() => setActiveMainTab('nutrition-calculator')}
            className={`px-4 py-2.5 rounded-xl font-black text-xs transition-all flex items-center gap-2 ${
              activeMainTab === 'nutrition-calculator'
                ? 'bg-[#087F23] text-white shadow-sm scale-[1.02]'
                : 'bg-[#F7FAF5] text-[#17331D] hover:bg-[#E8F5E4]'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>Kalkulator Gizi & Porsi Siswa (MBG)</span>
            <span className="bg-[#FFD54F] text-[#17331D] text-[9.5px] font-black px-1.5 py-0.5 rounded-full">
              BGN
            </span>
          </button>

        </div>

        <div className="text-[11px] text-[#6B7D70] px-3 py-1 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-[#087F23]" />
          <span>Harga berlaku: Hari ini (Fluktuasi Terkendali)</span>
        </div>
      </div>

      {/* 4. Tab 1: Wholesale Official Table (The user-requested 57 items with Kode & Harga Baru) */}
      {activeMainTab === 'wholesale-official' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-300">
          
          <div className="lg:col-span-8 space-y-5">
            {/* Filter & Search Bar for Wholesale Table */}
            <div className="bg-white p-4 rounded-2xl border border-[#E2EBD8] shadow-xs space-y-3">
              {/* Category Pills with Emoji and Count */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 no-scrollbar">
                {wholesaleCategoryList.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setWholesaleCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                      wholesaleCategory === cat.id
                        ? 'bg-[#087F23] text-white shadow-xs'
                        : 'bg-[#F7FAF5] text-[#17331D] hover:bg-[#E8F5E4] border border-[#E2EBD8]'
                    }`}
                  >
                    <span>{cat.emoji}</span>
                    <span>{cat.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      wholesaleCategory === cat.id ? 'bg-[#55AA00] text-white' : 'bg-black/5 text-[#6B7D70]'
                    }`}>
                      {cat.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Search & Sort */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-[#E2EBD8]">
                <div className="relative w-full sm:w-80">
                  <input
                    type="text"
                    placeholder="Cari Kode Produk (cth: 2021, 11174) atau Nama..."
                    value={wholesaleSearch}
                    onChange={(e) => setWholesaleSearch(e.target.value)}
                    className="w-full bg-[#F7FAF5] border border-[#CDE0C4] rounded-xl py-2 pl-9 pr-3 text-xs text-[#17331D] font-medium focus:outline-none focus:ring-2 focus:ring-[#087F23] focus:bg-white"
                  />
                  <Search className="w-4 h-4 text-[#6B7D70] absolute left-3 top-1/2 -translate-y-1/2" />
                  {wholesaleSearch && (
                    <button 
                      onClick={() => setWholesaleSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <span className="text-xs text-[#6B7D70] font-semibold">Urutkan:</span>
                  <div className="flex items-center gap-1">
                    <ArrowUpDown className="w-3.5 h-3.5 text-[#6B7D70]" />
                    <select
                      value={wholesaleSortBy}
                      onChange={(e) => setWholesaleSortBy(e.target.value as any)}
                      className="bg-[#F7FAF5] border border-[#CDE0C4] rounded-xl py-1.5 px-2.5 text-xs text-[#17331D] font-semibold focus:outline-none focus:ring-2 focus:ring-[#087F23]"
                    >
                      <option value="default">Urutan Standar</option>
                      <option value="price-asc">Harga: Termurah</option>
                      <option value="price-desc">Harga: Tertinggi</option>
                      <option value="name-asc">Nama Produk (A-Z)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* List Table of Wholesale Items */}
            <div className="bg-white rounded-3xl border border-[#E2EBD8] shadow-xs overflow-hidden">
              <div className="p-4 bg-gradient-to-r from-[#F7FAF5] to-[#E8F5E4] border-b border-[#E2EBD8] flex items-center justify-between">
                <div>
                  <h3 className="font-black text-sm text-[#17331D] flex items-center gap-2">
                    <Package className="w-4 h-4 text-[#087F23]" />
                    <span>Daftar Harga Dus & Keranjang Grosir (Harga Baru)</span>
                  </h3>
                  <p className="text-[11px] text-[#6B7D70] mt-0.5">
                    Menampilkan <strong>{filteredWholesale.length}</strong> produk impor & lokal siap suplai
                  </p>
                </div>
                <span className="text-[10px] bg-white border border-[#CDE0C4] text-[#087F23] font-bold px-2.5 py-1 rounded-full">
                  Harga Resmi Terbaru
                </span>
              </div>

              {filteredWholesale.length === 0 ? (
                <div className="p-12 text-center text-[#6B7D70] space-y-2">
                  <AlertCircle className="w-8 h-8 text-[#FF7F00] mx-auto" />
                  <p className="font-bold text-sm text-[#17331D]">Tidak ada produk yang cocok dengan pencarian.</p>
                  <p className="text-xs">Coba kata kunci lain atau pilih kategori "Semua Produk".</p>
                  <button
                    onClick={() => { setWholesaleCategory('All'); setWholesaleSearch(''); }}
                    className="mt-2 px-3 py-1.5 bg-[#087F23] text-white text-xs font-bold rounded-xl"
                  >
                    Reset Filter
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-[#E2EBD8]">
                  {filteredWholesale.map((item, index) => {
                    const inCalc = calcItems[item.code]?.qty || 0;
                    return (
                      <div
                        key={item.code + '-' + index}
                        className="p-4 hover:bg-[#F7FAF5] transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
                      >
                        {/* Left: Interactive Fruit Photo + Code + Name */}
                        <div className="flex items-center gap-3.5 flex-1 min-w-0">
                          {/* Fruit Photo with Sheen & Zoom effect */}
                          <div 
                            onClick={() => setPreviewWholesaleItem(item)}
                            className="fruit-photo-sheen-container relative w-16 h-16 sm:w-18 sm:h-18 rounded-2xl overflow-hidden bg-neutral-100 shrink-0 border border-[#CDE0C4] cursor-pointer shadow-2xs group-hover:scale-105 transition-transform duration-300"
                            title="Klik untuk lihat foto detail & info kemasan"
                          >
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover group-hover:scale-115 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenPhotoUpload(item);
                                }}
                                className="p-1 rounded-lg bg-black/60 hover:bg-[#087F23] text-white transition-colors"
                                title="Upload / Ganti Foto Buah"
                              >
                                <Camera className="w-3.5 h-3.5" />
                              </button>
                              <ZoomIn className="w-3.5 h-3.5 text-white drop-shadow-md" />
                            </div>
                            <span className="absolute bottom-1 left-1 text-[9px] bg-black/60 text-white px-1 rounded backdrop-blur-2xs">
                              {item.categoryEmoji}
                            </span>
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span className="bg-[#17331D] text-[#FFD54F] font-mono text-[10px] font-black px-2 py-0.5 rounded-md tracking-wider shadow-2xs">
                                KODE: {item.code}
                              </span>
                              <span className="bg-[#E8F5E4] text-[#087F23] text-[10px] font-bold px-2 py-0.5 rounded-md">
                                {item.category}
                              </span>
                              {item.badge && (
                                <span className="bg-[#FFF8E1] text-[#E65100] border border-[#FFE082] text-[9.5px] font-extrabold px-1.5 py-0.2 rounded">
                                  {item.badge}
                                </span>
                              )}
                            </div>

                            <h4 
                              onClick={() => setPreviewWholesaleItem(item)}
                              className="font-bold text-xs sm:text-sm text-[#17331D] group-hover:text-[#087F23] cursor-pointer transition-colors leading-snug"
                            >
                              {item.name}
                            </h4>

                            <div className="flex flex-wrap items-center gap-2 text-[10.5px] text-[#6B7D70] mt-1">
                              <span>Kemasan: <strong>{item.packaging}</strong></span>
                              <span>•</span>
                              <span>Satuan: <strong className="text-[#087F23]">{item.unit}</strong></span>
                              <span>•</span>
                              <span className={`font-bold px-1.5 py-0.2 rounded-md ${
                                item.stockDus < 20 
                                  ? 'bg-red-50 text-red-700 border border-red-200' 
                                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              }`}>
                                {item.stockDus > 0 ? `Stok: ${item.stockDus} Dus` : '🔴 Stok Habis'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Right: Price & Quick Action */}
                        <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E2EBD8] shrink-0 gap-3">
                          <div className="text-left sm:text-right">
                            <span className="text-[10px] text-[#6B7D70] block font-semibold">Harga Baru:</span>
                            <span className="text-base sm:text-lg font-black text-[#087F23]">
                              Rp {item.price.toLocaleString('id-ID')}
                            </span>
                            <span className="text-[10px] text-[#6B7D70] block">/ {item.unit}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Add to calculator */}
                            {inCalc > 0 ? (
                              <div className="flex items-center bg-[#E8F5E4] rounded-xl p-1 border border-[#087F23]">
                                <button
                                  onClick={() => handleUpdateCalcQty(item.code, -1)}
                                  className="w-6 h-6 rounded-lg bg-white text-[#087F23] flex items-center justify-center font-bold text-xs hover:bg-[#D7EED0]"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="px-2.5 text-xs font-black text-[#087F23]">
                                  {inCalc}
                                </span>
                                <button
                                  onClick={() => handleUpdateCalcQty(item.code, 1)}
                                  className="w-6 h-6 rounded-lg bg-[#087F23] text-white flex items-center justify-center font-bold text-xs hover:bg-[#005500]"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleAddWholesaleToCalc(item)}
                                className="bg-[#E8F5E4] hover:bg-[#D7EED0] text-[#087F23] px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 hover:scale-105"
                                title="Tambah ke Kalkulator Belanja"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>+ List</span>
                              </button>
                            )}

                            {/* Upload Photo Button */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenPhotoUpload(item);
                              }}
                              className="p-2 rounded-xl text-neutral-400 hover:text-[#087F23] hover:bg-[#E8F5E4] border border-transparent hover:border-[#CDE0C4] transition-all"
                              title="Upload / Ganti Foto Buah Ini"
                            >
                              <Camera className="w-3.5 h-3.5" />
                            </button>

                            {/* Direct WhatsApp Order */}
                            <a
                              href={`https://wa.me/6285284633214?text=${encodeURIComponent(
                                `Halo Global Fresh Indo, saya ingin memesan grosir:\n*Kode:* ${item.code}\n*Nama Produk:* ${item.name}\n*Harga Baru:* Rp ${item.price.toLocaleString('id-ID')}/${item.unit}\n\nMohon konfirmasi ketersediaan stok & jadwal pengiriman. Terima kasih!`
                              )}`}
                              target="_blank"
                              rel="noreferrer"
                              className="bg-[#087F23] hover:bg-[#005500] text-white px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 shadow-xs hover:scale-105 active:scale-95"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>Pesan WA</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Kalkulator Belanja Sidebar */}
          <div className="lg:col-span-4 space-y-6 sticky top-24">
            <div className="bg-white rounded-3xl p-6 border-2 border-[#087F23]/25 shadow-md">
              <div className="flex items-center justify-between pb-4 border-b border-[#E2EBD8]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#087F23] text-white flex items-center justify-center shadow-xs">
                    <ShoppingCart className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-[#17331D]">Kalkulator Belanja</h3>
                    <span className="text-[10px] text-[#6B7D70]">Estimasi order grosir & retail</span>
                  </div>
                </div>

                {Object.keys(calcItems).length > 0 && (
                  <button
                    onClick={() => setCalcItems({})}
                    className="text-[11px] text-[#E53935] hover:underline font-semibold"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* List of items in calculator */}
              <div className="py-4 space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {Object.keys(calcItems).length === 0 ? (
                  <div className="text-center py-8 text-[#6B7D70]">
                    <ShoppingCart className="w-8 h-8 mx-auto text-[#CDE0C4] mb-2" />
                    <p className="text-xs">Belum ada buah dipilih.</p>
                    <p className="text-[11px] text-[#6B7D70]">Klik "+ List" pada produk di samping untuk simulasi.</p>
                  </div>
                ) : (
                  Object.entries(calcItems).map(([id, item]) => {
                    const itemTotal = item.price * item.qty;
                    return (
                      <div
                        key={id}
                        className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-[#F7FAF5] border border-[#E2EBD8]"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            {item.code && (
                              <span className="text-[9px] font-mono font-black bg-[#17331D] text-[#FFD54F] px-1 rounded">
                                {item.code}
                              </span>
                            )}
                            <span className="text-xs font-bold text-[#17331D] truncate">{item.name}</span>
                          </div>
                          <div className="text-[10px] text-[#6B7D70] mt-0.5">
                            Rp {item.price.toLocaleString('id-ID')} × {item.qty} {item.unit}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs font-extrabold text-[#087F23]">
                            Rp {itemTotal.toLocaleString('id-ID')}
                          </span>
                          <div className="flex items-center bg-white rounded-lg border border-[#CDE0C4]">
                            <button
                              onClick={() => handleUpdateCalcQty(id, -1)}
                              className="px-1.5 py-0.5 text-xs text-[#17331D] hover:text-[#E53935]"
                            >
                              <Minus className="w-2.5 h-2.5" />
                            </button>
                            <span className="px-1.5 text-[11px] font-bold text-[#17331D]">{item.qty}</span>
                            <button
                              onClick={() => handleUpdateCalcQty(id, 1)}
                              className="px-1.5 py-0.5 text-xs text-[#087F23]"
                            >
                              <Plus className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Ice gel option */}
              <div className="pt-3 pb-4 border-t border-[#E2EBD8]">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={useFreeIceGel}
                    onChange={(e) => setUseFreeIceGel(e.target.checked)}
                    className="rounded text-[#087F23] focus:ring-[#087F23] w-4 h-4"
                  />
                  <span className="text-xs font-medium text-[#17331D]">
                    Packing Dus Khusus & Ice Gel (<span className="text-[#087F23] font-bold">GRATIS</span>)
                  </span>
                </label>

                {/* Delivery location input */}
                <div className="mt-3">
                  <label htmlFor="pricelist-delivery-note" className="text-[11px] font-bold text-[#17331D] block mb-1">
                    Alamat / Lokasi Pengiriman:
                  </label>
                  <input
                    id="pricelist-delivery-note"
                    type="text"
                    placeholder="Contoh: Jl. Raya Cianjur No. 12 (Dapur Resto A)"
                    value={deliveryNote}
                    onChange={(e) => setDeliveryNote(e.target.value)}
                    className="w-full bg-[#F7FAF5] border border-[#CDE0C4] rounded-xl p-2 text-xs text-[#17331D] focus:outline-none focus:ring-1 focus:ring-[#087F23]"
                  />
                </div>

                {/* Subtotal & Summary */}
                <div className="mt-4 pt-3 border-t border-[#E2EBD8] space-y-1">
                  <div className="flex justify-between text-xs text-[#6B7D70]">
                    <span>Subtotal Buah</span>
                    <span>Rp {calcSubtotal.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-xs text-[#6B7D70]">
                    <span>Packing & Ice Gel Pendingin</span>
                    <span className="text-[#087F23] font-semibold">Rp 0 (Free)</span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-[#17331D] pt-2 border-t border-dashed border-[#CDE0C4]">
                    <span>Total Estimasi:</span>
                    <span className="text-base text-[#087F23]">
                      Rp {calcSubtotal.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                {/* Submit to WhatsApp */}
                <a
                  href={generateWhatsAppCalcUrl()}
                  target="_blank"
                  rel="noreferrer"
                  className={`mt-4 w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs text-white shadow-md transition-all ${
                    Object.keys(calcItems).length > 0
                      ? 'bg-[#FF7F00] hover:bg-[#E67200] hover:scale-102'
                      : 'bg-neutral-300 pointer-events-none'
                  }`}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Kirim Pesanan ke WhatsApp Toko</span>
                </a>
              </div>
            </div>

            {/* Ketentuan & Garansi Toko Card */}
            <div className="bg-[#F7FAF5] rounded-3xl p-5 border border-[#E2EBD8] space-y-3">
              <h4 className="font-bold text-xs text-[#17331D] flex items-center gap-1.5 uppercase tracking-wide">
                <ShieldCheck className="w-4 h-4 text-[#087F23]" />
                <span>Ketentuan & Garansi Toko</span>
              </h4>

              <ul className="space-y-2.5 text-xs text-[#6B7D70]">
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-[#087F23] shrink-0 mt-0.5" />
                  <span><strong>Garansi 24 Jam:</strong> Foto buah yang rusak/busuk dan kirim ke CS, penggantian dikirim hari itu juga.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-[#087F23] shrink-0 mt-0.5" />
                  <span><strong>Harga Khusus Mitra B2B:</strong> Pembelian rutin resto/hotel mendapat fasilitas tempo 14-30 hari.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-[#087F23] shrink-0 mt-0.5" />
                  <span><strong>Batas Pengiriman Hari Sama:</strong> Order sebelum pukul 16:00 WIB dikirim pada hari yang sama.</span>
                </li>
              </ul>

              <div className="mt-4 pt-3 border-t border-[#E2EBD8] flex items-center justify-between text-xs">
                <span className="text-[#6B7D70]">Hotline Grosir & Retail:</span>
                <a 
                  href="https://wa.me/6285284633214" 
                  target="_blank" 
                  rel="noreferrer"
                  className="font-bold text-[#087F23] hover:underline"
                >
                  0852-8463-3214
                </a>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* 5. Tab 2: Retail Catalog Grid */}
      {activeMainTab === 'retail-catalog' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-300">
          <div className="lg:col-span-8 space-y-4">
            
            {/* Filter Bar & Search */}
            <div className="bg-white p-4 rounded-2xl border border-[#E2EBD8] shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
                {[
                  { id: 'all', label: 'Semua Buah', count: products.length },
                  { id: 'lokal', label: 'Buah Lokal Pilihan', count: products.filter(p => p.category === 'lokal').length },
                  { id: 'import', label: 'Buah Import Premium', count: products.filter(p => p.category === 'import').length },
                  { id: 'parcel', label: 'Paket Hemat & Parcel', count: products.filter(p => p.category === 'parcel').length },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setRetailCategory(cat.id as any)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                      retailCategory === cat.id
                        ? 'bg-[#087F23] text-white shadow-xs'
                        : 'bg-[#F7FAF5] text-[#17331D] hover:bg-[#E8F5E4]'
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      retailCategory === cat.id ? 'bg-[#55AA00] text-white' : 'bg-black/5 text-[#6B7D70]'
                    }`}>
                      {cat.count}
                    </span>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-56">
                  <input
                    type="text"
                    placeholder="Cari eceran..."
                    value={retailSearch}
                    onChange={(e) => setRetailSearch(e.target.value)}
                    className="w-full bg-[#F7FAF5] border border-[#CDE0C4] rounded-xl py-1.5 pl-8 pr-3 text-xs text-[#17331D] focus:outline-none focus:ring-1 focus:ring-[#087F23]"
                  />
                  <Search className="w-3.5 h-3.5 text-[#6B7D70] absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <ArrowUpDown className="w-3.5 h-3.5 text-[#6B7D70]" />
                  <select
                    value={retailSortBy}
                    onChange={(e) => setRetailSortBy(e.target.value as any)}
                    className="bg-[#F7FAF5] border border-[#CDE0C4] rounded-xl py-1.5 px-2 text-xs text-[#17331D] focus:outline-none focus:ring-1 focus:ring-[#087F23]"
                  >
                    <option value="recommended">Rekomendasi</option>
                    <option value="price-asc">Harga: Termurah</option>
                    <option value="price-desc">Harga: Tertinggi</option>
                    <option value="popular">Paling Populer</option>
                  </select>
                </div>
              </div>
            </div>

            {/* List */}
            <div className="space-y-3">
              {filteredProducts.map((product) => {
                const qtyInCalc = calcItems[product.id]?.qty || 0;
                return (
                  <div
                    key={product.id}
                    className="fruit-card-interactive bg-white border border-[#E2EBD8] rounded-2xl p-4 hover:border-[#087F23] hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
                  >
                    <div className="flex items-center gap-3.5 flex-1 min-w-0">
                      <div 
                        onClick={() => onPreviewFruitPhoto ? onPreviewFruitPhoto(product) : onSelectProduct(product)}
                        className="fruit-photo-sheen-container relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-neutral-100 shrink-0 cursor-pointer border border-[#E2EBD8] shadow-2xs"
                        title="Klik untuk zoom foto detail"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <ZoomIn className="w-5 h-5 text-white drop-shadow-md" />
                        </div>
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5 mb-1">
                          <span className="bg-[#E8F5E4] text-[#087F23] text-[9.5px] font-extrabold px-2 py-0.5 rounded">
                            {product.grade}
                          </span>
                          <span className="text-[10px] text-[#6B7D70]">
                            Asal: <strong>{product.origin}</strong>
                          </span>
                        </div>

                        <h3 
                          onClick={() => onSelectProduct(product)}
                          className="font-bold text-sm sm:text-base text-[#17331D] group-hover:text-[#087F23] cursor-pointer truncate transition-colors"
                        >
                          {product.name}
                        </h3>
                        <p className="text-xs text-[#6B7D70] line-clamp-1 mt-0.5">
                          {product.subtitle}
                        </p>

                        <div className="mt-1 flex items-center gap-3 text-[11px] text-[#6B7D70]">
                          <span>Suhu: {product.storageTemp || '2-8°C'}</span>
                          <span>•</span>
                          <span className="text-[#087F23] font-medium">Stok: {product.stockKg} kg</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:items-end justify-between w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E2EBD8] shrink-0">
                      <div className="text-left sm:text-right mb-2">
                        <div className="text-[10px] text-[#6B7D70]">Harga Eceran:</div>
                        <div className="flex items-baseline sm:justify-end gap-1.5">
                          <span className="text-base sm:text-lg font-black text-[#087F23]">
                            Rp {product.retailPrice.toLocaleString('id-ID')}
                          </span>
                          <span className="text-xs text-[#6B7D70]">/{product.unit}</span>
                        </div>

                        <div className="text-[10px] text-[#FF7F00] font-bold">
                          Grosir: Rp {product.wholesalePrice.toLocaleString('id-ID')}
                          <span className="text-[#6B7D70] font-normal text-[9px] block">
                            ({product.wholesaleUnitDesc})
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {qtyInCalc > 0 ? (
                          <div className="flex items-center bg-[#E8F5E4] rounded-xl p-1 border border-[#087F23]">
                            <button
                              onClick={() => handleUpdateCalcQty(product.id, -1)}
                              className="w-6 h-6 rounded-lg bg-white text-[#087F23] flex items-center justify-center font-bold text-xs hover:bg-[#D7EED0]"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2.5 text-xs font-black text-[#087F23]">
                              {qtyInCalc}
                            </span>
                            <button
                              onClick={() => handleUpdateCalcQty(product.id, 1)}
                              className="w-6 h-6 rounded-lg bg-[#087F23] text-white flex items-center justify-center font-bold text-xs hover:bg-[#005500]"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleAddRetailToCalc(product)}
                            className="bg-[#E8F5E4] hover:bg-[#D7EED0] text-[#087F23] px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>+ Ke List</span>
                          </button>
                        )}

                        <a
                          href={`https://wa.me/6285284633214?text=${encodeURIComponent(
                            `Halo Global Fresh Indo, saya ingin memesan *${product.name}* (${product.retailPrice.toLocaleString('id-ID')}/${product.unit}). Apakah stok ready?`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-[#087F23] hover:bg-[#005500] text-white px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 shadow-xs"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Pesan WA</span>
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Kalkulator Belanja Sidebar */}
          <div className="lg:col-span-4 space-y-6 sticky top-24">
            <div className="bg-white rounded-3xl p-6 border-2 border-[#087F23]/25 shadow-md">
              <div className="flex items-center justify-between pb-4 border-b border-[#E2EBD8]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#087F23] text-white flex items-center justify-center">
                    <ShoppingCart className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-[#17331D]">Kalkulator Belanja</h3>
                    <span className="text-[10px] text-[#6B7D70]">Estimasi order instan</span>
                  </div>
                </div>

                {Object.keys(calcItems).length > 0 && (
                  <button
                    onClick={() => setCalcItems({})}
                    className="text-[11px] text-[#E53935] hover:underline font-semibold"
                  >
                    Reset
                  </button>
                )}
              </div>

              <div className="py-4 space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {Object.keys(calcItems).length === 0 ? (
                  <div className="text-center py-8 text-[#6B7D70]">
                    <ShoppingCart className="w-8 h-8 mx-auto text-[#CDE0C4] mb-2" />
                    <p className="text-xs">Belum ada buah dipilih.</p>
                  </div>
                ) : (
                  Object.entries(calcItems).map(([id, item]) => (
                    <div
                      key={id}
                      className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-[#F7FAF5] border border-[#E2EBD8]"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-[#17331D] truncate">{item.name}</div>
                        <div className="text-[10px] text-[#6B7D70]">
                          Rp {item.price.toLocaleString('id-ID')} × {item.qty} {item.unit}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs font-extrabold text-[#087F23]">
                          Rp {(item.price * item.qty).toLocaleString('id-ID')}
                        </span>
                        <div className="flex items-center bg-white rounded-lg border border-[#CDE0C4]">
                          <button
                            onClick={() => handleUpdateCalcQty(id, -1)}
                            className="px-1.5 py-0.5 text-xs text-[#17331D] hover:text-[#E53935]"
                          >
                            <Minus className="w-2.5 h-2.5" />
                          </button>
                          <span className="px-1.5 text-[11px] font-bold text-[#17331D]">{item.qty}</span>
                          <button
                            onClick={() => handleUpdateCalcQty(id, 1)}
                            className="px-1.5 py-0.5 text-xs text-[#087F23]"
                          >
                            <Plus className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-[#E2EBD8] space-y-1">
                <div className="flex justify-between text-sm font-black text-[#17331D] pt-2">
                  <span>Total Estimasi:</span>
                  <span className="text-base text-[#087F23]">
                    Rp {calcSubtotal.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              <a
                href={generateWhatsAppCalcUrl()}
                target="_blank"
                rel="noreferrer"
                className={`mt-4 w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs text-white shadow-md transition-all ${
                  Object.keys(calcItems).length > 0
                    ? 'bg-[#FF7F00] hover:bg-[#E67200]'
                    : 'bg-neutral-300 pointer-events-none'
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                <span>Kirim Pesanan ke WhatsApp Toko</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 6. Tab 3: Dedicated Nutrition & Student Portion Calculator */}
      {activeMainTab === 'nutrition-calculator' && (
        <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
          <div className="bg-white p-6 rounded-3xl border border-[#E2EBD8] shadow-xs">
            <NutritionPortionCalculator 
              initialStudents={1000}
              whatsappNumber="6285284633214"
            />

            <div className="mt-6 pt-6 border-t border-[#E2EBD8] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-xs text-[#17331D]">Butuh Surat Penawaran Resmi (RAB) & Faktur Pajak PT?</h4>
                <p className="text-[11px] text-[#6B7D70]">
                  Gunakan formulir resmi konsultasi BGN untuk melampirkan izin PSAT dan sertifikat laboratorium.
                </p>
              </div>

              <button
                onClick={() => onOpenBgnModal ? onOpenBgnModal() : null}
                className="bg-[#087F23] hover:bg-[#005500] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-xs shrink-0 flex items-center gap-1.5"
              >
                <span>Buka Formulir Resmi SPPG BGN</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Photo Modal for Wholesale item */}
      {previewWholesaleItem && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#E2EBD8] animate-in zoom-in-95 duration-200">
            <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-neutral-900">
              <img
                src={previewWholesaleItem.image}
                alt={previewWholesaleItem.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30"></div>

              {/* Upload Photo Button in Modal Header */}
              <button
                onClick={() => handleOpenPhotoUpload(previewWholesaleItem)}
                className="absolute top-3 left-3 bg-black/60 hover:bg-[#087F23] text-white px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 backdrop-blur-xs border border-white/20 shadow-md"
                title="Upload / Ganti Foto Buah Ini"
              >
                <Camera className="w-3.5 h-3.5 text-[#FFD54F]" />
                <span>Upload Foto Buah</span>
              </button>

              <button
                onClick={() => setPreviewWholesaleItem(null)}
                className="absolute top-3 right-3 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full transition-colors"
                title="Tutup"
              >
                ✕
              </button>

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-[#FFD54F] text-[#17331D] text-[10px] font-black font-mono px-2 py-0.5 rounded">
                    KODE: {previewWholesaleItem.code}
                  </span>
                  <span className="bg-white/20 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    {previewWholesaleItem.category}
                  </span>
                </div>
                <h3 className="font-black text-lg text-white leading-tight">
                  {previewWholesaleItem.name}
                </h3>
              </div>
            </div>

            <div className="p-6 space-y-4 text-xs text-[#17331D]">
              <div className="grid grid-cols-2 gap-3 bg-[#F7FAF5] p-3.5 rounded-2xl border border-[#CDE0C4]">
                <div>
                  <span className="text-[10px] text-[#6B7D70] block">Harga Baru Resmi:</span>
                  <span className="text-lg font-black text-[#087F23]">
                    Rp {previewWholesaleItem.price.toLocaleString('id-ID')}
                  </span>
                  <span className="text-[10px] text-[#6B7D70]">/{previewWholesaleItem.unit}</span>
                </div>

                <div>
                  <span className="text-[10px] text-[#6B7D70] block">Spesifikasi Dus/Kemasan:</span>
                  <span className="text-xs font-bold text-[#17331D] block mt-1">
                    {previewWholesaleItem.packaging}
                  </span>
                </div>
              </div>

              {/* Upload Photo CTA Button */}
              <button
                onClick={() => handleOpenPhotoUpload(previewWholesaleItem)}
                className="w-full bg-[#F0F7EC] hover:bg-[#E8F5E4] text-[#087F23] border border-[#CDE0C4] font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 text-xs"
              >
                <Camera className="w-4 h-4 text-[#087F23]" />
                <span>Upload / Ganti Foto Buah Ini (Kamera / File)</span>
              </button>

              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={() => {
                    handleAddWholesaleToCalc(previewWholesaleItem);
                    setPreviewWholesaleItem(null);
                  }}
                  className="flex-1 bg-[#E8F5E4] hover:bg-[#D7EED0] text-[#087F23] font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah ke Kalkulator Belanja</span>
                </button>

                <a
                  href={`https://wa.me/6285284633214?text=${encodeURIComponent(
                    `Halo Global Fresh Indo, saya ingin memesan grosir:\n*Kode:* ${previewWholesaleItem.code}\n*Nama Produk:* ${previewWholesaleItem.name}\n*Harga Baru:* Rp ${previewWholesaleItem.price.toLocaleString('id-ID')}/${previewWholesaleItem.unit}\n\nApakah stok ready di cold storage?`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 bg-[#087F23] hover:bg-[#005500] text-white font-bold py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Pesan via WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export Catalog Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 border border-[#E2EBD8]">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-[#17331D]">Unduh Katalog & Pricelist Resmi (57+ Produk)</h3>
              <button 
                onClick={() => setShowExportModal(false)}
                className="p-1 rounded-lg hover:bg-neutral-100 text-neutral-500"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-[#6B7D70]">
              Dokumen pricelist resmi PT Global Fresh Indo mencakup seluruh 57 item kode dus grosir & eceran retail terupdate tanggal {new Date().toLocaleDateString('id-ID')}.
            </p>
            <div className="space-y-2.5">
              <button
                onClick={() => {
                  window.print();
                  setShowExportModal(false);
                }}
                className="w-full flex items-center justify-between p-3.5 rounded-xl border border-[#CDE0C4] hover:bg-[#E8F5E4] text-xs font-bold text-[#087F23] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <FileDown className="w-4 h-4" />
                  <span>Download / Print Format PDF Resmi (Lengkap Kode & Harga Baru)</span>
                </div>
                <span className="text-[10px] bg-[#087F23] text-white px-2 py-0.5 rounded font-black">PDF</span>
              </button>

              <button
                onClick={() => {
                  // Generate downloadable CSV formatted for Excel
                  const csvHeaders = 'Kode,Nama Produk,Kategori,Kemasan,Harga Baru\n';
                  const csvRows = wholesaleItems.map(i => `"${i.code}","${i.name}","${i.category}","${i.packaging}","Rp ${i.price.toLocaleString('id-ID')}"`).join('\n');
                  const blob = new Blob([csvHeaders + csvRows], { type: 'text/csv;charset=utf-8;' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `Pricelist_Global_Fresh_Indo_${new Date().toISOString().slice(0, 10)}.csv`;
                  a.click();
                  URL.revokeObjectURL(url);
                  setShowExportModal(false);
                }}
                className="w-full flex items-center justify-between p-3.5 rounded-xl border border-[#CDE0C4] hover:bg-[#E8F5E4] text-xs font-bold text-[#087F23] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  <span>Download File Excel / CSV (Tabulasi 57 Komoditas)</span>
                </div>
                <span className="text-[10px] bg-[#55AA00] text-white px-2 py-0.5 rounded font-black">XLSX</span>
              </button>
            </div>
            <button
              onClick={() => setShowExportModal(false)}
              className="w-full py-2.5 bg-neutral-100 text-neutral-700 rounded-xl text-xs font-semibold hover:bg-neutral-200"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* Fruit Photo Upload Modal */}
      <FruitPhotoUploadModal
        isOpen={isPhotoModalOpen}
        onClose={() => {
          setIsPhotoModalOpen(false);
          setPhotoModalFruit(null);
        }}
        fruit={photoModalFruit}
        onSave={handleSavePhoto}
      />

      {/* Photo Toast Notification */}
      {photoToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#17331D] text-white px-5 py-3 rounded-2xl shadow-2xl border border-emerald-500/40 flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-200">
          <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
            <Check className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-black block">Foto Berhasil Disimpan</span>
            <span className="text-[11px] text-emerald-200">{photoToast}</span>
          </div>
        </div>
      )}
    </div>
  );
};
