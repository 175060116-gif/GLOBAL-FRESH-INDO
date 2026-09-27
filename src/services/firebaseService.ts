import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, testFirestoreConnection } from '../firebase';
import { Product, PRODUCTS_DATA, saveStoredProducts } from '../data/products';
import { WholesalePricelistItem, WHOLESALE_PRICELIST, saveStoredWholesalePricelist } from '../data/wholesalePricelist';
import { StoreSettings, DEFAULT_STORE_SETTINGS, saveStoredSettings } from '../data/storeSettings';

export { testFirestoreConnection };

export interface ConsultationRecord {
  id: string;
  schoolName: string;
  contactPerson: string;
  whatsapp: string;
  district?: string;
  studentCount: number;
  portionGrams?: number;
  packageId?: string;
  customRequest?: string;
  status: string;
  createdAt: string;
}

// 1. PRODUCTS SYNC
export function subscribeToProducts(
  onUpdate: (products: Product[]) => void,
  onError?: (error: Error) => void
) {
  const collectionRef = collection(db, 'products');
  return onSnapshot(
    collectionRef,
    async (snapshot) => {
      if (snapshot.empty) {
        try {
          await seedInitialProducts();
        } catch (e) {
          console.warn('Could not auto-seed products to Firestore, using local defaults', e);
        }
        return;
      }

      const items: Product[] = [];
      snapshot.forEach((docSnap) => {
        const raw = docSnap.data();
        // Merge with existing default product attributes if needed
        const defaultMatch = PRODUCTS_DATA.find((p) => p.id === raw.id);
        const mapped: Product = {
          id: raw.id,
          name: raw.name || defaultMatch?.name || 'Buah Segar',
          subtitle: defaultMatch?.subtitle || '',
          category: (raw.category as any) || defaultMatch?.category || 'lokal',
          origin: raw.origin || defaultMatch?.origin || 'Bandung, Jawa Barat',
          grade: (raw.grade as any) || defaultMatch?.grade || 'Grade A Super',
          unit: raw.unit || defaultMatch?.unit || 'kg',
          retailPrice: Number(raw.price || defaultMatch?.retailPrice || 30000),
          originalRetailPrice: defaultMatch?.originalRetailPrice,
          wholesalePrice: defaultMatch?.wholesalePrice || 25000,
          wholesaleUnitDesc: defaultMatch?.wholesaleUnitDesc || 'Grosir Peti',
          wholesaleMinQty: defaultMatch?.wholesaleMinQty || 10,
          discountPercent: defaultMatch?.discountPercent,
          isBestDeal: defaultMatch?.isBestDeal,
          isPopular: typeof raw.isPopular === 'boolean' ? raw.isPopular : defaultMatch?.isPopular,
          inStock: typeof raw.isAvailable === 'boolean' ? raw.isAvailable : (defaultMatch?.inStock ?? true),
          stockKg: Number(raw.stock || defaultMatch?.stockKg || 100),
          rating: defaultMatch?.rating || 4.9,
          reviewsCount: defaultMatch?.reviewsCount || 100,
          description: raw.description || defaultMatch?.description || '',
          sweetnessBrix: defaultMatch?.sweetnessBrix,
          shelfLife: defaultMatch?.shelfLife,
          storageTemp: defaultMatch?.storageTemp,
          image: raw.image || defaultMatch?.image || 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=600&q=80',
        };
        items.push(mapped);
      });

      // Ensure all initial products are present in Firestore
      const missingProducts = PRODUCTS_DATA.filter((p) => !items.some((it) => it.id === p.id));
      if (missingProducts.length > 0) {
        for (const missing of missingProducts) {
          saveProductToFirestore(missing).catch((e) =>
            console.warn('Auto-sync missing product to Firestore:', missing.id, e)
          );
        }
      }

      items.sort((a, b) => a.name.localeCompare(b.name));
      saveStoredProducts(items);
      onUpdate(items);
    },
    (err) => {
      console.warn('Products sync snapshot error:', err);
      onError?.(err);
      handleFirestoreError(err, OperationType.GET, 'products');
    }
  );
}

