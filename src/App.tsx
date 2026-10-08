import { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    document.documentElement.lang = 'ar';
    document.documentElement.dir = 'rtl';
    document.title = 'تم إيقاف الموقع';
  }, []);

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center p-6 select-none font-arabic">
      <div className="max-w-2xl w-full text-center px-4 py-12">
        <h1 className="text-white text-xl sm:text-2xl md:text-3xl font-bold leading-relaxed tracking-wide">
          تم ايقاف موقعك نهائيا لعدم سداد المستحقات الخاصة بالموقع الالكتروني
        </h1>
      </div>
    </div>
  );
}
