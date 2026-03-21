import Link from "next/link";
import { Store, LayoutDashboard, MapPin, Package, Users } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-l border-border shadow-sm flex flex-col">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center shadow-sm">
              <Package className="text-primary-foreground w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-primary">الإدارة</h1>
          </div>
          <ThemeToggle />
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium transition-colors">
            <LayoutDashboard className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            <span>نظرة عامة</span>
          </Link>

          <Link href="/admin/products" className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium transition-colors">
            <Package className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            <span>المنتجات والمخزون</span>
          </Link>

          <Link href="/admin/provinces" className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium transition-colors">
            <MapPin className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            <span>جدول الشحن</span>
          </Link>

          <Link href="/admin/couriers" className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium transition-colors">
            <Users className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            <span>المناديب والتسوية</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-border">
          <Link href="/" className="flex items-center gap-3 px-4 py-2 hover:text-primary transition-colors text-sm text-gray-500 dark:text-gray-400 font-medium">
            <Store className="w-4 h-4" />
            <span>معاينة المتجر</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}
