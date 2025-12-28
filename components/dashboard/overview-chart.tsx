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

import { useMemo } from "react";
import moment from "jalali-moment";
import { Category, Transaction } from "@prisma/client";

type Props = {
  transactions: (Transaction & { category: Category })[];
};

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

export default function OverviewChart({ transactions }: Props) {
  const currentMonth = moment().jMonth() + 1;
  const currentYear = moment().jYear();

  // =========================================================
  // ==========>>>>>>>>>=====💹اطلاعات چارت 6 ماه گذشته=💹=======<<<<<<<<<============
  // =========================================================
  const dataSixMonth = useMemo(() => {
    const monthData = [];

    for (let i = 5; i >= 0; i--) {
      let targetMonth = currentMonth - i;
      let targetYear = currentYear;

      while (targetMonth <= 0) {
        targetMonth += 12;
        targetYear -= 1;
      }

      const monthTransactions = transactions.filter((transaction) => {
        const date = moment(transaction.date);
        return date.jYear() === targetYear && date.jMonth() + 1 === targetMonth;
      });

      const income = monthTransactions
        .filter((t) => t.type === "INCOME")
        .reduce((sum, t) => sum + t.amount, 0);

      const expense = monthTransactions
        .filter((t) => t.type === "EXPENSE")
        .reduce((sum, t) => sum + t.amount, 0);

      monthData.push({
        name: moment()
          .jYear(targetYear)
          .jMonth(targetMonth - 1)
          .locale("fa")
          .format("jMMMM"),
        income,
        expense,
        year: targetYear,
        month: targetMonth,
      });
    }
    return monthData;
  }, [transactions, currentMonth, currentYear]);

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
            data={dataSixMonth}
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
