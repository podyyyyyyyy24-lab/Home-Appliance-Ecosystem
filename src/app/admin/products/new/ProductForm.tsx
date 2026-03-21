"use client";

import { useState } from "react";
import { PlusCircle, Trash2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { saveProduct } from "../actions";
import Link from "next/link";

type Variant = {
  id: string; // temp id for UI only
  colorName: string;
  colorHex: string;
  piece_count: number;
  stock: number;
  image: string;
};

export function ProductForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [variants, setVariants] = useState<Variant[]>([]);

  const addVariant = () => {
    setVariants([
      ...variants,
      {
        id: Math.random().toString(36),
        colorName: "",
        colorHex: "#000000",
        piece_count: 1,
        stock: 10,
        image: "",
      },
    ]);
  };

  const removeVariant = (id: string) => {
    setVariants(variants.filter((v) => v.id !== id));
  };

  const updateVariant = (id: string, field: keyof Variant, value: any) => {
    setVariants(
      variants.map((v) => (v.id === id ? { ...v, [field]: value } : v))
    );
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      formData.append("variants", JSON.stringify(variants));
      await saveProduct(formData);
      router.push("/admin/products");
      router.refresh(); // forces Next App Router to re-fetch the product list
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Product Information */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold border-b border-border pb-3 text-foreground">المعلومات الأساسية للمنتج</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">اسم المنتج أو الطقم</label>
            <input type="text" name="title" required placeholder="مثال: طقم حلل جرانيت أصلي 12 قطعة" className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all shadow-sm" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">الوصف الكامل والمميزات (اختياري)</label>
            <textarea name="description" rows={4} placeholder="الموديل، الصناعة، مميزات الاستخدام..." className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all resize-y shadow-sm"></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">السعر الأساسي המوحد (جنيه)</label>
            <input type="number" name="basePrice" required min="1" placeholder="مثال: 1250" className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-left shadow-sm font-mono text-lg font-bold" dir="ltr" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">فترة الضمان (يختفي آلياً إذا كان فارغاً)</label>
            <input type="text" name="warranty_period" placeholder="مثال: سنتين / سنة واحدة" className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all shadow-sm" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">رابط صورة المنتج الشاملة (رابط مباشر لـ Cloudinary)</label>
            <input type="text" name="image" placeholder="https://res.cloudinary.com/..." className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-left font-mono text-sm shadow-sm" dir="ltr" />
          </div>
        </div>
      </div>

      {/* Dynamic Variants section */}
      <div className="space-y-5 pt-8 mt-8 border-t border-border">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
          <div>
            <h2 className="text-xl font-bold text-foreground">الألوان والمقاسات / المخزون التفصيلي</h2>
            <p className="text-sm text-gray-500 mt-1 mt-1">يمكنك إضافة ألوان ومخزون خاص لكل لون وسيظهر كدوائر للمشتري.</p>
          </div>
          <button type="button" onClick={addVariant} className="flex items-center gap-2 px-5 py-2.5 bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-800/50 text-green-800 dark:text-green-300 rounded-xl font-bold transition-all shadow-sm text-sm border border-green-200 dark:border-green-800/40">
            <PlusCircle className="w-4 h-4" />
            <span>إضافة لون مخصص</span>
          </button>
        </div>
        
        {variants.length === 0 && (
          <div className="bg-gray-50 dark:bg-gray-800/30 p-8 rounded-2xl border-2 border-dashed border-border text-center">
            <p className="text-gray-500 font-medium">هذا المنتج لا يحتوي على توفر ألوان خاصة (سيعتمد الواجهة السعر الأساسي فقط).</p>
          </div>
        )}

        <div className="space-y-4">
          {variants.map((variant, index) => (
            <div key={variant.id} className="relative bg-card p-6 rounded-2xl border border-border flex flex-col gap-5 shadow-sm hover:border-gray-300 transition-colors group">
              <div className="absolute top-4 left-4">
                <button type="button" onClick={() => removeVariant(variant.id)} className="p-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors" title="إزالة اللون نهائياً">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              <h3 className="font-bold text-primary flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: variant.colorHex }}></div>
                اللون #{index + 1}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                <div>
                  <label className="block text-xs font-bold mb-1.5 text-gray-600 dark:text-gray-400">اسم اللون المكتوب</label>
                  <input type="text" value={variant.colorName} onChange={(e) => updateVariant(variant.id, "colorName", e.target.value)} required placeholder="أحمر داكن" className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:ring-1 focus:ring-primary shadow-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1.5 text-gray-600 dark:text-gray-400 text-left">كود اللون (Hex)</label>
                  <div className="flex gap-2">
                    <input type="color" value={variant.colorHex} onChange={(e) => updateVariant(variant.id, "colorHex", e.target.value)} className="h-10 w-14 rounded-xl cursor-pointer border border-border p-0.5 bg-background shadow-sm" />
                    <input type="text" value={variant.colorHex} onChange={(e) => updateVariant(variant.id, "colorHex", e.target.value)} required className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm font-mono text-left outline-none focus:ring-1 focus:ring-primary shadow-sm uppercase tracking-widest" dir="ltr" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1.5 text-gray-600 dark:text-gray-400">عدد القطع في اللون</label>
                  <input type="number" min="1" value={variant.piece_count} onChange={(e) => updateVariant(variant.id, "piece_count", e.target.value)} required className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:ring-1 focus:ring-primary text-center shadow-sm font-mono font-bold" />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1.5 text-gray-600 dark:text-gray-400 text-red-600 dark:text-red-400">المخزون (Stock)</label>
                  <input type="number" min="0" value={variant.stock} onChange={(e) => updateVariant(variant.id, "stock", e.target.value)} required className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:ring-1 focus:ring-primary text-center shadow-sm font-mono font-bold" />
                </div>
                <div className="md:col-span-4 mt-1">
                  <label className="block text-xs font-bold mb-1.5 text-gray-600 dark:text-gray-400">صورة مخصصة تظهر عند اختيار اللون (رابط مباشر)</label>
                  <input type="text" value={variant.image} onChange={(e) => updateVariant(variant.id, "image", e.target.value)} placeholder="https://res.cloudinary.com/... (اختياري - سيتم عرض الصورة الأساسية للمنتج لو تُرِك فارغاً)" className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:ring-1 focus:ring-primary text-left font-mono shadow-sm" dir="ltr" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 pt-8 mt-4 border-t border-border">
        <button type="submit" disabled={loading} className="w-full sm:w-auto flex justify-center items-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-opacity-90 transition-all shadow-md disabled:opacity-70 disabled:cursor-wait text-lg">
          <Save className="w-5 h-5" />
          <span>{loading ? "جاري الحفظ في القاعدة..." : "حفظ المنتج ورفعه للمتجر"}</span>
        </button>
        <Link href="/admin/products" className="w-full sm:w-auto text-center px-8 py-3.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors border border-border shadow-sm">
          تراجع وإلغاء
        </Link>
      </div>
    </form>
  );
}
