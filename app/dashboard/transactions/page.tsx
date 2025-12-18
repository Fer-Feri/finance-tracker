"use client";

import {
  Plus,
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  ArrowUpLeft,
  ArrowDownRight,
  Edit,
  Trash2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { transactionsData } from "@/config/tranaction-data";
import { TransactionStatus } from "@/types/transaction";
import { useTransactionStore } from "@/store/transactionStore";
import { useEffect, useRef, useState } from "react";
import { useClickOutside } from "@/hooks/useClickOutside";

// ============================================================
// CONSTANTS
// ============================================================
const dateRangeItems: {
  id: "all" | "today" | "week" | "month";
  label: string;
}[] = [
  { id: "all", label: "همه" },
  { id: "today", label: "امروز" },
  { id: "week", label: "این هفته" },
  { id: "month", label: "این ماه" },
];

// ✅ تعریف صحیح آیتم‌های وضعیت با تایپ
const statusItems: { id: TransactionStatus; label: string }[] = [
  { id: "completed", label: "تکمیل شده" },
  { id: "pending", label: "در انتظار" },
  { id: "failed", label: "ناموفق" },
];

// ============================================================
// COMPONENT
// ============================================================
export default function TransactionsPage() {
  const [isMenuFilterOpen, setIsMenuFilterOpen] = useState<boolean>(false);
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
  } = useTransactionStore();

  const filteredTransactions = getFilteredTransactions();
  const { totalPages, startItem, endItem, totalItems } = getPageInfo();

  const paginatedData = filteredTransactions.slice(
    (currentPage - 1) * itemPerPage,
    currentPage * itemPerPage,
  );

  useEffect(() => {
    setTransactions(transactionsData);
  }, [setTransactions]);

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setPage(i)}
          className={cn(
            "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            i === currentPage
              ? "bg-primary text-white"
              : "border-border hover:bg-accent border",
          )}
        >
          {i}
        </button>,
      );
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

  return (
    <div className="h-full space-y-8 p-2">
      {/* HEADER */}
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

      {/* SEARCH & FILTER */}
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
              className="text-primary/70 ml-3 cursor-pointer"
              onClick={() => setSearchValue("")}
            >
              X
            </span>
          )}

          {/* FILTER DROPDOWN */}
          <div className="relative" ref={menuFilterRef}>
            <button
              onClick={() => setIsMenuFilterOpen((prev) => !prev)}
              className="bg-secondary/80 text-secondary-foreground hover:bg-secondary relative flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>فیلترها</span>
            </button>

            {isMenuFilterOpen && (
              <div className="bg-popover border-primary/70 absolute top-[calc(100%+0.5rem)] left-0 z-50 w-64 rounded-xl border p-4 shadow-2xl md:w-80">
                {/* TYPE FILTER */}
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

                {/* STATUS FILTER - ✅ اصلاح شده */}
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

                {/* DATE RANGE FILTER */}
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

                {/* CLEAR FILTERS */}
                <button
                  onClick={resetFilters}
                  className="bg-accent mt-6 w-full rounded-md py-2.5 text-black dark:text-white"
                >
                  پاک کردن فیلترها
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Add transaction button */}
        <button className="group bg-primary text-primary-foreground shadow-primary/20 hover:bg-primary/90 flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-medium shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]">
          <Plus className="h-5 w-5 transition-transform group-hover:rotate-90" />
          <span>تراکنش جدید</span>
        </button>
      </div>

      {/* TABLE */}
      <div className="border-border bg-card w-full rounded-xl shadow-sm">
        <div className="overflow-x-auto">
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
                        {transaction.category}
                      </span>
                    </td>

                    <td className="p-4 text-center">
                      <span className="text-muted-foreground px-4 py-4 text-center text-xs font-medium tabular-nums">
                        {transaction.date}
                      </span>
                    </td>

                    <td className="text-muted-foreground p-4 text-center text-xs">
                      <span>{transaction.paymentMethod}</span>
                    </td>

                    <td className="p-4 text-center">
                      <div
                        className={cn(
                          "inline-flex items-baseline gap-1 rounded-md px-2.5 py-0.5 text-sm font-semibold tabular-nums",
                          typeClasses[transaction.type],
                        )}
                      >
                        <span className="whitespace-nowrap">
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
                        <button className="text-muted-foreground hover:bg-accent/70 hover:text-foreground inline-flex h-8 w-8 items-center justify-center rounded-lg transition-colors">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-muted-foreground hover:bg-destructive/70 hover:text-destructive-foreground inline-flex h-8 w-8 items-center justify-center rounded-lg transition-colors">
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

      {/* EMPTY STATE */}
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

      {/* PAGINATION */}
      <div className="flex items-center justify-between opacity-70">
        <p className="text-sm">
          نمایش {startItem}–{endItem} از {totalItems} تراکنش
        </p>
        <div className="flex gap-2">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className={cn(
              "rounded-lg border px-4 py-2 text-sm font-medium transition-all duration-200",
              currentPage === 1
                ? "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                : "border-primary text-muted-foreground hover:bg-primary bg-muted hover:text-white",
            )}
          >
            قبلی
          </button>
          {renderPageNumbers()}
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className={cn(
              "rounded-lg border px-4 py-2 text-sm font-medium transition-all duration-200",
              currentPage === totalPages
                ? "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                : "border-primary text-muted-foreground hover:bg-primary bg-muted hover:text-white",
            )}
          >
            بعدی
          </button>
        </div>
      </div>

      {/* transaction modal */}
    </div>
  );
}

