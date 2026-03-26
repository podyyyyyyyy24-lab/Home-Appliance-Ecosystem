import prisma from "@/lib/prisma";
import { AssignCourier } from "./AssignCourier";


export const dynamic = 'force-dynamic';

export default async function OrdersPage() {
  const [orders, couriers] = await Promise.all([
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        province: true,
        courier: true
      }
    }),
    prisma.courier.findMany({
      orderBy: { name: 'asc' }
    })
  ]);

  return (
    <div className="max-w-[1400px] mx-auto space-y-8">
      <div className="bg-card p-6 md:p-8 rounded-[32px] shadow-sm border border-border flex justify-between items-center bg-gradient-to-l from-transparent to-blue-50/20 dark:to-blue-900/10">
        <div>
          <h1 className="text-3xl font-black text-foreground">الطلبيات النشطة</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">
            قم بإدارة وتوجيه كافة الشحنات إلى المناديب، متابعة حالة الطلب واستعراض كافة بيانات العملاء هنا. 
          </p>
        </div>
      </div>

      <div className="bg-card rounded-[24px] shadow-sm border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm whitespace-nowrap">
             <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-border text-gray-700 dark:text-gray-300">
                <tr>
                   <th className="px-6 py-5 font-bold">رقم الأورد (ID)</th>
                   <th className="px-6 py-5 font-bold">تاريخ الطلب</th>
                   <th className="px-6 py-5 font-bold">بيانات العميل</th>
                   <th className="px-6 py-5 font-bold">رقم الهاتف</th>
                   <th className="px-6 py-5 font-bold max-w-xs truncate">العنوان بالتفصيل واللوكيشن</th>
                   <th className="px-6 py-5 font-bold">الإجمالي للتحصيل</th>
                   <th className="px-6 py-5 font-bold">الحالة</th>
                   <th className="px-6 py-5 font-bold">تعيين المندوب</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-border">
                {orders.map((order) => {
                  const isDelivered = order.status === "DELIVERED";
                  
                  return (
                    <tr key={order.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors">
                      <td className="px-6 py-6 font-mono text-xs text-gray-500">#{order.id.slice(-6).toUpperCase()}</td>
                      <td className="px-6 py-6 font-medium text-foreground" dir="ltr">{new Date(order.createdAt).toLocaleDateString('en-GB')} {new Date(order.createdAt).toLocaleTimeString('en-US', {hour:'numeric', minute:'2-digit'})}</td>
                      <td className="px-6 py-6 font-bold text-primary">{order.customerName}</td>
                      <td className="px-6 py-6 font-mono font-medium">{order.customerPhone}</td>
                      <td className="px-6 py-6 text-gray-600 dark:text-gray-400 max-w-xs relative group cursor-pointer" title={order.customerAddress}>
                         <div className="truncate">
                           <span className="font-bold text-foreground">[{order.province.name}]</span> {order.customerAddress}
                         </div>
                      </td>
                      <td className="px-6 py-6 font-black text-foreground">
                        <span className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-3 py-1.5 rounded-lg border border-blue-200 dark:border-blue-800/50">
                           {order.totalAmount.toLocaleString()} ج.م
                        </span>
                      </td>
                      <td className="px-6 py-6">
                         {isDelivered ? (
                           <span className="bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 px-3 py-1 font-bold rounded-lg text-xs">تم التوصيل</span>
                         ) : order.courierId ? (
                           <span className="bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400 px-3 py-1 font-bold rounded-lg text-xs">جاري التوصيل</span>
                         ) : (
                           <span className="bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 px-3 py-1 font-bold rounded-lg text-xs">قيد الانتظار</span>
                         )}
                      </td>
                      <td className="px-6 py-6">
                        {isDelivered ? (
                          <span className="px-4 py-2 font-bold text-gray-500 flex items-center gap-2 text-sm bg-gray-50 dark:bg-gray-800 border-border rounded-xl">
                            المسئول: {order.courier?.name}
                          </span>
                        ) : (
                          <AssignCourier 
                            orderId={order.id} 
                            currentCourierId={order.courierId} 
                            couriers={couriers} 
                          />
                        )}
                      </td>
                    </tr>
                )})}
                {orders.length === 0 && (
                   <tr>
                     <td colSpan={8} className="px-6 py-24 text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full mb-4">
                           <span className="text-4xl">📭</span>
                        </div>
                        <h2 className="text-xl font-bold text-foreground mb-2">لا توجد طلبات بعد</h2>
                        <p className="text-gray-500">سيتم تجميع أوردات العملاء هنا فور قيامهم بالطلب.</p>
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
