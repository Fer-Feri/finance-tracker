"use client";

import { overviewChartProps } from "@/types/overview-chart";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CustomTooltip } from "../ui/TooltipContent";
import { formatCurrency } from "@/lib/formatCurrency";

const data: overviewChartProps[] = [
  { name: "فروردین", income: 3200000, expense: 1800000 },
  { name: "اردیبهشت", income: 4100000, expense: 2300000 },
  { name: "خرداد", income: 3800000, expense: 2600000 },
  { name: "تیر", income: 4500000, expense: 2900000 },
  { name: "مرداد", income: 5200000, expense: 3100000 },
  { name: "شهریور", income: 4800000, expense: 3400000 },
];

export default function OverviewChart() {
  return (
    <div className="border-border bg-card hover:border-primary/40 mt-6 rounded-xl border p-5 shadow-sm transition-all duration-300">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold tracking-tight">
          نمودار کلی درآمد و هزینه
        </h2>

        <div className="flex items-center gap-3">
          {/* درآمد */}
          <span
            className="rounded-md px-3 py-1.5 text-sm font-medium"
            style={{
              backgroundColor: "var(--primary)",
              color: "var(--primary-foreground)",
            }}
          >
            درآمد
          </span>

          {/* هزینه */}
          <span
            className="rounded-md px-3 py-1.5 text-sm font-medium"
            style={{
              backgroundColor: "var(--destructive)",
              color: "var(--destructive-foreground)",
            }}
          >
            هزینه
          </span>
        </div>
      </div>

      {/* CHART */}
      <div className="h-80 w-full" dir="rtl">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 20, right: 15, left: 0, bottom: 0 }}
          >
            {/* خطوط پس‌زمینه کم‌رنگ */}
            <CartesianGrid
              stroke="rgba(255,255,255,0.08)"
              strokeDasharray="3 3"
              vertical={false}
            />

            {/* محور افقی */}
            <XAxis
              dataKey="name"
              tickMargin={10}
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              // axisLine={false}
              tickLine={false}
            />

            {/* محور عمودی */}
            <YAxis
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={formatCurrency}
            />

            {/* Tooltip سفارشی شیشه‌ای / نئونی */}
            {/* <Tooltip
              contentStyle={{
                background: "var(--chart-3)",
                backdropFilter: "blur(10px)",
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.1)",
                direction: "rtl",
                textAlign: "right",
              }}
              labelStyle={{ color: "var(--foreground)", fontWeight: 600 }}
              itemStyle={{ color: "var(--foreground)" }}
              formatter={(value: number) => [formatCurrency(value), "ت"]}
            /> */}
            <Tooltip
              cursor={{ fill: "hsl(var(--accent) / 0.2)" }} // افکت هاور روی ستون‌ها
              content={<CustomTooltip />}
            />

            {/* BAR درآمد — رنگ: primary */}
            <Bar
              dataKey="income"
              name="درآمد"
              barSize={26}
              radius={[6, 6, 6, 6]}
              fill="var(--chart-1)"
            />

            {/* LINE هزینه — destructive (قرمز نئونی) */}
            <Line
              type="monotone"
              dataKey="expense"
              name="هزینه"
              stroke="var(--chart-4)"
              strokeWidth={3}
              dot={{ r: 4, strokeWidth: 3, fill: "var(--chart-4)" }}
              activeDot={{ r: 6, stroke: "var(--chart-2)", strokeWidth: 2 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
