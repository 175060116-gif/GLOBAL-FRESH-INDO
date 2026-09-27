import React, { useState } from 'react';
import { 
  X, ShoppingCart, Trash2, Plus, Minus, 
  ArrowRight, ShieldCheck, MessageCircle, CreditCard, 
  CheckCircle2, Truck 
} from 'lucide-react';
import { CartItem } from '../data/products';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQty: (productId: string, weightTier: string, delta: number) => void;
  onRemoveItem: (productId: string, weightTier: string) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
}) => {
  if (!isOpen) return null;

  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'payment_success'>('cart');
  const [recipientName, setRecipientName] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');

  const subtotal = items.reduce((acc, item) => acc + item.pricePerUnit * item.quantity, 0);
  const deliveryFee = subtotal > 150000 || subtotal === 0 ? 0 : 15000;
  const grandTotal = subtotal + deliveryFee;

  const handleCheckoutWA = () => {
    let msg = `*PESANAN KERANJANG BELANJA - GLOBAL FRESH INDO*\n`;
    msg += `Waktu: ${new Date().toLocaleDateString('id-ID')} ${new Date().toLocaleTimeString('id-ID')}\n\n`;
    
    if (recipientName) msg += `• Nama Pemesan: ${recipientName}\n`;
    if (recipientAddress) msg += `• Alamat: ${recipientAddress}\n\n`;

    msg += `*Daftar Buah Dipesan:*\n`;
    items.forEach((item, idx) => {
      msg += `${idx + 1}. ${item.product.name} (${item.weightTier}) x ${item.quantity} = Rp ${(item.pricePerUnit * item.quantity).toLocaleString('id-ID')}\n`;
    });

    msg += `\nSubtotal: Rp ${subtotal.toLocaleString('id-ID')}\n`;
    msg += `Ongkir: ${deliveryFee === 0 ? 'GRATIS (Cianjur Kota)' : `Rp ${deliveryFee.toLocaleString('id-ID')}`}\n`;
    msg += `*TOTAL BAYAR: Rp ${grandTotal.toLocaleString('id-ID')}*\n\n`;
    msg += `Mohon konfirmasi nomor rekening pembayaran dan jadwal keberangkatan kurir. Terima kasih!`;

    const waUrl = `https://wa.me/6285284633214?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');
  };

  const handleSimulatePayment = () => {
    setCheckoutStep('payment_success');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header matching Image 2 Screen 3 */}
        <div className="p-4 sm:p-5 border-b border-[#E2EBD8] flex items-center justify-between bg-[#F7FAF5]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#087F23] text-white flex items-center justify-center">
              <ShoppingCart className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-extrabold text-sm sm:text-base text-[#17331D]">
                Keranjang Belanja ({items.length})
              </h2>
              <span className="text-[10px] text-[#6B7D70]">Produk segar pilihan Anda</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                onClick={onClearCart}
                className="text-xs text-[#E53935] hover:underline flex items-center gap-1 font-semibold"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus Semua</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-4">
          {checkoutStep === 'payment_success' ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#E8F5E4] text-[#087F23] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black text-[#17331D]">Pesanan Berhasil Dibuat!</h3>
              <p className="text-xs text-[#6B7D70] max-w-xs mx-auto">
                Nomor Pesanan: <strong>#GF2026001234</strong>. Kurir kami sedang menyiapkan buah segar berpendingin untuk dikirim ke alamat Anda.
              </p>
              <button
                onClick={() => {
                  onClearCart();
                  setCheckoutStep('cart');
                  onClose();
                }}
                className="bg-[#087F23] text-white px-6 py-2.5 rounded-xl text-xs font-bold"
              >
                Kembali Belanja
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <ShoppingCart className="w-12 h-12 text-[#CDE0C4] mx-auto" />
              <h3 className="font-bold text-sm text-[#17331D]">Keranjang Masih Kosong</h3>
              <p className="text-xs text-[#6B7D70]">
                Jelajahi pricelist buah segar berkualitas dan tambahkan ke keranjang.
              </p>
              <button
                onClick={onClose}
                className="mt-2 bg-[#087F23] text-white px-5 py-2 rounded-xl text-xs font-bold"
              >
                Mulai Belanja
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={`${item.product.id}-${item.weightTier}`}
                  className="bg-[#F7FAF5] border border-[#E2EBD8] rounded-2xl p-3 flex items-center justify-between gap-3 hover:border-[#CDE0C4] transition-all"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-14 h-14 rounded-xl object-cover border border-white shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs text-[#17331D] truncate">
                      {item.product.name}
                    </h4>
                    <span className="text-[10px] text-[#087F23] font-semibold bg-[#E8F5E4] px-1.5 py-0.5 rounded">
                      Kemasan: {item.weightTier}
                    </span>
                    <div className="text-xs font-black text-[#087F23] mt-1">
                      Rp {(item.pricePerUnit * item.quantity).toLocaleString('id-ID')}
                    </div>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center bg-white rounded-lg border border-[#CDE0C4] p-0.5">
                      <button
                        onClick={() => onUpdateQty(item.product.id, item.weightTier, -1)}
                        className="w-6 h-6 rounded flex items-center justify-center text-[#17331D] hover:bg-neutral-100"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-[#17331D]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQty(item.product.id, item.weightTier, 1)}
                        className="w-6 h-6 rounded bg-[#087F23] text-white flex items-center justify-center hover:bg-[#005500]"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.product.id, item.weightTier)}
                      className="p-1.5 text-[#6B7D70] hover:text-[#E53935]"
                      title="Hapus item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Quick Customer Address inputs */}
              <div className="pt-3 border-t border-[#E2EBD8] space-y-2">
                <input
                  type="text"
                  placeholder="Nama Lengkap Pemesan"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full bg-[#F7FAF5] border border-[#CDE0C4] rounded-xl p-2 text-xs text-[#17331D] focus:outline-none focus:ring-1 focus:ring-[#087F23]"
                />
                <input
                  type="text"
                  placeholder="Alamat Pengiriman (Cianjur / Sekitarnya)"
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  className="w-full bg-[#F7FAF5] border border-[#CDE0C4] rounded-xl p-2 text-xs text-[#17331D] focus:outline-none focus:ring-1 focus:ring-[#087F23]"
                />
              </div>

              {/* Guarantee info */}
              <div className="flex items-center gap-2 bg-[#E8F5E4] p-2 rounded-xl text-[11px] text-[#087F23]">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Semua buah bergaransi 24 jam tukar baru jika ada kerusakan.</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Summary & Checkout matching Image 2 Screen 3 */}
        {items.length > 0 && checkoutStep === 'cart' && (
          <div className="p-4 sm:p-5 border-t border-[#E2EBD8] bg-[#F7FAF5] space-y-3">
            <div className="space-y-1.5 text-xs text-[#6B7D70]">
              <div className="flex justify-between">
                <span>Subtotal ({items.length} item)</span>
                <span className="font-semibold text-[#17331D]">Rp {subtotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between">
                <span>Ongkos Kirim Kurir</span>
                <span className={deliveryFee === 0 ? 'text-[#087F23] font-bold' : 'text-[#17331D]'}>
                  {deliveryFee === 0 ? 'GRATIS (Promo)' : `Rp ${deliveryFee.toLocaleString('id-ID')}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-black text-[#17331D] pt-2 border-t border-dashed border-[#CDE0C4]">
                <span>Total Tagihan:</span>
                <span className="text-[#087F23]">Rp {grandTotal.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={onClose}
                className="py-2.5 px-3 rounded-xl border border-[#CDE0C4] bg-white hover:bg-neutral-50 text-xs font-bold text-[#17331D] transition-colors"
              >
                Lanjut Belanja
              </button>

              <button
                onClick={handleCheckoutWA}
                className="py-2.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-xs font-extrabold text-white shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Checkout WA</span>
              </button>
            </div>

            <button
              onClick={handleSimulatePayment}
              className="w-full py-2.5 rounded-xl bg-[#087F23] hover:bg-[#005500] text-xs font-extrabold text-white shadow-md transition-all flex items-center justify-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              <span>Bayar Langsung (QRIS / Bank Transfer)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
