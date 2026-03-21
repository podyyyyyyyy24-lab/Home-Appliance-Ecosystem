"use client";

import { useState } from "react";
import { ShieldCheck, ArrowRight, Truck } from "lucide-react";
import { saveOrder } from "./actions"; // Server action to process the order
import { useRouter } from "next/navigation";

export function CheckoutForm({ product, variantId, provinces }: { product: any, variantId?: string, provinces: any[] }) {
  const router = useRouter();
  const [selectedProvinceId, setSelectedProvinceId] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedProvince = provinces.find((p) => p.id === selectedProvinceId);
  const shippingFee = selectedProvince ? selectedProvince.shippingFee : 0;
  const grandTotal = product.basePrice + shippingFee;

  const activeVariant = product.variants.find((v: any) => v.id === variantId) || product.variants[0];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedProvinceId) return alert("الرجاء اختيار محافظة الشحن!");
    
    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      formData.append("totalAmount", grandTotal.toString());
      if (activeVariant) formData.append("variantName", activeVariant.colorName); // save for records

      await saveOrder(formData);
      router.push("/thank-you"); // redirecting to success page
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء رفع الطلب.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card p-6 md:p-8 rounded-[32px] border border-border shadow-sm">
      <h2 className="text-2xl font-black text-foreground mb-6">بيانات التوصيل</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">الاسم بالكامل</label>
          <input type="text" name="customerName" required placeholder="مثال: محمد السيد أحمد" className="w-full px-5 py-3.5 rounded-2xl border border-border bg-background text-foreground outline-none focus:ring-1 focus:ring-primary shadow-sm" />
        </div>
        
        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">رقم الهاتف النشط للتواصل مع المندوب</label>
          <input type="text" name="customerPhone" required placeholder="01xxxxxxxxx" className="w-full px-5 py-3.5 rounded-2xl border border-border bg-background text-foreground outline-none focus:ring-1 focus:ring-primary shadow-sm text-left font-mono" dir="ltr" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-2 border-b border-gray-100 dark:border-gray-800">
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">اختر نِطاق الشحن (المحافظة) بدقة</label>
            <div className="relative">
              <select 
                name="provinceId" 
                value={selectedProvinceId}
                onChange={(e) => setSelectedProvinceId(e.target.value)}
                required
                className="w-full px-5 py-3.5 rounded-2xl border border-primary bg-primary/5 text-primary font-bold outline-none focus:ring-1 focus:ring-primary shadow-sm appearance-none cursor-pointer"
              >
                <option value="" disabled>اضغط للاختيار...</option>
                {provinces.map(p => (
                  <option key={p.id} value={p.id}>{p.name} (+{p.shippingFee} ج.م)</option>
                ))}
              </select>
              <Truck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary pointer-events-none" />
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">العنوان التفصيلي لتسهيل الوصول</label>
            <textarea name="customerAddress" rows={3} required placeholder="الشارع، رقم العمارة، الشقة، وأقرب علامة مميزة..." className="w-full px-5 py-3.5 rounded-2xl border border-border bg-background text-foreground outline-none focus:ring-1 focus:ring-primary shadow-sm resize-y"></textarea>
          </div>
        </div>

        {/* Dynamic Total Cost Box precisely meeting Prompt criteria */}
        <div className="bg-primary/10 dark:bg-primary/20 border-2 border-primary/30 rounded-[24px] p-6 lg:p-8 flex flex-col items-center text-center shadow-sm">
           <h3 className="text-xl font-bold text-foreground mb-1">الإجمالي المطلوب دفعه للمندوب كاش</h3>
           <div className="flex items-center gap-2 mt-2">
              <span className="text-4xl md:text-5xl font-black text-primary">{grandTotal.toLocaleString()}</span>
              <span className="text-2xl font-bold text-gray-500">جنيهاً</span>
           </div>
           {selectedProvinceId ? (
             <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mt-3 bg-white dark:bg-gray-800 px-3 py-1.5 rounded-xl whitespace-pre-wrap">
               شامل سعر المنتج + مصاريف الشحن ({shippingFee} ج.م)
             </p>
           ) : (
             <p className="text-sm font-semibold text-red-500 mt-3 animate-pulse">
               يرجى اختيار المحافظة لإظهار الإجمالي الدقيق
             </p>
           )}
        </div>

        <button type="submit" disabled={loading || !selectedProvinceId} className="w-full py-5 bg-primary text-primary-foreground rounded-2xl font-black text-xl hover:bg-opacity-90 transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-3">
          {loading ? "جاري الارتباط بالسيرفر..." : "تأكيــد الطـلب (بدون قلق، كله كاش)"}
        </button>
        
        <div className="flex justify-center items-center gap-2 text-gray-500 font-medium text-sm mt-3 pb-2">
          <ShieldCheck className="w-4 h-4 text-green-600" /> لا توجد مبالغ خفية، كل شيء دقيق.
        </div>
      </div>
    </form>
  );
}
