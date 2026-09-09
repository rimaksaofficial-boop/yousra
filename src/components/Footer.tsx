import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Language } from '../types';
import { useSiteData } from '../context/SiteDataContext';

interface FooterProps {
  lang: Language;
  onNavigate: (sectionId: string) => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ lang, onNavigate }) => {
  const { brand } = useSiteData();

  return (
    <footer id="contact" className="bg-[#240408] text-[#FAF7F2] py-16 border-t border-[#5C131F]/30 relative">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-12 border-b border-[#FAF7F2]/10 text-center md:text-start">
          
          {/* Brand Info */}
          <div className="flex flex-col items-center md:items-start">
            <button
              onClick={() => onNavigate('hero')}
              className="flex items-center gap-3 mb-3 group cursor-pointer focus:outline-hidden"
              aria-label="Yusra Alkordi"
            >
              {/* High-Contrast Luminous Logo for Dark Background */}
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 bg-[#C9A86A]/20 rounded-full blur-md pointer-events-none" />
                <img
                  src={brand.logo}
                  alt="Yusra Alkordi Logo"
                  className="h-12 sm:h-14 w-auto object-contain relative z-10 transition-transform group-hover:scale-105 filter brightness-0 invert opacity-95 group-hover:opacity-100 drop-shadow-[0_0_12px_rgba(255,255,255,0.45)]"
                />
              </div>
              <span className={`text-xl font-bold tracking-wider text-[#FAF7F2] ${
                lang === 'ar' ? 'font-arabic' : 'font-editorial uppercase text-2xl'
              }`}>
                {lang === 'ar' ? 'يسرا الكردي' : 'YUSRA ALKORDI'}
              </span>
            </button>
            <p className="text-xs sm:text-sm text-[#FAF7F2]/70 font-sans-modern">
              {lang === 'ar'
                ? 'خبيرة تجميل ومكياج • تساريح • عرائس • دولة قطر'
                : 'Beauty Expert • Makeup Artist • Bridal Artistry • Qatar'}
            </p>
          </div>

          {/* Direct WhatsApp Contact */}
          <div className="flex flex-col items-center md:items-end">
            <span className="text-xs uppercase tracking-widest text-[#C9A86A] mb-1.5 font-sans-modern">
              {lang === 'ar' ? 'واتساب الحجوزات الرسمي:' : 'Official Booking WhatsApp:'}
            </span>
            <a
              id="footer-whatsapp-link"
              href={`https://wa.me/${brand.whatsappRaw}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-lg sm:text-xl font-bold text-[#FAF7F2] hover:text-[#C9A86A] transition-colors"
              dir="ltr"
            >
              <MessageCircle className="w-5 h-5 text-[#25D366]" />
              <span>{brand.whatsappDisplay}</span>
            </a>
            <span className="text-[11px] text-[#FAF7F2]/50 mt-1 font-sans-modern">
              {lang === 'ar' ? 'جميع الأسعار بالريال القطري (ر.ق)' : 'All prices in Qatari Riyal (QAR)'}
            </span>
          </div>

        </div>

        {/* Bottom Row: Social Icons, Admin Link & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-[#FAF7F2]/70 font-sans-modern text-center md:text-start">
          
          {/* Social Links & Admin Panel trigger */}
          <div className="flex flex-wrap items-center justify-center gap-5">
            <a
              id="footer-social-instagram"
              href={brand.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#C9A86A] transition-colors"
              aria-label="Instagram"
            >
              Instagram
            </a>
            <span className="opacity-30">•</span>
            <a
              id="footer-social-tiktok"
              href={brand.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#C9A86A] transition-colors"
              aria-label="TikTok"
            >
              TikTok
            </a>
            <span className="opacity-30">•</span>
            <a
              id="footer-social-snapchat"
              href={brand.snapchat}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#C9A86A] transition-colors"
              aria-label="Snapchat"
            >
              Snapchat
            </a>
          </div>

          {/* Copyright with clickable SolimanMedia Instagram Link */}
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-1.5 text-xs text-[#FAF7F2]/75">
            <span>© 2026 YUSRA ALKORDI · All Rights Reserved · Designed &amp; Developed by</span>
            <a
              id="footer-designer-link"
              href="https://instagram.com/solimanmedia"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#C9A86A] hover:text-[#FAF7F2] font-semibold underline underline-offset-4 transition-colors cursor-pointer inline-flex items-center gap-1"
            >
              SolimanMedia
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
};
