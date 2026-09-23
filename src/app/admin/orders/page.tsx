import prisma from "@/lib/prisma";
import { OrderShippingActions } from "./OrderShippingActions";
import { ExportOrdersCSV } from "./ExportOrdersCSV";
import { Truck, Clock, CheckCircle2, AlertCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  let orders: any[] = [];
  let dbError = false;

  try {
    orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        province: true,
      },
    });
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    dbError = true;
  }

  const pendingCount = orders.filter((o) => o.status === "PENDING").length;
  const inTransitCount = orders.filter((o) => o.status === "OUT_FOR_DELIVERY").length;
  const deliveredCount = orders.filter((o) => o.status === "DELIVERED").length;

  const exportData = orders.map((o) => ({
    id: o.id,
    customerName: o.customerName,
    customerPhone: o.customerPhone,
    customerAddress: o.customerAddress,
    provinceName: o.province?.name || "غير محدد",
    totalAmount: o.totalAmount,
    status: o.status,
    createdAt: o.createdAt.toString(),
  }));

  return (
    <div className="max-w-[1400px] mx-auto space-y-8">
      {/* Top Header Card */}
      <div className="bg-card p-6 md:p-8 rounded-[32px] shadow-sm border border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-gradient-to-l from-transparent to-blue-50/20 dark:to-blue-900/10">
        <div>
          <h1 className="text-3xl font-black text-foreground flex items-center gap-3">
            <Truck className="w-8 h-8 text-primary" />
            إدارة الطلبيات وبوالص الشحن
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-base md:text-lg">
            قم بتجهيز الشحنات، نسخ بوالص الشحن لشركات الشحن (بوسطة، مايلرز، J&T)، طباعة الاستيكرات، وتحديث الحالات.
          </p>
        </div>

        <ExportOrdersCSV orders={exportData} />
      </div>

      {dbError && (
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 rounded-2xl p-4 text-amber-900 dark:text-amber-200 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
          <p className="text-sm font-semibold">
            تعذر الاتصال بقاعدة البيانات مؤقتاً. إذا كانت قاعدة البيانات في وضع التوقف (Paused) في Supabase، يُرجى الضغط على Restore لتنشيطها.
          </p>
        </div>
      )}

      {/* Quick Status Stats Pill Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-bold">بانتظار تجهيز الشحن</p>
            <p className="text-2xl font-black text-foreground">{pendingCount} <span className="text-sm font-normal text-gray-400">طلب</span></p>
          </div>
        </div>

        <div className="bg-card border border-border p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-bold">مع شركة الشحن (جاري التوصيل)</p>
            <p className="text-2xl font-black text-foreground">{inTransitCount} <span className="text-sm font-normal text-gray-400">طرد</span></p>
          </div>
        </div>

        <div className="bg-card border border-border p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400 rounded-xl flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-bold">تم التسليم والتحصيل</p>
            <p className="text-2xl font-black text-foreground">{deliveredCount} <span className="text-sm font-normal text-gray-400">طلب ناجح</span></p>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-card rounded-[24px] shadow-sm border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm whitespace-nowrap">
            <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-border text-gray-700 dark:text-gray-300">
              <tr>
                <th className="px-6 py-5 font-bold">رقم الشحنة</th>
                <th className="px-6 py-5 font-bold">تاريخ الطلب</th>
                <th className="px-6 py-5 font-bold">بيانات العميل</th>
                <th className="px-6 py-5 font-bold">الهاتف</th>
                <th className="px-6 py-5 font-bold max-w-xs truncate">المحافظة والعنوان</th>
                <th className="px-6 py-5 font-bold">المطلوب تحصيله (COD)</th>
                <th className="px-6 py-5 font-bold">الحالة الحالية</th>
                <th className="px-6 py-5 font-bold text-center">إجراءات بوليصة الشحن</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.map((order) => {
                return (
                  <tr key={order.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors">
                    <td className="px-6 py-5 font-mono text-xs text-gray-500">
                      <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded font-bold">
                        #{order.id.slice(-6).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-5 font-medium text-foreground text-xs" dir="ltr">
                      {new Date(order.createdAt).toLocaleDateString("en-GB")} {new Date(order.createdAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                    </td>
                    <td className="px-6 py-5 font-bold text-primary">{order.customerName}</td>
                    <td className="px-6 py-5 font-mono font-medium" dir="ltr">
                      <a href={`tel:${order.customerPhone}`} className="hover:underline">
                        {order.customerPhone}
                      </a>
                    </td>
                    <td className="px-6 py-5 text-gray-600 dark:text-gray-400 max-w-xs relative group cursor-pointer" title={order.customerAddress}>
                      <div className="truncate">
                        <span className="font-bold text-foreground bg-primary/10 text-primary px-2 py-0.5 rounded-md ml-1">
                          {order.province?.name || "عام"}
                        </span>{" "}
                        {order.customerAddress}
                      </div>
                    </td>
                    <td className="px-6 py-5 font-black text-foreground">
                      <span className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-3 py-1.5 rounded-lg border border-blue-200 dark:border-blue-800/50 font-bold">
                        {order.totalAmount.toLocaleString()} ج.م
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      {order.status === "DELIVERED" ? (
                        <span className="bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 px-3 py-1 font-bold rounded-lg text-xs">
                          ✅ تم التوصيل والتحصيل
                        </span>
                      ) : order.status === "OUT_FOR_DELIVERY" ? (
                        <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 px-3 py-1 font-bold rounded-lg text-xs">
                          🚚 مع شركة الشحن
                        </span>
                      ) : order.status === "CANCELLED" ? (
                        <span className="bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400 px-3 py-1 font-bold rounded-lg text-xs">
                          ❌ ملغي / مرتجع
                        </span>
                      ) : (
                        <span className="bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 px-3 py-1 font-bold rounded-lg text-xs">
                          ⏳ قيد التجهيز بالمخزن
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      <OrderShippingActions
                        order={{
                          id: order.id,
                          customerName: order.customerName,
                          customerPhone: order.customerPhone,
                          customerAddress: order.customerAddress,
                          provinceName: order.province?.name || "محافظة عامة",
                          shippingFee: order.province?.shippingFee || 0,
                          totalAmount: order.totalAmount,
                          status: order.status,
                          createdAt: order.createdAt.toString(),
                        }}
                      />
                    </td>
                  </tr>
                );
              })}
              {orders.length === 0 && !dbError && (
                <tr>
                  <td colSpan={8} className="px-6 py-24 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full mb-4">
                      <span className="text-4xl">📭</span>
                    </div>
                    <h2 className="text-xl font-bold text-foreground mb-2">لا توجد طلبات بعد</h2>
                    <p className="text-gray-500">سيتم تجميع أوردات العملاء هنا فور قيامهم بالطلب لتجهيز بوالص الشحن بنقرة واحدة.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
