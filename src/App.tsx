import { useState, useEffect } from 'react';
import { Language, ServiceItem, BookingFormData } from './types';
import { SiteDataProvider } from './context/SiteDataContext';
import { LoadingScreen } from './components/LoadingScreen';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { ServicesSection } from './components/ServicesSection';
import { PackagesSection } from './components/PackagesSection';
import { SpecialOccasionsSection } from './components/SpecialOccasionsSection';
import { BridalSection } from './components/BridalSection';
import { MakeupHairServiceSection } from './components/MakeupHairServiceSection';
import { BookingSection } from './components/BookingSection';
import { SocialSection } from './components/SocialSection';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';
import { MobileStickyBar } from './components/MobileStickyBar';
import { AdminPortal } from './components/admin/AdminPortal';
import { generateWhatsAppBookingUrl } from './data/content';

function AppContent() {
  const [lang, setLang] = useState<Language>('ar');
  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname === '/admin' || window.location.hash === '#admin';
    }
    return false;
  });

  // Listen to popstate and hashchange for dedicated /admin and #admin routing
  useEffect(() => {
    const handleRoute = () => {
      const isNowAdmin = window.location.pathname === '/admin' || window.location.hash === '#admin';
      setIsAdminRoute(isNowAdmin);
    };
    window.addEventListener('popstate', handleRoute);
    window.addEventListener('hashchange', handleRoute);
    return () => {
      window.removeEventListener('popstate', handleRoute);
      window.removeEventListener('hashchange', handleRoute);
    };
  }, []);

  const openAdminPortal = () => {
    try {
      window.history.pushState(null, '', '#admin');
    } catch {
      // fallback
    }
    setIsAdminRoute(true);
  };

  const closeAdminPortal = () => {
    try {
      if (window.location.hash === '#admin') {
        window.history.pushState(null, '', window.location.pathname.startsWith('/admin') ? '/' : ' ');
      } else if (window.location.pathname.startsWith('/admin')) {
        window.history.pushState(null, '', '/');
      }
    } catch {
      // fallback
    }
    setIsAdminRoute(false);
  };

  // Initial booking state
  const [formData, setFormData] = useState<BookingFormData>({
    serviceId: 'bridal-diamond',
    serviceNameAr: 'البكج الالماسي (3000 ر.ق)',
    serviceNameEn: 'DIAMOND BRIDAL PACKAGE (3000 QAR)',
    date: '2026-09-15',
    peopleCount: 1,
    location: '',
    customerName: '',
    customerPhone: '',
    fawranSenderPhone: '',
    fawranDepositAmount: '',
  });

  // Keep HTML lang & dir synced dynamically
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    if (isAdminRoute) {
      document.title = lang === 'ar' ? 'لوحة تحكم الأتيليه | يسرا الكردي' : 'Atelier Portal | YUSRA ALKORDI';
    } else {
      if (lang === 'ar') {
        document.title = 'يسرا الكردي | YUSRA ALKORDI — خبيرة جمال ومكياج | قطر';
      } else {
        document.title = 'YUSRA ALKORDI | Luxury Beauty Expert & Makeup Artist — Qatar';
      }
    }
  }, [lang, isAdminRoute]);

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  const scrollToSection = (sectionId: string) => {
    const target = document.getElementById(sectionId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // When a service/package is clicked, update form and scroll to booking
  const handleSelectService = (service: ServiceItem) => {
    setFormData((prev) => ({
      ...prev,
      serviceId: service.id,
      serviceNameAr: `${service.nameAr} (${service.price} ر.ق)`,
      serviceNameEn: `${service.nameEn} (${service.price} QAR)`,
    }));
    scrollToSection('booking');
  };

  // Direct WhatsApp trigger for mobile sticky bar
  const handleDirectWhatsApp = () => {
    const selectedServiceName = lang === 'ar' ? formData.serviceNameAr : formData.serviceNameEn;
    const whatsappUrl = generateWhatsAppBookingUrl({
      serviceName: selectedServiceName,
      formattedDate: formData.date || (lang === 'ar' ? '15 سبتمبر 2026' : 'September 15, 2026'),
      peopleCount: formData.peopleCount,
      location: formData.location || (lang === 'ar' ? 'الدوحة، قطر' : 'Doha, Qatar'),
      customerName: formData.customerName,
      lang: lang,
    });
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  // If user requested the dedicated admin route (/admin or #admin), show dedicated Admin Portal
  if (isAdminRoute) {
    return (
      <AdminPortal
        lang={lang}
        onNavigateHome={closeAdminPortal}
      />
    );
  }

  return (
    <div
      className={`min-h-screen flex flex-col bg-[#FAF7F2] text-[#221013] ${
        lang === 'ar' ? 'font-arabic' : 'font-sans-modern'
      }`}
    >
      {/* Luxury Intro Loading Screen */}
      <LoadingScreen lang={lang} />

      {/* Sticky Header */}
      <Header
        lang={lang}
        onToggleLang={toggleLanguage}
        onNavigate={scrollToSection}
      />

      {/* Main Content Sections */}
      <main className="grow">
        {/* Section 1: Editorial Hero with Yusra's Portrait */}
        <Hero
          lang={lang}
          onNavigate={scrollToSection}
        />

        {/* Section 2: Editorial About Yusra */}
        <AboutSection
          lang={lang}
        />

        {/* Section 3: Curated Services (01 to 04) */}
        <ServicesSection
          lang={lang}
          onSelectService={handleSelectService}
        />

        {/* Section 4: Makeup Packages (01 to 05 + Hairstyling) */}
        <PackagesSection
          lang={lang}
          onSelectPackage={handleSelectService}
        />

        {/* Section 5: Special Occasions (Queen, Henna, Engagement, Reception) */}
        <SpecialOccasionsSection
          lang={lang}
          onSelectService={handleSelectService}
        />

        {/* Section 6: Ultra-Luxury Bridal Section */}
        <BridalSection
          lang={lang}
          onSelectService={handleSelectService}
        />

        {/* Section 7: Dedicated Makeup & Hair Services with Yousra El Kordy (Egypt & Gulf Destinations) */}
        <MakeupHairServiceSection
          lang={lang}
        />

        {/* Section 8: Interactive Booking with Real Date Picker & WhatsApp Generator */}
        <BookingSection
          lang={lang}
          formData={formData}
          setFormData={setFormData}
        />

        {/* Section 8: Minimal Line Social Media Section */}
        <SocialSection
          lang={lang}
        />

        {/* Section 9: Final Invitation Call to Action */}
        <FinalCTA
          lang={lang}
          onNavigateToBooking={() => scrollToSection('booking')}
        />
      </main>

      {/* Section 10: Footer */}
      <Footer
        lang={lang}
        onNavigate={scrollToSection}
      />

      {/* Mobile Subtle Sticky WhatsApp & Booking Bar */}
      <MobileStickyBar
        lang={lang}
        onNavigateToBooking={() => scrollToSection('booking')}
        onDirectWhatsApp={handleDirectWhatsApp}
      />
    </div>
  );
}

export default function App() {
  return (
    <SiteDataProvider>
      <AppContent />
    </SiteDataProvider>
  );
}
