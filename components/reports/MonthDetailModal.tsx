"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import moment from "jalali-moment";
import {
  Calendar,
  ChevronLeft,
  DollarSign,
  FileText,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatLargeNumber } from "@/utils/formatNumber";
import { useTransactionStore } from "@/store/transactionStore";

// ============================================================
// TYPES
// ============================================================
interface MonthDetailModalProps {
  year: number;
  month: number;
  monthName: string;
  isOpen: boolean;
  onClose: () => void;
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function MonthDetailModal({
  year,
  month,
  monthName,
  isOpen,
  onClose,
}: MonthDetailModalProps) {
  const router = useRouter();
  const { transactions } = useTransactionStore();

  // ============================================================
  // FILTER: Get transactions for selected month
  // ============================================================
  const monthTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const jalaliDate = moment(t.date, "jYYYY/jMM/jDD");
      const monthDate = jalaliDate.jMonth() + 1;
      const yearDate = jalaliDate.jYear();
      return yearDate === year && monthDate === month;
    });
  }, [transactions, year, month]);

  // ============================================================
  // CALCULATE: Month statistics
  // ============================================================
  const stats = useMemo(() => {
    const income = monthTransactions.filter(
      (t) => t.type === "income" && t.status === "completed",
    );
    const expense = monthTransactions.filter(
      (t) => t.type === "expense" && t.status === "completed",
    );

    return {
      total: monthTransactions.length,
      incomeCount: income.length,
      expenseCount: expense.length,
      totalIncome: income.reduce((sum, t) => sum + t.amount, 0),
      totalExpense: expense.reduce((sum, t) => sum + t.amount, 0),
    };
  }, [monthTransactions]);

  // ============================================================
  // CALCULATE: Top 5 largest transactions
  // ============================================================
  const top5 = useMemo(() => {
    return [...monthTransactions]
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  }, [monthTransactions]);

  // ============================================================
  // HANDLER: Navigate to transactions page with filters
  // ============================================================
  const handleViewAll = () => {
    onClose();
    router.push(`/dashboard/transactions?year=${year}&month=${month}`);
  };

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90dvw]">
        {/* Header */}
        <DialogHeader className="mt-3">
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="text-primary h-5 w-5" />
            جزئیات {monthName} {year}
          </DialogTitle>
        </DialogHeader>

        {/* Statistics Cards Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard
            icon={<FileText className="h-4 w-4" />}
            label="تعداد کل"
            value={stats.total.toLocaleString("fa-IR")}
          />
          <StatCard
            icon={<TrendingUp className="h-4 w-4 text-green-600" />}
            label="درآمد"
            value={stats.incomeCount.toLocaleString("fa-IR")}
          />
          <StatCard
            icon={<TrendingDown className="h-4 w-4 text-red-600" />}
            label="هزینه"
            value={stats.expenseCount.toLocaleString("fa-IR")}
          />
          <StatCard
            icon={<DollarSign className="h-4 w-4 text-orange-400" />}
            label="سود/زیان"
            value={formatLargeNumber(stats.totalIncome - stats.totalExpense)}
          />
        </div>

        {/* Total Amounts Summary */}
        <div className="border-border grid grid-cols-2 gap-4 rounded-lg border p-4">
          <div>
            <p className="text-muted-foreground text-xs">مجموع درآمد</p>
            <p className="text-lg font-bold text-green-600 tabular-nums">
              {stats.totalIncome.toLocaleString("fa-IR")} تومان
            </p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">مجموع هزینه</p>
            <p className="text-lg font-bold text-red-600 tabular-nums">
              {stats.totalExpense.toLocaleString("fa-IR")} تومان
            </p>
          </div>
        </div>

        {/* Top 5 Transactions List */}
        {top5.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">بزرگ‌ترین تراکنش‌ها:</h3>
            <div className="border-border space-y-2 rounded-lg border p-3">
              {top5.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-muted-foreground">{t.description}</span>
                  <span
                    className={cn(
                      "font-semibold tabular-nums",
                      t.type === "income" ? "text-green-600" : "text-red-600",
                    )}
                  >
                    {t.amount.toLocaleString("fa-IR")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            بستن
          </Button>
          <Button onClick={handleViewAll}>
            مشاهده همه تراکنش‌ها
            <ChevronLeft className="mr-2 h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================
// SUB COMPONENT: Stat Card
// ============================================================
function StatCard({ icon, label, value }: StatCardProps) {
  return (
    <div className="border-border rounded-lg border p-3">
      <div className="text-muted-foreground mb-1 flex items-center gap-1 text-xs">
        {icon}
        <span>{label}</span>
      </div>
      <p className="text-lg font-bold tabular-nums">{value}</p>
    </div>
  );
}
