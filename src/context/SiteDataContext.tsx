import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import {
  ServiceItem,
  BridalPackageItem,
  BookingRecord,
  BookingStatus,
  SiteBrandConfig,
  HeroConfig,
  AboutConfig,
  SpecialOccasionConfig,
} from '../types';
import {
  BRAND_ASSETS,
  SERVICES_LIST,
  MAKEUP_PACKAGES_LIST,
  SPECIAL_OCCASION_DATA,
  BRIDAL_PACKAGES_LIST,
  BOOKING_POLICY,
} from '../data/content';
import { db } from '../lib/firebase';
import {
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  collection,
  deleteDoc,
  updateDoc,
} from 'firebase/firestore';

const STORAGE_KEY = 'yusra_alkordi_site_data_v2';

interface SiteDataState {
  brand: SiteBrandConfig;
  hero: HeroConfig;
  about: AboutConfig;
  services: ServiceItem[];
  makeupPackages: ServiceItem[];
  specialOccasion: SpecialOccasionConfig;
  bridalPackages: BridalPackageItem[];
  policies: {
    titleAr: string;
    titleEn: string;
    rulesAr: string[];
    rulesEn: string[];
  };
  bookings: BookingRecord[];
}

const DEFAULT_SITE_DATA: SiteDataState = {
  brand: {
    logo: BRAND_ASSETS.logo,
    portrait: BRAND_ASSETS.portrait,
    whatsappNumber: BRAND_ASSETS.whatsappNumber,
    whatsappRaw: BRAND_ASSETS.whatsappRaw,
    whatsappDisplay: BRAND_ASSETS.whatsappDisplay,
    instagram: BRAND_ASSETS.social.instagram,
    tiktok: BRAND_ASSETS.social.tiktok,
    snapchat: BRAND_ASSETS.social.snapchat,
  },
  hero: {
    titleAr: 'يسرا الكردي',
    titleEn: 'YUSRA ALKORDI',
    subtitleAr: 'خبيرة جمال ومكياج • تساريح • عرائس',
    subtitleEn: 'Beauty Expert • Makeup Artist • Bridal Beauty',
    quoteAr: '« حيث يلتقي الجمال بالفن »',
    quoteEn: '"Where Beauty Meets Art."',
  },
  about: {
    headlineAr: 'فن الجمال الراقي برؤية عصرية استثنائية في قطر',
    headlineEn: 'Refined Beauty Artistry with Modern Elegance in Qatar',
    bio1Ar: 'يسرا الكردي خبيرة جمال ومكياج متخصصة في إبراز الجمال الطبيعي لكل سيدة وعروس بأسلوب ملكي فاخر، يجمع بين الدقة العالية وأرقى مستحضرات التجميل العالمية.',
    bio1En: 'Yusra Alkordi is a visionary beauty expert & makeup artist specialized in highlighting each woman’s innate elegance with royal sophistication, blending mastery with the finest global luxury cosmetics.',
    bio2Ar: 'بخبرة تمتد لسنوات في أرقى المناسبات والعرائس بدولة قطر، نقدم تجربة جمال متكاملة تجمع بين الخصوصية التامة والاحترافية المطلقة.',
    bio2En: 'With years of experience gracing high-profile galas and royal weddings in Qatar, we deliver a seamless beauty experience rooted in absolute privacy and master craftsmanship.',
    experienceYears: 8,
    bridesServed: '+500',
  },
  services: SERVICES_LIST,
  makeupPackages: MAKEUP_PACKAGES_LIST,
  specialOccasion: SPECIAL_OCCASION_DATA,
  bridalPackages: BRIDAL_PACKAGES_LIST,
  policies: BOOKING_POLICY,
  bookings: [
    {
      id: 'BK-1048',
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      customerName: 'نورة الكواري',
      customerPhone: '+974 5512 3456',
      serviceId: 'bridal-diamond',
      serviceName: 'البكج الالماسي - عروس زفاف (3000 ر.ق)',
      price: 3000,
      date: '2026-09-25',
      peopleCount: 2,
      location: 'الدفنة - الدوحة',
      notes: 'حجز عروس مع مرافقة (الوالدة)، مطلوب الحضور الساعة 2 ظهراً.',
      status: 'confirmed',
      sentViaWhatsApp: true,
    },
    {
      id: 'BK-1049',
      createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
      customerName: 'مريم السليطي',
      customerPhone: '+974 6698 7123',
      serviceId: 'svc-03',
      serviceName: '3 - بكج السبشل (1200 ر.ق)',
      price: 1200,
      date: '2026-09-18',
      peopleCount: 1,
      location: 'اللؤلؤة - بورتو أرابيا',
      notes: 'مناسبة عائلية خاصة.',
      status: 'contacted',
      sentViaWhatsApp: true,
    },
    {
      id: 'BK-1050',
      createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
      customerName: 'العنود آل ثاني',
      customerPhone: '+974 3321 8899',
      serviceId: 'special-occasion-all',
      serviceName: 'الملكه، الحناء ،الخطبة ،الاستقبال (2000 ر.ق)',
      price: 2000,
      date: '2026-10-02',
      peopleCount: 1,
      location: 'الوعب - الدوحة',
      notes: 'حفل خطوبة فخم.',
      status: 'new',
      sentViaWhatsApp: true,
    },
  ],
};

