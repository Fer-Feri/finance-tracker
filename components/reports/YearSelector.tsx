// src/components/reports/YearSelector.tsx
import { ChevronLeft, ChevronRight } from "lucide-react";

interface YearSelectorProps {
  selectedYear: number;
  onYearChange: (year: number) => void;
  isloading: boolean;
  lastYear: number;
  oldestYear: number;
  hasyears: boolean;
  yearTransactionCount: number;
}

export default function YearSelector({
  selectedYear,
  onYearChange,
  isloading,
  lastYear,
  oldestYear,
  yearTransactionCount,
}: YearSelectorProps) {
  return (
    <div className="bg-card flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4">
      <div className="flex items-center gap-6">
        <span className="text-muted-foreground text-sm font-medium">
          انتخاب سال:
        </span>
        <div className="flex items-center gap-2">
          {/* دکمه سال قبل (قدیمی‌تر) */}
          <button
            disabled={selectedYear <= oldestYear || isloading}
            onClick={() => onYearChange(selectedYear - 1)}
            className="hover:bg-muted rounded-lg border p-2 transition-colors disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="سال قبل"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          {/* نمایش سال */}
          <span className="text-center font-bold">
            {isloading ? "..." : selectedYear}
          </span>
          <button
            onClick={() => onYearChange(selectedYear + 1)}
            disabled={selectedYear >= lastYear || isloading}
            className="hover:bg-muted rounded-lg border p-2 transition-colors disabled:opacity-30"
            aria-label="سال بعد"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>
      </div>
      <span className="text-muted-foreground text-xs">
        تعداد تراکنش ({yearTransactionCount})
      </span>
    </div>
  );
}
