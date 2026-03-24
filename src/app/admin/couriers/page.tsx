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

            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
