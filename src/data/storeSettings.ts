export interface StoreSettings {
  storeName: string;
  storeTagline: string;
  storeSlogan: string;
  whatsappNumber: string;
  address: string;
  city: string;
  operatingHours: string;
  logoUrl: string;
  hideLoginMenu?: boolean;
  farmerImageUrl?: string;
}

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  storeName: 'GLOBAL FRESH INDO',
  storeTagline: 'Toko Buah Segar & Distributor Buah Segar',
  storeSlogan: 'Fresh Fruits • Fresh Quality • Fresh Delivery',
  whatsappNumber: '6285284633214',
  address: 'Jl. Raya Cilaku No. 88, Cianjur, Jawa Barat 43285',
  city: 'Cianjur',
  operatingHours: 'Setiap Hari 07.00 - 21.00 WIB',
  logoUrl: '/global_fresh_logo.jpg',
  hideLoginMenu: true,
  farmerImageUrl: '/petani_rambutan.jpg',
};

const SETTINGS_KEY = 'gfi_store_settings';

export const getStoredSettings = (): StoreSettings => {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      // If farmerImageUrl or logoUrl is an excessively huge legacy uncompressed string (> 250KB), sanitize it to protect quota
      if (parsed.farmerImageUrl && parsed.farmerImageUrl.length > 250000) {
        parsed.farmerImageUrl = DEFAULT_STORE_SETTINGS.farmerImageUrl;
      }
      if (parsed.logoUrl && parsed.logoUrl.length > 250000) {
        parsed.logoUrl = DEFAULT_STORE_SETTINGS.logoUrl;
      }
      return { ...DEFAULT_STORE_SETTINGS, ...parsed };
    }
  } catch (e) {
    console.error('Failed to load store settings from localStorage', e);
  }
  return DEFAULT_STORE_SETTINGS;
};

export const saveStoredSettings = (settings: StoreSettings): void => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e: unknown) {
    console.warn('LocalStorage quota warning, attempting safe recovery...', e);
    try {
      // Fallback: If farmerImageUrl is an uncompressed large base64, revert it to default to save other crucial settings
      const safeCopy: StoreSettings = { ...settings };
      if (safeCopy.farmerImageUrl && safeCopy.farmerImageUrl.length > 200000) {
        safeCopy.farmerImageUrl = DEFAULT_STORE_SETTINGS.farmerImageUrl;
      }
      if (safeCopy.logoUrl && safeCopy.logoUrl.length > 200000) {
        safeCopy.logoUrl = DEFAULT_STORE_SETTINGS.logoUrl;
      }
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(safeCopy));
      console.log('Saved settings successfully using safe fallback payload.');
    } catch (fallbackErr) {
      console.error('Failed to save store settings to localStorage even after fallback', fallbackErr);
    }
  }
};
