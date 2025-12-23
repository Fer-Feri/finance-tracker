import { useMemo } from "react";
import { useTransactionStore } from "@/store/transactionStore";

export interface MonthData {
  monthId: number;
  monthIncome: number;
  monthExpense: number;
  monthProfit: number;
  monthTransactionCount: number;
  monthProfitPercent: number; // درصد سود نسبت به درآمد
}

export function useMonthlyBreakdown(year: number) {
  const { transactions } = useTransactionStore();

  const monthsData = useMemo(() => {
    // آرایه‌ای از 12 ماه می‌سازیم
    const months: MonthData[] = [];

    for (let monthId = 1; monthId <= 12; monthId++) {
      // فیلتر تراکنش‌های این ماه
      const monthTransactions = transactions.filter((t) => {
        if (t.status !== "completed") return false;

        const [txYear, txMonth] = t.date.split("/").map(Number);
        return txYear === year && txMonth === monthId;
      });

      // محاسبه درآمد و هزینه
      const monthIncome = monthTransactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);

      const monthExpense = monthTransactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

      const monthProfit = monthIncome - monthExpense;

      // محاسبه درصد سود (اگر درآمد صفر نباشه)
      const monthProfitPercent =
        monthIncome > 0 ? Math.round((monthProfit / monthIncome) * 100) : 0;

      months.push({
        monthId,
        monthIncome,
        monthExpense,
        monthProfit,
        monthTransactionCount: monthTransactions.length,
        monthProfitPercent,
      });
    }

    return months;
  }, [transactions, year]);

  return monthsData;
}
