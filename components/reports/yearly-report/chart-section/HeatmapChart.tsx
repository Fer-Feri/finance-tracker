"use client";

import moment from "jalali-moment";
import { useMemo, useState, useRef } from "react";
import ReactCalendarHeatmap, {
  ReactCalendarHeatmapValue,
} from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { useReportChartsStore } from "@/store/useReportChartsStore";

type HeatmapValue = ReactCalendarHeatmapValue<Date> & {
  count: number;
  total: number;
};

export default function HeatmapChart() {
  const { getExpenseHeatmap } = useReportChartsStore();

  const containerRef = useRef<HTMLDivElement>(null);

  const [tooltipData, setTooltipData] = useState<HeatmapValue | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

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

  // ===========================================
  // ===========================================
  // ===========================================
  return (
    <div className="bg-card rounded-lg border p-6">
      <h3 className="text-md mb-6 font-medium">نقشه حرارتی هزینه‌ها</h3>

      {/* 🔒 container نسبی */}
      <div
        ref={containerRef}
        className="relative max-w-full overflow-auto"
        dir="ltr"
      >
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
            onMouseOver={(event, value) => {
              if (!value || !containerRef.current) return;

              const rect = containerRef.current.getBoundingClientRect();

              setTooltipData(value as HeatmapValue);
              setTooltipPos({
                x: event.clientX - rect.left,
                y: event.clientY - rect.top,
              });
            }}
            onMouseLeave={() => setTooltipData(null)}
          />
        </div>

        {/* 💬 Tooltip */}
        {tooltipData && (
          <div
            className="bg-popover pointer-events-none absolute z-50 rounded-md border px-3 py-2 text-sm shadow-lg"
            style={{
              left: tooltipPos.x + 12,
              top: tooltipPos.y + 12,
            }}
          >
            <p className="font-medium">
              {moment(tooltipData.date).locale("fa").format("jYYYY/jMM/jDD")}
            </p>

            <p className="text-muted-foreground">
              تعداد: {tooltipData.count} تراکنش
            </p>

            <p className="text-destructive font-semibold">
              {tooltipData.total.toLocaleString("fa-IR")} تومان
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