// "use client";

// // ============================================================
// // IMPORTS
// // ============================================================
// import { useEffect, useMemo, useState } from "react";
// import {
//   Plus,
//   Search,
//   SlidersHorizontal,
//   ArrowUpDown,
//   ArrowUpLeft,
//   ArrowDownRight,
//   Edit,
//   Trash2,
// } from "lucide-react";

// // Components
// import AddTransactionModal from "@/components/transaction/AddTransactionModal";

// // Store
// import { useTransactionModalStore } from "@/store/transactionModal-store";

// // Types
// import { TransactionStatus, transactionType } from "@/types/transaction";

// // Utils & Configs
// import { transactionsData } from "@/config/tranaction-data";
// import {
//   categoryLabelMap,
//   paymentMethodLabelMap,
// } from "@/config/transaction-form-data";
// import { formatCurrency } from "@/lib/formatCurrency";
// import { SearchTransaction } from "@/lib/searchTransaction";
// import { cn } from "@/lib/utils";

// // ============================================================
// // COMPONENT
// // ============================================================
// export default function TransactionsPage() {
//   // ============================================================
//   // STORE & STATE
//   // ============================================================
//   const {
//     // Modal state
//     isOpen,
//     mode,
//     openAdd,
//     openEdit,
//     onClose,
//     selectedTransactionId,
//     selectedTransaction,

//     // Transaction operations
//     deleteTransaction,
//     transactions,
//     setTransactions,

//     // Pagination
//     page,
//     pageSize,
//     setPage,
//     totalTransactions,
//   } = useTransactionModalStore();

//   // Local search state
//   const [searchQuery, setSearchQuery] = useState("");

//   // ============================================================
//   // EFFECTS
//   // ============================================================
//   // Initialize transactions from mock data if empty
//   useEffect(() => {
//     if (transactions.length === 0) {
//       setTransactions(transactionsData);
//     }
//   }, [transactions.length, setTransactions]);

//   // Reset to page 1 when search query changes
//   useEffect(() => {
//     setPage(1);
//   }, [searchQuery, setPage]);

//   // ============================================================
//   // COMPUTED VALUES
//   // ============================================================
//   // Filter transactions based on search query
//   const filteredTransactions = useMemo(() => {
//     return SearchTransaction(searchQuery, transactions);
//   }, [searchQuery, transactions]);

//   // Get paginated data (from filtered results if searching, otherwise all)
//   const displayedTransactions = useMemo(() => {
//     const dataToDisplay = searchQuery ? filteredTransactions : transactions;
//     const start = (page - 1) * pageSize;
//     return dataToDisplay.slice(start, start + pageSize);
//   }, [searchQuery, filteredTransactions, transactions, page, pageSize]);

