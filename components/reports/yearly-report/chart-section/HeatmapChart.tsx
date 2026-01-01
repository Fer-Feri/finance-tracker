"use client";

import moment from "jalali-moment";
import { useMemo, useState } from "react";
import ReactCalendarHeatmap, {
  ReactCalendarHeatmapValue,
} from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { Calendar, TrendingDown, Hash } from "lucide-react";
import { useExpenseCharts } from "@/hooks/useExpenseCharts";

type HeatmapValue = ReactCalendarHeatmapValue<Date> & {
  count: number;
  total: number;
};

interface HeatmapChartProps {
  year: number;
}

export default function HeatmapChart({ year }: HeatmapChartProps) {
  const { heatmapData } = useExpenseCharts(year);
  const [selectedData, setSelectedData] = useState<HeatmapValue | null>(null);

  // ✅ تاریخ شروع و پایان ثابت برای سال
  const startDate = useMemo(() => {
    return moment(`${year}/01/01`, "jYYYY/jMM/jDD").toDate();
  }, [year]);

  const endDate = useMemo(() => {
    return moment(`${year}/12/29`, "jYYYY/jMM/jDD").toDate();
  }, [year]);

  const maxAmount = useMemo(
    () => Math.max(...heatmapData.map((d) => d.total), 1),
    [heatmapData],
  );

  const getColorClass = (
    value: ReactCalendarHeatmapValue<Date> | undefined,
  ) => {
    if (!value) return "color-empty";

    const v = value as HeatmapValue;
    const p = (v.total / maxAmount) * 100;

    if (p >= 85) return "color-scale-7";
    if (p >= 70) return "color-scale-6";
    if (p >= 55) return "color-scale-5";
    if (p >= 40) return "color-scale-4";
    if (p >= 25) return "color-scale-3";
    if (p >= 10) return "color-scale-2";
    return "color-scale-1";
  };

  const handleClick = (value: ReactCalendarHeatmapValue<Date> | undefined) => {
    if (!value) {
      setSelectedData(null);
      return;
    }
    setSelectedData(value as HeatmapValue);
  };

  return (
    <div className="bg-card rounded-lg border p-6">
      <h3 className="text-md mb-4 font-medium">
        نقشه حرارتی هزینه‌ها - سال {year}
      </h3>

      <div className="bg-muted/50 mb-6 rounded-lg border p-4">
        {selectedData ? (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="flex items-center gap-2">
              <Calendar className="text-muted-foreground h-4 w-4" />
              <div>
                <p className="text-muted-foreground text-xs">تاریخ</p>
                <p className="font-medium">
                  {moment(selectedData.date)
                    .locale("fa")
                    .format("jYYYY/jMM/jDD")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Hash className="text-muted-foreground h-4 w-4" />
              <div>
                <p className="text-muted-foreground text-xs">تعداد تراکنش</p>
                <p className="font-medium">
                  {selectedData.count.toLocaleString("fa-IR")} مورد
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <TrendingDown className="text-destructive h-4 w-4" />
              <div>
                <p className="text-muted-foreground text-xs">مجموع هزینه</p>
                <p className="text-destructive font-semibold">
                  {selectedData.total.toLocaleString("fa-IR")} تومان
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-2 text-center">
            <p className="text-muted-foreground text-sm">
              💡 روی هر مربع رنگی کلیک کنید تا جزئیات تراکنش‌ها را ببینید
            </p>
          </div>
        )}
      </div>

      <div className="relative max-w-full overflow-auto" dir="ltr">
        <div className="min-w-[1000px] md:min-w-[1500px]">
          <ReactCalendarHeatmap
            startDate={startDate}
            endDate={endDate}
            values={heatmapData}
            classForValue={getColorClass}
            showWeekdayLabels
            monthLabels={[
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
            ]}
            weekdayLabels={["ش", "ی", "د", "س", "چ", "پ", "ج"]}
            onClick={handleClick}
          />
        </div>
      </div>
    </div>
  );
}
