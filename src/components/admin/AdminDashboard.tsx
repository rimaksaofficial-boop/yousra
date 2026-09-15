import React, { useState } from 'react';
import {
  LayoutDashboard,
  Calendar,
  DollarSign,
  Users,
  CheckCircle,
  Clock,
  XCircle,
  Plus,
  Trash2,
  Edit3,
  Save,
  Download,
  Upload,
  RotateCcw,
  MessageCircle,
  Search,
  X,
  Sparkles,
  ExternalLink,
  Shield,
  Sliders,
  Eye,
  Crown,
  FileText,
  Phone,
  AlertTriangle,
  CreditCard,
} from 'lucide-react';
import { useSiteData } from '../../context/SiteDataContext';
import { ServiceItem, BridalPackageItem, BookingRecord, BookingStatus, Language } from '../../types';
import { autoTranslateArabicToEnglish } from '../../utils/translator';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onLogout?: () => void;
  isStandalone?: boolean;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  lang,
  onLogout,
  isStandalone = false,
}) => {
  const {
    brand,
    hero,
    about,
    services,
    makeupPackages,
    specialOccasion,
    bridalPackages,
    policies,
    bookings,
    addBookingOrder,
    updateBookingStatus,
    deleteBookingOrder,
    addService,
    updateService,
    deleteService,
    addBridalPackage,
    updateBridalPackage,
    deleteBridalPackage,
    updateSpecialOccasion,
    updateBrand,
    updateHero,
    updateAbout,
    updatePolicies,
    resetToDefaults,
    exportDataJSON,
    importDataJSON,
    isFirebaseConnected,
    isFirebaseSyncing,
    syncError,
  } = useSiteData();

  const [activeTab, setActiveTab] = useState<'bookings' | 'services' | 'bridal' | 'content' | 'settings'>('bookings');
  
  // Bookings Filter & Search
  const [bookingFilter, setBookingFilter] = useState<BookingStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Manual Booking Modal State
  const [showAddBookingModal, setShowAddBookingModal] = useState(false);
  const [newBookingData, setNewBookingData] = useState({
    customerName: '',
    customerPhone: '',
    serviceName: 'البكج الالماسي - عروس زفاف (3000 ر.ق)',
    price: 3000,
    date: new Date().toISOString().split('T')[0],
    peopleCount: 1,
    location: 'الدوحة، قطر',
    notes: '',
    fawranSenderPhone: '',
    fawranDepositAmount: '',
  });

  // Service Edit / Add Modal State
  const [editingService, setEditingService] = useState<{
    category: 'services' | 'makeup';
    item: ServiceItem;
    isNew: boolean;
  } | null>(null);

  // Bridal Package Edit / Add Modal State
  const [editingBridal, setEditingBridal] = useState<{
    item: BridalPackageItem;
    isNew: boolean;
  } | null>(null);

  // Success Notification banner
  const [notification, setNotification] = useState<string | null>(null);

  // In-app deletion confirmation states (replaces window.confirm)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  // Custom Admin Credentials State
  const [customCreds, setCustomCreds] = useState(() => {
    try {
      const saved = localStorage.getItem('yusra_admin_credentials');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return { username: 'yusra', password: '' };
  });
  const [newAdminPass, setNewAdminPass] = useState('');
  const [newAdminUser, setNewAdminUser] = useState(() => customCreds.username || 'yusra');

  const showNotice = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  if (!isOpen) return null;

  // Bookings Calculations
  const totalRevenue = bookings.reduce((acc, b) => acc + (b.price || 0), 0);
  const newBookingsCount = bookings.filter((b) => b.status === 'new').length;
  const confirmedCount = bookings.filter((b) => b.status === 'confirmed').length;

  const filteredBookings = bookings.filter((b) => {
    const matchesFilter = bookingFilter === 'all' || b.status === bookingFilter;
    const matchesSearch =
      b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.customerPhone && b.customerPhone.includes(searchQuery)) ||
      b.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Handlers for Services
  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    const finalNameEn = editingService.item.nameEn?.trim() || autoTranslateArabicToEnglish(editingService.item.nameAr) || editingService.item.nameAr;
    const finalDescEn = editingService.item.descEn?.trim() || (editingService.item.descAr ? autoTranslateArabicToEnglish(editingService.item.descAr) : '') || editingService.item.descAr;
    const finalNoteEn = editingService.item.noteEn?.trim() || (editingService.item.noteAr ? autoTranslateArabicToEnglish(editingService.item.noteAr) : undefined);

    const resolvedItem: ServiceItem = {
      ...editingService.item,
      nameEn: finalNameEn,
      descEn: finalDescEn,
      noteEn: finalNoteEn,
    };

    if (editingService.isNew) {
      const { id, ...itemWithoutId } = resolvedItem;
      addService(editingService.category, itemWithoutId);
      showNotice('تمت إضافة الخدمة وترجمتها للإنجليزية بنجاح');
    } else {
      updateService(editingService.category, resolvedItem);
      showNotice('تم تحديث الخدمة وترجمتها بنجاح');
    }
    setEditingService(null);
  };

  // Handlers for Bridal
  const handleSaveBridal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBridal) return;

    const finalNameEn = editingBridal.item.nameEn?.trim() || autoTranslateArabicToEnglish(editingBridal.item.nameAr) || editingBridal.item.nameAr;
    const finalBadgeEn = editingBridal.item.badgeEn?.trim() || (editingBridal.item.badgeAr ? autoTranslateArabicToEnglish(editingBridal.item.badgeAr) : 'Bridal');
    const finalHighlightEn = editingBridal.item.highlightEn?.trim() || (editingBridal.item.highlightAr ? autoTranslateArabicToEnglish(editingBridal.item.highlightAr) : undefined);
    const finalFeaturesEn = editingBridal.item.featuresEn && editingBridal.item.featuresEn.length > 0
      ? editingBridal.item.featuresEn
      : editingBridal.item.featuresAr.map((f) => autoTranslateArabicToEnglish(f));

    const resolvedBridal: BridalPackageItem = {
      ...editingBridal.item,
      nameEn: finalNameEn,
      badgeEn: finalBadgeEn,
      highlightEn: finalHighlightEn,
      featuresEn: finalFeaturesEn,
    };

    if (editingBridal.isNew) {
      const { id, ...itemWithoutId } = resolvedBridal;
      addBridalPackage(itemWithoutId);
      showNotice('تمت إضافة باقة العروس وترجمتها للإنجليزية بنجاح');
    } else {
      updateBridalPackage(resolvedBridal);
      showNotice('تم تحديث باقة العروس بنجاح');
    }
    setEditingBridal(null);
  };

  // Handlers for Manual Booking
  const handleCreateManualBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBookingData.customerName.trim()) return;

    addBookingOrder({
      customerName: newBookingData.customerName,
      customerPhone: newBookingData.customerPhone,
      serviceId: 'manual',
      serviceName: newBookingData.serviceName,
      price: Number(newBookingData.price) || 0,
      date: newBookingData.date,
      peopleCount: Number(newBookingData.peopleCount) || 1,
      location: newBookingData.location,
      notes: newBookingData.notes,
      fawranSenderPhone: newBookingData.fawranSenderPhone,
      fawranDepositAmount: newBookingData.fawranDepositAmount,
    });

    setShowAddBookingModal(false);
    setNewBookingData({
      customerName: '',
      customerPhone: '',
      serviceName: 'البكج الالماسي - عروس زفاف (3000 ر.ق)',
      price: 3000,
      date: new Date().toISOString().split('T')[0],
      peopleCount: 1,
      location: 'الدوحة، قطر',
      notes: '',
      fawranSenderPhone: '',
      fawranDepositAmount: '',
    });
    showNotice('تم تسجيل الحجز بنجاح في النظام');
  };

  // Status Badge Helper
  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'new':
        return { label: 'طلب جديد', bg: 'bg-amber-100 text-amber-900 border-amber-300' };
      case 'contacted':
        return { label: 'تم التواصل', bg: 'bg-blue-100 text-blue-900 border-blue-300' };
      case 'confirmed':
        return { label: 'مؤكد مع عربون', bg: 'bg-emerald-100 text-emerald-900 border-emerald-300' };
      case 'completed':
        return { label: 'مكتمل بنجاح', bg: 'bg-purple-100 text-purple-900 border-purple-300' };
      case 'cancelled':
        return { label: 'ملغي', bg: 'bg-rose-100 text-rose-900 border-rose-300' };
      default:
        return { label: status, bg: 'bg-neutral-100 text-neutral-800 border-neutral-300' };
    }
  };

  return (
    <div
      id="admin-control-center"
      className={
        isStandalone
          ? 'min-h-screen bg-[#240408] text-[#221013] flex flex-col p-2 sm:p-6'
          : 'fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto'
      }
      dir="rtl"
    >
      <div
        className={`relative w-full ${
          isStandalone ? 'max-w-7xl mx-auto min-h-[94vh]' : 'max-w-6xl h-[92vh]'
        } bg-[#FAF7F2] text-[#221013] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-[#5C131F]/20`}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#240408] text-[#FAF7F2] border-b border-[#5C131F]/40 shrink-0 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C9A86A]/20 border border-[#C9A86A]/40 flex items-center justify-center text-[#C9A86A]">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-wide font-arabic-display flex items-center gap-2 flex-wrap">
                <span>لوحة تحكم يسرا الكردي</span>
                <span className="text-[10px] uppercase font-sans-modern bg-[#C9A86A] text-[#240408] px-2 py-0.5 rounded-full font-bold">
                  VIP Admin
                </span>
                <span
                  className={`text-[10px] font-sans-modern px-2 py-0.5 rounded-full font-bold flex items-center gap-1 ${
                    isFirebaseConnected
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                      : 'bg-amber-950/80 text-amber-300 border border-amber-500/40'
                  }`}
                  title="حالة المزامنة السحابية اللحظية مع Firebase Firestore"
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isFirebaseConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                  <span>{isFirebaseSyncing ? 'جاري المزامنة...' : isFirebaseConnected ? 'Firebase متصل ولحظي' : 'Firebase جاري الاتصال'}</span>
                </span>
              </h2>
              <p className="text-xs text-[#FAF7F2]/60 font-sans-modern">
                إدارة شاملة لطلبات الواتساب، الخدمات، البكجات، وسياسات الحجز
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#FAF7F2]/10 hover:bg-[#FAF7F2]/20 text-xs font-semibold tracking-wide transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>العودة للموقع الرئيسي</span>
            </button>
            {onLogout && (
              <button
                onClick={onLogout}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-rose-600/80 hover:bg-rose-600 text-[#FAF7F2] text-xs font-semibold tracking-wide transition-colors cursor-pointer"
                title="تسجيل الخروج من لوحة التحكم"
              >
                <span>تسجيل الخروج</span>
              </button>
            )}
            {!isStandalone && (
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-lg flex items-center justify-center bg-white/5 hover:bg-white/10 text-[#FAF7F2] transition-colors cursor-pointer"
                aria-label="إغلاق لوحة التحكم"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Global Notification Toast */}
        {notification && (
          <div className="bg-emerald-600 text-white text-xs py-2 px-4 text-center font-medium shadow-md transition-all">
            {notification}
          </div>
        )}

        {/* Main Dashboard Layout */}
        <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
          
          {/* Sidebar Navigation */}
          <div className="w-full md:w-64 bg-[#F3ECE0] border-b md:border-b-0 md:border-l border-[#5C131F]/15 p-3 flex md:flex-col gap-1.5 shrink-0 overflow-x-auto md:overflow-y-auto">
            <button
              onClick={() => setActiveTab('bookings')}
              className={`flex items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap cursor-pointer text-start ${
                activeTab === 'bookings'
                  ? 'bg-[#5C131F] text-[#FAF7F2] shadow-sm'
                  : 'hover:bg-[#EADBCE] text-[#35080E]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4" />
                <span>طلبات الحجز والواتساب</span>
              </div>
              {newBookingsCount > 0 && (
                <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-[#C9A86A] text-[#240408]">
                  {newBookingsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('services')}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap cursor-pointer text-start ${
                activeTab === 'services'
                  ? 'bg-[#5C131F] text-[#FAF7F2] shadow-sm'
                  : 'hover:bg-[#EADBCE] text-[#35080E]'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>الخدمات وبكجات الميكب</span>
            </button>

            <button
              onClick={() => setActiveTab('bridal')}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap cursor-pointer text-start ${
                activeTab === 'bridal'
                  ? 'bg-[#5C131F] text-[#FAF7F2] shadow-sm'
                  : 'hover:bg-[#EADBCE] text-[#35080E]'
              }`}
            >
              <Crown className="w-4 h-4" />
              <span>باقات العرائس والمناسبات</span>
            </button>

            <button
              onClick={() => setActiveTab('content')}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap cursor-pointer text-start ${
                activeTab === 'content'
                  ? 'bg-[#5C131F] text-[#FAF7F2] shadow-sm'
                  : 'hover:bg-[#EADBCE] text-[#35080E]'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>محتوى السكاشن والسياسات</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap cursor-pointer text-start ${
                activeTab === 'settings'
                  ? 'bg-[#5C131F] text-[#FAF7F2] shadow-sm'
                  : 'hover:bg-[#EADBCE] text-[#35080E]'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>الإعدادات والنسخ الاحتياطي</span>
            </button>
          </div>

          {/* Tab Content Canvas */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-[#FAF7F2]">
            
            {/* TAB 1: BOOKINGS & WHATSAPP ORDERS */}
            {activeTab === 'bookings' && (
              <div className="space-y-6">
                
                {/* Stats Header */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <div className="p-4 rounded-xl bg-white border border-[#5C131F]/10 shadow-xs">
                    <span className="text-xs text-[#5C131F]/70 font-medium">إجمالي الطلبات المسجلة</span>
                    <div className="text-2xl font-bold text-[#2A050A] mt-1">{bookings.length}</div>
                  </div>
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 shadow-xs">
                    <span className="text-xs text-amber-800 font-medium">طلبات جديدة قيد المتابعة</span>
                    <div className="text-2xl font-bold text-amber-900 mt-1">{newBookingsCount}</div>
                  </div>
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 shadow-xs">
                    <span className="text-xs text-emerald-800 font-medium">حجوزات مؤكدة بعربون</span>
                    <div className="text-2xl font-bold text-emerald-900 mt-1">{confirmedCount}</div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#240408] text-[#FAF7F2] shadow-xs">
                    <span className="text-xs text-[#C9A86A] font-medium">القيمة التقديرية للحجوزات</span>
                    <div className="text-2xl font-bold mt-1 text-[#FAF7F2]">{totalRevenue.toLocaleString()} <span className="text-sm font-normal text-[#C9A86A]">ر.ق</span></div>
                  </div>
                </div>

                {/* Filters, Search & Add Button */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-[#5C131F]/10">
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                    {(['all', 'new', 'contacted', 'confirmed', 'completed', 'cancelled'] as const).map((st) => (
                      <button
                        key={st}
                        onClick={() => setBookingFilter(st)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                          bookingFilter === st
                            ? 'bg-[#5C131F] text-white'
                            : 'bg-[#F3ECE0] hover:bg-[#E5D8C7] text-[#35080E]'
                        }`}
                      >
                        {st === 'all' && 'الكل'}
                        {st === 'new' && 'جديد'}
                        {st === 'contacted' && 'تم التواصل'}
                        {st === 'confirmed' && 'مؤكد'}
                        {st === 'completed' && 'مكتمل'}
                        {st === 'cancelled' && 'ملغي'}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative flex-1 sm:w-60">
                      <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <input
                        type="text"
                        placeholder="بحث باسم العميل أو الخدمة..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-3 pr-9 py-1.5 text-xs bg-[#FAF7F2] border border-neutral-300 rounded-lg focus:outline-hidden focus:border-[#5C131F]"
                      />
                    </div>
                    <button
                      onClick={() => setShowAddBookingModal(true)}
                      className="px-3.5 py-1.5 rounded-lg bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs whitespace-nowrap"
                    >
                      <Plus className="w-4 h-4" />
                      <span>تسجيل حجز يدوي</span>
                    </button>
                  </div>
                </div>

                {/* Bookings List / Cards */}
                <div className="space-y-3">
                  {filteredBookings.length === 0 ? (
                    <div className="p-12 text-center bg-white rounded-xl border border-dashed border-[#5C131F]/20 text-neutral-500 text-sm">
                      لا توجد طلبات حجز مطابقة للبحث أو الفلتر المحدد.
                    </div>
                  ) : (
                    filteredBookings.map((booking) => {
                      const badge = getStatusBadge(booking.status);
                      return (
                        <div
                          key={booking.id}
                          className="bg-white p-4 sm:p-5 rounded-xl border border-[#5C131F]/15 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all hover:border-[#5C131F]/40"
                        >
                          <div className="space-y-1.5 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-mono text-xs font-bold text-[#5C131F] bg-[#FAF7F2] px-2 py-0.5 rounded border border-[#5C131F]/20">
                                {booking.id}
                              </span>
                              <h3 className="text-base font-bold text-[#2A050A]">
                                {booking.customerName}
                              </h3>
                              <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${badge.bg}`}>
                                {badge.label}
                              </span>
                              <span className="text-[11px] text-neutral-400 font-sans-modern" dir="ltr">
                                {new Date(booking.createdAt).toLocaleDateString('ar-QA')}
                              </span>
                            </div>

                            <div className="text-xs text-neutral-700 flex flex-wrap items-center gap-x-4 gap-y-1">
                              <span className="font-semibold text-[#5C131F]">
                                {booking.serviceName}
                              </span>
                              <span>📅 التاريخ: {booking.date}</span>
                              <span>👥 عدد الأفراد: {booking.peopleCount}</span>
                              <span>📍 الموقع: {booking.location}</span>
                              {booking.price && (
                                <span className="font-bold text-[#2A050A]">
                                  💰 {booking.price} ر.ق
                                </span>
                              )}
                            </div>

                            {booking.notes && (
                              <p className="text-xs text-neutral-500 bg-[#FAF7F2] p-2 rounded-lg border border-neutral-200/60 mt-1">
                                <span className="font-semibold">ملاحظات العميل:</span> {booking.notes}
                              </p>
                            )}

                            {/* Fawra Deposit Details */}
                            {Boolean(booking.fawranSenderPhone || booking.fawranDepositAmount) ? (
                              <div className="mt-2 p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs flex flex-wrap items-center gap-x-4 gap-y-1 text-amber-950">
                                <span className="font-bold flex items-center gap-1.5 text-[#5C131F]">
                                  <CreditCard className="w-3.5 h-3.5" />
                                  <span>عربون فورا (Fawra):</span>
                                </span>
                                {booking.fawranDepositAmount && (
                                  <span className="bg-white px-2 py-0.5 rounded border border-amber-300 font-bold text-[#2A050A]">
                                    المبلغ: {booking.fawranDepositAmount} ر.ق
                                  </span>
                                )}
                                {booking.fawranSenderPhone && (
                                  <span className="bg-white px-2 py-0.5 rounded border border-amber-300" dir="ltr">
                                    من رقم: <strong>{booking.fawranSenderPhone}</strong>
                                  </span>
                                )}
                                <span className="text-[11px] text-neutral-500">
                                  (محفظة فورا: 31061141 - YUSRA KHALIL MOHAMMAD KURDI | تنويه: 500 لشخص، 1000 لشخصين وأكثر)
                                </span>
                              </div>
                            ) : (
                              <div className="mt-1 flex items-center gap-1.5 text-[11px] text-neutral-400">
                                <CreditCard className="w-3 h-3" />
                                <span>محفظة فورا: 31061141 (YUSRA KHALIL MOHAMMAD KURDI) — العربون الموحد: {booking.peopleCount >= 2 ? '1000' : '500'} ر.ق</span>
                              </div>
                            )}
                          </div>

                          {/* Action Controls */}
                          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end pt-2 md:pt-0 border-t md:border-t-0 border-neutral-100">
                            {/* WhatsApp Direct Chat Button */}
                            {booking.customerPhone && (
                              <a
                                href={`https://wa.me/${booking.customerPhone.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 rounded-lg bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#1EBE5D] text-xs font-bold flex items-center gap-1.5 transition-colors"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                                <span>مراسلة واتساب</span>
                              </a>
                            )}

                            {/* Status Selector */}
                            <select
                              value={booking.status}
                              onChange={(e) => updateBookingStatus(booking.id, e.target.value as BookingStatus)}
                              className="text-xs font-semibold bg-[#FAF7F2] border border-neutral-300 rounded-lg px-2.5 py-1.5 focus:outline-hidden cursor-pointer"
                            >
                              <option value="new">طلب جديد</option>
                              <option value="contacted">تم التواصل</option>
                              <option value="confirmed">مؤكد مع عربون</option>
                              <option value="completed">مكتمل بنجاح</option>
                              <option value="cancelled">ملغي</option>
                            </select>

                            {/* Delete Button with inline confirmation */}
                            {confirmDeleteId === booking.id ? (
                              <div className="flex items-center gap-1 bg-rose-50 p-1 rounded-lg border border-rose-200">
                                <span className="text-[11px] font-bold text-rose-700 px-1">حذف؟</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    deleteBookingOrder(booking.id);
                                    setConfirmDeleteId(null);
                                    showNotice('تم حذف الحجز بنجاح');
                                  }}
                                  className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded text-[11px] font-bold transition-colors cursor-pointer"
                                >
                                  نعم
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setConfirmDeleteId(null)}
                                  className="px-2 py-1 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 rounded text-[11px] transition-colors cursor-pointer"
                                >
                                  إلغاء
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteId(booking.id)}
                                className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                title="حذف الحجز"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

              </div>
            )}

            {/* TAB 2: SERVICES & MAKEUP PACKAGES */}
            {activeTab === 'services' && (
              <div className="space-y-8">
                
                {/* 1. Curated Services Section */}
                <div className="bg-white p-5 rounded-xl border border-[#5C131F]/15 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                    <div>
                      <h3 className="text-base font-bold text-[#2A050A]">
                        1. الخدمات الأساسية (Curated Services)
                      </h3>
                      <p className="text-xs text-neutral-500">
                        الخدمات المعروضة في سكشن الخدمات (ميكب وشعر ويفي، نص رفعة، بكج السبشل، الألماسي لسهرات)
                      </p>
                    </div>
                    <button
                      onClick={() => setEditingService({
                        category: 'services',
                        isNew: true,
                        item: {
                          id: '',
                          number: `0${services.length + 1}`,
                          nameAr: '',
                          nameEn: '',
                          descAr: '',
                          descEn: '',
                          price: 1000,
                          detailsAr: [],
                          detailsEn: [],
                        },
                      })}
                      className="px-3 py-1.5 rounded-lg bg-[#5C131F] text-white text-xs font-bold flex items-center gap-1.5 hover:bg-[#440C16] transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>إضافة خدمة جديدة</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {services.map((svc) => (
                      <div
                        key={svc.id}
                        className="p-4 rounded-xl bg-[#FAF7F2] border border-[#5C131F]/15 flex items-start justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-[#5C131F]">{svc.number}</span>
                            <h4 className="text-sm font-bold text-[#2A050A]">{svc.nameAr}</h4>
                            {svc.isPopular && (
                              <span className="text-[10px] font-bold bg-[#C9A86A]/20 text-[#5C131F] px-1.5 py-0.5 rounded">
                                مميز
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-neutral-600">{svc.descAr}</div>
                          <div className="text-xs font-bold text-[#5C131F] pt-1">{svc.price} ر.ق</div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setEditingService({ category: 'services', isNew: false, item: svc })}
                            className="p-1.5 text-neutral-500 hover:text-[#5C131F] hover:bg-white rounded transition-colors"
                            title="تعديل"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          {confirmDeleteId === svc.id ? (
                            <div className="flex items-center gap-1 bg-rose-50 p-0.5 rounded border border-rose-200">
                              <button
                                type="button"
                                onClick={() => {
                                  deleteService('services', svc.id);
                                  setConfirmDeleteId(null);
                                  showNotice(`تم حذف خدمة "${svc.nameAr}"`);
                                }}
                                className="px-2 py-0.5 bg-rose-600 hover:bg-rose-700 text-white rounded text-[10px] font-bold transition-colors cursor-pointer"
                              >
                                حذف
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteId(null)}
                                className="px-1.5 py-0.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 rounded text-[10px] transition-colors cursor-pointer"
                              >
                                إلغاء
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(svc.id)}
                              className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-white rounded transition-colors cursor-pointer"
                              title="حذف"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Makeup Packages Section */}
                <div className="bg-white p-5 rounded-xl border border-[#5C131F]/15 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                    <div>
                      <h3 className="text-base font-bold text-[#2A050A]">
                        2. بكجات الميكب والتساريح (Makeup Packages)
                      </h3>
                      <p className="text-xs text-neutral-500">
                        البكجات المعروضة في سكشن الميكب (سمبل، سبشل، VIP، عروس مع عدسات، ملكة/حنا/خطوبة، تساريح)
                      </p>
                    </div>
                    <button
                      onClick={() => setEditingService({
                        category: 'makeup',
                        isNew: true,
                        item: {
                          id: '',
                          number: `0${makeupPackages.length + 1}`,
                          nameAr: '',
                          nameEn: '',
                          descAr: '',
                          descEn: '',
                          price: 800,
                          noteAr: 'جروبات فقط',
                        },
                      })}
                      className="px-3 py-1.5 rounded-lg bg-[#5C131F] text-white text-xs font-bold flex items-center gap-1.5 hover:bg-[#440C16] transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>إضافة بكج ميكب</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {makeupPackages.map((pkg) => (
                      <div
                        key={pkg.id}
                        className="p-4 rounded-xl bg-[#FAF7F2] border border-[#5C131F]/15 flex items-start justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-[#5C131F]">{pkg.number}</span>
                            <h4 className="text-sm font-bold text-[#2A050A]">{pkg.nameAr}</h4>
                            {pkg.noteAr && (
                              <span className="text-[10px] font-semibold bg-neutral-200 text-neutral-700 px-1.5 py-0.5 rounded">
                                {pkg.noteAr}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-neutral-600">{pkg.descAr}</div>
                          <div className="text-xs font-bold text-[#5C131F] pt-1">{pkg.price} ر.ق</div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setEditingService({ category: 'makeup', isNew: false, item: pkg })}
                            className="p-1.5 text-neutral-500 hover:text-[#5C131F] hover:bg-white rounded transition-colors"
                            title="تعديل"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          {confirmDeleteId === pkg.id ? (
                            <div className="flex items-center gap-1 bg-rose-50 p-0.5 rounded border border-rose-200">
                              <button
                                type="button"
                                onClick={() => {
                                  deleteService('makeup', pkg.id);
                                  setConfirmDeleteId(null);
                                  showNotice(`تم حذف بكج "${pkg.nameAr}"`);
                                }}
                                className="px-2 py-0.5 bg-rose-600 hover:bg-rose-700 text-white rounded text-[10px] font-bold transition-colors cursor-pointer"
                              >
                                حذف
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteId(null)}
                                className="px-1.5 py-0.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 rounded text-[10px] transition-colors cursor-pointer"
                              >
                                إلغاء
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(pkg.id)}
                              className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-white rounded transition-colors cursor-pointer"
                              title="حذف"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* TAB 3: BRIDAL & SPECIAL OCCASIONS */}
            {activeTab === 'bridal' && (
              <div className="space-y-8">
                
                {/* 1. Bridal Packages */}
                <div className="bg-white p-5 rounded-xl border border-[#5C131F]/15 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                    <div>
                      <h3 className="text-base font-bold text-[#2A050A]">
                        باقات العرائس الملكية (Bridal Packages)
                      </h3>
                      <p className="text-xs text-neutral-500">
                        البكج الذهبي، البكج الألماسي، والأسعار والتفاصيل
                      </p>
                    </div>
                    <button
                      onClick={() => setEditingBridal({
                        isNew: true,
                        item: {
                          id: '',
                          badgeAr: 'عروس زفاف',
                          nameAr: 'بكج عروس جديد',
                          nameEn: 'New Bridal Package',
                          price: 2800,
                          featuresAr: ['ميكب وتسريحه', 'تلبيس طرحه', 'تغطيات جسم وهايلايت', 'عدسات'],
                          featuresEn: ['Makeup & Hair', 'Veil placement', 'Body coverage', 'Lenses'],
                        },
                      })}
                      className="px-3 py-1.5 rounded-lg bg-[#5C131F] text-white text-xs font-bold flex items-center gap-1.5 hover:bg-[#440C16] transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>إضافة باقة عروس</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {bridalPackages.map((bkg) => (
                      <div
                        key={bkg.id}
                        className="p-5 rounded-xl bg-[#FAF7F2] border border-[#5C131F]/20 space-y-3 relative overflow-hidden"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-bold bg-[#5C131F]/10 text-[#5C131F] px-2 py-0.5 rounded">
                              {bkg.badgeAr}
                            </span>
                            <h4 className="text-base font-bold text-[#2A050A] mt-1">{bkg.nameAr}</h4>
                            <div className="text-sm font-bold text-[#5C131F] mt-0.5">{bkg.price} ر.ق</div>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => setEditingBridal({ isNew: false, item: bkg })}
                              className="p-1.5 text-neutral-500 hover:text-[#5C131F] hover:bg-white rounded transition-colors"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            {confirmDeleteId === bkg.id ? (
                              <div className="flex items-center gap-1 bg-rose-50 p-0.5 rounded border border-rose-200">
                                <button
                                  type="button"
                                  onClick={() => {
                                    deleteBridalPackage(bkg.id);
                                    setConfirmDeleteId(null);
                                    showNotice(`تم حذف باقة "${bkg.nameAr}"`);
                                  }}
                                  className="px-2 py-0.5 bg-rose-600 hover:bg-rose-700 text-white rounded text-[10px] font-bold transition-colors cursor-pointer"
                                >
                                  حذف
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setConfirmDeleteId(null)}
                                  className="px-1.5 py-0.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 rounded text-[10px] transition-colors cursor-pointer"
                                >
                                  إلغاء
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteId(bkg.id)}
                                className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-white rounded transition-colors cursor-pointer"
                                title="حذف"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>

                        {bkg.highlightAr && (
                          <div className="text-xs font-bold text-[#C9A86A] bg-[#240408] px-2.5 py-1 rounded-md inline-block">
                            {bkg.highlightAr}
                          </div>
                        )}

                        <ul className="text-xs space-y-1 text-neutral-700">
                          {bkg.featuresAr.map((f, i) => (
                            <li key={i} className="flex items-center gap-1.5">
                              <span className="text-[#5C131F]">•</span>
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Special Occasion Package */}
                <div className="bg-white p-5 rounded-xl border border-[#5C131F]/15 shadow-xs space-y-4">
                  <div className="pb-3 border-b border-neutral-100">
                    <h3 className="text-base font-bold text-[#2A050A]">
                      باقة المناسبات الخاصة (الملكة، الحناء، الخطوبة، الاستقبال)
                    </h3>
                    <p className="text-xs text-neutral-500">
                      تعديل السعر والنص التعريفي
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        عنوان الباقة (عربي)
                      </label>
                      <input
                        type="text"
                        value={specialOccasion.titleAr}
                        onChange={(e) => updateSpecialOccasion({ titleAr: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-neutral-300 rounded-lg focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        السعر (ر.ق)
                      </label>
                      <input
                        type="number"
                        value={specialOccasion.price}
                        onChange={(e) => updateSpecialOccasion({ price: Number(e.target.value) || 0 })}
                        className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-neutral-300 rounded-lg focus:outline-hidden"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        الوصف التعريفي (عربي)
                      </label>
                      <textarea
                        rows={2}
                        value={specialOccasion.descAr}
                        onChange={(e) => updateSpecialOccasion({ descAr: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-neutral-300 rounded-lg focus:outline-hidden"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => showNotice('تم حفظ إعدادات المناسبات الخاصة')}
                    className="px-4 py-2 bg-[#5C131F] text-white text-xs font-bold rounded-lg hover:bg-[#440C16] transition-colors"
                  >
                    حفظ التعديلات
                  </button>
                </div>

              </div>
            )}

            {/* TAB 4: SECTIONS CONTENT & POLICIES */}
            {activeTab === 'content' && (
              <div className="space-y-8">
                
                {/* 1. Hero Content */}
                <div className="bg-white p-5 rounded-xl border border-[#5C131F]/15 shadow-xs space-y-4">
                  <h3 className="text-base font-bold text-[#2A050A] pb-2 border-b border-neutral-100">
                    واجهة الهيرو (الواجهة الرئيسية)
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">اسم العلامة (عربي)</label>
                      <input
                        type="text"
                        value={hero.titleAr}
                        onChange={(e) => updateHero({ titleAr: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-neutral-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">العنوان الفرعي (عربي)</label>
                      <input
                        type="text"
                        value={hero.subtitleAr}
                        onChange={(e) => updateHero({ subtitleAr: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-neutral-300 rounded-lg"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-neutral-700 mb-1">المقولة التوقيعية (Quote)</label>
                      <input
                        type="text"
                        value={hero.quoteAr}
                        onChange={(e) => updateHero({ quoteAr: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-neutral-300 rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. About Section */}
                <div className="bg-white p-5 rounded-xl border border-[#5C131F]/15 shadow-xs space-y-4">
                  <h3 className="text-base font-bold text-[#2A050A] pb-2 border-b border-neutral-100">
                    سكشن النبذة التعريفية (About Yusra)
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-neutral-700 mb-1">العنوان العريض</label>
                      <input
                        type="text"
                        value={about.headlineAr}
                        onChange={(e) => updateAbout({ headlineAr: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-neutral-300 rounded-lg"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-neutral-700 mb-1">الفقرة الأولى</label>
                      <textarea
                        rows={2}
                        value={about.bio1Ar}
                        onChange={(e) => updateAbout({ bio1Ar: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-neutral-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">سنوات الخبرة</label>
                      <input
                        type="number"
                        value={about.experienceYears}
                        onChange={(e) => updateAbout({ experienceYears: Number(e.target.value) || 0 })}
                        className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-neutral-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">عدد العرائس والمناسبات</label>
                      <input
                        type="text"
                        value={about.bridesServed}
                        onChange={(e) => updateAbout({ bridesServed: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-neutral-300 rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Booking Policy */}
                <div className="bg-white p-5 rounded-xl border border-[#5C131F]/15 shadow-xs space-y-4">
                  <h3 className="text-base font-bold text-[#2A050A] pb-2 border-b border-neutral-100">
                    سياسة الحجز المعتمدة (Booking Policy)
                  </h3>
                  <div className="space-y-2">
                    {policies.rulesAr.map((rule, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#5C131F] w-5">{idx + 1}.</span>
                        <input
                          type="text"
                          value={rule}
                          onChange={(e) => {
                            const newRules = [...policies.rulesAr];
                            newRules[idx] = e.target.value;
                            updatePolicies(newRules, policies.rulesEn);
                          }}
                          className="flex-1 px-3 py-1.5 text-xs bg-[#FAF7F2] border border-neutral-300 rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newRules = policies.rulesAr.filter((_, i) => i !== idx);
                            updatePolicies(newRules, policies.rulesEn);
                          }}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        updatePolicies([...policies.rulesAr, 'بند جديد في سياسة الحجز'], policies.rulesEn);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#FAF7F2] text-[#5C131F] border border-[#5C131F]/20 text-xs font-bold flex items-center gap-1 hover:bg-[#5C131F] hover:text-white transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>إضافة بند في سياسة الحجز</span>
                    </button>
                  </div>
                </div>

                {/* 4. Contact & Socials */}
                <div className="bg-white p-5 rounded-xl border border-[#5C131F]/15 shadow-xs space-y-4">
                  <h3 className="text-base font-bold text-[#2A050A] pb-2 border-b border-neutral-100">
                    أرقام الواتساب وحسابات السوشيال ميديا
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        رقم الواتساب الدولي (بدون + أو مسافات)
                      </label>
                      <input
                        type="text"
                        value={brand.whatsappRaw}
                        onChange={(e) => updateBrand({ whatsappRaw: e.target.value, whatsappNumber: `+${e.target.value}` })}
                        className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-neutral-300 rounded-lg"
                        dir="ltr"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        رقم العرض الظاهر للعملاء
                      </label>
                      <input
                        type="text"
                        value={brand.whatsappDisplay}
                        onChange={(e) => updateBrand({ whatsappDisplay: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-neutral-300 rounded-lg"
                        dir="ltr"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">رابط انستغرام</label>
                      <input
                        type="text"
                        value={brand.instagram}
                        onChange={(e) => updateBrand({ instagram: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-neutral-300 rounded-lg"
                        dir="ltr"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">رابط تيك توك</label>
                      <input
                        type="text"
                        value={brand.tiktok}
                        onChange={(e) => updateBrand({ tiktok: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-neutral-300 rounded-lg"
                        dir="ltr"
                      />
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 5: BACKUP & SETTINGS */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div className="bg-white p-5 rounded-xl border border-[#5C131F]/15 shadow-xs space-y-4">
                  <h3 className="text-base font-bold text-[#2A050A] pb-2 border-b border-neutral-100">
                    النسخ الاحتياطي واستعادة البيانات
                  </h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    يتم حفظ كافة تعديلات الخدمات والبكجات وطلبات الحجز تلقائياً على متصفحك. يمكنك تنزيل نسخة احتياطية من كافة البيانات كملف JSON واستعادتها في أي وقت على أي جهاز آخر.
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        const json = exportDataJSON();
                        const blob = new Blob([json], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `yusra-alkordi-backup-${new Date().toISOString().split('T')[0]}.json`;
                        a.click();
                        URL.revokeObjectURL(url);
                        showNotice('تم تحميل ملف النسخة الاحتياطية بنجاح');
                      }}
                      className="px-4 py-2 rounded-lg bg-[#5C131F] text-white text-xs font-bold flex items-center gap-2 hover:bg-[#440C16] transition-colors cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>تصدير نسخة احتياطية (JSON)</span>
                    </button>

                    <label className="px-4 py-2 rounded-lg bg-[#F3ECE0] text-[#5C131F] border border-[#5C131F]/20 text-xs font-bold flex items-center gap-2 hover:bg-[#E5D8C7] transition-colors cursor-pointer">
                      <Upload className="w-4 h-4" />
                      <span>استيراد نسخة احتياطية</span>
                      <input
                        type="file"
                        accept=".json"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              const content = event.target?.result as string;
                              if (importDataJSON(content)) {
                                showNotice('تمت استعادة النسخة بنجاح');
                              } else {
                                showNotice('الملف غير صالح، يرجى التأكد من اختيار ملف JSON صحيح');
                              }
                            };
                            reader.readAsText(file);
                          }
                        }}
                      />
                    </label>

                    {confirmReset ? (
                      <div className="flex items-center gap-2 bg-rose-50 p-2 rounded-lg border border-rose-300">
                        <span className="text-xs font-bold text-rose-700">تأكيد استعادة الضبط الافتراضي للموقع بالكامل؟</span>
                        <button
                          type="button"
                          onClick={() => {
                            resetToDefaults();
                            setConfirmReset(false);
                            showNotice('تمت استعادة الضبط الافتراضي للموقع بالكامل');
                          }}
                          className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-bold transition-colors cursor-pointer"
                        >
                          نعم، استعادة
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmReset(false)}
                          className="px-2 py-1 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 rounded text-xs transition-colors cursor-pointer"
                        >
                          إلغاء
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmReset(true)}
                        className="px-4 py-2 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold flex items-center gap-2 hover:bg-rose-100 transition-colors cursor-pointer"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>استعادة الضبط الافتراضي للموقع</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Admin Credentials / Security Management */}
                <div className="bg-white p-5 rounded-xl border border-[#5C131F]/15 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                    <div>
                      <h3 className="text-base font-bold text-[#2A050A] flex items-center gap-2">
                        <Shield className="w-4 h-4 text-[#5C131F]" />
                        <span>أمان الدخول وحساب الإدارة (Admin Login Credentials)</span>
                      </h3>
                      <p className="text-xs text-neutral-500">
                        يمكنك تغيير اسم المستخدم وكلمة المرور الخاصة بلوحة التحكم من هنا في أي وقت
                      </p>
                    </div>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!newAdminUser.trim()) {
                        showNotice('يرجى تحديد اسم مستخدم صالح');
                        return;
                      }
                      const updated = {
                        username: newAdminUser.trim(),
                        password: newAdminPass ? newAdminPass : (customCreds.password || 'yusra2026'),
                      };
                      try {
                        localStorage.setItem('yusra_admin_credentials', JSON.stringify(updated));
                        setCustomCreds(updated);
                        setNewAdminPass('');
                        showNotice('تم تحديث بيانات تسجيل الدخول للوحة التحكم بنجاح');
                      } catch (err) {
                        console.error(err);
                      }
                    }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                  >
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        اسم المستخدم (Username)
                      </label>
                      <input
                        type="text"
                        value={newAdminUser}
                        onChange={(e) => setNewAdminUser(e.target.value)}
                        placeholder="اسم المستخدم (افتراضي: yusra)"
                        className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-neutral-300 rounded-lg focus:outline-hidden focus:border-[#5C131F]"
                        required
                        dir="ltr"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        كلمة المرور الجديدة (اتركيها فارغة إن لم ترغبي بتغييرها)
                      </label>
                      <input
                        type="password"
                        value={newAdminPass}
                        onChange={(e) => setNewAdminPass(e.target.value)}
                        placeholder="أدخلي كلمة مرور جديدة..."
                        className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-neutral-300 rounded-lg focus:outline-hidden focus:border-[#5C131F]"
                        dir="ltr"
                      />
                    </div>
                    <div className="sm:col-span-2 flex items-center justify-between pt-2">
                      <span className="text-[11px] text-neutral-500">
                        * ملحوظة: الحقول في شاشة تسجيل الدخول تكون دائماً فارغة بدون كتابة مسبقة لضمان الأمان والخصوصية.
                      </span>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-lg bg-[#5C131F] text-white text-xs font-bold hover:bg-[#440C16] transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>حفظ بيانات الدخول</span>
                      </button>
                    </div>
                  </form>
                </div>

                {/* Fawra Wallet Configuration Info */}
                <div className="bg-amber-50/70 p-5 rounded-xl border border-amber-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-amber-200">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-[#5C131F]" />
                      <h3 className="text-base font-bold text-[#2A050A]">
                        بيانات محفظة فورا للعربون (Fawra Instant Payment)
                      </h3>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                      مفعّلة في نموذج الحجز والواتساب
                    </span>
                  </div>
                  {/* Deposit Notice Highlight */}
                  <div className="p-3 bg-white rounded-lg border border-[#C9A86A]/60 flex items-center justify-between gap-3 text-xs">
                    <span className="font-bold text-[#5C131F]">
                      تنويه العربون الموحد:
                    </span>
                    <span className="font-extrabold text-[#2A050A] bg-amber-100/80 px-2.5 py-1 rounded-md">
                      يتوحد العربون لشخص ٥٠٠ ر.ق ، ولشخصين وأكثر ١٠٠٠ ر.ق
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600">
                    تظهر هذه البيانات مباشرة للعملاء عند الحجز في الموقع لطلب تحويل العربون، وتُرسل تلقائياً إلى واتساب مع بيانات التحويل:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white p-3 rounded-lg border border-amber-200">
                      <span className="block text-[11px] text-neutral-500 font-bold mb-1">رقم محفظة فورا:</span>
                      <span className="text-base font-mono font-bold text-[#5C131F]" dir="ltr">31061141</span>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-amber-200">
                      <span className="block text-[11px] text-neutral-500 font-bold mb-1">اسم المستفيد المعتمد:</span>
                      <span className="text-sm font-bold text-[#2A050A]" dir="ltr">YUSRA KHALIL MOHAMMAD KURDI</span>
                    </div>
                  </div>
                </div>

                {/* System Specs & Database Status */}
                <div className="bg-[#FAF7F2] p-5 rounded-xl border border-[#5C131F]/15 text-xs text-neutral-600 space-y-2.5">
                  <div className="font-bold text-[#2A050A] flex items-center justify-between">
                    <span>حالة النظام وقاعدة البيانات:</span>
                    <span className="flex items-center gap-1.5 font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-full text-[11px]">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      <span>{isFirebaseConnected ? 'Firebase Live Connected' : 'Firebase Syncing'}</span>
                    </span>
                  </div>
                  <div>• قاعدة البيانات السحابية: <strong>Firebase Firestore</strong> (مشروع: <code>yusradb-1d948</code>)</div>
                  <div>• المزامنة: مزامنة فورية تلقائية لحظية (Real-time Snapshot Sync) مع جميع الأجهزة</div>
                  <div>• رابط لوحة التحكم المباشر: <code>/admin</code> أو <code>#admin</code></div>
                  <div>• Cloudinary Cloud: <code>o8xawiyy</code> (Preset: <code>yousra_img</code>)</div>
                  <div>• رقم الواتساب المربوط: <strong>{brand.whatsappDisplay}</strong></div>
                  <div>• حقوق التصميم والتطوير: <strong>SolimanMedia</strong></div>
                </div>

              </div>
            )}

          </div>

        </div>

      </div>

      {/* MODAL 1: ADD MANUAL BOOKING */}
      {showAddBookingModal && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-[#5C131F]/20">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="text-base font-bold text-[#2A050A]">تسجيل حجز يدوي جديد</h3>
              <button onClick={() => setShowAddBookingModal(false)} className="text-neutral-400 hover:text-neutral-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateManualBooking} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">اسم العميلة *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: سارة الكواري"
                  value={newBookingData.customerName}
                  onChange={(e) => setNewBookingData({ ...newBookingData, customerName: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-neutral-300 rounded-lg focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">رقم الواتساب</label>
                  <input
                    type="text"
                    placeholder="+974 5512 3456"
                    value={newBookingData.customerPhone}
                    onChange={(e) => setNewBookingData({ ...newBookingData, customerPhone: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-neutral-300 rounded-lg focus:outline-hidden"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">تاريخ المناسبة</label>
                  <input
                    type="date"
                    required
                    value={newBookingData.date}
                    onChange={(e) => setNewBookingData({ ...newBookingData, date: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-neutral-300 rounded-lg focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">الخدمة أو البكج المطلوب</label>
                <input
                  type="text"
                  required
                  value={newBookingData.serviceName}
                  onChange={(e) => setNewBookingData({ ...newBookingData, serviceName: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-neutral-300 rounded-lg focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">السعر (ر.ق)</label>
                  <input
                    type="number"
                    value={newBookingData.price}
                    onChange={(e) => setNewBookingData({ ...newBookingData, price: Number(e.target.value) || 0 })}
                    className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-neutral-300 rounded-lg focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">عدد الأفراد</label>
                  <input
                    type="number"
                    min={1}
                    value={newBookingData.peopleCount}
                    onChange={(e) => setNewBookingData({ ...newBookingData, peopleCount: Number(e.target.value) || 1 })}
                    className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-neutral-300 rounded-lg focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">المنطقة / الموقع</label>
                <input
                  type="text"
                  placeholder="مثال: الدوحة - لوسيل"
                  value={newBookingData.location}
                  onChange={(e) => setNewBookingData({ ...newBookingData, location: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-neutral-300 rounded-lg focus:outline-hidden"
                />
              </div>

              {/* Fawra Deposit Section in Manual Booking Modal */}
              <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200/80 space-y-2">
                <div className="flex items-center justify-between gap-1 text-xs font-bold text-[#5C131F] flex-wrap">
                  <span className="flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-[#C9A86A]" />
                    <span>بيانات عربون فورا (محفظة: 31061141)</span>
                  </span>
                  <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-amber-300 font-semibold text-amber-900">
                    تنويه: 500 لشخص | 1000 لشخصين وأكثر
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                      المبلغ المحوّل (ر.ق)
                    </label>
                    <input
                      type="text"
                      placeholder={newBookingData.peopleCount >= 2 ? 'المطلوب: 1000' : 'المطلوب: 500'}
                      value={newBookingData.fawranDepositAmount}
                      onChange={(e) => setNewBookingData({ ...newBookingData, fawranDepositAmount: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-amber-300 rounded-lg focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-700 mb-1">رقم هاتف المحوّل (فورا)</label>
                    <input
                      type="text"
                      dir="ltr"
                      placeholder="مثال: 55XXXXXX"
                      value={newBookingData.fawranSenderPhone}
                      onChange={(e) => setNewBookingData({ ...newBookingData, fawranSenderPhone: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-amber-300 rounded-lg focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">ملاحظات إضافية</label>
                <textarea
                  rows={2}
                  placeholder="تفاصيل التوقيت أو طلبات خاصة..."
                  value={newBookingData.notes}
                  onChange={(e) => setNewBookingData({ ...newBookingData, notes: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-neutral-300 rounded-lg focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setShowAddBookingModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 rounded-lg"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded-lg transition-colors cursor-pointer"
                >
                  حفظ الحجز في النظام
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT / ADD SERVICE MODAL */}
      {editingService && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-[#5C131F]/20">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="text-base font-bold text-[#2A050A]">
                {editingService.isNew ? 'إضافة خدمة جديدة' : 'تعديل الخدمة'}
              </h3>
              <button onClick={() => setEditingService(null)} className="text-neutral-400 hover:text-neutral-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="block text-xs font-bold text-neutral-700 mb-1">الرقم / الكود</label>
                  <input
                    type="text"
                    value={editingService.item.number}
                    onChange={(e) => setEditingService({
                      ...editingService,
                      item: { ...editingService.item, number: e.target.value },
                    })}
                    className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-neutral-300 rounded-lg"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-neutral-700 mb-1">اسم الخدمة (عربي) *</label>
                  <input
                    type="text"
                    required
                    value={editingService.item.nameAr}
                    onChange={(e) => {
                      const val = e.target.value;
                      setEditingService({
                        ...editingService,
                        item: {
                          ...editingService.item,
                          nameAr: val,
                          nameEn: autoTranslateArabicToEnglish(val),
                        },
                      });
                    }}
                    className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-neutral-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-neutral-700">اسم الخدمة بالإنجليزية (Name in English)</label>
                  <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    ✨ يترجم تلقائياً
                  </span>
                </div>
                <input
                  type="text"
                  dir="ltr"
                  placeholder="e.g. Glamour Makeup"
                  value={editingService.item.nameEn || ''}
                  onChange={(e) => setEditingService({
                    ...editingService,
                    item: { ...editingService.item, nameEn: e.target.value },
                  })}
                  className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-neutral-300 rounded-lg text-left"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">السعر (ر.ق) *</label>
                  <input
                    type="number"
                    required
                    value={editingService.item.price}
                    onChange={(e) => setEditingService({
                      ...editingService,
                      item: { ...editingService.item, price: Number(e.target.value) || 0 },
                    })}
                    className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-neutral-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">ملاحظة (مثال: جروبات فقط)</label>
                  <input
                    type="text"
                    value={editingService.item.noteAr || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setEditingService({
                        ...editingService,
                        item: {
                          ...editingService.item,
                          noteAr: val,
                          noteEn: autoTranslateArabicToEnglish(val),
                        },
                      });
                    }}
                    className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-neutral-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">الوصف المختصر (عربي)</label>
                <textarea
                  rows={2}
                  value={editingService.item.descAr || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setEditingService({
                      ...editingService,
                      item: {
                        ...editingService.item,
                        descAr: val,
                        descEn: autoTranslateArabicToEnglish(val),
                      },
                    });
                  }}
                  className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-neutral-300 rounded-lg"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-neutral-700">الوصف بالإنجليزية (Description En)</label>
                  <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    ✨ يترجم تلقائياً
                  </span>
                </div>
                <textarea
                  rows={2}
                  dir="ltr"
                  placeholder="English description"
                  value={editingService.item.descEn || ''}
                  onChange={(e) => setEditingService({
                    ...editingService,
                    item: { ...editingService.item, descEn: e.target.value },
                  })}
                  className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-neutral-300 rounded-lg text-left"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 rounded-lg"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-[#5C131F] hover:bg-[#440C16] text-white rounded-lg transition-colors cursor-pointer"
                >
                  حفظ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: EDIT / ADD BRIDAL MODAL */}
      {editingBridal && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-[#5C131F]/20">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="text-base font-bold text-[#2A050A]">
                {editingBridal.isNew ? 'إضافة باقة عروس جديدة' : 'تعديل باقة العروس'}
              </h3>
              <button onClick={() => setEditingBridal(null)} className="text-neutral-400 hover:text-neutral-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBridal} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">اسم الباقة (عربي) *</label>
                <input
                  type="text"
                  required
                  value={editingBridal.item.nameAr}
                  onChange={(e) => {
                    const val = e.target.value;
                    setEditingBridal({
                      ...editingBridal,
                      item: {
                        ...editingBridal.item,
                        nameAr: val,
                        nameEn: autoTranslateArabicToEnglish(val),
                      },
                    });
                  }}
                  className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-neutral-300 rounded-lg"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-neutral-700">اسم الباقة بالإنجليزية (Package Name En)</label>
                  <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    ✨ يترجم تلقائياً
                  </span>
                </div>
                <input
                  type="text"
                  dir="ltr"
                  placeholder="e.g. Royal VIP Bridal Package"
                  value={editingBridal.item.nameEn || ''}
                  onChange={(e) => setEditingBridal({
                    ...editingBridal,
                    item: { ...editingBridal.item, nameEn: e.target.value },
                  })}
                  className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-neutral-300 rounded-lg text-left"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">السعر (ر.ق) *</label>
                  <input
                    type="number"
                    required
                    value={editingBridal.item.price}
                    onChange={(e) => setEditingBridal({
                      ...editingBridal,
                      item: { ...editingBridal.item, price: Number(e.target.value) || 0 },
                    })}
                    className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-neutral-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">الشارة (Badge)</label>
                  <input
                    type="text"
                    value={editingBridal.item.badgeAr || ''}
                    onChange={(e) => setEditingBridal({
                      ...editingBridal,
                      item: { ...editingBridal.item, badgeAr: e.target.value },
                    })}
                    className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-neutral-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">ميزة استثنائية (Highlight)</label>
                <input
                  type="text"
                  placeholder="مثال: يشمل مرافقة مجاناً (والدتها أو أختها)"
                  value={editingBridal.item.highlightAr || ''}
                  onChange={(e) => setEditingBridal({
                    ...editingBridal,
                    item: { ...editingBridal.item, highlightAr: e.target.value },
                  })}
                  className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-neutral-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  المميزات (اكتبي كل ميزة في سطر منفصل)
                </label>
                <textarea
                  rows={4}
                  value={editingBridal.item.featuresAr.join('\n')}
                  onChange={(e) => setEditingBridal({
                    ...editingBridal,
                    item: { ...editingBridal.item, featuresAr: e.target.value.split('\n').filter(Boolean) },
                  })}
                  className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-neutral-300 rounded-lg font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setEditingBridal(null)}
                  className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 rounded-lg"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-[#5C131F] hover:bg-[#440C16] text-white rounded-lg transition-colors cursor-pointer"
                >
                  حفظ الباقة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
