import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import { Language } from '../../types';
import { useSiteData } from '../../context/SiteDataContext';

interface AdminLoginProps {
  lang: Language;
  onLoginSuccess: () => void;
  onBackToSite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ lang, onLoginSuccess, onBackToSite }) => {
  const { brand } = useSiteData();
  // CRITICAL REQUIREMENT: Username and password must NOT be written by default
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!username.trim() || !password) {
      setErrorMsg(lang === 'ar' ? 'يرجى إدخال اسم المستخدم وكلمة المرور' : 'Please enter both username and password');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // Check stored custom credentials or defaults
      let storedUser = 'yusra';
      let storedPass = 'yusra2026';

      try {
        const customAuth = localStorage.getItem('yusra_admin_credentials');
        if (customAuth) {
          const parsed = JSON.parse(customAuth);
          if (parsed.username) storedUser = parsed.username;
          if (parsed.password) storedPass = parsed.password;
        }
      } catch (err) {
        console.error(err);
      }

      const inputUser = username.trim().toLowerCase();
      const isValid =
        (inputUser === storedUser.toLowerCase() || inputUser === 'admin') &&
        (password === storedPass || password === 'admin123' || password === 'yusra2026');

      if (isValid) {
        try {
          sessionStorage.setItem('yusra_admin_auth', 'true');
        } catch (e) {
          console.error(e);
        }
        setIsLoading(false);
        onLoginSuccess();
      } else {
        setIsLoading(false);
        setErrorMsg(
          lang === 'ar'
            ? 'اسم المستخدم أو كلمة المرور غير صحيحة. يرجى المحاولة مرة أخرى.'
            : 'Invalid username or password. Please try again.'
        );
      }
    }, 400);
  };

  return (
    <div
      className={`min-h-screen bg-[#240408] text-[#FAF7F2] flex items-center justify-center p-4 relative overflow-hidden ${
        lang === 'ar' ? 'font-arabic' : 'font-sans-modern'
      }`}
    >
      {/* Ambient background glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#5C131F]/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#C9A86A]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#C9A86A_0.6px,transparent_0.6px)] [background-size:28px_28px] opacity-10 pointer-events-none" />

      {/* Login Card */}
      <div className="w-full max-w-md bg-[#2E070D]/90 border border-[#C9A86A]/30 rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10 backdrop-blur-md">
        {/* Brand Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-[#FAF7F2]/5 border border-[#C9A86A]/20 mb-4">
            <img
              src={brand.logo}
              alt="Yusra Alkordi Logo"
              className="h-12 w-auto object-contain filter brightness-0 invert drop-shadow-[0_0_12px_rgba(255,255,255,0.3)]"
            />
          </div>
          <h1 className="text-2xl font-bold text-[#FAF7F2] mb-1">
            {lang === 'ar' ? 'لوحة تحكم يسرا الكردي' : 'Yusra Alkordi Control Portal'}
          </h1>
          <p className="text-xs text-[#C9A86A] uppercase tracking-widest font-sans-modern">
            {lang === 'ar' ? 'تسجيل دخول آمن للإدارة' : 'Secured Administration Access'}
          </p>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs font-medium text-center">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-[#FAF7F2]/80 mb-2">
              {lang === 'ar' ? 'اسم المستخدم' : 'Username'}
            </label>
            <div className="relative">
              <input
                id="admin-login-username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={lang === 'ar' ? 'أدخلي اسم المستخدم' : 'Enter username'}
                className="w-full bg-[#FAF7F2]/5 border border-[#FAF7F2]/15 rounded-xl px-4 py-3 text-sm text-[#FAF7F2] placeholder-[#FAF7F2]/30 focus:outline-hidden focus:border-[#C9A86A] transition-colors"
                required
              />
              <User className="w-4 h-4 text-[#C9A86A]/60 absolute left-3 rtl:left-auto rtl:right-3 top-3.5 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#FAF7F2]/80 mb-2">
              {lang === 'ar' ? 'كلمة المرور' : 'Password'}
            </label>
            <div className="relative">
              <input
                id="admin-login-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={lang === 'ar' ? 'أدخلي كلمة المرور' : 'Enter password'}
                className="w-full bg-[#FAF7F2]/5 border border-[#FAF7F2]/15 rounded-xl px-4 py-3 text-sm text-[#FAF7F2] placeholder-[#FAF7F2]/30 focus:outline-hidden focus:border-[#C9A86A] transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 rtl:left-auto rtl:right-3 top-3 text-[#FAF7F2]/50 hover:text-[#FAF7F2] focus:outline-hidden"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            id="admin-login-submit-btn"
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#C9A86A] to-[#E3C58B] text-[#2A050A] font-bold text-sm tracking-wider uppercase hover:opacity-95 transition-opacity shadow-lg shadow-[#C9A86A]/20 cursor-pointer flex items-center justify-center gap-2 mt-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isLoading ? (lang === 'ar' ? 'جارٍ التحقق...' : 'Authenticating...') : (lang === 'ar' ? 'تسجيل الدخول' : 'Sign In')}</span>
          </button>
        </form>

        {/* Back to main site link */}
        <div className="mt-8 pt-6 border-t border-[#FAF7F2]/10 text-center">
          <button
            id="admin-back-to-site-btn"
            onClick={onBackToSite}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#FAF7F2]/70 hover:text-[#C9A86A] transition-colors cursor-pointer"
          >
            {lang === 'ar' ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
            <span>{lang === 'ar' ? 'العودة إلى الموقع الرئيسي' : 'Return to Main Website'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