interface SiteDataContextType extends SiteDataState {
  // Firebase Live Sync Status
  isFirebaseConnected: boolean;
  isFirebaseSyncing: boolean;
  syncError: string | null;

  // Bookings
  addBookingOrder: (booking: Omit<BookingRecord, 'id' | 'createdAt' | 'status'>) => BookingRecord;
  updateBookingStatus: (id: string, status: BookingStatus) => void;
  deleteBookingOrder: (id: string) => void;

  // Services
  addService: (category: 'services' | 'makeup', item: Omit<ServiceItem, 'id'>) => void;
  updateService: (category: 'services' | 'makeup', item: ServiceItem) => void;
  deleteService: (category: 'services' | 'makeup', id: string) => void;

  // Bridal Packages
  addBridalPackage: (item: Omit<BridalPackageItem, 'id'>) => void;
  updateBridalPackage: (item: BridalPackageItem) => void;
  deleteBridalPackage: (id: string) => void;

  // Special Occasion
  updateSpecialOccasion: (data: Partial<SpecialOccasionConfig>) => void;

  // Brand & Sections
  updateBrand: (brand: Partial<SiteBrandConfig>) => void;
  updateHero: (hero: Partial<HeroConfig>) => void;
  updateAbout: (about: Partial<AboutConfig>) => void;
  updatePolicies: (rulesAr: string[], rulesEn: string[]) => void;

  // Backup & Reset
  resetToDefaults: () => void;
  exportDataJSON: () => string;
  importDataJSON: (jsonStr: string) => boolean;
}

const SiteDataContext = createContext<SiteDataContextType | null>(null);

