// src/components/reports/MonthDetailsModal.tsx
import { X } from "lucide-react";
import { formatLargeNumber } from "@/utils/formatNumber";
import moment from "jalali-moment";
import { useMemo } from "react";
import { useMonthDetailsModal } from "@/hooks/useMonthDetailsModal";

// ✅ تعریف Interface برای Transaction
interface Transaction {
  id: string;
  amount: number;
  date: string;
  description: string;
  type: string;
  status: string;
  category?: {
    name: string;
  };
}

interface MonthDetailsModalProps {
  year: number;
  month: number;
  monthName: string;
  onClose: () => void;
}

export default function MonthDetailsModal({
  year,
  month,
  monthName,
  onClose,
}: MonthDetailsModalProps) {
  const { data: transactions, isLoading, error } = useMonthDetailsModal();

  console.log("🔍 Modal - تراکنش‌های دریافتی:", transactions?.length);

  // فیلتر تراکنش‌های ماه
  const monthTransactions = useMemo(() => {
    if (!transactions || transactions.length === 0) return [];

    const filtered = transactions.filter((t: Transaction) => {
      // ✅ Normalize status
      const normalizedStatus = String(t.status).toLowerCase();
      if (normalizedStatus !== "completed") {
        console.log(`❌ Modal - رد شد (status): ${t.status}`);
        return false;
      }

      // ✅ تبدیل تاریخ میلادی به شمسی
      const transactionDate = moment(t.date);
      const jYear = transactionDate.jYear();
      const jMonth = transactionDate.jMonth() + 1; // 1-12

      console.log(
        `📅 Modal - تراکنش: ${t.date} → ${jYear}/${jMonth} (انتظار: ${year}/${month})`,
      );

      return jYear === year && jMonth === month;
    });

    console.log(`✅ Modal - تراکنش‌های فیلتر شده: ${filtered.length}`);
    return filtered;
  }, [transactions, year, month]);

  // ✅ محاسبه درآمد با Normalize
  const totalIncome = monthTransactions
    .filter((t: Transaction) => {
      const normalizedType = String(t.type).toLowerCase();
      return normalizedType === "income";
    })
    .reduce((sum: number, t: Transaction) => sum + t.amount, 0);

  // ✅ محاسبه هزینه با Normalize
  const totalExpense = monthTransactions
    .filter((t: Transaction) => {
      const normalizedType = String(t.type).toLowerCase();
      return normalizedType === "expense";
    })
    .reduce((sum: number, t: Transaction) => sum + t.amount, 0);

  console.log(
    `💰 Modal - درآمد: ${totalIncome.toLocaleString()}, هزینه: ${totalExpense.toLocaleString()}`,
  );

  // ✅ نمایش لودینگ
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="bg-card rounded-xl border p-6">
          <div className="text-muted-foreground">در حال بارگذاری...</div>
        </div>
      </div>
    );
  }

  // ✅ نمایش خطا
  if (error) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="bg-card rounded-xl border p-6">
          <div className="text-destructive">خطا در دریافت داده‌ها</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-card max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl border p-6 shadow-2xl">
        {/* هدر */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">
              جزئیات {monthName} {year}
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">
              {monthTransactions.length} تراکنش ثبت شده
            </p>
          </div>
          <button
            onClick={onClose}
            className="hover:bg-muted rounded-lg p-2 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* خلاصه آماری */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-lg border bg-green-50 p-4 dark:bg-green-950/20">
            <p className="text-muted-foreground text-sm">کل درآمد</p>
            <p className="mt-1 text-2xl font-bold text-green-600">
              {formatLargeNumber(totalIncome)}
            </p>
          </div>
          <div className="rounded-lg border bg-red-50 p-4 dark:bg-red-950/20">
            <p className="text-muted-foreground text-sm">کل هزینه</p>
            <p className="mt-1 text-2xl font-bold text-red-600">
              {formatLargeNumber(totalExpense)}
            </p>
          </div>
          <div
            className={`rounded-lg border p-4 ${
              totalIncome - totalExpense >= 0
                ? "bg-blue-50 dark:bg-blue-950/20"
                : "bg-orange-50 dark:bg-orange-950/20"
            }`}
          >
            <p className="text-muted-foreground text-sm">سود/زیان</p>
            <p
              className={`mt-1 text-2xl font-bold ${
                totalIncome - totalExpense >= 0
                  ? "text-blue-600"
                  : "text-orange-600"
              }`}
            >
              {formatLargeNumber(totalIncome - totalExpense)}
            </p>
          </div>
        </div>

        {/* لیست تراکنش‌ها */}
        {monthTransactions.length > 0 ? (
          <div className="space-y-2">
            <h3 className="mb-3 font-semibold">لیست تراکنش‌ها</h3>
            {monthTransactions.map((transaction: Transaction) => {
              // ✅ Normalize برای نمایش
              const normalizedType = String(transaction.type).toLowerCase();

              return (
                <div
                  key={transaction.id}
                  className="bg-muted/30 flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex-1">
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-muted-foreground text-xs">
                      {moment(transaction.date).format("jYYYY/jMM/jDD")} •{" "}
                      {transaction.category?.name || "بدون دسته"}
                    </p>
                  </div>
                  <p
                    className={`text-lg font-bold ${
                      normalizedType === "income"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {normalizedType === "income" ? "+" : "-"}
                    {formatLargeNumber(transaction.amount)}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-muted-foreground py-12 text-center">
            هیچ تراکنشی برای این ماه ثبت نشده است
          </p>
        )}
      </div>
    </div>
  );
}
