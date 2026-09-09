import React, { useState, useEffect } from 'react';
import { Menu, X, Calendar, Globe, MessageCircle } from 'lucide-react';
import { Language } from '../types';
import { useSiteData } from '../context/SiteDataContext';

interface HeaderProps {
  lang: Language;
  onToggleLang: () => void;
  onNavigate: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ lang, onToggleLang, onNavigate }) => {
  const { brand } = useSiteData();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = lang === 'ar' ? [
    { id: 'hero', label: 'الرئيسية' },
    { id: 'services', label: 'الخدمات' },
    { id: 'packages', label: 'البكجات' },
    { id: 'bridal', label: 'العرائس' },
    { id: 'booking', label: 'الحجز' },
    { id: 'contact', label: 'التواصل' },
  ] : [
    { id: 'hero', label: 'Home' },
    { id: 'services', label: 'Services' },
    { id: 'packages', label: 'Packages' },
    { id: 'bridal', label: 'Bridal' },
    { id: 'booking', label: 'Booking' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false);
    onNavigate(id);
  };

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-[#FAF7F2]/95 backdrop-blur-md shadow-xs py-3.5 border-b border-[#4A0E17]/10'
          : 'bg-[#FAF7F2]/75 backdrop-blur-xs py-5 border-b border-[#4A0E17]/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          id="header-brand-logo-btn"
          onClick={() => handleNavClick('hero')}
          className="flex items-center gap-3 group focus:outline-hidden text-start"
          aria-label={lang === 'ar' ? 'يسرا الكردي - الرئيسية' : 'Yusra Alkordi - Home'}
        >
          <img
            src={brand.logo}
            alt="Yusra Alkordi Official Logo"
            className="h-11 sm:h-13 w-auto object-contain transition-transform duration-300 group-hover:scale-105 filter drop-shadow-[0_2px_6px_rgba(92,19,31,0.08)]"
            loading="eager"
          />
          <div className="flex flex-col">
            <span className={`font-semibold text-sm sm:text-base tracking-wider text-[#35080E] ${
              lang === 'ar' ? 'font-arabic' : 'font-editorial tracking-widest uppercase text-base sm:text-lg'
            }`}>
              {lang === 'ar' ? 'يسرا الكردي' : 'YUSRA ALKORDI'}
            </span>
            <span className="text-[10px] sm:text-xs text-[#5C131F]/70 tracking-tight font-sans-modern">
              {lang === 'ar' ? 'خبيرة جمال ومكياج • قطر' : 'Beauty Expert • Qatar'}
            </span>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav id="desktop-nav" className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              id={`nav-link-${item.id}`}
              onClick={() => handleNavClick(item.id)}
              className="text-[#35080E]/80 hover:text-[#5C131F] text-sm font-medium tracking-wide transition-colors relative py-1 group cursor-pointer focus:outline-hidden"
            >
              {item.label}
              <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#5C131F] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
            </button>
          ))}
        </nav>

        {/* Desktop Actions (Language Switch + Book CTA) */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Language Switcher */}
          <button
            id="header-lang-switch-btn"
            onClick={onToggleLang}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#4A0E17]/20 text-[#35080E] hover:border-[#5C131F] hover:bg-[#5C131F]/5 text-xs font-medium transition-all cursor-pointer focus:outline-hidden"
            aria-label="Toggle language between Arabic and English"
          >
            <Globe className="w-3.5 h-3.5 text-[#5C131F]" />
            <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
          </button>

          {/* Primary CTA */}
          <button
            id="header-booking-cta-btn"
            onClick={() => handleNavClick('booking')}
            className="px-5 py-2.5 rounded-full bg-[#5C131F] text-[#FAF7F2] hover:bg-[#3D0A13] text-xs sm:text-sm font-medium tracking-wide transition-all shadow-xs hover:shadow-md cursor-pointer flex items-center gap-2 focus:outline-hidden"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'احجزي موعدك' : 'Book Appointment'}</span>
          </button>
        </div>

        {/* Mobile Controls (Lang + Hamburger) */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            id="mobile-lang-switch-btn"
            onClick={onToggleLang}
            className="px-2.5 py-1 rounded-full border border-[#4A0E17]/20 text-[#35080E] text-xs font-medium focus:outline-hidden"
            aria-label="Toggle language"
          >
            {lang === 'ar' ? 'EN' : 'عربي'}
          </button>

          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#35080E] hover:text-[#5C131F] focus:outline-hidden"
            aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-drawer"
          className="lg:hidden fixed inset-x-0 top-full bg-[#FAF7F2] border-b border-[#4A0E17]/15 shadow-xl transition-all duration-300 py-6 px-6 flex flex-col gap-4 animate-in fade-in slide-in-from-top-3"
        >
          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                id={`mobile-nav-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className="py-2.5 px-3 text-start text-[#35080E] hover:bg-[#5C131F]/5 hover:text-[#5C131F] rounded-lg text-base font-medium transition-colors cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-[#4A0E17]/10 flex flex-col gap-3">
            <button
              id="mobile-drawer-book-btn"
              onClick={() => handleNavClick('booking')}
              className="w-full py-3 rounded-full bg-[#5C131F] text-[#FAF7F2] font-medium text-sm flex items-center justify-center gap-2 shadow-xs"
            >
              <Calendar className="w-4 h-4" />
              <span>{lang === 'ar' ? 'احجزي موعدك الآن' : 'Book Your Appointment'}</span>
            </button>

            <a
              id="mobile-drawer-whatsapp-btn"
              href={`https://wa.me/${brand.whatsappRaw}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 rounded-full border border-[#5C131F]/30 text-[#5C131F] font-medium text-xs flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{lang === 'ar' ? 'محادثة واتساب مباشرة' : 'Direct WhatsApp Chat'}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
