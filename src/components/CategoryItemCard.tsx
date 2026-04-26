"use client";

import { useCart } from "@/components/CartProvider";
import { Hash, Check, ShoppingCart } from "lucide-react";
import { useState } from "react";

interface CategoryItemCardProps {
  item: {
    id: string;
    code: string;
    name: string | null;
    image: string;
    price: number | null;
  };
  categoryName?: string;
}

export function CategoryItemCard({ item, categoryName }: CategoryItemCardProps) {
  const { addItem, items } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const inCart = items.find((i) => i.id === item.id);

  const handleClick = () => {
    if (!item.price) return; // ما ينفعش نضيف منتج من غير سعر

    addItem({
      id: item.id,
      code: item.code,
      name: item.name,
      image: item.image,
      price: item.price,
      categoryName,
    });

    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <div
      onClick={handleClick}
      className={`group bg-white/90 dark:bg-card/90 backdrop-blur-sm rounded-[24px] border shadow-sm hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 transition-all duration-300 overflow-hidden flex flex-col ${
        item.price ? "cursor-pointer" : "cursor-default"
      } ${inCart ? "border-primary/50 ring-2 ring-primary/20" : "border-border/50"}`}
    >
      {/* الصورة */}
      <div className="relative h-64 bg-gray-50 dark:bg-gray-800/40 overflow-hidden">
        <img
          src={item.image}
          alt={item.name || item.code}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        {/* كود المنتج */}
        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1 shadow-lg">
          <Hash className="w-3 h-3" />
          {item.code}
        </div>

        {/* أنيميشن الإضافة للسلة */}
        {justAdded && (
          <div className="absolute inset-0 flex items-center justify-center bg-primary/80 backdrop-blur-sm transition-all z-20">
            <div className="flex flex-col items-center gap-2 animate-bounce">
              <Check className="w-12 h-12 text-white" />
              <span className="text-white font-black text-lg">تمت الإضافة! ✓</span>
            </div>
          </div>
        )}

        {/* علامة إنه في السلة */}
        {inCart && !justAdded && (
          <div className="absolute top-3 right-3 bg-primary text-white px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-lg">
            <ShoppingCart className="w-3 h-3" />
            {inCart.quantity}x في السلة
          </div>
        )}

        {/* Hover overlay */}
        {item.price && (
          <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
            <span className="bg-white/90 dark:bg-gray-900/90 text-primary font-black px-5 py-2.5 rounded-xl shadow-lg text-sm border border-primary/20 flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              اضغطي للإضافة للسلة
            </span>
          </div>
        )}
      </div>

      {/* المعلومات */}
      <div className="p-4 flex flex-col flex-1 justify-between bg-white/95 dark:bg-card border-t border-border/50">
        {item.name && (
          <h3 className="font-bold text-foreground text-base group-hover:text-primary transition-colors line-clamp-2 mb-2">
            {item.name}
          </h3>
        )}
        {item.price ? (
          <div className="flex items-end gap-1.5 mt-auto">
            <span className="text-2xl font-black text-foreground tracking-tight">
              {item.price.toLocaleString()}
            </span>
            <span className="text-sm font-bold text-gray-500 pb-0.5">ج.م</span>
          </div>
        ) : (
          <p className="text-sm text-gray-400 mt-auto">تواصل للسعر</p>
        )}
      </div>
    </div>
  );
}
