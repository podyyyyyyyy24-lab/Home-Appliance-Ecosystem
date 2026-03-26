"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateFeeAction } from "./actions";

export function EditProvinceForm({ province }: { province: { id: string, shippingFee: number } }) {
  const [fee, setFee] = useState(province.shippingFee);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateFeeAction(province.id, fee);
      alert("تم تحديث السعر بنجاح!");
      router.refresh();
    } catch (err) {
      alert("حدث خطأ أثناء التحديث");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleUpdate} className="flex items-center gap-3">
      <input 
        type="number" 
        value={fee}
        onChange={(e) => setFee(parseFloat(e.target.value) || 0)}
        className="w-28 px-3 py-2 border border-border rounded-xl bg-background text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-left"
        min="0"
      />
      <button type="submit" disabled={loading} className="px-5 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-opacity-90 transition-all shadow-sm disabled:opacity-50">
        {loading ? "..." : "تعديل"}
      </button>
    </form>
  );
}
