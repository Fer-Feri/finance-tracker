import { persianToGregorian } from "@/lib/dateUtils";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// =============DELETE TRANSACTIONS===============
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json(
        { error: "حذف در حالت دمو غیرفعال است" },
        { status: 401 },
      );
    }

    if (userId === "guest-preview") {
      return NextResponse.json(
        { error: "Demo Mode: حذف تراکنش غیرفعال است" },
        { status: 401 },
      );
    }
    const { id } = await params;

    const result = await prisma.transaction.deleteMany({
      where: { id, userId },
    });

    if (result.count === 0) {
      return NextResponse.json(
        { error: "تراکنش یافت نشد یا مجاز نیست" },
        { status: 404 },
      );
    }

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
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json(
        { error: "ویرایش در حالت دمو غیرفعال است" },
        { status: 401 },
      );
    }

    if (userId === "guest-preview") {
      return NextResponse.json(
        { error: "Demo Mode: ویرایش تراکنش غیرفعال است" },
        { status: 401 },
      );
    }
    const { id } = await params;

    const body = await request.json();

    const existingTransaction = await prisma.transaction.findFirst({
      where: { id, userId },
    });

    if (!existingTransaction) {
      return NextResponse.json({ error: "تراکنش یافت نشد" }, { status: 404 });
    }

    const dateObject = body.date ? persianToGregorian(body.date) : new Date();

    const result = await prisma.transaction.updateMany({
      where: { id, userId },
      data: {
        type: body.type,
        amount: body.amount,
        description: body.description,
        date: dateObject,
        paymentMethod: body.paymentMethod,
        status: body.status,
        categoryId: body.categoryId,
      },
      // include: { category: true },
    });

    if (result.count === 0) {
      return NextResponse.json(
        { error: "تراکنش یافت نشد یا مجاز نیست" },
        { status: 404 },
      );
    }

    const updateTransaction = await prisma.transaction.findFirst({
      where: { id, userId },
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
