"use client";

import { useState } from "react";
import Link from "next/link";
import { ShieldCheck, Truck, PackageCheck, AlertCircle } from "lucide-react";

export function ProductDisplay({ product }: { product: any }) {
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants.length > 0 ? product.variants[0] : null
  );

  const activeImage = selectedVariant?.image || product.image;
  const isOutOfStock = selectedVariant ? selectedVariant.stock === 0 : false;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pb-24">
      {/* Product Image Gallery & Trust Badges */}
      <div className="flex flex-col gap-6">
        <div className="bg-gray-100 dark:bg-gray-800/60 rounded-[32px] overflow-hidden relative aspect-square shadow-sm flex items-center justify-center p-8 border border-border transition-all">
          {activeImage ? (
            <img 
              src={activeImage} 
              alt={product.title} 
              className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal transition-all duration-500 hover:scale-105" 
            />
          ) : (
            <div className="text-gray-300 dark:text-gray-600 block">لا توجد صورة</div>
          )}
          
          {/* Piece Count Badge (Master prompt requirement) */}
          {selectedVariant?.piece_count > 1 && (
            <div className="absolute top-6 left-6 bg-primary text-white font-bold px-4 py-2 rounded-2xl shadow-lg border border-primary-foreground/20 flex gap-2 w-fit">
              <PackageCheck className="w-5 h-5 text-yellow-300" />
              <span>{selectedVariant.piece_count} قطع </span>
            </div>
          )}
        </div>
      </div>

      {/* Product Details & Logic */}
      <div className="flex flex-col gap-6 pt-4">
        {/* Title and Price */}
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-foreground mb-4 leading-tight">{product.title}</h1>
          <div className="flex items-end gap-2 mb-2">
            <span className="text-5xl font-black text-primary">{product.basePrice.toLocaleString()}</span>
            <span className="text-xl font-bold text-gray-500 dark:text-gray-400 pb-1.5">ج.م</span>
          </div>
          <p className="inline-block mt-2 font-bold px-4 py-1.5 bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-400 rounded-xl text-sm border border-yellow-200 dark:border-yellow-800/50">
            الدفع عند الاستلام (عاين منتجك قبل الدفع)
          </p>
        </div>

        {/* Conditional Warranty Requirement */}
        {product.warranty_period && (
          <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 rounded-2xl">
            <ShieldCheck className="text-green-600 dark:text-green-400 w-8 h-8" />
            <div>
              <p className="font-bold text-green-800 dark:text-green-300 text-lg">ضمان الصيانة متاح</p>
              <p className="text-green-700 dark:text-green-400 text-sm">هذا الموديل يشمله الضمان لمدة ({product.warranty_period}).</p>
            </div>
          </div>
        )}

        <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed whitespace-pre-wrap">{product.description}</p>

        {/* Interactive Color Swatches Requirement */}
        {product.variants.length > 0 && (
          <div className="mt-4 bg-card border border-border p-6 rounded-3xl shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-foreground">اللون المتاح</h3>
              <span className="text-sm font-medium text-gray-500">مختــار: <span className="font-bold text-foreground">{selectedVariant.colorName}</span></span>
            </div>
            
            <div className="flex flex-wrap gap-4">
              {product.variants.map((v: any) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariant(v)}
                  className={`relative w-14 h-14 rounded-full border-4 transition-all focus:outline-none ${selectedVariant?.id === v.id ? 'border-primary scale-110 shadow-lg' : 'border-gray-200 dark:border-gray-700 hover:scale-105'}`}
                  style={{ backgroundColor: v.colorHex }}
                  title={`${v.colorName} - بالمخزن: ${v.stock}`}
                >
                  {/* Stock crossout logic visually */}
                  {v.stock === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-full h-1 bg-red-500 rotate-45 rounded-full absolute"></div>
                      <div className="w-full h-1 bg-red-500 -rotate-45 rounded-full absolute"></div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="mt-8">
          <Link 
            href={isOutOfStock ? "#" : `/checkout?productId=${product.id}&variantId=${selectedVariant?.id || ''}`} 
            className={`flex justify-center items-center py-5 text-xl font-bold rounded-2xl shadow-md transition-all ${
              isOutOfStock 
                ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed border-none" 
                : "bg-primary text-primary-foreground hover:bg-opacity-90 hover:scale-[1.01]"
            }`}
          >
             {isOutOfStock ? "غير متوفر بالمخزن" : "أضف للطلب واشحن الآن"}
          </Link>
          
          <div className="flex justify-center items-center gap-2 mt-4 text-sm text-gray-500 dark:text-gray-400 font-medium">
             <Truck className="w-4 h-4" /> <span>سيتم حساب سعر الشحن في الخطوة القادمة، يصلك حتى الباب.</span>
          </div>
        </div>

      </div>
    </div>
  );
}
