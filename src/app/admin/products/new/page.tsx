import { ProductForm } from "./ProductForm";

export default function NewProductPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
        <h1 className="text-2xl font-bold text-foreground">إضافة منتج جديد وتفاصيل المخزون</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          املأ بيانات المنتج الأساسية (العنوان والضمان)، ثم أضف التفاصيل الدقيقة للألوان (Variants) المتاحة، وسعر الشحن مرتبط أوتماتيكياً بالمحافظات.
        </p>
      </div>

      <div className="bg-card rounded-2xl shadow-sm border border-border p-6 md:p-8">
        <ProductForm />
      </div>
    </div>
  );
}
