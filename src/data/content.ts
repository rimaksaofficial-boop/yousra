import { ServiceItem, BridalPackageItem } from '../types';

export const BRAND_ASSETS = {
  logo: 'https://res.cloudinary.com/o8xawiyy/image/upload/f_auto,q_auto/v1788915880/bavo257nfylyfyskuchm.png',
  portrait: 'https://res.cloudinary.com/o8xawiyy/image/upload/f_auto,q_auto/v1788915889/vkzho9oollfknos4zji3.png',
  whatsappNumber: '+97431061141',
  whatsappRaw: '97431061141',
  whatsappDisplay: '+974 3106 1141',
  social: {
    instagram: 'https://www.instagram.com/yusraalkordi.yk/',
    tiktok: 'https://www.tiktok.com/@yusra.alkordi?_r=1&_t=ZS-99ZabRjogLg',
    snapchat: 'https://snapchat.com/t/FjPZSG7x',
  },
};

export const SERVICES_LIST: ServiceItem[] = [
  {
    id: 'svc-01',
    number: '01',
    nameAr: '1_ ميكب وشعر ويفي',
    nameEn: '1. Makeup & Wavy Hair',
    descAr: 'ميكب وشعر ويفي متقن وأنيق.',
    descEn: 'Flawless signature makeup paired with flowing wavy hair.',
    price: 800,
  },
  {
    id: 'svc-02',
    number: '02',
    nameAr: '2_ ميكب وتسريحه نص رفعة',
    nameEn: '2. Makeup & Half-Up Hairstyle',
    descAr: 'ميكب وتسريحه نص رفعة راقية تبرز ملامحك بكل أنوثة.',
    descEn: 'Bespoke makeup paired with an elegant half-up hairstyle.',
    price: 1000,
  },
  {
    id: 'svc-03',
    number: '03',
    nameAr: '3 - بكج السبشل',
    nameEn: '3. Special Package',
    descAr: 'ميكب وتسريحه رفعه / نص رفعه وتغطيات جسم وهايلايت واضاءات المطلوبة نص رفعة او رفعة.',
    descEn: 'Special package: makeup and updo / half-up hairstyle, body coverage, requested highlight and lighting.',
    detailsAr: [
      'ميكب وتسريحه رفعه / نص رفعه',
      'تغطيات جسم متكاملة',
      'هايلايت واضاءات المطلوبة',
    ],
    detailsEn: [
      'Makeup and updo / half-up hairstyle',
      'Full body coverage',
      'Bespoke highlight and radiant lighting',
    ],
    price: 1200,
    isPopular: true,
  },
  {
    id: 'svc-04',
    number: '04',
    nameAr: '4- بكج الالماسي لسهرات',
    nameEn: '4. Diamond Evening Package',
    descAr: 'ميكب vip وعدسات لنسزز واحدث تساريح 3D وتغطيات جسم مع هايلايت واضاءات واكسسورات لشعر راقيه.',
    descEn: 'Diamond Evening Package: VIP makeup, lenses, latest 3D hairstyles, body coverage with highlight & lighting, elegant hair accessories.',
    detailsAr: [
      'ميكب VIP',
      'عدسات (لنسزز)',
      'أحدث تساريح 3D',
      'تغطيات جسم مع هايلايت واضاءات',
      'إكسسوارات لشعر راقية',
    ],
    detailsEn: [
      'VIP Luxury Makeup',
      'Lenses (Lensz)',
      'Latest 3D Hairstyles',
      'Body coverage with highlight & lighting',
      'High-end hair accessories',
    ],
    price: 1500,
  },
];

