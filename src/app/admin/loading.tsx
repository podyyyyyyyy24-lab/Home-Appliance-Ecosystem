import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="w-full h-[60vh] flex flex-col items-center justify-center space-y-4 animate-in fade-in duration-300">
      <div className="relative">
         <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse-slow"></div>
         <Loader2 className="w-12 h-12 text-primary animate-spin relative z-10" />
      </div>
      <p className="text-gray-500 font-bold animate-pulse text-lg">جاري سحب البيانات المشفرة...</p>
    </div>
  );
}
