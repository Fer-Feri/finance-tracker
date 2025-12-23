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

import { useRouter } from "next/navigation";
import { useTransactionStore } from "@/store/transactionStore";
import { useMemo } from "react";
import moment from "jalali-moment";
import { cn } from "@/lib/utils";
import { formatLargeNumber } from "@/utils/formatNumber";

export default function MonthDetailModal({
  year,
  month,
  monthName,
  isOpen,
  onClose,
}: {
  year: number;
  month: number;
  monthName: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const { transactions } = useTransactionStore();

  // 🔍 فیلتر تراکنش‌های این ماه
  const monthTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const jalaliDate = moment(t.date, "jYYYY/jMM/jDD");
      const monthDate = jalaliDate.jMonth() + 1;
      const YearDate = jalaliDate.jYear();
      return YearDate === year && monthDate === month;
    });
  }, [transactions, year, month]);

  // 📊 محاسبه آمار
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

  // 🔝 ۵ تراکنش بزرگ
  const top5 = useMemo(() => {
    return [...monthTransactions]
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  }, [monthTransactions]);

  const handleViewAll = () => {
    onClose();
    router.push(`/dashboard/transactions?year=${year}&month=${month}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90dvw]">
        <DialogHeader className="mt-3">
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="text-primary h-5 w-5" />
            جزئیات {monthName} {year}
          </DialogTitle>
        </DialogHeader>

        {/* 📊 کارت‌های آماری */}
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

        {/* 💰 مجموع مبالغ */}
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

        {/* 🔝 تراکنش‌های برتر */}
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

        {/* 🎯 دکمه‌های عملیات */}
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

/* کامپوننت کمکی برای کارت‌های آماری کوچک */
function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
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
