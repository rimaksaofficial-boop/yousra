import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { BRAND_ASSETS } from '../data/content';
import { Language } from '../types';

interface LoadingScreenProps {
  lang: Language;
  onFinish?: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ lang, onFinish }) => {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    // Smooth luxury progress animation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Accelerate smoothly
        const increment = Math.max(2, Math.floor((100 - prev) * 0.14));
        return Math.min(100, prev + increment);
      });
    }, 45);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      const timer = setTimeout(() => {
        setIsFadingOut(true);
        const unmountTimer = setTimeout(() => {
          setIsMounted(false);
          if (onFinish) onFinish();
        }, 800);
        return () => clearTimeout(unmountTimer);
      }, 350);

      return () => clearTimeout(timer);
    }
  }, [progress, onFinish]);

  if (!isMounted) return null;

  return (
    <div
      id="luxury-preloader-screen"
      role="status"
      aria-label="Loading Yusra Alkordi Atelier"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FAF7F2] transition-all duration-800 ease-out select-none ${
        isFadingOut ? 'opacity-0 pointer-events-none scale-102 filter blur-xs' : 'opacity-100 scale-100'
      }`}
    >
      {/* Ambient Luxury Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Soft Radial Champagne Light behind Logo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[500px] h-[340px] sm:h-[500px] bg-radial from-[#C9A86A]/20 via-[#5C131F]/5 to-transparent rounded-full blur-3xl animate-pulse" />
        
        {/* Ultra-Delicate Editorial Inset Frame */}
        <div className="absolute inset-4 sm:inset-8 border border-[#C9A86A]/25 rounded-2xl pointer-events-none opacity-80" />
        <div className="absolute inset-5 sm:inset-9 border border-[#5C131F]/10 rounded-xl pointer-events-none" />

        {/* Corner Accents */}
        <div className="absolute top-6 left-6 sm:top-10 sm:left-10 w-3 h-3 border-t-2 border-l-2 border-[#C9A86A]/60" />
        <div className="absolute top-6 right-6 sm:top-10 sm:right-10 w-3 h-3 border-t-2 border-r-2 border-[#C9A86A]/60" />
        <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 w-3 h-3 border-b-2 border-l-2 border-[#C9A86A]/60" />
        <div className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10 w-3 h-3 border-b-2 border-r-2 border-[#C9A86A]/60" />
      </div>

      {/* Main Center Stage */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-md w-full">
        
        {/* Top Mini Brand Monogram / Badge */}
        <div className="inline-flex items-center gap-2 mb-6 px-3.5 py-1 rounded-full bg-[#FAF7F2]/80 border border-[#C9A86A]/35 text-[#5C131F] text-[11px] font-semibold tracking-widest uppercase">
          <Sparkles className="w-3 h-3 text-[#C9A86A] animate-spin" style={{ animationDuration: '4s' }} />
          <span>{lang === 'ar' ? 'يسرا الكردي • الدوحة' : 'YUSRA ALKORDI • DOHA'}</span>
        </div>

        {/* The Transparent Logo with Breathing Glow & Seamless Mask */}
        <div className="relative w-48 sm:w-60 h-36 sm:h-44 flex items-center justify-center mb-6">
          {/* Subtle Backing Halo */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#C9A86A]/25 via-transparent to-[#5C131F]/15 rounded-full blur-xl pointer-events-none transform scale-90 animate-pulse" />
          
          <img
            src={BRAND_ASSETS.logo}
            alt="Yusra Alkordi Official Luxury Logo"
            className="w-full h-full object-contain relative z-10 filter drop-shadow-[0_4px_16px_rgba(92,19,31,0.12)] transition-transform duration-700 ease-out scale-100 hover:scale-105"
            loading="eager"
          />
        </div>

        {/* Brand Name in Arabic Display & Editorial Serif */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#2A050A] tracking-wider mb-2 font-arabic-display">
            {lang === 'ar' ? 'يسرا الكردي' : 'YUSRA ALKORDI'}
          </h1>
          <p className="text-xs sm:text-sm text-[#5C131F]/80 tracking-widest font-editorial uppercase">
            {lang === 'ar'
              ? 'خبيرة جمال ومكياج • تساريح • عرائس'
              : 'Haute Beauty • Makeup Artistry • Bridal'}
          </p>
        </div>

        {/* Ultra-Chic Progress Line */}
        <div className="w-48 sm:w-56 space-y-2">
          <div className="h-[2px] w-full bg-[#5C131F]/15 rounded-full overflow-hidden relative">
            <div
              className="h-full bg-gradient-to-r from-[#C9A86A] via-[#E2C78A] to-[#5C131F] transition-all duration-150 ease-out rounded-full shadow-[0_0_8px_rgba(201,168,106,0.8)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] tracking-widest font-sans-modern text-[#5C131F]/70">
            <span>
              {lang === 'ar' ? 'حيث يلتقي الجمال بالفن' : 'WHERE BEAUTY MEETS ART'}
            </span>
            <span className="font-semibold text-[#5C131F]" dir="ltr">
              {progress}%
            </span>
          </div>
        </div>

        {/* Quick Skip Button */}
        <button
          type="button"
          onClick={() => {
            setIsFadingOut(true);
            setTimeout(() => {
              setIsMounted(false);
              if (onFinish) onFinish();
            }, 300);
          }}
          className="mt-8 text-[11px] text-[#5C131F]/50 hover:text-[#5C131F] transition-colors tracking-wider underline underline-offset-4 cursor-pointer focus:outline-hidden"
        >
          {lang === 'ar' ? 'تخطي' : 'Enter Atelier'}
        </button>

      </div>
    </div>
  );
};
