import { useMemo } from "react";
import moment from "jalali-moment";
import { Transaction, Category } from "@prisma/client";
import { getCurrentJalaliYearMonth } from "@/utils/date/dateHelpers";

type TransactionWithCategory = Transaction & { category: Category };

export function useDashboardStats(transactions: TransactionWithCategory[]) {
  const { year: currentYear, month: currentMonth } =
    getCurrentJalaliYearMonth();

  console.log("🎯 Hook received transactions:", transactions.length);
  console.log("📅 Current Jalali:", currentYear, currentMonth);

  return useMemo(() => {
    // ✅ درآمد این ماه
    const thisMonthIncome = transactions
      .filter((t) => {
        const date = moment(t.date);
        return (
          t.type === "INCOME" &&
          t.status === "COMPLETED" &&
          date.jYear() === currentYear &&
          date.jMonth() + 1 === currentMonth
        );
      })
      .reduce((sum, t) => sum + t.amount, 0);

    // ✅ هزینه این ماه
    const thisMonthExpense = transactions
      .filter((t) => {
        const date = moment(t.date);
        return (
          t.type === "EXPENSE" &&
          t.status === "COMPLETED" &&
          date.jYear() === currentYear &&
          date.jMonth() + 1 === currentMonth
        );
      })
      .reduce((sum, t) => sum + t.amount, 0);

    // ✅ پس‌انداز این ماه
    const thisMonthSavings = thisMonthIncome - thisMonthExpense;

    // ✅ درصد پس‌انداز
    const savingsPercentage =
      thisMonthIncome > 0
        ? Math.round((thisMonthSavings / thisMonthIncome) * 100)
        : 0;

    // ✅ موجودی کل سال
    const thisYearTotalBalance = transactions
      .filter((t) => {
        const date = moment(t.date);
        return date.jYear() === currentYear && t.status === "COMPLETED";
      })
      .reduce(
        (sum, t) => (t.type === "INCOME" ? sum + t.amount : sum - t.amount),
        0,
      );

    // ✅ محاسبه ماه قبل
    const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const lastYear = currentMonth === 1 ? currentYear - 1 : currentYear;

    const lastMonthIncome = transactions
      .filter((t) => {
        const date = moment(t.date);
        return (
          t.type === "INCOME" &&
          t.status === "COMPLETED" &&
          date.jYear() === lastYear &&
          date.jMonth() + 1 === lastMonth
        );
      })
      .reduce((sum, t) => sum + t.amount, 0);

    const lastMonthExpense = transactions
      .filter((t) => {
        const date = moment(t.date);
        return (
          t.type === "EXPENSE" &&
          t.status === "COMPLETED" &&
          date.jYear() === lastYear &&
          date.jMonth() + 1 === lastMonth
        );
      })
      .reduce((sum, t) => sum + t.amount, 0);

    const lastMonthSavings = lastMonthIncome - lastMonthExpense;

    // ✅ موجودی کل سال قبل
    const lastYearTotalBalance = transactions
      .filter((t) => {
        const date = moment(t.date);
        return date.jYear() === currentYear - 1 && t.status === "COMPLETED";
      })
      .reduce(
        (sum, t) => (t.type === "INCOME" ? sum + t.amount : sum - t.amount),
        0,
      );

    // ✅ محاسبه درصد تغییر
    const getChangePercentage = (cardId: string) => {
      let current = 0;
      let previous = 0;

      switch (cardId) {
        case "monthly-income":
          current = thisMonthIncome;
          previous = lastMonthIncome;
          break;
        case "monthly-expense":
          current = thisMonthExpense;
          previous = lastMonthExpense;
          break;
        case "savings":
          current = thisMonthSavings;
          previous = lastMonthSavings;
          break;
        case "total-balance":
          current = thisYearTotalBalance;
          previous = lastYearTotalBalance;
          break;
        default:
          return null;
      }

      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / Math.abs(previous)) * 100);
    };

    return {
      thisMonthIncome,
      thisMonthExpense,
      thisMonthSavings,
      savingsPercentage,
      thisYearTotalBalance,
      getChangePercentage,
    };
  }, [transactions, currentYear, currentMonth]);
}
