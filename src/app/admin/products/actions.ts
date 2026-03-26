"use server";

import prisma from "@/lib/prisma";

export async function saveProduct(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const basePrice = parseFloat(formData.get("basePrice") as string);
  const warranty_period = formData.get("warranty_period") as string;
  const image = formData.get("image") as string;
  const variantsStr = formData.get("variants") as string;

  const variants = JSON.parse(variantsStr || "[]");

  await prisma.product.create({
    data: {
      title,
      description,
      basePrice,
      warranty_period: warranty_period.trim() !== "" ? warranty_period : null,
      image: image.trim() !== "" ? image : null,
      variants: {
        create: variants.map((v: any) => ({
          colorName: v.colorName,
          colorHex: v.colorHex,
          piece_count: parseInt(v.piece_count),
          stock: parseInt(v.stock),
          image: v.image.trim() !== "" ? v.image : null,
        }))
      }
    }
  });
}

export async function deleteProduct(id: string) {
  // Check if product exists
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) throw new Error("Product not found");

  // Since variants are cascade deleted conceptually, or we can just delete the product
  // Make sure cascade is set in schema. Wait, if it's not we can just delete variants first.
  await prisma.productVariant.deleteMany({
    where: { productId: id }
  });

  await prisma.product.delete({
    where: { id }
  });
}
