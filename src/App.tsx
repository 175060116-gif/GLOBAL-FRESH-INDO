import React, { useState, useEffect } from 'react';
import { 
  PRODUCTS_DATA, Product, CartItem, 
  getStoredProducts, saveStoredProducts, resetStoredProducts 
} from './data/products';
import { 
  StoreSettings, DEFAULT_STORE_SETTINGS, 
  getStoredSettings, saveStoredSettings 
} from './data/storeSettings';
import { 
  BusinessUnitCard, getStoredBusinessUnits, 
  saveStoredBusinessUnits, resetStoredBusinessUnits 
} from './data/businessUnits';
import { Navbar, ActiveTab } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { HomeSections } from './components/HomeSections';
import { PricelistView } from './components/PricelistView';
import { FastOrderView } from './components/FastOrderView';
import { WholesaleB2BView } from './components/WholesaleB2BView';
import { HampersView } from './components/HampersView';
import { OrderTrackingView } from './components/OrderTrackingView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { Footer } from './components/Footer';
import { StoreSettingsModal } from './components/StoreSettingsModal';
import { AdminAuthModal } from './components/AdminAuthModal';
import { BgnConsultationModal } from './components/BgnConsultationModal';
import { EditBusinessUnitModal } from './components/EditBusinessUnitModal';
import { EditFarmerImageModal } from './components/EditFarmerImageModal';
import { FruitPhotoLightboxModal } from './components/FruitPhotoLightboxModal';
import { 
  WholesalePricelistItem, 
  getStoredWholesalePricelist, 
  saveStoredWholesalePricelist, 
  resetStoredWholesalePricelist 
} from './data/wholesalePricelist';
import { 
  testFirestoreConnection,
  subscribeToProducts,
  saveProductToFirestore,
  deleteProductFromFirestore,
  subscribeToWholesale,
  saveWholesaleItemToFirestore,
  deleteWholesaleItemFromFirestore,
  subscribeToStoreSettings,
  saveStoreSettingsToFirestore
} from './services/firebaseService';
import { 
  Home, FileText, MessageCircle, ShoppingBag, 
  Truck, LayoutDashboard, Phone, Heart 
} from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [products, setProducts] = useState<Product[]>(getStoredProducts);
  const [wholesaleItems, setWholesaleItems] = useState<WholesalePricelistItem[]>(getStoredWholesalePricelist);
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(getStoredSettings);
  const [isStoreSettingsOpen, setIsStoreSettingsOpen] = useState(false);
  const [isBgnModalOpen, setIsBgnModalOpen] = useState(false);

  // Business Units (Ritel, Resto B2B, BGN) Customization State
  const [businessUnits, setBusinessUnits] = useState<BusinessUnitCard[]>(getStoredBusinessUnits);
  const [editingBusinessUnit, setEditingBusinessUnit] = useState<BusinessUnitCard | null>(null);
  const [isEditBusinessUnitOpen, setIsEditBusinessUnitOpen] = useState(false);

  // Farmer & Farm Profile Photo Customization State
  const [isEditFarmerImageOpen, setIsEditFarmerImageOpen] = useState(false);

  // Authentication State: Customer by default, Admin when PIN entered
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('gfi_admin_auth') === 'true';
  });
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState(false);

  const [cart, setCart] = useState<CartItem[]>(() => {
    const initialProducts = getStoredProducts();
    return [
      {
        product: initialProducts[1] || initialProducts[0],
        quantity: 1,
        weightTier: '1kg',
        pricePerUnit: initialProducts[1]?.retailPrice || 34000,
      },
      {
        product: initialProducts[2] || initialProducts[0],
        quantity: 1,
        weightTier: '1kg',
        pricePerUnit: initialProducts[2]?.retailPrice || 32500,
      },
    ];
  });

  const [wishlist, setWishlist] = useState<string[]>(['alpukat-mentega', 'anggur-shine-muscat']);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [lightboxProduct, setLightboxProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Scroll to top whenever tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  // Firestore Real-Time Subscriptions & Connection Check
  useEffect(() => {
    testFirestoreConnection();

    const unsubProducts = subscribeToProducts((cloudProducts) => {
      if (cloudProducts && cloudProducts.length > 0) {
        setProducts(cloudProducts);
      }
    });

    const unsubWholesale = subscribeToWholesale((cloudItems) => {
      if (cloudItems && cloudItems.length > 0) {
        setWholesaleItems(cloudItems);
      }
    });

    const unsubSettings = subscribeToStoreSettings((cloudSettings) => {
      if (cloudSettings) {
        setStoreSettings(cloudSettings);
      }
    });

    return () => {
      unsubProducts();
      unsubWholesale();
      unsubSettings();
    };
  }, []);

  // Dynamic Google Search Console verification meta tag sync
  useEffect(() => {
    if (storeSettings.googleVerificationTag) {
      let meta = document.querySelector('meta[name="google-site-verification"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'google-site-verification');
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', storeSettings.googleVerificationTag);
    }
  }, [storeSettings.googleVerificationTag]);

  // Secret Keyboard Shortcut: Ctrl + Shift + A (or Cmd + Shift + A on Mac)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        setIsAdminAuthModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Secret URL Hash: #admin or #login in browser address bar
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#admin' || window.location.hash === '#login') {
        setIsAdminAuthModalOpen(true);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Admin Auth Handlers
  const handleAdminLoginSuccess = () => {
    setIsAdmin(true);
    localStorage.setItem('gfi_admin_auth', 'true');
    setActiveTab('admin');
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('gfi_admin_auth');
    setActiveTab('home');
  };

  // Product CRUD Handlers
  const handleUpdateProduct = (updated: Product) => {
    setProducts((prev) => {
      const next = prev.map((p) => p.id === updated.id ? updated : p);
      saveStoredProducts(next);
      return next;
    });
    saveProductToFirestore(updated).catch((err) => console.warn('Sync product to cloud failed:', err));
    // Update product in cart if present
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === updated.id
          ? { ...item, product: updated, pricePerUnit: updated.retailPrice }
          : item
      )
    );
  };

  const handleAddProduct = (newProd: Product) => {
    setProducts((prev) => {
      const next = [newProd, ...prev];
      saveStoredProducts(next);
      return next;
    });
    saveProductToFirestore(newProd).catch((err) => console.warn('Sync new product to cloud failed:', err));
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => {
      const next = prev.filter((p) => p.id !== productId);
      saveStoredProducts(next);
      return next;
    });
    deleteProductFromFirestore(productId).catch((err) => console.warn('Delete product from cloud failed:', err));
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleResetProducts = () => {
    const reset = resetStoredProducts();
    setProducts(reset);
  };

  // Wholesale Pricelist & Dus/Karton Stock Handlers
  const handleUpdateWholesaleItem = (updated: WholesalePricelistItem) => {
    setWholesaleItems((prev) => {
      const next = prev.map((item) => (item.code === updated.code ? updated : item));
      saveStoredWholesalePricelist(next);
      return next;
    });
    saveWholesaleItemToFirestore(updated).catch((err) => console.warn('Sync wholesale item to cloud failed:', err));
  };

  const handleAddWholesaleItem = (newItem: WholesalePricelistItem) => {
    setWholesaleItems((prev) => {
      const next = [newItem, ...prev];
      saveStoredWholesalePricelist(next);
      return next;
    });
    saveWholesaleItemToFirestore(newItem).catch((err) => console.warn('Sync new wholesale item to cloud failed:', err));
  };

  const handleDeleteWholesaleItem = (code: string) => {
    setWholesaleItems((prev) => {
      const next = prev.filter((item) => item.code !== code);
      saveStoredWholesalePricelist(next);
      return next;
    });
    deleteWholesaleItemFromFirestore(code).catch((err) => console.warn('Delete wholesale item from cloud failed:', err));
  };

  const handleResetWholesaleItems = () => {
    const def = resetStoredWholesalePricelist();
    setWholesaleItems(def);
  };

  const handleBulkRestockWholesale = (code: string, additionalDus: number) => {
    setWholesaleItems((prev) => {
      const next = prev.map((item) => {
        if (item.code === code) {
          const nextStock = (item.stockDus || 0) + additionalDus;
          const updatedItem = { ...item, stockDus: nextStock, inStock: nextStock > 0 };
          saveWholesaleItemToFirestore(updatedItem).catch((err) => console.warn('Sync restock to cloud failed:', err));
          return updatedItem;
        }
        return item;
      });
      saveStoredWholesalePricelist(next);
      return next;
    });
  };

  const handleUpdateStoreSettings = (newSettings: StoreSettings) => {
    setStoreSettings(newSettings);
    saveStoredSettings(newSettings);
    saveStoreSettingsToFirestore(newSettings).catch((err) => console.warn('Sync store settings to cloud failed:', err));
  };

  const handleEditBusinessUnit = (card: BusinessUnitCard) => {
    setEditingBusinessUnit(card);
    setIsEditBusinessUnitOpen(true);
  };

  const handleSaveBusinessUnit = (updated: BusinessUnitCard) => {
    setBusinessUnits((prev) => {
      const next = prev.map((u) => (u.id === updated.id ? updated : u));
      saveStoredBusinessUnits(next);
      return next;
    });
  };

  const handleResetBusinessUnits = () => {
    const def = resetStoredBusinessUnits();
    setBusinessUnits(def);
  };

  const handleSaveFarmerImage = (newImageUrl: string) => {
    const updated = { ...storeSettings, farmerImageUrl: newImageUrl };
    handleUpdateStoreSettings(updated);
  };

  const handleAddToCart = (product: Product, qty: number = 1, weightTier: string = '1kg') => {
    const tier = (weightTier as '500g' | '1kg' | '2kg' | 'grosir') || '1kg';
    const multiplier = 
      tier === '500g' ? 0.55 :
      tier === '1kg' ? 1.0 :
      tier === '2kg' ? 1.95 :
      product.wholesaleMinQty;

    const pricePerUnit = tier === 'grosir' 
      ? product.wholesalePrice * multiplier 
      : Math.round(product.retailPrice * multiplier);

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.weightTier === tier
      );

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += qty;
        return next;
      } else {
        return [...prev, { product, quantity: qty, weightTier: tier, pricePerUnit }];
      }
    });

    setIsCartOpen(true);
  };

  const handleUpdateQty = (productId: string, weightTier: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === productId && item.weightTier === weightTier) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveItem = (productId: string, weightTier: string) => {
    setCart((prev) => prev.filter(
      (item) => !(item.product.id === productId && item.weightTier === weightTier)
    ));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleToggleWishlist = (product: Product) => {
    setWishlist((prev) =>
      prev.includes(product.id)
        ? prev.filter((id) => id !== product.id)
        : [...prev, product.id]
    );
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#F7FAF5] text-[#17331D]">
      {/* Top Header & Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        wishlistCount={wishlist.length}
        searchQuery={searchQuery}
        storeSettings={storeSettings}
        onOpenStoreSettings={() => setIsStoreSettingsOpen(true)}
        isAdmin={isAdmin}
        onLogoutAdmin={handleAdminLogout}
        onOpenAdminLogin={() => setIsAdminAuthModalOpen(true)}
        onOpenBgnModal={() => setIsBgnModalOpen(true)}
        setSearchQuery={(q) => {
          setSearchQuery(q);
          if (q.trim() && activeTab !== 'pricelist') {
            setActiveTab('pricelist');
          }
        }}
      />

      {/* Main View Router */}
      <main className="flex-1 pb-20 md:pb-8">
        {activeTab === 'home' && (
          <div>
            <HeroSection onNavigate={(tab) => setActiveTab(tab)} />
            <HomeSections
              products={products}
              onAddToCart={(p) => handleAddToCart(p, 1, '1kg')}
              onNavigate={(tab) => setActiveTab(tab)}
              onSelectProduct={(p) => setSelectedProduct(p)}
              onPreviewFruitPhoto={(p) => setLightboxProduct(p)}
              onOpenBgnModal={() => setIsBgnModalOpen(true)}
              businessUnits={businessUnits}
              isAdmin={isAdmin}
              onEditBusinessUnit={handleEditBusinessUnit}
              storeSettings={storeSettings}
              onOpenEditFarmerImage={() => setIsEditFarmerImageOpen(true)}
            />
          </div>
        )}

        {activeTab === 'pricelist' && (
          <PricelistView
            products={products}
            wholesaleItems={wholesaleItems}
            onAddToCart={(p, qty) => handleAddToCart(p, qty || 1, '1kg')}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onPreviewFruitPhoto={(p) => setLightboxProduct(p)}
            onOpenBgnModal={() => setIsBgnModalOpen(true)}
            onUpdateWholesaleItem={handleUpdateWholesaleItem}
            isAdmin={isAdmin}
          />
        )}

        {activeTab === 'fastorder' && (
          <FastOrderView products={products} wholesaleItems={wholesaleItems} storeSettings={storeSettings} />
        )}

        {activeTab === 'b2b' && (
          <WholesaleB2BView
            products={products}
            onAddToCart={(p, qty) => handleAddToCart(p, qty, 'grosir')}
            onOpenBgnModal={() => setIsBgnModalOpen(true)}
          />
        )}

        {activeTab === 'hampers' && (
          <HampersView
            products={products}
            onAddToCart={(p) => handleAddToCart(p, 1, '1kg')}
            onSelectProduct={(p) => setSelectedProduct(p)}
          />
        )}

        {activeTab === 'tracking' && (
          <OrderTrackingView />
        )}

        {activeTab === 'admin' && (
          <AdminDashboardView 
            products={products}
            onUpdateProduct={handleUpdateProduct}
            onAddProduct={handleAddProduct}
            onDeleteProduct={handleDeleteProduct}
            onResetProducts={handleResetProducts}
            wholesaleItems={wholesaleItems}
            onUpdateWholesaleItem={handleUpdateWholesaleItem}
            onAddWholesaleItem={handleAddWholesaleItem}
            onDeleteWholesaleItem={handleDeleteWholesaleItem}
            onResetWholesaleItems={handleResetWholesaleItems}
            onBulkRestockWholesale={handleBulkRestockWholesale}
            storeSettings={storeSettings}
            onOpenStoreSettings={() => setIsStoreSettingsOpen(true)}
            isAdmin={isAdmin}
            onOpenAdminLogin={() => setIsAdminAuthModalOpen(true)}
            onLogoutAdmin={handleAdminLogout}
            onBackToShopping={() => setActiveTab('home')}
            businessUnits={businessUnits}
            onEditBusinessUnit={handleEditBusinessUnit}
            onResetBusinessUnits={handleResetBusinessUnits}
            onOpenEditFarmerImage={() => setIsEditFarmerImageOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <Footer 
        onNavigate={(tab) => setActiveTab(tab)} 
        storeSettings={storeSettings} 
        isAdmin={isAdmin}
        onOpenAdminLogin={() => setIsAdminAuthModalOpen(true)}
        onLogoutAdmin={handleAdminLogout}
      />

      {/* Modals & Drawers */}
      <FruitPhotoLightboxModal
        isOpen={!!lightboxProduct}
        onClose={() => setLightboxProduct(null)}
        product={lightboxProduct}
        productsList={products}
        onSelectProduct={(p) => setLightboxProduct(p)}
        onAddToCart={(p, qty, tier) => handleAddToCart(p, qty, tier)}
        storeSettings={storeSettings}
        isWishlisted={lightboxProduct ? wishlist.includes(lightboxProduct.id) : false}
        onToggleWishlist={(id) => {
          const prod = products.find(p => p.id === id);
          if (prod) handleToggleWishlist(prod);
        }}
      />

      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(p, qty, tier) => handleAddToCart(p, qty, tier)}
        isWishlisted={selectedProduct ? wishlist.includes(selectedProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      {/* Store Settings Modal (Accessible by Admin) */}
      <StoreSettingsModal
        isOpen={isStoreSettingsOpen}
        onClose={() => setIsStoreSettingsOpen(false)}
        settings={storeSettings}
        onSave={handleUpdateStoreSettings}
      />

      {/* Admin Security PIN Modal */}
      <AdminAuthModal
        isOpen={isAdminAuthModalOpen}
        onClose={() => setIsAdminAuthModalOpen(false)}
        onSuccess={handleAdminLoginSuccess}
      />

      {/* BGN & Satuan Pelayanan Gizi Consultation Modal */}
      <BgnConsultationModal
        isOpen={isBgnModalOpen}
        onClose={() => setIsBgnModalOpen(false)}
        storeSettings={storeSettings}
      />

      {/* Edit Business Unit (Custom Photo & Name) Modal */}
      <EditBusinessUnitModal
        isOpen={isEditBusinessUnitOpen}
        onClose={() => {
          setIsEditBusinessUnitOpen(false);
          setEditingBusinessUnit(null);
        }}
        card={editingBusinessUnit}
        onSave={handleSaveBusinessUnit}
      />

      {/* Edit Farmer Image Modal */}
      <EditFarmerImageModal
        isOpen={isEditFarmerImageOpen}
        onClose={() => setIsEditFarmerImageOpen(false)}
        currentImageUrl={storeSettings.farmerImageUrl || '/petani_rambutan.jpg'}
        onSave={handleSaveFarmerImage}
      />

      {/* Floating WhatsApp Action Button */}
      <aside aria-label="Bantuan WhatsApp" className="fixed bottom-20 md:bottom-6 right-5 z-40 flex flex-col items-end gap-2">
        <a
          href={`https://wa.me/${storeSettings.whatsappNumber}?text=Halo%20${encodeURIComponent(storeSettings.storeName)},%20saya%20ingin%20konsultasi%20pemesanan%20buah`}
          target="_blank"
          rel="noreferrer"
          className="bg-[#25D366] hover:bg-[#1EBE5D] text-white p-3.5 rounded-full shadow-2xl flex items-center gap-2 group transition-all transform hover:scale-105"
          title={`Chat WhatsApp ${storeSettings.storeName}`}
        >
          <MessageCircle className="w-6 h-6 fill-current" />
          <span className="hidden group-hover:inline text-xs font-bold pr-1">
            Chat CS +{storeSettings.whatsappNumber}
          </span>
          <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping"></span>
        </a>
      </aside>

      {/* Mobile Bottom Navigation matching Image 2 */}
      <nav aria-label="Navigasi Utama Mobile" className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E2EBD8] py-2 px-3 shadow-lg">
        <div className="flex items-center justify-around">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
              activeTab === 'home' ? 'text-[#087F23]' : 'text-[#6B7D70]'
            }`}
          >
            <Home className="w-5 h-5" />
            <span>Beranda</span>
          </button>

          <button
            onClick={() => setActiveTab('pricelist')}
            className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
              activeTab === 'pricelist' ? 'text-[#087F23]' : 'text-[#6B7D70]'
            }`}
          >
            <FileText className="w-5 h-5" />
            <span>Pricelist</span>
          </button>

          <button
            onClick={() => setActiveTab('fastorder')}
            className="flex flex-col items-center gap-1 text-[10px] font-bold text-[#FF7F00]"
          >
            <div className="w-9 h-9 rounded-full bg-[#FF7F00] text-white flex items-center justify-center -mt-4 shadow-md">
              <MessageCircle className="w-5 h-5" />
            </div>
            <span>Order WA</span>
          </button>

          <button
            onClick={() => setIsCartOpen(true)}
            className="flex flex-col items-center gap-1 text-[10px] font-bold text-[#6B7D70] relative"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>Keranjang</span>
            {totalCartCount > 0 && (
              <span className="absolute -top-1 right-2 bg-[#E53935] text-white text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center">
                {totalCartCount}
              </span>
            )}
          </button>

          {/* Conditional 5th button: "Kelola" if admin, "Lacak" if customer */}
          {isAdmin ? (
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
                activeTab === 'admin' ? 'text-[#087F23]' : 'text-[#6B7D70]'
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Kelola</span>
            </button>
          ) : (
            <button
              onClick={() => setActiveTab('tracking')}
              className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
                activeTab === 'tracking' ? 'text-[#087F23]' : 'text-[#6B7D70]'
              }`}
            >
              <Truck className="w-5 h-5" />
              <span>Lacak</span>
            </button>
          )}
        </div>
      </nav>
    </div>
  );
}

export default App;
