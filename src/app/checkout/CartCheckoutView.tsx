"use client";

import { useCart } from "@/components/CartProvider";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ShieldCheck, Truck, MapPin, MapPinOff, ShoppingBag, Trash2 } from "lucide-react";
import { saveOrder } from "./actions";

export function CartCheckoutView({ provinces }: { provinces: any[] }) {
  const { items, subtotal, itemCount, clearCart } = useCart();
  const router = useRouter();
  const [selectedProvinceId, setSelectedProvinceId] = useState("");
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [address, setAddress] = useState("");

  // استرجاع المحافظة المختارة من السلة
  useEffect(() => {
    const savedProvince = localStorage.getItem("mdonna_selected_province");
    if (savedProvince) {
      setSelectedProvinceId(savedProvince);
    }
  }, []);

  const selectedProvince = provinces.find((p) => p.id === selectedProvinceId);
  const shippingFee = selectedProvince ? selectedProvince.shippingFee : 0;
  const grandTotal = subtotal + shippingFee;

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
        alert("تعذر الوصول إلى موقعك، يرجى السماح بصلاحيات الموقع.");
        setLocationLoading(false);
      },
      { enableHighAccuracy: true }
    );
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedProvinceId) return alert("الرجاء اختيار محافظة الشحن!");
    if (items.length === 0) return alert("السلة فارغة!");

    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      formData.append("totalAmount", grandTotal.toString());

      // إرسال تفاصيل المنتجات كملاحظات على الطلب
      const itemsSummary = items.map(i =>
        `${i.name || i.code} × ${i.quantity} = ${(i.price * i.quantity).toLocaleString()} ج.م`
      ).join("\n");
      formData.append("orderNotes", itemsSummary);

      await saveOrder(formData);

      // تفريغ السلة بعد التأكيد
      clearCart();
      localStorage.removeItem("mdonna_selected_province");

      router.push("/thank-you");
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء رفع الطلب.");
      setLoading(false);
    }
  }

  // لو السلة فاضية (مثلاً المستخدم فتح الرابط مباشرة)
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center gap-6">
        <div className="w-28 h-28 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
          <ShoppingBag className="w-14 h-14 text-gray-300 dark:text-gray-600" />
        </div>
        <h2 className="text-2xl font-black text-foreground">السلة فارغة</h2>
        <p className="text-gray-500">ارجعي للأقسام واختاري المنتجات اللي عايزاها</p>
        <button
          onClick={() => router.push("/")}
          className="px-8 py-3.5 bg-primary text-primary-foreground rounded-2xl font-bold hover:opacity-90 transition-all shadow-md"
        >
          تصفحي المنتجات
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-12 pb-24">
      {/* فورم بيانات العميل */}
      <div className="md:col-span-3">
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
                  placeholder="الشارع، رقم العمارة، وأقرب علامة مميزة..."
                  className="w-full px-5 py-3.5 rounded-2xl border border-border bg-background text-foreground outline-none focus:ring-1 focus:ring-primary shadow-sm resize-y"
                ></textarea>
              </div>
            </div>

            {/* صندوق الإجمالي */}
            <div className="bg-primary/10 dark:bg-primary/20 border-2 border-primary/30 rounded-[24px] p-6 lg:p-8 flex flex-col items-center text-center shadow-sm">
              <h3 className="text-xl font-bold text-foreground mb-1">الإجمالي المطلوب دفعه للمندوب كاش</h3>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-4xl md:text-5xl font-black text-primary">{grandTotal.toLocaleString()}</span>
                <span className="text-2xl font-bold text-gray-500">جنيهاً</span>
              </div>
              {selectedProvinceId ? (
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mt-3 bg-white dark:bg-gray-800 px-3 py-1.5 rounded-xl">
                  شامل {itemCount} قطعة ({subtotal.toLocaleString()} ج.م) + شحن ({shippingFee} ج.م)
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
      </div>

      {/* ملخص السلة */}
      <div className="md:col-span-2">
        <div className="bg-card border border-border p-6 rounded-[24px] shadow-sm sticky top-6">
          <h2 className="text-lg font-bold text-foreground border-b border-border pb-4 mb-4">ملخص الطلب ({itemCount} قطعة)</h2>

          <div className="space-y-3 mb-6 max-h-80 overflow-y-auto">
            {items.map((item) => (
              <div key={item.id} className="flex gap-3 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl border border-border/50">
                <div className="w-14 h-14 bg-white dark:bg-gray-700 rounded-lg flex items-center justify-center p-0.5 border border-border shadow-sm flex-shrink-0 overflow-hidden">
                  <img src={item.image} alt={item.name || item.code} className="w-full h-full object-cover rounded" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-foreground text-sm line-clamp-1">{item.name || item.code}</h3>
                  <p className="text-xs text-gray-400 font-mono">{item.code}</p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-gray-500">{item.quantity}×</span>
                    <span className="text-primary font-bold text-sm">{(item.price * item.quantity).toLocaleString()} ج.م</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3 pt-4 border-t border-dashed border-gray-300 dark:border-gray-700">
            <div className="flex justify-between items-center text-sm font-medium text-gray-600 dark:text-gray-400">
              <span>إجمالي المنتجات</span>
              <span className="font-bold">{subtotal.toLocaleString()} ج.م</span>
            </div>
            <div className="flex justify-between items-center text-sm font-medium text-gray-600 dark:text-gray-400">
              <span>الشحن</span>
              {selectedProvinceId ? (
                <span className="text-primary font-bold">{shippingFee.toLocaleString()} ج.م</span>
              ) : (
                <span className="text-orange-500 font-bold text-xs">اختر المحافظة</span>
              )}
            </div>
            <div className="h-px bg-gray-200 dark:bg-gray-700" />
            <div className="flex justify-between items-center">
              <span className="font-black text-foreground">الإجمالي</span>
              <span className="font-black text-xl text-primary">{grandTotal.toLocaleString()} ج.م</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
