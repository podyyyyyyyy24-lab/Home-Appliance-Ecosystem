import prisma from "@/lib/prisma";
import Link from "next/link";
import { PhoneCall, MapPin, CheckCircle, MessageCircle, Map as MapIcon, Send } from "lucide-react";
import { revalidatePath } from "next/cache";

async function markDevlivered(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  await prisma.order.update({
    where: { id },
    data: { status: "DELIVERED" }
  });
  revalidatePath("/delivery");
}

export default async function DeliveryApp({ searchParams }: { searchParams: { courier?: string } }) {
  const orders = await prisma.order.findMany({
    where: { status: "PENDING" },
    include: { province: true },
    orderBy: { createdAt: "desc" }
  });

  const rawCourier = await searchParams;
  const driverName = rawCourier.courier ? decodeURIComponent(rawCourier.courier as string) : "";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background pb-20">
      {/* Driver Native Header */}
      <header className="bg-primary text-white p-6 shadow-md rounded-b-[32px] mb-8 sticky top-0 z-10 w-full">
        <h1 className="text-2xl font-black mb-1">أهلاً بك كابتن{driverName ? ` ${driverName}` : ''}! 🚚</h1>
        <p className="text-primary-foreground/80 font-medium">المهام الموكلة لك اليوم ({orders.length} طلبية)</p>
      </header>

      <main className="max-w-xl mx-auto px-5 space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white dark:bg-card rounded-[28px] border-2 border-primary/20 p-6 shadow-sm flex flex-col gap-5">
            <div className="flex justify-between items-start border-b border-border pb-4">
               <div>
                  <h2 className="text-xl font-bold text-foreground">{order.customerName}</h2>
                  <p className="text-sm font-semibold text-gray-500 mt-1 flex items-center gap-1"><MapIcon className="w-4 h-4"/> {order.province?.name}</p>
               </div>
               <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-xl text-lg font-black text-center border border-green-200 dark:border-green-800/40">
                  {order.totalAmount.toLocaleString()} <span className="text-xs">ج.م</span>
               </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl">
               <div className="flex items-start gap-3">
                 <MapPin className="text-gray-400 w-5 h-5 shrink-0 mt-0.5" />
                 <p className="text-foreground text-sm leading-relaxed">{order.customerAddress}</p>
               </div>
            </div>

            {/* Smart Actions per Blueprint */}
            <div className="grid grid-cols-2 gap-3 mt-2">
               <a href={`tel:${order.customerPhone}`} className="flex justify-center items-center gap-2 bg-blue-100/50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-500 rounded-xl py-3 font-semibold text-sm hover:bg-blue-100 transition-colors border border-blue-200 dark:border-blue-900/40">
                 <PhoneCall className="w-4 h-4" /> اتصال بالعميل
               </a>
               
               {/* INTENT 1: Pre-Delivery WhatsApp */}
               <a 
                 href={`https://wa.me/2${order.customerPhone}?text=${encodeURIComponent(`أهلاً بك أستاذ ${order.customerName}، أنا المندوب وطلبك معايا دلوقتي في الطريق للعنوان. الإجمالي المطلوب تحصيله: ${order.totalAmount} جنيه.`)}`} 
                 target="_blank" rel="noreferrer"
                 className="flex justify-center items-center gap-2 bg-green-500 text-white rounded-xl py-3 font-semibold text-sm shadow-sm hover:bg-green-600 transition-colors"
               >
                 <MessageCircle className="w-4 h-4 text-white" /> واتس (قبل الوصول)
               </a>
            </div>

            <div className="border-t border-border pt-4 grid grid-cols-1 gap-3">
                <form action={markDevlivered}>
                  <input type="hidden" name="id" value={order.id} />
                  <button type="submit" className="w-full flex justify-center items-center gap-2 bg-black dark:bg-white text-white dark:text-black py-4 rounded-xl font-bold hover:scale-[1.02] shadow-md transition-transform">
                    <CheckCircle className="w-5 h-5" /> تأكيد التسليم للعميل بنجاح
                  </button>
                </form>
                
                {/* INTENT 2: Post-Delivery WhatsApp */}
                <a 
                 href={`https://wa.me/2${order.customerPhone}?text=${encodeURIComponent(`تم تسليم طلبك بنجاح. شكراً لثقتك بنا، يسعدنا دائماً التعامل معك 💚.`)}`} 
                 target="_blank" rel="noreferrer"
                 className="flex justify-center items-center gap-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl py-3 font-semibold text-sm transition-colors border border-border"
               >
                 <Send className="w-4 h-4" /> إرسال رسالة وفاء (الشكر)
               </a>
            </div>
          </div>
        ))}

        {orders.length === 0 && (
          <div className="text-center p-12">
             <div className="w-24 h-24 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">🎉</div>
             <h2 className="text-2xl font-bold text-gray-500">تم إنهاء المهام!</h2>
             <p className="text-gray-400">لا يوجد شحنات قيد التوصيل الآن.</p>
          </div>
        )}
      </main>
    </div>
  );
}
