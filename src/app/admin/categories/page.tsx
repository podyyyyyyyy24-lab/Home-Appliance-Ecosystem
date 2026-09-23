import prisma from "@/lib/prisma";
import Link from "next/link";
import { Layers, FolderOpen, Image as ImageIcon, Hash } from "lucide-react";
import { seedCategories } from "./actions";
import { CategoryCardActions } from "./CategoryCardActions";
import { AddCategoryModal } from "./AddCategoryModal";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  let categories: any[] = [];

  try {
    // Ensure default categories exist
    await seedCategories();

    categories = await prisma.category.findMany({
      include: {
        items: { orderBy: { code: "asc" } },
        _count: { select: { items: true } },
      },
      orderBy: { sortOrder: "asc" },
    });
  } catch {
    // Database offline fallback
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-card p-6 md:p-8 rounded-[32px] shadow-sm border border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-l from-transparent to-primary/5">
        <div>
          <h1 className="text-3xl font-black text-foreground flex items-center gap-3">
            <Layers className="w-8 h-8 text-primary" />
            إدارة الأقسام والظهور بالمتجر
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-base">
            تحكّم في ظهور الأقسام بالصفحة الرئيسية للعملاء بنقرة واحدة، دون مسح صورك وبياناتك المهمة.
          </p>
        </div>

        <AddCategoryModal />
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div
            key={category.id}
            className={`bg-card rounded-[28px] border transition-all duration-300 shadow-sm overflow-hidden flex flex-col group ${
              category.active
                ? "border-primary/40 hover:border-primary shadow-primary/5 hover:shadow-lg"
                : "border-border/80 opacity-90 hover:opacity-100"
            }`}
          >
            {/* Category Header Bar */}
            <div
              className={`p-5 flex justify-between items-center border-b ${
                category.active
                  ? "bg-primary/5 border-primary/20"
                  : "bg-gray-50 dark:bg-gray-800/40 border-border"
              }`}
            >
              <div>
                <h2 className="text-lg font-black text-foreground flex items-center gap-2">
                  <FolderOpen className="w-5 h-5 text-primary" />
                  {category.nameEn}
                </h2>
                <p className="text-xs text-gray-500 font-semibold mt-0.5">
                  {category.nameAr} · كود:{" "}
                  <span className="font-mono font-bold text-primary">{category.codePrefix}</span>
                </p>
              </div>

              {/* Visibility and Secure Delete Actions */}
              <CategoryCardActions
                categoryId={category.id}
                categoryName={category.nameAr || category.nameEn}
                active={category.active}
              />
            </div>

            {/* Items Count & Preview */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs text-gray-500 font-medium mb-3">
                  <span className="flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-primary" />
                    <strong>{category._count.items}</strong> صورة / منتج
                  </span>
                  <span className="flex items-center gap-1 font-mono text-[11px] bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                    <Hash className="w-3 h-3 text-gray-400" />
                    {category.items.length > 0
                      ? `${category.items[0].code} → ${category.items[category.items.length - 1].code}`
                      : "لا يوجد أكواد"}
                  </span>
                </div>

                {/* Status Indicator Pill */}
                <div className="mb-4">
                  {category.active ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/40 px-2.5 py-1 rounded-lg border border-green-200 dark:border-green-800/50">
                      ● معروض للعملاء في الصفحة الرئيسية
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-lg border border-amber-200 dark:border-amber-800/50">
                      ○ مخفي من الرئيسية (محفوظ بالمخزن)
                    </span>
                  )}
                </div>

                {/* Thumbnail Preview Grid */}
                {category.items.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {category.items.slice(0, 6).map((item: any) => (
                      <div
                        key={item.id}
                        className="relative w-14 h-14 rounded-xl overflow-hidden border border-border shadow-sm group-hover:scale-105 transition-transform"
                      >
                        <img
                          src={item.image}
                          alt={item.code}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-0 inset-x-0 bg-black/75 text-white text-[8px] text-center font-mono py-0.5">
                          {item.code}
                        </div>
                      </div>
                    ))}
                    {category.items.length > 6 && (
                      <div className="w-14 h-14 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs font-black text-gray-500 border border-border">
                        +{category.items.length - 6}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 py-3 bg-gray-50 dark:bg-gray-900/40 rounded-xl text-center border border-dashed border-border">
                    لا توجد صور مضافة بعد. اضغط بالأسفل لرفع الصور.
                  </p>
                )}
              </div>

              <Link
                href={`/admin/categories/${category.id}`}
                className="w-full text-center py-3 bg-primary/10 hover:bg-primary/20 text-primary font-bold rounded-xl transition-all border border-primary/20 shadow-sm text-sm"
              >
                فتح القسم وإدارة الصور والتكويد ➔
              </Link>
            </div>
          </div>
        ))}

        {categories.length === 0 && (
          <div className="col-span-full text-center py-16 bg-card rounded-3xl border border-border">
            <p className="text-gray-500 font-bold mb-4">لا توجد أي أقسام حالياً.</p>
            <AddCategoryModal />
          </div>
        )}
      </div>
    </div>
  );
}
