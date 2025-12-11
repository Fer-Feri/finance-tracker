import OverviewChart from "@/components/dashboard/overview-chart";
import RecentTransactions from "@/components/dashboard/recent-transactions";
import StatsGrid from "@/components/dashboard/stats-grid";

export default function DashboardPage() {
  return (
    <div>
      <StatsGrid />
      <OverviewChart />
      <RecentTransactions />
    </div>
  );
}
