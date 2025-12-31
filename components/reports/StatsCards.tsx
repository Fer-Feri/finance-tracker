// src/components/reports/StatsCards.tsx
import { TrendingUp, TrendingDown, DollarSign, Calendar } from "lucide-react";
import { formatLargeNumber } from "@/utils/formatNumber";
import { useYearlyStats } from "@/hooks/useYearlyStats";

interface StatsCardsProps {
  year: number;
}

export default function StatsCards({ year }: StatsCardsProps) {
  const {
    stats: currentYearData,
    isLoading: yearLoading,
    error: yearError,
  } = useYearlyStats(year);

  const { stats: previousYearData } = useYearlyStats(year - 1);

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

  // ✅ نمایش لودینگ
  if (yearLoading) {
    return <StatsCardsSkeleton />;
  }

  // ✅ نمایش خطا
  if (yearError) {
    return (
      <div className="bg-destructive/10 text-destructive rounded-lg p-4 text-center">
        ⚠️ خطا در بارگذاری آمار
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* ========== کارت کل درآمد ========== */}
      <NeonStatCard
        title="کل درآمد"
        value={currentYearData.totalIncome}
        icon={<TrendingUp className="h-5 w-5" />}
        variant="income"
        badge={
          previousYearData.totalIncome > 0 && (
            <ChangeBadge value={incomeChange} />
          )
        }
      />

      {/* ========== کارت کل هزینه ========== */}
      <NeonStatCard
        title="کل هزینه"
        value={currentYearData.totalExpense}
        icon={<TrendingDown className="h-5 w-5" />}
        variant="expense"
        badge={
          previousYearData.totalExpense > 0 && (
            <ChangeBadge value={expenseChange} inverse />
          )
        }
      />

      {/* ========== کارت سود/زیان ========== */}
      <NeonStatCard
        title="سود / زیان"
        value={currentYearData.profit}
        icon={<DollarSign className="h-5 w-5" />}
        variant={currentYearData.profit >= 0 ? "profit" : "loss"}
        badge={
          previousYearData.transactionCount > 0 && (
            <ChangeBadge value={profitChange} />
          )
        }
      />

      {/* ========== کارت میانگین ماهانه ========== */}
      <NeonStatCard
        title="میانگین ماهانه"
        value={currentYearData.avgMonthlyProfit}
        icon={<Calendar className="h-5 w-5" />}
        variant="average"
        subtitle="بر اساس سود"
      />
    </div>
  );
}

/* ========================================
   🎨 کامپوننت کارت با افکت نئونی
   ======================================== */
type CardVariant = "income" | "expense" | "profit" | "loss" | "average";

interface NeonStatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  variant: CardVariant;
  badge?: React.ReactNode;
  subtitle?: string;
}

