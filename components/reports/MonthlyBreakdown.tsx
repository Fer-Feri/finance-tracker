// src/components/reports/MonthlyBreakdown.tsx
import { useState } from "react";
import { formatLargeNumber } from "@/utils/formatNumber";
import MonthDetailsModal from "./MonthDetailsModal";
import { useAllMonthsData } from "@/hooks/useAllMonthsData";

interface MonthlyBreakdownProps {
  year: number;
}

export default function MonthlyBreakdown({ year }: MonthlyBreakdownProps) {
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const {
    data: monthsData,
    isLoading,
    isFetching,
    error,
  } = useAllMonthsData(year);

  // ✅ نمایش لودینگ
  if (isLoading || isFetching) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-muted-foreground">در حال بارگذاری...</div>
      </div>
    );
  }

  // ✅ نمایش خطا
  if (error) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-destructive bg-destructive/10 rounded-lg p-4">
          خطا در دریافت داده‌ها
        </div>
      </div>
    );
  }

  // ✅ بررسی دقیق داده
  if (!monthsData) {
    console.warn("⚠️ monthsData is undefined/null");
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-muted-foreground">داده بارگذاری نشده</div>
      </div>
    );
  }

  if (monthsData.length === 0) {
    console.warn("⚠️ monthsData is empty array");
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-muted-foreground">
          داده‌ای برای سال {year} وجود ندارد
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted/50 border-b">
              <th className="p-3 text-right text-sm font-semibold">ماه</th>
              <th className="p-3 text-right text-sm font-semibold">درآمد</th>
              <th className="p-3 text-right text-sm font-semibold">هزینه</th>
              <th className="p-3 text-right text-sm font-semibold">سود/زیان</th>
              <th className="p-3 text-center text-sm font-semibold">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {monthsData.map((data) => (
              <MonthRow
                key={data.month}
                data={data}
                onShowDetails={() => setSelectedMonth(data.month)}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* مودال جزئیات */}
      {selectedMonth !== null && (
        <MonthDetailsModal
          year={year}
          month={selectedMonth}
          monthName={monthsData[selectedMonth - 1].monthName}
          onClose={() => setSelectedMonth(null)}
        />
      )}
    </>
  );
}

// ========== ردیف هر ماه ==========
interface MonthRowProps {
  data: {
    month: number;
    monthName: string;
    totalIncome: number;
    totalExpense: number;
    profit: number;
    transactionCount: number;
  };
  onShowDetails: () => void;
}

function MonthRow({ data, onShowDetails }: MonthRowProps) {
  const profitClass =
    data.profit >= 0
      ? "text-green-600 font-semibold"
      : "text-red-600 font-semibold";

  return (
    <tr className="hover:bg-muted/30 border-b transition-colors">
      <td className="p-3 font-medium">{data.monthName}</td>
      <td className="p-3 text-green-600">
        {formatLargeNumber(data.totalIncome)}
      </td>
      <td className="p-3 text-red-600">
        {formatLargeNumber(data.totalExpense)}
      </td>
      <td className={`p-3 ${profitClass}`}>{formatLargeNumber(data.profit)}</td>
      <td className="p-3 text-center">
        <button
          onClick={onShowDetails}
          disabled={data.transactionCount === 0}
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-3 py-1 text-xs disabled:cursor-not-allowed disabled:opacity-50"
        >
          {data.transactionCount > 0 ? "جزئیات" : "بدون تراکنش"}
        </button>
      </td>
    </tr>
  );
}