//   // Calculate pagination info
//   const total = searchQuery ? filteredTransactions.length : totalTransactions();
//   const pageCount = Math.max(1, Math.ceil(total / pageSize));
//   const startItem = total === 0 ? 0 : (page - 1) * pageSize + 1;
//   const endItem = Math.min(page * pageSize, total);

//   // ============================================================
//   // STYLE MAPS
//   // ============================================================
// const statusClasses: Record<TransactionStatus, string> = {
//   completed: "bg-secondary text-white",
//   pending: "bg-muted-foreground text-white",
//   failed: "bg-destructive text-white",
// };

// const statusLabels: Record<TransactionStatus, string> = {
//   completed: "تکمیل شده",
//   pending: "در انتظار",
//   failed: "ناموفق",
// };

// const typeClasses: Record<transactionType, string> = {
//   income: "bg-primary/10 text-primary",
//   expense: "bg-destructive/10 text-destructive",
// };

//   // ============================================================
//   // HANDLERS
//   // ============================================================
//   // Handle transaction deletion with confirmation
//   const handleDelete = (id: string) => {
//     if (window.confirm("آیا از حذف این تراکنش اطمینان دارید؟")) {
//       deleteTransaction(id);
//       console.log(`✅ Transaction Deleted: ${id}`);
//     }
//   };

//   // ============================================================
//   // RENDER
//   // ============================================================
//   return (
//     <div className="h-full space-y-8 p-2">
//       {/* ============================================================ */}
//       {/* HEADER SECTION */}
//       {/* ============================================================ */}
//       <div className="flex flex-wrap justify-between gap-4">
//         {/* Page title */}
//         <div className="space-y-1">
//           <h1 className="text-foreground text-2xl font-bold tracking-tight">
//             لیست تراکنش‌ها
//           </h1>
//           <p className="text-muted-foreground text-sm">
//             مدیریت کامل ورودی‌ها و خروجی‌های مالی شما
//           </p>
//         </div>

//         {/* Add transaction button */}
//         <button
//           onClick={openAdd}
//           className="group bg-primary text-primary-foreground shadow-primary/20 hover:bg-primary/90 flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-medium shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
//         >
//           <Plus className="h-5 w-5 transition-transform group-hover:rotate-90" />
//           <span>تراکنش جدید</span>
//         </button>
//       </div>

//       {/* Divider */}
//       <div className="via-border h-px w-full bg-gradient-to-r from-transparent to-transparent" />

//       {/* ============================================================ */}
//       {/* SEARCH & FILTER SECTION */}
//       {/* ============================================================ */}
//       <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
//         {/* Search input group */}
//         <div className="border-border bg-card focus-within:border-primary/50 focus-within:ring-primary/10 relative flex w-full max-w-xl items-center rounded-2xl border p-1 shadow-sm transition-all focus-within:ring-4">
//           {/* Search icon */}
//           <div className="text-muted-foreground flex h-10 w-10 items-center justify-center">
//             <Search className="h-5 w-5" />
//           </div>

//           {/* Input field */}
//           <input
//             type="text"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             placeholder="جستجو بر اساس توضیحات، دسته‌بندی و..."
//             className="text-foreground placeholder:text-muted-foreground/70 flex-1 bg-transparent px-2 py-2 text-sm focus:outline-none"
//           />

//           {/* Clear button (shown when searching) */}
//           {searchQuery && (
//             <button
//               onClick={() => setSearchQuery("")}
//               className="text-muted-foreground hover:text-foreground px-2"
//               title="پاک کردن جستجو"
//             >
//               X
//             </button>
//           )}

//           {/* Filter button */}
//           <button className="bg-secondary/80 text-secondary-foreground hover:bg-secondary flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors">
//             <SlidersHorizontal className="h-4 w-4" />
//             <span>فیلترها</span>
//           </button>
//         </div>

