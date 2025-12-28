import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const userId = "user-test-001";

    const transations = await prisma.transaction.findMany({
      where: { userId },
      include: { category: true },
      orderBy: { date: "desc" },
    });

    return NextResponse.json(transations);
  } catch (error) {
    console.error("❌ خطا در دریافت تراکنش‌ها:", error);
    return NextResponse.json(
      { error: "خطا در دریافت تراکنش‌ها" },
      { status: 500 },
    );
  }
}
