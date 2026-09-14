export type Language = 'ar' | 'en';

export interface ServiceItem {
  id: string;
  number: string;
  nameAr: string;
  nameEn: string;
  descAr?: string;
  descEn?: string;
  detailsAr?: string[];
  detailsEn?: string[];
  price: number;
  noteAr?: string;
  noteEn?: string;
  isPopular?: boolean;
}

export interface BridalPackageItem {
  id: string;
  badgeAr?: string;
  badgeEn?: string;
  nameAr: string;
  nameEn: string;
  price: number;
  featuresAr: string[];
  featuresEn: string[];
  isFeatured?: boolean;
  highlightAr?: string;
  highlightEn?: string;
}

export interface BookingFormData {
  serviceId: string;
  serviceNameAr: string;
  serviceNameEn: string;
  date: string; // YYYY-MM-DD
  peopleCount: number;
  location: string;
  customerName: string;
  customerPhone?: string;
  fawranSenderPhone?: string;
  fawranDepositAmount?: string;
  notes?: string;
}

export type BookingStatus = 'new' | 'contacted' | 'confirmed' | 'completed' | 'cancelled';

export interface BookingRecord {
  id: string;
  createdAt: string; // ISO date string
  customerName: string;
  customerPhone?: string;
  serviceId: string;
  serviceName: string;
  price?: number;
  date: string;
  peopleCount: number;
  location: string;
  notes?: string;
  status: BookingStatus;
  sentViaWhatsApp?: boolean;
  fawranSenderPhone?: string;
  fawranDepositAmount?: string;
}

export interface SiteBrandConfig {
  logo: string;
  portrait: string;
  whatsappNumber: string;
  whatsappRaw: string;
  whatsappDisplay: string;
  instagram: string;
  tiktok: string;
  snapchat: string;
}

export interface HeroConfig {
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  quoteAr: string;
  quoteEn: string;
}

export interface AboutConfig {
  headlineAr: string;
  headlineEn: string;
  bio1Ar: string;
  bio1En: string;
  bio2Ar: string;
  bio2En: string;
  experienceYears: number;
  bridesServed: string;
}

export interface SpecialOccasionConfig {
  id: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  price: number;
  highlightsAr: string[];
  highlightsEn: string[];
}

