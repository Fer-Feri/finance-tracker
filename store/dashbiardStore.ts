import { create } from "zustand";
import { Transaction } from "@/types/transaction";
import { getCurrentJalaliYearMonth } from "@/utils/date/dateHelpers";
import moment from "jalali-moment";

interface LastSixMonthItem {
  name: string;
  income: number;
  expense: number;
  year: number;
  month: number;
}

interface DashboardStoreType {
  transactions: Transaction[];
  currentYear: number;
  currentMonth: number;
  showAllTransactions: boolean;

  setTransactions: (data: Transaction[]) => void;
  setShowAllTransactions: () => void;

  getThisMonthIncome: () => number;
  getThisMonthExpense: () => number;
  getThisMonthSavings: () => number;
  getSavingsPercentage: () => number;
  getThisYearTotalBalance: () => number;

  getLastMonthIncome: () => number;
  getLastMonthExpense: () => number;
  getLastMonthSavings: () => number;
  getLastYearTotalBalance: () => number;
  getChangePercentage: (id: string) => number | null;
}

export const useDashboardStore = create<DashboardStoreType>()((set, get) => {
  const { year, month } = getCurrentJalaliYearMonth();

  return {
    transactions: [],
    currentYear: year,
    currentMonth: month,
    showAllTransactions: false,
    // ================================================================
    setTransactions: (data: Transaction[]) => set({ transactions: data }),
    // ================================================================
    setShowAllTransactions: () =>
      set((state) => ({
        showAllTransactions: !state.showAllTransactions,
      })),
    // ================================================================
    getThisMonthIncome: () => {
      const { transactions, currentYear, currentMonth } = get();

      return transactions
        .filter((transaction) => {
          const transactionDate = moment(transaction.date, "jYYYY-jMM-jDD");
          return (
            transaction.type === "income" &&
            transaction.status === "completed" &&
            transactionDate.jYear() === currentYear &&
            transactionDate.jMonth() + 1 === currentMonth
          );
        })
        .reduce((sum, t) => sum + t.amount, 0);
    },

    // ================================================================
    getThisMonthExpense: () => {
      const { transactions, currentYear, currentMonth } = get();

      return transactions
        .filter((transaction) => {
          const transactionDate = moment(transaction.date, "jYYYY-jMM-jDD");
          return (
            transaction.type === "expense" &&
            transaction.status === "completed" &&
            transactionDate.jYear() === currentYear &&
            transactionDate.jMonth() + 1 === currentMonth
          );
        })
        .reduce((sum, t) => sum + t.amount, 0);
    },
    // ================================================================
    getThisMonthSavings: () => {
      const { getThisMonthIncome, getThisMonthExpense } = get();
      return getThisMonthIncome() - getThisMonthExpense();
    },
    // ================================================================
    getSavingsPercentage: () => {
      const { getThisMonthIncome, getThisMonthSavings } = get();
      const income = getThisMonthIncome();
      if (income === 0) return 0;
      return Math.round((getThisMonthSavings() / income) * 100);
    },
    // ================================================================
    //======================موجودی کل (کل درآمدها - کل هزینه‌ها)============
    // ================================================================
    getThisYearTotalBalance: () => {
      const { transactions } = get();

      const { year } = getCurrentJalaliYearMonth();

      const thisYearTransaction = transactions.filter((transaction) => {
        const transactionDate = moment(transaction.date, "jYYYY-jMM-jDD");

        return (
          transactionDate.jYear() === year && transaction.status === "completed"
        );
      });

      const totalIncome = thisYearTransaction
        .filter(
          (transaction) =>
            transaction.type === "income" && transaction.status === "completed",
        )
        .reduce((sum, t) => sum + t.amount, 0);

      const totalExpense = thisYearTransaction
        .filter(
          (transaction) =>
            transaction.type === "expense" &&
            transaction.status === "completed",
        )
        .reduce((sum, t) => sum + t.amount, 0);

      return totalIncome - totalExpense;
    },

    // ================================================================
    // =======================⏪محاسبات ماه قبل⏩======================
    // ================================================================
    getLastMonthIncome: () => {
      const { transactions, currentYear, currentMonth } = get();

      if (!currentMonth) return 0;
      const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
      const lastYear = currentYear === 1 ? currentYear - 1 : currentYear;

      return transactions
        .filter((transaction) => {
          if (
            transaction.status !== "completed" ||
            transaction.type !== "income"
          )
            return false;
          const date = moment(transaction.date, "jYYYY-jMM-jDD");

          return date.jYear() === lastYear && date.jMonth() + 1 === lastMonth;
        })
        .reduce((sum, t) => sum + t.amount, 0);
    },

    // ================================================================
    getLastMonthExpense: () => {
      const { transactions, currentYear, currentMonth } = get();

      if (!currentMonth) return 0;
      const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
      const lastYear = currentYear === 1 ? currentYear - 1 : currentYear;

      return transactions
        .filter((transaction) => {
          if (
            transaction.status !== "completed" ||
            transaction.type !== "expense"
          )
            return false;
          const date = moment(transaction.date, "jYYYY-jMM-jDD");

          return date.jYear() === lastYear && date.jMonth() + 1 === lastMonth;
        })
        .reduce((sum, t) => sum + t.amount, 0);
    },

    // ================================================================
    getLastYearTotalBalance: () => {
      const { transactions } = get();

      const { year } = getCurrentJalaliYearMonth();
      const prevYear = year - 1;

      const prevYearTransaction = transactions.filter((transaction) => {
        const transactionDate = moment(transaction.date, "jYYYY-jMM-jDD");

        return (
          transactionDate.jYear() === prevYear &&
          transaction.status === "completed"
        );
      });

      const totalIncome = prevYearTransaction
        .filter(
          (transaction) =>
            transaction.type === "income" && transaction.status === "completed",
        )
        .reduce((sum, t) => sum + t.amount, 0);

      const totalExpense = prevYearTransaction
        .filter(
          (transaction) =>
            transaction.type === "expense" &&
            transaction.status === "completed",
        )
        .reduce((sum, t) => sum + t.amount, 0);

      return totalIncome - totalExpense;
    },
    // ================================================================
    getLastMonthSavings: () => {
      const { getLastMonthIncome, getLastMonthExpense } = get();
      return getLastMonthIncome() - getLastMonthExpense();
    },
    // ================================================================
    getChangePercentage: (cardId: string) => {
      const {
        getThisMonthIncome,
        getThisMonthExpense,
        getThisMonthSavings,
        getThisYearTotalBalance,
        getLastMonthIncome,
        getLastMonthExpense,
        getLastMonthSavings,
        getLastYearTotalBalance,
      } = get();

      let current = 0;
      let previous = 0;

      switch (cardId) {
        case "monthly-income":
          current = getThisMonthIncome();
          previous = getLastMonthIncome();
          break;
        case "monthly-expense":
          current = getThisMonthExpense();
          previous = getLastMonthExpense();
          break;
        case "savings":
          current = getThisMonthSavings();
          previous = getLastMonthSavings();
          break;
        case "total-balance":
          current = getThisYearTotalBalance();
          previous = getLastYearTotalBalance();
          break;
        default:
          return null;
      }

      if (previous === 0) return current > 0 ? 100 : 0;

      const change = ((current - previous) / Math.abs(previous)) * 100;
      return Math.round(change);
    },
  };
});
