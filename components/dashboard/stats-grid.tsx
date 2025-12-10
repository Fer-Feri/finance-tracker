"use client";

import { CardDashboardItems } from "@/config/card-dashboard";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";

export default function StatsGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {CardDashboardItems.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.3 }}
          className="group border-border bg-card hover:border-primary/50 relative overflow-hidden rounded-xl border shadow-sm transition-all duration-300 hover:shadow-[0_8px_30px_rgba(var(--primary-rgb),0.15)]"
        >
          {/* Glow Effect در Hover */}
          <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="bg-primary/5 absolute inset-0" />
          </div>

          {/* Card Content */}
          <div className="relative p-6">
            {/* Header */}
            <div className="mb-9 flex items-center justify-between gap-3">
              {/* Title glow effect */}
              <div className="relative">
                <p
                  className={cn(
                    "relative rounded-lg border px-3 py-1.5 text-xs font-bold tracking-wider uppercase transition-all duration-300",

                    item.isPositive
                      ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400"
                      : "border-destructive/20 bg-destructive/5 text-destructive",
                    // Hover Effect
                    "group-hover:border-primary/40 group-hover:bg-primary/10 group-hover:text-primary group-hover:shadow-[0_0_15px_rgba(var(--primary-rgb),0.2)]",
                  )}
                >
                  {item.title}
                </p>
              </div>

              {/* Icon */}
              <div
                className={cn(
                  "relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110",
                  item.bgColor,
                )}
              >
                {item.icon && (
                  <item.icon
                    className={cn("h-6 w-6 transition-all", item.iconColor)}
                  />
                )}
              </div>
            </div>

            {/* Body Content */}
            <div className="mb-4 space-y-2">
              <h3 className="text-foreground text-3xl font-bold tracking-tight">
                {item.value}
              </h3>
            </div>

            {/* Badge */}
            {item.change && (
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold transition-all",
                    item.isPositive
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "bg-destructive/10 text-destructive",
                  )}
                >
                  {item.isPositive ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  <span>{item.change}</span>
                </div>
                <span className="text-muted-foreground text-xs">
                  نسبت به ماه قبل
                </span>
              </div>
            )}
          </div>

          {/* خط انیمیشن‌دار پایین کارت */}
          <div
            className={cn(
              "absolute bottom-0 left-0 h-1 w-0 transition-all duration-500 group-hover:w-full",
              item.isPositive ? "bg-emerald-500" : "bg-destructive",
            )}
          />
        </motion.div>
      ))}
    </div>
  );
}
