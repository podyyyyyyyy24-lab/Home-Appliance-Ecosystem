import Link from "next/link";
import { ArrowRight, Wrench } from "lucide-react";

export default function EditProductPlaceholder({ params }: { params: { id: string } }) {
  return (
    <div className="max-w-4xl mx-auto py-20 text-center">
      <div className="w-24 h-24 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
        <Wrench className="w-12 h-12 text-orange-500" />
      </div>
      <h1 className="text-3xl font-black text-foreground mb-4">صفحة التعديل تحت التطوير 🚧</h1>
      <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
        نعمل حالياً على بناء واجهة تعديل المنتجات والألوان بشكل كامل. 
        مؤقتاً، يمكنك <strong>حذف المنتج</strong> وإضافته من جديد في حال أردت تغيير السعر أو الصور.
      </p>
      
      <Link href="/admin/products" className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-bold rounded-2xl hover:scale-105 transition-transform shadow-lg shadow-primary/30">
        <ArrowRight className="w-5 h-5" />
        العودة لقائمة المنتجات
      </Link>
    </div>
  );
}
