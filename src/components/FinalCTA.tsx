import React from 'react';
import { Calendar, Sparkles } from 'lucide-react';
import { Language } from '../types';

interface FinalCTAProps {
  lang: Language;
  onNavigateToBooking: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ lang, onNavigateToBooking }) => {
  return (
    <section id="final-cta" className="py-24 bg-[#35080E] text-[#FAF7F2] relative overflow-hidden text-center">
      {/* Subtle Glows */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#C9A86A]/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(#FAF7F2_0.5px,transparent_0.5px)] [background-size:24px_24px] opacity-5" />
      </div>

      <div className="max-w-3xl mx-auto px-5 sm:px-8 relative z-10">
        <div className="inline-flex items-center gap-2 mb-4 px-3.5 py-1 rounded-full bg-[#FAF7F2]/10 border border-[#C9A86A]/30 text-[#C9A86A] text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5 text-[#C9A86A]" />
          <span>{lang === 'ar' ? 'ابدأي تجربتك' : 'Experience Elegance'}</span>
        </div>

        <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-5 ${
          lang === 'ar' ? 'font-arabic leading-snug' : 'font-editorial font-medium'
        }`}>
          {lang === 'ar' ? 'جاهزة لإطلالتك؟' : 'READY FOR YOUR LOOK?'}
        </h2>

        <p className="text-base sm:text-lg text-[#FAF7F2]/80 leading-relaxed max-w-xl mx-auto mb-10 font-sans-modern">
          {lang === 'ar'
            ? 'دعينا نصنع لكِ إطلالة تليق بكِ.'
            : 'Let’s create a look that feels uniquely yours.'}
        </p>

        <button
          id="final-cta-booking-btn"
          onClick={onNavigateToBooking}
          className="px-8 py-4 rounded-full bg-gradient-to-r from-[#C9A86A] to-[#DFBA73] text-[#2A050A] hover:opacity-95 text-sm sm:text-base font-semibold tracking-wide transition-all shadow-xl shadow-[#C9A86A]/15 inline-flex items-center gap-2.5 cursor-pointer focus:outline-hidden"
        >
          <Calendar className="w-4 h-4" />
          <span>{lang === 'ar' ? 'احجزي موعدك' : 'Book Your Appointment'}</span>
        </button>

        <div className="mt-8 text-xs text-[#FAF7F2]/60 font-sans-modern">
          {lang === 'ar'
            ? 'تواصل مباشر وسريع عبر تطبيق واتساب الرسمي'
            : 'Instant direct booking via official WhatsApp service'}
        </div>
      </div>
    </section>
  );
};
