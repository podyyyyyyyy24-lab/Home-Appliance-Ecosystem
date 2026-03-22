import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Lock } from "lucide-react";

async function loginAdmin(formData: FormData) {
  "use server";
  const password = formData.get("password") as string;
  // Fallback fixed passcode logically decoupled from database preventing DB exposure natively
  const correctPassword = process.env.ADMIN_PASSWORD || "admin1234";

  if (password === correctPassword) {
    const cookieStore = await cookies();
    cookieStore.set("admin_auth", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30 // 30 days
    });
    redirect("/admin");
  } else {
    redirect("/login?error=true");
  }
}

export default async function AdminLogin({ searchParams }: { searchParams: { error?: string } }) {
  const rawSP = await searchParams;
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="bg-card w-full max-w-md p-8 rounded-[32px] shadow-sm border border-border text-center">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-2xl font-black text-foreground mb-2">خزنة الإدارة المركزية</h1>
        <p className="text-gray-500 mb-8 font-medium">لوحة التحكم السحابية لموقع إيكو ستور. هذه المنطقة محصنة بالكامل 🔒.</p>
        
        <form action={loginAdmin} className="space-y-4">
          <input type="password" name="password" required placeholder="الرقم السري للإدارة" className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-center tracking-[0.5em] font-bold" dir="ltr" />
          {rawSP.error && <p className="text-white bg-red-500 p-2 rounded-xl text-sm font-bold animate-pulse">الكلمة غير صحيحة، الوصول مرفوض.</p>}
          <button type="submit" className="w-full py-4 bg-primary text-primary-foreground font-black rounded-2xl shadow-lg hover:-translate-y-1 transition-transform mt-4 text-lg">تحقق ودخول</button>
        </form>
      </div>
    </div>
  );
}
