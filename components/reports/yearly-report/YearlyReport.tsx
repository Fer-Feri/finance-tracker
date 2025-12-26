// components/YearlyReport.tsx
"use client";

import { useEffect } from "react";
import { Calendar } from "lucide-react";
import moment from "jalali-moment";
import { useGetAvailableYears } from "@/utils/yearlyReportHelpers";
import YearlyStatsCards from "./YearlyStatsCards";
import { useYearlyReportStore } from "@/store/useYearlyReportStore";
import YearComparisonChart from "./YearComparisonChart";

export default function YearlyReport() {
  const availableYears = useGetAvailableYears();
  const { selectedYear, setSelectedYear } = useYearlyReportStore();
  const thisYear = moment().locale("fa").jYear();

  // Set initial year
  useEffect(() => {
    if (availableYears[0]) {
      setSelectedYear(availableYears[0]);
    }
  }, [availableYears, setSelectedYear]);

  const displayYears = availableYears.slice(0, 2);

  if (selectedYear < thisYear - 1) return null;

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white">
            <Calendar className="text-primary h-7 w-7" />
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

      {/* ✅ کامپوننت‌های جدا شده */}
      <YearlyStatsCards />
      <YearComparisonChart />
    </div>
  );
}
