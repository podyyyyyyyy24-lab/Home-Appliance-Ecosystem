import prisma from "@/lib/prisma";
import Link from "next/link";
import { Star, ArrowLeft, Sparkles } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export const dynamic = 'force-dynamic';

// Fallback images for categories when no cover image is set
const fallbackImages: Record<string, string> = {
  "Perfumes": "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=600&auto=format&fit=crop",
  "Accessories": "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=600&auto=format&fit=crop",
  "Makeup": "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=600&auto=format&fit=crop",
  "Skin Care": "https://images.unsplash.com/photo-1570194065650-d99fb4ee5665?q=80&w=600&auto=format&fit=crop",
  "Home Appliances": "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?q=80&w=600&auto=format&fit=crop",
  "Housewares": "https://images.unsplash.com/photo-1556909114-44e3e70034e2?q=80&w=600&auto=format&fit=crop",
};

export default async function Storefront() {
  let categories: any[] = [];

  try {
    categories = await prisma.category.findMany({
      include: { _count: { select: { items: true } } },
      orderBy: { sortOrder: "asc" },
    });
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    // Use static fallback if DB is down
    categories = [
      { id: "perfumes", nameAr: "برفانات", nameEn: "Perfumes", active: true, image: null, _count: { items: 0 } },
      { id: "accessories", nameAr: "اكسسوار", nameEn: "Accessories", active: true, image: null, _count: { items: 0 } },
      { id: "makeup", nameAr: "ميكايب", nameEn: "Makeup", active: false, image: null, _count: { items: 0 } },
      { id: "skincare", nameAr: "عناية بالبشرة", nameEn: "Skin Care", active: false, image: null, _count: { items: 0 } },
      { id: "home-appliances", nameAr: "اجهزة منزلية", nameEn: "Home Appliances", active: false, image: null, _count: { items: 0 } },
      { id: "housewares", nameAr: "ادوات منزلية", nameEn: "Housewares", active: false, image: null, _count: { items: 0 } },
    ];
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden selection:bg-primary/30">
      {/* Full Page Background Image */}
      <div className="fixed inset-0 -z-20">
        <img 
          src="https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=1400&q=70&auto=format&fit=crop" 
          alt="" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/75 dark:bg-black/85" />
      </div>
      
      <header className="px-6 py-6 flex justify-between items-center max-w-7xl mx-auto w-full z-10">
        <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-2.5 hover:scale-105 transition-transform cursor-pointer drop-shadow-lg">
          <div className="w-11 h-11 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30">
            <Sparkles className="text-white w-6 h-6" />
          </div>
          M Donna Store<span className="text-primary -ml-2 text-4xl">.</span>
        </h1>
        <div className="flex gap-4 items-center bg-white/10 backdrop-blur-md px-2 py-1.5 rounded-2xl shadow-sm border border-white/20">
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-5 mt-4 z-10 pb-32" dir="rtl">
        
        {/* Hero Section - Glass Card */}
        <section className="relative py-28 md:py-36 flex flex-col items-center text-center rounded-[32px] md:rounded-[48px] overflow-hidden mb-16 shadow-2xl mt-6 bg-white/5 backdrop-blur-md border border-white/10">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/5 pointer-events-none" />
          
          <div className="relative z-10 w-full max-w-4xl flex flex-col items-center px-5">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/15 backdrop-blur-md text-white font-bold text-sm mb-8 border border-white/25 shadow-lg">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              تألقي بأرقى العطور والإكسسوارات
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-white tracking-tight leading-[1.15] mb-8" style={{ textShadow: '0 4px 30px rgba(0,0,0,0.4)' }}>
              مرحباً بكِ في <br className="hidden sm:block" /> <span className="text-transparent bg-clip-text bg-gradient-to-l from-yellow-300 to-pink-400">M Donna Store</span>
            </h2>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mb-12 leading-relaxed font-semibold">
              اكتشفي تشكيلتنا الحصرية من العطور الفاخرة والإكسسوارات. تسوقي الآن وادفعي عند الاستلام!
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
            
            const CardContent = (
              <>
                <div className="absolute inset-0 z-0">
                  <img src={coverImage} alt={category.nameEn} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                </div>
                
                <div className="relative z-10 flex flex-col justify-end h-full p-6 text-white">
                  <div className="flex justify-between items-end">
                    <div>
                      <h3 className="text-3xl font-black mb-1 tracking-tight">{category.nameEn}</h3>
                      <p className="text-xl font-bold text-gray-300">{category.nameAr}</p>
                      {itemCount > 0 && (
                        <p className="text-sm text-gray-400 mt-1">{itemCount} منتج</p>
                      )}
                    </div>
                    {!category.active && (
                      <div className="bg-black/50 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
                        <span className="font-bold text-sm text-white flex items-center gap-2">
                          قريباً <span className="text-xs uppercase opacity-80">Coming Soon</span>
                        </span>
                      </div>
                    )}
                    {category.active && (
                      <div className="w-10 h-10 rounded-full bg-primary/90 flex items-center justify-center backdrop-blur-md group-hover:bg-primary transition-colors">
                        <ArrowLeft className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>
                </div>
              </>
            );

            if (category.active) {
              return (
                <Link
                  key={category.id}
                  href={`/category/${category.id}`}
                  className="relative group rounded-[28px] overflow-hidden border border-primary/20 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20 cursor-pointer hover:-translate-y-1 transition-all duration-300 bg-white dark:bg-card aspect-[4/3] flex flex-col"
                >
                  {CardContent}
                </Link>
              );
            }

            return (
              <div
                key={category.id}
                className="relative group rounded-[28px] overflow-hidden border border-border/50 opacity-80 transition-all duration-300 bg-white dark:bg-card aspect-[4/3] flex flex-col"
              >
                {CardContent}
              </div>
            );
          })}
        </div>

      </main>
    </div>
  );
}
