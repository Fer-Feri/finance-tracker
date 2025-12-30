// src/hooks/useReportData.ts
import { useMemo } from "react";
import { useTransactionStore } from "@/store/transactionStore";
import moment from "jalali-moment";

export function useReportData(year: number, month?: number) {
  const { transactions } = useTransactionStore();

  return useMemo(() => {
    // فیلتر بر اساس سال و ماه
    const filteredTransactions = transactions.filter((t) => {
      if (t.status !== "completed") return false;

      const transactionDate = moment(t.date, "jYYYY/jMM/jDD");
      const transactionYear = transactionDate.jYear();
      const transactionMonth = transactionDate.jMonth() + 1; // moment.jMonth() از 0 شروع می‌شه

      if (transactionYear !== year) return false;
      if (month !== undefined && transactionMonth !== month) return false;

      return true;
    });

    const totalIncome = filteredTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = filteredTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const profit = totalIncome - totalExpense;

    // میانگین ماهانه فقط برای کل سال
    const avgMonthlyProfit = month === undefined ? profit / 12 : profit;

    return {
      totalIncome,
      totalExpense,
      profit,
      avgMonthlyProfit,
      transactionCount: filteredTransactions.length,
    };
  }, [transactions, year, month]);
}
