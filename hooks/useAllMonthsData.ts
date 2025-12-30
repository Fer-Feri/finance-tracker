// src/hooks/useAllMonthsData.ts
import { useMemo } from "react";
import { useTransactionStore } from "@/store/transactionStore";
import moment from "jalali-moment";

interface MonthData {
  month: number;
  monthName: string;
  totalIncome: number;
  totalExpense: number;
  profit: number;
  transactionCount: number;
}

const PERSIAN_MONTHS = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];

export function useAllMonthsData(year: number): MonthData[] {
  const { transactions } = useTransactionStore();

  return useMemo(() => {
    // گروه‌بندی تراکنش‌ها بر اساس ماه
    const monthGroups: Record<
      number,
      { income: number; expense: number; count: number }
    > = {};

    // مقداردهی اولیه برای همه ماه‌ها
    for (let i = 1; i <= 12; i++) {
      monthGroups[i] = { income: 0, expense: 0, count: 0 };
    }

    // فیلتر و گروه‌بندی
    transactions
      .filter((t) => {
        if (t.status !== "completed") return false;
        const transactionDate = moment(t.date, "jYYYY/jMM/jDD");
        return transactionDate.jYear() === year;
      })
      .forEach((t) => {
        const transactionDate = moment(t.date, "jYYYY/jMM/jDD");
        const month = transactionDate.jMonth() + 1;

        if (t.type === "income") {
          monthGroups[month].income += t.amount;
        } else if (t.type === "expense") {
          monthGroups[month].expense += t.amount;
        }
        monthGroups[month].count += 1;
      });

    // تبدیل به آرایه
    return Array.from({ length: 12 }, (_, index) => {
      const month = index + 1;
      const data = monthGroups[month];

      return {
        month,
        monthName: PERSIAN_MONTHS[index],
        totalIncome: data.income,
        totalExpense: data.expense,
        profit: data.income - data.expense,
        transactionCount: data.count,
      };
    });
  }, [transactions, year]);
}
