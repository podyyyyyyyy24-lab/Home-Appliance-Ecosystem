import { LayoutDashboard } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="bg-card border border-border rounded-2xl p-8 flex items-center gap-6 shadow-sm">
        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-md shrink-0">
          <LayoutDashboard className="text-primary-foreground w-8 h-8" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-2">مرحباً بك في لوحة الإدارة</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">اختر من القائمة الجانبية للبدء. النظام يعمل بالكامل كمحطة مستقلة (Standalone) للدفع عند الاستلام لتسريع مبيعاتك.</p>
        </div>
      </div>
    </div>
  );
}
