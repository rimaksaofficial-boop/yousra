import React, { useState } from 'react';
import {
  Sparkles,
  Crown,
  Calendar,
  MapPin,
  Users,
  CheckCircle2,
  ArrowUpRight,
  Heart,
  Globe2,
  AlertCircle,
  Scissors,
  Check,
} from 'lucide-react';
import { Language, MakeupHairServiceType } from '../types';
import { MAKEUP_HAIR_SERVICE_INFO, DESTINATION_COUNTRIES } from '../data/content';
import { MakeupHairBookingModal } from './MakeupHairBookingModal';

interface MakeupHairServiceSectionProps {
  lang: Language;
}

export const MakeupHairServiceSection: React.FC<MakeupHairServiceSectionProps> = ({ lang }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInitialService, setSelectedInitialService] = useState<MakeupHairServiceType>('makeup_and_hair');

  const handleOpenBooking = (type: MakeupHairServiceType = 'makeup_and_hair') => {
    setSelectedInitialService(type);
    setIsModalOpen(true);
  };

  return (
    <section
      id="makeup-hair-service"
      className="py-24 sm:py-28 bg-[#FAF7F2] relative overflow-hidden"
    >
      {/* Subtle Editorial Background Lights */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#C9A86A]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-0 w-80 h-80 bg-[#5C131F]/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-5 sm:px-8 relative z-10">
        {/* Section Pill Badge & Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#5C131F]/5 border border-[#C9A86A]/40 text-[#5C131F] text-xs font-semibold mb-4 shadow-2xs">
            <Globe2 className="w-3.5 h-3.5 text-[#C9A86A]" />
            <span className="tracking-widest uppercase">
              {lang === 'ar' ? 'خدمة إقليمية راقية • دول الخليج العربي' : 'Exclusive Bespoke Service • Gulf Destinations'}
            </span>
          </div>

          <h2
            className={`text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#2A050A] mb-5 leading-tight ${
              lang === 'ar' ? 'font-arabic' : 'font-editorial font-medium'
            }`}
          >
            {lang === 'ar' ? MAKEUP_HAIR_SERVICE_INFO.titleAr : MAKEUP_HAIR_SERVICE_INFO.titleEn}
          </h2>

          <p className="text-sm sm:text-base text-[#5C131F]/80 leading-relaxed font-sans-modern max-w-2xl mx-auto">
            {lang === 'ar'
              ? 'خدمات ميكب وشعر حصرية ومخصصة تقدمها خبيرة التجميل يسرا الكردي لعرائس ومناسبات الدول الخليجية، مع عناية ملكية متكاملة للعروس وكافة أفراد عائلتها ومرافقاتها.'
              : 'Exclusive bespoke bridal and event hair & makeup services curated by beauty artist Yousra El Kordy across Gulf destinations, with couture dedication to the bride, family, and bridesmaids.'}
          </p>

          {/* Supported Destinations Flags Ribbon */}
          <div className="mt-7 flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
            <span className="text-xs font-bold text-[#5C131F] me-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#C9A86A]" />
              <span>{lang === 'ar' ? 'متاحة للحجز في:' : 'Available in:'}</span>
            </span>
            {DESTINATION_COUNTRIES.map((c) => (
              <span
                key={c.id}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#C9A86A]/40 text-xs font-semibold text-[#2A050A] shadow-2xs"
              >
                <span>{c.flag}</span>
                <span>{lang === 'ar' ? c.nameAr : c.nameEn}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Pricing Notice Highlight Banner (Single clean informative banner, no repeated button) */}
        <div className="mb-14 max-w-4xl mx-auto rounded-2xl bg-gradient-to-r from-[#FAF0DD] via-[#FFFDF9] to-[#FAF0DD] border border-[#C9A86A]/70 p-4 sm:p-5 shadow-xs flex items-center justify-center text-center">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#5C131F] text-[#C9A86A] flex items-center justify-center shrink-0 shadow-2xs">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div className="text-start">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#5C131F] block">
                {lang === 'ar' ? 'تسعير الخدمة' : 'Service Pricing'}
              </span>
              <p className="text-sm sm:text-base font-bold text-[#2A050A]">
                {lang === 'ar'
                  ? MAKEUP_HAIR_SERVICE_INFO.pricingNoticeAr
                  : MAKEUP_HAIR_SERVICE_INFO.pricingNoticeEn}
              </p>
            </div>
          </div>
        </div>

        {/* Offerings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {MAKEUP_HAIR_SERVICE_INFO.offerings.map((offering, idx) => {
            const isBridesmaids = offering.id === 'bridesmaids_family';
            const isFullPrep = offering.id === 'full_bridal_prep';

            return (
              <div
                key={offering.id}
                id={`offering-card-${offering.id}`}
                className={`relative rounded-3xl p-7 transition-all duration-300 flex flex-col justify-between group ${
                  isBridesmaids
                    ? 'md:col-span-2 lg:col-span-2 bg-gradient-to-br from-[#FFFDF9] via-[#FAF6EE] to-[#F5ECE0] border-2 border-[#C9A86A] shadow-md'
                    : isFullPrep
                    ? 'bg-gradient-to-b from-[#3D0A13] via-[#480E18] to-[#2E070D] text-[#FAF7F2] border border-[#C9A86A]/50 shadow-xl'
                    : 'bg-white border border-[#5C131F]/15 hover:border-[#5C131F]/40 shadow-xs hover:shadow-md'
                }`}
              >
                {/* Special Tag for Full Prep or Bridesmaids */}
                {isBridesmaids && (
                  <div className="inline-flex items-center gap-1.5 mb-4 text-xs font-extrabold text-[#5C131F] bg-[#FAF0DD] border border-[#C9A86A]/50 px-3 py-1 rounded-full w-fit">
                    <Users className="w-3.5 h-3.5 text-[#5C131F]" />
                    <span>{lang === 'ar' ? 'إطلالة متناسقة وأنيقة للقروب' : 'Coordinated Bridal Party Styling'}</span>
                  </div>
                )}

                {isFullPrep && (
                  <div className="inline-flex items-center gap-1.5 mb-4 text-xs font-bold text-[#C9A86A] bg-white/10 border border-[#C9A86A]/40 px-3 py-1 rounded-full w-fit">
                    <Crown className="w-3.5 h-3.5 text-[#C9A86A]" />
                    <span>{lang === 'ar' ? 'البكج الأكمل للعروس' : 'Full Royal Bridal Atelier'}</span>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-xs font-mono font-bold tracking-wider ${
                        isFullPrep ? 'text-[#C9A86A]' : 'text-[#C9A86A]'
                      }`}
                    >
                      [0{idx + 1}]
                    </span>
                    <span
                      className={`text-[11px] uppercase tracking-wider font-semibold ${
                        isFullPrep ? 'text-[#FAF7F2]/60' : 'text-[#5C131F]/70'
                      }`}
                    >
                      {lang === 'ar' ? 'خدمة مخصصة' : 'Bespoke'}
                    </span>
                  </div>

                  <h3
                    className={`text-xl font-bold mb-3 ${
                      isFullPrep
                        ? 'text-[#FAF7F2]'
                        : 'text-[#2A050A] group-hover:text-[#5C131F]'
                    } transition-colors ${
                      lang === 'ar' ? 'font-arabic' : 'font-editorial font-semibold'
                    }`}
                  >
                    {lang === 'ar' ? offering.nameAr : offering.nameEn}
                  </h3>

                  <p
                    className={`text-xs sm:text-sm leading-relaxed font-sans-modern mb-4 ${
                      isFullPrep ? 'text-[#FAF7F2]/80' : 'text-[#4A2027]/80'
                    }`}
                  >
                    {lang === 'ar' ? offering.descAr : offering.descEn}
                  </p>
                </div>

                <div className="pt-3 border-t border-black/5 flex items-center justify-between">
                  <span
                    className={`text-xs font-bold flex items-center gap-1.5 ${
                      isFullPrep ? 'text-[#C9A86A]' : 'text-[#5C131F]'
                    }`}
                  >
                    <Globe2 className="w-3.5 h-3.5" />
                    <span>{lang === 'ar' ? 'متاح بدول الخليج' : 'Available in Gulf'}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* The ONLY One Booking CTA Button */}
        <div className="text-center pt-4">
          <button
            id="makeup-hair-service-main-cta"
            type="button"
            onClick={() => handleOpenBooking('makeup_and_hair')}
            className="inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-4 rounded-2xl bg-gradient-to-r from-[#5C131F] via-[#6F1725] to-[#450E17] hover:from-[#470F18] hover:to-[#350A12] text-[#FAF7F2] font-bold text-base shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group border border-[#C9A86A]/40"
          >
            <Crown className="w-5 h-5 text-[#C9A86A] group-hover:scale-110 transition-transform" />
            <span>{lang === 'ar' ? 'احجزي خدمتك الآن' : 'Book Your Service'}</span>
            <ArrowUpRight className="w-4 h-4 text-[#C9A86A]" />
          </button>
          <p className="text-xs text-neutral-500 mt-2.5 font-sans-modern">
            {lang === 'ar'
              ? 'تواصلي مباشرة مع يسرا الكردي عبر واتساب لتحديد الأسعار والتاريخ المطلوب'
              : 'Direct communication with Yousra El Kordy via WhatsApp to confirm pricing and date'}
          </p>
        </div>
      </div>

      {/* Booking Form Modal */}
      <MakeupHairBookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        lang={lang}
        initialServiceType={selectedInitialService}
      />
    </section>
  );
};
