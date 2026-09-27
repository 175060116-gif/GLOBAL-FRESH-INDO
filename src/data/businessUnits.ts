export interface BusinessUnitCard {
  id: 'retail' | 'b2b' | 'bgn';
  badgeLeft: string;
  badgeRight?: string;
  title: string;
  description: string;
  imageUrl: string;
  checklist: string[];
  actionLabel: string;
  bannerTitle?: string;
  bannerSubtitle?: string;
}

export const DEFAULT_BUSINESS_UNITS: BusinessUnitCard[] = [
  {
    id: 'retail',
    badgeLeft: 'Ritel & Rumah Tangga',
    title: 'Pasar & Eceran Harian',
    description: 'Pemesanan praktis tanpa ribet melalui katalog online atau WhatsApp. Buah tiba dalam kondisi siap saji, dikemas food-grade higienis, dan pas untuk kebutuhan nutrisi mingguan keluarga.',
    imageUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
    checklist: [
      'Tanpa minimal order untuk area tertentu',
      'Kemasan mika ventilasi kedap debu',
      'Pengiriman instan & sameday'
    ],
    actionLabel: 'Pesan Buah Ritel',
  },
  {
    id: 'b2b',
    badgeLeft: 'Grosir & Suplai B2B',
    badgeRight: 'PALING BANYAK DIPILIH',
    title: 'Pasokan Resto, Hotel & Katering',
    description: 'Solusi logistik terencana untuk kebutuhan dapur skala besar. Penimbangan presisi, faktur pajak resmi, stabilitas pasokan sepanjang tahun, dan opsi pembayaran termin (TOP).',
    imageUrl: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=800&q=80',
    checklist: [
      'Pengiriman subuh (04.00 - 08.00 WIB)',
      'Harga grosir khusus & kontrak berkala',
      'Dedicated Account Manager khusus B2B'
    ],
    actionLabel: 'Daftar Akun Bisnis B2B',
  },
  {
    id: 'bgn',
    badgeLeft: 'Dapur Satuan Pelayanan Gizi',
    badgeRight: 'PROGRAM NASIONAL',
    title: 'Suplai Buah Dapur Gizi & Badan Gizi Nasional (BGN)',
    description: 'Penyedia komoditas buah segar standar gizi tinggi untuk Satuan Pelayanan Pemenuhan Gizi (SPPG) / Dapur Gizi Badan Gizi Nasional. Kualitas terverifikasi bebas pestisida berlebih, pasokan tepat waktu harian, gramasi presisi, dan sertifikasi keamanan pangan PSAT untuk mendukung Program Makan Bergizi Gratis.',
    imageUrl: '', // Uses official BGN layout or custom uploaded image
    bannerTitle: 'Program Makan Bergizi Gratis',
    bannerSubtitle: 'Standar Higiene PSAT & Kalori Terukur',
    checklist: [
      'Standar Kalori & Vitamin Terukur',
      'Sertifikasi Uji Higiene Pangan',
      'Distribusi Tepat Waktu Harian'
    ],
    actionLabel: 'Konsultasi Pengadaan BGN',
  }
];

const STORAGE_KEY = 'gfi_business_units_v1';

export const getStoredBusinessUnits = (): BusinessUnitCard[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Merge with default to ensure no missing fields
        return DEFAULT_BUSINESS_UNITS.map(def => {
          const found = parsed.find((p: BusinessUnitCard) => p.id === def.id);
          return found ? { ...def, ...found } : def;
        });
      }
    }
  } catch (err) {
    console.error('Failed to parse business units from localStorage', err);
  }
  return DEFAULT_BUSINESS_UNITS;
};

export const saveStoredBusinessUnits = (units: BusinessUnitCard[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(units));
  } catch (err: unknown) {
    console.warn('Failed to save business units to localStorage, attempting safe copy...', err);
    try {
      // If quota exceeded, sanitize any excessively large base64 URLs
      const safeUnits = units.map((u) => {
        if (u.imageUrl && u.imageUrl.length > 200000) {
          const defaultMatch = DEFAULT_BUSINESS_UNITS.find((d) => d.id === u.id);
          return { ...u, imageUrl: defaultMatch?.imageUrl || '' };
        }
        return u;
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(safeUnits));
    } catch (fallbackErr) {
      console.error('Failed to save business units even with fallback', fallbackErr);
    }
  }
};

export const resetStoredBusinessUnits = (): BusinessUnitCard[] => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear business units in localStorage', err);
  }
  return DEFAULT_BUSINESS_UNITS;
};
