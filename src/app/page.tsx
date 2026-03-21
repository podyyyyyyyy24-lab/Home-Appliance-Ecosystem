import prisma from "@/lib/prisma";
import Link from "next/link";
import { ShieldCheck, Truck, ShoppingBag, Eye } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export default async function Storefront() {
  const products = await prisma.product.findMany({
    include: { variants: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-6 py-5 flex justify-between items-center max-w-7xl mx-auto w-full">
        <h1 className="text-3xl font-black text-primary tracking-tight">إيكو ستور<span className="text-yellow-500">.</span></h1>
        <div className="flex gap-4 items-center">
          <ThemeToggle />
          <Link href="/admin" className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-primary transition-colors bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-2xl shadow-sm border border-border">إداري</Link>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-5 mt-4">
        {/* Trust Banner matched to prompt */}
        <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-[24px] p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6 mb-10 shadow-sm">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-primary mb-2 uppercase">الدفع عند الاستلام 100%</h2>
            <p className="text-gray-700 dark:text-gray-300 font-medium text-lg">عاين منتجك قبل الدفع، ولا تدفع أي شيء إلا بعد التأكد من سلامة المنتج. ثقتكم هي الأهم.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 bg-white dark:bg-gray-900 px-5 py-3 rounded-2xl shadow-sm border border-border">
              <ShieldCheck className="text-primary w-6 h-6" />
              <span className="font-bold text-foreground">ضمان حقيقي</span>
            </div>
            <div className="flex items-center gap-2 bg-white dark:bg-gray-900 px-5 py-3 rounded-2xl shadow-sm border border-border">
              <Truck className="text-primary w-6 h-6" />
              <span className="font-bold text-foreground">تغطية المحافظات</span>
            </div>
          </div>
        </div>

        <div className="mb-6 flex justify-between items-end">
          <h2 className="text-2xl font-bold text-foreground">أحدث العروض <span className="text-primary">والأجهزة</span></h2>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
          {products.map((product) => (
            <Link key={product.id} href={`/product/${product.id}`} className="group bg-card rounded-[20px] border border-border shadow-sm hover:shadow-xl hover:border-primary/40 focus:ring-2 focus:ring-primary outline-none transition-all duration-300 flex flex-col overflow-hidden">
              <div className="h-56 relative bg-gray-100 dark:bg-gray-800/60 overflow-hidden flex items-center justify-center p-4">
                {product.image ? (
                  <img src={product.image} alt={product.title} className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <ShoppingBag className="w-16 h-16 text-gray-300 dark:text-gray-600" />
                )}
                
                {/* Variant Color Dots Preview */}
                {product.variants.length > 0 && (
                  <div className="absolute top-4 left-4 flex gap-1 bg-white/80 dark:bg-gray-900/80 backdrop-blur px-2 py-1.5 rounded-2xl shadow-sm border border-border">
                    {product.variants.slice(0, 3).map((v) => (
                      <div key={v.id} className="w-3.5 h-3.5 rounded-full border border-gray-300 dark:border-gray-600 shadow-sm" style={{ backgroundColor: v.colorHex }} title={v.colorName} />
                    ))}
                    {product.variants.length > 3 && (
                      <span className="text-[10px] font-bold text-gray-600 dark:text-gray-400 pl-1">+{product.variants.length - 3}</span>
                    )}
                  </div>
                )}
                
                {/* Floating View Icon */}
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors flex items-center justify-center">
                  <div className="bg-white dark:bg-gray-800 text-primary p-3 rounded-full opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-4 transition-all duration-300 shadow-lg">
                    <Eye className="w-6 h-6" />
                  </div>
                </div>
              </div>
              
              <div className="p-5 flex flex-col flex-1 justify-between bg-card relative">
                <div>
                  <h3 className="font-bold text-lg text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors">{product.title}</h3>
                  <div className="mt-3 flex items-end gap-1.5">
                    <span className="text-2xl font-black text-foreground">{product.basePrice.toLocaleString()}</span>
                    <span className="text-sm font-bold text-gray-500 dark:text-gray-400 pb-1">ج.م</span>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
                  {product.warranty_period ? (
                    <span className="text-xs font-bold text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-lg">ضمان {product.warranty_period}</span>
                  ) : (
                    <span></span> 
                  )}
                  <span className="text-sm font-bold text-primary flex items-center gap-1 group-hover:translate-x-[-4px] transition-transform">
                    تسوق الآن ←
                  </span>
                </div>
              </div>
            </Link>
          ))}
          
          {products.length === 0 && (
            <div className="col-span-full py-20 text-center">
              <ShoppingBag className="w-20 h-20 mx-auto text-gray-200 dark:text-gray-800 mb-4" />
              <h3 className="text-xl font-bold text-gray-500">المتجر قيد التقييم والتجهيز</h3>
              <p className="text-gray-400">لم يتم إضافة منتجات حتى الآن من لوحة الإدارة.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
