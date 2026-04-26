import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const provinces = await prisma.province.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, shippingFee: true },
    });
    return NextResponse.json(provinces);
  } catch (error) {
    console.error("Failed to fetch provinces:", error);
    return NextResponse.json([], { status: 500 });
  }
}
