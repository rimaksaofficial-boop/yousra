import React from 'react';
import { Crown, Sparkles, HeartHandshake, Eye } from 'lucide-react';
import { Language } from '../types';
import { useSiteData } from '../context/SiteDataContext';

interface AboutSectionProps {
  lang: Language;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ lang }) => {
  const { about } = useSiteData();

  const pillars = lang === 'ar' ? [
    {
      icon: Crown,
      title: 'إطلالات العرائس الملكية',
      desc: 'عناية متكاملة لليلة العمر تجمع بين الفخامة والنعومة وثبات يدوم طوال الحفل.',
    },
    {
      icon: Sparkles,
      title: 'مكياج مخصص للملامح',
      desc: 'دراسة دقيقة لتفاصيل الوجه وإبراز الجمال الطبيعي بأحدث صيحات التجميل العالمية.',
    },
    {
      icon: HeartHandshake,
      title: 'تساريح شعر احترافية',
      desc: 'ابتكار تساريح كلاسيكية وعصرية متقنة تلائم فستانك وروح مناسبتك الخاصة.',
    },
    {
      icon: Eye,
      title: 'أدق التفاصيل واللمسات',
      desc: 'اهتمام فائق بنقاء البشرة، التغطيات المخملية، والإضاءات المتناغمة لنتائج ساحرة.',
    },
  ] : [
    {
      icon: Crown,
      title: 'Royal Bridal Artistry',
      desc: 'Exquisite bridal curation for your most treasured day, ensuring enduring radiance.',
    },
    {
      icon: Sparkles,
      title: 'Personalized Contouring',
      desc: 'Harmonious beauty tailored to complement your facial architecture and natural glow.',
    },
    {
      icon: HeartHandshake,
      title: 'Couture Hair Styling',
      desc: 'Artisanal classic and contemporary hairstyles created to match your silhouette.',
    },
    {
      icon: Eye,
      title: 'Meticulous Precision',
      desc: 'Obsession with velvet skin coverage, balanced highlights, and bespoke luxury results.',
    },
  ];

  return (
    <section id="about" className="py-24 bg-[#F8F5F0] border-t border-b border-[#5C131F]/10 relative">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 text-center">
        {/* Subtle Section Tag */}
        <div className="inline-flex items-center gap-2 mb-4 text-xs font-semibold uppercase tracking-widest text-[#5C131F]/80">
          <span className="w-6 h-[1px] bg-[#5C131F]/30" />
          <span>{lang === 'ar' ? 'عالم يسرا الكردي' : 'Yusra Alkordi Atelier'}</span>
          <span className="w-6 h-[1px] bg-[#5C131F]/30" />
        </div>

        {/* Section Heading */}
        <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold text-[#2A050A] mb-8 leading-tight ${
          lang === 'ar' ? 'font-arabic' : 'font-editorial font-medium'
        }`}>
          {lang === 'ar' ? (about.headlineAr || 'فن الجمال يبدأ بالتفاصيل') : (about.headlineEn || 'Beauty Begins With The Details')}
        </h2>

        {/* Short Editorial Paragraph */}
        <p className="text-base sm:text-lg md:text-xl text-[#4A2027]/85 max-w-3xl mx-auto leading-relaxed mb-16 font-sans-modern">
          {lang === 'ar'
            ? `${about.bio1Ar} ${about.bio2Ar ? ' ' + about.bio2Ar : ''}`
            : `${about.bio1En} ${about.bio2En ? ' ' + about.bio2En : ''}`}
        </p>

        {/* 4 Minimal Pillars (Whitespace & Typography driven) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-start">
          {pillars.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#5C131F]/10 hover:border-[#5C131F]/25 transition-all duration-300 group"
              >
                <div className="w-11 h-11 rounded-xl bg-[#5C131F]/5 group-hover:bg-[#5C131F]/10 flex items-center justify-center text-[#5C131F] mb-4 transition-colors">
                  <Icon className="w-5 h-5 text-[#5C131F]" />
                </div>
                <h3 className={`text-base font-semibold text-[#2A050A] mb-2 ${
                  lang === 'ar' ? 'font-arabic' : 'font-editorial text-lg'
                }`}>
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#4A2027]/75 leading-relaxed font-sans-modern">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
