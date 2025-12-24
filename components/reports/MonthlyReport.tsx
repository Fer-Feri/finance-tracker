"use client";

import { useState } from "react";
import moment from "jalali-moment";
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
import MonthDetailModal from "./MonthDetailModal";
import { formatLargeNumber } from "@/utils/formatNumber";

// ============================================================
// CONSTANTS
// ============================================================
const JALALI_MONTHS = [
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

// ============================================================
// TYPES
// ============================================================
interface SummaryCardProps {
  title: string;
  icon: React.ReactNode;
  value: number;
  colorClass: string;
}

interface MonthDetails {
  year: number;
  month: number;
  monthName: string;
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function MonthlyReport() {
  // ============================================================
  // STATE
  // ============================================================
  const thisYear = moment().locale("fa").jYear();
  const [selectedYear, setSelectedYear] = useState<number>(thisYear);
  const [selectedMonthDetails, setSelectedMonthDetails] =
    useState<MonthDetails | null>(null);

  // Year navigation bounds
  const CURRENT_YEAR = thisYear;
  const MIN_YEAR = CURRENT_YEAR - 1;

  // ============================================================
  // HOOKS: Fetch report data
  // ============================================================
  const yearData = useMonthlyReportData(selectedYear);
  const monthData = useMonthlyBreakdown(selectedYear);

  // ============================================================
  // HANDLERS
  // ============================================================
  const handleYearPrev = () => setSelectedYear((y) => y - 1);
  const handleYearNext = () => setSelectedYear((y) => y + 1);

  const handleMonthClick = (month: { id: number; name: string }) => {
    const data = monthData[month.id - 1];
    if (data.monthTransactionCount > 0) {
      setSelectedMonthDetails({
        year: selectedYear,
        month: month.id,
        monthName: month.name,
      });
    }
  };

  const handleCloseModal = () => setSelectedMonthDetails(null);

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="space-y-6">
      {/* ========================================
          Header: Year Selector
      ======================================== */}
      <div className="flex items-center justify-between">
        {/* Title & Transaction Count */}
        <div className="flex-col items-center space-y-1">
          <Calendar className="text-primary h-5 w-5" />
          <h2 className="text-xs font-bold md:text-xl">
            گزارش ماهانه سال {selectedYear}
          </h2>
          <span className="text-muted-foreground text-xs md:text-sm">
            ({yearData.transactionCount} تراکنش)
          </span>
        </div>

        {/* Year Navigation Controls */}
        <div className="flex items-center gap-2 md:gap-6">
          <button
            onClick={handleYearPrev}
            disabled={selectedYear <= MIN_YEAR}
            className="border-border bg-background hover:bg-muted rounded-lg border p-2 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          <span className="text-sm font-medium tabular-nums">
            {selectedYear}
          </span>

          <button
            onClick={handleYearNext}
            disabled={selectedYear === CURRENT_YEAR}
            className="border-border bg-background hover:bg-muted rounded-lg border p-2 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ========================================
          Summary Cards: Year Statistics
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
          Table: Monthly Breakdown
      ======================================== */}
      <div className="border-border no-scrollbar overflow-auto rounded-xl border">
        <table className="w-full">
          {/* Table Header */}
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

          {/* Table Body */}
          <tbody className="divide-border divide-y">
            {JALALI_MONTHS.map((month) => {
              const data = monthData[month.id - 1];
              const hasTransactions = data.monthTransactionCount > 0;
              const maxAmount = Math.max(data.monthIncome, data.monthExpense);

              return (
                <tr
                  key={month.id}
                  onClick={() => handleMonthClick(month)}
                  className={cn(
                    "transition-colors",
                    hasTransactions
                      ? "hover:bg-muted/30 cursor-pointer"
                      : "cursor-not-allowed opacity-50",
                  )}
                >
                  {/* Column: Month Name & Transaction Count */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="bg-primary/10 text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold">
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

                  {/* Column: Income */}
                  <td className="px-4 py-3 text-green-600 tabular-nums">
                    {data.monthIncome > 0
                      ? data.monthIncome.toLocaleString("fa-IR")
                      : "—"}
                  </td>

                  {/* Column: Expense */}
                  <td className="px-4 py-3 text-red-400 tabular-nums">
                    {data.monthExpense > 0
                      ? data.monthExpense.toLocaleString("fa-IR")
                      : "—"}
                  </td>

                  {/* Column: Profit/Loss */}
                  <td
                    className={cn(
                      "px-4 py-3 font-semibold tabular-nums",
                      data.monthProfit > 0 && "text-green-600",
                      data.monthProfit < 0 && "text-red-600",
                      data.monthProfit === 0 && "text-muted-foreground",
                    )}
                  >
                    {hasTransactions
                      ? data.monthProfit.toLocaleString("fa-IR")
                      : "—"}
                  </td>

                  {/* Column: Change Percentage */}
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
                          className={cn(
                            "text-sm tabular-nums",
                            data.monthProfit > 0 && "text-green-600",
                            data.monthProfit < 0 && "text-red-600",
                            data.monthProfit === 0 && "text-muted-foreground",
                          )}
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

                  {/* Column: Mini Chart */}
                  <td className="px-4 py-3">
                    {hasTransactions ? (
                      <div className="flex flex-col gap-1">
                        {/* Income Bar */}
                        <div
                          className="h-2 rounded-full bg-green-500"
                          style={{
                            width: `${Math.min((data.monthIncome / maxAmount) * 60, 60)}px`,
                          }}
                        />
                        {/* Expense Bar */}
                        <div
                          className="h-2 rounded-full bg-red-500"
                          style={{
                            width: `${Math.min((data.monthExpense / maxAmount) * 60, 60)}px`,
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
          Legend: Chart Explanation
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

      {/* ========================================
          Modal: Month Details
      ======================================== */}
      {selectedMonthDetails && (
        <MonthDetailModal
          year={selectedMonthDetails.year}
          month={selectedMonthDetails.month}
          monthName={selectedMonthDetails.monthName}
          isOpen={!!selectedMonthDetails}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

// ============================================================
// SUB COMPONENT: Summary Card
// ============================================================
function SummaryCard({ title, icon, value, colorClass }: SummaryCardProps) {
  return (
    <div className={cn("border-border rounded-xl border p-4", colorClass)}>
      {/* Header */}
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium">{title}</span>
        {icon}
      </div>
      {/* Value */}
      <p className="text-2xl font-bold tabular-nums">
        {formatLargeNumber(value)}
      </p>
      <p className="mt-1 text-xs">تومان</p>
    </div>
  );
}
