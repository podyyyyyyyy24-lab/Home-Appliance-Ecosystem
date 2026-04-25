"use client";

import { useState, useRef } from "react";
import { Upload, Save, Hash, Image as ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { addCategoryItem } from "../actions";

export function CategoryItemForm({ categoryId, codePrefix, nextNumber }: { categoryId: string; codePrefix: string; nextNumber: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const nextCode = `${codePrefix}-${String(nextNumber).padStart(3, "0")}`;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("الصورة كبيرة جداً، يرجى اختيار صورة أقل من 2 ميجابايت.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!image) {
      alert("يرجى رفع صورة أولاً");
      return;
    }
    setLoading(true);

    try {
      const formData = new FormData();
      formData.set("categoryId", categoryId);
      formData.set("image", image);
      formData.set("name", name);
      formData.set("price", price);
      await addCategoryItem(formData);
      setImage("");
      setName("");
      setPrice("");
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء الحفظ");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-card p-6 rounded-2xl shadow-sm border border-primary/20">
      <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
        <Upload className="w-5 h-5 text-primary" />
        إضافة صورة جديدة
        <span className="text-sm font-mono bg-primary/10 text-primary px-3 py-1 rounded-lg mr-auto flex items-center gap-1">
          <Hash className="w-3.5 h-3.5" />
          الكود التالي: {nextCode}
        </span>
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Image Upload */}
          <div className="md:col-span-3">
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">الصورة (مطلوبة)</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="أو الصق رابط صورة هنا..."
                className="flex-1 px-4 py-3 rounded-xl border border-border bg-background text-foreground outline-none focus:ring-1 focus:ring-primary text-left font-mono text-sm shadow-sm"
                dir="ltr"
              />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
                accept="image/*"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-3 bg-primary/10 hover:bg-primary/20 text-primary font-bold rounded-xl border border-primary/20 transition-all flex items-center gap-2 whitespace-nowrap shadow-sm"
              >
                <Upload className="w-4 h-4" />
                <span>رفع من الجهاز</span>
              </button>
            </div>
            {image && (
              <div className="mt-3 relative group w-max">
                <img src={image} alt="Preview" className="h-24 rounded-xl object-contain border border-border shadow-md" />
                <div className="absolute -top-2 -right-2 bg-primary text-white p-1 rounded-full shadow-lg border border-white">
                  <ImageIcon className="w-3 h-3" />
                </div>
              </div>
            )}
          </div>

          {/* Optional Name */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">اسم المنتج (اختياري)</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: اسوارة ذهبية"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground outline-none focus:ring-1 focus:ring-primary shadow-sm"
            />
          </div>

          {/* Optional Price */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">السعر (اختياري)</label>
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

          {/* Submit */}
          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading || !image}
              className="w-full flex justify-center items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-opacity-90 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? "جاري الحفظ..." : "حفظ وتوليد الكود"}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