export const MAKEUP_PACKAGES_LIST: ServiceItem[] = [
  {
    id: 'pkg-01',
    number: '01',
    nameAr: '1_ ميكب سمبل',
    nameEn: '1. Simple Makeup',
    descAr: 'ميكب سمبل ناعم ومشرق.',
    descEn: 'Soft natural simple makeup.',
    price: 500,
    noteAr: 'جروبات فقط',
    noteEn: 'Groups Only',
  },
  {
    id: 'pkg-02',
    number: '02',
    nameAr: '2_ ميكب سبشل',
    nameEn: '2. Special Makeup',
    descAr: 'ميكب سبشل متقن للمناسبات المميزة.',
    descEn: 'Artfully defined special makeup.',
    price: 800,
    noteAr: 'جروبات فقط',
    noteEn: 'Groups Only',
  },
  {
    id: 'pkg-03',
    number: '03',
    nameAr: '3- مكيب سبشل VIP + عدسات (لنسزز)',
    nameEn: '3. Special VIP Makeup + Lenses (Lensz)',
    descAr: 'مكيب سبشل vip + عدسات (لنسزز).',
    descEn: 'VIP Special makeup paired with premium lenses.',
    price: 1000,
  },
  {
    id: 'pkg-04',
    number: '04',
    nameAr: '4- ميكب عروس مع عدسات فقط',
    nameEn: '4. Bridal Makeup + Lenses Only',
    descAr: 'ميكب عروس فخم ومتقن مع عدسات فقط.',
    descEn: 'Bridal makeup with luxury lenses only.',
    price: 1800,
  },
  {
    id: 'pkg-05',
    number: '05',
    nameAr: '5- ميكب فقط : ملكه - حنا - خطوبه',
    nameEn: '5. Makeup Only: Queen - Henna - Engagement',
    descAr: 'ميكب فقط مخصص لمناسبات: ملكه - حنا - خطوبه.',
    descEn: 'Dedicated makeup only for: Queen, Henna, Engagement.',
    price: 1500,
  },
  {
    id: 'pkg-hair',
    number: '06',
    nameAr: 'تساريح من 300 إلى 500',
    nameEn: 'Hairstyling 300 to 500',
    descAr: 'تساريح من 300 إلى 500 (جروبات فقط).',
    descEn: 'Hairstyles from 300 to 500 QAR (Groups Only).',
    price: 300, // Range 300-500
    noteAr: 'جروبات فقط',
    noteEn: 'Groups Only',
  },
];

export const SPECIAL_OCCASION_DATA = {
  id: 'special-occasion-all',
  titleAr: 'الملكه، الحناء ،الخطبة ،الاستقبال',
  titleEn: 'Queen • Henna • Engagement • Reception',
  descAr: 'الملكه، الحناء ،الخطبة ،الاستقبال - باقة متكاملة مخصصة للمناسبات الملكية والخاصة بدولة قطر.',
  descEn: 'All-inclusive prestige beauty service for Queen, Henna, Engagement, and Reception celebrations.',
  price: 2000,
  highlightsAr: [
    'مكياج فخم مصمم وفق ملامحك وشخصيتك',
    'تسريحة شعر راقية وثابتة طوال الحفل',
    'تغطيات وإضاءات متألقة لإطلالة متجانسة',
    'عناية دقيقة بجميع تفاصيل الإطلالة الملكية',
  ],
  highlightsEn: [
    'Bespoke luxury makeup tailored to your features',
    'Long-lasting couture hairstyle throughout the event',
    'Harmonious glow and full skin radiance',
    'Artisanal precision for your grand entrance',
  ],
};

export const BRIDAL_PACKAGES_LIST: BridalPackageItem[] = [
  {
    id: 'bridal-golden',
    badgeAr: 'عروس زفاف',
    badgeEn: 'Wedding Bride',
    nameAr: 'البكج الذهبي',
    nameEn: 'GOLDEN BRIDAL PACKAGE',
    price: 2500,
    featuresAr: [
      'ميكب وتسريحه',
      'تلبيس طرحه',
      'تغطيات جسم وهايلايت واضاءات',
      'عدسات (لنسزز)',
    ],
    featuresEn: [
      'Bridal makeup and hairstyle',
      'Veil placement and styling',
      'Body coverage, highlight and lighting',
      'Lenses (Lensz)',
    ],
  },
  {
    id: 'bridal-diamond',
    badgeAr: 'عروس زفاف',
    badgeEn: 'Wedding Bride',
    nameAr: 'البكج الالماسي',
    nameEn: 'DIAMOND BRIDAL PACKAGE',
    price: 3000,
    isFeatured: true,
    highlightAr: 'يشمل مرافقة مجاناً (والدتها أو أختها)',
    highlightEn: 'Includes FREE Companion (Mother or Sister)',
    featuresAr: [
      'ميكب وشعر',
      'تلبيس طرحه',
      'تغطيات جسم مع هايلايت واضاءات',
      'عدسات (لنسزز)',
      'مرافقه مجاناً ( والدتها او اختها)',
    ],
    featuresEn: [
      'Bridal makeup and hair',
      'Veil placement and styling',
      'Body coverage with highlight and lighting',
      'Lenses (Lensz)',
      'FREE Companion (Mother or Sister)',
    ],
  },
];

