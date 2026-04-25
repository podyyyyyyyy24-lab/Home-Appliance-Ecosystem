"use client";

import { toggleCategoryActive } from "./actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ToggleLeft, ToggleRight } from "lucide-react";

export function ToggleCategoryButton({ categoryId, active }: { categoryId: string; active: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <button
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        await toggleCategoryActive(categoryId);
        router.refresh();
        setLoading(false);
      }}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
        active
          ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800/40"
          : "bg-gray-100 dark:bg-gray-800 text-gray-500 border border-border"
      }`}
      title={active ? "القسم مفعّل - اضغط للإيقاف" : "القسم متوقف - اضغط للتفعيل"}
    >
      {active ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
      {active ? "مفعّل" : "متوقف"}
    </button>
  );
}
