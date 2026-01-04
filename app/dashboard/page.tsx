"use client";

import OverviewChart from "@/components/dashboard/overview-chart";
import RecentTransactions from "@/components/dashboard/recent-transactions";
import StatsGrid from "@/components/dashboard/stats-grid";
import DemoEntry from "@/components/demo/demo-entry";
import { useTransactions } from "@/hooks/useTransactions";

export default function DashboardPage() {
  const { data: transactions, isLoading, error } = useTransactions();

  return (
    <>
      {/* 👇 این فقط برای خواندن ?demo=true از URL است */}
      <DemoEntry />

      {isLoading && (
        <div className="flex h-[60vh] items-center justify-center">
          <div className="text-center">
            <div className="border-primary inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-r-transparent"></div>
            <p className="text-muted-foreground mt-4">در حال بارگذاری...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="flex h-[60vh] items-center justify-center">
          <div className="text-destructive text-center">
            <p className="text-lg font-semibold">خطا در بارگذاری داده‌ها</p>
            <p className="mt-2 text-sm">{error.message}</p>
          </div>
        </div>
      )}

      {!isLoading && !error && (
        <div>
          <StatsGrid transactions={transactions || []} />
          <OverviewChart transactions={transactions || []} />
          <RecentTransactions transactions={transactions || []} />
        </div>
      )}
    </>
  );
}
