"use client";

import { useState, useTransition } from "react";
import { Eye, EyeOff, Trash2, Lock, AlertTriangle, X, Check } from "lucide-react";
import { toggleCategoryActive, deleteCategoryWithPassword } from "./actions";
import { useRouter } from "next/navigation";

export function CategoryCardActions({
  categoryId,
  categoryName,
  active,
}: {
  categoryId: string;
  categoryName: string;
  active: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggle = () => {
    startTransition(async () => {
      await toggleCategoryActive(categoryId);
      router.refresh();
    });
  };

  const handleDeleteConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsDeleting(true);

    try {
      const res = await deleteCategoryWithPassword(categoryId, password);
      if (res.success) {
        setIsDeleteModalOpen(false);
        setPassword("");
        router.refresh();
      } else {
        setErrorMessage(res.error || "كلمة المرور غير صحيحة");
      }
    } catch {
      setErrorMessage("حدث خطأ في الاتصال، يرجى المحاولة لاحقاً.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* 1. Toggle Home Visibility Button */}
      <button
        type="button"
        disabled={isPending}
        onClick={handleToggle}
        title={active ? "القسم معروض الآن بالصفحة الرئيسية - اضغط للإخفاء دون حذف الصور" : "القسم مخفي من الصفحة الرئيسية - اضغط للإظهار للعملاء"}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
          active
            ? "bg-green-100 hover:bg-green-200 text-green-800 dark:bg-green-950/60 dark:hover:bg-green-900/80 dark:text-green-300 border border-green-300 dark:border-green-800"
            : "bg-amber-100 hover:bg-amber-200 text-amber-800 dark:bg-amber-950/60 dark:hover:bg-amber-900/80 dark:text-amber-300 border border-amber-300 dark:border-amber-800"
        } ${isPending ? "opacity-50 cursor-wait" : ""}`}
      >
        {active ? (
          <>
            <Eye className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
            <span>ظاهر بالرئيسية</span>
          </>
        ) : (
          <>
            <EyeOff className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>مخفي من الرئيسية</span>
          </>
        )}
      </button>

      {/* 2. Delete Category with Password Button */}
      <button
        type="button"
        onClick={() => {
          setErrorMessage("");
          setPassword("");
          setIsDeleteModalOpen(true);
        }}
        title="حذف هذا القسم بالكامل بعد إدخال الباسوورد"
        className="p-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/40 dark:hover:bg-red-900/60 dark:text-red-400 border border-red-200 dark:border-red-900/50 transition-all shadow-sm"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      {/* Secure Password Protected Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card text-foreground p-6 rounded-3xl max-w-md w-full shadow-2xl border border-border relative text-right animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-border pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-foreground">حذف القسم نهائياً</h3>
                  <p className="text-xs text-gray-500 font-medium">حماية مشددة لمنع مسح الأقسام بالخطأ</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-2xl p-4 text-xs leading-relaxed text-red-800 dark:text-red-300">
                <p className="font-bold mb-1">
                  تنبيه: أنت على وشك حذف قسم <strong>&quot;{categoryName}&quot;</strong>!
                </p>
                <p className="opacity-90">
                  سيتم مسح كارت القسم وجميع الصور والأكواد التابعة له نهائياً. إذا كنت تريد فقط إخفاءه من المتجر للعملاء دون مسح محتواه، استخدم زر <strong>&quot;مخفي من الرئيسية&quot;</strong> بدلاً من الحذف.
                </p>
              </div>

              <form onSubmit={handleDeleteConfirm} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
                    أدخل الرقم السري للإدارة لتأكيد المسح:
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      autoFocus
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none text-left tracking-[0.3em] font-mono text-base font-bold"
                      dir="ltr"
                    />
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3.5 pointer-events-none" />
                  </div>
                </div>

                {errorMessage && (
                  <p className="text-xs font-bold text-red-600 bg-red-100 dark:bg-red-900/40 p-2.5 rounded-xl text-center animate-pulse">
                    {errorMessage}
                  </p>
                )}

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={isDeleting || !password}
                    className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>{isDeleting ? "جاري المسح..." : "تأكيد حذف القسم"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="px-5 py-3 rounded-xl border border-border hover:bg-gray-100 dark:hover:bg-gray-800 text-foreground font-bold text-sm transition-colors"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
