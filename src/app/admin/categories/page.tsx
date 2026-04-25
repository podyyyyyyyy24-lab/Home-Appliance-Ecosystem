import prisma from "@/lib/prisma";
import Link from "next/link";
import { Layers, FolderOpen, Image as ImageIcon, Hash, ToggleLeft, ToggleRight } from "lucide-react";
import { seedCategories } from "./actions";
import { ToggleCategoryButton } from "./ToggleCategoryButton";

export default async function CategoriesPage() {
  // Ensure default categories exist
  await seedCategories();

  const categories = await prisma.category.findMany({
    include: { items: { orderBy: { code: "asc" } }, _count: { select: { items: true } } },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="bg-card p-6 rounded-2xl shadow-sm border border-border flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <Layers className="w-6 h-6 text-primary" />
            إدارة الأقسام والتكويد
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            أضف صور المنتجات لكل قسم وسيتم توليد كود تلقائي لكل صورة.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category.id} className={`bg-card rounded-2xl border ${category.active ? 'border-primary/30' : 'border-border'} shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-all`}>
            {/* Category Header */}
            <div className={`p-5 flex justify-between items-center ${category.active ? 'bg-primary/5' : 'bg-gray-50 dark:bg-gray-800/30'}`}>
              <div>
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <FolderOpen className="w-5 h-5 text-primary" />
                  {category.nameEn}
                </h2>
                <p className="text-sm text-gray-500 mt-1">{category.nameAr} · كود: <span className="font-mono font-bold text-primary">{category.codePrefix}</span></p>
              </div>
              <div className="flex items-center gap-2">
                <ToggleCategoryButton categoryId={category.id} active={category.active} />
              </div>
            </div>

            {/* Items Count & Preview */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-4">
                <ImageIcon className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500 font-medium">{category._count.items} صورة / منتج</span>
                <Hash className="w-4 h-4 text-gray-400 mr-2" />
                <span className="text-sm text-gray-500 font-mono">
                  {category.items.length > 0 ? `${category.items[0].code} → ${category.items[category.items.length - 1].code}` : 'لا يوجد أكواد بعد'}
                </span>
              </div>

              {/* Thumbnail Preview Grid */}
              {category.items.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {category.items.slice(0, 6).map((item) => (
                    <div key={item.id} className="relative w-14 h-14 rounded-lg overflow-hidden border border-border shadow-sm">
                      <img src={item.image} alt={item.code} className="w-full h-full object-cover" />
                      <div className="absolute bottom-0 inset-x-0 bg-black/70 text-white text-[8px] text-center font-mono py-0.5">{item.code}</div>
                    </div>
                  ))}
                  {category.items.length > 6 && (
                    <div className="w-14 h-14 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-500 border border-border">
                      +{category.items.length - 6}
                    </div>
                  )}
                </div>
              )}

              <Link
                href={`/admin/categories/${category.id}`}
                className="w-full text-center px-4 py-2.5 bg-primary/10 hover:bg-primary/20 text-primary font-bold rounded-xl transition-colors border border-primary/20 shadow-sm text-sm"
              >
                فتح القسم وإضافة صور
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
