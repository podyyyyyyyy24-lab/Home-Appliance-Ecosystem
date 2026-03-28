"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function CopyCourierLinkButton({ phone, password, name }: { phone: string, password: string, name: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    // Determine base URL dynamically
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://home-appliance-ecosystem.vercel.app';
    
    const message = `أهلاً بك كابتن ${name}. 👋
إليك بيانات لوحة التوصيل الخاصة بك:

🌐 رابط الدخول:
${baseUrl}/delivery

📱 رقم الهاتف (المُعرف):
${phone}

🔑 الرقم السري:
${password}

بالتوفيق!`;

    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("فشل النسخ", err);
    }
  };

  return (
    <button 
      onClick={handleCopy}
      type="button"
      title="نسخ رابط الدخول والبيانات لإرسالها للمندوب عبر الواتساب"
      className="px-3 py-1.5 flex items-center gap-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:hover:bg-purple-900/50 dark:text-purple-400 rounded-lg transition-all shadow-sm border border-purple-200 dark:border-purple-800 text-xs font-bold whitespace-nowrap"
    >
      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      {copied ? "تم النسخ" : "نسخ بياناته"}
    </button>
  );
}
