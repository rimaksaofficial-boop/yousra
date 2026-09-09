import React from 'react';
import { Crown, Sparkles, Check, ArrowUpRight, Gift } from 'lucide-react';
import { Language, ServiceItem, BridalPackageItem } from '../types';
import { useSiteData } from '../context/SiteDataContext';

interface BridalSectionProps {
  lang: Language;
  onSelectService: (service: ServiceItem) => void;
}

export const BridalSection: React.FC<BridalSectionProps> = ({
  lang,
  onSelectService,
}) => {
  const { bridalPackages } = useSiteData();

  const handleSelect = (pkg: BridalPackageItem) => {
    onSelectService({
      id: pkg.id,
      number: 'BR',
      nameAr: pkg.nameAr,
      nameEn: pkg.nameEn,
      descAr: pkg.featuresAr.join(' • '),
      descEn: pkg.featuresEn.join(' • '),
      price: pkg.price,
    });
  };

  return (
    <section id="bridal" className="py-28 bg-[#2A050A] text-[#FAF7F2] relative overflow-hidden">
      {/* Editorial Luxury Ambient Lighting */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute -top-40 right-1/4 w-96 h-96 bg-[#5C131F]/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-1/4 w-[450px] h-[450px] bg-[#C9A86A]/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(#C9A86A_0.6px,transparent_0.6px)] [background-size:28px_28px] opacity-10" />
      </div>

      <div className="max-w-6xl mx-auto px-5 sm:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAF7F2]/10 border border-[#C9A86A]/30 text-[#C9A86A] text-xs font-medium mb-4">
            <Crown className="w-3.5 h-3.5 text-[#C9A86A]" />
            <span className="tracking-widest uppercase">
              {lang === 'ar' ? 'فخامة ليلة العمر' : 'Royal Bridal Atelier'}
            </span>
          </div>

          <h2 className={`text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#FAF7F2] mb-5 ${
            lang === 'ar' ? 'font-arabic' : 'font-editorial font-medium'
          }`}>
            {lang === 'ar' ? 'عروس زفاف' : 'WEDDING BRIDE'}
          </h2>

          <p className="text-sm sm:text-base text-[#FAF7F2]/75 leading-relaxed font-sans-modern">
            {lang === 'ar'
              ? 'بكجات عرائس ملكية صممت بكل حب واحترافية لتمنحك إطلالة أسطورية لا تُنسى في يوم زفافك الكبير بدولة قطر.'
              : 'Masterfully orchestrated bridal beauty packages crafted to unveil your timeless radiance on your most cherished day in Qatar.'}
          </p>
        </div>

        {/* 2 Bridal Cards: Golden vs Diamond */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-stretch">
          {bridalPackages.map((pkg) => {
            const isDiamond = pkg.isFeatured;

            return (
              <div
                key={pkg.id}
                id={`bridal-card-${pkg.id}`}
                className={`relative rounded-3xl p-8 sm:p-10 flex flex-col justify-between transition-all duration-300 ${
                  isDiamond
                    ? 'bg-gradient-to-b from-[#3D0A13] via-[#480E18] to-[#2E070D] border-2 border-[#C9A86A] shadow-2xl shadow-[#C9A86A]/10'
                    : 'bg-[#35080E]/70 border border-[#FAF7F2]/15 hover:border-[#FAF7F2]/30 shadow-lg'
                }`}
              >
                {/* Special Diamond Badge */}
                {isDiamond && (
                  <div className="absolute -top-4 left-8 bg-gradient-to-r from-[#C9A86A] to-[#E3C58B] text-[#2A050A] text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-md">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{lang === 'ar' ? 'البكج الأرقى والأكثر تميزاً' : 'The Signature Prestige Tier'}</span>
                  </div>
                )}

                <div>
                  {/* Category Pill */}
                  <span className="text-xs uppercase tracking-widest text-[#C9A86A] font-semibold mb-3 block font-sans-modern">
                    {lang === 'ar' ? pkg.badgeAr : pkg.badgeEn}
                  </span>

                  {/* Title */}
                  <h3 className={`text-2xl sm:text-3xl font-bold text-[#FAF7F2] mb-4 ${
                    lang === 'ar' ? 'font-arabic' : 'font-editorial font-medium'
                  }`}>
                    {lang === 'ar' ? pkg.nameAr : pkg.nameEn}
                  </h3>

                  {/* Price */}
                  <div className="flex items-baseline gap-2 mb-8 pb-6 border-b border-[#FAF7F2]/10">
                    <span className="text-4xl sm:text-5xl font-bold text-[#FAF7F2] tracking-tight">
                      {pkg.price}
                    </span>
                    <span className="text-sm font-medium text-[#C9A86A] font-sans-modern">
                      {lang === 'ar' ? 'ر.ق (ريال قطري)' : 'QAR (Qatari Riyal)'}
                    </span>
                  </div>

                  {/* Highlight Box if Diamond */}
                  {isDiamond && pkg.highlightAr && (
                    <div className="mb-6 p-4 rounded-xl bg-[#FAF7F2]/10 border border-[#C9A86A]/40 flex items-center gap-3">
                      <Gift className="w-5 h-5 text-[#C9A86A] shrink-0" />
                      <div className="text-xs sm:text-sm font-semibold text-[#FAF7F2]">
                        {lang === 'ar' ? pkg.highlightAr : pkg.highlightEn}
                      </div>
                    </div>
                  )}

                  {/* Features List */}
                  <div className="space-y-3.5 mb-10">
                    {(lang === 'ar' ? pkg.featuresAr : pkg.featuresEn).map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className={`mt-0.5 rounded-full p-0.5 shrink-0 ${
                          isDiamond ? 'bg-[#C9A86A] text-[#2A050A]' : 'bg-[#FAF7F2]/20 text-[#FAF7F2]'
                        }`}>
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-sm text-[#FAF7F2]/90 leading-relaxed font-sans-modern">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Booking Button */}
                <div className="pt-6 border-t border-[#FAF7F2]/10">
                  <button
                    id={`book-bridal-${pkg.id}`}
                    onClick={() => handleSelect(pkg)}
                    className={`w-full py-3.5 rounded-full text-sm font-semibold tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer focus:outline-hidden ${
                      isDiamond
                        ? 'bg-gradient-to-r from-[#C9A86A] to-[#DFBA73] text-[#2A050A] hover:opacity-95 shadow-lg shadow-[#C9A86A]/20'
                        : 'bg-[#FAF7F2] text-[#35080E] hover:bg-[#FAF7F2]/90'
                    }`}
                  >
                    <span>{lang === 'ar' ? 'احجزي هذا البكج الملكي' : 'Book This Royal Package'}</span>
                    <ArrowUpRight className="w-4 h-4" />
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
