import React from 'react';
import { MessageCircle, Calendar } from 'lucide-react';
import { Language } from '../types';

interface MobileStickyBarProps {
  lang: Language;
  onNavigateToBooking: () => void;
  onDirectWhatsApp: () => void;
}

export const MobileStickyBar: React.FC<MobileStickyBarProps> = ({
  lang,
  onNavigateToBooking,
  onDirectWhatsApp,
}) => {
  return (
    <div
      id="mobile-sticky-cta-bar"
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-t border-[#5C131F]/15 p-3 px-4 shadow-lg flex items-center justify-between gap-3"
    >
      {/* Quick Booking Scroll Button */}
      <button
        id="mobile-sticky-book-btn"
        onClick={onNavigateToBooking}
        className="flex-1 py-2.5 px-3 rounded-full bg-[#5C131F] text-[#FAF7F2] text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs"
      >
        <Calendar className="w-3.5 h-3.5 text-[#C9A86A]" />
        <span>{lang === 'ar' ? 'احجزي موعدك' : 'Book Appointment'}</span>
      </button>

      {/* Direct WhatsApp CTA */}
      <button
        id="mobile-sticky-whatsapp-btn"
        onClick={onDirectWhatsApp}
        className="flex-1 py-2.5 px-3 rounded-full bg-[#F3ECE2] border border-[#5C131F]/20 text-[#30080E] hover:bg-[#EADBC8] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
      >
        <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
        <span>{lang === 'ar' ? 'احجزي عبر واتساب' : 'Book via WhatsApp'}</span>
      </button>
    </div>
  );
};
