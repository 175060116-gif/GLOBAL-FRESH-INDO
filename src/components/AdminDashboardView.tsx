import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, ShoppingBag, Users, DollarSign, 
  Package, AlertTriangle, ArrowUpRight, ArrowDownRight, 
  CheckCircle2, Clock, Truck, BarChart3, Filter, RefreshCw,
  Edit, Trash2, Plus, Store, Search, Camera, Check, RotateCcw,
  Tag, Layers, Sparkles, Hash, Eye, AlertCircle
} from 'lucide-react';
import { Product } from '../data/products';
import { WholesalePricelistItem, WHOLESALE_PRICELIST } from '../data/wholesalePricelist';
import { StoreSettings } from '../data/storeSettings';
import { BusinessUnitCard, DEFAULT_BUSINESS_UNITS } from '../data/businessUnits';
import { ProductEditModal } from './ProductEditModal';
import { WholesaleItemEditModal } from './WholesaleItemEditModal';
import { FruitPhotoUploadModal, FruitPhotoTarget } from './FruitPhotoUploadModal';
import { compressImageFile } from '../utils/imageCompressor';

interface AdminDashboardViewProps {
  products: Product[];
  onUpdateProduct: (product: Product) => void;
  onAddProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onResetProducts: () => void;
  wholesaleItems?: WholesalePricelistItem[];
  onUpdateWholesaleItem?: (item: WholesalePricelistItem) => void;
  onAddWholesaleItem?: (item: WholesalePricelistItem) => void;
  onDeleteWholesaleItem?: (code: string) => void;
  onResetWholesaleItems?: () => void;
  onBulkRestockWholesale?: (code: string, additionalDus: number) => void;
  storeSettings: StoreSettings;
  onOpenStoreSettings: () => void;
  isAdmin?: boolean;
  onOpenAdminLogin?: () => void;
  onLogoutAdmin?: () => void;
  onBackToShopping?: () => void;
  businessUnits?: BusinessUnitCard[];
  onEditBusinessUnit?: (unit: BusinessUnitCard) => void;
  onResetBusinessUnits?: () => void;
  onOpenEditFarmerImage?: () => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({ 
  products,
  onUpdateProduct,
  onAddProduct,
  onDeleteProduct,
  onResetProducts,
  wholesaleItems = WHOLESALE_PRICELIST,
  onUpdateWholesaleItem,
  onAddWholesaleItem,
  onDeleteWholesaleItem,
  onResetWholesaleItems,
  onBulkRestockWholesale,
  storeSettings,
  onOpenStoreSettings,
  isAdmin = false,
  onOpenAdminLogin,
  onLogoutAdmin,
  onBackToShopping,
  businessUnits = DEFAULT_BUSINESS_UNITS,
  onEditBusinessUnit,
  onResetBusinessUnits,
  onOpenEditFarmerImage,
}) => {
  // Navigation Tabs: 'wholesale' (Pricelist 57 SKU), 'products' (Katalog Ritel 12 SKU), 'analytics', 'business_units', 'store_preview'
  const [activeTab, setActiveTab] = useState<'wholesale' | 'products' | 'analytics' | 'business_units' | 'store_preview'>('wholesale');

  // Wholesale filters & search
  const [wholesaleSearch, setWholesaleSearch] = useState('');
  const [wholesaleCategory, setWholesaleCategory] = useState<string>('all');
  const [wholesaleStockFilter, setWholesaleStockFilter] = useState<'all' | 'low' | 'instock' | 'out'>('all');
  const [wholesaleSortBy, setWholesaleSortBy] = useState<'code' | 'name' | 'price-asc' | 'price-desc' | 'stock-asc' | 'stock-desc'>('code');

  // Retail filters & search
  const [productSearch, setProductSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'lokal' | 'import' | 'parcel'>('all');
  
  // Modals state
  const [isRetailEditModalOpen, setIsRetailEditModalOpen] = useState(false);
  const [editingRetailProduct, setEditingRetailProduct] = useState<Product | null>(null);

  const [isWholesaleEditModalOpen, setIsWholesaleEditModalOpen] = useState(false);
  const [editingWholesaleItem, setEditingWholesaleItem] = useState<WholesalePricelistItem | null>(null);

  // Fruit Photo Upload Modal state
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [photoTarget, setPhotoTarget] = useState<FruitPhotoTarget | null>(null);
  const [photoTargetType, setPhotoTargetType] = useState<'wholesale' | 'retail'>('wholesale');
  const [photoUploadToast, setPhotoUploadToast] = useState<string | null>(null);

  const handleOpenWholesalePhoto = (item: WholesalePricelistItem) => {
    setPhotoTarget({
      code: item.code,
      name: item.name,
      category: item.category,
      categoryEmoji: item.categoryEmoji,
      image: item.image,
      unit: item.unit,
    });
    setPhotoTargetType('wholesale');
    setIsPhotoModalOpen(true);
  };

  const handleOpenRetailPhoto = (prod: Product) => {
    setPhotoTarget({
      name: prod.name,
      category: prod.category === 'lokal' ? 'Lokal Nusantara' : prod.category === 'import' ? 'Impor Premium' : 'Parcel Hampers',
      categoryEmoji: '🍎',
      image: prod.image,
      unit: prod.unit,
    });
    setPhotoTargetType('retail');
    setIsPhotoModalOpen(true);
  };

  const handleSavePhotoModal = (newImageUrl: string) => {
    if (!photoTarget) return;

    if (photoTargetType === 'wholesale' && onUpdateWholesaleItem) {
      const match = wholesaleItems.find((w) => w.code === photoTarget.code);
      if (match) {
        onUpdateWholesaleItem({
          ...match,
          image: newImageUrl,
        });
        setPhotoUploadToast(`Foto buah [${match.name}] berhasil diperbarui!`);
        setTimeout(() => setPhotoUploadToast(null), 3000);
      }
    } else if (photoTargetType === 'retail') {
      const match = products.find((p) => p.name === photoTarget.name);
      if (match) {
        onUpdateProduct({
          ...match,
          image: newImageUrl,
        });
        setPhotoUploadToast(`Foto produk [${match.name}] berhasil diperbarui!`);
        setTimeout(() => setPhotoUploadToast(null), 3000);
      }
    }
    setIsPhotoModalOpen(false);
  };

  const handleDirectPhotoFile = async (item: WholesalePricelistItem, file: File) => {
    if (!file || !file.type.startsWith('image/')) return;
    try {
      const compressed = await compressImageFile(file, {
        maxWidth: 900,
        maxHeight: 900,
        quality: 0.78,
        maxSizeKB: 160,
      });
      if (onUpdateWholesaleItem) {
        onUpdateWholesaleItem({
          ...item,
          image: compressed,
        });
        setPhotoUploadToast(`Foto buah [${item.name}] berhasil diunggah!`);
        setTimeout(() => setPhotoUploadToast(null), 3000);
      }
    } catch (err) {
      console.error('Direct upload failed:', err);
      alert('Gagal mengunggah foto. Silakan gunakan tombol Edit Foto.');
    }
  };

  // If user is not authenticated as admin, show lock screen
  if (!isAdmin) {
    return (
      <div className="max-w-xl mx-auto my-16 px-4">
        <div className="p-8 bg-white rounded-3xl border border-[#E2EBD8] shadow-xl text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
            <Store className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 bg-amber-100 px-3 py-1 rounded-full">
              Area Terlindungi • Khusus Pengelola
            </span>
            <h2 className="text-2xl font-black text-[#17331D]">
              Portal Khusus Pemilik & Admin Toko
            </h2>
            <p className="text-xs text-[#6B7D70] leading-relaxed max-w-md mx-auto">
              Kostumer biasa <strong>tidak diizinkan mengubah harga, foto, atau logo toko</strong>. Halaman ini hanya dapat diakses dengan memasukkan PIN Pengelola Toko.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            {onBackToShopping && (
              <button
                onClick={onBackToShopping}
                className="px-5 py-3 rounded-2xl border border-[#CDE0C4] text-xs font-bold text-[#17331D] hover:bg-gray-50 transition-colors"
              >
                Kembali ke Beranda Belanja
              </button>
            )}
            {onOpenAdminLogin && (
              <button
                onClick={onOpenAdminLogin}
                className="px-6 py-3 rounded-2xl bg-[#087F23] hover:bg-[#06631B] text-white text-xs font-black shadow-md transition-all hover:scale-102 flex items-center justify-center gap-2"
              >
                <span>🔑 Masukkan PIN Pengelola</span>
              </button>
            )}
          </div>

          <p className="text-[10px] text-[#6B7D70]">
            PIN Default: <strong className="font-mono text-gray-700">1234</strong> (Dapat diubah kapan saja)
          </p>
        </div>
      </div>
    );
  }

  // Filtered & Sorted Wholesale Items (The 57 items)
  const filteredWholesaleItems = useMemo(() => {
    return wholesaleItems
      .filter((item) => {
        // Category filter
        if (wholesaleCategory !== 'all' && item.category !== wholesaleCategory) return false;

        // Stock filter
        if (wholesaleStockFilter === 'low' && item.stockDus >= 20) return false;
        if (wholesaleStockFilter === 'instock' && (!item.inStock || item.stockDus <= 0)) return false;
        if (wholesaleStockFilter === 'out' && item.inStock && item.stockDus > 0) return false;

        // Search query (code, name, packaging)
        if (wholesaleSearch.trim() !== '') {
          const q = wholesaleSearch.toLowerCase();
          return (
            item.code.toLowerCase().includes(q) ||
            item.name.toLowerCase().includes(q) ||
            item.category.toLowerCase().includes(q) ||
            item.packaging.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => {
        if (wholesaleSortBy === 'price-asc') return a.price - b.price;
        if (wholesaleSortBy === 'price-desc') return b.price - a.price;
        if (wholesaleSortBy === 'stock-asc') return a.stockDus - b.stockDus;
        if (wholesaleSortBy === 'stock-desc') return b.stockDus - a.stockDus;
        if (wholesaleSortBy === 'name') return a.name.localeCompare(b.name);
        return a.code.localeCompare(b.code, undefined, { numeric: true });
      });
  }, [wholesaleItems, wholesaleCategory, wholesaleStockFilter, wholesaleSearch, wholesaleSortBy]);

  // Filtered Retail Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.origin.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.subtitle.toLowerCase().includes(productSearch.toLowerCase());
      const matchesCat = categoryFilter === 'all' || p.category === categoryFilter;
      return matchesSearch && matchesCat;
    });
  }, [products, productSearch, categoryFilter]);

  // Aggregate Stats for Analytics & Warehouse
  const totalWholesaleDus = useMemo(() => {
    return wholesaleItems.reduce((acc, curr) => acc + (curr.stockDus || 0), 0);
  }, [wholesaleItems]);

  const totalWholesaleValue = useMemo(() => {
    return wholesaleItems.reduce((acc, curr) => acc + (curr.price * (curr.stockDus || 0)), 0);
  }, [wholesaleItems]);

  const totalRetailKg = useMemo(() => {
    return products.reduce((acc, curr) => acc + (curr.stockKg || 0), 0);
  }, [products]);

  const totalRetailValue = useMemo(() => {
    return products.reduce((acc, curr) => acc + (curr.retailPrice * (curr.stockKg || 0)), 0);
  }, [products]);

  const totalInventoryValue = totalWholesaleValue + totalRetailValue;

  const lowStockWholesaleItems = useMemo(() => {
    return wholesaleItems.filter(item => item.stockDus < 20);
  }, [wholesaleItems]);

  const lowStockRetailProducts = useMemo(() => {
    return products.filter(p => p.stockKg < 250);
  }, [products]);

  // Category counts for wholesale
  const wholesaleCategoryList = useMemo(() => {
    const counts: Record<string, number> = { all: wholesaleItems.length };
    wholesaleItems.forEach(item => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });

    return [
      { id: 'all', label: 'Semua Produk', emoji: '✨', count: counts.all },
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

  // Inline Wholesale handlers
  const handleInlineWholesalePriceChange = (item: WholesalePricelistItem, newPrice: number) => {
    if (newPrice >= 0 && onUpdateWholesaleItem) {
      onUpdateWholesaleItem({ ...item, price: newPrice });
    }
  };

  const handleInlineWholesaleStockChange = (item: WholesalePricelistItem, newStock: number) => {
    if (newStock >= 0 && onUpdateWholesaleItem) {
      onUpdateWholesaleItem({ 
        ...item, 
        stockDus: newStock,
        inStock: newStock > 0 
      });
    }
  };

  const handleToggleWholesaleStockStatus = (item: WholesalePricelistItem) => {
    if (onUpdateWholesaleItem) {
      onUpdateWholesaleItem({ ...item, inStock: !item.inStock });
    }
  };

  const handleQuickWholesaleRestock = (code: string, additional: number) => {
    if (onBulkRestockWholesale) {
      onBulkRestockWholesale(code, additional);
    } else if (onUpdateWholesaleItem) {
      const match = wholesaleItems.find(i => i.code === code);
      if (match) {
        const next = (match.stockDus || 0) + additional;
        onUpdateWholesaleItem({ ...match, stockDus: next, inStock: next > 0 });
      }
    }
  };

  const handleDeleteWholesale = (code: string, name: string) => {
    if (window.confirm(`Hapus produk [Kode: ${code}] "${name}" dari daftar harga buah resmi?`)) {
      if (onDeleteWholesaleItem) onDeleteWholesaleItem(code);
    }
  };

  // Inline Retail handlers
  const handleInlineRetailPriceChange = (product: Product, newPrice: number) => {
    if (newPrice > 0) {
      onUpdateProduct({ ...product, retailPrice: newPrice });
    }
  };

  const handleInlineRetailStockChange = (product: Product, newStock: number) => {
    if (newStock >= 0) {
      onUpdateProduct({ ...product, stockKg: newStock, inStock: newStock > 0 });
    }
  };

  const handleDeleteRetail = (id: string, name: string) => {
    if (window.confirm(`Hapus produk "${name}" dari katalog ritel?`)) {
      onDeleteProduct(id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Top Header & Store Control Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#E2EBD8] shadow-xs">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-[#087F23] uppercase tracking-wider bg-[#E8F5E4] px-2.5 py-0.5 rounded-full">
              Pusat Kontrol & Manajemen Stok Toko
            </span>
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Firestore Cloud Database: Terhubung Real-Time
            </span>
            <span className="text-xs text-[#6B7D70]">
              ID Toko: GFI-{storeSettings.city.toUpperCase()}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#17331D] mt-1">
            Manajemen Produk, Daftar Harga & Stok Fisik
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7D70] mt-1">
            Kelola seluruh <strong>57 SKU Buah Pricelist Resmi</strong> (Kode Produk, Harga Baru, Stok Dus/Karton) dan <strong>Katalog Ritel</strong> secara terpusat dan tersimpan otomatis.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenStoreSettings}
            className="px-4 py-2.5 bg-[#FFF3E0] hover:bg-[#FFE0B2] text-[#E65100] border border-[#FFCC80] rounded-2xl text-xs font-black flex items-center gap-2 shadow-xs transition-all hover:scale-102"
            title="Ubah logo toko, nama, slogan, dan no WhatsApp"
          >
            <Store className="w-4 h-4 text-[#FF7F00]" />
            <span>⚙️ Logo & Info Toko</span>
          </button>

          <button
            onClick={() => {
              if (activeTab === 'wholesale') {
                setEditingWholesaleItem(null);
                setIsWholesaleEditModalOpen(true);
              } else {
                setEditingRetailProduct(null);
                setIsRetailEditModalOpen(true);
              }
            }}
            className="px-4 py-2.5 bg-[#087F23] hover:bg-[#06631B] text-white rounded-2xl text-xs font-black flex items-center gap-2 shadow-md transition-all hover:scale-102"
          >
            <Plus className="w-4 h-4" />
            <span>{activeTab === 'wholesale' ? 'Tambah Item Buah (Kode Baru)' : 'Tambah Produk Ritel'}</span>
          </button>

          {onLogoutAdmin && (
            <button
              onClick={onLogoutAdmin}
              className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-[#17331D] rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-colors"
              title="Kunci mode admin dan beralih ke tampilan belanja kostumer"
            >
              <span>👁️ Tampilan Kostumer</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Mode Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E2EBD8] pb-3">
        <div className="flex flex-wrap items-center gap-2 bg-[#F0F7EC] p-1.5 rounded-2xl">
          {/* TAB 1: WHOLESALE OFFICIAL PRICELIST (57 ITEMS) */}
          <button
            onClick={() => setActiveTab('wholesale')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all ${
              activeTab === 'wholesale'
                ? 'bg-[#087F23] text-white shadow-md'
                : 'text-[#17331D] hover:bg-white/80'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Pricelist Buah Resmi & Stok Dus ({wholesaleItems.length} SKU)</span>
            <span className="bg-amber-400 text-black text-[10px] px-1.5 py-0.2 rounded-full font-black">
              57 Item
            </span>
          </button>

          {/* TAB 2: RETAIL PRODUCTS */}
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'products'
                ? 'bg-[#087F23] text-white shadow-xs'
                : 'text-[#17331D] hover:bg-white/80'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Katalog Ritel & Eceran ({products.length} SKU)</span>
          </button>

          {/* TAB 3: ANALYTICS & WAREHOUSE INVENTORY */}
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'analytics'
                ? 'bg-[#087F23] text-white shadow-xs'
                : 'text-[#17331D] hover:bg-white/80'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Statistik & Manajemen Stok Gudang</span>
            {lowStockWholesaleItems.length > 0 && (
              <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-black animate-pulse">
                {lowStockWholesaleItems.length} Menipis
              </span>
            )}
          </button>

          {/* TAB 4: BUSINESS UNITS */}
          <button
            onClick={() => setActiveTab('business_units')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'business_units'
                ? 'bg-[#087F23] text-white shadow-xs'
                : 'text-[#17331D] hover:bg-white/80'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Unit Bisnis & Foto Layanan</span>
          </button>

          {/* TAB 5: STORE PREVIEW */}
          <button
            onClick={() => setActiveTab('store_preview')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'store_preview'
                ? 'bg-[#087F23] text-white shadow-xs'
                : 'text-[#17331D] hover:bg-white/80'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Identitas Toko Aktif</span>
          </button>
        </div>

        {/* Reset Buttons */}
        {activeTab === 'wholesale' && onResetWholesaleItems && (
          <button
            onClick={() => {
              if (window.confirm('Kembalikan seluruh 57 item daftar harga buah ke pricelist resmi awal bawaan?')) {
                onResetWholesaleItems();
              }
            }}
            className="text-xs font-bold text-[#6B7D70] hover:text-[#E53935] flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-red-50 border border-transparent hover:border-red-200 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Pricelist ke 57 Item Resmi</span>
          </button>
        )}

        {activeTab === 'products' && (
          <button
            onClick={() => {
              if (window.confirm('Kembalikan seluruh katalog ritel ke data bawaan awal?')) {
                onResetProducts();
              }
            }}
            className="text-xs font-bold text-[#6B7D70] hover:text-[#E53935] flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-red-50 border border-transparent hover:border-red-200 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Ritel ke Default</span>
          </button>
        )}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: WHOLESALE OFFICIAL PRICELIST & STOK DUS (THE 57 PRODUCTS)          */}
      {/* ========================================================================= */}
      {activeTab === 'wholesale' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Summary Banner */}
          <div className="bg-gradient-to-r from-[#17331D] to-[#087F23] rounded-3xl p-6 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300 bg-white/10 px-3 py-1 rounded-full">
                Inventaris Grosir Dus & Karton
              </span>
              <h2 className="text-xl sm:text-2xl font-black">
                Daftar Harga Buah Resmi & Kontrol Stok Gudang (57 Item)
              </h2>
              <p className="text-xs text-emerald-100 max-w-2xl">
                Setiap perubahan pada <strong>Harga Baru</strong> atau <strong>Stok Dus</strong> langsung tersinkronisasi ke katalog publik, kalkulator pesanan, dan laporan gudang.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="bg-white/10 backdrop-blur-xs border border-white/20 p-3 rounded-2xl text-center">
                <span className="text-[10px] text-emerald-200 uppercase block font-bold">Total Stok Fisik</span>
                <span className="text-xl font-black text-amber-300">{totalWholesaleDus.toLocaleString('id-ID')}</span>
                <span className="text-[10px] text-white/80 block">Dus / Karton</span>
              </div>
              <div className="bg-white/10 backdrop-blur-xs border border-white/20 p-3 rounded-2xl text-center">
                <span className="text-[10px] text-emerald-200 uppercase block font-bold">Total Estimasi Nilai</span>
                <span className="text-xl font-black text-white">Rp {(totalWholesaleValue / 1000000).toFixed(1)} Jt</span>
                <span className="text-[10px] text-white/80 block">{wholesaleItems.length} SKU Buah</span>
              </div>
            </div>
          </div>

          {/* Search, Category & Filter Controls */}
          <div className="bg-white p-5 rounded-3xl border border-[#E2EBD8] shadow-xs space-y-4">
            {/* Top row: Search, Stock filter, Sort */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#6B7D70]" />
                <input
                  type="text"
                  value={wholesaleSearch}
                  onChange={(e) => setWholesaleSearch(e.target.value)}
                  placeholder="Cari Kode (contoh: 2021, 11119) atau Nama Buah..."
                  className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-[#CDE0C4] bg-[#F7FAF5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#087F23] font-semibold"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                {/* Stock status filter */}
                <select
                  value={wholesaleStockFilter}
                  onChange={(e) => setWholesaleStockFilter(e.target.value as any)}
                  className="text-xs font-bold px-3 py-2 rounded-xl border border-[#CDE0C4] bg-[#F7FAF5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#087F23]"
                >
                  <option value="all">Semua Status Stok</option>
                  <option value="low">⚠️ Stok Menipis (&lt; 20 Dus)</option>
                  <option value="instock">🟢 Tersedia di Gudang</option>
                  <option value="out">🔴 Habis / Kosong</option>
                </select>

                {/* Sort selector */}
                <select
                  value={wholesaleSortBy}
                  onChange={(e) => setWholesaleSortBy(e.target.value as any)}
                  className="text-xs font-bold px-3 py-2 rounded-xl border border-[#CDE0C4] bg-[#F7FAF5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#087F23]"
                >
                  <option value="code">Urutkan Kode Produk</option>
                  <option value="name">Urutkan Nama (A - Z)</option>
                  <option value="price-asc">Harga: Termurah</option>
                  <option value="price-desc">Harga: Tertinggi</option>
                  <option value="stock-asc">Stok: Paling Sedikit</option>
                  <option value="stock-desc">Stok: Paling Banyak</option>
                </select>

                <div className="text-xs text-[#6B7D70] font-semibold pl-2">
                  Menampilkan <span className="font-bold text-[#087F23]">{filteredWholesaleItems.length}</span> dari {wholesaleItems.length} item
                </div>
              </div>
            </div>

            {/* Category Filter Pills (9 Fruit Categories) */}
            <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[#E2EBD8]/60">
              {wholesaleCategoryList.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setWholesaleCategory(cat.id)}
                  className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                    wholesaleCategory === cat.id
                      ? 'bg-[#17331D] text-white shadow-xs scale-102'
                      : 'bg-[#F0F7EC] text-[#17331D] hover:bg-[#E2EBD8]'
                  }`}
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    wholesaleCategory === cat.id ? 'bg-white/20 text-white' : 'bg-white text-[#087F23]'
                  }`}>
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Wholesale Data Table */}
          <div className="bg-white rounded-3xl border border-[#E2EBD8] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F7FAF5] border-b border-[#E2EBD8] text-[#6B7D70] uppercase font-bold tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Kode Produk</th>
                    <th className="py-3.5 px-4">Foto & Nama Produk Buah</th>
                    <th className="py-3.5 px-4">Kategori & Kemasan</th>
                    <th className="py-3.5 px-4">Harga Baru (Rp)</th>
                    <th className="py-3.5 px-4">Stok Gudang (Dus/Karton)</th>
                    <th className="py-3.5 px-4 text-center">Status Fisik</th>
                    <th className="py-3.5 px-4 text-center">Aksi Cepat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2EBD8]/60">
                  {filteredWholesaleItems.map((item) => (
                    <tr key={item.code} className="hover:bg-[#F9FCF7] transition-colors group">
                      {/* Kode Produk */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-xs px-2.5 py-1 rounded-lg bg-emerald-50 text-[#087F23] border border-emerald-200">
                            #{item.code}
                          </span>
                        </div>
                      </td>

                      {/* Photo & Name */}
                      <td className="py-3 px-4 max-w-xs">
                        <div className="flex items-center gap-3">
                          <div 
                            onClick={() => handleOpenWholesalePhoto(item)}
                            className="group/img relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-[#E2EBD8] bg-gray-50 cursor-pointer shadow-2xs hover:border-[#087F23] transition-all"
                            title="Klik untuk Upload / Ganti Foto Buah"
                          >
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover group-hover/img:scale-110 transition-transform"
                            />
                            <div className="absolute inset-0 bg-black/45 opacity-0 group-hover/img:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                              <Camera className="w-4 h-4 drop-shadow" />
                              <span className="text-[7.5px] font-bold mt-0.5">Ganti</span>
                            </div>
                            {item.badge && (
                              <span className="absolute bottom-0 right-0 bg-[#E53935] text-white text-[8px] font-black px-1 rounded-tl-md">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <div>
                            <span 
                              onClick={() => handleOpenWholesalePhoto(item)}
                              className="font-extrabold text-xs text-[#17331D] hover:text-[#087F23] cursor-pointer block leading-snug transition-colors"
                              title="Klik untuk lihat / ganti foto"
                            >
                              {item.name}
                            </span>
                            <span className="text-[10px] text-gray-500 line-clamp-1 mt-0.5">
                              {item.packaging}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category & Packaging */}
                      <td className="py-3 px-4">
                        <div className="flex flex-col gap-1">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-bold text-[10px] w-max bg-[#E8F5E4] text-[#087F23]">
                            <span>{item.categoryEmoji}</span>
                            <span>{item.category}</span>
                          </span>
                          <span className="text-[10px] text-[#6B7D70]">
                            Satuan: <strong>{item.unit}</strong>
                          </span>
                        </div>
                      </td>

                      {/* Harga Baru (Inline Editable with Auto-Save) */}
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1">
                            <span className="text-gray-400 font-bold">Rp</span>
                            <input
                              type="number"
                              min="0"
                              step="5000"
                              value={item.price}
                              onChange={(e) => handleInlineWholesalePriceChange(item, Number(e.target.value))}
                              className="w-28 px-2 py-1 bg-white border border-[#CDE0C4] hover:border-[#087F23] rounded-lg font-black text-[#087F23] text-xs focus:ring-2 focus:ring-[#087F23] focus:outline-none"
                              title="Ketik untuk mengubah Harga Baru secara langsung"
                            />
                          </div>
                          <span className="text-[9.5px] text-gray-400 block">
                            Rp {item.price.toLocaleString('id-ID')} / {item.unit}
                          </span>
                        </div>
                      </td>

                      {/* Stok Gudang (Inline Editable & Quick Add) */}
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              min="0"
                              value={item.stockDus}
                              onChange={(e) => handleInlineWholesaleStockChange(item, Number(e.target.value))}
                              className={`w-20 px-2 py-1 rounded-lg text-xs font-black border ${
                                item.stockDus < 20 
                                  ? 'bg-red-50 text-red-700 border-red-300' 
                                  : 'bg-white text-[#17331D] border-[#CDE0C4]'
                              }`}
                              title="Ubah stok fisik di gudang"
                            />
                            <span className="text-[11px] text-[#6B7D70]">Dus</span>

                            {/* Quick Restock Buttons */}
                            <button
                              onClick={() => handleQuickWholesaleRestock(item.code, 25)}
                              className="px-1.5 py-0.5 rounded-md bg-emerald-100 text-[#087F23] hover:bg-emerald-200 text-[10px] font-bold"
                              title="Tambah +25 Dus langsung"
                            >
                              +25
                            </button>
                            <button
                              onClick={() => handleQuickWholesaleRestock(item.code, 50)}
                              className="px-1.5 py-0.5 rounded-md bg-emerald-100 text-[#087F23] hover:bg-emerald-200 text-[10px] font-bold"
                              title="Tambah +50 Dus langsung"
                            >
                              +50
                            </button>
                          </div>

                          {item.stockDus < 20 && (
                            <span className="text-[9.5px] font-bold text-red-600 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              <span>Stok Tipis (&lt; 20 Dus)</span>
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Status Fisik (Tersedia / Kosong) */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleToggleWholesaleStockStatus(item)}
                          className={`px-3 py-1 rounded-full text-[10px] font-black transition-all ${
                            item.inStock && item.stockDus > 0
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}
                          title="Klik untuk mengubah status ketersediaan"
                        >
                          {item.inStock && item.stockDus > 0 ? '🟢 Tersedia' : '🔴 Habis'}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleOpenWholesalePhoto(item)}
                            className="p-1.5 text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200/80 rounded-xl font-bold flex items-center gap-1 transition-all text-[11px]"
                            title="Upload / Ganti Foto Buah"
                          >
                            <Camera className="w-3.5 h-3.5 text-blue-600" />
                            <span>Foto</span>
                          </button>
                          <button
                            onClick={() => {
                              setEditingWholesaleItem(item);
                              setIsWholesaleEditModalOpen(true);
                            }}
                            className="p-1.5 text-[#087F23] hover:bg-[#E8F5E4] rounded-xl font-bold flex items-center gap-1 transition-colors text-[11px]"
                            title="Edit nama, foto, atau kemasan item"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteWholesale(item.code, item.name)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                            title="Hapus dari pricelist"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredWholesaleItems.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-[#6B7D70]">
                        <Package className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                        <p className="font-bold text-sm">Tidak ada produk dalam daftar harga buah yang sesuai.</p>
                        <button
                          onClick={() => { setWholesaleSearch(''); setWholesaleCategory('all'); setWholesaleStockFilter('all'); }}
                          className="mt-2 text-xs text-[#087F23] font-bold underline"
                        >
                          Reset Filter & Tampilkan Semua 57 Item
                        </button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: RETAIL PRODUCTS & PRICING                                          */}
      {/* ========================================================================= */}
      {activeTab === 'products' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Search, Filter & Quick Stats Bar */}
          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#E2EBD8] shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#6B7D70]" />
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Cari produk ritel, asal..."
                className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-[#CDE0C4] bg-[#F7FAF5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#087F23]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
              {[
                { id: 'all', label: 'Semua Produk' },
                { id: 'lokal', label: 'Buah Lokal' },
                { id: 'import', label: 'Buah Impor' },
                { id: 'parcel', label: 'Parcel Hampers' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategoryFilter(cat.id as any)}
                  className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all ${
                    categoryFilter === cat.id
                      ? 'bg-[#17331D] text-white'
                      : 'bg-[#F0F7EC] text-[#17331D] hover:bg-[#E2EBD8]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="text-xs text-[#6B7D70] font-semibold">
              Menampilkan <span className="font-bold text-[#087F23]">{filteredProducts.length}</span> produk ritel
            </div>
          </div>

          {/* Product Data Table */}
          <div className="bg-white rounded-3xl border border-[#E2EBD8] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F7FAF5] border-b border-[#E2EBD8] text-[#6B7D70] uppercase font-bold tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Foto & Nama Produk</th>
                    <th className="py-3.5 px-4">Kategori & Asal</th>
                    <th className="py-3.5 px-4">Harga Ritel (Rp)</th>
                    <th className="py-3.5 px-4">Harga Grosir (Rp)</th>
                    <th className="py-3.5 px-4">Stok (Kg/Pack)</th>
                    <th className="py-3.5 px-4 text-center">Aksi Cepat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2EBD8]/60">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-[#F9FCF7] transition-colors group">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div 
                            onClick={() => handleOpenRetailPhoto(p)}
                            className="group/img relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-[#E2EBD8] bg-gray-50 cursor-pointer shadow-2xs hover:border-[#087F23] transition-all"
                            title="Klik untuk Upload / Ganti Foto Produk Buah"
                          >
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-full h-full object-cover group-hover/img:scale-110 transition-transform"
                            />
                            <div className="absolute inset-0 bg-black/45 opacity-0 group-hover/img:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                              <Camera className="w-4 h-4 drop-shadow" />
                              <span className="text-[7.5px] font-bold mt-0.5">Ganti</span>
                            </div>
                            {p.discountPercent ? (
                              <span className="absolute bottom-0 right-0 bg-[#E53935] text-white text-[9px] font-black px-1 rounded-tl-md">
                                -{p.discountPercent}%
                              </span>
                            ) : null}
                          </div>
                          <div>
                            <div className="font-extrabold text-sm text-[#17331D] flex items-center gap-1.5">
                              <span 
                                onClick={() => handleOpenRetailPhoto(p)}
                                className="hover:text-[#087F23] cursor-pointer transition-colors"
                                title="Klik untuk ganti foto"
                              >
                                {p.name}
                              </span>
                              {p.isBestDeal && (
                                <span className="bg-[#E8F5E4] text-[#087F23] text-[9px] font-black px-1.5 py-0.5 rounded-md">
                                  PROMO
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-[#6B7D70] line-clamp-1">
                              {p.subtitle}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex flex-col">
                          <span className={`inline-block px-2 py-0.5 rounded-md font-bold text-[10px] w-max ${
                            p.category === 'lokal' ? 'bg-green-100 text-green-800' :
                            p.category === 'import' ? 'bg-blue-100 text-blue-800' :
                            'bg-orange-100 text-orange-800'
                          }`}>
                            {p.category === 'lokal' ? 'Lokal Nusantara' : p.category === 'import' ? 'Impor Premium' : 'Parcel Hampers'}
                          </span>
                          <span className="text-[11px] text-[#6B7D70] mt-1">
                            📍 {p.origin}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1">
                            <span className="text-gray-400 font-bold">Rp</span>
                            <input
                              type="number"
                              min="500"
                              step="500"
                              value={p.retailPrice}
                              onChange={(e) => handleInlineRetailPriceChange(p, Number(e.target.value))}
                              className="w-24 px-2 py-1 bg-white border border-[#CDE0C4] hover:border-[#087F23] rounded-lg font-black text-[#087F23] text-xs focus:ring-1 focus:ring-[#087F23] focus:outline-none"
                            />
                            <span className="text-[10px] text-gray-500">/{p.unit}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-bold text-[#17331D]">
                          Rp {p.wholesalePrice.toLocaleString('id-ID')}
                          <span className="text-[10px] text-gray-500 block font-normal">
                            Min. {p.wholesaleMinQty} {p.unit}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            min="0"
                            value={p.stockKg}
                            onChange={(e) => handleInlineRetailStockChange(p, Number(e.target.value))}
                            className={`w-20 px-2 py-1 rounded-lg text-xs font-bold border ${
                              p.stockKg < 250 
                                ? 'bg-red-50 text-red-700 border-red-300' 
                                : 'bg-white text-[#17331D] border-[#CDE0C4]'
                            }`}
                          />
                          <span className="text-[11px] text-[#6B7D70]">{p.unit}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleOpenRetailPhoto(p)}
                            className="p-1.5 text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200/80 rounded-xl font-bold flex items-center gap-1 transition-all text-[11px]"
                            title="Upload / Ganti Foto Produk"
                          >
                            <Camera className="w-3.5 h-3.5 text-blue-600" />
                            <span>Foto</span>
                          </button>
                          <button
                            onClick={() => {
                              setEditingRetailProduct(p);
                              setIsRetailEditModalOpen(true);
                            }}
                            className="p-1.5 text-[#087F23] hover:bg-[#E8F5E4] rounded-xl font-bold flex items-center gap-1 transition-colors text-[11px]"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteRetail(p.id, p.name)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: ANALYTICS & WAREHOUSE INVENTORY MANAGEMENT                        */}
      {/* ========================================================================= */}
      {activeTab === 'analytics' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* 4 Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-[#E2EBD8] shadow-xs">
              <div className="flex items-center justify-between text-[#6B7D70] text-xs font-medium">
                <span>Total Penjualan</span>
                <span className="p-2 rounded-xl bg-[#E8F5E4] text-[#087F23]">
                  <DollarSign className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-[#17331D] mt-2">
                Rp 85,2 Jt
              </div>
              <div className="flex items-center gap-1 text-xs text-[#087F23] font-bold mt-2">
                <ArrowUpRight className="w-4 h-4" />
                <span>+12.8% dari bulan lalu</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-[#E2EBD8] shadow-xs">
              <div className="flex items-center justify-between text-[#6B7D70] text-xs font-medium">
                <span>Stok Grosir (Dus/Karton)</span>
                <span className="p-2 rounded-xl bg-[#FFF3E0] text-[#FF7F00]">
                  <Package className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-[#17331D] mt-2">
                {totalWholesaleDus.toLocaleString('id-ID')} Dus
              </div>
              <div className="text-xs text-[#087F23] font-bold mt-2">
                <span>57 SKU Pricelist Resmi Aktif</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-[#E2EBD8] shadow-xs">
              <div className="flex items-center justify-between text-[#6B7D70] text-xs font-medium">
                <span>Stok Ritel Gudang</span>
                <span className="p-2 rounded-xl bg-[#E0F2FE] text-[#0284C7]">
                  <Layers className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-[#17331D] mt-2">
                {totalRetailKg.toLocaleString('id-ID')} Kg
              </div>
              <div className="text-xs text-[#6B7D70] font-medium mt-2">
                <span>{products.length} SKU Buah Ritel</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-[#E2EBD8] shadow-xs">
              <div className="flex items-center justify-between text-[#6B7D70] text-xs font-medium">
                <span>Total Nilai Aset Gudang</span>
                <span className="p-2 rounded-xl bg-[#F3E8FF] text-[#9333EA]">
                  <TrendingUp className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-[#17331D] mt-2">
                Rp {(totalInventoryValue / 1000000).toFixed(1)} Jt
              </div>
              <div className="text-xs text-[#6B7D70] font-medium mt-2">
                <span>Dus & Ritel Gabungan</span>
              </div>
            </div>
          </div>

          {/* Low Stock Warning Section (Dus + Kg) */}
          <div className="bg-white p-6 rounded-3xl border border-[#E2EBD8] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#E53935]">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="font-extrabold text-base text-[#17331D]">
                  Peringatan Stok Menipis di Gudang
                </h3>
              </div>
              <span className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded-full font-bold">
                {lowStockWholesaleItems.length + lowStockRetailProducts.length} Item Perlu Restock
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
              {/* Wholesale Low Stock */}
              {lowStockWholesaleItems.map((item) => (
                <div
                  key={item.code}
                  className="p-3.5 rounded-2xl bg-[#FFF5F5] border border-red-200 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5">
                    <img src={item.image} alt={item.name} className="w-11 h-11 rounded-xl object-cover shrink-0" />
                    <div>
                      <span className="text-[10px] font-mono font-bold bg-white text-red-700 px-1.5 py-0.5 rounded border border-red-200">
                        #{item.code}
                      </span>
                      <h4 className="font-bold text-xs text-[#17331D] line-clamp-1 mt-0.5">{item.name}</h4>
                      <span className="text-[11px] text-red-600 font-bold">
                        Sisa: {item.stockDus} Dus
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleQuickWholesaleRestock(item.code, 50)}
                    className="bg-[#087F23] hover:bg-[#06631B] text-white text-[11px] font-bold px-3 py-1.5 rounded-xl shrink-0 shadow-xs transition-all hover:scale-102"
                    title="Tambah +50 Dus langsung"
                  >
                    +50 Dus
                  </button>
                </div>
              ))}

              {/* Retail Low Stock */}
              {lowStockRetailProducts.map((p) => (
                <div
                  key={p.id}
                  className="p-3.5 rounded-2xl bg-[#FFF5F5] border border-red-200 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5">
                    <img src={p.image} alt={p.name} className="w-11 h-11 rounded-xl object-cover shrink-0" />
                    <div>
                      <span className="text-[10px] font-bold bg-white text-orange-700 px-1.5 py-0.5 rounded border border-orange-200">
                        Ritel
                      </span>
                      <h4 className="font-bold text-xs text-[#17331D] line-clamp-1 mt-0.5">{p.name}</h4>
                      <span className="text-[11px] text-red-600 font-bold">
                        Sisa: {p.stockKg} {p.unit}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleInlineRetailStockChange(p, p.stockKg + 200)}
                    className="bg-[#087F23] hover:bg-[#06631B] text-white text-[11px] font-bold px-3 py-1.5 rounded-xl shrink-0 shadow-xs transition-all hover:scale-102"
                  >
                    +200 Kg
                  </button>
                </div>
              ))}

              {lowStockWholesaleItems.length === 0 && lowStockRetailProducts.length === 0 && (
                <div className="col-span-full py-8 text-center text-[#6B7D70]">
                  <CheckCircle2 className="w-8 h-8 mx-auto text-[#087F23] mb-1" />
                  <p className="font-bold">Seluruh stok fisik buah di gudang dalam kondisi aman.</p>
                </div>
              )}
            </div>
          </div>

          {/* Breakdown Stok per Kategori Buah (9 Kategori) */}
          <div className="bg-white p-6 rounded-3xl border border-[#E2EBD8] shadow-xs space-y-4">
            <h3 className="font-extrabold text-base text-[#17331D]">
              Distribusi Stok Gudang Berdasarkan 9 Kategori Buah Resmi
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
              {wholesaleCategoryList.filter(c => c.id !== 'all').map((cat) => {
                const itemsInCat = wholesaleItems.filter(i => i.category === cat.id);
                const totalDusCat = itemsInCat.reduce((acc, curr) => acc + (curr.stockDus || 0), 0);
                const totalValueCat = itemsInCat.reduce((acc, curr) => acc + (curr.price * (curr.stockDus || 0)), 0);

                return (
                  <div key={cat.id} className="p-4 rounded-2xl bg-[#F7FAF5] border border-[#E2EBD8] text-center space-y-1">
                    <span className="text-2xl">{cat.emoji}</span>
                    <h4 className="font-extrabold text-xs text-[#17331D]">{cat.label}</h4>
                    <span className="text-base font-black text-[#087F23] block">
                      {totalDusCat} Dus
                    </span>
                    <span className="text-[10px] text-gray-500 block">
                      {itemsInCat.length} SKU • Rp {(totalValueCat / 1000000).toFixed(1)} Jt
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: BUSINESS UNITS & SERVICES PHOTOS                                    */}
      {/* ========================================================================= */}
      {activeTab === 'business_units' && (
        <div className="bg-white p-6 rounded-3xl border border-[#E2EBD8] shadow-xs space-y-6 animate-in fade-in duration-200">
          <div>
            <h3 className="text-lg font-black text-[#17331D]">
              Kustomisasi 3 Kartu Unit Bisnis & Foto Layanan
            </h3>
            <p className="text-xs text-[#6B7D70] mt-1">
              Sesuaikan foto, judul, dan deskripsi pada unit bisnis: Toko Buah Ritel, Resto & Horeka B2B, dan Satuan Pelayanan Gizi (SPPG/BGN).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {businessUnits.map((unit) => (
              <div key={unit.id} className="rounded-2xl border border-[#E2EBD8] overflow-hidden bg-[#F7FAF5] p-4 space-y-3">
                <div className="h-36 rounded-xl overflow-hidden relative">
                  <img src={unit.imageUrl} alt={unit.title} className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 bg-[#17331D]/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {unit.badgeLeft}
                  </span>
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-[#17331D]">{unit.title}</h4>
                  <p className="text-[11px] text-[#6B7D70] line-clamp-2 mt-1">{unit.description}</p>
                </div>
                {onEditBusinessUnit && (
                  <button
                    onClick={() => onEditBusinessUnit(unit)}
                    className="w-full py-2 bg-white hover:bg-emerald-50 text-[#087F23] border border-[#CDE0C4] rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Ubah Foto & Info Kartu</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: ACTIVE STORE PROFILE PREVIEW                                        */}
      {/* ========================================================================= */}
      {activeTab === 'store_preview' && (
        <div className="bg-white p-6 rounded-3xl border border-[#E2EBD8] shadow-xs space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-[#17331D]">
                Informasi & Identitas Toko Aktif
              </h3>
              <p className="text-xs text-[#6B7D70] mt-1">
                Data toko yang tampil kepada seluruh pengunjung website.
              </p>
            </div>
            <button
              onClick={onOpenStoreSettings}
              className="px-4 py-2 bg-[#087F23] text-white rounded-xl text-xs font-bold hover:bg-[#06631B]"
            >
              Edit Info Toko
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-[#F7FAF5] border border-[#E2EBD8]">
              <span className="text-[10px] text-gray-500 uppercase font-bold">Nama Toko</span>
              <p className="text-sm font-black text-[#17331D] mt-1">{storeSettings.storeName}</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#F7FAF5] border border-[#E2EBD8]">
              <span className="text-[10px] text-gray-500 uppercase font-bold">Nomor WhatsApp CS</span>
              <p className="text-sm font-black text-[#087F23] mt-1">+{storeSettings.whatsappNumber}</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#F7FAF5] border border-[#E2EBD8]">
              <span className="text-[10px] text-gray-500 uppercase font-bold">Kota & Wilayah</span>
              <p className="text-sm font-black text-[#17331D] mt-1">{storeSettings.city}</p>
            </div>
          </div>
        </div>
      )}

      {/* Retail Product Edit Modal */}
      <ProductEditModal
        isOpen={isRetailEditModalOpen}
        onClose={() => {
          setIsRetailEditModalOpen(false);
          setEditingRetailProduct(null);
        }}
        product={editingRetailProduct}
        onSave={(data) => {
          if (editingRetailProduct) {
            onUpdateProduct(data);
          } else {
            onAddProduct(data);
          }
          setIsRetailEditModalOpen(false);
        }}
      />

      {/* Wholesale Pricelist Item Edit Modal (57 Items) */}
      <WholesaleItemEditModal
        isOpen={isWholesaleEditModalOpen}
        onClose={() => {
          setIsWholesaleEditModalOpen(false);
          setEditingWholesaleItem(null);
        }}
        item={editingWholesaleItem}
        onSave={(itemData) => {
          if (editingWholesaleItem && onUpdateWholesaleItem) {
            onUpdateWholesaleItem(itemData);
          } else if (onAddWholesaleItem) {
            onAddWholesaleItem(itemData);
          }
          setIsWholesaleEditModalOpen(false);
        }}
      />

      {/* Fruit Photo Upload & Management Modal */}
      <FruitPhotoUploadModal
        isOpen={isPhotoModalOpen}
        onClose={() => {
          setIsPhotoModalOpen(false);
          setPhotoTarget(null);
        }}
        fruit={photoTarget}
        onSave={handleSavePhotoModal}
      />

      {/* Photo Upload Toast Notification */}
      {photoUploadToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#17331D] text-white px-5 py-3 rounded-2xl shadow-2xl border border-emerald-500/40 flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-200">
          <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
            <Check className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-black block">Foto Berhasil Disimpan</span>
            <span className="text-[11px] text-emerald-200">{photoUploadToast}</span>
          </div>
        </div>
      )}
    </div>
  );
};
