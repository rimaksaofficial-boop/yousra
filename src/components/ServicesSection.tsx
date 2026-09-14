import React from 'react';
import { Sparkles, ArrowUpRight, Check } from 'lucide-react';
import { Language, ServiceItem } from '../types';
import { useSiteData } from '../context/SiteDataContext';
import { autoTranslateArabicToEnglish } from '../utils/translator';

interface ServicesSectionProps {
  lang: Language;
  onSelectService: (service: ServiceItem) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  lang,
  onSelectService,
}) => {
  const { services } = useSiteData();
  return (
    <section id="services" className="py-24 bg-[#FAF7F2] relative">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 pb-6 border-b border-[#5C131F]/15">
          <div>
            <div className="inline-flex items-center gap-2 mb-2 text-xs font-semibold uppercase tracking-widest text-[#5C131F]">
              <Sparkles className="w-3.5 h-3.5 text-[#C9A86A]" />
              <span>{lang === 'ar' ? 'قائمة الخدمات الفاخرة' : 'Signature Services'}</span>
            </div>
            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold text-[#2A050A] ${
              lang === 'ar' ? 'font-arabic' : 'font-editorial font-medium'
            }`}>
              {lang === 'ar' ? 'الخدمات الأساسية' : 'Curated Services'}
            </h2>
          </div>
          <p className="mt-4 sm:mt-0 text-xs sm:text-sm text-[#5C131F]/80 max-w-xs font-sans-modern">
            {lang === 'ar'
              ? 'الأسعار محددة بالريال القطري (ر.ق). اختاري الخدمة وسيتم تحديدها تلقائياً في نموذج الحجز.'
              : 'All prices are in Qatari Riyal (QAR). Select any service to book directly.'}
          </p>
        </div>

        {/* Editorial Luxury Service Menu List (01 to 04) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {services.map((service) => {
            const isSpecial = service.isPopular;
            return (
              <div
                key={service.id}
                id={`service-card-${service.id}`}
                className={`relative p-8 rounded-2xl transition-all duration-300 flex flex-col justify-between group ${
                  isSpecial
                    ? 'bg-[#F4ECE2] border-2 border-[#5C131F]/30 shadow-md'
                    : 'bg-[#FDFBF7] border border-[#5C131F]/15 hover:border-[#5C131F]/40 shadow-xs hover:shadow-md'
                }`}
              >
                {/* Popular Tag for Service 03 */}
                {isSpecial && (
                  <div className="absolute -top-3.5 left-6 bg-[#5C131F] text-[#FAF7F2] text-[11px] font-medium px-3.5 py-1 rounded-full uppercase tracking-wider shadow-xs">
                    {lang === 'ar' ? 'الأكثر طلباً' : 'Most Requested'}
                  </div>
                )}

                <div>
                  {/* Top Row: Number & Price */}
                  <div className="flex items-baseline justify-between mb-4">
                    <span className="text-sm font-semibold tracking-widest text-[#C9A86A] font-sans-modern">
                      [{service.number}]
                    </span>
                    <div className="text-end">
                      <span className="text-2xl sm:text-3xl font-bold text-[#5C131F] tracking-tight">
                        {service.price}
                      </span>
                      <span className="text-xs sm:text-sm font-medium text-[#5C131F]/75 ms-1.5 font-sans-modern">
                        {lang === 'ar' ? 'ر.ق' : 'QAR'}
                      </span>
                    </div>
                  </div>

                  {/* Service Title */}
                  <h3 className={`text-xl sm:text-2xl font-bold text-[#2A050A] mb-3 group-hover:text-[#5C131F] transition-colors ${
                    lang === 'ar' ? 'font-arabic' : 'font-editorial font-semibold'
                  }`}>
                    {lang === 'ar' ? service.nameAr : (service.nameEn?.trim() || autoTranslateArabicToEnglish(service.nameAr) || service.nameAr)}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-[#4A2027]/80 leading-relaxed mb-6 font-sans-modern">
                    {lang === 'ar' ? service.descAr : (service.descEn?.trim() || (service.descAr ? autoTranslateArabicToEnglish(service.descAr) : '') || service.descAr)}
                  </p>

                  {/* Details Bullet List if available (e.g. Service 03 & 04) */}
                  {(service.detailsAr || service.detailsEn) && (
                    <div className="pt-4 mb-6 border-t border-[#5C131F]/10 space-y-2">
                      {(lang === 'ar' ? service.detailsAr : service.detailsEn)?.map((detail, idx) => (
                        <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm text-[#35080E]/85">
                          <Check className="w-3.5 h-3.5 text-[#5C131F] shrink-0" />
                          <span>{detail}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom Action: Book Now */}
                <div className="pt-4 border-t border-[#5C131F]/10 flex items-center justify-between">
                  <span className="text-xs text-[#5C131F]/70 font-sans-modern">
                    {lang === 'ar' ? 'خدمة حصرية في قطر' : 'Exclusive Service in Qatar'}
                  </span>
                  <button
                    id={`book-service-${service.id}`}
                    onClick={() => onSelectService(service)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#5C131F] text-[#FAF7F2] hover:bg-[#3D0A13] text-xs font-medium tracking-wide transition-all shadow-xs cursor-pointer focus:outline-hidden"
                  >
                    <span>{lang === 'ar' ? 'احجزي الآن' : 'Book Now'}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
