import { recentTransactionsData } from "@/config/recent-transactions-data";
import { formatCurrency } from "@/lib/formatCurrency";
import { cn } from "@/lib/utils";
import {
  TransactionStatus,
  TransactionType,
} from "@/types/recent-transactions";
import { ArrowDownRight, ArrowUpLeft } from "lucide-react";

export default function RecentTransactions() {
  const statusClasses: Record<TransactionStatus, string> = {
    completed: "bg-secondary text-white",
    pending: "bg-muted-foreground text-white",
    failed: "bg-destructive text-white",
  };

  const typeClasses: Record<TransactionType, string> = {
    income: "bg-primary  text-white",
    expense: "bg-destructive  text-white",
  };

  return (
    <div className="border-border bg-card hover:border-primary/40 mt-6 flex h-full flex-col rounded-xl border p-6 shadow-sm transition-all duration-300">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-foreground mb-1 text-lg font-semibold tracking-tight">
          تراکنش‌های اخیر
        </h2>
        <p className="text-muted-foreground text-sm">
          شما ۲۴ تراکنش در این ماه داشته‌اید
        </p>
      </div>

      {/* List */}
      <div className="flex-auto space-y-4 overflow-y-auto pr-1">
        {recentTransactionsData.map((transaction) => (
          <div
            key={transaction.id}
            className="group hover:bg-primary/20 flex items-center justify-between gap-4 rounded-lg p-3 transition-colors"
          >
            {/* آیکون + اطلاعات */}
            <div className="flex items-center gap-4">
              {/* Icon */}
              <div
                className={cn(
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all duration-300",
                  typeClasses[transaction.type],
                )}
              >
                {transaction.type === "income" ? (
                  <ArrowUpLeft className="h-5 w-5" />
                ) : (
                  <ArrowDownRight className="h-5 w-5" />
                )}
              </div>

              {/* Text Info */}
              <div className="space-y-1.5">
                <p className="text-foreground text-sm leading-none font-medium">
                  {transaction.title}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-xs">
                    {transaction.category}
                  </span>
                  <span className="bg-border h-1 w-1 rounded-full" />
                  <span className="text-muted-foreground text-xs">
                    {transaction.date}
                  </span>
                </div>
              </div>
            </div>

            {/* مبلغ و وضعیت */}
            <div className="flex shrink-0 flex-col items-end gap-2">
              {/* مبلغ */}
              <span
                className={cn(
                  "text-base font-semibold tabular-nums",
                  transaction.type === "income"
                    ? "text-[var(--primary)]"
                    : "text-[var(--destructive)]",
                )}
              >
                <span className="ml-1"></span>
                {formatCurrency(transaction.amount)}
                {transaction.type === "income" ? "+" : "−"}
                <span className="text-muted-foreground mr-1.5 text-xs font-normal">
                  تومان
                </span>
              </span>

              {/* وضعیت */}
              <span
                className={cn(
                  "rounded-full px-2.5 py-1 text-[10px] font-medium",
                  statusClasses[transaction.status],
                )}
              >
                {transaction.status === "completed"
                  ? "تکمیل شده"
                  : transaction.status === "pending"
                    ? "در حال پردازش"
                    : "ناموفق"}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Button */}
      <button className="border-border hover:bg-accent mt-6 w-full rounded-lg border py-2.5 text-sm font-medium transition-all duration-300">
        مشاهده همه تراکنش‌ها
      </button>
    </div>
  );
}
