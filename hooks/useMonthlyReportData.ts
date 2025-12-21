// hooks/useMonthlyReportData.ts
import { useMemo } from "react";
import { useTransactionStore } from "@/store/transactionStore";

export function useMonthlyReportData(year: number) {
  const { transactions } = useTransactionStore();

  const yearData = useMemo(() => {
    // فیلتر تراکنش‌های سال انتخاب شده
    const yearTransactions = transactions.filter((t) => {
      const txYear = parseInt(t.date.split("/")[0]);
      return txYear === year && t.status === "completed";
    });

    // محاسبه کل درآمد
    const totalIncome = yearTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    // محاسبه کل هزینه
    const totalExpense = yearTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    // محاسبه سود/زیان
    const profit = totalIncome - totalExpense;

    // محاسبه میانگین سود ماهانه
    const avgMonthlyProfit = Math.round(profit / 12);

    return {
      totalIncome,
      totalExpense,
      profit,
      avgMonthlyProfit,
      transactionCount: yearTransactions.length,
    };
  }, [transactions, year]);

  return yearData;
}
