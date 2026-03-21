import { LayoutDashboard, Wallet, TrendingUp, HandCoins, PackageCheck, AlertCircle, RefreshCcw } from "lucide-react";
import prisma from "@/lib/prisma";

export default async function AdminDashboard() {
  // Live Data Aggregation from Supabase PostgeSQL DB
  
  // 1. Realized Revenue (Delivered Only)
  const deliveredOrders = await prisma.order.aggregate({
    where: { status: 'DELIVERED' },
    _sum: { totalAmount: true },
    _count: { id: true }
  });
  
  // 2. Pending Orders Value (In Transit)
  const pendingOrders = await prisma.order.aggregate({
    where: { status: 'PENDING' },
    _sum: { totalAmount: true },
    _count: { id: true }
  });
  
  // 3. Current Floating Cash with Couriers
  const couriersCustody = await prisma.courier.aggregate({
    _sum: { custodyAmount: true }
  });

  const totalSales = deliveredOrders._sum.totalAmount || 0;
  const pendingSales = pendingOrders._sum.totalAmount || 0;
  const custodyCash = couriersCustody._sum.custodyAmount || 0;
  const safeCash = totalSales - custodyCash; // What physically arrived correctly into the local safe

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="bg-card border border-border rounded-[32px] p-8 flex items-center gap-6 shadow-sm relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] rounded-full -z-10" />
        
        <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center shrink-0 border border-primary/20">
          <LayoutDashboard className="text-primary w-10 h-10" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-foreground mb-3 flex items-center gap-2">نظام الإدارة المالي <RefreshCcw className="w-5 h-5 text-gray-400" /></h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed max-w-3xl">شاشتك المركزية لمتابعة التدفقات النقدية (Cash flow)، تتبع الأموال المعلقة، ومراقبة حركة سيولة المناديب لحظة بلحظة وبدقة متناهية.</p>
        </div>
      </div>

      {/* Primary Financial Stats Panel */}
      <h2 className="text-2xl font-bold px-2 text-foreground">الوضع المالي المكتمل 💰</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        <div className="bg-white dark:bg-card border border-green-200 dark:border-green-900/40 rounded-[28px] p-8 shadow-sm hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-gray-500 font-bold text-lg">إجمالي السيولة الصافية</h3>
            <div className="w-12 h-12 bg-green-50 dark:bg-green-900/30 rounded-2xl flex items-center justify-center">
              <Wallet className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <p className="text-4xl font-black text-foreground">{safeCash.toLocaleString()}</p>
          <p className="text-sm text-green-600 font-medium mt-3 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-lg inline-block">أموال مستلمة وتم تصفيتها بالخزينة</p>
        </div>

        <div className="bg-white dark:bg-card border border-blue-200 dark:border-blue-900/40 rounded-[28px] p-8 shadow-sm hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-gray-500 font-bold text-lg">المبيعات المُركّبة</h3>
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <p className="text-4xl font-black text-foreground">{totalSales.toLocaleString()}</p>
          <p className="text-sm font-medium mt-3 text-gray-500 flex items-center gap-2">نتاج إتمام <span className="text-foreground font-black bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-md">{deliveredOrders._count.id}</span> عملية بيع ناجحة</p>
        </div>

        <div className="bg-white dark:bg-card border border-red-200 dark:border-red-900/40 rounded-[28px] p-8 shadow-sm hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-gray-500 font-bold text-lg">أرصدة عهدة المناديب</h3>
            <div className="w-12 h-12 bg-red-50 dark:bg-red-900/30 rounded-2xl flex items-center justify-center">
              <HandCoins className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <p className="text-4xl font-black text-foreground">{custodyCash.toLocaleString()}</p>
          <p className="text-sm text-red-600 font-medium mt-3 bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-lg inline-block">كاش تم تحصيله ويجب سحبه للحزينة</p>
        </div>

      </div>

      <div className="border-t border-border/80 my-8"></div>

      <h2 className="text-2xl font-bold px-2 text-foreground flex items-center gap-3"><AlertCircle className="text-primary w-6 h-6" /> المعلقات والجاري تنفيذه</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-[28px] p-8 shadow-sm flex items-center justify-between">
          <div>
            <h3 className="text-gray-600 dark:text-gray-400 font-bold text-lg mb-2">إجمالي السيولة المُعلقة (قيد التوصيل)</h3>
            <p className="text-4xl font-black text-primary">{pendingSales.toLocaleString()} <span className="text-lg font-bold text-gray-400">ج.م</span></p>
          </div>
          <PackageCheck className="w-16 h-16 text-primary/30" />
        </div>

        <div className="bg-card border border-border rounded-[28px] p-8 shadow-sm flex items-center justify-between">
          <div>
            <h3 className="text-gray-600 dark:text-gray-400 font-bold text-lg mb-2">عدد الطلبات الجارية في السوق الآن</h3>
            <p className="text-4xl font-black text-foreground">{pendingOrders._count.id} <span className="text-lg font-bold text-gray-400">شحنة</span></p>
          </div>
          <Truck className="w-16 h-16 text-gray-200 dark:text-gray-700" />
        </div>

      </div>

    </div>
  );
}
