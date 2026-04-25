"use client";

import { useState, useRef } from "react";
import { Pencil, X, Save, Upload, Image as ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { updateCategoryItem } from "../actions";

type ItemData = {
  id: string;
  name: string | null;
  price: number | null;
  image: string;
  code: string;
};

export function EditItemButton({ item }: { item: ItemData }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(item.name || "");
  const [price, setPrice] = useState(item.price?.toString() || "");
  const [image, setImage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("الصورة كبيرة جداً، يرجى اختيار صورة أقل من 2 ميجابايت.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.set("itemId", item.id);
      formData.set("name", name);
      formData.set("price", price);
      formData.set("image", image);
      await updateCategoryItem(formData);
      setOpen(false);
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء التعديل");
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="p-2 text-primary hover:bg-primary/10 rounded-xl transition-colors"
        title="تعديل"
      >
        <Pencil className="w-4 h-4" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setOpen(false)}>
      <div className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-lg p-6 space-y-5" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Pencil className="w-5 h-5 text-primary" />
            تعديل المنتج - <span className="font-mono text-primary">{item.code}</span>
          </h3>
          <button onClick={() => setOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Image */}
        <div className="flex items-center gap-4">
          <img src={image || item.image} alt={item.code} className="w-20 h-20 rounded-xl object-cover border border-border shadow-sm" />
          <div className="text-sm text-gray-500">
            <p>الصورة الحالية</p>
            <p className="text-xs text-gray-400 mt-1">ممكن تغيرها من الزر تحت</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-bold mb-1.5 text-gray-700 dark:text-gray-300">اسم المنتج</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: أسورة ذهبية"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground outline-none focus:ring-1 focus:ring-primary shadow-sm"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-bold mb-1.5 text-gray-700 dark:text-gray-300">السعر (ج.م)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="مثال: 250"
              min="0"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground outline-none focus:ring-1 focus:ring-primary shadow-sm text-left font-mono"
              dir="ltr"
            />
          </div>

          {/* Change Image */}
          <div>
            <label className="block text-sm font-bold mb-1.5 text-gray-700 dark:text-gray-300">تغيير الصورة (اختياري)</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="رابط صورة جديدة أو ارفع من الجهاز..."
                className="flex-1 px-4 py-3 rounded-xl border border-border bg-background text-foreground outline-none focus:ring-1 focus:ring-primary text-left font-mono text-sm shadow-sm"
                dir="ltr"
              />
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-all flex items-center gap-2 border border-border shadow-sm text-xs font-bold"
              >
                <Upload className="w-3.5 h-3.5" />
                رفع
              </button>
            </div>
            {image && (
              <div className="mt-3 relative w-max">
                <img src={image} alt="Preview" className="h-16 rounded-lg object-contain border border-border shadow-sm" />
                <div className="absolute -top-2 -right-2 bg-primary text-white p-1 rounded-full shadow-lg border border-white">
                  <ImageIcon className="w-2.5 h-2.5" />
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex justify-center items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-opacity-90 transition-all shadow-md disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {loading ? "جاري الحفظ..." : "حفظ التعديلات"}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors border border-border"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
