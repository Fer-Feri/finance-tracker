import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

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
