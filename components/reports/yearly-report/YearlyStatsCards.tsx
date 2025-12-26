// components/YearlyStatsCards.tsx
"use client";

import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { formatLargeNumber } from "@/utils/formatNumber";
import { useYearlyReportStore } from "@/store/useYearlyReportStore";

export default function YearlyStatsCards() {
  const getYearComparison = useYearlyReportStore((s) => s.getYearComparison);
  const comparison = getYearComparison();

  const {
    current,
    incomeChange,
    expenseChange,
    profitChange,
    avgMonthlyChange,
  } = comparison;

  // محاسبه میانگین ماهانه
  const avgMonthly = current.income / 12;

  // آرایه کارت‌ها
  const cards = [
    {
      title: "کل درآمد سال",
      current: current.income,
      change: incomeChange,
      icon: TrendingUp,
      bgClass: "bg-chart-2/5",
      iconBg: "bg-chart-2/10",
      iconColor: "text-chart-2",
      accentColor: "text-chart-2",
    },
    {
      title: "کل هزینه سال",
      current: current.expense,
      change: expenseChange,
      icon: TrendingDown,
      bgClass: "bg-destructive/5",
      iconBg: "bg-destructive/10",
      iconColor: "text-destructive",
      accentColor: "text-destructive",
    },
    {
      title: "سود خالص",
      current: current.profit,
      change: profitChange,
      icon: DollarSign,
      bgClass: "bg-primary/5",
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      accentColor: "text-primary",
    },
    {
      title: "میانگین ماهانه",
      current: avgMonthly,
      change: avgMonthlyChange,
      icon: Activity,
      bgClass: "bg-accent/5",
      iconBg: "bg-accent/50",
      iconColor: "text-orange-500",
      accentColor: "text-orange-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {cards.map(
        (
          {
            title,
            current,
            change,
            icon: Icon,
            bgClass,
            iconBg,
            iconColor,
            accentColor,
          },
          index,
        ) => {
          const isPositive = change ? change.change >= 0 : true;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`border-border rounded-xl border ${bgClass} p-6`}
            >
              {/* Header */}
              <div className="mb-4 flex items-center justify-between">
                <div className={`rounded-lg p-3 ${iconBg}`}>
                  <Icon className={`h-6 w-6 ${iconColor}`} />
                </div>

                {change && (
                  <div
                    className={`flex items-center gap-1 text-sm font-medium ${accentColor}`}
                  >
                    {isPositive ? (
                      <ArrowUpRight className="h-4 w-4" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4" />
                    )}
                    {Math.abs(change.changePercent).toFixed(1)}%
                  </div>
                )}
              </div>

              {/* عنوان */}
              <h3 className="text-muted-foreground mb-2 text-sm">{title}</h3>

              {/* مقدار فعلی */}
              <p className="text-foreground mb-3 text-2xl font-bold">
                {formatLargeNumber(current)}
                {/* <span className="text-muted-foreground text-base font-normal">
                  تومان
                </span> */}
              </p>

              {/* مقایسه */}
              {change ? (
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="text-muted-foreground text-xs">
                    نسبت به سال قبل:
                  </span>
                  <span className={`font-medium ${accentColor}`}>
                    {change.change.toLocaleString("fa-IR")}
                    {isPositive ? "+" : ""}
                  </span>
                </div>
              ) : (
                <p className="text-muted-foreground text-xs">
                  اولین سال ثبت شده
                </p>
              )}
            </motion.div>
          );
        },
      )}
    </div>
  );
}
