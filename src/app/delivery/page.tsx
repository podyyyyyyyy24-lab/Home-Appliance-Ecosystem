import prisma from "@/lib/prisma";
import Link from "next/link";
import { PhoneCall, MapPin, CheckCircle, MessageCircle, Map as MapIcon, Send, LogOut, Package as PackageIcon, Truck } from "lucide-react";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// --- SERVER ACTIONS ---

async function loginCourier(formData: FormData) {
  "use server";
  const phone = formData.get("phone") as string;
  const password = formData.get("password") as string;
  const cookieStore = await cookies();

  const courier = await prisma.courier.findFirst({ where: { phone } });
  if (courier && courier.password === password) {
    cookieStore.set("courier_id", courier.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30 // 30 days session
    });
    redirect("/delivery");
  } else {
    redirect("/delivery?error=true");
  }
}

async function logoutCourier() {
  "use server";
  const cookieStore = await cookies();
  cookieStore.delete("courier_id");
  redirect("/delivery");
}

async function acceptOrder(formData: FormData) {
  "use server";
  const orderId = formData.get("id") as string;
  const cookieStore = await cookies();
  const courierId = cookieStore.get("courier_id")?.value;
  if (!courierId) return;

  await prisma.order.update({
    where: { id: orderId },
    data: { status: "OUT_FOR_DELIVERY", courierId }
  });
  revalidatePath("/delivery");
}

async function markDevlivered(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  const cookieStore = await cookies();
  const courierId = cookieStore.get("courier_id")?.value;
  const amount = parseFloat(formData.get("amount") as string);
  if (!courierId) return;

  // Mark order complete and simultaneously debit courier custody (Transactional)
  await prisma.$transaction([
    prisma.order.update({
      where: { id },
      data: { status: "DELIVERED" }
    }),
    prisma.courier.update({
      where: { id: courierId },
      data: { custodyAmount: { increment: amount } }
    })
  ]);
  
  revalidatePath("/delivery");
}

