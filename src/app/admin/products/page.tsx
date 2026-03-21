import prisma from "@/lib/prisma";
import Link from "next/link";
import { PlusCircle, Image as ImageIcon, Palette } from "lucide-react";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      variants: true,
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="bg-card p-6 rounded-2xl shadow-sm border border-border flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">المنتجات والمخزون</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            إدارة أجهزة المنزل، الأسعار الأساسية، وإضافة ألوان ومخزون لكل منتج.
          </p>
        </div>
        <Link href="/admin/products/new" className="flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground rounded-xl font-medium shadow-sm hover:bg-opacity-90 transition-all">
          <PlusCircle className="w-5 h-5" />
          <span>إضافة منتج جديد</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-all">
            <div className="h-48 bg-gray-100 dark:bg-gray-800 relative flex items-center justify-center border-b border-border">
              {product.image ? (
                <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="w-12 h-12 text-gray-400 dark:text-gray-600" />
              )}
              {product.variants.length > 0 && (
                 <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 shadow-sm">
                   <Palette className="w-3.5 h-3.5" />
                   <span>{product.variants.length} ألوان متوفرة</span>
                 </div>
              )}
            </div>
            
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-bold text-foreground line-clamp-1">{product.title}</h2>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xl font-black text-primary">{product.basePrice.toLocaleString()}</span>
                  <span className="text-sm font-medium text-gray-500">ج.م</span>
                </div>
                {product.warranty_period ? (
                  <p className="text-sm text-green-600 dark:text-green-400 mt-2 font-medium bg-green-50 dark:bg-green-900/20 w-fit px-2 py-1 rounded-lg">ضمان: {product.warranty_period}</p>
                ) : (
                  <p className="text-sm text-gray-400 mt-2 hidden">بدون ضمان</p>
                )}
                <div className="mt-4 flex flex-wrap gap-2">
                  {product.variants.map((variant) => (
                    <div key={variant.id} className="w-6 h-6 rounded-full border border-gray-200 shadow-sm" style={{ backgroundColor: variant.colorHex }} title={`${variant.colorName} - المتاح: ${variant.stock}`} />
                  ))}
                </div>
              </div>
              
              <div className="mt-6">
                <Link href={`/admin/products/${product.id}`} className="block w-full text-center px-4 py-2.5 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-foreground font-medium rounded-xl transition-colors border border-border shadow-sm">
                  تعديل المنتــج
                </Link>
              </div>
            </div>
          </div>
        ))}

        {products.length === 0 && (
          <div className="col-span-full bg-card rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2">لا توجد منتجات مسجلة</h2>
            <p className="text-gray-500 mb-6">ابدأ بإنشاء منتجك الأول من خلال الضغط على الزر في الأعلى.</p>
          </div>
        )}
      </div>
    </div>
  );
}