export const BOOKING_POLICY = {
  titleAr: 'تنويه مهم',
  titleEn: 'IMPORTANT BOOKING POLICY',
  rulesAr: [
    'أي حجز بدون عربون خلال يومين يعتبر ملغي.',
    'العربون لا يسترد لأي سبب من الأسباب.',
    'القروب إذا وحدة كنسلت أو أكثر، العربون يروح عليها.',
    'طريقة دفع العربون عن طريق تحويل بنكي.',
    'ملاحظة: دفع خدمة هوم سيرفس / التوصيل حسب الموقع.',
  ],
  rulesEn: [
    'Any booking without a deposit within two days will be considered cancelled.',
    'The deposit is non-refundable for any reason.',
    'For group bookings, if one or more clients cancel, their deposit is non-refundable.',
    'Deposit payment is made by bank transfer.',
    'Note: Home Service / delivery charges depend on the location.',
  ],
};

export const FAWRAN_CONFIG = {
  walletNumber: '31061141',
  beneficiaryName: 'YUSRA KHALIL MOHAMMAD KURDI',
  serviceNameAr: 'فوران (Fawran)',
  serviceNameEn: 'Fawran (Qatar Instant Payment)',
  instructionAr: 'برجاء تحويل العربون من خلال فوران',
  instructionEn: 'Please transfer the deposit via Fawran',
};

// Generates the official WhatsApp link according to the user specification
export function generateWhatsAppBookingUrl(params: {
  serviceName: string;
  formattedDate: string;
  peopleCount: number;
  location: string;
  customerName: string;
  customerPhone?: string;
  fawranSenderPhone?: string;
  fawranDepositAmount?: string;
  rawWhatsAppNumber?: string;
  lang: 'ar' | 'en';
}): string {
  const targetNumber = params.rawWhatsAppNumber || BRAND_ASSETS.whatsappRaw;

  const fawranAr = params.fawranSenderPhone || params.fawranDepositAmount
    ? `\n\n💳 بيانات تحويل العربون (خدمة فوران):
- محفظة فوران المستلمة: ${FAWRAN_CONFIG.walletNumber} (${FAWRAN_CONFIG.beneficiaryName})
- رقم المحول منه (فوران): ${params.fawranSenderPhone?.trim() || 'سيتم إرساله بعد التحويل'}
- مبلغ العربون المحوّل: ${params.fawranDepositAmount?.trim() ? `${params.fawranDepositAmount.trim()} ر.ق` : 'قيد التحويل'}`
    : `\n\n💳 بيانات دفع العربون (فوران):
- محفظة فوران: ${FAWRAN_CONFIG.walletNumber} (${FAWRAN_CONFIG.beneficiaryName})
- حالة العربون: سأقوم بالتحويل عبر فوران فور التأكيد`;

  const fawranEn = params.fawranSenderPhone || params.fawranDepositAmount
    ? `\n\n💳 Fawran Deposit Transfer Details:
- Fawran Receiving Wallet: ${FAWRAN_CONFIG.walletNumber} (${FAWRAN_CONFIG.beneficiaryName})
- Transferred From (Sender Number): ${params.fawranSenderPhone?.trim() || 'Will provide upon transfer'}
- Deposit Amount: ${params.fawranDepositAmount?.trim() ? `${params.fawranDepositAmount.trim()} QAR` : 'Pending transfer'}`
    : `\n\n💳 Fawran Deposit Payment:
- Fawran Receiving Wallet: ${FAWRAN_CONFIG.walletNumber} (${FAWRAN_CONFIG.beneficiaryName})
- Deposit Status: Will transfer via Fawran upon confirmation`;

  const phoneLineAr = params.customerPhone?.trim() ? `\nرقم التواصل:\n${params.customerPhone.trim()}\n` : '';
  const phoneLineEn = params.customerPhone?.trim() ? `\nContact Phone:\n${params.customerPhone.trim()}\n` : '';

  const message = params.lang === 'ar'
    ? `مرحباً يسرا الكردي،

أرغب في حجز موعد:

الخدمة / البكج:
${params.serviceName || 'لم يتم التحديد'}

التاريخ:
${params.formattedDate || 'لم يتم التحديد'}

العدد:
${params.peopleCount}

المكان:
${params.location || 'الدوحة، قطر'}

الحجز باسم:
${params.customerName || 'عميلة كريمة'}${phoneLineAr}${fawranAr}

أرغب في تأكيد توفر الموعد والحجز.`
    : `Hello Yusra Alkordi,

I would like to book an appointment:

Service / Package:
${params.serviceName || 'Not specified'}

Date:
${params.formattedDate || 'Not specified'}

Number of People:
${params.peopleCount}

Location:
${params.location || 'Doha, Qatar'}

Booking Name:
${params.customerName || 'Valued Client'}${phoneLineEn}${fawranEn}

I would like to confirm appointment availability and booking.`;

  return `https://wa.me/${targetNumber}?text=${encodeURIComponent(message)}`;
}
