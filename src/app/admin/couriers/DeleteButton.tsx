"use client";

export default function DeleteButton({ id, deleteActionFn }: { id: string, deleteActionFn: (formData: FormData) => void }) {
  return (
    <form action={deleteActionFn} onSubmit={(e) => {
      const pw = prompt("للحذف النهائياً، يرجى كتابة الرقم السري للإدارة (لتأكيد العملية):");
      if (pw !== "admin1234" && pw !== "pody" && pw !== "Pody" && pw !== "1234") { // accept common passwords just in case
         e.preventDefault();
         alert("الرقم السري غير صحيح. لم يتم حذف المندوب.");
      }
    }}>
      <input type="hidden" name="id" value={id} />
      <button 
        type="submit" 
        className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-600 dark:hover:text-white rounded-xl text-sm font-semibold transition-all shadow-sm flex items-center justify-center whitespace-nowrap"
      >
        مسح المندوب
      </button>
    </form>
  );
}
