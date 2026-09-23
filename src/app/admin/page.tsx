import { LayoutDashboard, Wallet, TrendingUp, PackageCheck, AlertCircle, RefreshCcw, Truck, Clock } from "lucide-react";
import prisma from "@/lib/prisma";

export default async function AdminDashboard() {
  // Live Data Aggregation from Supabase PostgreSQL DB
  let totalSales = 0;
  let inTransitSales = 0;
  let pendingSales = 0;
  let inventoryValue = 0;
  let totalStockPieces = 0;
  let deliveredCount = 0;
  let inTransitCount = 0;
  let pendingCount = 0;
  let dbConnectionError = false;

  try {
    // 1. Realized Revenue (Delivered & Collected from Shipping Company)
    const deliveredOrders = await prisma.order.aggregate({
      where: { status: 'DELIVERED' },
      _sum: { totalAmount: true },
      _count: { id: true }
    });
    
    // 2. Orders with Shipping Company (Out for Delivery / In Transit)
    const inTransitOrders = await prisma.order.aggregate({
      where: { status: 'OUT_FOR_DELIVERY' },
      _sum: { totalAmount: true },
      _count: { id: true }
    });

    // 3. New Orders Waiting for Pickup (Pending)
    const pendingOrders = await prisma.order.aggregate({
      where: { status: 'PENDING' },
      _sum: { totalAmount: true },
      _count: { id: true }
    });

    // 4. Inventory Value
    const products = await prisma.product.findMany({
      include: { variants: true }
    });
    
    products.forEach(p => {
      p.variants.forEach(v => {
        inventoryValue += (p.basePrice * v.stock);
        totalStockPieces += v.stock;
      });
    });

    totalSales = deliveredOrders._sum.totalAmount || 0;
    inTransitSales = inTransitOrders._sum.totalAmount || 0;
    pendingSales = pendingOrders._sum.totalAmount || 0;
    deliveredCount = deliveredOrders._count.id || 0;
    inTransitCount = inTransitOrders._count.id || 0;
    pendingCount = pendingOrders._count.id || 0;
  } catch {
    // Database is paused or offline
    dbConnectionError = true;
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {dbConnectionError && (
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 rounded-2xl p-5 flex items-start gap-4 text-amber-900 dark:text-amber-200">
          <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm leading-relaxed">
            <p className="font-bold text-base mb-1">قاعدة بيانات Supabase في وضع التوقف المؤقت (Paused Project)</p>
            <p className="opacity-90">
              لتحديث الأرقام والمنتجات الحية، يُرجى الدخول إلى حسابك في{" "}
              <a href="https://supabase.com/dashboard/project/xldmytcxmbnueidvupsh" target="_blank" rel="noreferrer" className="underline font-bold hover:text-amber-700">
                لوحة تحكم Supabase
              </a>{" "}
              والضغط على <strong>Restore Project</strong> لتنشيطها فوراً.
            </p>
          </div>
        </div>
      )}

      <div className="bg-card border border-border rounded-[32px] p-8 flex items-center gap-6 shadow-sm relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] rounded-full -z-10" />
        
        <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center shrink-0 border border-primary/20">
          <LayoutDashboard className="text-primary w-10 h-10" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-foreground mb-3 flex items-center gap-2">نظام الإدارة والشحن المركزي <RefreshCcw className="w-5 h-5 text-gray-400" /></h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed max-w-3xl">شاشتك المركزية لمتابعة المبيعات المحصلة، تتبع الطرود مع شركات الشحن، وتصدير بوالص الشحن بنقرة واحدة.</p>
        </div>
      </div>

      {/* Primary Financial Stats Panel */}
      <h2 className="text-2xl font-bold px-2 text-foreground">الوضع المالي وحركة الشحن 📊</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        <div className="bg-white dark:bg-card border border-green-200 dark:border-green-900/40 rounded-[28px] p-8 shadow-sm hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-gray-500 font-bold text-lg">المبيعات المحصلة بالخزينة</h3>
            <div className="w-12 h-12 bg-green-50 dark:bg-green-900/30 rounded-2xl flex items-center justify-center">
              <Wallet className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <p className="text-4xl font-black text-foreground">{totalSales.toLocaleString()} <span className="text-xl font-bold text-gray-400">ج.م</span></p>
          <p className="text-sm text-green-600 font-medium mt-3 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-lg inline-block">
            نتاج تسليم وتحصيل <strong>{deliveredCount}</strong> طلب بنجاح
          </p>
        </div>

        <div className="bg-white dark:bg-card border border-blue-200 dark:border-blue-900/40 rounded-[28px] p-8 shadow-sm hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-gray-500 font-bold text-lg">مبالغ جارية مع شركة الشحن</h3>
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center">
              <Truck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <p className="text-4xl font-black text-foreground">{inTransitSales.toLocaleString()} <span className="text-xl font-bold text-gray-400">ج.م</span></p>
          <p className="text-sm font-medium mt-3 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-lg inline-block">
            قيد التوصيل والتحصيل (<strong>{inTransitCount}</strong> طرد)
          </p>
        </div>

        <div className="bg-white dark:bg-card border border-amber-200 dark:border-amber-900/40 rounded-[28px] p-8 shadow-sm hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-gray-500 font-bold text-lg">طلبيات بانتظار الشحن</h3>
            <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <p className="text-4xl font-black text-foreground">{pendingSales.toLocaleString()} <span className="text-xl font-bold text-gray-400">ج.م</span></p>
          <p className="text-sm text-amber-600 font-medium mt-3 bg-amber-50 dark:bg-amber-900/20 px-3 py-1.5 rounded-lg inline-block">
            جاهزة لتسليمها لشركة الشحن (<strong>{pendingCount}</strong> طلب)
          </p>
        </div>

      </div>

      <div className="border-t border-border/80 my-8"></div>

      <h2 className="text-2xl font-bold px-2 text-foreground flex items-center gap-3"><PackageCheck className="text-purple-500 w-6 h-6" /> تقييم المخزن الحالي 📦</h2>
      <div className="bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-800/30 rounded-[32px] p-8 shadow-sm flex items-center justify-between w-full">
          <div>
            <h3 className="text-gray-600 dark:text-gray-400 font-bold text-lg mb-2">إجمالي قيمة بضائع الهواتف والإكسسوارات بالمخزن</h3>
            <div className="flex items-end gap-3 mt-4">
              <p className="text-5xl font-black text-purple-700 dark:text-purple-400">{inventoryValue.toLocaleString()} <span className="text-xl font-bold text-purple-400 dark:text-purple-600">ج.م</span></p>
            </div>
            <p className="text-sm text-purple-600 dark:text-purple-300 font-medium mt-4 bg-purple-100 dark:bg-purple-900/30 px-3 py-1.5 rounded-lg inline-block">
              إجمالي القطع المتوفرة للبيع فوراً: <strong className="font-black text-lg">{totalStockPieces}</strong> قطعة
            </p>
          </div>
          <div className="w-24 h-24 bg-purple-200/50 dark:bg-purple-800/40 rounded-full flex items-center justify-center shrink-0">
            <PackageCheck className="w-12 h-12 text-purple-600 dark:text-purple-400" />
          </div>
      </div>

    </div>
  );
}
