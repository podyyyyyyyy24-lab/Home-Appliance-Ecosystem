import prisma from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Smartphone, ShieldCheck, Zap, Sparkles } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export const dynamic = 'force-dynamic';

// Fallback images for tech categories when no cover image is set
const fallbackImages: Record<string, string> = {
  "Smartphones": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=75&auto=format&fit=crop",
  "Screen Protectors": "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&q=75&auto=format&fit=crop",
  "Cases & Covers": "https://images.unsplash.com/photo-1586105251261-72a756497a11?w=800&q=75&auto=format&fit=crop",
  "Chargers & Cables": "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&q=75&auto=format&fit=crop",
  "Audio & Wearables": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=75&auto=format&fit=crop",
  "Perfumes": "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&q=70&auto=format&fit=crop",
  "Accessories": "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=75&auto=format&fit=crop",
};

export default async function Storefront() {
  let categories: any[] = [];

  try {
    categories = await prisma.category.findMany({
      where: { active: true },
      include: { _count: { select: { items: true } } },
      orderBy: { sortOrder: "asc" },
    });
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    // Use tech categories fallback if DB is down
    categories = [
      { id: "smartphones", nameAr: "الهواتف الذكية", nameEn: "Smartphones", codePrefix: "MOB", active: true, image: null, _count: { items: 0 } },
      { id: "screen-protectors", nameAr: "اسكرينات وحماية", nameEn: "Screen Protectors", codePrefix: "SCR", active: true, image: null, _count: { items: 0 } },
      { id: "cases", nameAr: "جرابات وكڤرات", nameEn: "Cases & Covers", codePrefix: "CAS", active: true, image: null, _count: { items: 0 } },
      { id: "chargers", nameAr: "شواحن وكابلات", nameEn: "Chargers & Cables", codePrefix: "CHG", active: true, image: null, _count: { items: 0 } },
      { id: "audio", nameAr: "سماعات وساعات", nameEn: "Audio & Wearables", codePrefix: "AUD", active: true, image: null, _count: { items: 0 } },
    ];
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden selection:bg-primary/30">
      {/* Full Page Background Image */}
      <div className="fixed inset-0 -z-20">
        <img 
          src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1600&q=80&auto=format&fit=crop" 
          alt="Tech background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-950/80 dark:bg-slate-950/90 backdrop-blur-[2px]" />
      </div>
      
      <header className="px-6 py-6 flex justify-between items-center max-w-7xl mx-auto w-full z-10">
        <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-2.5 hover:scale-105 transition-transform cursor-pointer drop-shadow-lg">
          <div className="w-11 h-11 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Smartphone className="text-white w-6 h-6" />
          </div>
          PhoneHub<span className="text-cyan-400 font-bold text-lg mr-1.5 px-2 py-0.5 rounded-lg bg-cyan-400/10 border border-cyan-400/20">Store</span>
        </h1>
        <div className="flex gap-4 items-center bg-white/10 backdrop-blur-md px-2 py-1.5 rounded-2xl shadow-sm border border-white/20">
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-5 mt-4 z-10 pb-32" dir="rtl">
        
        {/* Hero Section - Glass Card */}
        <section className="relative py-28 md:py-36 flex flex-col items-center text-center rounded-[32px] md:rounded-[48px] overflow-hidden mb-16 shadow-2xl mt-6 bg-slate-900/40 backdrop-blur-xl border border-white/10">
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 via-transparent to-blue-600/10 pointer-events-none" />
          
          <div className="relative z-10 w-full max-w-4xl flex flex-col items-center px-5">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-cyan-500/15 backdrop-blur-md text-cyan-300 font-bold text-sm mb-8 border border-cyan-500/30 shadow-lg">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              أقوى اسكرينات الحماية المعتمدة وأحدث الهواتف الذكية
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-white tracking-tight leading-[1.15] mb-8" style={{ textShadow: '0 4px 30px rgba(0,0,0,0.5)' }}>
              مرحباً بك في <br className="hidden sm:block" /> <span className="text-transparent bg-clip-text bg-gradient-to-l from-cyan-300 via-blue-400 to-indigo-300">PhoneHub Store</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-200/90 max-w-2xl mb-12 leading-relaxed font-semibold">
              وجهتك المتكاملة لأحدث الموبايلات، اسكرينات الصدمات الأصلية، والجرابات والشواحن المعتمدة. اطلب الآن والدفع عند الاستلام بعد المعاينة!
            </p>
          </div>
        </section>

        {/* Categories Grid */}
        <div className="mb-8 flex justify-between items-end px-2">
          <h2 className="text-3xl font-black text-white">الأقسام <span className="text-primary relative inline-block">
            Categories
            <svg className="absolute w-full h-3 -bottom-1 left-0 text-primary/30" viewBox="0 0 100 20" preserveAspectRatio="none"><path d="M0,10 Q50,20 100,10" fill="none" stroke="currentColor" strokeWidth="4"/></svg>
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {categories.map((category) => {
            const coverImage = category.image || fallbackImages[category.nameEn] || "";
            const itemCount = category._count?.items || 0;

            return (
              <Link
                key={category.id}
                href={`/category/${category.id}`}
                className="relative group rounded-[28px] overflow-hidden border border-primary/20 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20 cursor-pointer hover:-translate-y-1 transition-all duration-300 bg-slate-900/60 aspect-[4/3] flex flex-col"
              >
                <div className="absolute inset-0 z-0">
                  <img
                    src={coverImage}
                    alt={category.nameEn}
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
                </div>

                <div className="relative z-10 flex flex-col justify-end h-full p-6 text-white">
                  <div className="flex justify-between items-end">
                    <div>
                      <h3 className="text-3xl font-black mb-1 tracking-tight">{category.nameEn}</h3>
                      <p className="text-xl font-bold text-gray-300">{category.nameAr}</p>
                      {itemCount > 0 && (
                        <p className="text-sm text-cyan-300 font-semibold mt-1">{itemCount} منتج متوفر</p>
                      )}
                    </div>
                    <div className="w-11 h-11 rounded-2xl bg-cyan-500/90 flex items-center justify-center backdrop-blur-md group-hover:bg-cyan-400 group-hover:scale-110 transition-all shadow-lg">
                      <ArrowLeft className="w-5 h-5 text-black font-bold" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}

          {categories.length === 0 && (
            <div className="col-span-full text-center py-20 bg-slate-900/40 backdrop-blur-md rounded-3xl border border-white/10 text-white">
              <p className="text-xl font-bold mb-2">جاري تجهيز الأقسام والمنتجات الجديدة...</p>
              <p className="text-gray-400 text-sm">يمكن لمدير المتجر تفعيل الأقسام من لوحة التحكم لتظهر هنا فوراً.</p>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
