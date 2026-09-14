import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  Users,
  MapPin,
  User,
  Sparkles,
  Info,
  ChevronDown,
  MessageCircle,
  CreditCard,
  Copy,
  Check,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import { Language, BookingFormData } from '../types';
import { generateWhatsAppBookingUrl, FAWRAN_CONFIG } from '../data/content';
import { useSiteData } from '../context/SiteDataContext';
import { autoTranslateArabicToEnglish } from '../utils/translator';

interface BookingSectionProps {
  lang: Language;
  formData: BookingFormData;
  setFormData: React.Dispatch<React.SetStateAction<BookingFormData>>;
}

const ARABIC_MONTHS = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
];

const ENGLISH_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const BookingSection: React.FC<BookingSectionProps> = ({
  lang,
  formData,
  setFormData,
}) => {
  const {
    services,
    makeupPackages,
    bridalPackages,
    specialOccasion,
    policies,
    addBookingOrder,
    brand,
  } = useSiteData();

  const [formError, setFormError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<'wallet' | 'name' | null>(null);

  const handleCopy = (text: string, key: 'wallet' | 'name') => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(text);
        setCopiedKey(key);
        setTimeout(() => setCopiedKey(null), 2500);
      }
    } catch (err) {
      console.warn('Clipboard copy error:', err);
    }
  };

  // Combine all available services dynamically from SiteDataContext
  const allServicesOptions = useMemo(() => {
    const list: { id: string; nameAr: string; nameEn: string; price: number; priceText: string }[] = [];

    // Bridal Packages
    bridalPackages.forEach((b) => {
      const bEn = b.nameEn?.trim() || autoTranslateArabicToEnglish(b.nameAr) || b.nameAr;
      list.push({
        id: b.id,
        nameAr: `عرائس: ${b.nameAr} (${b.price} ر.ق)`,
        nameEn: `Bridal: ${bEn} (${b.price} QAR)`,
        price: b.price,
        priceText: `${b.price} ${lang === 'ar' ? 'ر.ق' : 'QAR'}`,
      });
    });

    // Special Occasion
    const spEn = specialOccasion.titleEn?.trim() || autoTranslateArabicToEnglish(specialOccasion.titleAr) || specialOccasion.titleAr;
    list.push({
      id: specialOccasion.id || 'special-occasion-all',
      nameAr: `${specialOccasion.titleAr} (${specialOccasion.price} ر.ق)`,
      nameEn: `${spEn} (${specialOccasion.price} QAR)`,
      price: specialOccasion.price,
      priceText: `${specialOccasion.price} ${lang === 'ar' ? 'ر.ق' : 'QAR'}`,
    });

    // Core Services
    services.forEach((s) => {
      const sEn = s.nameEn?.trim() || autoTranslateArabicToEnglish(s.nameAr) || s.nameAr;
      list.push({
        id: s.id,
        nameAr: `${s.nameAr} (${s.price} ر.ق)`,
        nameEn: `${sEn} (${s.price} QAR)`,
        price: s.price,
        priceText: `${s.price} ${lang === 'ar' ? 'ر.ق' : 'QAR'}`,
      });
    });

    // Makeup Packages
    makeupPackages.forEach((p) => {
      const priceVal = p.id === 'pkg-hair' ? '300-500' : `${p.price}`;
      const pEn = p.nameEn?.trim() || autoTranslateArabicToEnglish(p.nameAr) || p.nameAr;
      list.push({
        id: p.id,
        nameAr: `بكج: ${p.nameAr} (${priceVal} ر.ق)`,
        nameEn: `Package: ${pEn} (${priceVal} QAR)`,
        price: p.price,
        priceText: `${priceVal} ${lang === 'ar' ? 'ر.ق' : 'QAR'}`,
      });
    });

    return list;
  }, [services, makeupPackages, bridalPackages, specialOccasion, lang]);

  // Handle Date breakdown (Day, Month, Year)
  const currentDateObj = useMemo(() => {
    if (!formData.date) return null;
    const parts = formData.date.split('-');
    if (parts.length !== 3) return null;
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    const d = parseInt(parts[2], 10);
    return { year: y, month: m, day: d };
  }, [formData.date]);

  // Formatted date string (e.g., "15 سبتمبر 2026" / "September 15, 2026")
  const formattedDateDisplay = useMemo(() => {
    if (!currentDateObj) return lang === 'ar' ? 'يرجى اختيار التاريخ' : 'Please select date';
    const { year, month, day } = currentDateObj;
    if (lang === 'ar') {
      const monthName = ARABIC_MONTHS[month] || '';
      return `${day} ${monthName} ${year}`;
    } else {
      const monthName = ENGLISH_MONTHS[month] || '';
      return `${monthName} ${day}, ${year}`;
    }
  }, [currentDateObj, lang]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, date: e.target.value }));
    if (formError) setFormError(null);
  };

  const handleSelectServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const found = allServicesOptions.find((item) => item.id === selectedId);
    if (found) {
      setFormData((prev) => ({
        ...prev,
        serviceId: found.id,
        serviceNameAr: found.nameAr,
        serviceNameEn: found.nameEn,
      }));
    }
    if (formError) setFormError(null);
  };

  const handlePeopleSelect = (num: number) => {
    setFormData((prev) => ({ ...prev, peopleCount: num }));
  };

  const handleInitiateWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName.trim()) {
      setFormError(lang === 'ar' ? 'يرجى كتابة الاسم لإتمام الحجز' : 'Please provide your booking name');
      return;
    }
    if (!formData.date) {
      setFormError(lang === 'ar' ? 'يرجى اختيار تاريخ الموعد' : 'Please select an appointment date');
      return;
    }
    if (!formData.location.trim()) {
      setFormError(lang === 'ar' ? 'يرجى تحديد المكان أو المنطقة في قطر' : 'Please specify location in Qatar');
      return;
    }

    setFormError(null);

    const selectedServiceName = lang === 'ar'
      ? (formData.serviceNameAr || 'البكج الالماسي')
      : (formData.serviceNameEn || 'Diamond Bridal Package');

    const matchedOption = allServicesOptions.find((o) => o.id === formData.serviceId);
    const servicePrice = matchedOption?.price || 0;

    // Log the booking in the Admin Dashboard automatically!
    addBookingOrder({
      customerName: formData.customerName.trim(),
      customerPhone: formData.customerPhone || '',
      serviceId: formData.serviceId,
      serviceName: selectedServiceName,
      price: servicePrice,
      date: formData.date,
      peopleCount: formData.peopleCount,
      location: formData.location || (lang === 'ar' ? 'الدوحة، قطر' : 'Doha, Qatar'),
      notes: formData.notes || '',
      sentViaWhatsApp: true,
      fawranSenderPhone: formData.fawranSenderPhone?.trim() || '',
      fawranDepositAmount: formData.fawranDepositAmount?.trim() || '',
    });

    const whatsappUrl = generateWhatsAppBookingUrl({
      serviceName: selectedServiceName,
      formattedDate: formattedDateDisplay,
      peopleCount: formData.peopleCount,
      location: formData.location || (lang === 'ar' ? 'الدوحة، قطر' : 'Doha, Qatar'),
      customerName: formData.customerName,
      customerPhone: formData.customerPhone,
      fawranSenderPhone: formData.fawranSenderPhone,
      fawranDepositAmount: formData.fawranDepositAmount,
      rawWhatsAppNumber: brand.whatsappRaw,
      lang: lang,
    });

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="booking" className="py-24 bg-[#FAF7F2] relative scroll-mt-20">
      <div className="max-w-4xl mx-auto px-5 sm:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 mb-3 text-xs font-semibold uppercase tracking-widest text-[#5C131F]">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A86A]" />
            <span>{lang === 'ar' ? 'خدمة حجز سهلة ومباشرة' : 'Effortless Reservation'}</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold text-[#2A050A] mb-4 ${
            lang === 'ar' ? 'font-arabic' : 'font-editorial font-medium'
          }`}>
            {lang === 'ar' ? 'احجزي موعدك' : 'BOOK YOUR APPOINTMENT'}
          </h2>
          <p className="text-sm text-[#4A2027]/80 font-sans-modern">
            {lang === 'ar'
              ? 'املأي البيانات أدناه وسيتم تحويلك مباشرة إلى محادثة واتساب الرسمية مع يسرا الكردي لتأكيد التوفر والحجز.'
              : 'Complete the details below to open a pre-filled WhatsApp conversation with Yusra Alkordi to confirm availability.'}
          </p>
        </div>

        {/* Main Form Container */}
        <div className="bg-[#FDFBF7] rounded-3xl p-6 sm:p-10 border border-[#5C131F]/15 shadow-xl shadow-[#35080E]/5">
          <form onSubmit={handleInitiateWhatsApp} className="space-y-6">
            
            {/* Field 1: Service / Package Selection */}
            <div>
              <label
                htmlFor="booking-service-select"
                className="block text-xs sm:text-sm font-semibold text-[#2A050A] mb-2 font-sans-modern"
              >
                {lang === 'ar' ? '1. الخدمة / البكج' : '1. Service / Package'}
              </label>
              <div className="relative">
                <select
                  id="booking-service-select"
                  value={formData.serviceId}
                  onChange={handleSelectServiceChange}
                  className="w-full bg-[#FAF7F2] border border-[#5C131F]/20 rounded-xl px-4 py-3.5 text-sm text-[#2A050A] appearance-none focus:outline-hidden focus:border-[#5C131F] focus:ring-1 focus:ring-[#5C131F] transition-all font-sans-modern cursor-pointer"
                >
                  {allServicesOptions.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {lang === 'ar' ? opt.nameAr : opt.nameEn}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-[#5C131F] absolute end-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Field 2: Real Date Picker with Day / Month / Year display */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="booking-date-input"
                  className="text-xs sm:text-sm font-semibold text-[#2A050A] font-sans-modern flex items-center gap-1.5"
                >
                  <CalendarIcon className="w-4 h-4 text-[#5C131F]" />
                  <span>{lang === 'ar' ? '2. التاريخ' : '2. Date'}</span>
                </label>
                {formData.date && (
                  <span className="text-xs font-semibold text-[#5C131F] bg-[#5C131F]/8 px-2.5 py-0.5 rounded-full font-sans-modern">
                    {formattedDateDisplay}
                  </span>
                )}
              </div>

              <div className="relative">
                <input
                  id="booking-date-input"
                  type="date"
                  required
                  value={formData.date}
                  onChange={handleDateChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full bg-[#FAF7F2] border border-[#5C131F]/20 rounded-xl px-4 py-3 text-sm text-[#2A050A] focus:outline-hidden focus:border-[#5C131F] focus:ring-1 focus:ring-[#5C131F] transition-all font-sans-modern cursor-pointer"
                />
              </div>
              <p className="text-[11px] text-[#5C131F]/70 mt-1 font-sans-modern">
                {lang === 'ar'
                  ? `التاريخ المحدد: ${formattedDateDisplay}`
                  : `Selected: ${formattedDateDisplay}`}
              </p>
            </div>

            {/* Field 3: Number of People (Clean Selector) */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-[#2A050A] mb-2 font-sans-modern">
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[#5C131F]" />
                  <span>{lang === 'ar' ? '3. العدد' : '3. Number of People'}</span>
                </span>
              </label>

              <div className="flex flex-wrap gap-2.5">
                {[1, 2, 3, 4, 5, 6].map((num) => {
                  const isSelected = formData.peopleCount === num;
                  return (
                    <button
                      key={num}
                      type="button"
                      id={`people-count-btn-${num}`}
                      onClick={() => handlePeopleSelect(num)}
                      className={`flex-1 min-w-[50px] py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer focus:outline-hidden ${
                        isSelected
                          ? 'bg-[#5C131F] text-[#FAF7F2] shadow-xs'
                          : 'bg-[#FAF7F2] border border-[#5C131F]/15 text-[#35080E] hover:border-[#5C131F]/40'
                      }`}
                    >
                      {num === 6 ? `${num}+` : num}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Field 4: Location */}
            <div>
              <label
                htmlFor="booking-location-input"
                className="block text-xs sm:text-sm font-semibold text-[#2A050A] mb-2 font-sans-modern flex items-center gap-1.5"
              >
                <MapPin className="w-4 h-4 text-[#5C131F]" />
                <span>{lang === 'ar' ? '4. المكان' : '4. Location'}</span>
              </label>
              <input
                id="booking-location-input"
                type="text"
                required
                placeholder={lang === 'ar' ? 'مثال: الدوحة، اللؤلؤة، لوسيل، فندق، أو منزل...' : 'e.g. Doha, The Pearl, Lusail, Hotel, or Home...'}
                value={formData.location}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, location: e.target.value }));
                  if (formError) setFormError(null);
                }}
                className="w-full bg-[#FAF7F2] border border-[#5C131F]/20 rounded-xl px-4 py-3 text-sm text-[#2A050A] placeholder:text-[#5C131F]/40 focus:outline-hidden focus:border-[#5C131F] focus:ring-1 focus:ring-[#5C131F] transition-all font-sans-modern"
              />
              <p className="text-[11px] text-[#5C131F]/70 mt-1 font-sans-modern">
                {lang === 'ar'
                  ? 'ملاحظة: تختلف رسوم خدمة الهوم سيرفس / التوصيل حسب الموقع بدولة قطر.'
                  : 'Note: Home Service / travel charges depend on the exact location in Qatar.'}
              </p>
            </div>

            {/* Field 5: Booking Name & Customer Contact Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="booking-name-input"
                  className="block text-xs sm:text-sm font-semibold text-[#2A050A] mb-2 font-sans-modern flex items-center gap-1.5"
                >
                  <User className="w-4 h-4 text-[#5C131F]" />
                  <span>{lang === 'ar' ? '5. الحجز باسم' : '5. Booking Name'}</span>
                </label>
                <input
                  id="booking-name-input"
                  type="text"
                  required
                  placeholder={lang === 'ar' ? 'الاسم الكريم' : 'Your full name'}
                  value={formData.customerName}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, customerName: e.target.value }));
                    if (formError) setFormError(null);
                  }}
                  className="w-full bg-[#FAF7F2] border border-[#5C131F]/20 rounded-xl px-4 py-3 text-sm text-[#2A050A] placeholder:text-[#5C131F]/40 focus:outline-hidden focus:border-[#5C131F] focus:ring-1 focus:ring-[#5C131F] transition-all font-sans-modern"
                />
              </div>

              <div>
                <label
                  htmlFor="booking-phone-input"
                  className="block text-xs sm:text-sm font-semibold text-[#2A050A] mb-2 font-sans-modern flex items-center gap-1.5"
                >
                  <Phone className="w-4 h-4 text-[#5C131F]" />
                  <span>{lang === 'ar' ? 'رقم الهاتف للتواصل' : 'Contact Phone / WhatsApp'}</span>
                </label>
                <input
                  id="booking-phone-input"
                  type="tel"
                  dir="ltr"
                  placeholder={lang === 'ar' ? '+974 55XX XXXX' : '+974 55XX XXXX'}
                  value={formData.customerPhone || ''}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, customerPhone: e.target.value }));
                    if (formError) setFormError(null);
                  }}
                  className="w-full bg-[#FAF7F2] border border-[#5C131F]/20 rounded-xl px-4 py-3 text-sm text-[#2A050A] placeholder:text-[#5C131F]/40 focus:outline-hidden focus:border-[#5C131F] focus:ring-1 focus:ring-[#5C131F] transition-all font-sans-modern text-start"
                />
              </div>
            </div>

            {/* Field 6: Fawran Deposit Instructions & Transfer Info */}
            <div
              id="fawran-payment-section"
              className="rounded-2xl border-2 border-[#C9A86A]/50 bg-gradient-to-br from-[#FFFDF9] via-[#FAF6EE] to-[#F5ECE0] p-5 sm:p-6 shadow-sm space-y-5"
            >
              {/* Section Heading & Instruction */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#C9A86A]/30">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#5C131F] text-[#C9A86A] flex items-center justify-center shrink-0 shadow-xs">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-[#5C131F] uppercase tracking-wider bg-[#5C131F]/10 px-2 py-0.5 rounded-full">
                        {lang === 'ar' ? 'دفع العربون الفوري' : 'Instant Deposit'}
                      </span>
                      <span className="text-xs font-bold text-[#2A050A]">
                        {lang === 'ar' ? FAWRAN_CONFIG.serviceNameAr : FAWRAN_CONFIG.serviceNameEn}
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-[#5C131F] mt-0.5">
                      {lang === 'ar' ? FAWRAN_CONFIG.instructionAr : FAWRAN_CONFIG.instructionEn}
                    </h3>
                  </div>
                </div>
                <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-full self-start sm:self-auto">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{lang === 'ar' ? 'محفظة معتمدة ورسمية في قطر' : 'Official Verified Qatar Wallet'}</span>
                </div>
              </div>

              {/* Fawran Wallet Info Cards with Copy Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Wallet Number */}
                <div className="bg-white/90 rounded-xl p-3.5 border border-[#C9A86A]/40 flex items-center justify-between gap-3 shadow-2xs">
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-bold text-[#5C131F]/80 block">
                      {lang === 'ar' ? 'رقم محفظة / هاتف فوران:' : 'Fawran Wallet / Mobile:'}
                    </span>
                    <span className="text-lg font-mono font-bold tracking-wider text-[#2A050A]" dir="ltr">
                      {FAWRAN_CONFIG.walletNumber}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(FAWRAN_CONFIG.walletNumber, 'wallet')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      copiedKey === 'wallet'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-[#5C131F]/10 hover:bg-[#5C131F] text-[#5C131F] hover:text-white'
                    }`}
                    title={lang === 'ar' ? 'نسخ رقم المحفظة' : 'Copy Wallet Number'}
                  >
                    {copiedKey === 'wallet' ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>{lang === 'ar' ? 'تم النسخ!' : 'Copied!'}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>{lang === 'ar' ? 'نسخ الرقم' : 'Copy'}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Beneficiary Name */}
                <div className="bg-white/90 rounded-xl p-3.5 border border-[#C9A86A]/40 flex items-center justify-between gap-3 shadow-2xs">
                  <div className="space-y-0.5 overflow-hidden">
                    <span className="text-[11px] font-bold text-[#5C131F]/80 block">
                      {lang === 'ar' ? 'اسم المستفيد المعتمد:' : 'Beneficiary Name:'}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-[#2A050A] truncate block" dir="ltr">
                      {FAWRAN_CONFIG.beneficiaryName}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(FAWRAN_CONFIG.beneficiaryName, 'name')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                      copiedKey === 'name'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-[#5C131F]/10 hover:bg-[#5C131F] text-[#5C131F] hover:text-white'
                    }`}
                    title={lang === 'ar' ? 'نسخ اسم المستفيد' : 'Copy Beneficiary Name'}
                  >
                    {copiedKey === 'name' ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>{lang === 'ar' ? 'تم النسخ!' : 'Copied!'}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>{lang === 'ar' ? 'نسخ الاسم' : 'Copy'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Inputs for customer to specify transfer sender & deposit amount */}
              <div className="pt-2 border-t border-[#C9A86A]/25">
                <div className="mb-2.5">
                  <span className="text-xs font-bold text-[#2A050A] block">
                    {lang === 'ar'
                      ? 'بيانات التحويل الخاصة بك (لتأكيد الحجز فوراً):'
                      : 'Your Transfer Confirmation (for immediate reservation):'}
                  </span>
                  <span className="text-[11px] text-[#5C131F]/80">
                    {lang === 'ar'
                      ? 'إذا قمتِ بالتحويل، يرجى كتابة الرقم والمبلغ أدناه، وستصل البيانات مباشرة مع طلبك إلى واتساب يسرا الكردي.'
                      : 'If already transferred, enter your sender number and amount below. It will be sent directly via WhatsApp.'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Field A: Sender Phone / Account */}
                  <div>
                    <label
                      htmlFor="fawran-sender-phone"
                      className="block text-xs font-semibold text-[#2A050A] mb-1.5 font-sans-modern"
                    >
                      {lang === 'ar' ? 'رقم الهاتف / الحساب الذي تم منه التحويل' : 'Sender Mobile / Account (Fawran)'}
                    </label>
                    <input
                      id="fawran-sender-phone"
                      type="text"
                      dir="ltr"
                      placeholder={lang === 'ar' ? 'مثال: 55XXXXXX أو 33XXXXXX' : 'e.g. 55XXXXXX or 33XXXXXX'}
                      value={formData.fawranSenderPhone || ''}
                      onChange={(e) => {
                        setFormData((prev) => ({ ...prev, fawranSenderPhone: e.target.value }));
                      }}
                      className="w-full bg-white border border-[#5C131F]/20 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#2A050A] placeholder:text-[#5C131F]/40 focus:outline-hidden focus:border-[#5C131F] focus:ring-1 focus:ring-[#5C131F] transition-all font-sans-modern"
                    />
                  </div>

                  {/* Field B: Deposit Amount */}
                  <div>
                    <label
                      htmlFor="fawran-deposit-amount"
                      className="block text-xs font-semibold text-[#2A050A] mb-1.5 font-sans-modern"
                    >
                      {lang === 'ar' ? 'مبلغ العربون المحوّل (ر.ق)' : 'Transferred Deposit Amount (QAR)'}
                    </label>
                    <input
                      id="fawran-deposit-amount"
                      type="text"
                      dir="ltr"
                      placeholder={lang === 'ar' ? 'مثال: 500 أو 1000' : 'e.g. 500 or 1000'}
                      value={formData.fawranDepositAmount || ''}
                      onChange={(e) => {
                        setFormData((prev) => ({ ...prev, fawranDepositAmount: e.target.value }));
                      }}
                      className="w-full bg-white border border-[#5C131F]/20 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#2A050A] placeholder:text-[#5C131F]/40 focus:outline-hidden focus:border-[#5C131F] focus:ring-1 focus:ring-[#5C131F] transition-all font-sans-modern"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {formError && (
              <div className="p-3 bg-[#5C131F]/10 border border-[#5C131F]/30 rounded-xl text-xs text-[#5C131F] font-medium font-sans-modern">
                {formError}
              </div>
            )}

            {/* Section 24: IMPORTANT BOOKING POLICY (Subtle Premium Information Box) */}
            <div
              id="booking-policy-box"
              className="mt-8 p-6 rounded-2xl bg-[#FAF7F2] border border-[#5C131F]/20 text-start"
            >
              <div className="flex items-center gap-2 mb-3 text-[#5C131F] font-semibold text-sm font-sans-modern">
                <Info className="w-4 h-4 text-[#C9A86A]" />
                <span>{lang === 'ar' ? policies.titleAr : policies.titleEn}</span>
              </div>
              <ul className="space-y-2 text-xs text-[#4A2027]/85 leading-relaxed font-sans-modern">
                {(lang === 'ar' ? policies.rulesAr : policies.rulesEn).map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C9A86A] mt-1.5 shrink-0" />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Submit Action: Direct WhatsApp Launch with Pre-filled Message */}
            <button
              type="submit"
              id="send-booking-whatsapp-btn"
              className="w-full py-4 rounded-full bg-[#5C131F] hover:bg-[#3D0A13] text-[#FAF7F2] font-semibold text-sm sm:text-base tracking-wide transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2.5 cursor-pointer focus:outline-hidden"
            >
              <MessageCircle className="w-5 h-5 text-[#C9A86A]" />
              <span>{lang === 'ar' ? 'إرسال الحجز عبر واتساب' : 'Send Booking via WhatsApp'}</span>
            </button>

            <div className="text-center text-[11px] text-[#5C131F]/70 font-sans-modern">
              <span>{lang === 'ar' ? 'رقم الواتساب الرسمي المعتمد: ' : 'Official Booking WhatsApp: '}</span>
              <strong dir="ltr" className="tracking-wider">{brand.whatsappDisplay}</strong>
            </div>

          </form>
        </div>

      </div>
    </section>
  );
};
