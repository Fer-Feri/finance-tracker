import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { order: "asc" },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.log("❌ خطا در دریافت دسته‌بندی‌ها:", error);
    return NextResponse.json(
      { error: "خطا در دریافت دسته‌بندی‌ها" },
      { status: 500 },
    );
  }
}
