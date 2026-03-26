"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function assignCourierAction(orderId: string, courierId: string) {
  try {
    const dataToUpdate: any = { courierId: courierId };

    // If an actual courier is selected, move the order out for delivery
    // If empty string is passed (unassigning), we revert back to PENDING.
    if (courierId) {
      dataToUpdate.status = "OUT_FOR_DELIVERY";
    } else {
      dataToUpdate.status = "PENDING";
      dataToUpdate.courierId = null; 
    }

    await prisma.order.update({
      where: { id: orderId },
      data: dataToUpdate,
    });
    
    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error) {
    console.error("Failed to assign courier", error);
    return { success: false };
  }
}
