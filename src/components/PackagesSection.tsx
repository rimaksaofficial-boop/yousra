import React from 'react';
import { ArrowUpRight, Users, Sparkles } from 'lucide-react';
import { Language, ServiceItem } from '../types';
import { useSiteData } from '../context/SiteDataContext';
import { autoTranslateArabicToEnglish } from '../utils/translator';

interface PackagesSectionProps {
  lang: Language;
  onSelectPackage: (pkg: ServiceItem) => void;
}

export const PackagesSection: React.FC<PackagesSectionProps> = ({
  lang,
  onSelectPackage,
}) => {
  const { makeupPackages } = useSiteData();
  return (
    <section id="packages" className="py-24 bg-[#F8F5F0] border-t border-[#5C131F]/10 relative">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 mb-3 text-xs font-semibold uppercase tracking-widest text-[#5C131F]">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A86A]" />
            <span>{lang === 'ar' ? 'تشكيلة متكاملة' : 'Bespoke Collections'}</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold text-[#2A050A] mb-4 ${
            lang === 'ar' ? 'font-arabic' : 'font-editorial font-medium'
          }`}>
            {lang === 'ar' ? 'بكجات الميكب' : 'MAKEUP PACKAGES'}
          </h2>
          <p className="text-sm sm:text-base text-[#4A2027]/80 font-sans-modern">
            {lang === 'ar'
              ? 'خيارات متنوعة مصممة بعناية لمختلف المناسبات والسهرات، بأسعار معلنة بالريال القطري.'
              : 'Thoughtfully curated tiers suited for intimate gatherings, grand galas, and individual moments in Qatari Riyal.'}
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {makeupPackages.map((pkg) => {
            const hasGroupNote = Boolean(pkg.noteAr || pkg.noteEn);
            return (
              <div
                key={pkg.id}
                id={`package-card-${pkg.id}`}
                className="bg-[#FAF7F2] p-7 rounded-2xl border border-[#5C131F]/12 hover:border-[#5C131F]/35 transition-all duration-300 flex flex-col justify-between group shadow-xs hover:shadow-md"
              >
                <div>
                  {/* Top: Number & Tag */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold tracking-widest text-[#C9A86A] font-sans-modern">
                      {pkg.number}
                    </span>
                    {hasGroupNote && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#5C131F]/8 text-[#5C131F] text-[11px] font-medium font-sans-modern">
                        <Users className="w-3 h-3" />
                        <span>{lang === 'ar' ? pkg.noteAr : (pkg.noteEn?.trim() || autoTranslateArabicToEnglish(pkg.noteAr))}</span>
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className={`text-lg sm:text-xl font-bold text-[#2A050A] mb-2 group-hover:text-[#5C131F] transition-colors ${
                    lang === 'ar' ? 'font-arabic' : 'font-editorial font-semibold'
                  }`}>
                    {lang === 'ar' ? pkg.nameAr : (pkg.nameEn?.trim() || autoTranslateArabicToEnglish(pkg.nameAr) || pkg.nameAr)}
                  </h3>

                  {/* Short Description */}
                  <p className="text-xs sm:text-sm text-[#4A2027]/75 leading-relaxed mb-6 font-sans-modern">
                    {lang === 'ar' ? pkg.descAr : (pkg.descEn?.trim() || (pkg.descAr ? autoTranslateArabicToEnglish(pkg.descAr) : '') || pkg.descAr)}
                  </p>
                </div>

                {/* Price & Book Button */}
                <div className="pt-4 border-t border-[#5C131F]/10 flex items-center justify-between">
                  <div>
                    <span className="text-xl sm:text-2xl font-bold text-[#5C131F]">
                      {pkg.id === 'pkg-hair' ? '300 – 500' : pkg.price}
                    </span>
                    <span className="text-xs text-[#5C131F]/80 ms-1 font-sans-modern">
                      {lang === 'ar' ? 'ر.ق' : 'QAR'}
                    </span>
                  </div>

                  <button
                    id={`book-package-${pkg.id}`}
                    onClick={() => onSelectPackage(pkg)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#5C131F] text-[#FAF7F2] hover:bg-[#3D0A13] text-xs font-medium transition-all shadow-xs cursor-pointer focus:outline-hidden"
                  >
                    <span>{lang === 'ar' ? 'احجزي الآن' : 'Book Now'}</span>
                    <ArrowUpRight className="w-3 h-3" />
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
