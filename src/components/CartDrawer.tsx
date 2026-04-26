"use client";

import { useCart } from "./CartProvider";
import { X, Minus, Plus, Trash2, ShoppingBag, Truck, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Province {
  id: string;
  name: string;
  shippingFee: number;
}

export function CartDrawer() {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    itemCount,
    subtotal,
    isOpen,
    setIsOpen,
  } = useCart();

  const router = useRouter();
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [selectedProvinceId, setSelectedProvinceId] = useState("");
  const [loadingProvinces, setLoadingProvinces] = useState(false);

  // Fetch provinces when drawer opens
  useEffect(() => {
    if (isOpen && provinces.length === 0) {
      setLoadingProvinces(true);
      fetch("/api/provinces")
        .then((r) => r.json())
        .then((data) => {
          setProvinces(data);
          setLoadingProvinces(false);
        })
        .catch(() => setLoadingProvinces(false));
    }
  }, [isOpen, provinces.length]);

  const selectedProvince = provinces.find((p) => p.id === selectedProvinceId);
  const shippingFee = selectedProvince?.shippingFee || 0;
  const grandTotal = subtotal + shippingFee;

  const handleCheckout = () => {
    if (items.length === 0) return;
    // Pass cart to checkout via URL params
    const cartData = encodeURIComponent(JSON.stringify({
      items: items.map(i => ({ id: i.id, code: i.code, name: i.name, price: i.price, quantity: i.quantity, image: i.image })),
      provinceId: selectedProvinceId,
      shippingFee,
      subtotal,
      grandTotal,
    }));
    router.push(`/checkout?cart=${cartData}`);
    setIsOpen(false);
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[998] transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-full sm:w-[440px] bg-white dark:bg-gray-900 z-[999] shadow-2xl transform transition-transform duration-300 ease-out flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-l from-primary/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/25">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-black text-foreground">سلة المشتريات</h2>
              <p className="text-xs text-gray-500 font-medium">
                {itemCount > 0 ? `${itemCount} قطعة` : "فارغة"}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4 pb-20">
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-10 h-10 text-gray-300 dark:text-gray-600" />
              </div>
              <p className="text-gray-500 font-bold text-lg">السلة فارغة</p>
              <p className="text-gray-400 text-sm">اختاري المنتجات من الأقسام واضغطي عليها لإضافتها</p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 bg-gray-50 dark:bg-gray-800/60 p-3 rounded-2xl border border-gray-100 dark:border-gray-700/50 group hover:border-primary/30 transition-colors"
              >
                {/* Image */}
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name || item.code}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-foreground line-clamp-1">
                      {item.name || item.code}
                    </h4>
                    <p className="text-xs text-gray-400 font-mono">{item.code}</p>
                  </div>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-primary font-black text-base">
                      {(item.price * item.quantity).toLocaleString()} <span className="text-xs font-bold text-gray-400">ج.م</span>
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200 hover:text-red-500 transition-colors"
                      >
                        {item.quantity === 1 ? <Trash2 className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
                      </button>
                      <span className="w-8 text-center font-black text-sm text-foreground">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer – Province + Totals */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-800/80 px-5 py-4 space-y-4">
            {/* Province Selector */}
            <div>
              <label className="text-xs font-bold text-gray-500 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                محافظة الشحن
              </label>
              <div className="relative">
                <select
                  value={selectedProvinceId}
                  onChange={(e) => setSelectedProvinceId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-primary/40 bg-white dark:bg-gray-800 text-foreground font-bold text-sm outline-none focus:ring-2 focus:ring-primary/30 appearance-none cursor-pointer"
                >
                  <option value="">اختر المحافظة...</option>
                  {loadingProvinces ? (
                    <option disabled>جاري التحميل...</option>
                  ) : (
                    provinces.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} (+{p.shippingFee} ج.م شحن)
                      </option>
                    ))
                  )}
                </select>
                <Truck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary pointer-events-none" />
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center text-gray-600 dark:text-gray-400 font-medium">
                <span>إجمالي المنتجات ({itemCount} قطعة)</span>
                <span className="font-bold">{subtotal.toLocaleString()} ج.م</span>
              </div>
              <div className="flex justify-between items-center text-gray-600 dark:text-gray-400 font-medium">
                <span>مصاريف الشحن</span>
                {selectedProvinceId ? (
                  <span className="font-bold text-primary">{shippingFee.toLocaleString()} ج.م</span>
                ) : (
                  <span className="text-xs text-orange-500 font-bold animate-pulse">اختر المحافظة أولاً</span>
                )}
              </div>
              <div className="h-px bg-gray-200 dark:bg-gray-700 my-1" />
              <div className="flex justify-between items-center text-foreground">
                <span className="font-black text-base">الإجمالي</span>
                <span className="font-black text-2xl text-primary">{grandTotal.toLocaleString()} <span className="text-sm text-gray-400">ج.م</span></span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={handleCheckout}
                disabled={items.length === 0}
                className="flex-1 py-3.5 bg-primary text-primary-foreground font-black text-base rounded-xl hover:opacity-90 transition-all shadow-lg shadow-primary/25 disabled:opacity-50 disabled:shadow-none"
              >
                تأكيد الطلب 🛒
              </button>
              <button
                onClick={clearCart}
                className="px-4 py-3.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-bold rounded-xl hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors border border-red-200 dark:border-red-800/30"
                title="تفريغ السلة"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
