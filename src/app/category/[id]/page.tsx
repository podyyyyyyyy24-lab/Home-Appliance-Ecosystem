import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ShoppingBag, Hash, Sparkles } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

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

      {/* Hero Banner */}
      <div className="relative bg-gradient-to-bl from-primary/10 via-background to-background py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black text-foreground mb-3">
            {category.nameAr}
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            تسوّقي أحدث تشكيلة {category.nameAr} من M Donna Store
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        {category.items.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {category.items.map((item) => (
              <div
                key={item.id}
                className="group bg-white dark:bg-card rounded-[24px] border border-border/50 shadow-sm hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 transition-all duration-300 overflow-hidden flex flex-col"
              >
                {/* Image */}
                <div className="relative h-64 bg-gray-50 dark:bg-gray-800/40 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name || item.code}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  {/* Code Badge */}
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1 shadow-lg">
                    <Hash className="w-3 h-3" />
                    {item.code}
                  </div>
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Info */}
                <div className="p-4 flex flex-col flex-1 justify-between bg-white dark:bg-card border-t border-border/50">
                  {item.name && (
                    <h3 className="font-bold text-foreground text-base group-hover:text-primary transition-colors line-clamp-2 mb-2">
                      {item.name}
                    </h3>
                  )}
                  {item.price ? (
                    <div className="flex items-end gap-1.5 mt-auto">
                      <span className="text-2xl font-black text-foreground tracking-tight">
                        {item.price.toLocaleString()}
                      </span>
                      <span className="text-sm font-bold text-gray-500 pb-0.5">ج.م</span>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 mt-auto">تواصل للسعر</p>
                  )}
                </div>
              </div>
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
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 text-center text-sm text-gray-500">
        <p>© 2026 M Donna Store. جميع الحقوق محفوظة.</p>
      </footer>
    </div>
  );
}