//         {/* Sort button */}
//         <div className="flex items-center gap-2">
//           <button className="border-border bg-background text-muted-foreground hover:bg-accent hover:text-foreground flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors">
//             <ArrowUpDown className="h-4 w-4" />
//             <span className="inline">مرتب‌سازی</span>
//           </button>
//         </div>
//       </div>

//       {/* ============================================================ */}
//       {/* SEARCH RESULTS INFO */}
//       {/* ============================================================ */}
//       {searchQuery && (
//         <div className="bg-muted/50 rounded-lg px-4 py-2 text-sm">
//           <span className="text-muted-foreground">نتایج جستجو برای </span>
//           <span className="text-foreground font-medium">"{searchQuery}"</span>
//           <span className="text-muted-foreground"> • </span>
//           <span className="text-primary font-medium">{total} نتیجه</span>
//         </div>
//       )}

//       {/* ============================================================ */}
//       {/* TRANSACTIONS TABLE */}
//       {/* ============================================================ */}
//       <div className="border-border bg-card w-full rounded-xl shadow-sm">
//         <div className="overflow-x-auto">
//           <table className="w-full text-sm">
//             {/* Table header */}
//             <thead>
//               <tr className="border-border border-b">
//                 <th className="text-foreground px-4 py-5 text-right font-semibold">
//                   توضیحات تراکنش
//                 </th>
//                 <th className="text-foreground table-cell px-4 py-5 text-center font-semibold">
//                   دسته‌بندی
//                 </th>
//                 <th className="text-foreground table-cell px-4 py-5 text-center font-semibold">
//                   تاریخ
//                 </th>
//                 <th className="text-foreground table-cell px-4 py-5 text-center font-semibold">
//                   روش پرداخت
//                 </th>
//                 <th className="text-foreground px-4 py-5 text-center font-semibold">
//                   مبلغ
//                 </th>
//                 <th className="text-foreground table-cell px-4 py-5 text-center font-semibold">
//                   وضعیت
//                 </th>
//                 <th className="text-foreground table-cell px-4 py-5 text-center font-semibold">
//                   عملیات
//                 </th>
//               </tr>
//             </thead>

//             {/* Table body */}
//             <tbody>
//               {displayedTransactions.map((transaction) => (
//                 <tr
//                   key={transaction.id}
//                   className="group border-border border-b transition-colors last:border-b-0"
//                 >
//                   {/* Column 1: Description */}
//                   <td className="p-4">
//                     <div className="flex items-center gap-3">
//                       {/* Transaction type icon */}
//                       <div
//                         className={cn(
//                           "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all",
//                           typeClasses[transaction.type],
//                         )}
//                       >
//                         {transaction.type === "income" ? (
//                           <ArrowUpLeft className="h-4 w-4" />
//                         ) : (
//                           <ArrowDownRight className="h-4 w-4" />
//                         )}
//                       </div>

//                       {/* Description text */}
//                       <div className="min-w-0 flex-1">
//                         <p className="text-foreground truncate text-sm font-medium">
//                           {transaction.description}
//                         </p>
//                         <p className="text-muted-foreground text-xs">
//                           {transaction.id}
//                         </p>
//                       </div>
//                     </div>
//                   </td>

//                   {/* Column 2: Category */}
//                   <td className="table-cell p-4 text-center">
//                     <span className="bg-secondary/50 text-secondary-foreground inline-block rounded-lg px-3 py-1 text-xs font-medium">
//                       {categoryLabelMap[transaction.category] ??
//                         transaction.category}
//                     </span>
//                   </td>

//                   {/* Column 3: Date */}
//                   <td className="text-muted-foreground table-cell px-4 py-4 text-center text-xs font-medium tabular-nums">
//                     {transaction.date}
//                   </td>

//                   {/* Column 4: Payment method */}
//                   <td className="text-muted-foreground table-cell p-4 text-center text-xs">
//                     {paymentMethodLabelMap[transaction.paymentMethod ?? ""] ??
//                       transaction.paymentMethod ??
//                       "نامشخص"}
//                   </td>

