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
import {
  useCalculateYearStats,
  useGetAvailableYears,
  useHasPreviousYear,
} from "@/utils/yearlyReportHelpers";
import { formatLargeNumber } from "@/utils/formatNumber";

// ============================================================
// UTILITY: محاسبه درصد تغییر
// ============================================================
const calculateChange = (current: number, previous: number) => {
  const change = current - previous;
  const changePercent = previous !== 0 ? (change / previous) * 100 : 0;
  return { change, changePercent };
};

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function YearlyReport() {
  const availableYears = useGetAvailableYears();
  const thisYear = moment().locale("fa").jYear();

  const [selectedYear, setSelectedYear] = useState<number>(
    availableYears[0] || thisYear,
  );

  const currentYearData = useCalculateYearStats(selectedYear);
  const prevYearData = useCalculateYearStats(selectedYear - 1);
  const hasPrevYear = useHasPreviousYear(selectedYear);

  const displayYears = availableYears.slice(0, 2);

  if (selectedYear < thisYear - 1) return null;

  if (!currentYearData) {
    return (
      <div className="rounded-xl border-2 border-dashed border-red-300 bg-red-50 p-8 text-center dark:border-red-700 dark:bg-red-900/20">
        <p className="text-red-600 dark:text-red-400">
          ❌ خطا: داده‌های سال {selectedYear} یافت نشد
        </p>
      </div>
    );
  }

  // محاسبه تغییرات
  const incomeChange = hasPrevYear
    ? calculateChange(currentYearData.income, prevYearData.income)
    : null;
  const expenseChange = hasPrevYear
    ? calculateChange(currentYearData.expense, prevYearData.expense)
    : null;
  const profitChange = hasPrevYear
    ? calculateChange(currentYearData.profit, prevYearData.profit)
    : null;

  // محاسبه میانگین ماهانه
  const avgMonthly = currentYearData.income / 12;
  const prevAvgMonthly = hasPrevYear ? prevYearData.income / 12 : 0;
  const avgChange = hasPrevYear
    ? calculateChange(avgMonthly, prevAvgMonthly)
    : null;

  // ✅ آرایه کارت‌ها - با null safety
  const cards = [
    {
      title: "کل درآمد سال",
      current: currentYearData.income,
      change: incomeChange,
      icon: TrendingUp,
      color: "bg-green-500",
    },
    {
      title: "کل هزینه سال",
      current: currentYearData.expense,
      change: expenseChange,
      icon: TrendingDown,
      color: "bg-red-500",
    },
    {
      title: "سود خالص",
      current: currentYearData.profit,
      change: profitChange,
      icon: DollarSign,
      color: "bg-blue-500",
    },
    {
      title: "میانگین ماهانه",
      current: avgMonthly,
      change: avgChange,
      icon: Activity,
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white">
            <Calendar className="h-7 w-7" />
            گزارش سالانه
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            مقایسه عملکرد مالی چند سال
          </p>
        </div>

        <div className="flex items-center gap-2">
          {displayYears.map((year) => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                selectedYear === year
                  ? "bg-primary hover:bg-primary/90 text-white/90"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      </div>

      {/* COMPARISON CARDS */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ title, current, change, icon: Icon, color }, index) => {
          // ✅ null safety: فقط اگه change وجود داشت
          const isPositive = change ? change.change >= 0 : true;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
            >
              {/* Header */}
              <div className="mb-4 flex items-center justify-between">
                <div className={`rounded-lg p-3 ${color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>

                {/* ✅ فقط اگه change داشتیم */}
                {change && (
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
                    {Math.abs(change.changePercent).toFixed(1)}%
                  </div>
                )}
              </div>

              {/* عنوان */}
              <h3 className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                {title}
              </h3>

              {/* مقدار فعلی */}
              <p className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                {formatLargeNumber(current)} تومان
              </p>

              {/* ✅ مقایسه فقط اگه change داشتیم */}
              {change ? (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500">نسبت به سال قبل:</span>
                  <span
                    className={`font-medium ${
                      isPositive ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {isPositive ? "+" : ""}
                    {change.change.toLocaleString("fa-IR")}
                  </span>
                </div>
              ) : (
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  اولین سال ثبت شده
                </p>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* PLACEHOLDER */}
      <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-100 p-8 text-center dark:border-gray-700 dark:bg-gray-800">
        <p className="text-gray-600 dark:text-gray-400">
          📊 نمودار مقایسه‌ای و بخش‌های بعدی اینجا قرار می‌گیرند
        </p>
      </div>
    </div>
  );
}
