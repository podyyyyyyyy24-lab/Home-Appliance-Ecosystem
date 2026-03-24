import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import DeleteButton from "./DeleteButton"; // Imported newly decoupled interactive component

function sanitizeInput(str: string) {
  if (!str) return "";
  const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  let sanitized = str.replace(/[٠-٩]/g, (d) => arabicNumbers.indexOf(d).toString());
  return sanitized.trim();
}

async function addCourier(formData: FormData) {
  "use server";
  const name = formData.get("name") as string;
  const phone = sanitizeInput(formData.get("phone") as string);
  const password = sanitizeInput(formData.get("password") as string);

  if (name && phone && password) {
    try {
      await prisma.courier.create({
        data: { name, phone, password },
      });
      revalidatePath("/admin/couriers");
    } catch(e) {
      console.log("Error creating courier. Phone might exist.");
    }
  }
}

async function clearCustody(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;

  if (id) {
    await prisma.courier.update({
      where: { id },
      data: { custodyAmount: 0 },
    });
    revalidatePath("/admin/couriers");
  }
}

async function deleteCourier(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;

  if (id) {
    // Unassign any currently grabbed orders belonging to this courier back to the open pool
    // and then delete the courier securely.
    await prisma.$transaction([
      prisma.order.updateMany({
        where: { courierId: id, status: { not: "DELIVERED" } },
        data: { courierId: null, status: "PENDING" }
      }),
      prisma.courier.delete({
        where: { id },
      })
    ]);
    revalidatePath("/admin/couriers");
  }
}

export default async function CouriersPage() {
  const couriers = await prisma.courier.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
        <h1 className="text-2xl font-bold text-foreground">المناديب والتسوية المالية</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          إدارة المناديب وتصفية العهدة. المندوب يستلم رقمه السري الموضح أدناه مع رقم هاتفه ليدخل التطبيق بأمان.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Add Courier Form */}
        <div className="bg-card rounded-2xl shadow-sm border border-border p-6 xl:col-span-1 h-fit">
          <h2 className="text-xl font-bold mb-5 text-foreground">إضافة مندوب جديد</h2>
          <form action={addCourier} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">الاسم ثلاثي</label>
              <input type="text" name="name" required placeholder="مثال: أحمد محمود" className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all shadow-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">رقم الهاتف (الخاص بالدخول)</label>
              <input type="text" name="phone" required placeholder="01xxxxxxxx" className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-left shadow-sm font-bold" dir="ltr" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">الباسوورد (الرقم السري)</label>
              <input type="text" name="password" required placeholder="****" className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-left shadow-sm font-bold" dir="ltr" />
            </div>
            <button type="submit" className="w-full py-4 mt-2 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-opacity-90 shadow-md hover:-translate-y-0.5 transition-all text-lg">التسجيل بالمنظومة</button>
          </form>
        </div>
        {/* Couriers Active Table */}
        <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden xl:col-span-2">
           <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-900 border-b border-border">
                    <th className="px-6 py-4 text-sm font-bold text-gray-700 dark:text-gray-300">المندوب</th>
                    <th className="px-6 py-4 text-sm font-bold text-gray-700 dark:text-gray-300">المُعرف (الهاتف)</th>
                    <th className="px-6 py-4 text-sm font-bold text-gray-700 dark:text-gray-300">الباسوورد السري</th>
                    <th className="px-6 py-4 text-sm font-bold text-gray-700 dark:text-gray-300">الكاش (العهدة)</th>
                    <th className="px-6 py-4 text-sm font-bold text-gray-700 dark:text-gray-300"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {couriers.map((courier) => (
                    <tr key={courier.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/10 transition-colors">
                      <td className="px-6 py-5 font-bold text-foreground">
                        {courier.name}
                      </td>
                      <td className="px-6 py-5 text-gray-500 font-medium" dir="ltr">
                        {courier.phone}
                      </td>
                      <td className="px-6 py-5 text-gray-500" dir="ltr">
                        <span className="bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 px-3 py-1 rounded-lg font-mono font-black border border-blue-200 dark:border-blue-800">
                           {courier.password}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                       <span className={`font-black ${courier.custodyAmount > 0 ? 'text-red-500' : 'text-green-500'}`}>
                         {courier.custodyAmount.toLocaleString()} <span className="text-xs">ج.م</span>
                       </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-end gap-2">
                          <a 
                            href={`/delivery`}
                            target="_blank"
                            className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-xl text-sm font-bold transition-all shadow-sm whitespace-nowrap"
                          >
                            تطبيق المندوب
                          </a>
                          <form action={clearCustody}>
                            <input type="hidden" name="id" value={courier.id} />
                            <button 
                            type="submit" 
                            disabled={courier.custodyAmount === 0}
                            className="px-4 py-2 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200 hover:bg-green-100 dark:hover:bg-green-600/20 hover:text-green-700 dark:hover:text-green-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-sm font-semibold transition-all shadow-sm whitespace-nowrap">
                              تصفية العهدة
                            </button>
                          </form>
                          <DeleteButton id={courier.id} deleteActionFn={deleteCourier} />
                        </div>
                      </td>
                    </tr>
                  ))}
                  {couriers.length === 0 && (
                     <tr><td colSpan={5} className="text-center py-10 text-gray-400">لا يوجد مناديب مسجلين بعد.</td></tr>
                  )}
                </tbody>
              </table>
           </div>
        </div>
      </div>
    </div>
  );
}
