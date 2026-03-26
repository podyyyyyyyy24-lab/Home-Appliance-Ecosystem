"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { deleteProduct } from "./actions";
import { useRouter } from "next/navigation";

export function DeleteProductButton({ productId }: { productId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    const password = prompt("لحذف هذا المنتج نهائياً، يرجى إدخال الرقم السري للإدارة (123123):");
    if (password === "123123") {
      if (confirm("هل أنت متأكد من رغبتك في حذف هذا المنتج وكل الألوان الخاصة به؟ لا يمكن التراجع عن هذه الخطوة.")) {
        setLoading(true);
        try {
          await deleteProduct(productId);
          router.refresh();
        } catch (error) {
          console.error(error);
          alert("حدث خطأ أثناء الحذف.");
          setLoading(false);
        }
      }
    } else if (password !== null) {
      alert("الرقم السري غير صحيح. عملية الحذف ملغاة.");
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={loading}
      className="p-2.5 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-xl transition-colors border border-red-200 dark:border-red-800/30 flex items-center justify-center disabled:opacity-50"
      title="حذف المنتج"
    >
      <Trash2 className="w-5 h-5" />
    </button>
  );
}
