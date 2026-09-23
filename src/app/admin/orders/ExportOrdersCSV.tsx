"use client";

import { Download } from "lucide-react";

interface OrderData {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  provinceName: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

export function ExportOrdersCSV({ orders }: { orders: OrderData[] }) {
  const handleExport = () => {
    if (!orders || orders.length === 0) {
      alert("لا توجد طلبيات لتصديرها حالياً.");
      return;
    }

    // CSV Header with BOM for Arabic UTF-8 support in Excel
    const headers = [
      "رقم الشحنة",
      "اسم العميل",
      "رقم الهاتف",
      "المحافظة",
      "العنوان بالتفصيل",
      "المطلوب تحصيله (ج.م)",
      "حالة الطلب",
      "تاريخ الطلب"
    ];

    const statusMap: Record<string, string> = {
      PENDING: "قيد التجهيز بالمخزن",
      OUT_FOR_DELIVERY: "مع شركة الشحن",
      DELIVERED: "تم التوصيل والتحصيل",
      CANCELLED: "ملغي / مرتجع",
    };

    const rows = orders.map((o) => [
      `"${o.id.slice(-6).toUpperCase()}"`,
      `"${o.customerName.replace(/"/g, '""')}"`,
      `"${o.customerPhone}"`,
      `"${o.provinceName.replace(/"/g, '""')}"`,
      `"${o.customerAddress.replace(/"/g, '""')}"`,
      o.totalAmount,
      `"${statusMap[o.status] || o.status}"`,
      `"${new Date(o.createdAt).toLocaleDateString("ar-EG")}"`,
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `phonehub_shipping_manifest_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={handleExport}
      className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-primary text-primary-foreground font-bold hover:opacity-90 shadow-md hover:-translate-y-0.5 transition-all text-sm"
      title="تصدير شيت إكسيل لتسليمه لشركة الشحن"
    >
      <Download className="w-4 h-4" />
      <span>تصدير مانيفست لشركة الشحن (Excel / CSV)</span>
    </button>
  );
}
