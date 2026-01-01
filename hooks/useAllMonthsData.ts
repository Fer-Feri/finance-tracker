// src/hooks/useMonthlyTransactions.ts
import { useQuery } from "@tanstack/react-query";
import moment from "jalali-moment";
import { TransactionStatus, TransactionType } from "@/types/transaction";

interface MonthData {
  month: number;
  monthName: string;
  totalIncome: number;
  totalExpense: number;
  profit: number;
  transactionCount: number;
}

// ✅ Type برای Transaction از API
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

// src/hooks/useAllMonthsData.ts
export function useAllMonthsData(year: number) {
  return useQuery<MonthData[]>({
    queryKey: ["monthlyStats", year],
    queryFn: async () => {
      const res = await fetch("/api/transactions");
      if (!res.ok) throw new Error("خطا در دریافت تراکنش‌ها");

      const transactions: ApiTransaction[] = await res.json();

      // مقداردهی اولیه
      const monthGroups: Record<
        number,
        {
          income: number;
          expense: number;
          count: number;
        }
      > = {};

      for (let i = 1; i <= 12; i++) {
        monthGroups[i] = { income: 0, expense: 0, count: 0 };
      }

      // پردازش تراکنش‌ها
      transactions
        .filter((t) => {
          // ✅ Normalize status
          const normalizedStatus = String(t.status).toLowerCase();
          if (normalizedStatus !== "completed") {
            return false;
          }

          // ✅ تبدیل تاریخ میلادی به شمسی
          const transactionDate = moment(t.date);
          const jYear = transactionDate.jYear();

          if (jYear !== year) {
            return false;
          }

          return true;
        })
        .forEach((t) => {
          const transactionDate = moment(t.date);
          const month = transactionDate.jMonth() + 1; // 1-12

          // ✅ Normalize type قبل از مقایسه
          const normalizedType = String(t.type).toLowerCase();

          if (normalizedType === "income") {
            monthGroups[month].income += t.amount;
          } else if (normalizedType === "expense") {
            monthGroups[month].expense += t.amount;
          }
          monthGroups[month].count += 1;
        });

      // ✅ تبدیل به آرایه
      const result = Array.from({ length: 12 }, (_, index) => {
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

      result.forEach((m) => {
        console.log(
          `  ماه ${m.monthName}: درآمد=${m.totalIncome.toLocaleString()}, ` +
            `هزینه=${m.totalExpense.toLocaleString()}, ` +
            `تعداد=${m.transactionCount}`,
        );
      });

      return result;
    },
    enabled: !!year,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
