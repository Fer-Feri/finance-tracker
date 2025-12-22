"use client";

import {
  Plus,
  Search,
  SlidersHorizontal,
  ArrowUpLeft,
  ArrowDownRight,
  Edit,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { transactionsData } from "@/config/tranaction-data";
import { TransactionStatus } from "@/types/transaction";
import { useTransactionStore } from "@/store/transactionStore";
import { useEffect, useRef, useState } from "react";
import { useClickOutside } from "@/hooks/useClickOutside";
import AddTransactionModal from "@/components/transaction/AddTransactionModal";
import { getCurrentJalaliYearMonth } from "@/utils/date/dateHelpers";

// ============================================================
// CONSTANTS
// ============================================================
const JALALI_MONTHS = [
  { id: 1, name: "فروردین" },
  { id: 2, name: "اردیبهشت" },
  { id: 3, name: "خرداد" },
  { id: 4, name: "تیر" },
  { id: 5, name: "مرداد" },
  { id: 6, name: "شهریور" },
  { id: 7, name: "مهر" },
  { id: 8, name: "آبان" },
  { id: 9, name: "آذر" },
  { id: 10, name: "دی" },
  { id: 11, name: "بهمن" },
  { id: 12, name: "اسفند" },
];

const dateRangeItems: {
  id: "all" | "today" | "week" | "month";
  label: string;
}[] = [
  { id: "all", label: "همه" },
  { id: "today", label: "امروز" },
  { id: "month", label: "این ماه" },
];

const statusItems: { id: TransactionStatus; label: string }[] = [
  { id: "completed", label: "تکمیل شده" },
  { id: "pending", label: "در انتظار" },
  { id: "failed", label: "ناموفق" },
];

export const TRANSACTION_CATEGORIES: Record<string, string> = {
  // 💸 EXPENSE
  food: "خوراک و نوشیدنی",
  transport: "حمل و نقل",
  shopping: "خرید و پوشاک",
  bills: "قبض",
  health: "بهداشت و درمان",
  entertainment: "سرگرمی",
  education: "آموزش",
  home: "خانه و اجاره",
  insurance: "بیمه",
  gifts: "هدیه و کمک",
  expenseOther: "سایر هزینه‌ها",

  // 💰 INCOME
  salary: "حقوق و دستمزد",
  freelance: "پروژه و فریلنس",
  business: "کسب و کار",
  investment: "سرمایه‌گذاری",
  rental: "اجاره و رهن",
  bonus: "پاداش و عیدی",
  giftReceived: "هدیه دریافتی",
  incomeOther: "سایر درآمدها",
};

const CURRENT_YEAR = 1404;

// ============================================================
// COMPONENT
// ============================================================
export default function TransactionsPage() {
  const [isMenuFilterOpen, setIsMenuFilterOpen] = useState<boolean>(false);
  const [isCustomFilterOpen, setIsCustomFilterOpen] = useState<boolean>(false);

  const menuFilterRef = useRef<HTMLDivElement>(null);
  useClickOutside(menuFilterRef, () => setIsMenuFilterOpen(false));

  const {
    setTransactions,
    searchValue,
    setSearchValue,
    filters,
    setFilters,
    resetFilters,
    currentPage,
    setPage,
    nextPage,
    prevPage,
    getFilteredTransactions,
    getPageInfo,
    itemPerPage,
    deleteTransaction,
    openAddModal,
    openEditModal,
    isAddModalOpen,
  } = useTransactionStore();

  // ✅ State موقت برای سال و ماه انتخاب شده (قبل از اعمال)
  const [tempYear, setTempYear] = useState<number>(
    filters.customYear || getCurrentJalaliYearMonth().year,
  );
  const [tempMonth, setTempMonth] = useState<number>(
    filters.customMonth || getCurrentJalaliYearMonth().month,
  );

  const filteredTransactions = getFilteredTransactions();
  const { totalPages, startItem, endItem, totalItems } = getPageInfo();

  const paginatedData = filteredTransactions.slice(
    (currentPage - 1) * itemPerPage,
    currentPage * itemPerPage,
  );

  useEffect(() => {
    setTransactions(transactionsData);
  }, [setTransactions]);

  // ✅ هنگام باز شدن بخش سفارشی، مقادیر فعلی فیلتر رو توی state موقت بریز
  useEffect(() => {
    if (filters.customYear) setTempYear(filters.customYear);
    if (filters.customMonth) setTempMonth(filters.customMonth);
  }, [filters.customYear, filters.customMonth]);

  // ============================================================
  // HANDLERS
  // ============================================================

  // ✅ اعمال فیلتر سفارشی
  const handleApplyCustomFilter = () => {
    if (!tempYear || !tempMonth) return;
    if (tempYear && tempMonth) {
      setFilters({
        ...filters,
        dateRange: "custom",
        customYear: tempYear,
        customMonth: tempMonth,
      });
      setIsCustomFilterOpen(false);
    }
  };

  // ✅ پاک کردن فیلتر سفارشی
  const handleClearCustomFilter = () => {
    const { year, month } = getCurrentJalaliYearMonth();
    setFilters({
      ...filters,
      dateRange: "month", // برگشت به ماه جاری
      customYear: year,
      customMonth: month,
    });
  };

  const getVisiblePages = () => {
    const pages = [];
    const delta = 1;

    const start = Math.max(1, currentPage - delta);
    const end = Math.min(totalPages, currentPage + delta);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  const statusClasses: Record<TransactionStatus, string> = {
    completed: "bg-secondary text-white",
    pending: "bg-muted-foreground text-white",
    failed: "bg-destructive text-white",
  };

  const statusLabels: Record<TransactionStatus, string> = {
    completed: "تکمیل شده",
    pending: "در انتظار",
    failed: "ناموفق",
  };

  const handleDelete = (id: string) => {
    if (confirm("آیا مطمئن هستید؟")) {
      deleteTransaction(id);
    }
  };

  return (
    <div className="h-full space-y-8 p-2">
      {/* ============================================================ */}
      {/* HEADER */}
      {/* ============================================================ */}
      <div className="flex flex-wrap justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-foreground text-2xl font-bold tracking-tight">
            لیست تراکنش‌ها
          </h1>
          <p className="text-muted-foreground text-sm">
            مدیریت کامل ورودی‌ها و خروجی‌های مالی شما
          </p>
        </div>
      </div>

      <div className="via-border h-px w-full bg-gradient-to-r from-transparent to-transparent" />

      {/* ============================================================ */}
      {/* SEARCH & FILTER */}
      {/* ============================================================ */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="border-border bg-card relative flex w-full max-w-xl items-center rounded-2xl border p-1 shadow-sm">
          <div className="text-muted-foreground flex h-10 w-10 items-center justify-center">
            <Search className="h-5 w-5" />
          </div>

          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="جستجو بر اساس توضیحات، دسته‌بندی و..."
            className="text-foreground placeholder:text-muted-foreground/70 flex-1 bg-transparent text-sm focus:outline-none"
          />

          {searchValue && (
            <span
              className="text-primary/70 hover:text-primary ml-3 cursor-pointer transition-colors"
              onClick={() => setSearchValue("")}
            >
              ✕
            </span>
          )}

          {/* ============================================================ */}
          {/* FILTER DROPDOWN */}
          {/* ============================================================ */}
          <div className="relative" ref={menuFilterRef}>
            <button
              onClick={() => setIsMenuFilterOpen((prev) => !prev)}
              className="bg-secondary/80 text-secondary-foreground hover:bg-secondary relative flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>فیلترها</span>
            </button>

            {isMenuFilterOpen && (
              <div className="bg-popover border-primary/70 no-scrollbar absolute top-[calc(100%+0.5rem)] left-0 z-50 max-h-[500px] w-64 overflow-auto rounded-xl border p-4 shadow-2xl md:w-80">
                {/* ============================================================ */}
                {/* TYPE FILTER */}
                {/* ============================================================ */}
                <div className="space-y-3">
                  <p className="text-sm font-semibold">نوع تراکنش</p>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { id: "all" as const, label: "همه" },
                      { id: "income" as const, label: "درآمد" },
                      { id: "expense" as const, label: "هزینه" },
                    ].map((item) => (
                      <label
                        key={item.id}
                        className="border-border hover:bg-accent/30 flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 transition"
                      >
                        <input
                          type="radio"
                          name="transactionType"
                          checked={filters.type === item.id}
                          onChange={() =>
                            setFilters({ ...filters, type: item.id })
                          }
                          className="h-4 w-4 cursor-pointer accent-[var(--primary)]"
                        />
                        <span className="text-sm">{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* ============================================================ */}
                {/* STATUS FILTER */}
                {/* ============================================================ */}
                <div className="mt-6 space-y-3">
                  <p className="text-sm font-semibold">وضعیت تراکنش</p>
                  <div className="grid grid-cols-1 gap-2">
                    {statusItems.map((item) => (
                      <label
                        key={item.id}
                        className="border-border hover:bg-accent/30 flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 transition"
                      >
                        <input
                          type="checkbox"
                          checked={filters.statuses.includes(item.id)}
                          onChange={(e) => {
                            setFilters({
                              ...filters,
                              statuses: e.target.checked
                                ? [...filters.statuses, item.id]
                                : filters.statuses.filter((s) => s !== item.id),
                            });
                          }}
                          className="h-4 w-4 cursor-pointer accent-[var(--secondary)]"
                        />
                        <span className="text-sm">{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* ============================================================ */}
                {/* DATE RANGE FILTER */}
                {/* ============================================================ */}
                <div className="mt-6 space-y-3">
                  <p className="text-sm font-semibold">بازه زمانی</p>
                  <div className="grid grid-cols-1 gap-2">
                    {dateRangeItems.map((item) => (
                      <label
                        key={item.id}
                        className="border-border hover:bg-accent/30 flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 transition"
                      >
                        <input
                          type="radio"
                          name="dateRange"
                          checked={filters.dateRange === item.id}
                          onChange={() =>
                            setFilters({ ...filters, dateRange: item.id })
                          }
                          className="h-4 w-4 cursor-pointer accent-[var(--destructive)]"
                        />
                        <span className="text-sm">{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* ============================================================ */}
                {/* CUSTOM DATE FILTER */}
                {/* ============================================================ */}
                <div className="bg-muted/40 mt-6 space-y-3 rounded-lg p-3 shadow-sm">
                  <button
                    onClick={() => setIsCustomFilterOpen(!isCustomFilterOpen)}
                    className="text-muted-foreground hover:text-foreground flex w-full items-center justify-between text-xs font-semibold transition-colors"
                  >
                    <span>📅 انتخاب تاریخ دقیق (سفارشی)</span>
                    {isCustomFilterOpen ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>

                  {isCustomFilterOpen && (
                    <div className="space-y-3 pt-2">
                      {/* ✅ SELECT YEAR - اتصال به State */}
                      <div className="space-y-1.5">
                        <label className="text-foreground text-xs font-medium">
                          سال
                        </label>
                        <select
                          value={tempYear || ""}
                          onChange={(e) => setTempYear(Number(e.target.value))}
                          className="border-border bg-background text-foreground hover:border-primary/50 focus:border-primary focus:ring-primary/30 w-full rounded-md border px-3 py-2.5 text-sm transition-all focus:ring-2 focus:outline-none"
                        >
                          <option value="">-- انتخاب سال --</option>
                          {Array.from({ length: 4 }).map((_, index) => {
                            const year = CURRENT_YEAR - index;
                            return (
                              <option key={year} value={year}>
                                {year}
                              </option>
                            );
                          })}
                        </select>
                      </div>

                      {/* ✅ SELECT MONTH - اتصال به State */}
                      <div className="space-y-1.5">
                        <label className="text-foreground text-xs font-medium">
                          ماه
                        </label>
                        <select
                          value={tempMonth || ""}
                          onChange={(e) => setTempMonth(Number(e.target.value))}
                          className="border-border bg-background text-foreground hover:border-primary/50 focus:border-primary focus:ring-primary/30 w-full rounded-md border px-3 py-2.5 text-sm transition-all focus:ring-2 focus:outline-none"
                        >
                          <option value="">-- انتخاب ماه --</option>
                          {JALALI_MONTHS.map((month) => (
                            <option key={month.id} value={month.id}>
                              {month.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* ✅ ACTION BUTTONS - اتصال به Handler ها */}
                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={handleApplyCustomFilter}
                          disabled={!tempYear || !tempMonth}
                          className="bg-primary text-primary-foreground hover:bg-primary/90 flex-1 rounded-md py-2.5 text-sm font-medium shadow-sm transition-all hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          ✓ اعمال
                        </button>

                        <button
                          onClick={handleClearCustomFilter}
                          className="bg-destructive/10 text-destructive hover:bg-destructive/20 flex-1 rounded-md py-2.5 text-sm font-medium transition-all active:scale-[0.98]"
                        >
                          ✕ پاک کردن
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* ============================================================ */}
                {/* CLEAR ALL FILTERS */}
                {/* ============================================================ */}
                <button
                  onClick={resetFilters}
                  className="bg-accent hover:bg-accent/80 mt-6 w-full rounded-md py-2.5 text-sm font-medium text-black transition-colors dark:text-white"
                >
                  پاک کردن همه فیلترها
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ============================================================ */}
        {/* ADD TRANSACTION BUTTON */}
        {/* ============================================================ */}
        <button
          onClick={openAddModal}
          className="group bg-primary text-primary-foreground shadow-primary/20 hover:bg-primary/90 flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-medium shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="h-5 w-5 transition-transform group-hover:rotate-90" />
          <span>تراکنش جدید</span>
        </button>
      </div>

      {/* ============================================================ */}
      {/* TABLE */}
      {/* ============================================================ */}
      <div className="border-border bg-card w-full rounded-xl shadow-sm">
        <div className="no-scrollbar overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-border border-b">
                <th className="px-4 py-5 text-right font-semibold">
                  توضیحات تراکنش
                </th>
                <th className="px-4 py-5 text-center font-semibold">
                  دسته‌بندی
                </th>
                <th className="px-4 py-5 text-center font-semibold">تاریخ</th>
                <th className="px-4 py-5 text-center font-semibold">
                  روش پرداخت
                </th>
                <th className="px-4 py-5 text-center font-semibold">مبلغ</th>
                <th className="px-4 py-5 text-center font-semibold">وضعیت</th>
                <th className="px-4 py-5 text-center font-semibold">عملیات</th>
              </tr>
            </thead>

            <tbody>
              {paginatedData.map((transaction) => {
                const typeClasses = {
                  income: "bg-primary/10 text-primary",
                  expense: "bg-destructive/10 text-destructive",
                };

                return (
                  <tr key={transaction.id} className="border-border border-b">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all ${typeClasses[transaction.type]}`}
                        >
                          {transaction.type === "income" ? (
                            <ArrowUpLeft className="h-4 w-4" />
                          ) : (
                            <ArrowDownRight className="h-4 w-4" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-foreground truncate text-sm font-medium">
                            {transaction.description}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {transaction.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 text-center">
                      <span className="bg-secondary/80 text-secondary-foreground inline-block rounded-lg px-3 py-1 text-xs font-medium">
                        {TRANSACTION_CATEGORIES[transaction.category]}
                      </span>
                    </td>

                    <td className="p-4 text-center">
                      <span className="text-muted-foreground px-4 py-4 text-center text-xs font-medium tabular-nums">
                        {transaction.date}
                      </span>
                    </td>

                    <td className="text-muted-foreground p-4 text-center text-xs">
                      <span>
                        {transaction.paymentMethod === "cash"
                          ? "نقدی"
                          : transaction.paymentMethod === "card"
                            ? "کارت بانکی"
                            : "آنلاین"}
                      </span>
                    </td>

                    <td className="p-4 text-center">
                      <div
                        className={cn(
                          "inline-flex items-baseline gap-1 rounded-md px-2.5 py-0.5 text-sm font-semibold tabular-nums",
                          typeClasses[transaction.type],
                        )}
                      >
                        <span
                          className="max-w-[120px] truncate whitespace-nowrap"
                          title={transaction.amount.toLocaleString("fa-IR")}
                        >
                          {transaction.amount.toLocaleString("fa-IR")}
                        </span>
                        <span>{transaction.type === "income" ? "+" : "-"}</span>
                      </div>
                    </td>

                    <td className="p-4 text-center">
                      <span
                        className={cn(
                          "inline-block rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap",
                          statusClasses[transaction.status],
                        )}
                      >
                        {statusLabels[transaction.status]}
                      </span>
                    </td>

                    <td className="table-cell p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEditModal(transaction)}
                          className="text-muted-foreground hover:bg-accent/70 hover:text-foreground inline-flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
                          title="ویرایش تراکنش"
                        >
                          <Edit className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => handleDelete(transaction.id)}
                          className="text-muted-foreground hover:bg-destructive/70 hover:text-destructive-foreground inline-flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
                          title="حذف تراکنش"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ============================================================ */}
      {/* EMPTY STATE */}
      {/* ============================================================ */}
      {filteredTransactions.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="bg-muted flex h-16 w-16 items-center justify-center rounded-full">
            <Search className="text-accent h-8 w-8" />
          </div>
          <h3 className="text-destructive mt-4 text-lg font-semibold">
            نتیجه‌ای یافت نشد
          </h3>
        </div>
      )}

      {/* ============================================================ */}
      {/* PAGINATION */}
      {/* ============================================================ */}
      <div className="flex items-center justify-between opacity-70">
        <p className="text-xs md:text-sm">
          نمایش {startItem}–{endItem} از {totalItems} تراکنش
        </p>
        <div className="flex gap-2">
          <button
            className="border-primary/60 rounded-md border px-2.5 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            onClick={prevPage}
            disabled={currentPage === 1}
          >
            قبلی
          </button>

          {currentPage > 3 && (
            <>
              <button onClick={() => setPage(1)}>1</button>
              <span className="px-2">…</span>
            </>
          )}

          {getVisiblePages().map((page) => (
            <button
              key={page}
              onClick={() => setPage(page)}
              className={cn(
                "rounded-lg px-3 py-2 text-sm",
                page === currentPage
                  ? "bg-primary text-white"
                  : "hover:bg-accent border",
              )}
            >
              {page}
            </button>
          ))}

          {currentPage < totalPages - 2 && (
            <>
              <span className="px-2">…</span>
              <button onClick={() => setPage(totalPages)}>{totalPages}</button>
            </>
          )}

          <button
            className="border-primary/60 rounded-md border px-2.5 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            onClick={nextPage}
            disabled={currentPage === totalPages}
          >
            بعدی
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* TRANSACTION MODAL */}
      {/* ============================================================ */}
      {isAddModalOpen && <AddTransactionModal />}
    </div>
  );
}
