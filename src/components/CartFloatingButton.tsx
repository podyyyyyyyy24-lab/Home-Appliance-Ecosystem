"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "./CartProvider";

export function CartFloatingButton() {
  const { itemCount, setIsOpen, subtotal } = useCart();

  if (itemCount === 0) return null;

  return (
    <button
      onClick={() => setIsOpen(true)}
      className="fixed bottom-6 left-6 z-[990] group"
      aria-label="فتح السلة"
    >
      <div className="relative flex items-center gap-2.5 bg-primary text-primary-foreground pl-5 pr-4 py-3.5 rounded-2xl shadow-2xl shadow-primary/30 hover:scale-105 hover:shadow-primary/40 active:scale-95 transition-all duration-200 border border-white/20">
        <ShoppingCart className="w-5 h-5" />
        <span className="font-black text-sm">{subtotal.toLocaleString()} ج.م</span>
        
        {/* عداد القطع */}
        <div className="absolute -top-2.5 -right-2.5 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-black shadow-lg border-2 border-white dark:border-gray-900 animate-bounce">
          {itemCount}
        </div>
      </div>
    </button>
  );
}
