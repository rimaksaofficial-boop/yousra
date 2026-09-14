/**
 * Yusra Alkordi Beauty Atelier - Real-time Arabic to English Translation Engine
 * Specially curated for beauty, makeup, salon, bridal, and luxury salon terminology.
 */

// Beauty & Salon phrase and term dictionary
const DICTIONARY: Record<string, string> = {
  // Makeup & Styling
  'ميكب': 'Makeup',
  'مكياج': 'Makeup',
  'ميك اب': 'Makeup',
  'ميك أب': 'Makeup',
  'تسريحة': 'Hairstyle',
  'تسريحه': 'Hairstyle',
  'تسريحة شعر': 'Hair Styling',
  'تسريحه شعر': 'Hair Styling',
  'تساريح': 'Hairstyles',
  'شعر': 'Hair',
  'استشوار': 'Blowdry',
  'ويفي': 'Wavy Style',
  'ريترو': 'Retro Glam',
  'بف': 'Volume Buff',
  'رفع': 'Updo',
  'نص رفعة': 'Half Updo',
  'نص رفعه': 'Half Updo',
  'كيرلي': 'Curly Style',
  'ستريت': 'Straight Hair',
  'شعر قصير': 'Short Hair',
  'شعر متوسط': 'Medium Hair',
  'شعر طويل': 'Long Hair',

  // Occasions & Brides
  'عروس': 'Bride',
  'عرائس': 'Bridal',
  'عرايس': 'Bridal',
  'زفاف': 'Wedding',
  'عروس زفاف': 'Wedding Bride',
  'ملكه': 'Engagement (Malka)',
  'ملكة': 'Engagement (Malka)',
  'حنا': 'Henna Night',
  'حناء': 'Henna Night',
  'خطوبة': 'Engagement',
  'خطوبه': 'Engagement',
  'استقبال': 'Reception',
  'صباحية': 'Morning Reception',
  'صباحيه': 'Morning Reception',
  'سهرة': 'Evening Glam',
  'سهره': 'Evening Glam',
  'مناسبات': 'Special Occasions',
  'مناسبة': 'Special Occasion',
  'حفلة': 'Party Glam',
  'حفله': 'Party Glam',

  // Glam Styles
  'سمبل': 'Simple Soft',
  'ناعم': 'Soft & Natural',
  'سبشل': 'Special Glam',
  'خاص': 'Special Exclusive',
  'vip': 'VIP Prestige',
  'ملكي': 'Royal Luxe',
  'الملكي': 'The Royal',
  'ذهبي': 'Golden',
  'الذهبي': 'The Golden',
  'الماسي': 'Diamond',
  'ألماسي': 'Diamond',
  'الالماسي': 'The Diamond',
  'الألماسي': 'The Diamond',
  'فضي': 'Silver',
  'الفضي': 'The Silver',
  'سينمائي': 'Cinematic Glam',
  'كلاسيك': 'Classic Glam',
  'عصري': 'Modern Chic',
  'فخم': 'Ultra Luxury',
  'راقي': 'High Elegance',

  // Elements & Services
  'رموش': 'Lashes',
  'رموش حبة حبة': 'Individual Lashes',
  'رموش كاملة': 'Full Strip Lashes',
  'عدسات': 'Luxury Lenses',
  'طرحة': 'Veil',
  'طرحه': 'Veil',
  'تلبيس طرحة': 'Veil Placement & Styling',
  'تلبيس طرحه': 'Veil Placement & Styling',
  'تركيب طرحة': 'Veil Installation',
  'تركيب طرحه': 'Veil Installation',
  'تاج': 'Crown Placement',
  'تغطيات جسم': 'Body Glow Coverage',
  'تغطية جسم': 'Body Coverage',
  'تغطيات': 'Body Coverages',
  'هايلايت': 'Body Highlight & Radiance',
  'تنظيف بشرة': 'Deep Skin Cleansing',
  'تنظيف بشره': 'Deep Skin Cleansing',
  'عناية بالبشرة': 'Skincare Prep',
  'عنايه بالبشره': 'Skincare Prep',
  'مرافقة': 'Companion Glam',
  'مرافقه': 'Companion Glam',
  'مرافقات': 'Companions Glam',
  'أم العروس': 'Mother of the Bride',
  'اخت العروس': 'Sister of the Bride',
  'أخت العروس': 'Sister of the Bride',

  // Modifiers & Terms
  'فقط': 'Only',
  'مع': 'With',
  'شامل': 'Including',
  'بدون': 'Without',
  'جروبات فقط': 'Groups Only',
  'جروبات': 'Groups',
  'باقة': 'Package',
  'باقه': 'Package',
  'بكج': 'Package',
  'بكجات': 'Packages',
  'خدمة': 'Service',
  'خدمه': 'Service',
  'خدمات': 'Services',
  'عرض': 'Special Offer',
  'سعر': 'Price',
  'ريال': 'QAR',
  'قطري': 'Qatari',
  'قطر': 'Qatar',
  'الدوحة': 'Doha',
  'الدوحه': 'Doha',
  'حجز': 'Booking',
  'مسبق': 'Advance',
  'جديد': 'New',
  'حصري': 'Exclusive',
  'مجانا': 'Complimentary Free',
  'مجاناً': 'Complimentary Free',
};

