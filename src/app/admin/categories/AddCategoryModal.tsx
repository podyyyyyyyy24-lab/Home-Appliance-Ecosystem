"use client";

import { useState, useTransition } from "react";
import { Plus, X, FolderPlus } from "lucide-react";
import { createCategory } from "./actions";
import { useRouter } from "next/navigation";

export function AddCategoryModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await createCategory(formData);
      if (res.success) {
        setIsOpen(false);
        router.refresh();
      } else {
        setError(res.error || "تعذر إضافة القسم");
      }
    });
  };

  return (
    <>
      <button
        onClick={() => {
          setError("");
          setIsOpen(true);
        }}
        className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-primary text-primary-foreground font-bold hover:opacity-90 shadow-md hover:-translate-y-0.5 transition-all text-sm"
      >
        <Plus className="w-4 h-4" />
        <span>إضافة قسم جديد</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card text-foreground p-6 rounded-3xl max-w-md w-full shadow-2xl border border-border relative text-right animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-border pb-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                  <FolderPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black">إضافة قسم منتجات جديد</h3>
                  <p className="text-xs text-gray-500 font-medium">سيظهر تلقائياً في صفحة الأقسام والتكويد</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  اسم القسم بالإنجليزية (English Name)
                </label>
                <input
                  type="text"
                  name="nameEn"
                  required
                  placeholder="e.g. Smart Watches"
                  className="w-full px-4 py-2.5 rounded-xl bg-background border border-border focus:border-primary outline-none text-left font-medium text-sm"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  اسم القسم بالعربية
                </label>
                <input
                  type="text"
                  name="nameAr"
                  required
                  placeholder="مثال: ساعات ذكية وإكسسواراتها"
                  className="w-full px-4 py-2.5 rounded-xl bg-background border border-border focus:border-primary outline-none text-right font-medium text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  كود البادئة (3 أحرف إنجليزية لتكويد الصور)
                </label>
                <input
                  type="text"
                  name="codePrefix"
                  required
                  maxLength={5}
                  placeholder="WTC"
                  className="w-full px-4 py-2.5 rounded-xl bg-background border border-border focus:border-primary outline-none text-center font-mono font-black uppercase text-sm"
                  dir="ltr"
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  سيتم توليد أكواد تلقائية مثل: WTC-001, WTC-002 لكل صورة تضيفها بالقسم.
                </p>
              </div>

              {error && (
                <p className="text-xs font-bold text-red-600 bg-red-100 dark:bg-red-900/40 p-2.5 rounded-xl text-center">
                  {error}
                </p>
              )}

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl font-bold text-sm shadow-md hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isPending ? "جاري الحفظ..." : "حفظ وإنشاء القسم"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-5 py-3 rounded-xl border border-border hover:bg-gray-100 dark:hover:bg-gray-800 text-foreground font-bold text-sm transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
