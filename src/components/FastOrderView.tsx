import React, { useState, useMemo } from 'react';
import { 
  MessageCircle, Send, Copy, Check, Plus, Minus, 
  MapPin, User, Phone, Truck, CreditCard, ShieldCheck, 
  Clock, HelpCircle, ChevronDown, ChevronUp, Sparkles,
  Store, Building2, Gift, Search, Package
} from 'lucide-react';
import { Product } from '../data/products';
import { WholesalePricelistItem, WHOLESALE_PRICELIST } from '../data/wholesalePricelist';
import { StoreSettings } from '../data/storeSettings';

interface FastOrderViewProps {
  products: Product[];
  wholesaleItems?: WholesalePricelistItem[];
  storeSettings?: StoreSettings;
}

export const FastOrderView: React.FC<FastOrderViewProps> = ({ 
  products, 
  wholesaleItems = WHOLESALE_PRICELIST,
  storeSettings 
}) => {
  const [activeChannel, setActiveChannel] = useState<'retail' | 'b2b' | 'hampers'>('retail');
  const [b2bCategory, setB2bCategory] = useState<string>('All');
  const [b2bSearch, setB2bSearch] = useState<string>('');
  
  // Step 1: Quantities
  const [quantities, setQuantities] = useState<{ [id: string]: number }>({
    'alpukat-mentega': 2,
    'apel-fuji-wangshan': 1,
    'jeruk-santang-daun': 2,
  });

  // Step 2: Customer details
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [deliveryOption, setDeliveryOption] = useState('Kurir Instan Toko (Khusus Cianjur 1-2 Jam)');
  const [paymentMethod, setPaymentMethod] = useState('Transfer Bank (BCA / Mandiri / BRI)');
  const [specialNotes, setSpecialNotes] = useState('Pilih buah yang manis dan matang pas siap makan hari ini.');

  // FAQ Accordion states
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [copied, setCopied] = useState(false);

  // Update fruit quantity
  const handleQtyChange = (id: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [id]: next };
    });
  };

  // Calculations
  const selectedItems = useMemo(() => {
    return Object.entries(quantities)
      .filter(([_, qty]) => qty > 0)
      .map(([id, qty]) => {
        const product = products.find((p) => p.id === id);
        if (product) {
          return { 
            id, 
            name: product.name, 
            unit: product.unit, 
            price: product.retailPrice, 
            qty, 
            total: product.retailPrice * qty 
          };
        }
        const wholesale = wholesaleItems.find((w) => w.code === id);
        if (wholesale) {
          return { 
            id, 
            name: `${wholesale.name} (Kode: ${wholesale.code})`, 
            unit: wholesale.unit, 
            price: wholesale.price, 
            qty, 
            total: wholesale.price * qty 
          };
        }
        return null;
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);
  }, [quantities, products, wholesaleItems]);

  const filteredB2BItems = useMemo(() => {
    return wholesaleItems.filter((item) => {
      if (b2bCategory !== 'All' && item.category !== b2bCategory) return false;
      if (b2bSearch.trim() !== '') {
        const q = b2bSearch.toLowerCase();
        return (
          item.code.toLowerCase().includes(q) ||
          item.name.toLowerCase().includes(q) ||
          item.packaging.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [wholesaleItems, b2bCategory, b2bSearch]);

  const subtotal = useMemo(() => {
    return selectedItems.reduce((acc, item) => acc + item.total, 0);
  }, [selectedItems]);

  const deliveryCost = subtotal > 150000 ? 0 : 15000;
  const grandTotal = subtotal + deliveryCost;

  // Formatted WhatsApp Message Preview
  const formattedMessage = useMemo(() => {
    const channelName = 
      activeChannel === 'retail' ? 'ORDER ECERAN / RETAIL' :
      activeChannel === 'b2b' ? 'ORDER GROSIR B2B RESTO' : 'ORDER HAMPERS / PARCEL';

    let msg = `*PESANAN BUAH SEGAR - GLOBAL FRESH INDO*\n`;
    msg += `Kategori: *${channelName}*\n`;
    msg += `Tanggal: ${new Date().toLocaleDateString('id-ID')}\n\n`;

    msg += `*1. DATA PEMESAN:*\n`;
    msg += `• Nama: ${customerName || '-'}\n`;
    msg += `• No. WA: ${customerPhone || '-'}\n`;
    msg += `• Alamat: ${customerAddress || '-'}\n`;
    msg += `• Pengiriman: ${deliveryOption}\n`;
    msg += `• Pembayaran: ${paymentMethod}\n\n`;

    msg += `*2. DAFTAR BUAH YANG DIPESAN:*\n`;
    if (selectedItems.length === 0) {
      msg += `_(Belum ada buah yang dipilih)_\n`;
    } else {
      selectedItems.forEach((item, index) => {
        msg += `${index + 1}. ${item.name} - ${item.qty} ${item.unit} (Rp ${item.total.toLocaleString('id-ID')})\n`;
      });
    }

    msg += `\n*3. RINCIAN ESTIMASI:*\n`;
    msg += `• Subtotal Buah: Rp ${subtotal.toLocaleString('id-ID')}\n`;
    msg += `• Ongkir: ${deliveryCost === 0 ? 'GRATIS (Promo Cianjur)' : `Rp ${deliveryCost.toLocaleString('id-ID')}`}\n`;
    msg += `• *TOTAL BAYAR: Rp ${grandTotal.toLocaleString('id-ID')}*\n\n`;

    if (specialNotes) {
      msg += `*Catatan Khusus:*\n"${specialNotes}"\n\n`;
    }

    msg += `Mohon dicek stok dan diinfokan total transfernya. Terima kasih!`;
    return msg;
  }, [
    activeChannel, customerName, customerPhone, customerAddress, 
    deliveryOption, paymentMethod, specialNotes, selectedItems, 
    subtotal, deliveryCost, grandTotal
  ]);

  const handleCopyText = () => {
    navigator.clipboard.writeText(formattedMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSendToWhatsApp = () => {
    const waNumber = storeSettings?.whatsappNumber || '6285284633214';
    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(formattedMessage)}`;
    window.open(waUrl, '_blank');
  };

  const faqs = [
    {
      q: 'Berapa batas minimal order untuk pengiriman ke rumah?',
      a: 'Tidak ada minimal order! Anda bisa memesan mulai dari 1 kg buah atau 1 pack. Untuk gratis ongkir wilayah Cianjur Kota, minimal belanja adalah Rp 150.000.',
    },
    {
      q: 'Kapan pesanan buah saya akan dikirimkan?',
      a: 'Pesanan yang masuk sebelum pukul 16:00 WIB akan dikirim pada hari yang sama menggunakan armada kurir toko berpendingin. Kami juga melayani slot jam kirim subuh untuk restoran.',
    },
    {
      q: 'Bagaimana jika buah yang diterima rusak, masam atau tidak manis?',
      a: 'GLOBAL FRESH INDO memberikan Garansi Penggantian 24 Jam. Cukup foto buah yang bermasalah dan kirimkan ke WhatsApp kami, tim kami akan segera mengantar buah pengganti tanpa biaya tambahan.',
    },
    {
      q: 'Apakah bisa memesan untuk pengiriman luar kota seperti Sukabumi & Bandung?',
      a: 'Tentu bisa! Kami memiliki armada box berpendingin harian untuk rute Cianjur, Sukabumi, Bogor, Bandung Raya, dan Jabodetabek dengan packing aman menggunakan ice gel khusus.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      {/* Header & Subtitle matching Image 7 */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2EBD8] shadow-xs text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-[#E8F5E4] text-[#087F23] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 text-[#55AA00]" />
          <span>ORDER CEPAT & FLEKSIBEL - TANPA RIBET DAFTAR AKUN</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#17331D] tracking-tight">
          Pusat Pemesanan Cepat via WhatsApp
        </h1>
        <p className="text-xs sm:text-sm text-[#6B7D70] mt-2 max-w-2xl mx-auto">
          Pilih buah segar pilihan, lengkapi data alamat penerima, dan pesan langsung otomatis terformat rapi 
          siap dikirim ke Customer Service kami di WhatsApp: <strong className="text-[#087F23]">0852-8463-3214</strong>.
        </p>

        {/* Channel Selector Pills matching Image 7 */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
          <button
            onClick={() => setActiveChannel('retail')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-xs ${
              activeChannel === 'retail'
                ? 'bg-[#087F23] text-white ring-2 ring-[#087F23]/20'
                : 'bg-[#F7FAF5] text-[#17331D] hover:bg-[#E8F5E4]'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>CS Eceran / Retail</span>
          </button>

          <button
            onClick={() => setActiveChannel('b2b')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-xs ${
              activeChannel === 'b2b'
                ? 'bg-[#087F23] text-white ring-2 ring-[#087F23]/20'
                : 'bg-[#F7FAF5] text-[#17331D] hover:bg-[#E8F5E4]'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Grosir & Mitra Resto</span>
          </button>

          <button
            onClick={() => setActiveChannel('hampers')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-xs ${
              activeChannel === 'hampers'
                ? 'bg-[#087F23] text-white ring-2 ring-[#087F23]/20'
                : 'bg-[#F7FAF5] text-[#17331D] hover:bg-[#E8F5E4]'
            }`}
          >
            <Gift className="w-4 h-4" />
            <span>Hampers & Parcel</span>
          </button>
        </div>
      </div>

      {/* Main Two Columns matching Image 7 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Multi-step selection (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          {/* LANGKAH 1: Pilih Aneka Buah Segar */}
          <div className="bg-white rounded-3xl p-6 border border-[#E2EBD8] shadow-xs space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-[#E2EBD8]">
              <div className="w-8 h-8 rounded-full bg-[#087F23] text-white font-black text-sm flex items-center justify-center">
                1
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-extrabold text-base text-[#17331D]">
                  LANGKAH 1: {activeChannel === 'b2b' ? 'Pilih Komoditas Grosir / Dus (57 Item Resmi)' : 'Pilih Aneka Buah Segar'}
                </h2>
                <p className="text-xs text-[#6B7D70]">
                  {activeChannel === 'b2b' 
                    ? 'Pilih karton/dus komoditas buah impor & lokal dengan kode SKU resmi.' 
                    : 'Tentukan jumlah kilogram / pack yang ingin dipesan hari ini.'}
                </p>
              </div>
            </div>

            {/* If B2B channel, show Wholesale Category Filter & Search Bar */}
            {activeChannel === 'b2b' && (
              <div className="space-y-3 pb-2 border-b border-[#E2EBD8]">
                {/* Category selector */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                  {[
                    { id: 'All', label: 'Semua (57)', emoji: '✨' },
                    { id: 'Anggur', label: 'Anggur (15)', emoji: '🍇' },
                    { id: 'Apel', label: 'Apel (17)', emoji: '🍎' },
                    { id: 'Jeruk', label: 'Jeruk (4)', emoji: '🍊' },
                    { id: 'Kiwi', label: 'Kiwi (1)', emoji: '🥝' },
                    { id: 'Lemon', label: 'Lemon (2)', emoji: '🍋' },
                    { id: 'Delima', label: 'Delima (1)', emoji: '❤️' },
                    { id: 'Pear', label: 'Pear (4)', emoji: '🍐' },
                    { id: 'Lengkeng', label: 'Lengkeng (11)', emoji: '🟤' },
                    { id: 'Plum', label: 'Plum (2)', emoji: '🟣' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setB2bCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                        b2bCategory === cat.id
                          ? 'bg-[#087F23] text-white shadow-xs'
                          : 'bg-[#F7FAF5] text-[#17331D] hover:bg-[#E8F5E4] border border-[#E2EBD8]'
                      }`}
                    >
                      <span>{cat.emoji}</span>
                      <span>{cat.label}</span>
                    </button>
                  ))}
                </div>

                {/* Search */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Cari Kode Buah (cth: 2021, 11174) atau Nama..."
                    value={b2bSearch}
                    onChange={(e) => setB2bSearch(e.target.value)}
                    className="w-full bg-[#F7FAF5] border border-[#CDE0C4] rounded-xl py-2 pl-9 pr-3 text-xs text-[#17331D] font-medium focus:outline-none focus:ring-2 focus:ring-[#087F23] focus:bg-white"
                  />
                  <Search className="w-4 h-4 text-[#6B7D70] absolute left-3 top-1/2 -translate-y-1/2" />
                  {b2bSearch && (
                    <button 
                      onClick={() => setB2bSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Grid of fruit items with +/- stepper */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-[520px] overflow-y-auto pr-1">
              {activeChannel === 'b2b' ? (
                filteredB2BItems.map((item) => {
                  const qty = quantities[item.code] || 0;
                  return (
                    <div
                      key={item.code}
                      className={`fruit-card-interactive p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 group ${
                        qty > 0
                          ? 'bg-[#F0F9ED] border-[#087F23] shadow-xs'
                          : 'bg-[#F7FAF5] border-[#E2EBD8] hover:border-[#087F23]'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="fruit-photo-sheen-container w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-white bg-neutral-100 shadow-2xs relative">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-115 transition-transform duration-500 ease-out"
                          />
                          <span className="absolute bottom-0.5 left-0.5 text-[8px] bg-black/60 text-white px-1 rounded">
                            {item.categoryEmoji}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="bg-[#17331D] text-[#FFD54F] font-mono text-[9px] font-black px-1.5 py-0.2 rounded">
                              {item.code}
                            </span>
                            <span className="text-[10px] text-[#6B7D70] truncate">{item.category}</span>
                          </div>
                          <div className="text-xs font-bold text-[#17331D] truncate group-hover:text-[#087F23] transition-colors">
                            {item.name}
                          </div>
                          <div className="text-[11px] font-extrabold text-[#087F23]">
                            Rp {item.price.toLocaleString('id-ID')}
                            <span className="text-[9px] text-[#6B7D70] font-normal">/{item.unit}</span>
                          </div>
                        </div>
                      </div>

                      {/* Stepper */}
                      <div className="flex items-center bg-white rounded-xl border border-[#CDE0C4] p-0.5 shrink-0 shadow-xs">
                        <button
                          type="button"
                          onClick={() => handleQtyChange(item.code, -1)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-[#17331D] hover:bg-neutral-100 disabled:opacity-30"
                          disabled={qty === 0}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center text-xs font-black text-[#17331D]">
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleQtyChange(item.code, 1)}
                          className="w-7 h-7 rounded-lg bg-[#087F23] text-white flex items-center justify-center hover:bg-[#005500]"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                products.map((p) => {
                  const qty = quantities[p.id] || 0;
                  return (
                    <div
                      key={p.id}
                      className={`fruit-card-interactive p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 group ${
                        qty > 0
                          ? 'bg-[#F0F9ED] border-[#087F23] shadow-xs'
                          : 'bg-[#F7FAF5] border-[#E2EBD8] hover:border-[#087F23]'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="fruit-photo-sheen-container w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-white bg-neutral-100 shadow-2xs">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-full h-full object-cover group-hover:scale-115 transition-transform duration-500 ease-out"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-[#17331D] truncate group-hover:text-[#087F23] transition-colors">{p.name}</div>
                          <div className="text-[11px] font-extrabold text-[#087F23]">
                            Rp {p.retailPrice.toLocaleString('id-ID')}
                            <span className="text-[9px] text-[#6B7D70] font-normal">/{p.unit}</span>
                          </div>
                        </div>
                      </div>

                      {/* Stepper */}
                      <div className="flex items-center bg-white rounded-xl border border-[#CDE0C4] p-0.5 shrink-0 shadow-xs">
                        <button
                          type="button"
                          onClick={() => handleQtyChange(p.id, -1)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-[#17331D] hover:bg-neutral-100 disabled:opacity-30"
                          disabled={qty === 0}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center text-xs font-black text-[#17331D]">
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleQtyChange(p.id, 1)}
                          className="w-7 h-7 rounded-lg bg-[#087F23] text-white flex items-center justify-center hover:bg-[#005500]"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* LANGKAH 2: Data Pengiriman Pesanan */}
          <div className="bg-white rounded-3xl p-6 border border-[#E2EBD8] shadow-xs space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-[#E2EBD8]">
              <div className="w-8 h-8 rounded-full bg-[#087F23] text-white font-black text-sm flex items-center justify-center">
                2
              </div>
              <div>
                <h2 className="font-extrabold text-base text-[#17331D]">
                  LANGKAH 2: Data Pengiriman Pesanan
                </h2>
                <p className="text-xs text-[#6B7D70]">
                  Informasi untuk kurir pengantaran dan penerbitan nota pesanan.
                </p>
              </div>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-[#17331D] block mb-1">
                  Nama Pemesan *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Contoh: Ibu Rina / Dapur Kafe Melati"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-[#F7FAF5] border border-[#CDE0C4] rounded-xl py-2 pl-9 pr-3 text-xs text-[#17331D] focus:outline-none focus:ring-1 focus:ring-[#087F23]"
                  />
                  <User className="w-4 h-4 text-[#6B7D70] absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#17331D] block mb-1">
                  Nomor WhatsApp Aktif *
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    placeholder="Contoh: 08123456789"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-[#F7FAF5] border border-[#CDE0C4] rounded-xl py-2 pl-9 pr-3 text-xs text-[#17331D] focus:outline-none focus:ring-1 focus:ring-[#087F23]"
                  />
                  <Phone className="w-4 h-4 text-[#6B7D70] absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#17331D] block mb-1">
                  Alamat Lengkap Pengiriman *
                </label>
                <div className="relative">
                  <textarea
                    rows={2}
                    placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan, patokan lokasi..."
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    className="w-full bg-[#F7FAF5] border border-[#CDE0C4] rounded-xl p-2.5 pl-9 text-xs text-[#17331D] focus:outline-none focus:ring-1 focus:ring-[#087F23]"
                  />
                  <MapPin className="w-4 h-4 text-[#6B7D70] absolute left-3 top-4" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#17331D] block mb-1">
                    Pilihan Pengiriman
                  </label>
                  <select
                    value={deliveryOption}
                    onChange={(e) => setDeliveryOption(e.target.value)}
                    className="w-full bg-[#F7FAF5] border border-[#CDE0C4] rounded-xl p-2 text-xs text-[#17331D] focus:outline-none focus:ring-1 focus:ring-[#087F23]"
                  >
                    <option value="Kurir Instan Toko (Khusus Cianjur 1-2 Jam)">Kurir Instan Toko (Cianjur 1-2 Jam)</option>
                    <option value="Sameday Cianjur - Sukabumi">Sameday Cianjur - Sukabumi</option>
                    <option value="Mobil Berpendingin Logistik Horeka">Mobil Pendingin Khusus Horeka</option>
                    <option value="Ambil Sendiri di Gudang Cilaku">Ambil Sendiri di Gudang Cilaku</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#17331D] block mb-1">
                    Metode Pembayaran
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full bg-[#F7FAF5] border border-[#CDE0C4] rounded-xl p-2 text-xs text-[#17331D] focus:outline-none focus:ring-1 focus:ring-[#087F23]"
                  >
                    <option value="Transfer Bank (BCA / Mandiri / BRI)">Transfer Bank (BCA/Mandiri/BRI)</option>
                    <option value="QRIS Semua Pembayaran (Gopay/OVO/ShopeePay)">QRIS Semua E-Wallet & Bank</option>
                    <option value="Bayar di Tempat (COD Saat Kurir Tiba)">Bayar di Tempat (COD)</option>
                    <option value="Faktur Tempo 14 Hari (Khusus Akun B2B)">Faktur Tempo 14 Hari (Mitra B2B)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#17331D] block mb-1">
                  Catatan Khusus Buah
                </label>
                <input
                  type="text"
                  placeholder="Misal: Buah alpukat minta yang matang 2 hari lagi, pisang jangan terlalu matang"
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  className="w-full bg-[#F7FAF5] border border-[#CDE0C4] rounded-xl p-2 text-xs text-[#17331D] focus:outline-none focus:ring-1 focus:ring-[#087F23]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Ringkasan Order & Live WA Preview (5 cols) matching Image 7 */}
        <div className="lg:col-span-5 space-y-6 sticky top-24">
          {/* Ringkasan Order */}
          <div className="bg-white rounded-3xl p-6 border-2 border-[#087F23]/25 shadow-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2EBD8]">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-[#25D366]" />
                <h3 className="font-black text-sm sm:text-base text-[#17331D]">Ringkasan Order WA</h3>
              </div>
              <span className="text-[10px] bg-[#E8F5E4] text-[#087F23] font-bold px-2 py-0.5 rounded-full">
                {selectedItems.length} Item Buah
              </span>
            </div>

            {/* List of items */}
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {selectedItems.length === 0 ? (
                <div className="text-center py-6 text-xs text-[#6B7D70]">
                  Silakan pilih buah di Langkah 1 untuk membuat pesanan.
                </div>
              ) : (
                selectedItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-xs py-1 border-b border-neutral-100">
                    <div>
                      <span className="font-bold text-[#17331D]">{item.name}</span>
                      <span className="text-[10px] text-[#6B7D70] block">
                        {item.qty} {item.unit} × Rp {item.price.toLocaleString('id-ID')}
                      </span>
                    </div>
                    <span className="font-extrabold text-[#087F23]">
                      Rp {item.total.toLocaleString('id-ID')}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Price Calculations */}
            <div className="pt-2 border-t border-[#E2EBD8] space-y-1.5 text-xs text-[#6B7D70]">
              <div className="flex justify-between">
                <span>Subtotal Buah</span>
                <span className="font-semibold text-[#17331D]">Rp {subtotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimasi Ongkir</span>
                <span className={deliveryCost === 0 ? 'text-[#087F23] font-bold' : 'text-[#17331D]'}>
                  {deliveryCost === 0 ? 'GRATIS' : `Rp ${deliveryCost.toLocaleString('id-ID')}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-black text-[#17331D] pt-2 border-t border-dashed border-[#CDE0C4]">
                <span>Total Sementara</span>
                <span className="text-[#087F23]">Rp {grandTotal.toLocaleString('id-ID')}</span>
              </div>
            </div>

            {/* Live WhatsApp Formatted Text Preview Box matching Image 7 */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#17331D]">
                <span>Format Pesan Otomatis:</span>
                <button
                  onClick={handleCopyText}
                  className="flex items-center gap-1 text-[11px] text-[#087F23] hover:underline"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Tersalin' : 'Salin Teks'}</span>
                </button>
              </div>

              <div className="bg-[#17331D] text-green-100 p-3.5 rounded-2xl text-[11px] font-mono leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap select-all border border-green-900">
                {formattedMessage}
              </div>

              {/* Big CTA Send WhatsApp button */}
              <button
                onClick={handleSendToWhatsApp}
                disabled={selectedItems.length === 0}
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] disabled:bg-neutral-300 text-white font-extrabold text-sm py-3.5 px-4 rounded-2xl shadow-lg hover:shadow-xl transition-all active:scale-98"
              >
                <Send className="w-4 h-4" />
                <span>Kirim Pesanan ke WhatsApp Toko</span>
              </button>
            </div>

            {/* Trust badge */}
            <div className="flex items-center gap-2 bg-[#E8F5E4] p-2.5 rounded-xl text-xs text-[#087F23]">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Garansi Buah Segar 100% • Pasti Manis & Bebas Rusak</span>
            </div>
          </div>

          {/* Quick Help box */}
          <div className="bg-[#FFF8E1] p-4 rounded-2xl border border-[#FFE082] text-xs text-[#17331D] space-y-2">
            <h4 className="font-extrabold flex items-center gap-1.5 text-amber-900">
              <Clock className="w-4 h-4 text-amber-700" />
              <span>Butuh Bantuan Segera / Request Khusus?</span>
            </h4>
            <p className="text-[11px] text-amber-800">
              Staf ahli kami siap memfotokan stok buah terkini dari gudang kami di Cilaku Cianjur secara real-time.
            </p>
            <a
              href="https://wa.me/6285284633214?text=Halo%20Global%20Fresh%20Indo,%20saya%20ingin%20tanya%20stok%20buah%20hari%20ini"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-[#087F23] font-bold hover:underline text-xs"
            >
              <span>Chat Langsung: 0852-8463-3214 →</span>
            </a>
          </div>
        </div>
      </div>

      {/* Why Order via WA - 4 points matching Image 7 */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2EBD8]">
        <h3 className="text-center font-extrabold text-lg sm:text-xl text-[#17331D] mb-6">
          Kenapa Nyaman Pesan via WhatsApp Kami?
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-[#F7FAF5] border border-[#E2EBD8]">
            <span className="text-xl mb-2 block">⚡</span>
            <h4 className="font-bold text-xs text-[#17331D]">Respon Cepat &lt; 5 Menit</h4>
            <p className="text-[11px] text-[#6B7D70] mt-1">
              Admin sigap membalas setiap hari mulai pukul 07.00 hingga 21.00 WIB.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F7FAF5] border border-[#E2EBD8]">
            <span className="text-xl mb-2 block">🛡️</span>
            <h4 className="font-bold text-xs text-[#17331D]">Garansi Segar 24 Jam</h4>
            <p className="text-[11px] text-[#6B7D70] mt-1">
              Cukup kirimkan foto jika ada buah yang kurang manis atau busuk, kami ganti gratis.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F7FAF5] border border-[#E2EBD8]">
            <span className="text-xl mb-2 block">🥑</span>
            <h4 className="font-bold text-xs text-[#17331D]">Bebas Pilih Kematangan</h4>
            <p className="text-[11px] text-[#6B7D70] mt-1">
              Bisa request alpukat matang hari ini, besok, atau masih mengkal untuk stok dapur.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F7FAF5] border border-[#E2EBD8]">
            <span className="text-xl mb-2 block">💳</span>
            <h4 className="font-bold text-xs text-[#17331D]">Bisa Bayar COD & Transfer</h4>
            <p className="text-[11px] text-[#6B7D70] mt-1">
              Pilihan pembayaran fleksibel: Bank Transfer, QRIS, atau COD saat kurir tiba.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Accordion matching Image 7 */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2EBD8] max-w-4xl mx-auto space-y-4">
        <h3 className="font-extrabold text-lg text-[#17331D] text-center mb-4">
          Pertanyaan Umum Seputar Order WhatsApp (FAQ)
        </h3>
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="border border-[#E2EBD8] rounded-2xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-4 text-left font-bold text-xs sm:text-sm text-[#17331D] hover:bg-[#F7FAF5]"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-[#087F23]" /> : <ChevronDown className="w-4 h-4 text-[#6B7D70]" />}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-[#6B7D70] leading-relaxed border-t border-[#E2EBD8] pt-3 bg-[#F7FAF5]">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
