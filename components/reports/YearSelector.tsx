// src/components/reports/YearSelector.tsx
import { ChevronLeft, ChevronRight } from "lucide-react";

interface YearSelectorProps {
  selectedYear: number;
  onYearChange: (year: number) => void;
}

export default function YearSelector({
  selectedYear,
  onYearChange,
}: YearSelectorProps) {
  const currentJalaliYear = 1404; // می‌تونی از moment استفاده کنی
  const years = Array.from({ length: 10 }, (_, i) => currentJalaliYear - i);

  return (
    <div className="bg-card flex items-center justify-between rounded-xl border p-4">
      <div className="flex items-center gap-3">
        <span className="text-muted-foreground text-sm font-medium">
          انتخاب سال:
        </span>
        <select
          value={selectedYear}
          onChange={(e) => onYearChange(Number(e.target.value))}
          className="bg-background focus:ring-primary rounded-lg border px-4 py-2 text-sm font-semibold focus:ring-2 focus:outline-none"
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onYearChange(selectedYear - 1)}
          className="hover:bg-muted rounded-lg border p-2 transition-colors"
          aria-label="سال قبل"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
        <button
          onClick={() => onYearChange(selectedYear + 1)}
          disabled={selectedYear >= currentJalaliYear}
          className="hover:bg-muted rounded-lg border p-2 transition-colors disabled:opacity-50"
          aria-label="سال بعد"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