export default async function DeliveryApp({ searchParams }: { searchParams: { error?: string } }) {
  const cookieStore = await cookies();
  const courierId = cookieStore.get("courier_id")?.value;

  // 1. LOGIN SCREEN
  if (!courierId) {
    const rawSP = await searchParams;
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-background flex items-center justify-center p-4">
        <div className="bg-card w-full max-w-md p-8 rounded-[32px] shadow-sm border border-border text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Truck className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-2xl font-black text-foreground mb-2">تسجيل دخول المندوب</h1>
          <p className="text-gray-500 mb-8 font-medium">أدخل رقم الهاتف الخاص بك والرقم السري الممنوح لك من الإدارة.</p>
          
          <form action={loginCourier} className="space-y-4">
            <input type="text" name="phone" required placeholder="رقم الهاتف" className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-center font-bold" dir="ltr" />
            <input type="password" name="password" required placeholder="الرقم السري" className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-center tracking-[0.5em] font-bold" dir="ltr" />
            {rawSP.error && <p className="text-white bg-red-500 p-2 rounded-xl text-sm font-bold animate-pulse">بيانات الدخول غير صحيحة، حاول مجدداً.</p>}
            <button type="submit" className="w-full py-4 bg-primary text-primary-foreground font-black rounded-2xl shadow-lg hover:-translate-y-1 transition-transform mt-4 text-lg">دخول</button>
          </form>
        </div>
      </div>
    );
  }

  // 2. AUTHENTICATED COURIER DASHBOARD
  const courier = await prisma.courier.findUnique({ where: { id: courierId } });
  if (!courier) {
    const cookieStoreToDel = await cookies();
    cookieStoreToDel.delete("courier_id");
    redirect("/delivery");
  }

  // Active pool of all fresh un-assigned pending orders inside ecosystem
  const poolOrders = await prisma.order.findMany({
    where: { status: "PENDING" },
    include: { province: true },
    orderBy: { createdAt: "asc" }
  });

  // Current active tasks grabbed locally by this specific courier
  const myOrders = await prisma.order.findMany({
    where: { courierId, status: "OUT_FOR_DELIVERY" },
    include: { province: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background pb-24">
      {/* Dynamic Header */}
      <header className="bg-primary text-white p-6 shadow-md rounded-b-[32px] mb-8 sticky top-0 z-20 w-full flex justify-between items-start">
        <div>
           <h1 className="text-2xl font-black mb-1">كابتن {courier.name.split(' ')[0]} 🚚</h1>
           <p className="text-primary-foreground/80 font-medium">النقود المحصلة الآن: <span className="font-bold underline">{courier.custodyAmount.toLocaleString()} ج.م</span></p>
        </div>
        <form action={logoutCourier}>
          <button type="submit" className="bg-black/20 hover:bg-black/30 px-3 py-2 rounded-xl text-sm font-bold transition-colors">خروج <LogOut className="w-4 h-4 inline-block mb-1 ml-1" /></button>
        </form>
      </header>

      <main className="max-w-xl mx-auto px-5 space-y-10">
        
        {/* Active Deliveries View */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-foreground flex items-center gap-2">شحناتي الجارية ({myOrders.length})</h2>
          </div>
          <div className="space-y-6">
            {myOrders.map((order) => (
              <div key={order.id} className="bg-white dark:bg-card rounded-[28px] border-2 border-primary/40 p-6 flex flex-col gap-5 relative overflow-hidden shadow-xl shadow-primary/5">
                <div className="absolute top-0 right-0 w-1.5 h-full bg-primary" />
                <div className="flex justify-between items-start border-b border-border pb-4">
                   <div className="pr-2">
                      <h2 className="text-xl font-bold text-foreground mb-1">{order.customerName}</h2>
                      <p className="text-sm font-semibold text-gray-500 flex items-center gap-1"><MapIcon className="w-4 h-4"/> {order.province?.name}</p>
                   </div>
                   <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-2 rounded-xl text-lg font-black text-center shadow-sm border border-green-200 dark:border-green-800/40 shrink-0">
                      {order.totalAmount.toLocaleString()} <span className="text-xs">ج.م</span>
                   </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-border/50">
                   <div className="flex items-start gap-3">
                     <MapPin className="text-primary w-5 h-5 shrink-0 mt-0.5" />
                     <p className="text-foreground text-sm font-medium leading-relaxed">{order.customerAddress}</p>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-1">
                   <a href={`tel:${order.customerPhone}`} className="flex justify-center items-center gap-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-xl py-3.5 font-bold hover:bg-blue-100 transition-colors border border-blue-100 dark:border-blue-900/40">
                     <PhoneCall className="w-4 h-4" /> اتصال 
                   </a>
                   
                   <a 
                     href={`https://wa.me/2${order.customerPhone}?text=${encodeURIComponent(`أهلاً بك أستاذ ${order.customerName}، أنا المندوب وطلبك معايا دلوقتي في الطريق للعنوان. الإجمالي المطلوب تحصيله: ${order.totalAmount} جنيه.`)}`} 
                     target="_blank" rel="noreferrer"
                     className="flex justify-center items-center gap-2 bg-green-500 text-white rounded-xl py-3.5 font-bold shadow-sm hover:bg-green-600 transition-colors"
                   >
                     <MessageCircle className="w-4 h-4" /> واتساب
                   </a>
                </div>

                <div className="border-t border-border pt-4 mt-2 grid grid-cols-1">
                  <form action={markDevlivered}>
                    <input type="hidden" name="id" value={order.id} />
                    <input type="hidden" name="amount" value={order.totalAmount} />
                    <button type="submit" className="w-full flex justify-center items-center gap-2 bg-foreground text-background py-4.5 rounded-xl font-bold hover:scale-[1.02] shadow-md transition-transform text-lg">
                      <CheckCircle className="w-5 h-5" /> تسليم العميل والتحصيل بنجاح
                    </button>
                  </form>
                </div>
              </div>
            ))}
            {myOrders.length === 0 && (
              <div className="text-center p-8 bg-primary/5 dark:bg-primary/5 border border-primary/20 rounded-[28px] shadow-sm">
                <p className="text-primary font-bold text-lg mb-2">لا توجد طلبات معك الآن</p>
                <p className="text-gray-500 text-sm">استلم شحنة من الطلبات المتاحة بالأسفل لتبدأ رحلتك!</p>
              </div>
            )}
          </div>
        </section>

        {/* Open Job Pool Section */}
        <section>
          <h2 className="text-lg font-black text-gray-500 mb-4 pt-4 border-t border-border flex items-center gap-2"><PackageIcon className="w-5 h-5" /> الطلبات المتاحة للاستلام ({poolOrders.length})</h2>
          <div className="space-y-4">
            {poolOrders.map((order) => (
              <div key={order.id} className="bg-white dark:bg-card rounded-2xl border border-border p-5 shadow-sm hover:border-primary/50 transition-colors">
                <div className="flex justify-between items-center mb-3">
                   <h3 className="font-bold text-foreground text-lg">{order.customerName}</h3>
                   <span className="text-foreground font-black bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-xl text-sm">{order.totalAmount} ج.م</span>
                </div>
                <div className="flex gap-2 items-center text-sm text-gray-500 mb-5 pb-4 border-b border-border">
                  <MapIcon className="w-4 h-4 shrink-0"/> <span className="truncate">{order.province?.name} — {order.customerAddress}</span>
                </div>
                <form action={acceptOrder}>
                  <input type="hidden" name="id" value={order.id} />
                  <button type="submit" className="w-full py-4 bg-gray-100 text-gray-700 hover:bg-primary hover:text-white dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-primary dark:hover:text-black rounded-xl font-bold transition-all text-sm flex items-center justify-center gap-2 outline-none">
                    استلام وتكليف الشحنة لاسمك <Truck className="w-4 h-4" />
                  </button>
                </form>
              </div>
            ))}
            {poolOrders.length === 0 && <p className="text-center text-sm text-gray-400 py-6">لا توجد طلبات جديدة متاحة حالياً.</p>}
          </div>
        </section>

      </main>
    </div>
  );
}
