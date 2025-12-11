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
    income: "bg-primary text-white",
    expense: "bg-destructive text-white",
  };

  return (
    <div className="border-border bg-card hover:border-primary/40 mt-6 flex h-full flex-col rounded-xl border p-4 shadow-sm transition-all duration-300 sm:p-6">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h2 className="text-foreground mb-1 text-base font-semibold tracking-tight sm:text-lg">
          تراکنش‌های اخیر
        </h2>
        <p className="text-muted-foreground text-xs sm:text-sm">
          شما ۲۴ تراکنش در این ماه داشته‌اید
        </p>
      </div>

      {/* List */}
      <div className="flex-auto space-y-3 overflow-y-auto pr-1">
        {recentTransactionsData.map((transaction) => (
          <div
            key={transaction.id}
            className="group hover:bg-primary/20 flex items-start gap-2 rounded-lg p-2 transition-colors sm:gap-3 sm:p-3"
          >
            {/* بخش راست: آیکون + اطلاعات */}
            <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
              {/* Icon */}
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-300 sm:h-11 sm:w-11",
                  typeClasses[transaction.type],
                )}
              >
                {transaction.type === "income" ? (
                  <ArrowUpLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 sm:h-5 sm:w-5" />
                )}
              </div>

              {/* Text Info */}
              <div className="min-w-0 flex-1 space-y-1">
                <p className="text-foreground truncate text-xs leading-tight font-medium sm:text-sm">
                  {transaction.title}
                </p>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="text-muted-foreground truncate text-[10px] sm:text-xs">
                    {transaction.category}
                  </span>
                  <span className="bg-border h-1 w-1 shrink-0 rounded-full" />
                  <span className="text-muted-foreground text-[10px] whitespace-nowrap sm:text-xs">
                    {transaction.date}
                  </span>
                </div>
              </div>
            </div>

            {/* بخش چپ: مبلغ و وضعیت */}
            <div className="flex shrink-0 flex-col items-end gap-1.5 sm:gap-2">
              {/* مبلغ */}
              <div
                className={cn(
                  "flex items-baseline gap-0.5 text-sm font-semibold tabular-nums sm:text-base",
                  transaction.type === "income"
                    ? "text-[var(--primary)]"
                    : "text-[var(--destructive)]",
                )}
              >
                <span className="whitespace-nowrap">
                  {formatCurrency(transaction.amount)}
                </span>
                <span className="text-[10px] sm:text-xs">
                  {transaction.type === "income" ? "+" : "−"}
                  {"  "}
                  <span className="text-[9px] md:text-xs"> تومان</span>
                </span>
              </div>

              {/* وضعیت */}
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[9px] font-medium whitespace-nowrap sm:text-[10px]",
                  statusClasses[transaction.status],
                )}
              >
                {transaction.status === "completed"
                  ? "تکمیل"
                  : transaction.status === "pending"
                    ? "در حال پردازش"
                    : "ناموفق"}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Button */}
      <button className="border-border hover:bg-accent mt-4 w-full rounded-lg border py-2 text-xs font-medium transition-all duration-300 sm:mt-6 sm:py-2.5 sm:text-sm">
        مشاهده همه تراکنش‌ها
      </button>
    </div>
  );
}
