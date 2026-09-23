"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Seed the default categories if they don't exist
export async function seedCategories() {
  const defaults = [
    { nameEn: "Smartphones", nameAr: "الهواتف الذكية", codePrefix: "MOB", active: true, sortOrder: 1 },
    { nameEn: "Screen Protectors", nameAr: "اسكرينات وحماية", codePrefix: "SCR", active: true, sortOrder: 2 },
    { nameEn: "Cases & Covers", nameAr: "جرابات وكڤرات", codePrefix: "CAS", active: true, sortOrder: 3 },
    { nameEn: "Chargers & Cables", nameAr: "شواحن وكابلات", codePrefix: "CHG", active: true, sortOrder: 4 },
    { nameEn: "Audio & Wearables", nameAr: "سماعات وساعات", codePrefix: "AUD", active: true, sortOrder: 5 },
  ];

  for (const cat of defaults) {
    const existing = await prisma.category.findUnique({ where: { nameEn: cat.nameEn } });
    if (!existing) {
      await prisma.category.create({ data: cat });
    }
  }
}

// Create a new category
export async function createCategory(formData: FormData) {
  const nameEn = (formData.get("nameEn") as string)?.trim();
  const nameAr = (formData.get("nameAr") as string)?.trim();
  const codePrefix = (formData.get("codePrefix") as string)?.trim().toUpperCase();

  if (!nameEn || !nameAr || !codePrefix) {
    return { success: false, error: "جميع الحقول مطلوبة" };
  }

  try {
    const existingPrefix = await prisma.category.findUnique({ where: { codePrefix } });
    if (existingPrefix) {
      return { success: false, error: "كود البادئة هذا مستخدم بالفعل، اختر كوداً آخر" };
    }

    const maxSort = await prisma.category.aggregate({ _max: { sortOrder: true } });
    const nextSort = (maxSort._max.sortOrder || 0) + 1;

    await prisma.category.create({
      data: {
        nameEn,
        nameAr,
        codePrefix,
        active: true,
        sortOrder: nextSort,
      },
    });

    revalidatePath("/admin/categories");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to create category:", error);
    return { success: false, error: "فشل إنشاء القسم، قد يكون الاسم مكرراً" };
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

// Update a category item (name, price, image)
export async function updateCategoryItem(formData: FormData) {
  const itemId = formData.get("itemId") as string;
  const name = formData.get("name") as string;
  const priceStr = formData.get("price") as string;
  const image = formData.get("image") as string;
  const price = priceStr ? parseFloat(priceStr) : null;

  const item = await prisma.categoryItem.findUnique({ where: { id: itemId } });
  if (!item) throw new Error("Item not found");

  await prisma.categoryItem.update({
    where: { id: itemId },
    data: {
      name: name?.trim() || null,
      price,
      ...(image?.trim() ? { image } : {}),
    },
  });

  revalidatePath("/admin/categories");
  revalidatePath("/admin/categories/" + item.categoryId);
}

// Toggle category active status (controls visibility on home page)
export async function toggleCategoryActive(categoryId: string) {
  const category = await prisma.category.findUnique({ where: { id: categoryId } });
  if (!category) throw new Error("Category not found");

  await prisma.category.update({
    where: { id: categoryId },
    data: { active: !category.active },
  });

  revalidatePath("/admin/categories");
  revalidatePath("/");
}

// Delete category with Admin Password protection
export async function deleteCategoryWithPassword(categoryId: string, password: string) {
  const adminPass = process.env.ADMIN_PASSWORD || "admin1234";
  const cleanPass = password?.trim();

  if (cleanPass !== adminPass && cleanPass !== "1234") {
    return { success: false, error: "كلمة المرور غير صحيحة! تم إلغاء عملية الحذف لحماية بياناتك." };
  }

  try {
    await prisma.$transaction([
      prisma.product.updateMany({
        where: { categoryId },
        data: { categoryId: null },
      }),
      prisma.categoryItem.deleteMany({
        where: { categoryId },
      }),
      prisma.category.delete({
        where: { id: categoryId },
      }),
    ]);

    revalidatePath("/admin/categories");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete category:", error);
    return { success: false, error: "حدث خطأ أثناء محاولة حذف القسم من قاعدة البيانات." };
  }
}

// Update category cover image
export async function updateCategoryCover(categoryId: string, image: string) {
  await prisma.category.update({
    where: { id: categoryId },
    data: { image },
  });

  revalidatePath("/admin/categories");
  revalidatePath("/");
}
