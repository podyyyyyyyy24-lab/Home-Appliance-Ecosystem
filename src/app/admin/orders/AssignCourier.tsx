"use client";

import { useState } from "react";
import { assignCourierAction } from "./actions";
import { useRouter } from "next/navigation";
import { Check, Truck } from "lucide-react";

export function AssignCourier({ 
  orderId, 
  currentCourierId, 
  couriers 
}: { 
  orderId: string, 
  currentCourierId: string | null, 
  couriers: any[] 
}) {
  const [selectedCourier, setSelectedCourier] = useState(currentCourierId || "");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAssign = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCourierId = e.target.value;
    setSelectedCourier(newCourierId);
    setLoading(true);

    const res = await assignCourierAction(orderId, newCourierId);
    
    if (res.success) {
      router.refresh(); // Automatically fetches the fresh latest table data
    } else {
      alert("تعذر حفظ التغييرات، حاول مرة أخرى.");
    }
    setLoading(false);
  };

  return (
    <div className="relative">
      <select 
        value={selectedCourier}
        onChange={handleAssign}
        disabled={loading}
        className={`appearance-none w-48 px-4 py-2 text-sm font-bold border rounded-xl outline-none focus:ring-1 focus:ring-primary shadow-sm cursor-pointer disabled:opacity-50 transition-colors ${
          selectedCourier 
            ? "border-green-300 dark:border-green-800 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300"
            : "border-border bg-background text-foreground"
        }`}
      >
        <option value="">-- لم يُحدد (قيد الانتظار) --</option>
        {couriers.map((courier) => (
          <option key={courier.id} value={courier.id}>{courier.name}</option>
        ))}
      </select>
      
      {loading ? (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      ) : selectedCourier ? (
        <Check className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600 dark:text-green-400 pointer-events-none" />
      ) : (
        <Truck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      )}
    </div>
  );
}
