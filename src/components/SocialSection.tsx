import React from 'react';
import { Sparkles, ArrowUpRight } from 'lucide-react';
import { Language } from '../types';
import { useSiteData } from '../context/SiteDataContext';

interface SocialSectionProps {
  lang: Language;
}

export const SocialSection: React.FC<SocialSectionProps> = ({ lang }) => {
  const { brand } = useSiteData();

  const socials = [
    {
      name: 'Instagram',
      handle: '@yusraalkordi.yk',
      url: brand.instagram,
      // Minimal line SVG for Instagram
      icon: (
        <svg
          className="w-5 h-5 stroke-current fill-none stroke-[1.7]"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      ),
    },
    {
      name: 'TikTok',
      handle: '@yusra.alkordi',
      url: brand.tiktok,
      // Minimal line SVG for TikTok
      icon: (
        <svg
          className="w-5 h-5 stroke-current fill-none stroke-[1.7]"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
        </svg>
      ),
    },
    {
      name: 'Snapchat',
      handle: 'Yusra Alkordi',
      url: brand.snapchat,
      // Minimal line SVG for Snapchat
      icon: (
        <svg
          className="w-5 h-5 stroke-current fill-none stroke-[1.7]"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 2C8 2 6 5 6 8c0 2 .5 3.5 1 4-.5 1-2 1.5-2.5 2 0 1 1.5 1.5 2.5 1.5.5 1-1 2.5-1.5 3.5 1 0 3-.5 4.5-1 1 .5 2 .5 3 0 1.5.5 3.5 1 4.5 1-.5-1-2-2.5-1.5-3.5 1 0 2.5-.5 2.5-1.5-.5-.5-2-1-2.5-2 .5-.5 1-2 1-4 0-3-2-6-6-6z" />
        </svg>
      ),
    },
  ];

  return (
    <section id="social" className="py-20 bg-[#FAF7F2] border-t border-[#5C131F]/10">
      <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center">
        
        <div className="inline-flex items-center gap-2 mb-3 text-xs font-semibold uppercase tracking-widest text-[#5C131F]">
          <Sparkles className="w-3.5 h-3.5 text-[#C9A86A]" />
          <span>{lang === 'ar' ? 'التواصل الاجتماعي' : 'Stay Connected'}</span>
        </div>

        <h2 className={`text-3xl sm:text-4xl font-bold text-[#2A050A] mb-4 ${
          lang === 'ar' ? 'font-arabic' : 'font-editorial font-medium'
        }`}>
          {lang === 'ar' ? 'تابعيني' : 'FOLLOW YUSRA'}
        </h2>

        <p className="text-xs sm:text-sm text-[#4A2027]/75 max-w-md mx-auto mb-10 font-sans-modern">
          {lang === 'ar'
            ? 'شاهدي أحدث كواليس الجلسات والإطلالات الحصرية اليومية عبر منصاتنا الرسمية.'
            : 'Explore behind-the-scenes footage, bridal transformations, and daily beauty insights.'}
        </p>

        {/* Minimal Subtle Social Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {socials.map((item) => (
            <a
              key={item.name}
              id={`social-link-${item.name.toLowerCase()}`}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 rounded-2xl bg-[#FDFBF7] border border-[#5C131F]/12 hover:border-[#5C131F]/40 transition-all duration-300 flex items-center justify-between group cursor-pointer shadow-xs hover:shadow-md text-start"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#5C131F]/5 group-hover:bg-[#5C131F]/10 flex items-center justify-center text-[#5C131F] transition-colors">
                  {item.icon}
                </div>
                <div>
                  <div className="text-sm font-bold text-[#2A050A] font-sans-modern">
                    {item.name}
                  </div>
                  <div className="text-[11px] text-[#5C131F]/70 font-sans-modern" dir="ltr">
                    {item.handle}
                  </div>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-[#5C131F]/50 group-hover:text-[#5C131F] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </a>
          ))}
        </div>

      </div>
    </section>
  );
};