//                   {/* Column 5: Amount */}
//                   <td className="p-4 text-center">
//                     <div
//                       className={cn(
//                         "inline-flex items-baseline gap-1 rounded-md px-2.5 py-0.5 text-sm font-semibold tabular-nums",
//                         typeClasses[transaction.type],
//                       )}
//                     >
//                       <span className="whitespace-nowrap">
//                         {formatCurrency(transaction.amount)}
//                       </span>
//                       <span className="text-xs">
//                         {transaction.type === "income" ? "+" : "-"}
//                       </span>
//                     </div>
//                   </td>

//                   {/* Column 6: Status */}
//                   <td className="table-cell p-4 text-center">
//                     <span
//                       className={cn(
//                         "inline-block rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap",
//                         statusClasses[transaction.status],
//                       )}
//                     >
//                       {statusLabels[transaction.status]}
//                     </span>
//                   </td>

//                   {/* Column 7: Action buttons */}
// <td className="table-cell p-4 text-center">
//   <div className="flex items-center justify-center gap-2">
//     {/* Edit button */}
//     <button
//       onClick={() => openEdit(transaction.id, transaction)}
//       className="text-muted-foreground hover:bg-muted hover:text-foreground inline-flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
//       title="ویرایش"
//     >
//       <Edit className="h-4 w-4" />
//     </button>

//     {/* Delete button */}
//     <button
//       onClick={() => handleDelete(transaction.id)}
//       className="text-muted-foreground hover:bg-destructive hover:text-destructive-foreground inline-flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
//       title="حذف"
//     >
//       <Trash2 className="h-4 w-4" />
//     </button>
//   </div>
// </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* ============================================================ */}
//       {/* EMPTY STATE */}
//       {/* ============================================================ */}
//       {total === 0 && (
//         <div className="flex flex-col items-center justify-center py-16 text-center">
//           <div className="bg-muted flex h-16 w-16 items-center justify-center rounded-full">
//             <Search className="text-muted-foreground/50 h-8 w-8" />
//           </div>
//           <h3 className="text-foreground mt-4 text-lg font-semibold">
//             نتیجه‌ای یافت نشد
//           </h3>
//           <p className="text-muted-foreground mt-2 max-w-xs text-sm">
//             {searchQuery
//               ? "با کلمات کلیدی دیگری جستجو کنید یا فیلترها را تغییر دهید."
//               : "هیچ تراکنشی ثبت نشده است."}
//           </p>
//         </div>
//       )}

//       {/* ============================================================ */}
//       {/* PAGINATION */}
//       {/* ============================================================ */}
//       {total > 0 && (
//         <div className="flex items-center justify-between">
//           {/* Pagination info */}
//           <p className="text-muted-foreground text-sm">
//             نمایش {startItem}–{endItem} از {total} تراکنش
//           </p>

//           {/* Pagination controls */}
//           <div className="flex gap-2">
//             {/* Previous button */}
//             <button
//               onClick={() => setPage(page - 1)}
//               disabled={page === 1}
//               className="border-border hover:bg-accent rounded-lg border px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
//             >
//               قبلی
//             </button>

//             {/* Page number buttons */}
//             {Array.from({ length: pageCount }, (_, idx) => idx + 1).map(
//               (pageNumber) => (
//                 <button
//                   key={pageNumber}
//                   onClick={() => setPage(pageNumber)}
//                   className={cn(
//                     "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
//                     pageNumber === page
//                       ? "bg-primary text-white"
//                       : "border-border hover:bg-accent border",
//                   )}
//                 >
//                   {pageNumber}
//                 </button>
//               ),
//             )}

//             {/* Next button */}
//             <button
//               onClick={() => setPage(page + 1)}
//               disabled={page === pageCount}
//               className="border-border hover:bg-accent rounded-lg border px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
//             >
//               بعدی
//             </button>
//           </div>
//         </div>
//       )}

//       {/* ============================================================ */}
//       {/* MODAL */}
//       {/* ============================================================ */}
//       <AddTransactionModal
//         isOpen={isOpen}
//         mode={mode}
//         onClose={onClose}
//         selectedTransactionId={selectedTransactionId}
//         selectedTransaction={selectedTransaction}
//       />
//     </div>
//   );
// }
