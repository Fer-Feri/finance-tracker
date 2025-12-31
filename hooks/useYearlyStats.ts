import { useMemo } from "react";
import { useTransactions } from "./useTransactions";
import moment from "jalali-moment";

interface yearlyStats {
  totalIncome: number;
  totalExpense: number;
  profit: number;
  avgMonthlyProfit: number;
  transactionCount: number;
  isLoading: boolean;
  error: Error | null;
}

export function useYearlyStats(year: number) {
  const { data: transaction = [], isLoading, error } = useTransactions();

  const stats = useMemo(() => {
    const yearTransactions = transaction?.filter((transaction) => {
      const jalaliDate = moment(transaction.date).locale("fa").jYear();
      return jalaliDate === year;
    });

    const totalIncome = yearTransactions
      ?.filter((t) => t.type === "INCOME" && t.status === "COMPLETED")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = yearTransactions
      ?.filter((t) => t.type === "EXPENSE" && t.status === "COMPLETED")
      .reduce((sum, t) => sum + t.amount, 0);

    const profit = totalIncome - totalExpense;

    const avgMonthlyProfit = Math.round(profit / 12);

    return {
      totalIncome,
      totalExpense,
      profit,
      avgMonthlyProfit,
      transactionCount: yearTransactions?.length,
    };
  }, [transaction, year]);

  return { stats, isLoading, error };
}
