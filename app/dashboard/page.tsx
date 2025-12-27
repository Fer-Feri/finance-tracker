import { prisma } from "@/lib/prisma";
import OverviewChart from "@/components/dashboard/overview-chart";
import RecentTransactions from "@/components/dashboard/recent-transactions";
import StatsGrid from "@/components/dashboard/stats-grid";

async function getDashboardData(userId: string) {
  const transactions = await prisma.transaction.findMany({
    where: { userId },
    include: { category: true },
    orderBy: { date: "desc" },
  });

  return transactions;
}

export default async function DashboardPage() {
  const userId = "user-test-001";
  const transactions = await getDashboardData(userId);

  // ✅ اضافه کن برای debug:
  console.log("📊 Transactions Count:", transactions.length);
  console.log("📊 First Transaction:", transactions[0]);
  return (
    <div>
      <StatsGrid transactions={transactions} />
      {/* <OverviewChart />
      <RecentTransactions /> */}
    </div>
  );
}
