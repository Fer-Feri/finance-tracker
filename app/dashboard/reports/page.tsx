"use client";

import ChartsView from "@/components/reports/ChartsView";
import MonthlyReport from "@/components/reports/MonthlyReport";
import YearlyReport from "@/components/reports/yearly-report/YearlyReport";
import { Calendar, TrendingUp, BarChart3 } from "lucide-react";
import { useState } from "react";

interface TabsProps {
  id: "monthly" | "yearly" | "charts";
  label: string;
  icon: React.ElementType;
}

export default function Reports() {
  const [activeTab, setActiveTab] = useState<"monthly" | "yearly" | "charts">(
    "monthly",
  );

  const tabs: TabsProps[] = [
    {
      id: "monthly",
      label: "گزارش ماهانه",
      icon: Calendar,
    },
    {
      id: "yearly",
      label: "گزارش سالانه",
      icon: TrendingUp,
    },
    {
      id: "charts",
      label: "نمودارها",
      icon: BarChart3,
    },
  ];

  return (
    <div className="min-h-screen" dir="rtl">
      <div className="space-y-6">
        {/* ==================== Header با تب‌ها ======================= */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* عنوان و توضیحات */}
          <div className="space-y-1">
            <h1 className="text-foreground text-2xl font-bold tracking-tight">
              آمار و تحلیل وضعیت مالی
            </h1>
            <p className="text-muted-foreground text-sm">
              بررسی عملکرد مالی و روند درآمد و هزینه‌ها
            </p>
          </div>

          {/* تب‌های نوین */}
          <div className="bg-muted/50 flex gap-1 rounded-xl p-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground shadow-primary/25 shadow-lg"
                      : "hover:bg-primary/15 hover:text-foreground text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="inline text-xs md:text-base">
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ==================== محتوای اصلی ========================= */}
        <div className="bg-card border-border/50 rounded-xl border p-6 shadow-sm">
          {activeTab === "monthly" && <MonthlyReport />}
          {activeTab === "yearly" && <YearlyReport />}
          {activeTab === "charts" && <ChartsView />}
        </div>
      </div>
    </div>
  );
}
