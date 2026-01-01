// src/hooks/useExpenseCharts.ts
import { useQuery } from "@tanstack/react-query";
import moment from "jalali-moment";
import { useMemo } from "react";
import {
  getCategoryFill,
  getCategoryLabel,
} from "@/config/translateCategoryName";

interface ApiTransaction {
  id: string;
  date: string;
  type: string;
  amount: number;
  status: string;
  category?: {
    name: string;
  };
}

interface ChartDataItem {
  category: string;
  name: string;
  value: number;
  fill: string;
  percentage: number;
}

interface HeatmapDataItem {
  date: Date;
  count: number;
  total: number;
}

export function useExpenseCharts(year: number) {
  const { data: transactions = [], isLoading } = useQuery<ApiTransaction[]>({
    queryKey: ["transactions"],
    queryFn: async () => {
      const response = await fetch("/api/transactions");
      if (!response.ok) throw new Error("خطا در دریافت تراکنش‌ها");
      return response.json();
    },
  });

  // 📊 داده‌های نمودار هزینه
  const expenseData = useMemo(() => {
    const expenseCategory = transactions.filter((t) => {
      const normalizedType = String(t.type).toLowerCase();
      const normalizedStatus = String(t.status).toLowerCase();

      if (normalizedType !== "expense" || normalizedStatus !== "completed") {
        return false;
      }

      const transactionYear = moment(t.date).jYear();
      return transactionYear === year;
    });

    const groupExpense = expenseCategory.reduce(
      (acc, t) => {
        const cat = t.category?.name || "other";
        acc[cat] = (acc[cat] || 0) + t.amount;
        return acc;
      },
      {} as Record<string, number>,
    );

    const totalExpense = Object.values(groupExpense).reduce(
      (sum: number, value: number) => sum + value,
      0,
    );

    return Object.entries(groupExpense)
      .map(([category, value]) => ({
        category,
        name: getCategoryLabel(category),
        value,
        fill: getCategoryFill(category),
        percentage:
          totalExpense > 0
            ? parseFloat(((value / totalExpense) * 100).toFixed(1))
            : 0,
      }))
      .sort((a, b) => b.value - a.value);
  }, [transactions, year]);

  // 💰 داده‌های نمودار درآمد
  const incomeData = useMemo(() => {
    const incomeCategory = transactions.filter((t) => {
      const normalizedType = String(t.type).toLowerCase();
      const normalizedStatus = String(t.status).toLowerCase();

      if (normalizedType !== "income" || normalizedStatus !== "completed") {
        return false;
      }

      const transactionYear = moment(t.date).jYear();
      return transactionYear === year;
    });

    const groupIncome = incomeCategory.reduce(
      (acc, t) => {
        const cat = t.category?.name || "other";
        acc[cat] = (acc[cat] || 0) + t.amount;
        return acc;
      },
      {} as Record<string, number>,
    );

    const totalIncome = Object.values(groupIncome).reduce(
      (sum: number, value: number) => sum + value,
      0,
    );

    return Object.entries(groupIncome)
      .map(([category, value]) => ({
        category,
        name: getCategoryLabel(category),
        value,
        fill: getCategoryFill(category),
        percentage:
          totalIncome > 0
            ? parseFloat(((value / totalIncome) * 100).toFixed(1))
            : 0,
      }))
      .sort((a, b) => b.value - a.value);
  }, [transactions, year]);

  // 🔥 داده‌های Heatmap (برای سال مورد نظر)
  const heatmapData = useMemo<HeatmapDataItem[]>(() => {
    const completedExpenses = transactions.filter((t) => {
      const normalizedType = String(t.type).toLowerCase();
      const normalizedStatus = String(t.status).toLowerCase();

      if (normalizedType !== "expense" || normalizedStatus !== "completed") {
        return false;
      }

      const transactionYear = moment(t.date).jYear();
      return transactionYear === year;
    });

    const groupedByDate = completedExpenses.reduce(
      (acc, t) => {
        const jalaliDate = moment(t.date).locale("fa").format("jYYYY/jMM/jDD");

        if (!acc[jalaliDate]) {
          acc[jalaliDate] = { count: 0, total: 0 };
        }

        acc[jalaliDate].count += 1;
        acc[jalaliDate].total += t.amount;

        return acc;
      },
      {} as Record<string, { count: number; total: number }>,
    );

    return Object.entries(groupedByDate)
      .map(([date, data]) => ({
        date: moment(date, "jYYYY/jMM/jDD").toDate(),
        count: data.count,
        total: data.total,
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [transactions, year]);

  return {
    expenseData,
    incomeData,
    heatmapData,
    isLoading,
  };
}
