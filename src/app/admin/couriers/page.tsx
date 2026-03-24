import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
        <h1 className="text-2xl font-bold text-foreground">المناديب والتسوية المالية</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          إدارة المناديب وتصفية العهدة. الضغط على زر "تصفية العهدة" ينقل الكاش الموجود مع المندوب لخزينة الشركة ويصفر حسابه تلقائياً. المندوب سيحصل على الباسوورد والهاتف لتسجيل الدخول بأمان.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Courier Form */}
        <div className="bg-card rounded-2xl shadow-sm border border-border p-6 lg:col-span-1 h-fit">
          <h2 className="text-xl font-bold mb-5 text-foreground">إضافة مندوب جديد</h2>
          <form action={addCourier} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">الاسم ثلاثي</label>
              <input type="text" name="name" required placeholder="مثال: أحمد محمود" className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all shadow-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">رقم الهاتف (يمثل الايميل/اسم الدخول)</label>
              <input type="text" name="phone" required placeholder="01xxxxxxxx" className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-left shadow-sm" dir="ltr" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">الباسوورد (الرقم السري)</label>
              <input type="password" name="password" required placeholder="****" className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-left shadow-sm" dir="ltr" />
            </div>
            <button type="submit" className="w-full py-4 mt-2 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-opacity-90 shadow-md hover:-translate-y-0.5 transition-all">التسجيل بالمنظومة</button>
          </form>
        </div>

        {/* Couriers List */}
        <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden lg:col-span-2">
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-border">
                <tr>
                  <th className="px-6 py-5 text-sm font-bold text-gray-700 dark:text-gray-300">المندوب</th>
                  <th className="px-6 py-5 text-sm font-bold text-gray-700 dark:text-gray-300 text-left">الهاتف</th>
                  <th className="px-6 py-5 text-sm font-bold text-gray-700 dark:text-gray-300">العهدة (ج.م)</th>
                  <th className="px-6 py-5 text-sm font-bold text-gray-700 dark:text-gray-300 w-36">إجراء تسوية</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {couriers.map((courier) => (
                  <tr key={courier.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-5 font-medium text-foreground">{courier.name}</td>
                    <td className="px-6 py-5 text-gray-500 dark:text-gray-400 text-left font-mono" dir="ltr">{courier.phone}</td>
                    <td className="px-6 py-5 font-bold text-red-600 dark:text-red-400 text-lg">{courier.custodyAmount.toLocaleString()}</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-2">
                        <a 
                          href={`/delivery?courier=${encodeURIComponent(courier.name)}`}
                          target="_blank"
                          className="px-4 py-2 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-xl text-sm font-semibold transition-all shadow-sm whitespace-nowrap"
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
                        <form action={deleteCourier}>
                          <input type="hidden" name="id" value={courier.id} />
                          <button 
                          type="submit" 
                          className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-600 dark:hover:text-white rounded-xl text-sm font-semibold transition-all shadow-sm flex items-center justify-center whitespace-nowrap">
                            حذف المندوب
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
                {couriers.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">لا يوجد مناديب مضافين حالياً.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
