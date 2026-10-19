import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Sparkles, RefreshCw, AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in Atelier Applet:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleResetCache = () => {
    try {
      localStorage.removeItem('yusra_alkordi_site_data_v2');
      localStorage.removeItem('yusra_alkordi_site_data_v1');
      sessionStorage.clear();
    } catch {
      // ignore
    }
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAF7F2] text-[#2A050A] flex items-center justify-center p-6" dir="rtl">
          <div className="max-w-lg w-full bg-white rounded-3xl p-8 sm:p-10 border border-[#C9A86A]/40 shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-[#5C131F]/10 border border-[#C9A86A]/50 text-[#5C131F] flex items-center justify-center mx-auto shadow-sm">
              <Sparkles className="w-8 h-8 text-[#C9A86A]" />
            </div>

            <div>
              <span className="text-xs uppercase tracking-widest text-[#C9A86A] font-bold block mb-1">
                أتيليه يسرا الكردي للجمال
              </span>
              <h2 className="text-2xl font-bold text-[#2A050A] font-arabic">
                حدث تحديث في الصفحة
              </h2>
              <p className="text-sm text-[#5C131F]/80 mt-2 font-sans-modern leading-relaxed">
                تم تحديث بيانات الموقع بنجاح. يرجى إعادة تحميل الصفحة لمتابعة التصفح والحجز بأحدث الخيارات.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#5C131F] hover:bg-[#470F18] text-[#FAF7F2] text-sm font-bold shadow-md transition-all cursor-pointer"
              >
                <RefreshCw className="w-4 h-4 text-[#C9A86A]" />
                <span>إعادة تحميل الموقع</span>
              </button>

              <button
                type="button"
                onClick={this.handleResetCache}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-sm font-medium border border-neutral-200 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-neutral-500" />
                <span>تحديث البيانات المحفوظة</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
