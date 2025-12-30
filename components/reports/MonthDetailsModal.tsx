// src/components/reports/MonthDetailsModal.tsx
import { X } from "lucide-react";
import { useTransactionStore } from "@/store/transactionStore";
import { formatLargeNumber } from "@/utils/formatNumber";
import moment from "jalali-moment";
import { useMemo } from "react";

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
  const { transactions } = useTransactionStore();

  // فیلتر تراکنش‌های ماه
  const monthTransactions = useMemo(() => {
    return transactions.filter((t) => {
      if (t.status !== "completed") return false;
      const transactionDate = moment(t.date, "jYYYY/jMM/jDD");
      return (
        transactionDate.jYear() === year &&
        transactionDate.jMonth() + 1 === month
      );
    });
  }, [transactions, year, month]);

  const totalIncome = monthTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = monthTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

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
            {monthTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="bg-muted/30 flex items-center justify-between rounded-lg border p-3"
              >
                <div className="flex-1">
                  <p className="font-medium">{transaction.description}</p>
                  <p className="text-muted-foreground text-xs">
                    {transaction.date} • {transaction.category}
                  </p>
                </div>
                <p
                  className={`text-lg font-bold ${
                    transaction.type === "income"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {transaction.type === "income" ? "+" : "-"}
                  {formatLargeNumber(transaction.amount)}
                </p>
              </div>
            ))}
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