// Common multi-word phrases for direct fast lookup
const PHRASE_MATCHES: [RegExp, string][] = [
  [/ميكب\s*فقط/gi, 'Makeup Only'],
  [/مكياج\s*فقط/gi, 'Makeup Only'],
  [/ميكب\s*وتسريح[ةه]/gi, 'Makeup & Hair Styling'],
  [/مكياج\s*وتسريح[ةه]/gi, 'Makeup & Hair Styling'],
  [/ميكب\s*سمبل/gi, 'Soft / Simple Makeup'],
  [/مكياج\s*سمبل/gi, 'Soft / Simple Makeup'],
  [/ميكب\s*سبشل/gi, 'Special Glam Makeup'],
  [/مكياج\s*سبشل/gi, 'Special Glam Makeup'],
  [/ميكب\s*vip/gi, 'VIP Prestige Makeup'],
  [/ميكب\s*عروس\s*مع\s*عدسات/gi, 'Bridal Makeup with Lenses'],
  [/مكياج\s*عروس\s*مع\s*عدسات/gi, 'Bridal Makeup with Lenses'],
  [/ملك[ةه]\s*-\s*حنا[ء]?\s*-\s*خطوب[ةه]/gi, 'Royal Malka, Henna & Engagement'],
  [/ملك[ةه]\s*حنا[ء]?\s*خطوب[ةه]/gi, 'Malka, Henna & Engagement'],
  [/تساريح\s*شعر/gi, 'Hair Styling & Updos'],
  [/تسريح[ةه]\s*شعر/gi, 'Hair Styling'],
  [/البكج\s*الذهب[يى]/gi, 'Golden Bridal Package'],
  [/البكج\s*الألماس[يى]|البكج\s*الالماس[يى]/gi, 'Diamond Bridal Package'],
  [/عروس\s*زفاف/gi, 'Royal Wedding Bride'],
  [/جروبات\s*فقط/gi, 'Groups Only'],
  [/تنظيف\s*بشر[ةه]/gi, 'Facial Skincare Prep'],
  [/تلبيس\s*طرح[ةه]/gi, 'Veil Placement'],
  [/تغطيات\s*جسم\s*وهايلايت/gi, 'Body Coverage & Glow'],
];

