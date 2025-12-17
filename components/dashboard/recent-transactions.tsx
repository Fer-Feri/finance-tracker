"use client";

// -------------------- Imports --------------------
import { transactionsData } from "@/config/tranaction-data";
import { cn } from "@/lib/utils";
import { TransactionStatus, TransactionType } from "@/types/transaction";
import { ArrowDownRight, ArrowUpLeft } from "lucide-react";
import moment from "jalali-moment";
import { useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";

// -------------------- Component --------------------

export default function RecentTransactions() {
  // -------------------- State --------------------

  // Toggle between showing only recent (5) or all monthly transactions
  const [showAllTransactions, setShowAllTransactions] = useState(false);

  // -------------------- Date Helpers --------------------

  // Current Jalali date (Persian locale)
  const now = moment().locale("fa");

  // Extract current Jalali year & month
  const currentYear = now.jYear();
  const currentMonth = now.jMonth() + 1; // jMonth is 0-based

  // -------------------- Data Filtering --------------------

  // Filter transactions that belong to the current Jalali month
  const currentMonthTransactions = transactionsData.filter((transaction) => {
    const transactionDate = moment(transaction.date, "jYYYY-jMM-jDD");

    return (
      transactionDate.jYear() === currentYear &&
      transactionDate.jMonth() + 1 === currentMonth
    );
  });

  // -------------------- UI Style Maps --------------------

  // Badge styles based on transaction status
  const statusClasses: Record<TransactionStatus, string> = {
    completed: "bg-secondary text-white",
    pending: "bg-muted-foreground text-white",
    failed: "bg-destructive text-white",
  };

  // Icon background styles based on transaction type
  const typeClasses: Record<TransactionType, string> = {
    income: "bg-primary text-white",
    expense: "bg-destructive text-white",
  };

  // -------------------- Display Logic --------------------

  // Decide how many transactions to show
  const transactionDisplay = showAllTransactions
    ? currentMonthTransactions
    : currentMonthTransactions.slice(0, 5);

  // Total transactions count for current month
  const transactionLength = currentMonthTransactions.length;

  //--------------------------------------------------
  // -------------------- Render JSX--------------------
  //--------------------------------------------------

  return (
    <div className="border-border bg-card hover:border-primary/40 mt-6 flex h-full flex-col rounded-xl border p-4 shadow-sm transition-all duration-300 sm:p-6">
      {/* ---------- Header ---------- */}
      <div className="mb-4 sm:mb-6">
        <h2 className="text-foreground mb-1 text-base font-semibold tracking-tight sm:text-lg">
          تراکنش‌های اخیر
        </h2>

        <p className="text-muted-foreground text-xs sm:text-sm">
          شما {transactionLength} تراکنش در این ماه داشته‌اید
        </p>
      </div>

      {/* ---------- Transactions List ---------- */}
      <LayoutGroup>
        <motion.div
          layout
          className="flex-auto overflow-hidden pr-1"
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div layout className="space-y-3">
              {transactionDisplay.map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  // Entry animation
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{
                    duration: 0.2,
                    delay: index * 0.02,
                    ease: "easeOut",
                  }}
                  layout
                  style={{ willChange: "transform, opacity" }}
                  className="group hover:bg-primary/20 flex items-start gap-2 rounded-lg p-2 transition-colors sm:gap-3 sm:p-3"
                >
                  {/* ----- Left: Icon + Info ----- */}
                  <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
                    {/* Transaction Type Icon */}
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

                    {/* Transaction Details */}
                    <div className="min-w-0 flex-1 space-y-1">
                      {/* Description */}
                      <p className="text-foreground truncate text-xs leading-tight font-medium sm:text-sm">
                        {transaction.description}
                      </p>

                      {/* Category + Date */}
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

                  {/* ----- Right: Amount + Status ----- */}
                  <div className="flex shrink-0 flex-col items-end gap-1.5 sm:gap-2">
                    {/* Amount */}
                    <div
                      className={cn(
                        "flex items-baseline gap-0.5 text-sm font-semibold tabular-nums sm:text-base",
                        transaction.type === "income"
                          ? "text-[var(--primary)]"
                          : "text-[var(--destructive)]",
                      )}
                    >
                      <span className="whitespace-nowrap">
                        {transaction.amount.toLocaleString("fa-IR")}
                      </span>

                      <span className="text-[10px] sm:text-xs">
                        {transaction.type === "income" ? "+" : "−"}{" "}
                        <span className="text-[9px] md:text-xs">تومان</span>
                      </span>
                    </div>

                    {/* Status Badge */}
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
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </LayoutGroup>

      {/* ---------- Show More / Less Button ---------- */}
      <motion.button
        onClick={() => setShowAllTransactions((prev) => !prev)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="border-border hover:bg-accent mt-4 w-full rounded-lg border py-2 text-xs font-medium transition-all duration-300 sm:mt-6 sm:py-2.5 sm:text-sm"
      >
        {showAllTransactions ? "نمایش کمتر" : "مشاهده همه تراکنش‌ها"}
      </motion.button>
    </div>
  );
}
