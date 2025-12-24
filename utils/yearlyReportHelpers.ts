import { useTransactionStore } from "@/store/transactionStore";
import { useMemo } from "react";

// استخراج سال‌های یونیک از تراکنش‌ها
export const useGetAvailableYears = () => {
  const { transactions } = useTransactionStore();

  return useMemo(() => {
    const years = new Set<number>();

    transactions.forEach((transaction) => {
      const yearTransaction = transaction.date.split("/")[0];
      years.add(Number(yearTransaction));
    });
    return Array.from(years).sort((a, b) => b - a);
  }, [transactions]);
};

// چک کردن وجود سال قبل
export const useHasPreviousYear = (currentYear: number) => {
  const { transactions } = useTransactionStore();

  return useMemo(() => {
    return transactions.some(
      (transaction) =>
        parseInt(transaction.date.split("/")[0], 10) === currentYear - 1,
    );
  }, [transactions, currentYear]);
};

//محاسبه آمار یک سال
export const useCalculateYearStats = (year: number) => {
  const { transactions } = useTransactionStore();

  return useMemo(() => {
    const yearTransactions = transactions.filter(
      (trx) =>
        parseInt(trx.date.split("/")[0], 10) === year &&
        trx.status === "completed",
    );

    const income = yearTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = yearTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      year,
      income,
      expense,
      profit: income - expense,
      transactionCount: yearTransactions.length,
    };
  }, [transactions, year]);
};
