import TransactionsClient from "@/components/transaction/TransactionsClient";
import { prisma } from "@/lib/prisma";

export default async function TransactionsPage() {
  const transactions = await prisma.transaction.findMany({
    include: {
      category: true, // ✅ شامل اطلاعات دسته‌بندی
    },
    orderBy: {
      date: "desc", // ✅ مرتب‌سازی از جدید به قدیم
    },
  });

  // ✅ پاس دادن داده‌ها به Client Component
  return <TransactionsClient transactions={transactions} />;
}
