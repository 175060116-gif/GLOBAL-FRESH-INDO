export interface Product {
  id: string;
  name: string;
  subtitle: string;
  category: 'lokal' | 'import' | 'parcel';
  origin: string;
  grade: 'Grade A Super' | 'Premium Import' | 'Best Seller' | 'Spesial Hampers';
  unit: string;
  retailPrice: number;
  originalRetailPrice?: number;
  wholesalePrice: number;
  wholesaleUnitDesc: string;
  wholesaleMinQty: number;
  discountPercent?: number;
  isBestDeal?: boolean;
  isPopular?: boolean;
  inStock: boolean;
  stockKg: number;
  rating: number;
  reviewsCount: number;
  description: string;
  sweetnessBrix?: string;
  shelfLife?: string;
  storageTemp?: string;
  image: string;
}

export const PRODUCTS_DATA: Product[] = [
  {
    id: 'alpukat-mentega',
    name: 'Alpukat Mentega Miki Super',
    subtitle: 'Grade A Super Probolinggo - Daging Tebal Legit',
    category: 'lokal',
    origin: 'Probolinggo, Jawa Timur',
    grade: 'Grade A Super',
    unit: 'kg',
    retailPrice: 28000,
    originalRetailPrice: 35000,
    wholesalePrice: 22500,
    wholesaleUnitDesc: 'Grosir Peti (min. 20 kg)',
    wholesaleMinQty: 20,
    discountPercent: 20,
    isBestDeal: true,
    isPopular: true,
    inStock: true,
    stockKg: 420,
    rating: 4.9,
    reviewsCount: 382,
    description: 'Alpukat Mentega pilihan panen langsung dari kebun Probolinggo. Daging buah super tebal, pulen legit bertekstur mentega tanpa serat, dan bebas pahit.',
    sweetnessBrix: 'Gurih & Creamy',
    shelfLife: '3-5 hari ruang sejuk',
    storageTemp: '12-15°C',
    image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'apel-fuji-wangshan',
    name: 'Apel Fuji Wang Shan 88',
    subtitle: 'Premium Import Shandong - Manis Garing Berair',
    category: 'import',
    origin: 'Shandong, Tiongkok',
    grade: 'Premium Import',
    unit: 'kg',
    retailPrice: 34000,
    originalRetailPrice: 42000,
    wholesalePrice: 27500,
    wholesaleUnitDesc: 'Grosir Dus 18kg (Rp 495.000/dus)',
    wholesaleMinQty: 18,
    discountPercent: 19,
    isBestDeal: true,
    isPopular: true,
    inStock: true,
    stockKg: 650,
    rating: 4.9,
    reviewsCount: 512,
    description: 'Apel Fuji grade ekspor terbaik ukuran 88. Kulit mulus kemerahan berurat madu alami, tekstur renyah garing (crunchy) dengan kandungan air melimpah dan rasa manis segar.',
    sweetnessBrix: '14 - 15° Brix',
    shelfLife: '2-3 minggu chiller',
    storageTemp: '2-4°C',
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'jeruk-santang-daun',
    name: 'Jeruk Santang Daun Madu',
    subtitle: 'Best Seller Segar Berdaun Asli - Manis Tanpa Biji',
    category: 'import',
    origin: 'Import Premium',
    grade: 'Best Seller',
    unit: 'kg',
    retailPrice: 32500,
    originalRetailPrice: 39500,
    wholesalePrice: 26000,
    wholesaleUnitDesc: 'Grosir Keranjang 10kg',
    wholesaleMinQty: 10,
    discountPercent: 18,
    isBestDeal: true,
    isPopular: true,
    inStock: true,
    stockKg: 380,
    rating: 4.8,
    reviewsCount: 429,
    description: 'Jeruk santang segar bertangkai daun hijau alami penanda baru dipetik. Kulit tipis sangat mudah dikupas, bulir renyah kaya vitamin C, rasa manis pekat seperti madu.',
    sweetnessBrix: '13° Brix',
    shelfLife: '7-10 hari',
    storageTemp: '5-8°C',
    image: 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'anggur-shine-muscat',
    name: 'Anggur Shine Muscat Manis',
    subtitle: 'Grade Super Crisp & Sweet - Tanpa Biji Bisa Makan Kulit',
    category: 'import',
    origin: 'Import Green House',
    grade: 'Premium Import',
    unit: 'pack (500g)',
    retailPrice: 68000,
    originalRetailPrice: 85000,
    wholesalePrice: 55000,
    wholesaleUnitDesc: 'Karton Dus (min. 10 pack)',
    wholesaleMinQty: 10,
    discountPercent: 20,
    isBestDeal: false,
    isPopular: true,
    inStock: true,
    stockKg: 190,
    rating: 5.0,
    reviewsCount: 640,
    description: 'Anggur primadona dengan butiran besar hijau giok bercahaya. Tekstur sangat garing renyah dengan aroma floral muscat khas yang elegan dan manis legit tanpa biji.',
    sweetnessBrix: '18 - 20° Brix',
    shelfLife: '10-14 hari di kulkas',
    storageTemp: '1-3°C',
    image: 'https://images.unsplash.com/photo-1596363505729-4190a9506133?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'mangga-harum-manis',
    name: 'Mangga Harum Manis Super',
    subtitle: 'Arumanis Pohon Tua Bondowoso - Wangi Alami',
    category: 'lokal',
    origin: 'Bondowoso, Jawa Timur',
    grade: 'Grade A Super',
    unit: 'kg',
    retailPrice: 32000,
    originalRetailPrice: 38000,
    wholesalePrice: 25000,
    wholesaleUnitDesc: 'Grosir Peti 25kg',
    wholesaleMinQty: 25,
    discountPercent: 15,
    isBestDeal: false,
    isPopular: true,
    inStock: true,
    stockKg: 310,
    rating: 4.9,
    reviewsCount: 298,
    description: 'Mangga arumanis asli petik matang pohon. Aroma wangi khas merebak begitu dikupas, serat sangat halus dengan rasa manis pekat menyegarkan tenggorokan.',
    sweetnessBrix: '16° Brix',
    shelfLife: '4-6 hari',
    storageTemp: '13-16°C',
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'pisang-cavendish',
    name: 'Pisang Cavendish Sunpride Cluster',
    subtitle: 'Grade A Standar Hotel Bintang - Kulit Bersih Mulus',
    category: 'lokal',
    origin: 'Lampung',
    grade: 'Grade A Super',
    unit: 'kg',
    retailPrice: 22000,
    originalRetailPrice: 26000,
    wholesalePrice: 16500,
    wholesaleUnitDesc: 'Grosir Dus 13kg',
    wholesaleMinQty: 13,
    discountPercent: 15,
    isBestDeal: false,
    isPopular: true,
    inStock: true,
    stockKg: 520,
    rating: 4.8,
    reviewsCount: 315,
    description: 'Pisang cavendish cluster berkualitas tinggi. Bebas getah, kulit kuning mulus seragam, kaya kalium dan energi instan untuk sarapan sehat & kebutuhan dapur hotel/resto.',
    sweetnessBrix: '14° Brix',
    shelfLife: '5-7 hari',
    storageTemp: '14-16°C',
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'jeruk-medan-berastagi',
    name: 'Jeruk Medan Berastagi Manis',
    subtitle: 'Panen Segar Dataran Tinggi Berastagi - Bulir Tebal',
    category: 'lokal',
    origin: 'Berastagi, Sumatera Utara',
    grade: 'Grade A Super',
    unit: 'kg',
    retailPrice: 29000,
    originalRetailPrice: 34000,
    wholesalePrice: 23000,
    wholesaleUnitDesc: 'Grosir Peti Kayu 20kg',
    wholesaleMinQty: 20,
    discountPercent: 14,
    isBestDeal: false,
    isPopular: false,
    inStock: true,
    stockKg: 290,
    rating: 4.7,
    reviewsCount: 184,
    description: 'Jeruk lokal kebanggaan Nusantara dari tanah vulkanik Berastagi. Bulir tebal dengan perpaduan manis 85% dan asam segar 15% yang sangat kaya rasa.',
    sweetnessBrix: '12° Brix',
    shelfLife: '7 hari',
    storageTemp: '8-12°C',
    image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'buah-naga-merah',
    name: 'Buah Naga Merah Banyuwangi',
    subtitle: 'Organik Kaya Antioksidan - Daging Merah Pekat Manis',
    category: 'lokal',
    origin: 'Banyuwangi, Jawa Timur',
    grade: 'Grade A Super',
    unit: 'kg',
    retailPrice: 24000,
    originalRetailPrice: 28000,
    wholesalePrice: 18500,
    wholesaleUnitDesc: 'Grosir Keranjang 25kg',
    wholesaleMinQty: 25,
    discountPercent: 14,
    isBestDeal: false,
    isPopular: false,
    inStock: true,
    stockKg: 340,
    rating: 4.8,
    reviewsCount: 220,
    description: 'Buah naga daging merah pekat kaya antosianin dan serat. Ukuran besar rata-rata 500-700 gram per buah, sisik hijau segar penanda kualitas panen terbaik.',
    sweetnessBrix: '13° Brix',
    shelfLife: '8-10 hari',
    storageTemp: '6-10°C',
    image: 'https://images.unsplash.com/photo-1527325678964-54921661f888?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'semangka-merah-non-biji',
    name: 'Semangka Merah Non-Biji',
    subtitle: 'Manis Renyah Segar Melepas Dahaga - Daging Padat',
    category: 'lokal',
    origin: 'Indramayu / Cirebon',
    grade: 'Grade A Super',
    unit: 'kg',
    retailPrice: 13500,
    originalRetailPrice: 16000,
    wholesalePrice: 9500,
    wholesaleUnitDesc: 'Grosir Mobil / Pickup (min. 50kg)',
    wholesaleMinQty: 50,
    discountPercent: 15,
    isBestDeal: false,
    isPopular: true,
    inStock: true,
    stockKg: 850,
    rating: 4.9,
    reviewsCount: 410,
    description: 'Semangka tanpa biji berkulit tebal pelindung mutu, daging merah merona dan sangat berair. Cocok untuk konsumsi keluarga, kafe jus, dan katering pesta.',
    sweetnessBrix: '11 - 12° Brix',
    shelfLife: '10-14 hari utuh',
    storageTemp: '12-15°C',
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'melon-golden-alisha',
    name: 'Melon Golden Alisha Hidroponik',
    subtitle: 'Daging Oranye Tebal Super Manis Wangi Vanilla',
    category: 'lokal',
    origin: 'Cianjur Green House',
    grade: 'Grade A Super',
    unit: 'kg',
    retailPrice: 28500,
    originalRetailPrice: 35000,
    wholesalePrice: 22000,
    wholesaleUnitDesc: 'Grosir Keranjang 20kg',
    wholesaleMinQty: 20,
    discountPercent: 18,
    isBestDeal: false,
    isPopular: false,
    inStock: true,
    stockKg: 210,
    rating: 4.9,
    reviewsCount: 162,
    description: 'Melon golden kulit kuning mulus hasil budidaya hidroponik presisi Cianjur. Tekstur renyah lembut dengan rasa manis laksana madu dan aroma semerbak harum.',
    sweetnessBrix: '14 - 15° Brix',
    shelfLife: '7-10 hari',
    storageTemp: '8-12°C',
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'kiwi-gold-zespri',
    name: 'Kiwi Gold Zespri New Zealand',
    subtitle: 'Super Food Kaya Nutrisi & Vitamin C 3x Jeruk',
    category: 'import',
    origin: 'New Zealand',
    grade: 'Premium Import',
    unit: 'pack (4 pcs)',
    retailPrice: 65000,
    originalRetailPrice: 78000,
    wholesalePrice: 52000,
    wholesaleUnitDesc: 'Grosir Tray Dus (min. 6 pack)',
    wholesaleMinQty: 6,
    discountPercent: 16,
    isBestDeal: false,
    isPopular: false,
    inStock: true,
    stockKg: 120,
    rating: 4.9,
    reviewsCount: 195,
    description: 'Kiwi Gold Zespri asli New Zealand berkulit halus minim bulu. Daging buah kuning keemasan dengan rasa manis tropis tanpa asam tajam.',
    sweetnessBrix: '15° Brix',
    shelfLife: '14 hari kulkas',
    storageTemp: '1-3°C',
    image: 'https://images.unsplash.com/photo-1585059895524-72359e06133a?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'stroberi-ciwidey',
    name: 'Stroberi Ciwidey Sweet Grade',
    subtitle: 'Petik Pagi Dataran Tinggi Ciwidey - Segar Merah Mulus',
    category: 'lokal',
    origin: 'Ciwidey, Bandung Selatan',
    grade: 'Grade A Super',
    unit: 'pack (300g)',
    retailPrice: 25000,
    originalRetailPrice: 30000,
    wholesalePrice: 19000,
    wholesaleUnitDesc: 'Grosir Keranjang Dingin (min. 10 pack)',
    wholesaleMinQty: 10,
    discountPercent: 16,
    isBestDeal: false,
    isPopular: true,
    inStock: true,
    stockKg: 160,
    rating: 4.8,
    reviewsCount: 278,
    description: 'Stroberi pilihan dipanen subuh dari perkebunan Ciwidey. Warna merah menggoda dengan kesegaran alami, favorit untuk jus, topping kue, atau dikonsumsi langsung.',
    sweetnessBrix: '10 - 11° Brix',
    shelfLife: '3-4 hari chiller',
    storageTemp: '2-4°C',
    image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'hampers-royal-gold',
    name: 'Paket Hampers Royal Executive',
    subtitle: 'Keranjang Anyam Eksklusif + Pita Mewah & Kartu Ucapan',
    category: 'parcel',
    origin: 'Spesial Dapur Fresh Indo',
    grade: 'Spesial Hampers',
    unit: 'paket',
    retailPrice: 385000,
    originalRetailPrice: 45000,
    wholesalePrice: 340000,
    wholesaleUnitDesc: 'Pemesanan Korporat (min. 5 paket)',
    wholesaleMinQty: 5,
    discountPercent: 14,
    isBestDeal: false,
    isPopular: true,
    inStock: true,
    stockKg: 45,
    rating: 5.0,
    reviewsCount: 140,
    description: 'Parcel buah premium berisi Anggur Shine Muscat, Apel Fuji Wang Shan, Pear Century, Jeruk Santang Daun, Kiwi Gold, dan Mangga Arumanis. Dikemas rapi higienis lengkap dengan greeting card.',
    shelfLife: '7 hari',
    storageTemp: 'Ruang AC',
    image: 'https://images.unsplash.com/photo-1546548970-71785318a17b?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'hampers-fresh-care',
    name: 'Paket Hampers Buah Get Well Soon',
    subtitle: 'Solusi Jenguk Sakit & Hadiah Sehat Penuh Vitamin C',
    category: 'parcel',
    origin: 'Spesial Dapur Fresh Indo',
    grade: 'Spesial Hampers',
    unit: 'paket',
    retailPrice: 235000,
    originalRetailPrice: 280000,
    wholesalePrice: 210000,
    wholesaleUnitDesc: 'Pemesanan Komunitas / Kantor (min. 5 paket)',
    wholesaleMinQty: 5,
    discountPercent: 16,
    isBestDeal: false,
    isPopular: true,
    inStock: true,
    stockKg: 60,
    rating: 4.9,
    reviewsCount: 110,
    description: 'Kombinasi buah pemulihan imun tinggi: Jeruk Santang, Alpukat Mentega, Buah Naga Merah, Pisang Cavendish, dan Apel Fuji. Tampilan segar, hangat dan membangkitkan semangat sembuh.',
    shelfLife: '5-7 hari',
    storageTemp: 'Ruang AC',
    image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=800&q=80',
  }
];

