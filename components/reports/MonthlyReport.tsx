"use client";

import { useState } from "react";
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
import { cn } from "@/lib/utils";
import { useMonthlyReportData } from "@/hooks/useMonthlyReportData";
import { useMonthlyBreakdown } from "@/hooks/useMonthlyBreakdown";

// ====================================================================
// 📊 MonthlyReport – UI ONLY
// ====================================================================

export default function MonthlyReport() {
  // ✅ فقط state مربوط به دکمه‌های سال
  const [selectedYear, setSelectedYear] = useState<number>(1404);

  const CURRENT_YEAR = 1404;
  const MIN_YEAR = CURRENT_YEAR - 1;

  // 🧪 داده‌ی نمایشی (Mock)
  const months = [
    { id: 1, name: "فروردین" },
    { id: 2, name: "اردیبهشت" },
    { id: 3, name: "خرداد" },
    { id: 4, name: "تیر" },
    { id: 5, name: "مرداد" },
    { id: 6, name: "شهریور" },
    { id: 7, name: "مهر" },
    { id: 8, name: "آبان" },
    { id: 9, name: "آذر" },
    { id: 10, name: "دی" },
    { id: 11, name: "بهمن" },
    { id: 12, name: "اسفند" },
  ];

  const yearData = useMonthlyReportData(selectedYear);
  const monthData = useMonthlyBreakdown(selectedYear);

  return (
    <div className="space-y-6">
      {/* ========================================
          🎯 Header – Year Selector
      ======================================== */}
      <div className="flex items-center justify-between">
        <div className="flex-col items-center space-y-1">
          <Calendar className="text-primary h-5 w-5" />
          <h2 className="text-xs font-bold md:text-xl">
            گزارش ماهانه سال {selectedYear}
          </h2>
          <span className="text-muted-foreground text-xs md:text-sm">
            ({yearData.transactionCount} تراکنش)
          </span>
        </div>

        <div className="flex items-center gap-2 md:gap-6">
          <button
            onClick={() => setSelectedYear((y) => y - 1)}
            disabled={selectedYear <= MIN_YEAR}
            className="border-border bg-background hover:bg-muted rounded-lg border p-2"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          <span className="text-sm font-medium">{selectedYear}</span>

          <button
            onClick={() => setSelectedYear((y) => y + 1)}
            disabled={selectedYear === CURRENT_YEAR}
            className="border-border bg-background hover:bg-muted rounded-lg border p-2"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ========================================
          💳 Summary Cards (UI)
      ======================================== */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="کل درآمد"
          value={yearData.totalIncome}
          icon={<TrendingUp className="h-5 w-5 text-green-600" />}
          colorClass="bg-primary/10 text-primary"
        />
        <SummaryCard
          title="کل هزینه"
          value={yearData.totalExpense}
          icon={<TrendingDown className="h-5 w-5 text-red-600" />}
          colorClass="bg-destructive/20 text-destructive"
        />
        <SummaryCard
          title="سود / زیان"
          value={yearData.profit}
          icon={<DollarSign className="h-5 w-5 text-orange-400" />}
          colorClass="bg-accent/20 text-yellow-600"
        />
        <SummaryCard
          title="میانگین سود ماهانه"
          value={yearData.avgMonthlyProfit}
          icon={<Calendar className="h-5 w-5 text-emerald-500" />}
          colorClass="bg-secondary/5 text-secondary"
        />
      </div>

      {/* ========================================
          📊 Table (UI)
      ======================================== */}
      <div className="border-border overflow-auto rounded-xl border">
        <table className="w-full">
          <thead className="bg-muted/50">
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

          <tbody className="divide-border divide-y">
            {months.map((month) => {
              const data = monthData[month.id - 1];
              return (
                <tr
                  key={month.id}
                  className="hover:bg-muted/10 transition-colors"
                >
                  {/* ستون ماه */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold">
                        {month.id}
                      </div>
                      <div>
                        <div className="font-medium">{month.name}</div>
                        <div className="text-muted-foreground flex items-center gap-1 text-xs">
                          <FileText className="h-3 w-3" />
                          {data.monthTransactionCount} تراکنش
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* ستون درآمد */}
                  <td className="px-4 py-3 text-green-600 tabular-nums">
                    {data.monthIncome > 0
                      ? data.monthIncome.toLocaleString("fa-IR")
                      : "—"}
                  </td>

                  {/* ستون هزینه */}
                  <td className="px-4 py-3 text-red-400 tabular-nums">
                    {data.monthExpense > 0
                      ? data.monthExpense.toLocaleString("fa-IR")
                      : "—"}
                  </td>

                  {/* ستون سود/زیان */}
                  <td
                    className={`px-4 py-3 font-semibold tabular-nums ${
                      data.monthProfit > 0
                        ? "text-green-600"
                        : data.monthProfit < 0
                          ? "text-red-600"
                          : "text-muted-foreground"
                    }`}
                  >
                    {data.monthTransactionCount > 0
                      ? data.monthProfit.toLocaleString("fa-IR")
                      : "—"}
                  </td>

                  {/* ستون نرخ سود */}
                  <td className="px-4 py-3">
                    {data.monthIncome > 0 ? (
                      <div className="flex items-center gap-1">
                        {data.monthProfit > 0 ? (
                          <TrendingUp className="h-3 w-3 text-green-600" />
                        ) : data.monthProfit < 0 ? (
                          <TrendingDown className="h-3 w-3 text-red-600" />
                        ) : (
                          <Minus className="text-muted-foreground h-3 w-3" />
                        )}
                        <span
                          className={`text-sm tabular-nums ${
                            data.monthProfit > 0
                              ? "text-green-600"
                              : data.monthProfit < 0
                                ? "text-red-600"
                                : "text-muted-foreground"
                          }`}
                        >
                          {data.monthProfitPercent}%
                        </span>
                      </div>
                    ) : (
                      <div className="text-muted-foreground flex items-center gap-1">
                        <Minus className="h-3 w-3" />
                        <span className="text-sm">—</span>
                      </div>
                    )}
                  </td>

                  {/* ستون نمودار */}
                  <td className="px-4 py-3">
                    {data.monthTransactionCount > 0 ? (
                      <div className="flex flex-col gap-1">
                        <div
                          className="h-2 rounded-full bg-green-500"
                          style={{
                            width: `${Math.min((data.monthIncome / Math.max(data.monthIncome, data.monthExpense)) * 60, 60)}px`,
                          }}
                        />
                        <div
                          className="h-2 rounded-full bg-red-500"
                          style={{
                            width: `${Math.min((data.monthExpense / Math.max(data.monthIncome, data.monthExpense)) * 60, 60)}px`,
                          }}
                        />
                      </div>
                    ) : (
                      <div className="text-muted-foreground text-xs">—</div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ========================================
          📝 Legend
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

/* ------------------------------------------------------------------ */
/* 🧩 UI Helper Components */
/* ------------------------------------------------------------------ */

function SummaryCard({
  title,
  icon,
  value,
  colorClass,
}: {
  title: string;
  icon: React.ReactNode;
  value: number;
  colorClass: string;
}) {
  return (
    <div className={cn("border-border rounded-xl border p-4", colorClass)}>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium">{title}</span>
        {icon}
      </div>
      <p className="text-2xl font-bold">{value.toLocaleString("fa-IR")}</p>
      <p className="mt-1 text-xs">تومان</p>
    </div>
  );
}
