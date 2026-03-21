import prisma from "@/lib/prisma";
import Link from "next/link";
import { ShieldCheck, Truck, ShoppingBag, Eye, Zap, Star, ArrowLeft } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export default async function Storefront() {
  const products = await prisma.product.findMany({
    include: { variants: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-background selection:bg-primary/30">
      {/* Dynamic Background Glow Layer */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/10 via-primary/5 to-transparent pointer-events-none -z-10" />
      <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-primary/20 blur-[120px] rounded-full pointer-events-none -z-10" />
      
      <header className="px-6 py-6 flex justify-between items-center max-w-7xl mx-auto w-full z-10">
        <h1 className="text-3xl font-black text-foreground tracking-tight flex items-center gap-2.5 hover:scale-105 transition-transform cursor-pointer">
          <div className="w-11 h-11 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30">
            <Zap className="text-white w-6 h-6 fill-current" />
          </div>
          إيكو ستور<span className="text-primary -ml-2 text-4xl">.</span>
        </h1>
        <div className="flex gap-4 items-center">
          <ThemeToggle />
          <Link href="/admin" className="text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-primary transition-all bg-white/60 dark:bg-white/5 backdrop-blur-md px-6 py-3 rounded-full shadow-sm border border-border/50 hover:border-primary/50 hover:shadow-md">לוوحة الإدارة</Link>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-5 mt-4 z-10">
        
        {/* Massive Hero Section */}
        <section className="py-16 md:py-24 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 text-primary font-bold text-sm mb-8 border border-primary/20 shadow-sm animate-pulse">
            <Star className="w-4 h-4 fill-primary" />
            التجربة الأحدث في الأجهزة المنزلية
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-foreground max-w-4xl tracking-tight leading-[1.15] mb-8">
            جهّز منزلك بأحدث التقنيات <br /> <span className="text-transparent bg-clip-text bg-gradient-to-l from-primary to-green-400">بأسعار لا تُنافس</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mb-12 leading-relaxed font-medium">
            اطلب الآن وادفع عند الاستلام. نوفر لك شحن آمن وسريع لجميع المحافظات مع ضمان حقيقي وفحص للكرتونة قبل الدفع لضمان راحتك التامة.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <a href="#products" className="px-10 py-4 rounded-2xl bg-foreground text-background font-black text-lg hover:scale-105 transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-3">
              تصفح التشكيلات <ArrowLeft className="w-5 h-5" />
            </a>
            <Link href="/admin/products/new" className="px-10 py-4 rounded-2xl bg-white dark:bg-gray-900 text-foreground font-bold text-lg hover:scale-105 transition-all shadow-sm border border-border flex items-center justify-center gap-3">
              أضف منتجك الأول 
            </Link>
          </div>
        </section>

        {/* Floating Trust Banner */}
        <div className="relative -mt-8 mb-24">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-green-500 rounded-[32px] blur-xl opacity-20 dark:opacity-30"></div>
          <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 rounded-[32px] p-8 md:p-10 flex flex-col md:flex-row justify-between items-center gap-8 shadow-2xl">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-foreground mb-3 flex items-center gap-3">
                 الدفع عند الاستلام 100% 💵
              </h2>
              <p className="text-gray-600 dark:text-gray-400 font-medium text-lg max-w-xl">عاين منتجك قبل الدفع، ولا تدفع أي قروش إلا بعد التأكد من سلامة المنتج ومطابقته التامة للصور. ثقتك هي رأس مالنا.</p>
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
              <div className="flex items-center gap-3 bg-green-50 dark:bg-green-900/20 px-6 py-4 rounded-2xl border border-green-100 dark:border-green-800/30 shadow-sm">
                <ShieldCheck className="text-green-600 dark:text-green-400 w-7 h-7" />
                <span className="font-bold text-green-800 dark:text-green-300 text-lg">ضمان حقيقي</span>
              </div>
              <div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-900/20 px-6 py-4 rounded-2xl border border-blue-100 dark:border-blue-800/30 shadow-sm">
                <Truck className="text-blue-600 dark:text-blue-400 w-7 h-7" />
                <span className="font-bold text-blue-800 dark:text-blue-300 text-lg">تغطية المحافظات</span>
              </div>
            </div>
          </div>
        </div>

        <div id="products" className="mb-10 flex justify-between items-end px-2 pt-10">
          <h2 className="text-3xl font-black text-foreground">أحدث العروض <span className="text-primary relative inline-block">
            والأجهزة
            <svg className="absolute w-full h-3 -bottom-1 left-0 text-primary/30" viewBox="0 0 100 20" preserveAspectRatio="none"><path d="M0,10 Q50,20 100,10" fill="none" stroke="currentColor" strokeWidth="4"/></svg>
            </span>
          </h2>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-32">
          {products.map((product) => (
            <Link key={product.id} href={`/product/${product.id}`} className="group bg-white dark:bg-card rounded-[28px] border border-border/50 shadow-sm hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 outline-none transition-all duration-300 flex flex-col overflow-hidden">
              <div className="h-64 relative bg-gray-50 dark:bg-gray-800/40 overflow-hidden flex items-center justify-center p-6 mix-blend-multiply dark:mix-blend-normal">
                {product.image ? (
                  <img src={product.image} alt={product.title} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 ease-out drop-shadow-xl" />
                ) : (
                  <ShoppingBag className="w-20 h-20 text-gray-200 dark:text-gray-700 drop-shadow-md" />
                )}
                
                {/* Overlay gradient for premium feel on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Variant Color Dots Preview */}
                {product.variants.length > 0 && (
                  <div className="absolute top-4 left-4 flex gap-1.5 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-3 py-2 rounded-full shadow-sm border border-border/50 z-10">
                    {product.variants.slice(0, 3).map((v) => (
                      <div key={v.id} className="w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 shadow-sm" style={{ backgroundColor: v.colorHex }} title={v.colorName} />
                    ))}
                    {product.variants.length > 3 && (
                      <span className="text-[11px] font-black text-foreground pl-1">+{product.variants.length - 3}</span>
                    )}
                  </div>
                )}
              </div>
              
              <div className="p-6 flex flex-col flex-1 justify-between bg-white dark:bg-card z-10 border-t border-border/50">
                <div>
                  <h3 className="font-bold text-xl text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">{product.title}</h3>
                  <div className="mt-4 flex items-end gap-1.5">
                    <span className="text-3xl font-black text-foreground tracking-tight">{product.basePrice.toLocaleString()}</span>
                    <span className="text-base font-bold text-gray-500 pb-1">ج.م</span>
                  </div>
                </div>
                
                <div className="mt-6 pt-5 border-t border-dashed border-gray-200 dark:border-gray-800 flex justify-between items-center">
                  {product.warranty_period ? (
                    <span className="text-xs font-bold text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/40 px-3 py-1.5 rounded-xl">ضمان {product.warranty_period}</span>
                  ) : (
                    <span></span> 
                  )}
                  <span className="text-sm font-black text-primary flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-xl group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                    شراء <Eye className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
          
          {products.length === 0 && (
            <div className="col-span-full py-24 text-center bg-white/50 dark:bg-gray-900/20 backdrop-blur-sm border-2 border-dashed border-gray-300 dark:border-gray-800 rounded-[40px]">
              <div className="relative w-32 h-32 mx-auto mb-6">
                 <div className="absolute inset-0 bg-primary blur-2xl opacity-20 rounded-full animate-pulse-slow"></div>
                 <ShoppingBag className="w-full h-full text-gray-200 dark:text-gray-800 drop-shadow-2xl relative z-10" />
              </div>
              <h3 className="text-3xl font-black text-foreground mb-3">المتجر مبهر ويعمل بسلاسة</h3>
              <p className="text-gray-500 font-medium text-xl max-w-xl mx-auto leading-relaxed">المكان يبدو خاوياً فقط لأنه لم يتم إدراج منتجاتك بعد. ادخل للوحة الإدارة وسجل منتجك الأول بصوره الملونة لترى قوة واجهتك كأنها معارض أبل!</p>
              <Link href="/admin/products/new" className="inline-block mt-8 px-10 py-5 bg-primary text-primary-foreground rounded-2xl font-bold text-lg shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all">ارفع أول منتج الآن</Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
