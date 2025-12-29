import { persianToGregorian } from "@/lib/dateUtils";
import { prisma } from "@/lib/prisma";
import {
  PaymentMethod,
  TransactionStatus,
  TransactionType,
} from "@prisma/client";
import { NextResponse } from "next/server";

interface createTransactionProps {
  type: TransactionType;
  amount: number;
  categoryId: string;
  date: string;
  description?: string;
  paymentMethod: PaymentMethod;
  status: TransactionStatus;
}

// =============GET TRANSACTIONS===============
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
// =============CREATE TRANSACTIONS===============
export async function POST(request: Request) {
  try {
    const body: createTransactionProps = await request.json();

    // ✅ Log کردن داده‌های دریافتی
    if (
      !body.type ||
      !body.amount ||
      !body.categoryId ||
      !body.date ||
      !body.description ||
      !body.paymentMethod ||
      !body.status
    ) {
      return NextResponse.json(
        { error: "لطفا تمامی فیلدها را پر کنید" },
        { status: 400 },
      );
    }

    if (body.amount <= 0) {
      console.error("❌ مبلغ نامعتبر:", body.amount);
      return NextResponse.json(
        { error: "مبلغ باید بیشتر از صفر باشد" },
        { status: 400 },
      );
    }

    const gregorianDate = persianToGregorian(body.date);

    const dataToCreate = {
      userId: "user-test-001",
      amount: body.amount,
      type: body.type,
      status: body.status,
      paymentMethod: body.paymentMethod,
      description: body.description || "بدون توضیحات",
      date: gregorianDate,
      categoryId: body.categoryId,
    };

    const newTransaction = await prisma.transaction.create({
      data: dataToCreate,
    });

    return NextResponse.json(
      {
        message: "تراکنش با موفقیت ایجاد شد",
        transaction: newTransaction,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("❌ خطا در ایجاد تراکنش:", error);
    return NextResponse.json({ error: "خطا در ایجاد تراکنش" }, { status: 500 });
  }
}
