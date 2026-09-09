import React from 'react';
import { Sparkles, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { Language, ServiceItem } from '../types';
import { useSiteData } from '../context/SiteDataContext';

interface SpecialOccasionsSectionProps {
  lang: Language;
  onSelectService: (service: ServiceItem) => void;
}

export const SpecialOccasionsSection: React.FC<SpecialOccasionsSectionProps> = ({
  lang,
  onSelectService,
}) => {
  const { specialOccasion } = useSiteData();

  const handleBook = () => {
    onSelectService({
      id: specialOccasion.id,
      number: 'SP',
      nameAr: specialOccasion.titleAr,
      nameEn: specialOccasion.titleEn,
      descAr: specialOccasion.descAr,
      descEn: specialOccasion.descEn,
      price: specialOccasion.price,
    });
  };

  return (
    <section id="occasions" className="py-20 bg-[#FAF7F2] relative">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#420D15] via-[#52111B] to-[#30080E] text-[#FAF7F2] p-8 sm:p-12 lg:p-14 shadow-xl border border-[#C9A86A]/30">
          {/* Subtle Ambient Shapes */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#C9A86A]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#5C131F]/40 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left/Main Column */}
            <div className="lg:col-span-8 text-start">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FAF7F2]/10 border border-[#C9A86A]/40 text-[#FAF7F2] text-xs font-medium mb-4">
                <Sparkles className="w-3.5 h-3.5 text-[#C9A86A]" />
                <span className="tracking-widest uppercase">
                  {lang === 'ar' ? 'مناسبات مميزة وفاخرة' : 'Signature Milestones'}
                </span>
              </div>

              <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#FAF7F2] mb-4 ${
                lang === 'ar' ? 'font-arabic leading-snug' : 'font-editorial font-medium'
              }`}>
                {lang === 'ar' ? specialOccasion.titleAr : specialOccasion.titleEn}
              </h2>

              <p className="text-sm sm:text-base text-[#FAF7F2]/80 leading-relaxed mb-8 max-w-xl font-sans-modern">
                {lang === 'ar' ? specialOccasion.descAr : specialOccasion.descEn}
              </p>

              {/* Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {(lang === 'ar' ? specialOccasion.highlightsAr : specialOccasion.highlightsEn).map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm text-[#FAF7F2]/90">
                    <CheckCircle2 className="w-4 h-4 text-[#C9A86A] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right/Price & Booking Column */}
            <div className="lg:col-span-4 flex flex-col items-center lg:items-end justify-center pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-s border-[#FAF7F2]/15 lg:ps-8">
              <span className="text-xs uppercase tracking-widest text-[#FAF7F2]/60 mb-1 font-sans-modern">
                {lang === 'ar' ? 'السعر الشامل' : 'Package Price'}
              </span>
              
              <div className="flex items-baseline gap-1.5 mb-6">
                <span className="text-4xl sm:text-5xl font-bold text-[#FAF7F2] tracking-tight">
                  {specialOccasion.price}
                </span>
                <span className="text-sm font-medium text-[#C9A86A] font-sans-modern">
                  {lang === 'ar' ? 'ر.ق' : 'QAR'}
                </span>
              </div>

              <button
                id="book-special-occasions-btn"
                onClick={handleBook}
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#FAF7F2] text-[#30080E] hover:bg-[#FAF7F2]/90 text-sm font-semibold tracking-wide transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer focus:outline-hidden"
              >
                <span>{lang === 'ar' ? 'احجزي الآن' : 'Book Now'}</span>
                <ArrowUpRight className="w-4 h-4 text-[#5C131F]" />
              </button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