// Arabic letter transliteration for unknown proper nouns
const ARABIC_TO_LATIN: Record<string, string> = {
  'ا': 'a', 'أ': 'a', 'إ': 'e', 'آ': 'aa', 'ب': 'b', 'ت': 't', 'ث': 'th',
  'ج': 'j', 'ح': 'h', 'خ': 'kh', 'د': 'd', 'ذ': 'dh', 'ر': 'r', 'ز': 'z',
  'س': 's', 'ش': 'sh', 'ص': 's', 'ض': 'd', 'ط': 't', 'ظ': 'z', 'ع': 'a',
  'غ': 'gh', 'ف': 'f', 'ق': 'q', 'ك': 'k', 'ل': 'l', 'م': 'm', 'ن': 'n',
  'ه': 'h', 'و': 'w', 'ي': 'y', 'ى': 'a', 'ة': 'a', 'ء': '', 'ئ': 'e', 'ؤ': 'o',
};

/**
 * Translates an Arabic text string into an elegant English representation.
 * Prioritizes beauty/salon terminology and contextual meaning.
 */
export function autoTranslateArabicToEnglish(input: string | undefined | null): string {
  if (!input || !input.trim()) return '';

  let text = input.trim();

  // 1. Check direct dictionary match (case-insensitive)
  const normalized = text.toLowerCase().replace(/[ـ]/g, '');
  if (DICTIONARY[normalized]) {
    return DICTIONARY[normalized];
  }

  // 2. Check phrase patterns
  let translated = text;
  for (const [regex, replacement] of PHRASE_MATCHES) {
    if (regex.test(translated)) {
      translated = translated.replace(regex, replacement);
    }
  }

  // If entire string was replaced by phrase matches and has no Arabic characters left
  if (!/[\u0600-\u06FF]/.test(translated)) {
    return capitalizeWords(translated);
  }

  // 3. Tokenize by separators (: , - / + | and spaces)
  const tokens = translated.split(/([:\-–+/,|&()]\s*|\s+)/);
  const resultTokens = tokens.map((token) => {
    const cleanToken = token.trim();
    if (!cleanToken) return token;

    // Check if token matches punctuation
    if (/^[:\-–+/,|&()]+$/.test(cleanToken)) {
      return ` ${cleanToken} `;
    }

    // Direct dictionary lookup
    const lowerToken = cleanToken.toLowerCase();
    if (DICTIONARY[lowerToken]) {
      return DICTIONARY[lowerToken];
    }

    // Try without definite article 'ال'
    if (lowerToken.startsWith('ال') && lowerToken.length > 3) {
      const stripped = lowerToken.slice(2);
      if (DICTIONARY[stripped]) {
        return `The ${DICTIONARY[stripped]}`;
      }
    }

    // Try without prefix 'و' (and)
    if (lowerToken.startsWith('و') && lowerToken.length > 2) {
      const stripped = lowerToken.slice(1);
      if (DICTIONARY[stripped]) {
        return `& ${DICTIONARY[stripped]}`;
      }
    }

    // Numbers (Arabic numerals to Western)
    if (/^[٠-٩]+$/.test(cleanToken)) {
      return cleanToken.replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)));
    }

    // If English already, keep it
    if (/^[a-zA-Z0-9'"`._\s-]+$/.test(cleanToken)) {
      return cleanToken;
    }

    // Fallback: Transliterate word phonetically
    return transliterateArabicWord(cleanToken);
  });

  const finalStr = resultTokens
    .join('')
    .replace(/\s{2,}/g, ' ')
    .replace(/\s*([:\-–+/,|&])\s*/g, ' $1 ')
    .trim();

  return capitalizeWords(finalStr);
}

function transliterateArabicWord(word: string): string {
  let res = '';
  for (let i = 0; i < word.length; i++) {
    const char = word[i];
    res += ARABIC_TO_LATIN[char] || char;
  }
  return res ? res.charAt(0).toUpperCase() + res.slice(1) : word;
}

function capitalizeWords(str: string): string {
  return str
    .split(' ')
    .map((w) => {
      if (['&', 'and', 'with', 'in', 'of', 'for', 'the', 'only', 'to'].includes(w.toLowerCase())) {
        return w.toLowerCase();
      }
      return w.charAt(0).toUpperCase() + w.slice(1);
    })
    .join(' ');
}
