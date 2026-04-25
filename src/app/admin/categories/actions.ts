"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Seed the default categories if they don't exist
export async function seedCategories() {
  const defaults = [
    { nameEn: "Perfumes", nameAr: "برفانات", codePrefix: "PRF", active: true, sortOrder: 1 },
    { nameEn: "Accessories", nameAr: "اكسسوار", codePrefix: "ACC", active: true, sortOrder: 2 },
    { nameEn: "Makeup", nameAr: "ميكايب", codePrefix: "MKP", active: false, sortOrder: 3 },
    { nameEn: "Skin Care", nameAr: "عناية بالبشرة", codePrefix: "SKN", active: false, sortOrder: 4 },
    { nameEn: "Home Appliances", nameAr: "اجهزة منزلية", codePrefix: "HAP", active: false, sortOrder: 5 },
    { nameEn: "Housewares", nameAr: "ادوات منزلية", codePrefix: "HWR", active: false, sortOrder: 6 },
  ];

  for (const cat of defaults) {
    const existing = await prisma.category.findUnique({ where: { nameEn: cat.nameEn } });
    if (!existing) {
      await prisma.category.create({ data: cat });
    }
  }
}

// Add an item (image) to a category with auto-generated code
export async function addCategoryItem(formData: FormData) {
  const categoryId = formData.get("categoryId") as string;
  const image = formData.get("image") as string;
  const name = formData.get("name") as string;
  const priceStr = formData.get("price") as string;
  const price = priceStr ? parseFloat(priceStr) : null;

  // Get category to know the code prefix
  const category = await prisma.category.findUnique({ where: { id: categoryId } });
  if (!category) throw new Error("Category not found");

  // Find the highest existing code number for this category
  const lastItem = await prisma.categoryItem.findFirst({
    where: { categoryId },
    orderBy: { code: "desc" },
  });

  let nextNumber = 1;
  if (lastItem) {
    const parts = lastItem.code.split("-");
    nextNumber = parseInt(parts[1]) + 1;
  }

  const code = `${category.codePrefix}-${String(nextNumber).padStart(3, "0")}`;

  await prisma.categoryItem.create({
    data: {
      categoryId,
      image,
      code,
      name: name?.trim() || null,
      price,
    },
  });

  revalidatePath("/admin/categories");
  revalidatePath("/admin/categories/" + categoryId);
}

// Delete a category item
export async function deleteCategoryItem(itemId: string) {
  await prisma.categoryItem.delete({ where: { id: itemId } });
  revalidatePath("/admin/categories");
}

// Toggle category active status
export async function toggleCategoryActive(categoryId: string) {
  const category = await prisma.category.findUnique({ where: { id: categoryId } });
  if (!category) throw new Error("Category not found");

  await prisma.category.update({
    where: { id: categoryId },
    data: { active: !category.active },
  });

  revalidatePath("/admin/categories");
}

// Update category cover image
export async function updateCategoryCover(categoryId: string, image: string) {
  await prisma.category.update({
    where: { id: categoryId },
    data: { image },
  });

  revalidatePath("/admin/categories");
}
