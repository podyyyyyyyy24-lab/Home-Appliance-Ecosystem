import prisma from "@/lib/prisma";
import { CheckoutForm } from "./CheckoutForm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Sparkles } from "lucide-react";

export default async function CheckoutPage({ searchParams }: { searchParams: Promise<{ productId?: string; variantId?: string; cart?: string }> }) {
  const resolvedParams = await searchParams;

  const provinces = await prisma.province.findMany({
    orderBy: { name: "asc" }
  });

  // === وضع السلة الجديد (عدة منتجات) ===
  if (resolvedParams.cart) {
    try {
      const cartData = JSON.parse(decodeURIComponent(resolvedParams.cart));
      return (
        <div className="min-h-screen flex flex-col pt-4" dir="rtl">
          <header className="px-6 py-5 flex justify-between items-center max-w-7xl mx-auto w-full mb-8">
            <Link href="/" className="flex items-center gap-2 hover:scale-105 transition-transform">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/25">
                <Sparkles className="text-white w-5 h-5" />
              </div>
              <h1 className="text-3xl font-black text-primary tracking-tight">M Donna Store<span className="text-yellow-500">.</span></h1>
            </Link>
            <ThemeToggle />
          </header>

          <main className="flex-1 max-w-5xl mx-auto w-full px-5">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-12 pb-24">
              <div className="md:col-span-3">
                <CheckoutForm
                  cartItems={cartData.items}
                  cartProvinceId={cartData.provinceId}
                  provinces={provinces}
                />
              </div>

              {/* ملخص الطلب */}
              <div className="md:col-span-2">
                <div className="bg-card border border-border p-6 rounded-[24px] shadow-sm sticky top-6">
                  <h2 className="text-lg font-bold text-foreground border-b border-border pb-4 mb-4">ملخص الطلب</h2>

                  {/* قائمة المنتجات */}
                  <div className="space-y-3 mb-6 max-h-80 overflow-y-auto">
                    {cartData.items.map((item: any, idx: number) => (
                      <div key={idx} className="flex gap-3 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl border border-border/50">
                        <div className="w-14 h-14 bg-white dark:bg-gray-700 rounded-lg flex items-center justify-center p-1 border border-border shadow-sm flex-shrink-0 overflow-hidden">
                          {item.image ? (
                            <img src={item.image} alt={item.name || item.code} className="w-full h-full object-cover rounded" />
                          ) : (
                            <div className="text-xs text-gray-400">—</div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-foreground text-sm line-clamp-1">{item.name || item.code}</h3>
                          <p className="text-xs text-gray-400 font-mono">{item.code}</p>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-xs text-gray-500">{item.quantity}x</span>
                            <span className="text-primary font-bold text-sm">{(item.price * item.quantity).toLocaleString()} ج.م</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4 pt-4 border-t border-dashed border-gray-300 dark:border-gray-700">
                    <div className="flex justify-between items-center text-sm font-medium text-gray-600 dark:text-gray-400">
                      <span>إجمالي المنتجات</span>
                      <span>{cartData.subtotal?.toLocaleString()} ج.م</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-medium text-gray-600 dark:text-gray-400">
                      <span>الشحن</span>
                      <span className="text-primary font-bold">
                        {cartData.shippingFee > 0 ? `${cartData.shippingFee.toLocaleString()} ج.م` : "يتم حسابه باختيار المحافظة"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      );
    } catch {
      return notFound();
    }
  }

  // === الوضع القديم (منتج واحد) ===
  const productId = resolvedParams.productId;
  if (!productId) return notFound();

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { variants: true },
  });

  if (!product) return notFound();

  return (
    <div className="min-h-screen flex flex-col pt-4" dir="rtl">
      <header className="px-6 py-5 flex justify-between items-center max-w-7xl mx-auto w-full mb-8">
        <Link href="/" className="flex items-center gap-2 hover:scale-105 transition-transform">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/25">
            <Sparkles className="text-white w-5 h-5" />
          </div>
          <h1 className="text-3xl font-black text-primary tracking-tight">M Donna Store<span className="text-yellow-500">.</span></h1>
        </Link>
        <ThemeToggle />
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-5">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-12 pb-24">
          <div className="md:col-span-3">
             <CheckoutForm product={product} variantId={resolvedParams.variantId} provinces={provinces} />
          </div>

          <div className="md:col-span-2">
            <div className="bg-card border border-border p-6 rounded-[24px] shadow-sm sticky top-6">
              <h2 className="text-lg font-bold text-foreground border-b border-border pb-4 mb-4">ملخص الطلب</h2>
              <div className="flex gap-4 mb-6">
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center p-2 border border-border shadow-sm">
                  {product.image ? (
                     <img src={product.image} alt="Product" className="object-contain mix-blend-multiply dark:mix-blend-normal" />
                  ) : (
                     <div className="text-xs text-gray-400">لا صورة</div>
                  )}
                </div>
                <div>
                   <h3 className="font-bold text-foreground leading-tight line-clamp-2">{product.title}</h3>
                   <p className="text-primary font-bold mt-1 text-lg">{product.basePrice.toLocaleString()} ج.م</p>
                </div>
              </div>
              <div className="space-y-4 pt-4 border-t border-dashed border-gray-300 dark:border-gray-700">
                <div className="flex justify-between items-center text-sm font-medium text-gray-600 dark:text-gray-400">
                  <span>السعر الأساسي</span>
                  <span>{product.basePrice.toLocaleString()} ج.م</span>
                </div>
                <div className="flex justify-between items-center text-sm font-medium text-gray-600 dark:text-gray-400">
                  <span>الشحن</span>
                  <span className="text-primary font-bold">يتم حسابه باختيار المحافظة تلقائياً</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
