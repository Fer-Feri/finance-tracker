"use client";

import moment from "jalali-moment";
import { useMemo, useState } from "react";
import ReactCalendarHeatmap, {
  ReactCalendarHeatmapValue,
} from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { useReportChartsStore } from "@/store/useReportChartsStore";
import { Calendar, TrendingDown, Hash } from "lucide-react";

type HeatmapValue = ReactCalendarHeatmapValue<Date> & {
  count: number;
  total: number;
};

export default function HeatmapChart() {
  const { getExpenseHeatmap } = useReportChartsStore();

  const [selectedData, setSelectedData] = useState<HeatmapValue | null>(null);

  // ================================================================

  const heatmapData = useMemo<HeatmapValue[]>(() => {
    return getExpenseHeatmap().map((item) => ({
      date: moment(item.date, "jYYYY/jMM/jDD").toDate(),
      count: item.count,
      total: item.total,
    }));
  }, [getExpenseHeatmap]);

  const startDate = useMemo(() => {
    if (!heatmapData.length) return new Date();
    return moment(heatmapData[0].date).startOf("day").toDate();
  }, [heatmapData]);

  const endDate = useMemo(() => {
    if (!heatmapData.length) return new Date();
    return moment(heatmapData[heatmapData.length - 1].date)
      .endOf("day")
      .toDate();
  }, [heatmapData]);

  // ================================================================

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

  // 🎯 کلیک روی مربع
  const handleClick = (value: ReactCalendarHeatmapValue<Date> | undefined) => {
    if (!value) {
      setSelectedData(null);
      return;
    }
    setSelectedData(value as HeatmapValue);
  };

  // ===========================================
  return (
    <div className="bg-card rounded-lg border p-6">
      <h3 className="text-md mb-4 font-medium">نقشه حرارتی هزینه‌ها</h3>

      {/* 📊 باکس اطلاعات */}
      <div className="bg-muted/50 mb-6 rounded-lg border p-4">
        {selectedData ? (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {/* تاریخ */}
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

            {/* تعداد تراکنش */}
            <div className="flex items-center gap-2">
              <Hash className="text-muted-foreground h-4 w-4" />
              <div>
                <p className="text-muted-foreground text-xs">تعداد تراکنش</p>
                <p className="font-medium">
                  {selectedData.count.toLocaleString("fa-IR")} مورد
                </p>
              </div>
            </div>

            {/* مجموع هزینه */}
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

      {/* 🗓️ Heatmap */}
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
