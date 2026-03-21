"use server";

import prisma from "@/lib/prisma";

export async function saveOrder(formData: FormData) {
  const customerName = formData.get("customerName") as string;
  const customerPhone = formData.get("customerPhone") as string;
  const provinceId = formData.get("provinceId") as string;
  const customerAddress = formData.get("customerAddress") as string;
  const totalAmount = parseFloat(formData.get("totalAmount") as string);
  
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
  }
}
