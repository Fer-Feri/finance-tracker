import { Transaction } from "@/types/transaction";
import { YearlySummary, MonthData } from "@/types/reports";

// ====================================================================
// 🔢 ماشین حساب گزارشات مالی
// ====================================================================

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

/**
 * محاسبه آماره‌های یک ماه خاص
 */
function calculateMonthStats(
  transactions: Transaction[],
  year: number,
  month: number,
  previousMonthProfit: number, // ⬅️ سود ماه قبل برای محاسبه درصد تغییر
): MonthData {
  // ⬅️ فیلتر تراکنش‌های مربوط به این ماه
  const monthTransactions = transactions.filter((t) => {
    const [txYear, txMonth] = t.date.split("/").map(Number);
    return txYear === year && txMonth === month;
  });

  // ⬅️ محاسبه درآمد و هزینه
  const income = monthTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = monthTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const profit = income - expense;

  // ⬅️ محاسبه درصد تغییر نسبت به ماه قبل
  let changePercent = 0;
  if (previousMonthProfit !== 0) {
    changePercent =
      ((profit - previousMonthProfit) / Math.abs(previousMonthProfit)) * 100;
  } else if (profit !== 0) {
    changePercent = 100; // اگر ماه قبل صفر بود و این ماه مثبت/منفی شد
  }

  return {
    monthNumber: month,
    monthName: PERSIAN_MONTHS[month - 1],
    income,
    expense,
    profit,
    transactionCount: monthTransactions.length,
    changePercent: Math.round(changePercent * 10) / 10, // گرد کردن به یک رقم اعشار
  };
}

/**
 * محاسبه خلاصه سالانه
 */
export function calculateYearSummary(
  transactions: Transaction[],
  year: number,
): YearlySummary {
  const monthlyData: MonthData[] = [];
  let previousMonthProfit = 0;

  // ⬅️ محاسبه داده‌های ماهانه (از فروردین تا اسفند)
  for (let month = 1; month <= 12; month++) {
    const monthData = calculateMonthStats(
      transactions,
      year,
      month,
      previousMonthProfit,
    );
    monthlyData.push(monthData);
    previousMonthProfit = monthData.profit; // ⬅️ ذخیره برای ماه بعد
  }

  // ⬅️ محاسبه جمع کل‌ها
  const totalIncome = monthlyData.reduce((sum, m) => sum + m.income, 0);
  const totalExpense = monthlyData.reduce((sum, m) => sum + m.expense, 0);
  const totalProfit = totalIncome - totalExpense;
  const totalTransactions = monthlyData.reduce(
    (sum, m) => sum + m.transactionCount,
    0,
  );

  return {
    year,
    totalIncome,
    totalExpense,
    totalProfit,
    avgMonthlyProfit: totalProfit / 12,
    totalTransactions,
    monthlyData,
  };
}
