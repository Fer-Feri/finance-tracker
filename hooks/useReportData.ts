import { TransactionStatus, TransactionType } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import moment from "jalali-moment";
import { useMemo } from "react";

interface ApiTransaction {
  id: string;
  date: string; // فرمت: "2025-12-30" (میلادی از دیتابیس)
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  description?: string;
  category?: {
    name: string;
  };
}

export function useReportData(year: number, month?: number) {
  const {
    data: transactions = [],
    isLoading,
    error,
  } = useQuery<ApiTransaction[]>({
    queryKey: ["transactions"],
    queryFn: async () => {
      const response = await fetch("/api/transactions");

      if (!response.ok) throw new Error("خطا در دریافت تراکنش‌ها");

      return response.json();
    },
  });

  const data = useMemo(() => {
    const filteredTransacions = transactions.filter((t) => {
      const normalizedStatus = String(t.status).toLowerCase();
      if (normalizedStatus !== "completed") return false;

      const transactionDate = moment(t.date);
      const transactionYear = transactionDate.jYear();
      const transactionMonth = transactionDate.jMonth() + 1;

      if (transactionYear !== year) return false;
      if (month !== undefined && transactionMonth !== month) return false;

      return true;
    });

    const totalIncome = filteredTransacions
      .filter((t) => String(t.type).toLowerCase() === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = filteredTransacions
      .filter((t) => String(t.type).toLowerCase() === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const profit = totalIncome - totalExpense;

    // میانگین ماهانه فقط برای کل سال
    const avgMonthlyProfit = month === undefined ? profit / 12 : profit;

    return {
      totalIncome,
      totalExpense,
      profit,
      avgMonthlyProfit,
      transactionCount: filteredTransacions.length,
    };
  }, [transactions, year, month]);

  return {
    ...data,
    isLoading,
    error,
  };
}