export async function saveProductToFirestore(product: Product): Promise<void> {
  const path = `products/${product.id}`;
  try {
    const docRef = doc(db, 'products', product.id);
    const cleanData: Record<string, any> = {
      id: String(product.id).slice(0, 64),
      name: String(product.name).slice(0, 100),
      category: String(product.category || 'lokal').slice(0, 50),
      price: Number(product.retailPrice || 0),
      unit: String(product.unit || 'kg').slice(0, 30),
      isAvailable: Boolean(product.inStock),
      origin: String(product.origin || 'Indonesia').slice(0, 100),
      grade: String(product.grade || 'Grade A Super').slice(0, 30),
      stock: Math.max(0, Number(product.stockKg || 0)),
      isPopular: Boolean(product.isPopular),
    };

    if (product.description) cleanData.description = String(product.description).slice(0, 500);
    if (product.image && product.image.length <= 450000) {
      cleanData.image = product.image;
    }

    await setDoc(docRef, cleanData, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function deleteProductFromFirestore(productId: string): Promise<void> {
  const path = `products/${productId}`;
  try {
    const docRef = doc(db, 'products', productId);
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

async function seedInitialProducts(): Promise<void> {
  for (const item of PRODUCTS_DATA) {
    await saveProductToFirestore(item);
  }
}

// 2. WHOLESALE PRICELIST SYNC
export function subscribeToWholesale(
  onUpdate: (items: WholesalePricelistItem[]) => void,
  onError?: (error: Error) => void
) {
  const collectionRef = collection(db, 'wholesalePricelist');
  return onSnapshot(
    collectionRef,
    async (snapshot) => {
      const cloudMap = new Map<string, Record<string, any>>();
      snapshot.forEach((docSnap) => {
        cloudMap.set(docSnap.id, docSnap.data());
      });

      // Always guarantee that all 57 official items are represented with fallback to WHOLESALE_PRICELIST
      const items: WholesalePricelistItem[] = WHOLESALE_PRICELIST.map((defaultItem) => {
        const raw = cloudMap.get(defaultItem.code);
        if (!raw) return defaultItem;

        return {
          code: defaultItem.code,
          name: raw.name || defaultItem.name,
          category: (raw.category || defaultItem.category) as any,
          categoryEmoji: raw.categoryEmoji || defaultItem.categoryEmoji,
          price: Number(raw.standardPrice !== undefined ? raw.standardPrice : defaultItem.price),
          unit: raw.unit || defaultItem.unit,
          packaging: raw.specs || defaultItem.packaging,
          image: raw.image || defaultItem.image,
          badge: raw.grade || defaultItem.badge,
          stockDus: Number(raw.minOrderKg !== undefined ? raw.minOrderKg : defaultItem.stockDus),
          inStock: typeof raw.isSeasonal === 'boolean' ? !raw.isSeasonal : defaultItem.inStock,
        };
      });

      // Add any additional items custom created in Firestore by Admin
      cloudMap.forEach((raw, docId) => {
        if (!WHOLESALE_PRICELIST.some((w) => w.code === docId)) {
          items.push({
            code: docId,
            name: raw.name || 'Komoditas Buah',
            category: (raw.category || 'Anggur') as any,
            categoryEmoji: raw.categoryEmoji || '🍎',
            price: Number(raw.standardPrice || 100000),
            unit: raw.unit || 'Dus',
            packaging: raw.specs || 'Dus Segel',
            image: raw.image || 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=800&q=80',
            badge: raw.grade,
            stockDus: Number(raw.minOrderKg || 20),
            inStock: typeof raw.isSeasonal === 'boolean' ? !raw.isSeasonal : true,
          });
        }
      });

      // Seed any missing items to Firestore so cloud database permanently contains all 57 items
      const missingInFirestore = WHOLESALE_PRICELIST.filter((w) => !cloudMap.has(w.code));
      if (missingInFirestore.length > 0) {
        for (const missingItem of missingInFirestore) {
          saveWholesaleItemToFirestore(missingItem).catch((e) =>
            console.warn('Auto-sync wholesale item to Firestore failed:', missingItem.code, e)
          );
        }
      }

      saveStoredWholesalePricelist(items);
      onUpdate(items);
    },
    (err) => {
      console.warn('Wholesale sync snapshot error:', err);
      onError?.(err);
      handleFirestoreError(err, OperationType.GET, 'wholesalePricelist');
    }
  );
}

export async function saveWholesaleItemToFirestore(item: WholesalePricelistItem): Promise<void> {
  const cleanId = String(item.code || `item_${Date.now()}`).slice(0, 64);
  const path = `wholesalePricelist/${cleanId}`;
  try {
    const docRef = doc(db, 'wholesalePricelist', cleanId);
    const cleanData: Record<string, any> = {
      id: cleanId,
      name: String(item.name).slice(0, 100),
      grade: String(item.badge || 'Grade A Standar MBG').slice(0, 30),
      standardPrice: Number(item.price || 50000),
      unit: String(item.unit || 'Dus').slice(0, 30),
      minOrderKg: Number(item.stockDus || 10),
      specs: String(item.packaging || 'Dus Segel').slice(0, 200),
      isSeasonal: !item.inStock,
      category: String(item.category || 'Anggur').slice(0, 50),
      categoryEmoji: String(item.categoryEmoji || '🍎').slice(0, 10),
    };

    if (item.image && item.image.length <= 450000) {
      cleanData.image = item.image;
    }

    await setDoc(docRef, cleanData, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function deleteWholesaleItemFromFirestore(itemId: string): Promise<void> {
  const path = `wholesalePricelist/${itemId}`;
  try {
    const docRef = doc(db, 'wholesalePricelist', itemId);
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

async function seedInitialWholesale(): Promise<void> {
  for (const item of WHOLESALE_PRICELIST) {
    await saveWholesaleItemToFirestore(item);
  }
}

// 3. STORE SETTINGS SYNC
export function subscribeToStoreSettings(
  onUpdate: (settings: StoreSettings) => void,
  onError?: (error: Error) => void
) {
  const docRef = doc(db, 'storeSettings', 'main');
  return onSnapshot(
    docRef,
    async (snapshot) => {
      if (!snapshot.exists()) {
        try {
          await saveStoreSettingsToFirestore(DEFAULT_STORE_SETTINGS);
        } catch (e) {
          console.warn('Could not auto-seed settings to Firestore, using local defaults', e);
        }
        return;
      }

      const raw = snapshot.data();
      const mapped: StoreSettings = {
        storeName: raw.storeName || DEFAULT_STORE_SETTINGS.storeName,
        storeTagline: raw.tagline || DEFAULT_STORE_SETTINGS.storeTagline,
        storeSlogan: DEFAULT_STORE_SETTINGS.storeSlogan,
        whatsappNumber: raw.phone || DEFAULT_STORE_SETTINGS.whatsappNumber,
        address: raw.address || DEFAULT_STORE_SETTINGS.address,
        city: DEFAULT_STORE_SETTINGS.city,
        operatingHours: raw.operatingHours || DEFAULT_STORE_SETTINGS.operatingHours,
        logoUrl: raw.logoUrl || DEFAULT_STORE_SETTINGS.logoUrl,
        hideLoginMenu: DEFAULT_STORE_SETTINGS.hideLoginMenu,
        farmerImageUrl: raw.farmerImageUrl || DEFAULT_STORE_SETTINGS.farmerImageUrl,
        googleVerificationTag: raw.googleVerificationTag || '',
      };

      saveStoredSettings(mapped);
      onUpdate(mapped);
    },
    (err) => {
      console.warn('Settings sync snapshot error:', err);
      onError?.(err);
      handleFirestoreError(err, OperationType.GET, 'storeSettings/main');
    }
  );
}

export async function saveStoreSettingsToFirestore(settings: StoreSettings): Promise<void> {
  const path = 'storeSettings/main';
  try {
    const docRef = doc(db, 'storeSettings', 'main');
    const cleanData: Record<string, any> = {
      id: 'main',
      storeName: String(settings.storeName || 'GLOBAL FRESH INDO').slice(0, 100),
      phone: String(settings.whatsappNumber || '6285284633214').slice(0, 30),
      phoneOrders: String(settings.whatsappNumber || '6285284633214').slice(0, 30),
      address: String(settings.address || 'Pasar Induk Caringin, Bandung').slice(0, 300),
      tagline: String(settings.storeTagline || '').slice(0, 200),
      operatingHours: String(settings.operatingHours || '').slice(0, 100),
    };

    if (settings.logoUrl && settings.logoUrl.length <= 450000) {
      cleanData.logoUrl = settings.logoUrl;
    }

    if (settings.farmerImageUrl && settings.farmerImageUrl.length <= 450000) {
      cleanData.farmerImageUrl = settings.farmerImageUrl;
    }

    if (settings.googleVerificationTag !== undefined) {
      cleanData.googleVerificationTag = String(settings.googleVerificationTag).slice(0, 500);
    }

    await setDoc(docRef, cleanData, { merge: true });
  } catch (err) {
    console.warn('Sync store settings to cloud error:', err);
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

// 4. CONSULTATION INQUIRIES (BGN & SPPG)
export async function saveConsultationInquiry(data: {
  schoolName: string;
  contactPerson: string;
  whatsapp: string;
  district?: string;
  studentCount: number;
  portionGrams?: number;
  packageId?: string;
  customRequest?: string;
}): Promise<string> {
  const id = `inquiry_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const path = `consultationInquiries/${id}`;
  try {
    const docRef = doc(db, 'consultationInquiries', id);
    const payload: ConsultationRecord = {
      id,
      schoolName: String(data.schoolName).slice(0, 150),
      contactPerson: String(data.contactPerson).slice(0, 100),
      whatsapp: String(data.whatsapp).slice(0, 30),
      district: data.district ? String(data.district).slice(0, 100) : '',
      studentCount: Math.max(0, Number(data.studentCount || 0)),
      portionGrams: data.portionGrams ? Math.max(0, Number(data.portionGrams)) : 100,
      packageId: data.packageId ? String(data.packageId).slice(0, 80) : '',
      customRequest: data.customRequest ? String(data.customRequest).slice(0, 500) : '',
      status: 'baru',
      createdAt: new Date().toISOString(),
    };

    await setDoc(docRef, payload);
    return id;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}
