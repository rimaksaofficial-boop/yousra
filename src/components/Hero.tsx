import React from 'react';
import { Sparkles, ArrowDown, Calendar, Compass } from 'lucide-react';
import { Language } from '../types';
import { useSiteData } from '../context/SiteDataContext';

interface HeroProps {
  lang: Language;
  onNavigate: (sectionId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ lang, onNavigate }) => {
  const { hero, brand } = useSiteData();
  return (
    <section
      id="hero"
      className="relative min-h-[92vh] sm:min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden bg-[#FAF7F2]"
    >
      {/* Subtle Editorial Background Elements (Fine Lines, Ambient Glows) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Soft Luxury Wine / Rose Radiance */}
        <div className="absolute -top-32 -right-32 w-[550px] h-[550px] rounded-full bg-[#5C131F]/[0.045] blur-3xl" />
        <div className="absolute bottom-0 -left-32 w-[600px] h-[600px] rounded-full bg-[#C9A86A]/[0.05] blur-3xl" />

        {/* Minimal Architectural Vector Curves / Fine Lines */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.14] stroke-[#5C131F]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M -100,200 C 300,100 600,450 1200,300"
            strokeWidth="0.8"
            strokeDasharray="4 8"
          />
          <path
            d="M 100,700 C 500,600 800,850 1400,650"
            strokeWidth="0.8"
          />
          <circle cx="85%" cy="25%" r="140" strokeWidth="0.5" />
          <circle cx="15%" cy="75%" r="180" strokeWidth="0.5" />
        </svg>

        {/* Minimal subtle border frame for editorial framing */}
        <div className="hidden lg:block absolute inset-8 border border-[#5C131F]/[0.06] pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Typography Column (Desktop 6 or 7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-center text-start order-2 lg:order-1 pt-4 lg:pt-0">
            {/* Editorial Location & Tagline Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#5C131F]/[0.06] border border-[#5C131F]/15 text-[#5C131F] text-xs font-medium w-fit mb-6">
              <Sparkles className="w-3.5 h-3.5 text-[#C9A86A]" />
              <span className="tracking-wide">
                {lang === 'ar' ? 'الدوحة، دولة قطر • خبيرة الجمال والعرائس' : 'Doha, Qatar • Luxury Beauty & Bridal Artistry'}
              </span>
            </div>

            {/* Main Brand Name */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-[#2A050A] leading-[1.15] mb-4">
              {lang === 'ar' ? (
                <span className="font-arabic-display block text-5xl sm:text-6xl lg:text-7xl xl:text-8xl">{hero.titleAr}</span>
              ) : (
                <span className="font-editorial block tracking-wider font-semibold">
                  {hero.titleEn}
                </span>
              )}
            </h1>

            {/* Subtitle */}
            <h2 className="text-lg sm:text-xl lg:text-2xl font-medium text-[#5C131F] tracking-wide mb-6">
              {lang === 'ar' ? (
                <span className="font-arabic-display text-xl sm:text-2xl">{hero.subtitleAr}</span>
              ) : (
                <span className="font-editorial tracking-widest text-[#5C131F] uppercase">
                  {hero.subtitleEn}
                </span>
              )}
            </h2>

            {/* Main Signature Statement */}
            <div className="relative pl-0 pr-0 my-4 py-2">
              <blockquote className={`text-2xl sm:text-3xl lg:text-4xl text-[#3A1016] leading-relaxed italic ${
                lang === 'ar' ? 'font-arabic-display font-medium' : 'font-editorial font-light'
              }`}>
                {lang === 'ar' ? hero.quoteAr : hero.quoteEn}
              </blockquote>
              <div className="w-16 h-[1.5px] bg-[#C9A86A] mt-4 opacity-75" />
            </div>

            {/* Short Supporting Note */}
            <p className="text-[#4A2027]/80 text-sm sm:text-base max-w-xl leading-relaxed mt-2 mb-8 font-sans-modern">
              {lang === 'ar'
                ? 'إطلالات استثنائية مصممة خصيصاً لتبرز سحر ملامحك بأحدث التقنيات وأرقى مستحضرات التجميل العالمية في قطر.'
                : 'Bespoke couture beauty experiences designed to illuminate your unique elegance using the highest standards of international luxury in Qatar.'}
            </p>

            {/* Dual CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Primary CTA: Scrolls to Booking */}
              <button
                id="hero-primary-book-cta"
                onClick={() => onNavigate('booking')}
                className="px-7 py-3.5 rounded-full bg-[#5C131F] text-[#FAF7F2] hover:bg-[#3D0A13] text-sm sm:text-base font-medium tracking-wide transition-all shadow-md hover:shadow-lg flex items-center gap-2.5 group cursor-pointer focus:outline-hidden"
              >
                <Calendar className="w-4 h-4 transition-transform group-hover:scale-110" />
                <span>{lang === 'ar' ? 'احجزي موعدك' : 'Book Your Appointment'}</span>
              </button>

              {/* Secondary CTA: Scrolls to Services */}
              <button
                id="hero-secondary-services-cta"
                onClick={() => onNavigate('services')}
                className="px-7 py-3.5 rounded-full bg-[#FAF7F2] border border-[#5C131F]/30 text-[#35080E] hover:border-[#5C131F] hover:bg-[#5C131F]/5 text-sm sm:text-base font-medium tracking-wide transition-all flex items-center gap-2.5 cursor-pointer focus:outline-hidden"
              >
                <Compass className="w-4 h-4 text-[#5C131F]" />
                <span>{lang === 'ar' ? 'استكشفي الخدمات' : 'Explore Services'}</span>
              </button>
            </div>

            {/* Subtle Currency Reminder Tag */}
            <div className="mt-6 flex items-center gap-2 text-xs text-[#5C131F]/70">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9A86A]" />
              <span>
                {lang === 'ar'
                  ? 'جميع الأسعار المعروضة بالريال القطري (ر.ق)'
                  : 'All prices are in Qatari Riyal (QAR)'}
              </span>
            </div>
          </div>

          {/* Frameless Seamless Blended Portrait Column */}
          <div className="lg:col-span-5 flex flex-col justify-center items-center order-1 lg:order-2">
            <div className="relative w-full max-w-[360px] sm:max-w-[420px] lg:max-w-[460px] aspect-[4/5] flex items-center justify-center">
              
              {/* Soft Ambient Radiance Behind Portrait (Dissolving gently into background) */}
              <div
                className="absolute inset-0 w-[115%] h-[115%] -translate-x-[7.5%] -translate-y-[7.5%] rounded-full bg-gradient-to-tr from-[#C9A86A]/20 via-[#5C131F]/10 to-transparent blur-3xl pointer-events-none"
                aria-hidden="true"
              />

              {/* Portrait with Seamless Multi-gradient Transparency Mask (No frames, No borders) */}
              <div className="relative w-full h-full flex items-center justify-center pointer-events-none select-none">
                <img
                  src={brand.portrait}
                  alt="Yusra Alkordi - Beauty Expert & Makeup Artist"
                  className="w-full h-full object-cover object-top transition-transform duration-700 ease-out hover:scale-103"
                  style={{
                    // Seamless feathered edge & bottom gradient fade into #FAF7F2
                    maskImage: 'radial-gradient(ellipse 82% 80% at 50% 45%, black 45%, rgba(0,0,0,0.85) 60%, rgba(0,0,0,0.2) 80%, transparent 95%), linear-gradient(to bottom, black 65%, rgba(0,0,0,0.5) 82%, transparent 98%)',
                    WebkitMaskImage: 'radial-gradient(ellipse 82% 80% at 50% 45%, black 45%, rgba(0,0,0,0.85) 60%, rgba(0,0,0,0.2) 80%, transparent 95%), linear-gradient(to bottom, black 65%, rgba(0,0,0,0.5) 82%, transparent 98%)',
                    maskComposite: 'intersect',
                    WebkitMaskComposite: 'destination-in',
                  }}
                  loading="eager"
                />

                {/* Additional gentle bottom haze overlay to blend softly into the page background */}
                <div
                  className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#FAF7F2] via-[#FAF7F2]/60 to-transparent pointer-events-none"
                  aria-hidden="true"
                />
              </div>

            </div>

            {/* Subtle Minimalist Signature Caption */}
            <div className="mt-3 flex items-center gap-2 text-xs text-[#5C131F]/70 tracking-widest font-sans-modern">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9A86A]" />
              <span className="uppercase font-semibold">
                {lang === 'ar' ? 'يسرا الكردي • الدوحة، قطر' : 'YUSRA ALKORDI • DOHA, QATAR'}
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Down Scroll Indicator */}
      <button
        onClick={() => onNavigate('about')}
        className="hidden md:flex absolute bottom-4 left-1/2 -translate-x-1/2 flex-col items-center gap-1.5 text-xs text-[#5C131F]/60 hover:text-[#5C131F] transition-colors focus:outline-hidden cursor-pointer"
        aria-label="Scroll to About Section"
      >
        <span className="tracking-widest uppercase text-[10px]">
          {lang === 'ar' ? 'اكتشفي المزيد' : 'Discover'}
        </span>
        <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
      </button>
    </section>
  );
};
