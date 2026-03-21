import prisma from "@/lib/prisma";
import { CheckoutForm } from "./CheckoutForm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

export default async function CheckoutPage({ searchParams }: { searchParams: Promise<{ productId?: string; variantId?: string }> }) {
  const resolvedParams = await searchParams;
  const productId = resolvedParams.productId;

  if (!productId) return notFound();

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { variants: true },
  });

  const provinces = await prisma.province.findMany({
    orderBy: { name: "asc" }
  });

  if (!product) return notFound();

  return (
    <div className="min-h-screen flex flex-col pt-4">
      <header className="px-6 py-5 flex justify-between items-center max-w-7xl mx-auto w-full mb-8">
        <Link href="/">
          <h1 className="text-3xl font-black text-primary tracking-tight">إيكو ستور<span className="text-yellow-500">.</span></h1>
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
