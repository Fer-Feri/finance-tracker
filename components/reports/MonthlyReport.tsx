"use client";

import { useMemo, useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  FileText,
  Minus,
} from "lucide-react";
import { formatCurrency } from "@/lib/formatCurrency";
import { useReportsStore } from "@/store/useReportsStore";
import { useTransactionModalStore } from "@/store/transactionModal-store";

// ====================================================================
// 📊 کامپوننت گزارش ماهانه
// ====================================================================

export default function MonthlyReport() {
  // ⬅️ State مدیریت سال انتخاب شده
  const [selectedYear, setSelectedYear] = useState<number>(1404);

  // ⬅️ دریافت تراکنش‌ها از Store (فقط subscribe به transactions)
  const transactions = useTransactionModalStore((state) => state.transactions);

  // ⬅️ محاسبه گزارش با useMemo برای جلوگیری از Infinite Loop
  const report = useMemo(() => {
    return useReportsStore.getState().getYearlyReport(selectedYear);
  }, [selectedYear, transactions]);

  // ⬅️ تابع رنگ‌بندی بر اساس مثبت/منفی بودن
  const getProfitColor = (value: number): string => {
    if (value > 0) return "text-green-600 dark:text-green-400";
    if (value < 0) return "text-red-600 dark:text-red-400";
    return "text-muted-foreground";
  };

  // ⬅️ محاسبه حداکثر مقادیر برای نمودار نسبی
  const maxIncome = Math.max(...report.monthlyData.map((m) => m.income));
  const maxExpense = Math.max(...report.monthlyData.map((m) => m.expense));

  return (
    <div className="space-y-6">
      {/* ========================================
          🎯 بخش هدر: انتخاب سال
      ======================================== */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Calendar className="text-primary h-5 w-5" />
          <h2 className="text-xs font-bold md:text-xl">
            گزارش ماهانه سال {selectedYear}
          </h2>
        </div>

        <div className="flex items-center gap-2 md:gap-6">
          {/* دکمه سال قبل */}
          <button
            onClick={() => setSelectedYear((prev) => prev - 1)}
            disabled={selectedYear <= 1400}
            className="border-border bg-background hover:bg-muted rounded-lg border p-2 transition-colors disabled:opacity-50"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          {/* نمایش سال فعلی */}
          <span className="text-center text-sm font-medium">
            {selectedYear}
          </span>

          {/* دکمه سال بعد */}
          <button
            onClick={() => setSelectedYear((prev) => prev + 1)}
            disabled={selectedYear >= 1404}
            className="border-border bg-background hover:bg-muted rounded-lg border p-2 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ========================================
          💳 بخش کارت‌های خلاصه
      ======================================== */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* ⬅️ کارت کل درآمد */}
        <div className="border-border rounded-xl border bg-gradient-to-br from-green-50 to-green-100 p-4 dark:from-green-950/20 dark:to-green-900/20">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-muted-foreground text-sm font-medium">
              کل درآمد
            </span>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {formatCurrency(report.totalIncome)}
          </p>
          <p className="text-muted-foreground mt-1 text-xs">تومان</p>
        </div>

        {/* ⬅️ کارت کل هزینه */}
        <div className="border-border rounded-xl border bg-gradient-to-br from-red-50 to-red-100 p-4 dark:from-red-950/20 dark:to-red-900/20">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-muted-foreground text-sm font-medium">
              کل هزینه
            </span>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </div>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">
            {formatCurrency(report.totalExpense)}
          </p>
          <p className="text-muted-foreground mt-1 text-xs">تومان</p>
        </div>

        {/* ⬅️ کارت سود/زیان خالص */}
        <div className="border-border rounded-xl border bg-gradient-to-br from-blue-50 to-blue-100 p-4 dark:from-blue-950/20 dark:to-blue-900/20">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-muted-foreground text-sm font-medium">
              سود/زیان خالص
            </span>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </div>
          <p
            className={`text-2xl font-bold ${getProfitColor(report.totalProfit)}`}
          >
            {formatCurrency(report.totalProfit)}
          </p>
          <p className="text-muted-foreground mt-1 text-xs">تومان</p>
        </div>

        {/* ⬅️ کارت میانگین سود ماهانه */}
        <div className="border-border rounded-xl border bg-gradient-to-br from-purple-50 to-purple-100 p-4 dark:from-purple-950/20 dark:to-purple-900/20">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-muted-foreground text-sm font-medium">
              میانگین سود ماهانه
            </span>
            <Calendar className="h-4 w-4 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {formatCurrency(Math.round(report.avgMonthlyProfit))}
          </p>
          <p className="text-muted-foreground mt-1 text-xs">تومان</p>
        </div>
      </div>

      {/* ========================================
          📊 بخش جدول ماه‌ها
      ======================================== */}
      <div className="border-border overflow-hidden rounded-xl border">
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* ⬅️ سر جدول */}
            <thead className="bg-muted/50 dark:bg-muted/10">
              <tr>
                <th className="px-4 py-3 text-right text-sm font-semibold">
                  ماه
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold">
                  درآمد
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold">
                  هزینه
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold">
                  سود/زیان
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold">
                  تغییر
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold">
                  نمودار
                </th>
              </tr>
            </thead>

            {/* ⬅️ بدنه جدول */}
            <tbody className="divide-border divide-y">
              {report.monthlyData.map((month) => (
                <tr
                  key={month.monthNumber}
                  className="hover:bg-muted/10 cursor-pointer transition-colors"
                  onClick={() => {
                    const monthTransactions = useReportsStore
                      .getState()
                      .getMonthTransactions(selectedYear, month.monthNumber);
                    console.log(
                      `${month.monthName}: ${monthTransactions.length} تراکنش`,
                      monthTransactions,
                    );
                  }}
                >
                  {/* ⬅️ ستون ۱: نام ماه + تعداد تراکنش */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold">
                        {month.monthNumber}
                      </div>
                      <div>
                        <div className="font-medium">{month.monthName}</div>
                        {month.transactionCount > 0 && (
                          <div className="text-muted-foreground flex items-center gap-1 text-xs">
                            <FileText className="h-3 w-3" />
                            {month.transactionCount} تراکنش
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* ⬅️ ستون ۲: مبلغ درآمد */}
                  <td className="px-4 py-3 text-green-600 dark:text-green-400">
                    {formatCurrency(month.income)}
                  </td>

                  {/* ⬅️ ستون ۳: مبلغ هزینه */}
                  <td className="px-4 py-3 text-red-600 dark:text-red-400">
                    {formatCurrency(month.expense)}
                  </td>

                  {/* ⬅️ ستون ۴: سود/زیان */}
                  <td
                    className={`px-4 py-3 font-semibold ${getProfitColor(month.profit)}`}
                  >
                    {formatCurrency(month.profit)}
                  </td>

                  {/* ⬅️ ستون ۵: درصد تغییر نسبت به ماه قبل */}
                  <td className="px-4 py-3">
                    {month.changePercent === 0 ? (
                      <div className="flex items-center gap-1">
                        <Minus className="text-muted-foreground h-3 w-3" />
                        <span className="text-muted-foreground text-sm">
                          0%
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        {month.changePercent > 0 ? (
                          <TrendingUp className="h-3 w-3 text-green-600" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-red-600" />
                        )}
                        <span
                          className={`text-sm font-medium ${getProfitColor(month.changePercent)}`}
                        >
                          {Math.abs(month.changePercent).toFixed(1)}%
                        </span>
                      </div>
                    )}
                  </td>

                  {/* ⬅️ ستون ۶: نمودار مقایسه‌ای درآمد/هزینه */}
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      {/* نوار درآمد */}
                      <div className="flex items-center gap-1">
                        <div
                          className="h-2 rounded-full bg-green-500 transition-all"
                          style={{
                            width:
                              maxIncome > 0
                                ? `${(month.income / maxIncome) * 80}px`
                                : "0px",
                          }}
                        />
                      </div>
                      {/* نوار هزینه */}
                      <div className="flex items-center gap-1">
                        <div
                          className="h-2 rounded-full bg-red-500 transition-all"
                          style={{
                            width:
                              maxExpense > 0
                                ? `${(month.expense / maxExpense) * 80}px`
                                : "0px",
                          }}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================
          📝 بخش راهنما
      ======================================== */}
      <div className="border-border text-muted-foreground flex items-center justify-center gap-6 rounded-lg border border-dashed p-3 text-xs">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-green-500" />
          <span>درآمد</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-red-500" />
          <span>هزینه</span>
        </div>
        <span>• برای مشاهدهٔ جزئیات، روی هر ماه کلیک کنید</span>
      </div>
    </div>
  );
}