export const SiteDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(false);
  const [isFirebaseSyncing, setIsFirebaseSyncing] = useState<boolean>(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  const [data, setData] = useState<SiteDataState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_SITE_DATA,
          ...parsed,
          brand: { ...DEFAULT_SITE_DATA.brand, ...(parsed.brand || {}) },
          hero: { ...DEFAULT_SITE_DATA.hero, ...(parsed.hero || {}) },
          about: { ...DEFAULT_SITE_DATA.about, ...(parsed.about || {}) },
          policies: { ...DEFAULT_SITE_DATA.policies, ...(parsed.policies || {}) },
          bookings: parsed.bookings && Array.isArray(parsed.bookings) ? parsed.bookings : DEFAULT_SITE_DATA.bookings,
        };
      }
    } catch (e) {
      console.error('Failed to load saved site data', e);
    }
    return DEFAULT_SITE_DATA;
  });

  // Persist to localStorage whenever data changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to persist site data', e);
    }
  }, [data]);

  // Push partial updates to Firestore safely
  const syncToFirestore = useCallback(async (patch: Partial<SiteDataState>) => {
    try {
      setIsFirebaseSyncing(true);
      const siteDocRef = doc(db, 'yusra_atelier', 'site_content');
      await setDoc(siteDocRef, patch, { merge: true });
      setIsFirebaseConnected(true);
      setSyncError(null);
    } catch (err: any) {
      console.warn('Firestore sync note:', err?.message || err);
      // Keep optimistic UI intact even if rules or network prevent write
      setSyncError(err?.message || 'Database connection notice');
    } finally {
      setIsFirebaseSyncing(false);
    }
  }, []);

  // Real-time Firestore listener for Site Content (Brand, Services, Packages, About, Hero)
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    try {
      const siteDocRef = doc(db, 'yusra_atelier', 'site_content');
      unsubscribe = onSnapshot(
        siteDocRef,
        (snapshot) => {
          setIsFirebaseConnected(true);
          setSyncError(null);
          if (snapshot.exists()) {
            const serverData = snapshot.data() as Partial<SiteDataState>;
            setData((prev) => {
              const merged: SiteDataState = {
                ...prev,
                ...serverData,
                brand: { ...prev.brand, ...(serverData.brand || {}) },
                hero: { ...prev.hero, ...(serverData.hero || {}) },
                about: { ...prev.about, ...(serverData.about || {}) },
                policies: { ...prev.policies, ...(serverData.policies || {}) },
                specialOccasion: { ...prev.specialOccasion, ...(serverData.specialOccasion || {}) },
                services: serverData.services && Array.isArray(serverData.services) ? serverData.services : prev.services,
                makeupPackages: serverData.makeupPackages && Array.isArray(serverData.makeupPackages) ? serverData.makeupPackages : prev.makeupPackages,
                bridalPackages: serverData.bridalPackages && Array.isArray(serverData.bridalPackages) ? serverData.bridalPackages : prev.bridalPackages,
                bookings: serverData.bookings && Array.isArray(serverData.bookings) ? serverData.bookings : prev.bookings,
              };
              return merged;
            });
          } else {
            // First time initialization in fresh Firestore database
            setDoc(siteDocRef, DEFAULT_SITE_DATA, { merge: true }).catch((err) => {
              console.warn('Firestore initial write note:', err?.message);
            });
          }
        },
        (error) => {
          console.warn('Firestore snapshot listener note:', error?.message);
          setIsFirebaseConnected(false);
          setSyncError(error?.message || 'Offline / Connecting');
        }
      );
    } catch (err: any) {
      console.warn('Firebase initialization note:', err?.message);
      setSyncError(err?.message || 'Database initializing');
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Real-time Firestore listener for Bookings Collection
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    try {
      const bookingsCol = collection(db, 'yusra_bookings');
      unsubscribe = onSnapshot(
        bookingsCol,
        (snapshot) => {
          if (!snapshot.empty) {
            const remoteBookings: BookingRecord[] = [];
            snapshot.forEach((docSnap) => {
              remoteBookings.push(docSnap.data() as BookingRecord);
            });
            remoteBookings.sort(
              (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            setData((prev) => ({
              ...prev,
              bookings: remoteBookings,
            }));
          } else {
            // Seed initial bookings collection in Firestore if empty
            DEFAULT_SITE_DATA.bookings.forEach((bk) => {
              setDoc(doc(db, 'yusra_bookings', bk.id), bk).catch(() => {});
            });
          }
        },
        (err) => {
          console.warn('Bookings listener note:', err?.message);
        }
      );
    } catch (err: any) {
      console.warn('Bookings collection error:', err?.message);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Bookings Methods
  const addBookingOrder = (booking: Omit<BookingRecord, 'id' | 'createdAt' | 'status'>): BookingRecord => {
    const newRecord: BookingRecord = {
      ...booking,
      id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      status: 'new',
      sentViaWhatsApp: true,
    };

    setData((prev) => ({
      ...prev,
      bookings: [newRecord, ...prev.bookings],
    }));

    // Direct Firestore persistence
    try {
      setDoc(doc(db, 'yusra_bookings', newRecord.id), newRecord).catch((err) => {
        console.warn('Direct booking write note:', err?.message);
      });
      syncToFirestore({ bookings: [newRecord, ...data.bookings] });
    } catch (err: any) {
      console.warn('Booking write exception:', err?.message);
    }

    return newRecord;
  };

  const updateBookingStatus = (id: string, status: BookingStatus) => {
    const updatedBookings = data.bookings.map((b) => (b.id === id ? { ...b, status } : b));
    setData((prev) => ({
      ...prev,
      bookings: updatedBookings,
    }));

    try {
      updateDoc(doc(db, 'yusra_bookings', id), { status }).catch(() => {
        const found = updatedBookings.find((b) => b.id === id);
        if (found) setDoc(doc(db, 'yusra_bookings', id), found);
      });
      syncToFirestore({ bookings: updatedBookings });
    } catch (err: any) {
      console.warn('Firestore status update note:', err?.message);
    }
  };

  const deleteBookingOrder = (id: string) => {
    const remaining = data.bookings.filter((b) => b.id !== id);
    setData((prev) => ({
      ...prev,
      bookings: remaining,
    }));

    try {
      deleteDoc(doc(db, 'yusra_bookings', id)).catch((err) => {
        console.warn('Firestore delete note:', err?.message);
      });
      syncToFirestore({ bookings: remaining });
    } catch (err: any) {
      console.warn('Firestore delete exception:', err?.message);
    }
  };

  // Services Methods
  const addService = (category: 'services' | 'makeup', item: Omit<ServiceItem, 'id'>) => {
    const newService: ServiceItem = {
      ...item,
      id: `custom-svc-${Date.now()}`,
    };

    setData((prev) => {
      if (category === 'services') {
        const nextList = [...prev.services, newService];
        syncToFirestore({ services: nextList });
        return { ...prev, services: nextList };
      } else {
        const nextList = [...prev.makeupPackages, newService];
        syncToFirestore({ makeupPackages: nextList });
        return { ...prev, makeupPackages: nextList };
      }
    });
  };

  const updateService = (category: 'services' | 'makeup', item: ServiceItem) => {
    setData((prev) => {
      if (category === 'services') {
        const nextList = prev.services.map((s) => (s.id === item.id ? item : s));
        syncToFirestore({ services: nextList });
        return { ...prev, services: nextList };
      } else {
        const nextList = prev.makeupPackages.map((s) => (s.id === item.id ? item : s));
        syncToFirestore({ makeupPackages: nextList });
        return { ...prev, makeupPackages: nextList };
      }
    });
  };

  const deleteService = (category: 'services' | 'makeup', id: string) => {
    setData((prev) => {
      if (category === 'services') {
        const nextList = prev.services.filter((s) => s.id !== id);
        syncToFirestore({ services: nextList });
        return { ...prev, services: nextList };
      } else {
        const nextList = prev.makeupPackages.filter((s) => s.id !== id);
        syncToFirestore({ makeupPackages: nextList });
        return { ...prev, makeupPackages: nextList };
      }
    });
  };

  // Bridal Packages Methods
  const addBridalPackage = (item: Omit<BridalPackageItem, 'id'>) => {
    const newPkg: BridalPackageItem = {
      ...item,
      id: `bridal-${Date.now()}`,
    };
    setData((prev) => {
      const nextList = [...prev.bridalPackages, newPkg];
      syncToFirestore({ bridalPackages: nextList });
      return { ...prev, bridalPackages: nextList };
    });
  };

  const updateBridalPackage = (item: BridalPackageItem) => {
    setData((prev) => {
      const nextList = prev.bridalPackages.map((p) => (p.id === item.id ? item : p));
      syncToFirestore({ bridalPackages: nextList });
      return { ...prev, bridalPackages: nextList };
    });
  };

  const deleteBridalPackage = (id: string) => {
    setData((prev) => {
      const nextList = prev.bridalPackages.filter((p) => p.id !== id);
      syncToFirestore({ bridalPackages: nextList });
      return { ...prev, bridalPackages: nextList };
    });
  };

  // Special Occasion Method
  const updateSpecialOccasion = (patch: Partial<SpecialOccasionConfig>) => {
    setData((prev) => {
      const nextConfig = { ...prev.specialOccasion, ...patch };
      syncToFirestore({ specialOccasion: nextConfig });
      return { ...prev, specialOccasion: nextConfig };
    });
  };

  // Brand & Sections Updates
  const updateBrand = (patch: Partial<SiteBrandConfig>) => {
    setData((prev) => {
      const nextBrand = { ...prev.brand, ...patch };
      syncToFirestore({ brand: nextBrand });
      return { ...prev, brand: nextBrand };
    });
  };

  const updateHero = (patch: Partial<HeroConfig>) => {
    setData((prev) => {
      const nextHero = { ...prev.hero, ...patch };
      syncToFirestore({ hero: nextHero });
      return { ...prev, hero: nextHero };
    });
  };

  const updateAbout = (patch: Partial<AboutConfig>) => {
    setData((prev) => {
      const nextAbout = { ...prev.about, ...patch };
      syncToFirestore({ about: nextAbout });
      return { ...prev, about: nextAbout };
    });
  };

  const updatePolicies = (rulesAr: string[], rulesEn: string[]) => {
    setData((prev) => {
      const nextPolicies = {
        ...prev.policies,
        rulesAr,
        rulesEn,
      };
      syncToFirestore({ policies: nextPolicies });
      return { ...prev, policies: nextPolicies };
    });
  };

  // Reset & Backup
  const resetToDefaults = () => {
    setData(DEFAULT_SITE_DATA);
    localStorage.removeItem(STORAGE_KEY);
    syncToFirestore(DEFAULT_SITE_DATA);
  };

  const exportDataJSON = () => {
    return JSON.stringify(data, null, 2);
  };

  const importDataJSON = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed && typeof parsed === 'object') {
        setData((prev) => {
          const merged = {
            ...prev,
            ...parsed,
          };
          syncToFirestore(merged);
          return merged;
        });
        return true;
      }
    } catch (e) {
      console.error('Import failed', e);
    }
    return false;
  };

  return (
    <SiteDataContext.Provider
      value={{
        ...data,
        isFirebaseConnected,
        isFirebaseSyncing,
        syncError,
        addBookingOrder,
        updateBookingStatus,
        deleteBookingOrder,
        addService,
        updateService,
        deleteService,
        addBridalPackage,
        updateBridalPackage,
        deleteBridalPackage,
        updateSpecialOccasion,
        updateBrand,
        updateHero,
        updateAbout,
        updatePolicies,
        resetToDefaults,
        exportDataJSON,
        importDataJSON,
      }}
    >
      {children}
    </SiteDataContext.Provider>
  );
};

export const useSiteData = () => {
  const context = useContext(SiteDataContext);
  if (!context) {
    throw new Error('useSiteData must be used within a SiteDataProvider');
  }
  return context;
};
