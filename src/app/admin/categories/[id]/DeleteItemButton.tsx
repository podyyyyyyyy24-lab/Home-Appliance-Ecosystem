"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteCategoryItem } from "../actions";

export function DeleteItemButton({ itemId }: { itemId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <button
      disabled={loading}
      onClick={async () => {
        if (!confirm("هل أنت متأكد من حذف هذا العنصر؟")) return;
        setLoading(true);
        await deleteCategoryItem(itemId);
        router.refresh();
        setLoading(false);
      }}
      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors disabled:opacity-50"
      title="حذف"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
