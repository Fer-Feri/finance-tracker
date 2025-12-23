"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import moment from "jalali-moment";

// ============================================================
// TYPES
// ============================================================
interface YearData {
  year: number;
  income: number;
  expense: number;
  profit: number;
}

interface ComparisonCard {
  title: string;
  current: number;
  previous: number;
  change: number;
  changePercent: number;
  icon: React.ElementType;
  color: string;
}

// ============================================================
// FAKE DATA
// ============================================================
const yearlyData: YearData[] = [
  { year: 1402, income: 100_000_000, expense: 60_000_000, profit: 40_000_000 },
  { year: 1403, income: 120_000_000, expense: 75_000_000, profit: 45_000_000 },
  { year: 1404, income: 150_000_000, expense: 95_000_000, profit: 55_000_000 },
];

// ============================================================
// UTILITY: محاسبه درصد تغییر
// ============================================================
const calculateChange = (current: number, previous: number) => {
  const change = current - previous;
  const changePercent = previous !== 0 ? (change / previous) * 100 : 0;
  return { change, changePercent };
};

// ============================================================
// COMPONENT: کارت آماری مقایسه‌ای
// ============================================================
const ComparisonStatCard = ({
  title,
  current,
  previous,
  change,
  changePercent,
  icon: Icon,
  color,
}: ComparisonCard) => {
  const isPositive = change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
    >
      {/* Header با آیکون */}
      <div className="mb-4 flex items-center justify-between">
        <div className={`rounded-lg p-3 ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div
          className={`flex items-center gap-1 text-sm font-medium ${
            isPositive ? "text-green-600" : "text-red-600"
          }`}
        >
          {isPositive ? (
            <ArrowUpRight className="h-4 w-4" />
          ) : (
            <ArrowDownRight className="h-4 w-4" />
          )}
          {Math.abs(changePercent).toFixed(1)}%
        </div>
      </div>

      {/* عنوان */}
      <h3 className="mb-2 text-sm text-gray-600 dark:text-gray-400">{title}</h3>

      {/* مقدار فعلی */}
      <p className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
        {current.toLocaleString("fa-IR")} تومان
      </p>

      {/* مقایسه با سال قبل */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-gray-500">نسبت به سال قبل:</span>
        <span
          className={`font-medium ${
            isPositive ? "text-green-600" : "text-red-600"
          }`}
        >
          {isPositive ? "+" : ""}
          {change.toLocaleString("fa-IR")}
        </span>
      </div>
    </motion.div>
  );
};

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function YearlyReport() {
  const thisYear = moment().locale("fa").jYear();
  const [selectedYear, setSelectedYear] = useState<number>(thisYear);

  // محاسبه آمار برای سال انتخاب شده
  const currentYearData = yearlyData.find((d) => d.year === selectedYear)!;
  const previousYearData = yearlyData.find((d) => d.year === selectedYear - 1)!;

  // اگه سال جاری نبود
  if (!currentYearData) {
    return (
      <div className="rounded-xl border-2 border-dashed border-red-300 bg-red-50 p-8 text-center dark:border-red-700 dark:bg-red-900/20">
        <p className="text-red-600 dark:text-red-400">
          ❌ خطا: داده‌های سال {selectedYear} یافت نشد
        </p>
      </div>
    );
  }

  if (selectedYear < thisYear - 1) return false;

  // بررسی: آیا سال جاری هیچ تراکنشی نداره؟
  const hasCurrentYearData =
    currentYearData.income > 0 ||
    currentYearData.expense > 0 ||
    currentYearData.profit !== 0;

  // بررسی: آیا سال قبل وجود داره؟
  const hasPreviousYear = !!previousYearData;

  // محاسبه تغییرات
  const incomeChange = calculateChange(
    currentYearData.income,
    previousYearData.income,
  );
  const expenseChange = calculateChange(
    currentYearData.expense,
    previousYearData.expense,
  );
  const profitChange = calculateChange(
    currentYearData.profit,
    previousYearData.profit,
  );

  // محاسبه میانگین ماهانه
  const avgMonthly = currentYearData.income / 12;
  const prevAvgMonthly = previousYearData.income / 12;
  const avgChange = calculateChange(avgMonthly, prevAvgMonthly);

  // آرایه کارت‌ها
  const comparisonCards: ComparisonCard[] = [
    {
      title: "کل درآمد سال",
      current: currentYearData.income,
      previous: previousYearData.income,
      change: incomeChange.change,
      changePercent: incomeChange.changePercent,
      icon: TrendingUp,
      color: "bg-green-500",
    },
    {
      title: "کل هزینه سال",
      current: currentYearData.expense,
      previous: previousYearData.expense,
      change: expenseChange.change,
      changePercent: expenseChange.changePercent,
      icon: TrendingDown,
      color: "bg-red-500",
    },
    {
      title: "سود خالص",
      current: currentYearData.profit,
      previous: previousYearData.profit,
      change: profitChange.change,
      changePercent: profitChange.changePercent,
      icon: DollarSign,
      color: "bg-blue-500",
    },
    {
      title: "میانگین ماهانه",
      current: avgMonthly,
      previous: prevAvgMonthly,
      change: avgChange.change,
      changePercent: avgChange.changePercent,
      icon: Activity,
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* ============================================================ */}
      {/* HEADER: عنوان و انتخاب سال‌ها */}
      {/* ============================================================ */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* عنوان */}
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white">
            <Calendar className="h-7 w-7" />
            گزارش سالانه
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            مقایسه عملکرد مالی چند سال
          </p>
        </div>

        {/* انتخابگر سال‌ها (فعلاً ساده) */}
        <div className="flex items-center gap-2">
          {yearlyData.map((data) => {
            const isActive = selectedYear === data.year;
            return (
              <button
                key={data.year}
                onClick={() => {
                  setSelectedYear(data.year);
                }}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                }`}
              >
                {data.year}
              </button>
            );
          })}
        </div>
      </div>

      {/* ============================================================ */}
      {/* COMPARISON CARDS: کارت‌های مقایسه‌ای */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {comparisonCards.map((card, index) => (
          <ComparisonStatCard key={index} {...card} />
        ))}
      </div>

      {/* ============================================================ */}
      {/* PLACEHOLDER: بخش‌های بعدی */}
      {/* ============================================================ */}
      <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-100 p-8 text-center dark:border-gray-700 dark:bg-gray-800">
        <p className="text-gray-600 dark:text-gray-400">
          📊 نمودار مقایسه‌ای و بخش‌های بعدی اینجا قرار می‌گیرند
        </p>
      </div>
    </div>
  );
}
