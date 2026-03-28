"use server";

import prisma from "@/lib/prisma";

export async function saveOrder(formData: FormData) {
  const customerName = formData.get("customerName") as string;
  const customerPhone = formData.get("customerPhone") as string;
  const provinceId = formData.get("provinceId") as string;
  const customerAddress = formData.get("customerAddress") as string;
  const totalAmount = parseFloat(formData.get("totalAmount") as string);
  const variantId = formData.get("variantId") as string;
  
  if (customerName && customerPhone && provinceId && totalAmount) {
    await prisma.order.create({
      data: {
        customerName,
        customerPhone,
        provinceId,
        customerAddress,
        totalAmount,
        status: "PENDING",
      }
    });

    // الخصم التلقائي لعدد 1 من المخزون الحالي للمنتج المباع
    if (variantId) {
      try {
        await prisma.productVariant.update({
          where: { id: variantId },
          data: { stock: { decrement: 1 } }
        });
      } catch (e) {
        console.error("Failed to decrement stock on new order", e);
      }
    }
  }
}