function NeonStatCard({
  title,
  value,
  icon,
  variant,
  badge,
  subtitle,
}: NeonStatCardProps) {
  const variantStyles = {
    income: {
      cardClass:
        "bg-green-50/80 dark:bg-green-950/20 border-green-200/50 dark:border-green-500/20",
      iconClass: "text-green-600 dark:text-green-400",
      glowClass:
        "shadow-[0_0_15px_rgba(34,197,94,0.2)] dark:shadow-[0_0_25px_rgba(34,197,94,0.4)]",
      hoverGlow:
        "hover:shadow-[0_0_25px_rgba(34,197,94,0.4)] dark:hover:shadow-[0_0_40px_rgba(34,197,94,0.6)]",
    },
    expense: {
      cardClass:
        "bg-red-50/80 dark:bg-red-950/20 border-red-200/50 dark:border-red-500/20",
      iconClass: "text-red-600 dark:text-red-400",
      glowClass:
        "shadow-[0_0_15px_rgba(239,68,68,0.2)] dark:shadow-[0_0_25px_rgba(239,68,68,0.4)]",
      hoverGlow:
        "hover:shadow-[0_0_25px_rgba(239,68,68,0.4)] dark:hover:shadow-[0_0_40px_rgba(239,68,68,0.6)]",
    },
    profit: {
      cardClass:
        "bg-blue-50/80 dark:bg-blue-950/20 border-blue-200/50 dark:border-blue-500/20",
      iconClass: "text-blue-600 dark:text-blue-400",
      glowClass:
        "shadow-[0_0_15px_rgba(59,130,246,0.2)] dark:shadow-[0_0_25px_rgba(59,130,246,0.4)]",
      hoverGlow:
        "hover:shadow-[0_0_25px_rgba(59,130,246,0.4)] dark:hover:shadow-[0_0_40px_rgba(59,130,246,0.6)]",
    },
    loss: {
      cardClass:
        "bg-orange-50/80 dark:bg-orange-950/20 border-orange-200/50 dark:border-orange-500/20",
      iconClass: "text-orange-600 dark:text-orange-400",
      glowClass:
        "shadow-[0_0_15px_rgba(249,115,22,0.2)] dark:shadow-[0_0_25px_rgba(249,115,22,0.4)]",
      hoverGlow:
        "hover:shadow-[0_0_25px_rgba(249,115,22,0.4)] dark:hover:shadow-[0_0_40px_rgba(249,115,22,0.6)]",
    },
    average: {
      cardClass:
        "bg-purple-50/80 dark:bg-purple-950/20 border-purple-200/50 dark:border-purple-500/20",
      iconClass: "text-purple-600 dark:text-purple-400",
      glowClass:
        "shadow-[0_0_15px_rgba(168,85,247,0.2)] dark:shadow-[0_0_25px_rgba(168,85,247,0.4)]",
      hoverGlow:
        "hover:shadow-[0_0_25px_rgba(168,85,247,0.4)] dark:hover:shadow-[0_0_40px_rgba(168,85,247,0.6)]",
    },
  };

  const styles = variantStyles[variant];

  return (
    <div
      className={`rounded-xl border p-4 backdrop-blur-sm transition-all duration-300 ${styles.cardClass} ${styles.glowClass} ${styles.hoverGlow} `}
    >
      {/* هدر کارت */}
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium">{title}</span>
        <div className="flex items-center gap-2">
          <div className={`${styles.iconClass} drop-shadow-lg`}>{icon}</div>
          {badge}
        </div>
      </div>

      {/* مقدار */}
      <p className="text-2xl font-bold tracking-tight tabular-nums">
        {formatLargeNumber(value)}
      </p>

      {/* زیرنویس */}
      <p className="text-muted-foreground mt-1 text-xs">
        {subtitle || "تومان"}
      </p>
    </div>
  );
}

/* ========================================
   🏷️ بج درصد تغییر
   ======================================== */
interface ChangeBadgeProps {
  value: number;
  inverse?: boolean;
}

function ChangeBadge({ value, inverse = false }: ChangeBadgeProps) {
  const isPositive = inverse ? value < 0 : value > 0;
  const colorClass = isPositive
    ? "text-green-700 dark:text-green-300"
    : "text-red-700 dark:text-red-300";
  const bgClass = isPositive
    ? "bg-green-100/80 dark:bg-green-900/40 border border-green-300/50 dark:border-green-500/30"
    : "bg-red-100/80 dark:bg-red-900/40 border border-red-300/50 dark:border-red-500/30";

  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-bold backdrop-blur-sm ${bgClass} ${colorClass} `}
    >
      {value > 0 && "+"}
      {value}%
    </span>
  );
}

/* ========================================
   💀 اسکلتون لودینگ
   ======================================== */
function StatsCardsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="bg-card/50 animate-pulse rounded-xl border p-4 backdrop-blur-sm"
        >
          <div className="bg-muted-foreground/20 mb-4 h-4 w-20 rounded" />
          <div className="bg-muted-foreground/20 mb-2 h-8 w-32 rounded" />
          <div className="bg-muted-foreground/10 h-3 w-16 rounded" />
        </div>
      ))}
    </div>
  );
}
