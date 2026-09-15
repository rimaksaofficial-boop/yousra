import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Calendar,
  MapPin,
  User,
  Phone,
  MessageCircle,
  CheckCircle2,
  Users,
  Clock,
  Heart,
  Globe2,
  AlertCircle,
  Crown,
} from 'lucide-react';
import { Language, MakeupHairBookingFormData, MakeupHairServiceType, BrideRoleSelection } from '../types';
import {
  MAKEUP_HAIR_SERVICE_INFO,
  DESTINATION_COUNTRIES,
  BRAND_ASSETS,
  generateMakeupHairWhatsAppUrl,
} from '../data/content';
import { useSiteData } from '../context/SiteDataContext';

interface MakeupHairBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  initialServiceType?: MakeupHairServiceType;
}

export const MakeupHairBookingModal: React.FC<MakeupHairBookingModalProps> = ({
  isOpen,
  onClose,
  lang,
  initialServiceType = 'makeup_and_hair',
}) => {
  const { brand, addBookingOrder } = useSiteData();

  const [formData, setFormData] = useState<MakeupHairBookingFormData>({
    fullName: '',
    phone: '',
    countryCode: 'SA',
    countryNameAr: 'السعودية',
    countryNameEn: 'Saudi Arabia',
    city: 'الرياض',
    date: '',
    serviceType: initialServiceType,
    occasionAr: 'حفل زفاف',
    occasionEn: 'Wedding',
    brideRole: 'bride_and_bridesmaids',
    bridesmaidsCount: 3,
    notes: '',
  });

  const [selectedCountryObj, setSelectedCountryObj] = useState(
    () => DESTINATION_COUNTRIES.find((c) => c.code === 'SA') || DESTINATION_COUNTRIES[0]
  );

  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Sync initial service type if passed
  useEffect(() => {
    if (initialServiceType) {
      setFormData((prev) => ({ ...prev, serviceType: initialServiceType }));
    }
  }, [initialServiceType]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setSubmittedSuccess(false);
      setErrorMsg('');
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCountryChange = (code: string) => {
    const country = DESTINATION_COUNTRIES.find((c) => c.code === code) || DESTINATION_COUNTRIES[0];
    setSelectedCountryObj(country);
    setFormData((prev) => ({
      ...prev,
      countryCode: country.code,
      countryNameAr: country.nameAr,
      countryNameEn: country.nameEn,
      city: lang === 'ar' ? country.popularCitiesAr[0] : country.popularCitiesEn[0],
    }));
  };

  const occasionOptions = [
    { ar: 'حفل زفاف', en: 'Wedding' },
    { ar: 'خطوبة', en: 'Engagement' },
    { ar: 'ملكة / عقد قران', en: 'Milka / Marriage Contract' },
    { ar: 'حناء', en: 'Henna Night' },
    { ar: 'مناسبة خاصة / سهرة', en: 'Special Occasion / Gala' },
    { ar: 'أخرى', en: 'Other' },
  ];

  const roleOptions: { key: BrideRoleSelection; ar: string; en: string }[] = [
    {
      key: 'bride_only',
      ar: 'العروس فقط',
      en: 'Bride Only',
    },
    {
      key: 'bride_and_bridesmaids',
      ar: 'العروس مع مرافقات',
      en: 'Bride & Bridesmaids',
    },
    {
      key: 'bridesmaids_only',
      ar: 'مرافقات العروس والعائلة فقط',
      en: 'Bridesmaids & Family Only',
    },
  ];

  const serviceTypeLabels = {
    makeup: { ar: 'ميكب', en: 'Makeup' },
    hair: { ar: 'شعر', en: 'Hair' },
    makeup_and_hair: { ar: 'ميكب وشعر', en: 'Makeup & Hair' },
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.fullName.trim()) {
      setErrorMsg(lang === 'ar' ? 'يرجى كتابة الاسم الكريم' : 'Please enter your full name');
      return;
    }

    if (!formData.phone.trim()) {
      setErrorMsg(lang === 'ar' ? 'يرجى إدخال رقم الهاتف للتواصل' : 'Please enter a contact phone number');
      return;
    }

    if (!formData.city.trim()) {
      setErrorMsg(lang === 'ar' ? 'يرجى إدخال المدينة' : 'Please specify the city');
      return;
    }

    if (!formData.date) {
      setErrorMsg(lang === 'ar' ? 'يرجى اختيار التاريخ المطلوب' : 'Please select the requested date');
      return;
    }

    const currentCountryName = lang === 'ar' ? formData.countryNameAr : formData.countryNameEn;
    const currentServiceName = serviceTypeLabels[formData.serviceType][lang];
    const currentOccasion = lang === 'ar' ? formData.occasionAr : formData.occasionEn;
    const currentRoleLabel =
      roleOptions.find((r) => r.key === formData.brideRole)?.[lang] || (lang === 'ar' ? 'العروس' : 'Bride');

    // Register inquiry in admin dashboard
    const targetWhatsApp = brand.whatsappRaw || BRAND_ASSETS.whatsappRaw;

    try {
      addBookingOrder({
        customerName: formData.fullName.trim(),
        customerPhone: `${selectedCountryObj.dialCode} ${formData.phone.trim()}`,
        serviceId: `destination-${formData.serviceType}`,
        serviceName: `${MAKEUP_HAIR_SERVICE_INFO[lang === 'ar' ? 'titleAr' : 'titleEn']} (${currentServiceName}) - ${currentCountryName}`,
        date: formData.date,
        peopleCount: formData.brideRole === 'bride_only' ? 1 : 1 + (Number(formData.bridesmaidsCount) || 0),
        location: `${formData.city.trim()}، ${currentCountryName}`,
        notes: `[خدمة راقية بدول الخليج]\nالمناسبة: ${currentOccasion}\nالطلب: ${currentRoleLabel}\nعدد المرافقات: ${formData.bridesmaidsCount}\nملاحظات: ${formData.notes || 'لا توجد'}`,
        sentViaWhatsApp: true,
      });
    } catch (err) {
      console.warn('Booking logged locally:', err);
    }

    // Generate formatted WhatsApp message matching exact required template
    const whatsappUrl = generateMakeupHairWhatsAppUrl({
      customerName: formData.fullName.trim(),
      country: currentCountryName,
      city: formData.city.trim(),
      date: formData.date,
      serviceRequested: currentServiceName,
      occasion: currentOccasion,
      brideOrBridesmaids: currentRoleLabel,
      bridesmaidsCount: formData.brideRole === 'bride_only' ? 0 : formData.bridesmaidsCount,
      notes: formData.notes.trim(),
      rawWhatsAppNumber: targetWhatsApp,
      lang: lang,
    });

    setSubmittedSuccess(true);

    // Open WhatsApp
    const win = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    if (!win) {
      window.location.href = whatsappUrl;
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div
      id="makeup-hair-booking-modal"
      className="fixed inset-0 z-50 overflow-y-auto bg-[#2A050A]/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="makeup-hair-modal-title"
    >
      <div
        className="relative w-full max-w-2xl bg-[#FAF7F2] rounded-3xl shadow-2xl border border-[#C9A86A]/40 overflow-hidden my-6 transition-all duration-300"
        dir={lang === 'ar' ? 'rtl' : 'ltr'}
      >
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-[#3D0A13] via-[#5C131F] to-[#2E070D] text-[#FAF7F2] p-6 sm:p-7 relative overflow-hidden">
          {/* Subtle decorative glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#C9A86A]/15 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#5C131F]/30 rounded-full blur-xl pointer-events-none" />

          {/* Close button */}
          <button
            id="makeup-hair-modal-close-btn"
            type="button"
            onClick={onClose}
            className="absolute top-5 end-5 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-[#FAF7F2] flex items-center justify-center transition-colors cursor-pointer border border-white/10 focus:outline-hidden"
            aria-label={lang === 'ar' ? 'إغلاق' : 'Close'}
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2 text-xs font-semibold uppercase tracking-widest text-[#C9A86A]">
            <Crown className="w-4 h-4 text-[#C9A86A]" />
            <span>{lang === 'ar' ? 'حجز خدمة راقية ومخصصة' : 'Bespoke Couture Booking'}</span>
          </div>

          <h2
            id="makeup-hair-modal-title"
            className={`text-xl sm:text-2xl md:text-3xl font-bold text-[#FAF7F2] ${
              lang === 'ar' ? 'font-arabic' : 'font-editorial font-medium'
            }`}
          >
            {lang === 'ar' ? MAKEUP_HAIR_SERVICE_INFO.titleAr : MAKEUP_HAIR_SERVICE_INFO.titleEn}
          </h2>

          <p className="text-xs sm:text-sm text-[#FAF7F2]/80 mt-1.5 font-sans-modern max-w-lg leading-relaxed">
            {lang === 'ar'
              ? 'متاحة داخل دول الخليج: السعودية، الإمارات، الكويت، البحرين، عُمان، وقطر.'
              : 'Available across Gulf destinations: Saudi Arabia, UAE, Kuwait, Bahrain, Oman, and Qatar.'}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[80vh] overflow-y-auto space-y-6">
          {submittedSuccess ? (
            /* Success Feedback View */
            <div className="text-center py-8 space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <h3
                  className={`text-2xl font-bold text-[#2A050A] mb-2 ${
                    lang === 'ar' ? 'font-arabic' : 'font-editorial font-semibold'
                  }`}
                >
                  {lang === 'ar' ? 'تم تجهيز طلب حجزك بنجاح!' : 'Your Booking Request is Ready!'}
                </h3>
                <p className="text-sm text-[#5C131F]/80 max-w-md mx-auto font-sans-modern leading-relaxed">
                  {lang === 'ar'
                    ? 'تم فتح واتساب تلقائياً برسالة الحجز المكتملة للتواصل مباشرة مع يسرا الكردي لتأكيد الأسعار والموعد.'
                    : 'WhatsApp has opened with your complete inquiry to confirm pricing and availability directly with Yousra El Kordy.'}
                </p>
              </div>

              {/* Direct WhatsApp Open Button fallback */}
              <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const currentCountryName = lang === 'ar' ? formData.countryNameAr : formData.countryNameEn;
                    const currentServiceName = serviceTypeLabels[formData.serviceType][lang];
                    const currentOccasion = lang === 'ar' ? formData.occasionAr : formData.occasionEn;
                    const currentRoleLabel =
                      roleOptions.find((r) => r.key === formData.brideRole)?.[lang] || (lang === 'ar' ? 'العروس' : 'Bride');

                    const whatsappUrl = generateMakeupHairWhatsAppUrl({
                      customerName: formData.fullName.trim(),
                      country: currentCountryName,
                      city: formData.city.trim(),
                      date: formData.date,
                      serviceRequested: currentServiceName,
                      occasion: currentOccasion,
                      brideOrBridesmaids: currentRoleLabel,
                      bridesmaidsCount: formData.brideRole === 'bride_only' ? 0 : formData.bridesmaidsCount,
                      notes: formData.notes.trim(),
                      rawWhatsAppNumber: brand.whatsappRaw || BRAND_ASSETS.whatsappRaw,
                      lang: lang,
                    });
                    window.open(whatsappUrl, '_blank');
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'فتح المحادثة في واتساب مجدداً' : 'Open WhatsApp Again'}</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-neutral-200 hover:bg-neutral-300 text-neutral-800 font-bold text-sm transition-colors cursor-pointer"
                >
                  {lang === 'ar' ? 'إغلاق' : 'Close'}
                </button>
              </div>
            </div>
          ) : (
            /* Booking Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Official Pricing Notice Card */}
              <div className="rounded-xl border border-[#C9A86A]/50 bg-gradient-to-r from-[#FAF0DD] to-[#FFFDF9] p-4 flex items-start gap-3 shadow-2xs">
                <div className="w-8 h-8 rounded-lg bg-[#5C131F] text-[#C9A86A] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <div className="space-y-1 text-xs">
                  <span className="font-extrabold text-[#5C131F] block text-xs sm:text-sm">
                    {lang === 'ar' ? MAKEUP_HAIR_SERVICE_INFO.pricingNoticeAr : MAKEUP_HAIR_SERVICE_INFO.pricingNoticeEn}
                  </span>
                  <p className="text-[#2A050A]/75 font-sans-modern">
                    {lang === 'ar'
                      ? 'سيتم تزويدك بكافة التفاصيل والأسعار الدقيقة فور إرسال الطلب عبر واتساب يسرا الكردي.'
                      : 'You will receive exact pricing and full availability details via WhatsApp upon submitting.'}
                  </p>
                </div>
              </div>

              {/* Error Banner */}
              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Field 1 & 2: Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. Name */}
                <div>
                  <label
                    htmlFor="field-fullname"
                    className="block text-xs font-bold text-[#2A050A] mb-1.5 font-sans-modern"
                  >
                    {lang === 'ar' ? 'الاسم الكريم *' : 'Full Name *'}
                  </label>
                  <div className="relative">
                    <input
                      id="field-fullname"
                      type="text"
                      required
                      placeholder={lang === 'ar' ? 'مثال: فاطمة السليطي' : 'e.g. Fatima Al-Sulaiti'}
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#C9A86A]/40 rounded-xl focus:outline-hidden focus:border-[#5C131F] focus:ring-1 focus:ring-[#5C131F] transition-all"
                    />
                    <User className="w-4 h-4 text-neutral-400 absolute end-3.5 top-3 pointer-events-none" />
                  </div>
                </div>

                {/* 2. Phone */}
                <div>
                  <label
                    htmlFor="field-phone"
                    className="block text-xs font-bold text-[#2A050A] mb-1.5 font-sans-modern"
                  >
                    {lang === 'ar' ? 'رقم الهاتف (واتساب) *' : 'Phone Number (WhatsApp) *'}
                  </label>
                  <div className="relative flex items-center">
                    <span
                      className="px-2.5 py-2.5 bg-neutral-100 border border-e-0 border-[#C9A86A]/40 rounded-s-xl text-xs font-mono font-bold text-[#5C131F]"
                      dir="ltr"
                    >
                      {selectedCountryObj.dialCode}
                    </span>
                    <input
                      id="field-phone"
                      type="tel"
                      required
                      dir="ltr"
                      placeholder={lang === 'ar' ? '5XXXXXXXX' : '5XXXXXXXX'}
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2.5 text-sm bg-white border border-[#C9A86A]/40 rounded-e-xl focus:outline-hidden focus:border-[#5C131F] focus:ring-1 focus:ring-[#5C131F] transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Field 3 & 4: Country & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 3. Country */}
                <div>
                  <label
                    htmlFor="field-country"
                    className="block text-xs font-bold text-[#2A050A] mb-1.5 font-sans-modern"
                  >
                    {lang === 'ar' ? 'الدولة المطلوبة *' : 'Destination Country *'}
                  </label>
                  <div className="relative">
                    <select
                      id="field-country"
                      value={formData.countryCode}
                      onChange={(e) => handleCountryChange(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#C9A86A]/40 rounded-xl focus:outline-hidden focus:border-[#5C131F] focus:ring-1 focus:ring-[#5C131F] transition-all cursor-pointer"
                    >
                      {DESTINATION_COUNTRIES.map((c) => (
                        <option key={c.id} value={c.code}>
                          {c.flag} {lang === 'ar' ? c.nameAr : c.nameEn} ({c.dialCode})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 4. City */}
                <div>
                  <label
                    htmlFor="field-city"
                    className="block text-xs font-bold text-[#2A050A] mb-1.5 font-sans-modern"
                  >
                    {lang === 'ar' ? 'المدينة *' : 'City *'}
                  </label>
                  <div className="space-y-1.5">
                    <div className="relative">
                      <input
                        id="field-city"
                        type="text"
                        required
                        placeholder={lang === 'ar' ? 'اكتبي اسم المدينة' : 'Enter city name'}
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#C9A86A]/40 rounded-xl focus:outline-hidden focus:border-[#5C131F] focus:ring-1 focus:ring-[#5C131F] transition-all"
                      />
                      <MapPin className="w-4 h-4 text-neutral-400 absolute end-3.5 top-3 pointer-events-none" />
                    </div>

                    {/* Popular City Quick Select Pills */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] text-neutral-500 font-semibold">
                        {lang === 'ar' ? 'مدن مقترحة:' : 'Popular:'}
                      </span>
                      {(lang === 'ar'
                        ? selectedCountryObj.popularCitiesAr
                        : selectedCountryObj.popularCitiesEn
                      ).map((city) => (
                        <button
                          type="button"
                          key={city}
                          onClick={() => setFormData((prev) => ({ ...prev, city }))}
                          className={`text-[10px] px-2 py-0.5 rounded-md transition-colors cursor-pointer border ${
                            formData.city === city
                              ? 'bg-[#5C131F] text-white border-[#5C131F]'
                              : 'bg-white text-neutral-700 border-neutral-200 hover:border-[#C9A86A]'
                          }`}
                        >
                          {city}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Field 5 & 6: Date & Service Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 5. Date */}
                <div>
                  <label
                    htmlFor="field-date"
                    className="block text-xs font-bold text-[#2A050A] mb-1.5 font-sans-modern"
                  >
                    {lang === 'ar' ? 'التاريخ المطلوب *' : 'Requested Date *'}
                  </label>
                  <div className="relative">
                    <input
                      id="field-date"
                      type="date"
                      required
                      min={todayStr}
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#C9A86A]/40 rounded-xl focus:outline-hidden focus:border-[#5C131F] focus:ring-1 focus:ring-[#5C131F] transition-all"
                    />
                    <Calendar className="w-4 h-4 text-neutral-400 absolute end-3.5 top-3 pointer-events-none" />
                  </div>
                </div>

                {/* 6. Service Type */}
                <div>
                  <label className="block text-xs font-bold text-[#2A050A] mb-1.5 font-sans-modern">
                    {lang === 'ar' ? 'نوع الخدمة المطلوبة *' : 'Requested Service Type *'}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['makeup', 'hair', 'makeup_and_hair'] as MakeupHairServiceType[]).map((type) => {
                      const isSelected = formData.serviceType === type;
                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setFormData({ ...formData, serviceType: type })}
                          className={`py-2 px-2 text-center rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                            isSelected
                              ? 'bg-[#5C131F] text-white border-[#5C131F] shadow-xs'
                              : 'bg-white text-[#2A050A] border-[#C9A86A]/40 hover:border-[#5C131F]'
                          }`}
                        >
                          {serviceTypeLabels[type][lang]}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Field 7: Occasion Type */}
              <div>
                <label className="block text-xs font-bold text-[#2A050A] mb-1.5 font-sans-modern">
                  {lang === 'ar' ? 'نوع المناسبة *' : 'Occasion Type *'}
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {occasionOptions.map((occ) => {
                    const isSelected = formData.occasionAr === occ.ar;
                    return (
                      <button
                        key={occ.ar}
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            occasionAr: occ.ar,
                            occasionEn: occ.en,
                          })
                        }
                        className={`text-xs px-3.5 py-1.5 rounded-lg border font-medium transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#5C131F] text-white border-[#5C131F] shadow-2xs font-bold'
                            : 'bg-white text-neutral-700 border-neutral-200 hover:border-[#C9A86A]'
                        }`}
                      >
                        {lang === 'ar' ? occ.ar : occ.en}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Field 8 & 9: Bride or Bridesmaids + Count */}
              <div className="rounded-2xl border-2 border-[#C9A86A]/40 bg-gradient-to-br from-[#FFFDF9] via-[#FAF6EE] to-[#F5ECE0] p-5 space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="w-4 h-4 text-[#5C131F]" />
                    <span className="text-xs font-bold text-[#5C131F] uppercase tracking-wider">
                      {lang === 'ar' ? 'هل الطلب للعروس أم لمرافقات العروس؟' : 'Bride or Bridesmaids Selection:'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {roleOptions.map((opt) => {
                      const isSelected = formData.brideRole === opt.key;
                      return (
                        <button
                          key={opt.key}
                          type="button"
                          onClick={() => setFormData({ ...formData, brideRole: opt.key })}
                          className={`p-3 rounded-xl border text-xs font-bold transition-all text-start cursor-pointer ${
                            isSelected
                              ? 'bg-[#5C131F] text-white border-[#5C131F] shadow-xs'
                              : 'bg-white/90 text-[#2A050A] border-[#C9A86A]/40 hover:border-[#5C131F]'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{lang === 'ar' ? opt.ar : opt.en}</span>
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-[#C9A86A]" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Bridesmaids Specific Highlight (Required by Prompt) */}
                <div className="bg-white/90 rounded-xl p-3.5 border border-[#C9A86A]/50 flex items-start gap-3 shadow-2xs">
                  <div className="w-8 h-8 rounded-lg bg-[#FAF0DD] text-[#5C131F] flex items-center justify-center shrink-0 mt-0.5 border border-[#C9A86A]/40">
                    <Users className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-extrabold text-[#5C131F] block">
                      {lang === 'ar' ? 'خدمة مرافقات العروس وصديقاتها' : 'Bridesmaids & Family Styling'}
                    </span>
                    <p className="text-xs text-[#2A050A]/85 leading-relaxed font-sans-modern">
                      {lang === 'ar'
                        ? MAKEUP_HAIR_SERVICE_INFO.bridesmaidsDescriptionAr
                        : MAKEUP_HAIR_SERVICE_INFO.bridesmaidsDescriptionEn}
                    </p>
                  </div>
                </div>

                {/* 9. Bridesmaids Count (if not bride_only) */}
                {formData.brideRole !== 'bride_only' && (
                  <div className="pt-2 border-t border-[#C9A86A]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <label
                        htmlFor="field-bridesmaids-count"
                        className="block text-xs font-bold text-[#2A050A] font-sans-modern"
                      >
                        {lang === 'ar' ? 'عدد مرافقات العروس (إن وجد):' : 'Number of Bridesmaids / Companions:'}
                      </label>
                      <span className="text-[11px] text-neutral-500">
                        {lang === 'ar'
                          ? 'حددي عدد المرافقات لحساب الوقت وتجهيز الفريق المساعد'
                          : 'Select count to organize schedule and team'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setFormData({ ...formData, bridesmaidsCount: num })}
                          className={`w-8 h-8 rounded-lg text-xs font-bold transition-all border cursor-pointer flex items-center justify-center ${
                            formData.bridesmaidsCount === num
                              ? 'bg-[#5C131F] text-white border-[#5C131F] shadow-2xs'
                              : 'bg-white text-neutral-700 border-neutral-300 hover:border-[#5C131F]'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Field 10: Additional Notes */}
              <div>
                <label
                  htmlFor="field-notes"
                  className="block text-xs font-bold text-[#2A050A] mb-1.5 font-sans-modern"
                >
                  {lang === 'ar' ? 'ملاحظات إضافية' : 'Additional Notes'}
                </label>
                <textarea
                  id="field-notes"
                  rows={3}
                  placeholder={
                    lang === 'ar'
                      ? 'أي تفاصيل خاصة بالفندق، القاعة، توقيت الحفل، أو تسريحة معينة ترغبين بها...'
                      : 'Any specific details regarding venue, schedule, hotel, or desired look...'
                  }
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#C9A86A]/40 rounded-xl focus:outline-hidden focus:border-[#5C131F] focus:ring-1 focus:ring-[#5C131F] transition-all resize-none"
                />
              </div>

              {/* Submit CTA Button */}
              <div className="pt-2">
                <button
                  id="submit-makeup-hair-booking-btn"
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#5C131F] via-[#6E1725] to-[#450E17] hover:from-[#4D101A] hover:to-[#380B13] text-[#FAF7F2] font-bold text-base shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer group border border-[#C9A86A]/40"
                >
                  <MessageCircle className="w-5 h-5 text-[#C9A86A] group-hover:scale-110 transition-transform" />
                  <span>{lang === 'ar' ? 'احجزي خدمتك الآن' : 'Book Your Service'}</span>
                </button>
                <p className="text-center text-[11px] text-neutral-500 mt-2 font-sans-modern">
                  {lang === 'ar'
                    ? 'سيتم إرسال كافة البيانات تلقائياً عبر واتساب يسرا الكردي الرسمي'
                    : 'Your details will be sent directly via official WhatsApp to Yousra El Kordy'}
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
