// src/app/reports/page.tsx
"use client";

import { useState } from "react";
import { Calendar, BarChart3 } from "lucide-react";
import YearSelector from "@/components/reports/YearSelector";
import StatsCards from "@/components/reports/StatsCards";
import MonthlyBreakdown from "@/components/reports/MonthlyBreakdown";
import ChartsView from "@/components/reports/ChartsView";
// import YearSelector from "@/components/reports/YearSelector";
// import StatsCards from "@/components/reports/StatsCards";
// import MonthlyBreakdown from "@/components/reports/MonthlyBreakdown";
// import ChartsView from "@/components/reports/ChartsView";

type ReportTab = "monthly" | "charts";

export default function Reports() {
  const [selectedYear, setSelectedYear] = useState(1404);
  const [activeTab, setActiveTab] = useState<ReportTab>("monthly");

  return (
    <div className="min-h-screen space-y-6 p-6" dir="rtl">
      {/* ========== HEADER ========== */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">📊 آمار و تحلیل وضعیت مالی</h1>
        <p className="text-muted-foreground text-sm">
          بررسی عملکرد مالی و روند درآمد و هزینه‌ها
        </p>
      </div>

      {/* ========== سلکتور سال (مشترک) ========== */}
      <YearSelector
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
      />

      {/* ========== کارت‌های آماری (همیشه نمایش) ========== */}
      <StatsCards year={selectedYear} />

      {/* ========== تب‌ها ========== */}
      <div className="flex gap-2 border-b">
        <TabButton
          active={activeTab === "monthly"}
          onClick={() => setActiveTab("monthly")}
          icon={<Calendar className="h-4 w-4" />}
          label="جزئیات ماهانه"
        />
        <TabButton
          active={activeTab === "charts"}
          onClick={() => setActiveTab("charts")}
          icon={<BarChart3 className="h-4 w-4" />}
          label="نمودارها و تحلیل"
        />
      </div>

      {/* ========== محتوای تب‌ها ========== */}
      <div className="bg-card rounded-xl border p-6">
        {activeTab === "monthly" ? (
          <MonthlyBreakdown year={selectedYear} />
        ) : (
          <ChartsView year={selectedYear} />
        )}
      </div>
    </div>
  );
}

// ========== کامپوننت دکمه تب ==========
interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

function TabButton({ active, onClick, icon, label }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all ${
        active
          ? "border-primary text-primary border-b-2"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
