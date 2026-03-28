"use client";

import { useState } from "react";
import { ShieldCheck, Truck, MapPin, MapPinOff } from "lucide-react";
import { saveOrder } from "./actions"; // Server action to process the order
import { useRouter } from "next/navigation";

export function CheckoutForm({ product, variantId, provinces }: { product: any, variantId?: string, provinces: any[] }) {
  const router = useRouter();
  const [selectedProvinceId, setSelectedProvinceId] = useState("");
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [address, setAddress] = useState("");

  const selectedProvince = provinces.find((p) => p.id === selectedProvinceId);
  const shippingFee = selectedProvince ? selectedProvince.shippingFee : 0;
  const grandTotal = product.basePrice + shippingFee;

  const activeVariant = product.variants.find((v: any) => v.id === variantId) || product.variants[0];

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("المتصفح الخاص بك لا يدعم ميزة تحديد الموقع الجغرافي.");
      return;
    }
    
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const mapsLink = ` [تم سحب اللوكيشن: https://maps.google.com/?q=${latitude},${longitude}]`;
        setAddress((prev) => prev + mapsLink);
        setLocationLoading(false);
      },
      (error) => {
        console.error("Error getting location", error);
        alert("تعذر الوصول إلى موقعك، يرجى السماح بصلاحيات الموقع لتشغيل هذه الميزة.");
        setLocationLoading(false);
      },
      { enableHighAccuracy: true }
    );
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedProvinceId) return alert("الرجاء اختيار محافظة الشحن!");
    
    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      formData.append("totalAmount", grandTotal.toString());
      if (activeVariant) {
        formData.append("variantName", activeVariant.colorName); // save for records
        formData.append("variantId", activeVariant.id);
      }

      await saveOrder(formData);
      router.push("/thank-you"); // redirecting to success page
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء رفع الطلب.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} autoComplete="off" className="bg-card p-6 md:p-8 rounded-[32px] border border-border shadow-sm">
      <h2 className="text-2xl font-black text-foreground mb-6">بيانات التوصيل</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">الاسم بالكامل</label>
          <input type="text" name="customerName" required placeholder="مثال: محمد السيد أحمد" autoComplete="off" data-lpignore="true" className="w-full px-5 py-3.5 rounded-2xl border border-border bg-background text-foreground outline-none focus:ring-1 focus:ring-primary shadow-sm" />
        </div>
        
        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">رقم الهاتف النشط للتواصل مع المندوب</label>
          <input type="text" name="customerPhone" required placeholder="01xxxxxxxxx" autoComplete="off" data-lpignore="true" className="w-full px-5 py-3.5 rounded-2xl border border-border bg-background text-foreground outline-none focus:ring-1 focus:ring-primary shadow-sm text-left font-mono" dir="ltr" />
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
            <div className="flex justify-between items-end mb-2">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">العنوان التفصيلي لتسهيل الوصول</label>
              <button 
                type="button" 
                onClick={handleGetLocation}
                disabled={locationLoading}
                className="text-xs flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-800/40 text-blue-700 dark:text-blue-400 rounded-lg transition-colors font-bold disabled:opacity-50"
              >
                {locationLoading ? <MapPinOff className="w-4 h-4 animate-pulse" /> : <MapPin className="w-4 h-4" />}
                {locationLoading ? "جاري التحديد..." : "سحب اللوكيشن 📍"}
              </button>
            </div>
            <textarea 
              name="customerAddress" 
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3} 
              autoComplete="off" data-lpignore="true"
              required 
              placeholder="الشارع، رقم العمارة، وأقرب علامة مميزة... (إذا حددت اللوكيشن عبر الزر أعلاه سيتم إرفاق الرابط هنا تلقائياً لسرعة التوصيل)" 
              className="w-full px-5 py-3.5 rounded-2xl border border-border bg-background text-foreground outline-none focus:ring-1 focus:ring-primary shadow-sm resize-y"
            ></textarea>
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
