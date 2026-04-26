import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ShoppingBag, Sparkles } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CategoryItemCard } from "@/components/CategoryItemCard";

export default async function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      items: { orderBy: { code: "asc" } },
    },
  });

  if (!category) return notFound();

  return (
    <div className="min-h-screen bg-background text-foreground" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-primary hover:underline font-bold text-sm">
              <ArrowRight className="w-4 h-4" />
              الرئيسية
            </Link>
            <span className="text-gray-300 dark:text-gray-600">|</span>
            <h1 className="text-xl font-black text-foreground flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              {category.nameEn}
              <span className="text-gray-400 font-medium text-base">- {category.nameAr}</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 font-mono bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-lg">
              {category.items.length} منتج
            </span>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Banner with Full Background Image */}
      {(() => {
        const bgImages: Record<string, string> = {
          "Perfumes": "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=1200&q=60&auto=format&fit=crop",
          "Accessories": "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1200&q=60&auto=format&fit=crop",
          "Makeup": "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&q=60&auto=format&fit=crop",
          "Skin Care": "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=1200&q=60&auto=format&fit=crop",
          "Home Appliances": "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200&q=60&auto=format&fit=crop",
          "Housewares": "https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=1200&q=60&auto=format&fit=crop",
        };
        const bgImage = category.image || bgImages[category.nameEn] || bgImages["Accessories"];
        return (
          <div className="relative h-72 md:h-96 overflow-hidden">
            <img 
              src={bgImage} 
              alt={category.nameEn} 
              className="absolute inset-0 w-full h-full object-cover scale-105" 
              style={{ objectPosition: 'center 30%' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
            <div className="absolute inset-0 bg-primary/10" />
            <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
              <div className="mb-4 bg-white/15 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20">
                <span className="text-white/90 text-sm font-bold">{category.nameEn}</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-black text-white mb-4 drop-shadow-2xl" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
                {category.nameAr}
              </h2>
              <p className="text-white/80 text-lg max-w-xl mx-auto drop-shadow-lg mb-5">
                تسوّقي أحدث تشكيلة {category.nameAr} من M Donna Store
              </p>
              <div className="bg-white/20 backdrop-blur-md px-6 py-2.5 rounded-full border border-white/30 shadow-xl">
                <span className="text-white font-bold text-sm">{category.items.length} منتج متوفر</span>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Products Grid with Full Background */}
      <main className="relative min-h-screen">
        {/* Full page background image */}
        {(() => {
          const gridBg: Record<string, string> = {
            "Perfumes": "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=1200&q=60&auto=format&fit=crop",
            "Accessories": "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1200&q=60&auto=format&fit=crop",
            "Makeup": "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1200&q=60&auto=format&fit=crop",
            "Skin Care": "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=1200&q=60&auto=format&fit=crop",
            "Home Appliances": "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200&q=60&auto=format&fit=crop",
            "Housewares": "https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=1200&q=60&auto=format&fit=crop",
          };
          const bg = gridBg[category.nameEn] || gridBg["Accessories"];
          return (
            <>
              <div className="fixed inset-0 -z-10">
                <img src={bg} alt="" className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-background/90 dark:bg-background/95 backdrop-blur-sm" />
              </div>
            </>
          );
        })()}

        <div className="max-w-7xl mx-auto px-6 py-10 relative z-10">
          {category.items.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {category.items.map((item) => (
                <CategoryItemCard
                  key={item.id}
                  item={item}
                  categoryName={category.nameAr}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <ShoppingBag className="w-20 h-20 text-gray-200 dark:text-gray-700 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-foreground mb-3">هذا القسم فارغ حالياً</h3>
              <p className="text-gray-500 mb-8">سيتم إضافة منتجات قريباً</p>
              <Link href="/" className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-opacity-90 transition-all shadow-md">
                العودة للرئيسية
              </Link>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 text-center text-sm text-gray-500">
        <p>© 2026 M Donna Store. جميع الحقوق محفوظة.</p>
      </footer>
    </div>
  );
}
