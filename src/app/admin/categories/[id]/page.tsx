import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ArrowRight, Hash, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { CategoryItemForm } from "./CategoryItemForm";
import { DeleteItemButton } from "./DeleteItemButton";

export default async function CategoryDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;

  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      items: { orderBy: { code: "asc" } },
    },
  });

  if (!category) return notFound();

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
        <div className="flex justify-between items-center">
          <div>
            <Link href="/admin/categories" className="text-sm text-primary font-bold flex items-center gap-1 mb-3 hover:underline">
              <ArrowRight className="w-4 h-4" /> رجوع للأقسام
            </Link>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
              <ImageIcon className="w-6 h-6 text-primary" />
              {category.nameEn} - {category.nameAr}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              كود القسم: <span className="font-mono font-bold text-primary text-lg">{category.codePrefix}</span> · 
              عدد الصور: <span className="font-bold">{category.items.length}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Add New Item Form */}
      <CategoryItemForm categoryId={category.id} codePrefix={category.codePrefix} nextNumber={category.items.length + 1} />

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {category.items.map((item) => (
          <div key={item.id} className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-all">
            <div className="h-52 bg-gray-100 dark:bg-gray-800 relative flex items-center justify-center overflow-hidden">
              <img src={item.image} alt={item.code} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              {/* Code Badge */}
              <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-sm font-mono font-bold flex items-center gap-1.5 shadow-lg">
                <Hash className="w-3.5 h-3.5" />
                {item.code}
              </div>
            </div>

            <div className="p-4 flex justify-between items-center">
              <div>
                {item.name && <p className="font-bold text-foreground text-sm">{item.name}</p>}
                {item.price && (
                  <p className="text-primary font-black text-lg">{item.price.toLocaleString()} <span className="text-xs text-gray-500">ج.م</span></p>
                )}
                {!item.name && !item.price && (
                  <p className="text-xs text-gray-400 font-mono">{item.code}</p>
                )}
              </div>
              <DeleteItemButton itemId={item.id} />
            </div>
          </div>
        ))}

        {category.items.length === 0 && (
          <div className="col-span-full bg-card rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 p-12 text-center">
            <ImageIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2">لا توجد صور في هذا القسم</h2>
            <p className="text-gray-500 mb-2">ارفع أول صورة وسيتم توليد الكود تلقائياً: <span className="font-mono font-bold text-primary">{category.codePrefix}-001</span></p>
          </div>
        )}
      </div>
    </div>
  );
}