export interface CartItem {
  product: Product;
  quantity: number;
  weightTier: '500g' | '1kg' | '2kg' | 'grosir';
  pricePerUnit: number;
}

const PRODUCTS_STORAGE_KEY = 'gfi_products_catalog';

export const getStoredProducts = (): Product[] => {
  try {
    const data = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load products from localStorage', e);
  }
  return PRODUCTS_DATA;
};

export const saveStoredProducts = (products: Product[]): void => {
  try {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
  } catch (e: unknown) {
    console.warn('Failed to save products to localStorage, attempting safe copy...', e);
    try {
      // If quota exceeded, sanitize any product with massive base64 images
      const safeProducts = products.map((p) => {
        if (p.image && p.image.length > 200000) {
          const defaultMatch = PRODUCTS_DATA.find((def) => def.id === p.id);
          return { ...p, image: defaultMatch?.image || 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=600&q=80' };
        }
        return p;
      });
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(safeProducts));
    } catch (fallbackErr) {
      console.error('Failed to save products even with safe copy', fallbackErr);
    }
  }
};

export const resetStoredProducts = (): Product[] => {
  try {
    localStorage.removeItem(PRODUCTS_STORAGE_KEY);
  } catch (e) {
    console.error('Failed to reset products', e);
  }
  return PRODUCTS_DATA;
};
