import moment from "jalali-moment";
import { create } from "zustand";
import { useTransactionStore } from "./transactionStore";
import {
  getCategoryFill,
  getCategoryLabel,
} from "@/config/translateCategoryName";

export const useReportChartsStore = create(() => ({
  getExpenseByCategory: () => {
    const { transactions } = useTransactionStore.getState();

    const expenseCategory = transactions.filter(
      (t) => t.type === "expense" && t.status === "completed",
    );

    const groupExpense = expenseCategory.reduce(
      (acc, t) => {
        const cat = t.category || "other";

        acc[cat] = (acc[cat] || 0) + t.amount;

        return acc;
      },
      {} as Record<string, number>,
    );

    const totalExpense = Object.values(groupExpense).reduce(
      (sum, value) => sum + value,
      0,
    );

    return Object.entries(groupExpense)
      .map(([categoety, value]) => ({
        categoety,
        name: getCategoryLabel(categoety),
        value,
        fill: getCategoryFill(categoety),
        percentage:
          totalExpense > 0
            ? parseFloat(((value / totalExpense) * 100).toFixed(1))
            : 0,
      }))
      .sort((a, b) => b.value - a.value);
  },

  getIncomeByCategory: () => {
    const { transactions } = useTransactionStore.getState();

    const IncomeCategory = transactions.filter(
      (t) => t.type === "income" && t.status === "completed",
    );

    const groupIncome = IncomeCategory.reduce(
      (acc, t) => {
        const cat = t.category || "other";

        acc[cat] = (acc[cat] || 0) + t.amount;

        return acc;
      },
      {} as Record<string, number>,
    );

    const totalIncome = Object.values(groupIncome).reduce(
      (sum, value) => sum + value,
      0,
    );

    return Object.entries(groupIncome)
      .map(([categoety, value]) => ({
        categoety,
        name: getCategoryLabel(categoety),
        value,
        fill: getCategoryFill(categoety),
        percentage:
          totalIncome > 0
            ? parseFloat(((value / totalIncome) * 100).toFixed(1))
            : 0,
      }))
      .sort((a, b) => b.value - a.value);
  },

  getExpenseHeatmap: () => {
    const { transactions } = useTransactionStore.getState();

    const expenses = transactions.filter(
      (t) => t.type === "expense" && t.status === "completed",
    );

    const groupTnxByDay: Record<string, { count: number; total: number }> = {};

    expenses.forEach((t) => {
      const date = moment(t.date, "jYYYY/jMM/jDD");

      const thisYear = moment().jYear();

      if (date.jYear() === thisYear) {
        const shamsiDate = date.format("jYYYY/jMM/jDD");
        if (!groupTnxByDay[shamsiDate]) {
          groupTnxByDay[shamsiDate] = { count: 0, total: 0 };
        }

        groupTnxByDay[shamsiDate].count += 1;
        groupTnxByDay[shamsiDate].total += t.amount;
      }
    });

    return Object.entries(groupTnxByDay)
      .map(([date, data]) => ({
        date,
        count: data.count,
        total: data.total,
      }))
      .sort(
        (a, b) =>
          moment(a.date, "jYYYY/jMM/jDD").valueOf() -
          moment(b.date, "jYYYY/jMM/jDD").valueOf(),
      );
  },
}));
