"use client";

import { CardDashboardItems } from "@/config/card-dashboard";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";
import { formatLargeNumber } from "@/utils/formatNumber";
import { Category, Transaction } from "@prisma/client";
import { useDashboardStats } from "@/hooks/useDashboardStats";

type Props = {
  transactions: (Transaction & { category: Category })[];
};
// ✅ Variant mapping: Clean & DRY
const variantStyles = {
  primary: {
    badge: "border-primary/20 bg-primary/5 text-primary",
    badgeHover:
      "group-hover:border-primary/40 group-hover:bg-primary/10 group-hover:shadow-[0_0_15px_hsl(var(--primary)/0.2)]",
    icon: "text-primary",
    iconBg: "border-primary/20 bg-primary/5",
    line: "bg-primary/60",
  },
  secondary: {
    badge: "border-secondary/20 bg-secondary/5 text-secondary",
    badgeHover:
      "group-hover:border-secondary/40 group-hover:bg-secondary/10 group-hover:shadow-[0_0_15px_hsl(var(--secondary)/0.2)]",
    icon: "text-emerald-500",
    iconBg: "border-secondary/20 bg-secondary/5",
    line: "bg-secondary/60",
  },
  destructive: {
    badge: "border-destructive/20 bg-destructive/5 text-destructive",
    badgeHover:
      "group-hover:border-destructive/40 group-hover:bg-destructive/10 group-hover:shadow-[0_0_15px_hsl(var(--destructive)/0.2)]",
    icon: "text-destructive",
    iconBg: "border-destructive/20 bg-destructive/5",
    line: "bg-destructive/60",
  },
  teal: {
    badge: "border-teal-400/40 bg-teal-400/15 text-teal-500 dark:text-teal-400",
    badgeHover:
      "group-hover:border-teal-400/60 group-hover:bg-teal-400/20 group-hover:shadow-[0_0_18px_rgba(20,184,166,0.35)]",
    icon: "text-teal-500 dark:text-teal-400",
    iconBg: "border-teal-400/40 bg-teal-400/15",
    line: "bg-teal-300",
  },
} as const;

export default function StatsGrid({ transactions }: Props) {
  const {
    thisMonthIncome,
    thisMonthExpense,
    thisMonthSavings,
    savingsPercentage,
    thisYearTotalBalance,
    getChangePercentage,
  } = useDashboardStats(transactions);

  const getCardValue = (id: string) => {
    switch (id) {
      case "total-balance":
        return thisYearTotalBalance;
      case "monthly-income":
        return thisMonthIncome;
      case "monthly-expense":
        return thisMonthExpense;
      case "savings":
        return thisMonthSavings;
      default:
        return 0;
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {CardDashboardItems.map((item, index) => {
        const styles = variantStyles[item.variant];
        const value = getCardValue(item.id);
        const changePercentage = getChangePercentage(item.id);
        const isPositive = changePercentage !== null && changePercentage >= 0;

        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            className="group border-border bg-card hover:border-primary/50 relative overflow-hidden rounded-xl border shadow-sm transition-all duration-300 hover:shadow-[0_8px_30px_hsl(var(--primary)/0.15)]"
          >
            {/* Glow Effect */}
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="bg-primary/5 absolute inset-0" />
            </div>

            {/* Card Content */}
            <div className="relative p-6">
              {/* Header */}
              <div className="mb-9 flex items-center justify-between gap-3">
                {/* Title Badge */}
                <p
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-xs font-bold tracking-wider uppercase transition-all duration-300",
                    styles.badge,
                    styles.badgeHover,
                  )}
                >
                  {item.title}
                </p>

                {/* Icon */}
                <div
                  className={cn(
                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110",
                    styles.iconBg,
                  )}
                >
                  <item.icon className={cn("h-6 w-6", styles.icon)} />
                </div>
              </div>

              {/* Value */}
              <div className="mb-4 space-y-2">
                <h3 className="text-foreground text-3xl font-bold tracking-tight">
                  {formatLargeNumber(value)} ت
                </h3>

                {/* نمایش درصد پس‌انداز -  */}
                {item.id === "savings" && (
                  <div className="border-secondary/30 bg-secondary/10 text-secondary inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold">
                    <span className="text-secondary/70">از درآمد ماه:</span>
                    <span>{savingsPercentage}٪</span>
                  </div>
                )}
              </div>

              {/* Change Badge */}
              {changePercentage !== null && (
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold transition-all",
                      isPositive
                        ? "bg-emerald-500/10 text-emerald-500"
                        : "bg-red-500/10 text-red-500",
                    )}
                  >
                    {isPositive ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    <span>{changePercentage}%</span>
                  </div>
                  <span className="text-muted-foreground text-xs">
                    {item.id === "total-balance"
                      ? " نسبت به سال قبل"
                      : " نسبت به ماه قبل"}
                  </span>
                </div>
              )}
            </div>

            {/* Bottom Line Animation */}
            <div
              className={cn(
                "absolute bottom-0 left-0 h-1 w-0 transition-all duration-500 group-hover:w-full",
                styles.line,
              )}
            />
          </motion.div>
        );
      })}
    </div>
  );
}
