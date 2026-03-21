import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Server action to update shipping fee directly from the form
async function updateFee(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  const shippingFee = parseFloat(formData.get("shippingFee") as string);

  if (id && !isNaN(shippingFee)) {
    await prisma.province.update({
      where: { id },
      data: { shippingFee },
    });
    revalidatePath("/admin/provinces");
  }
}

// Server action to add a new province
async function addProvince(formData: FormData) {
  "use server";
  const name = formData.get("name") as string;
  const shippingFee = parseFloat(formData.get("shippingFee") as string);

  if (name && !isNaN(shippingFee)) {
    await prisma.province.create({
      data: { name, shippingFee },
    });
    revalidatePath("/admin/provinces");
  }
}

export default async function ProvincesPage() {
  const provinces = await prisma.province.findMany({
    orderBy: { name: 'asc' }
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
        <h1 className="text-2xl font-bold text-foreground">شحن المحافظات</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">قم بتعديل أو إضافة تكلفة الشحن لكل منطقة. التحديث هنا سينعكس فوراً في صفحة الدفع للعميل ويتم جمعه مع سعر المنتج.</p>
      </div>

      {/* Add New Province Form */}
      <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
        <h2 className="text-xl font-bold mb-4 text-foreground">إضافة محافظة جديدة</h2>
        <form action={addProvince} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input type="text" name="name" required placeholder="اسم المحافظة (مثال: القاهرة)" className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all shadow-sm" />
          </div>
          <div>
            <input type="number" name="shippingFee" required min="0" placeholder="تكلفة الشحن (ج.م)" className="w-full sm:w-48 px-4 py-3 rounded-xl border border-border bg-background text-foreground outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-left shadow-sm" dir="ltr" />
          </div>
          <button type="submit" className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-opacity-90 transition-all shadow-sm shrink-0">
            إضافة النظام
          </button>
        </form>
      </div>

      <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 text-sm font-bold text-gray-700 dark:text-gray-300">المنطقة / المحافظة</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-700 dark:text-gray-300">تكلفة الشحن (ج.م)</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-700 dark:text-gray-300 w-32">تحديث</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {provinces.map((province) => (
                <tr key={province.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">{province.name}</td>
                  <td className="px-6 py-2" colSpan={2}>
                    <form action={updateFee} className="flex items-center gap-3">
                      <input type="hidden" name="id" value={province.id} />
                      <input 
                        type="number" 
                        name="shippingFee" 
                        defaultValue={province.shippingFee} 
                        className="w-28 px-3 py-2 border border-border rounded-xl bg-background text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-left"
                        min="0"
                      />
                      <button type="submit" className="px-5 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-opacity-90 transition-all shadow-sm">
                        تعديل
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
              {provinces.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                    <p className="font-bold text-lg mb-2">النظام السحابي جاهز وفعال 100% 🚀</p>
                    <p>قم بكتابة اسم المحافظة وسعر شحنها في المربع بالأعلى لتبدأ بتأسيس المتجر للعملاء.</p>
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
