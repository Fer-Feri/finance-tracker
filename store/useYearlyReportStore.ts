// store/yearlyReportStore.ts
import { create } from "zustand";
import { useTransactionStore } from "./transactionStore";

// ============================================================
// TYPES
// ============================================================
interface YearStats {
  year: number;
  income: number;
  expense: number;
  profit: number;
  transactionCount: number;
}

interface ChangeData {
  change: number;
  changePercent: number;
}

interface YearComparison {
  current: YearStats;
  previous: YearStats | null;
  incomeChange: ChangeData | null;
  expenseChange: ChangeData | null;
  profitChange: ChangeData | null;
  avgMonthlyChange: ChangeData | null;
}

interface YearlyReportStore {
  selectedYear: number;
  setSelectedYear: (year: number) => void;

  // ✅ Computed values
  getYearComparison: () => YearComparison;
}

// ============================================================
// HELPER: محاسبه تغییر
// ============================================================
const calculateChange = (current: number, previous: number): ChangeData => {
  const change = current - previous;
  const changePercent = previous !== 0 ? (change / previous) * 100 : 0;
  return { change, changePercent };
};

// ============================================================
// STORE
// ============================================================
export const useYearlyReportStore = create<YearlyReportStore>((set, get) => ({
  selectedYear: 1403, // Default

  setSelectedYear: (year) => set({ selectedYear: year }),

  // ✅ این متد تمام محاسبات رو یکجا انجام میده
  getYearComparison: () => {
    const { selectedYear } = get();
    const { transactions } = useTransactionStore.getState();

    // محاسبه آمار سال جاری
    const currentTransactions = transactions.filter(
      (t) =>
        parseInt(t.date.split("/")[0], 10) === selectedYear &&
        t.status === "completed",
    );

    const currentIncome = currentTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const currentExpense = currentTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const current: YearStats = {
      year: selectedYear,
      income: currentIncome,
      expense: currentExpense,
      profit: currentIncome - currentExpense,
      transactionCount: currentTransactions.length,
    };

    // چک کردن سال قبل
    const hasPrevYear = transactions.some(
      (t) => parseInt(t.date.split("/")[0], 10) === selectedYear - 1,
    );

    if (!hasPrevYear) {
      return {
        current,
        previous: null,
        incomeChange: null,
        expenseChange: null,
        profitChange: null,
        avgMonthlyChange: null,
      };
    }

    // محاسبه آمار سال قبل
    const prevTransactions = transactions.filter(
      (t) =>
        parseInt(t.date.split("/")[0], 10) === selectedYear - 1 &&
        t.status === "completed",
    );

    const prevIncome = prevTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const prevExpense = prevTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const previous: YearStats = {
      year: selectedYear - 1,
      income: prevIncome,
      expense: prevExpense,
      profit: prevIncome - prevExpense,
      transactionCount: prevTransactions.length,
    };

    // محاسبه تغییرات
    const avgMonthly = current.income / 12;
    const prevAvgMonthly = previous.income / 12;

    return {
      current,
      previous,
      incomeChange: calculateChange(current.income, previous.income),
      expenseChange: calculateChange(current.expense, previous.expense),
      profitChange: calculateChange(current.profit, previous.profit),
      avgMonthlyChange: calculateChange(avgMonthly, prevAvgMonthly),
    };
  },
}));
