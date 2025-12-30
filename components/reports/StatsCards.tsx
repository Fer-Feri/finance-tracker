// src/components/reports/StatsCards.tsx
import { TrendingUp, TrendingDown, DollarSign, Calendar } from "lucide-react";
import { useReportData } from "@/hooks/useReportData";
import { formatLargeNumber } from "@/utils/formatNumber";

interface StatsCardsProps {
  year: number;
}

export default function StatsCards({ year }: StatsCardsProps) {
  const currentYearData = useReportData(year);
  const previousYearData = useReportData(year - 1);

  // محاسبه درصد تغییر
  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  const incomeChange = calculateChange(
    currentYearData.totalIncome,
    previousYearData.totalIncome,
  );
  const expenseChange = calculateChange(
    currentYearData.totalExpense,
    previousYearData.totalExpense,
  );
  const profitChange = calculateChange(
    currentYearData.profit,
    previousYearData.profit,
  );

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="کل درآمد"
        value={currentYearData.totalIncome}
        icon={<TrendingUp className="h-5 w-5" />}
        colorClass="bg-green-50 dark:bg-green-950/20"
        iconColor="text-green-600"
        badge={
          previousYearData.totalIncome > 0 && (
            <ChangeBadge value={incomeChange} />
          )
        }
      />

      <StatCard
        title="کل هزینه"
        value={currentYearData.totalExpense}
        icon={<TrendingDown className="h-5 w-5" />}
        colorClass="bg-red-50 dark:bg-red-950/20"
        iconColor="text-red-600"
        badge={
          previousYearData.totalExpense > 0 && (
            <ChangeBadge value={expenseChange} inverse />
          )
        }
      />

      <StatCard
        title="سود / زیان"
        value={currentYearData.profit}
        icon={<DollarSign className="h-5 w-5" />}
        colorClass={
          currentYearData.profit >= 0
            ? "bg-blue-50 dark:bg-blue-950/20"
            : "bg-orange-50 dark:bg-orange-950/20"
        }
        iconColor={
          currentYearData.profit >= 0 ? "text-blue-600" : "text-orange-600"
        }
        badge={
          previousYearData.transactionCount > 0 && (
            <ChangeBadge value={profitChange} />
          )
        }
      />

      <StatCard
        title="میانگین ماهانه"
        value={currentYearData.avgMonthlyProfit}
        icon={<Calendar className="h-5 w-5" />}
        colorClass="bg-purple-50 dark:bg-purple-950/20"
        iconColor="text-purple-600"
        subtitle="بر اساس سود"
      />
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  colorClass: string;
  iconColor: string;
  badge?: React.ReactNode;
  subtitle?: string;
}

function StatCard({
  title,
  value,
  icon,
  colorClass,
  iconColor,
  badge,
  subtitle,
}: StatCardProps) {
  return (
    <div className={`rounded-xl border p-4 ${colorClass}`}>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium">{title}</span>
        <div className="flex items-center gap-2">
          <div className={iconColor}>{icon}</div>
          {badge}
        </div>
      </div>
      <p className="text-2xl font-bold tabular-nums">
        {formatLargeNumber(value)}
      </p>
      <p className="text-muted-foreground mt-1 text-xs">
        {subtitle || "تومان"}
      </p>
    </div>
  );
}

interface ChangeBadgeProps {
  value: number;
  inverse?: boolean;
}

function ChangeBadge({ value, inverse = false }: ChangeBadgeProps) {
  const isPositive = inverse ? value < 0 : value > 0;
  const colorClass = isPositive ? "text-green-600" : "text-red-600";
  const bgClass = isPositive
    ? "bg-green-100 dark:bg-green-900/30"
    : "bg-red-100 dark:bg-red-900/30";

  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-bold ${bgClass} ${colorClass}`}
    >
      {value > 0 && "+"}
      {value}%
    </span>
  );
}
