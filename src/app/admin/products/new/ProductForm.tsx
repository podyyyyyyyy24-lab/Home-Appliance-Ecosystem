"use client";

import { useState, useRef } from "react";
import { PlusCircle, Trash2, Save, Upload, Image as ImageIcon } from "lucide-react";
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
  const [mainImage, setMainImage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (optional but recommended for Base64)
    if (file.size > 2 * 1024 * 1024) {
      alert("الصورة كبيرة جداً، يرجى اختيار صورة أقل من 2 ميجابايت لضمان سرعة الموقع.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      callback(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

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
      formData.set("image", mainImage || (formData.get("image") as string)); // override with uploaded image if exists
      formData.append("variants", JSON.stringify(variants));
      await saveProduct(formData);
      router.push("/admin/products");
      router.refresh(); 
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
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">رابط صورة المنتج أو رفع ملف (Cloudinary/Upload)</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                name="image" 
                value={mainImage}
                onChange={(e) => setMainImage(e.target.value)}
                placeholder="https://res.cloudinary.com/..." 
                className="flex-1 px-4 py-3 rounded-xl border border-border bg-background text-foreground outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-left font-mono text-sm shadow-sm" dir="ltr" 
              />
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={(e) => handleFileUpload(e, setMainImage)}
                className="hidden" 
                accept="image/*"
              />
              <button 
                type="button" 
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-3 bg-primary/10 hover:bg-primary/20 text-primary font-bold rounded-xl border border-primary/20 transition-all flex items-center gap-2 whitespace-nowrap shadow-sm"
              >
                <Upload className="w-4 h-4" />
                <span>رفع من الكمبيوتر</span>
              </button>
            </div>
            {mainImage && (
              <div className="mt-4 relative group w-max">
                <img src={mainImage} alt="Main Preview" className="h-32 rounded-xl object-contain border border-border shadow-md" />
                <div className="absolute -top-2 -right-2 bg-green-500 text-white p-1 rounded-full shadow-lg border border-white">
                  <ImageIcon className="w-3 h-3" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dynamic Variants section */}
      <div className="space-y-5 pt-8 mt-8 border-t border-border">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
          <div>
            <h2 className="text-xl font-bold text-foreground">الألوان والمقاسات / المخزون التفصيلي</h2>
            <p className="text-sm text-gray-500 mt-1">يمكنك إضافة ألوان ومخزون خاص لكل لون وسيظهر كدوائر للمشتري.</p>
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
            <div key={variant.id} className="relative bg-card p-6 rounded-2xl border border-border flex flex-col gap-5 shadow-sm hover:border-gray-300 transition-colors group text-right">
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
                  <label className="block text-xs font-bold mb-1.5 text-gray-600 dark:text-gray-400 text-center">عدد القطع</label>
                  <input type="number" min="1" value={variant.piece_count} onChange={(e) => updateVariant(variant.id, "piece_count", e.target.value)} required className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:ring-1 focus:ring-primary text-center shadow-sm font-mono font-bold" />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1.5 text-gray-600 dark:text-gray-400 text-center text-red-600 dark:text-red-400">المخزون (Stock)</label>
                  <input type="number" min="0" value={variant.stock} onChange={(e) => updateVariant(variant.id, "stock", e.target.value)} required className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:ring-1 focus:ring-primary text-center shadow-sm font-mono font-bold" />
                </div>
                <div className="md:col-span-4 mt-1">
                  <label className="block text-xs font-bold mb-1.5 text-gray-600 dark:text-gray-400">صورة مخصصة تظهر عند اختيار اللون (رابط مباشر أو رفع ملف)</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={variant.image} 
                      onChange={(e) => updateVariant(variant.id, "image", e.target.value)} 
                      placeholder="https://res.cloudinary.com/..." 
                      className="flex-1 px-3 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:ring-1 focus:ring-primary text-left font-mono shadow-sm" dir="ltr" 
                    />
                    <input 
                      type="file"
                      onChange={(e) => handleFileUpload(e, (url) => updateVariant(variant.id, "image", url))}
                      className="hidden" 
                      accept="image/*"
                      id={`file-variant-${variant.id}`}
                    />
                    <button 
                      type="button"
                      onClick={() => document.getElementById(`file-variant-${variant.id}`)?.click()}
                      className="px-4 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 rounded-xl transition-all flex items-center gap-2 border border-border shadow-sm text-xs font-bold"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>رفع</span>
                    </button>
                  </div>
                  {variant.image && (
                    <div className="mt-3 relative w-max">
                      <img src={variant.image} alt={`Variant ${index + 1} Preview`} className="h-20 rounded-lg object-contain border border-border shadow-sm" />
                    </div>
                  )}
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
