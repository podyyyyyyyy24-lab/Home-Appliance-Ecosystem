"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateFeeAction(id: string, shippingFee: number) {
  if (id && !isNaN(shippingFee)) {
    await prisma.province.update({
      where: { id },
      data: { shippingFee },
    });
    revalidatePath("/admin/provinces");
  } else {
    throw new Error("Invalid parameters");
  }
}
