"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateOrderStatusAction(orderId: string, status: string) {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
    
    revalidatePath("/admin/orders");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Failed to update order status", error);
    return { success: false, error: "فشل في تحديث حالة الشحنة" };
  }
}

export async function deleteOrderAction(orderId: string) {
  try {
    await prisma.order.delete({
      where: { id: orderId },
    });
    
    revalidatePath("/admin/orders");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete order", error);
    return { success: false, error: "فشل في حذف الطلب" };
  }
}
