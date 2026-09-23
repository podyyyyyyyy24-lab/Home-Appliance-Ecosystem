"use client";

import { useState, useTransition } from "react";
import { Copy, Check, MessageCircle, Printer, X, Trash2, Truck, CheckCircle2, Clock, Ban } from "lucide-react";
import { updateOrderStatusAction, deleteOrderAction } from "./actions";

interface OrderProps {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  provinceName: string;
  shippingFee: number;
  totalAmount: number;
  status: string;
  createdAt: string;
}

export function OrderShippingActions({ order }: { order: OrderProps }) {
  const [copied, setCopied] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [currentStatus, setCurrentStatus] = useState(order.status);

  const waybillText = `📦 بوليصة شحن - PhoneHub Store
=========================
رقم الشحنة: #${order.id.slice(-6).toUpperCase()}
العميل: ${order.customerName}
رقم الهاتف: ${order.customerPhone}
المحافظة: ${order.provinceName}
العنوان: ${order.customerAddress}
المطلوب تحصيله (COD): ${order.totalAmount.toLocaleString()} ج.م
محتويات الطرد: إكسسوارات وهواتف PhoneHub
ملاحظات الشحن: فحص ومعاينة الشحنة مسموح بها قبل الاستلام.
=========================`;

  const handleCopyWaybill = async () => {
    try {
      await navigator.clipboard.writeText(waybillText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      alert("تم تجهيز البوليصة:\n" + waybillText);
    }
  };

  const handleStatusChange = (newStatus: string) => {
    setCurrentStatus(newStatus);
    startTransition(async () => {
      const res = await updateOrderStatusAction(order.id, newStatus);
      if (!res.success) {
        setCurrentStatus(order.status);
        alert(res.error || "تعذر تحديث الحالة");
      }
    });
  };

  const handleDelete = () => {
    if (confirm(`هل أنت متأكد من حذف طلب العميل: ${order.customerName}؟`)) {
      startTransition(async () => {
        const res = await deleteOrderAction(order.id);
        if (!res.success) {
          alert(res.error || "تعذر حذف الطلب");
        }
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex items-center gap-2">
      {/* 1. Status Dropdown */}
      <select
        value={currentStatus}
        disabled={isPending}
        onChange={(e) => handleStatusChange(e.target.value)}
        className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors outline-none cursor-pointer ${
          currentStatus === "DELIVERED"
            ? "bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-300 border-green-300 dark:border-green-800"
            : currentStatus === "OUT_FOR_DELIVERY"
            ? "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-800"
            : currentStatus === "CANCELLED"
            ? "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border-red-300 dark:border-red-800"
            : "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800"
        }`}
      >
        <option value="PENDING">⏳ قيد التجهيز (بالمخزن)</option>
        <option value="OUT_FOR_DELIVERY">🚚 مع شركة الشحن</option>
        <option value="DELIVERED">✅ تم التسليم والتحصيل</option>
        <option value="CANCELLED">❌ مرتجع / ملغي</option>
      </select>

      {/* 2. Copy Waybill */}
      <button
        onClick={handleCopyWaybill}
        title="نسخ بيانات البوليصة لسيستم شركة الشحن"
        className="p-2.5 rounded-xl border border-border bg-card hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-all flex items-center justify-center relative group shadow-sm"
      >
        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
        {copied && (
          <span className="absolute -top-8 right-1/2 translate-x-1/2 bg-black text-white text-[11px] px-2 py-0.5 rounded-md whitespace-nowrap shadow-md">
            تم نسخ البوليصة!
          </span>
        )}
      </button>

      {/* 3. Send WhatsApp to Shipping Company or Customer */}
      <a
        href={`https://api.whatsapp.com/send/?text=${encodeURIComponent(waybillText)}`}
        target="_blank"
        rel="noreferrer"
        title="إرسال بيانات الشحنة عبر واتساب"
        className="p-2.5 rounded-xl border border-green-200 dark:border-green-800/50 bg-green-50 dark:bg-green-950/30 hover:bg-green-100 text-green-600 dark:text-green-400 transition-all flex items-center justify-center shadow-sm"
      >
        <MessageCircle className="w-4 h-4" />
      </a>

      {/* 4. Print Waybill Label */}
      <button
        onClick={() => setIsPrintModalOpen(true)}
        title="طباعة بوليصة / ملصق الطرد"
        className="p-2.5 rounded-xl border border-purple-200 dark:border-purple-800/50 bg-purple-50 dark:bg-purple-950/30 hover:bg-purple-100 text-purple-600 dark:text-purple-400 transition-all flex items-center justify-center shadow-sm"
      >
        <Printer className="w-4 h-4" />
      </button>

      {/* 5. Delete Order */}
      <button
        onClick={handleDelete}
        title="حذف الطلب"
        className="p-2.5 rounded-xl border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 text-red-600 dark:text-red-400 transition-all flex items-center justify-center shadow-sm"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      {/* Printable Shipping Label Modal */}
      {isPrintModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-black p-6 rounded-3xl max-w-lg w-full shadow-2xl relative border-2 border-black">
            {/* Modal Controls (Hidden in print) */}
            <div className="print:hidden flex justify-between items-center pb-4 mb-4 border-b border-gray-200">
              <h3 className="font-bold text-lg text-gray-800">معاينة بوليصة الشحن (استيكر الطرد)</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 bg-black text-white rounded-xl font-bold text-sm flex items-center gap-1.5 hover:bg-gray-800"
                >
                  <Printer className="w-4 h-4" />
                  طباعة الآن
                </button>
                <button
                  onClick={() => setIsPrintModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Waybill Sheet */}
            <div id={`waybill-${order.id}`} className="space-y-4 font-sans text-right" dir="rtl">
              <div className="border-b-2 border-black pb-3 flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-black tracking-tight">PhoneHub Store</h1>
                  <p className="text-xs text-gray-600 font-semibold">بوليصة شحن طرد سريع • هواتف وإكسسوارات</p>
                </div>
                <div className="text-left font-mono" dir="ltr">
                  <span className="text-xs text-gray-500 font-bold block">WAYBILL #</span>
                  <span className="text-lg font-black bg-black text-white px-2 py-0.5 rounded">
                    PH-{order.id.slice(-6).toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Barcode Simulation */}
              <div className="bg-gray-100 p-2.5 rounded-lg text-center border border-gray-300">
                <div className="font-mono text-3xl tracking-[0.35em] font-bold text-black select-none">
                  ||||| | |||| ||| || |||||
                </div>
                <p className="text-[10px] text-gray-500 font-mono tracking-widest mt-1">
                  *{order.id.toUpperCase()}*
                </p>
              </div>

              {/* Recipient Details */}
              <div className="border-2 border-dashed border-gray-400 p-4 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-sm border-b border-gray-200 pb-2">
                  <span className="text-gray-500 font-bold">اسم المستلم:</span>
                  <span className="text-base font-black text-gray-950">{order.customerName}</span>
                </div>
                <div className="flex justify-between items-center text-sm border-b border-gray-200 pb-2">
                  <span className="text-gray-500 font-bold">رقم الهاتف:</span>
                  <span className="font-mono font-bold text-base text-gray-900" dir="ltr">
                    {order.customerPhone}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm border-b border-gray-200 pb-2">
                  <span className="text-gray-500 font-bold">المحافظة:</span>
                  <span className="font-bold text-sm bg-gray-200 px-2 py-0.5 rounded">
                    {order.provinceName}
                  </span>
                </div>
                <div className="text-sm pt-1">
                  <span className="text-gray-500 font-bold block mb-1">العنوان بالتفصيل:</span>
                  <p className="font-semibold text-gray-900 text-sm leading-relaxed bg-gray-50 p-2 rounded border border-gray-200">
                    {order.customerAddress}
                  </p>
                </div>
              </div>

              {/* COD Box */}
              <div className="bg-black text-white p-4 rounded-xl flex justify-between items-center">
                <div>
                  <p className="text-xs uppercase text-gray-300 font-bold">المبلغ المطلوب تحصيله (COD)</p>
                  <p className="text-xs text-gray-400">شامل سعر المنتج ومصاريف الشحن</p>
                </div>
                <div className="text-left font-black text-3xl">
                  {order.totalAmount.toLocaleString()} <span className="text-sm font-normal">ج.م</span>
                </div>
              </div>

              <div className="text-[11px] text-gray-500 text-center leading-normal pt-1">
                <p>⚠️ تعليمات شركة الشحن: يُسمح للعميل بمعاينة محتويات الطرد قبل الاستلام.</p>
                <p>للدعم الفني والاستفسار: متجر PhoneHub Store</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
