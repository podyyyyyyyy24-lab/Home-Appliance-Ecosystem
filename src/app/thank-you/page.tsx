import Link from "next/link";
import { CheckCircle2, Home } from "lucide-react";

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-card w-full max-w-lg p-10 rounded-[32px] border border-border shadow-md">
        <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="text-green-600 dark:text-green-400 w-12 h-12" />
        </div>
        <h1 className="text-3xl font-black text-foreground mb-4">تم استلام طلبك بنجاح!</h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 leading-relaxed">
          شكراً لتسوقك معنا، تم تسجيل الطلب وسيتم مراجعته وتجهيزه للشحن قريباً. 
          مندوب الشحن سيتواصل معك عبر الهاتف والواتساب قبل الوصول للعطائك خبر مسبقاً.
        </p>
        <Link href="/" className="inline-flex items-center justify-center gap-3 bg-primary text-primary-foreground font-bold px-8 py-4 rounded-xl shadow-sm hover:scale-105 transition-transform w-full md:w-auto">
          <Home className="w-5 h-5" />
          العودة للتسوق
        </Link>
      </div>
    </div>
  );
}
