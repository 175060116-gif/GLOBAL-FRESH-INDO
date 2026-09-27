import React, { useState } from 'react';
import { Lock, KeyRound, ShieldAlert, CheckCircle2, X, Eye, EyeOff } from 'lucide-react';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ADMIN_PIN_KEY = 'gfi_admin_pin';
const DEFAULT_PIN = '1234';

export const getStoredAdminPin = (): string => {
  return localStorage.getItem(ADMIN_PIN_KEY) || DEFAULT_PIN;
};

export const setStoredAdminPin = (newPin: string): void => {
  localStorage.setItem(ADMIN_PIN_KEY, newPin);
};

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [confirmNewPin, setConfirmNewPin] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const currentSavedPin = getStoredAdminPin();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === currentSavedPin) {
      setErrorMsg('');
      onSuccess();
      onClose();
      setPin('');
    } else {
      setErrorMsg('PIN Keamanan salah! Silakan coba lagi.');
    }
  };

  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin !== currentSavedPin) {
      setErrorMsg('PIN lama Anda tidak sesuai.');
      return;
    }
    if (newPin.length < 4) {
      setErrorMsg('PIN baru minimal harus 4 karakter.');
      return;
    }
    if (newPin !== confirmNewPin) {
      setErrorMsg('Konfirmasi PIN baru tidak cocok.');
      return;
    }

    setStoredAdminPin(newPin);
    setSuccessMsg('PIN berhasil diperbarui! Silakan login dengan PIN baru.');
    setIsChangingPin(false);
    setPin('');
    setNewPin('');
    setConfirmNewPin('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-[#E2EBD8] overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E2EBD8] bg-[#F7FAF5] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#087F23]/10 flex items-center justify-center text-[#087F23]">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-[#17331D]">
                Portal Khusus Pemilik Toko
              </h2>
              <p className="text-[11px] text-[#6B7D70]">
                Akses terbatas hanya untuk admin pengelola
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#6B7D70] hover:text-[#17331D] hover:bg-white rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <div className="bg-[#FFF8E1] border border-[#FFE082] rounded-2xl p-3.5 text-xs text-[#795548] flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-[#FF8F00] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-[#FF8F00] block">Area Terproteksi:</span>
              <p className="text-[11px] leading-relaxed">
                Kostumer umum tidak memiliki akses ke halaman ini dan tidak dapat mengubah harga, foto, atau logo toko.
              </p>
              <div className="text-[10px] text-[#5D4037] font-semibold pt-1">
                🔑 PIN Bawaan Toko: <strong className="font-mono bg-white/80 px-1.5 py-0.5 rounded border border-[#FFD54F]">1234</strong>
              </div>
            </div>
          </div>

          {!isChangingPin ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#17331D] mb-1.5 flex items-center justify-between">
                  <span>Masukkan PIN Admin *</span>
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="text-[11px] text-[#087F23] hover:underline font-normal flex items-center gap-1"
                  >
                    {showPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showPin ? 'Sembunyikan' : 'Lihat PIN'}</span>
                  </button>
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3.5 top-3 text-[#6B7D70]" />
                  <input
                    type={showPin ? 'text' : 'password'}
                    required
                    autoFocus
                    value={pin}
                    onChange={(e) => {
                      setPin(e.target.value);
                      setErrorMsg('');
                    }}
                    placeholder="Masukkan PIN (Default: 1234)"
                    className="w-full text-sm pl-10 pr-4 py-2.5 rounded-xl border border-[#CDE0C4] bg-white font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-[#087F23]"
                  />
                </div>
              </div>

              {errorMsg && (
                <p className="text-xs text-red-600 font-bold bg-red-50 p-2.5 rounded-xl border border-red-200">
                  ⚠️ {errorMsg}
                </p>
              )}

              {successMsg && (
                <p className="text-xs text-green-700 font-bold bg-green-50 p-2.5 rounded-xl border border-green-200 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                  <span>{successMsg}</span>
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-[#087F23] hover:bg-[#06631B] text-white text-xs font-black rounded-xl shadow-md transition-all hover:scale-101"
              >
                Buka Panel Admin & Manajemen
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsChangingPin(true);
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  className="text-[11px] text-[#6B7D70] hover:text-[#087F23] hover:underline font-bold"
                >
                  Ganti PIN Pengelola Toko
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleChangePin} className="space-y-3.5">
              <h3 className="text-xs font-black text-[#087F23] uppercase tracking-wider">
                Ubah PIN Akses Pengelola
              </h3>

              <div>
                <label className="block text-[11px] font-bold text-[#17331D] mb-1">
                  PIN Lama Saat Ini
                </label>
                <input
                  type="password"
                  required
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="PIN saat ini (Default: 1234)"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-[#CDE0C4] bg-white focus:outline-none focus:ring-2 focus:ring-[#087F23]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#17331D] mb-1">
                  PIN Baru (Min. 4 Angka/Huruf)
                </label>
                <input
                  type="password"
                  required
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  placeholder="Masukkan PIN baru"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-[#CDE0C4] bg-white focus:outline-none focus:ring-2 focus:ring-[#087F23]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#17331D] mb-1">
                  Ulangi PIN Baru
                </label>
                <input
                  type="password"
                  required
                  value={confirmNewPin}
                  onChange={(e) => setConfirmNewPin(e.target.value)}
                  placeholder="Ketik ulang PIN baru"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-[#CDE0C4] bg-white focus:outline-none focus:ring-2 focus:ring-[#087F23]"
                />
              </div>

              {errorMsg && (
                <p className="text-xs text-red-600 font-bold bg-red-50 p-2.5 rounded-xl border border-red-200">
                  ⚠️ {errorMsg}
                </p>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsChangingPin(false)}
                  className="w-1/2 py-2 text-xs font-bold text-[#6B7D70] hover:text-[#17331D] bg-gray-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 bg-[#087F23] hover:bg-[#06631B] text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  Simpan PIN Baru
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
