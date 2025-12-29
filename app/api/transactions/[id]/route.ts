import { persianToGregorian } from "@/lib/dateUtils";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// =============DELETE TRANSACTIONS===============
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "شناسه تراکنش الزامی است" },
        { status: 400 },
      );
    }

    await prisma.transaction.delete({ where: { id: id } });

    return NextResponse.json({ message: "تراکنش با موفقیت حذف شد" });
  } catch (error: unknown) {
    // بررسی اینکه آیا error یک آبجکت Prisma است
    if (error && typeof error === "object" && "code" in error) {
      if (error.code === "P2025") {
        return NextResponse.json({ error: "تراکنش یافت نشد" }, { status: 404 });
      }
      console.error("❌ خطا در حذف تراکنش:", error);
      return NextResponse.json(
        { error: "خطای سرور در حذف تراکنش" },
        { status: 500 },
      );
    }
  }
}

// =============UPDATE TRANSACTIONS===============
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const body = await request.json();

    const existingTransaction = await prisma.transaction.findUnique({
      where: { id: id },
    });

    if (!existingTransaction) {
      return NextResponse.json({ error: "تراکنش یافت نشد" }, { status: 404 });
    }

    const dateObject = body.date ? persianToGregorian(body.date) : new Date();

    const updateTransaction = await prisma.transaction.update({
      where: { id: id },
      data: {
        type: body.type,
        amount: body.amount,
        description: body.description,
        date: dateObject,
        paymentMethod: body.paymentMethod,
        status: body.status,
        categoryId: body.categoryId,
      },
      include: { category: true },
    });

    return NextResponse.json(updateTransaction);
  } catch (error) {
    console.error("❌ خطا در آپدیت تراکنش:", error);
    return NextResponse.json(
      { error: "خطای سرور در اپدیت تراکنش" },
      { status: 500 },
    );
  }
}
