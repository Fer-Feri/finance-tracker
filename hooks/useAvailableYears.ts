import { useMemo } from "react";
import { useTransactions } from "./useTransactions";
import moment from "jalali-moment";

export function useAvailableYears() {
  const { data: transactions, isLoading, error } = useTransactions();

  const years = useMemo(() => {
    if (!transactions || transactions.length === 0) return [];

    const uniqueYears = new Set(
      transactions.map((transaction) => {
        const jalaliDate = moment(transaction.date).locale("fa").jYear();
        return jalaliDate;
      }),
    );

    return Array.from(uniqueYears).sort((a, b) => b - a);
  }, [transactions]);

  return {
    years,
    isLoading,
    error,
    lastYear: years[0],
    oldestYear: years[years.length - 1],
    hasYears: years.length > 0,
  };
}
