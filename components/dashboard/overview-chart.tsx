"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { overviewChartProps } from "@/types/overview-chart";

const data: overviewChartProps[] = [
  { name: "فروردین", income: 3200000, expense: 1800000 },
  { name: "اردیبهشت", income: 4100000, expense: 2300000 },
  { name: "خرداد", income: 3800000, expense: 2600000 },
  { name: "تیر", income: 4500000, expense: 2900000 },
  { name: "مرداد", income: 5200000, expense: 3100000 },
  { name: "شهریور", income: 4800000, expense: 3400000 },
];

// ✅ Custom Tooltip (اختیاری - برای نمایش بهتر)
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
    payload: {
      name: string;
      income: number;
      expense: number;
    };
  }>;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="border-border bg-card rounded-lg border p-3 shadow-lg">
        <p className="text-foreground mb-2 text-sm font-semibold">
          {payload[0].payload.name}
        </p>
        {payload.map((entry, index) => (
          <p key={index} className="text-xs" style={{ color: entry.color }}>
            {entry.name === "income" ? "درآمد" : "هزینه"}:{" "}
            <span className="font-bold">
              {entry.value.toLocaleString("fa-IR")} ت
            </span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

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
          <div className="flex items-center gap-2">
            <div className="bg-primary h-3 w-3 rounded-full" />
            <span className="text-muted-foreground text-sm font-medium">
              درآمد
            </span>
          </div>

          {/* هزینه */}
          <div className="flex items-center gap-2">
            <div className="bg-destructive h-3 w-3 rounded-full" />
            <span className="text-muted-foreground text-sm font-medium">
              هزینه
            </span>
          </div>
        </div>
      </div>

      {/* CHART */}
      <div className="h-80 w-full" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 0,
            }}
          >
            <defs>
              {/* Gradient برای درآمد */}
              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--chart-1)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--chart-1)"
                  stopOpacity={0.1}
                />
              </linearGradient>

              {/* Gradient برای هزینه */}
              <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--chart-4)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--chart-4)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
              opacity={0.3}
            />

            <XAxis
              dataKey="name"
              stroke="var(--muted-foreground)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              stroke="var(--muted-foreground)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
            />

            <Tooltip content={<CustomTooltip />} />

            {/* Area برای درآمد */}
            <Area
              type="monotone"
              dataKey="income"
              stroke="var(--chart-1)"
              fill="var(--chart-1)"
              activeDot={{ r: 6 }}
            />

            {/* Area برای هزینه */}
            <Area
              type="monotone"
              dataKey="expense"
              stroke="var(--chart-4)"
              fill="var(--chart-4)"
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
