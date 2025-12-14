"use client";

import AddTransactionModal from "@/components/transaction/AddTransactionModal";
import { transactionsData } from "@/config/tranaction-data";
import {
  categoryLabelMap,
  paymentMethodLabelMap,
} from "@/config/transaction-form-data";
import { formatCurrency } from "@/lib/formatCurrency";
import { cn } from "@/lib/utils";
import { useTransactionModalStore } from "@/store/transactionModal-store";
import { TransactionStatus, transactionType } from "@/types/transaction";
import {
  ArrowDownRight,
  ArrowUpDown,
  ArrowUpLeft,
  Edit,
  Plus,
  Search,
  SlidersHorizontal,
  Trash2,
} from "lucide-react";
import { useEffect } from "react";

export default function TransactionsPage() {
  const {
    isOpen,
    mode,
    openAdd,
    openEdit,
    onClose,
    selectedTransactionId,
    selectedTransaction,
    deleteTransaction,
    transactions,

    page,
    pageSize,
    setPage,
    paginatedTransactions,
    totalTransactions,
  } = useTransactionModalStore();

  // -------------------------------------------------------
  const setTransactions = useTransactionModalStore(
    (state) => state.setTransactions,
  );

  //چون فعلاً دیتابیس نداریم، باید داده‌های ثابت (transactionsData) را یک بار داخل کامپوننت صفحه به استور تزریق کنید.
  useEffect(() => {
    if (transactions.length === 0) {
      setTransactions(transactionsData);
    }
  }, [transactions.length, setTransactions]);
  // ----------------------------------------
  const statusClasses: Record<TransactionStatus, string> = {
    completed: "bg-secondary text-white",
    pending: "bg-muted-foreground text-white",
    failed: "bg-destructive text-white",
  };

  // ----------------------------------------
  const statusLabels: Record<TransactionStatus, string> = {
    completed: "تکمیل شده",
    pending: "در انتظار",
    failed: "ناموفق",
  };

  // ----------------------------------------
  const typeClasses: Record<transactionType, string> = {
    income: "bg-primary/10 text-primary",
    expense: "bg-destructive/10 text-destructive",
  };

  // ------------------DELETE TRANSACTION------------------------
  const handleDelete = (id: string) => {
    // Confirm قبل از حذف
    if (window.confirm("آیا از حذف این تراکنش اطمینان دارید؟")) {
      deleteTransaction(id);
      console.log(`✅ Transaction Deleted: ${id}`);
    }
  };

  // ==============================================================
  // =======================Pagination=============================
  // ==============================================================
  const data = paginatedTransactions();
  const total = totalTransactions();
  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  const startItem = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, total);

  return (
    <div className="h-full space-y-8 p-2">
      {/* ------->>>------ 1 => Header && Add transaction -------<<<------  */}
      <div className="flex flex-wrap justify-between gap-4">
        {/*  title */}
        <div className="space-y-1">
          <h1 className="text-foreground text-2xl font-bold tracking-tight">
            لیست تراکنش‌ها
          </h1>
          <p className="text-muted-foreground text-sm">
            مدیریت کامل ورودی‌ها و خروجی‌های مالی شما
          </p>
        </div>
        {/* add transaction btn */}
        <button
          onClick={openAdd}
          className="group bg-primary text-primary-foreground shadow-primary/20 hover:bg-primary/90 flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-medium shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="h-5 w-5 transition-transform group-hover:rotate-90" />
          <span>تراکنش جدید</span>
        </button>
      </div>
      {/* ------->>>------ 2 => Seperator -------<<<------  */}
      <div className="via-border h-px w-full bg-gradient-to-r from-transparent to-transparent" />
      {/* ------->>>------ 3 => Search && Filter -------<<<------ */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Input Group */}
        <div className="border-border bg-card focus-within:border-primary/50 focus-within:ring-primary/10 relative flex w-full max-w-xl items-center rounded-2xl border p-1 shadow-sm transition-all focus-within:ring-4">
          {/* icon search */}
          <div className="text-muted-foreground flex h-10 w-10 items-center justify-center">
            <Search className="h-5 w-5" />
          </div>
          {/* input */}
          <input
            type="text"
            placeholder="جستجو بر اساس توضیحات، دسته‌بندی و..."
            className="text-foreground placeholder:text-muted-foreground/70 flex-1 bg-transparent px-2 py-2 text-sm focus:outline-none"
          />
          {/* sticky filter */}
          <button className="bg-secondary/80 text-secondary-foreground hover:bg-secondary flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors">
            <SlidersHorizontal className="h-4 w-4" />
            <span>فیلترها</span>
          </button>
        </div>
        {/* ------->>>------ 4 => Sort Filter -------<<<------ */}
        <div className="flex items-center gap-2">
          <button className="border-border bg-background text-muted-foreground hover:bg-accent hover:text-foreground flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors">
            <ArrowUpDown className="h-4 w-4" />
            <span className="inline">مرتب‌سازی</span>
          </button>
        </div>
      </div>
      {/* ------->>>------ 4 => Transactions Table  -------<<<------ */}
      <div className="border-border bg-card w-full rounded-xl shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-border border-b">
                <th className="text-foreground px-4 py-5 text-right font-semibold">
                  توضیحات تراکنش
                </th>
                <th className="text-foreground table-cell px-4 py-5 text-center font-semibold">
                  دسته‌بندی
                </th>
                <th className="text-foreground table-cell px-4 py-5 text-center font-semibold">
                  تاریخ
                </th>
                <th className="text-foreground table-cell px-4 py-5 text-center font-semibold">
                  روش پرداخت
                </th>
                <th className="text-foreground px-4 py-5 text-center font-semibold">
                  مبلغ
                </th>
                <th className="text-foreground table-cell px-4 py-5 text-center font-semibold">
                  وضعیت
                </th>
                <th className="text-foreground table-cell px-4 py-5 text-center font-semibold">
                  عملیات
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="group border-border border-b transition-colors last:border-b-0"
                >
                  {/* Column-1 ===> Description */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all",
                          typeClasses[transaction.type],
                        )}
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
                  {/* Column-2 ===> Category */}
                  <td className="table-cell p-4 text-center">
                    <span className="bg-secondary/50 text-secondary-foreground inline-block rounded-lg px-3 py-1 text-xs font-medium">
                      {categoryLabelMap[transaction.category] ??
                        transaction.category}
                    </span>
                  </td>
                  {/* Column-3 ===> Date */}
                  <td className="text-muted-foreground table-cell px-4 py-4 text-center text-xs font-medium tabular-nums">
                    {transaction.date}
                  </td>
                  {/* Column-4 ===> payment */}
                  <td className="text-muted-foreground table-cell p-4 text-center text-xs">
                    {paymentMethodLabelMap[transaction.paymentMethod ?? ""] ??
                      transaction.paymentMethod ??
                      "نامشخص"}
                  </td>
                  {/* Column-5 ===> amount */}
                  <td className="p-4 text-center">
                    <div
                      className={cn(
                        "inline-flex items-baseline gap-1 rounded-md px-2.5 py-0.5 text-sm font-semibold tabular-nums",
                        typeClasses[transaction.type],
                      )}
                    >
                      <span className="whitespace-nowrap">
                        {formatCurrency(transaction.amount)}
                      </span>
                      <span className="text-xs">
                        {transaction.type === "income" ? "+" : "-"}
                      </span>
                    </div>
                  </td>
                  {/* Column-6 ===> status */}
                  <td className="table-cell p-4 text-center">
                    <span
                      className={cn(
                        "inline-block rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap",
                        statusClasses[transaction.status],
                      )}
                    >
                      {statusLabels[transaction.status]}
                    </span>
                  </td>
                  {/* Column-7 ===> Action Buttons */}
                  <td className="table-cell p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {/* دکمه ویرایش */}
                      <button
                        onClick={() => openEdit(transaction.id, transaction)}
                        className="text-muted-foreground hover:bg-muted hover:text-foreground inline-flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
                        title="ویرایش"
                      >
                        <Edit className="h-4 w-4" />
                      </button>

                      {/* دکمه حذف */}
                      <button
                        onClick={() => handleDelete(transaction.id)}
                        className="text-muted-foreground hover:bg-destructive hover:text-destructive-foreground inline-flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
                        title="حذف"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* ------->>>------ 5 => Empty Table  -------<<<------ */}
      {transactions.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="bg-muted flex h-16 w-16 items-center justify-center rounded-full">
            <Search className="text-muted-foreground/50 h-8 w-8" />
          </div>
          <h3 className="text-foreground mt-4 text-lg font-semibold">
            نتیجه‌ای یافت نشد
          </h3>
          <p className="text-muted-foreground mt-2 max-w-xs text-sm">
            با کلمات کلیدی دیگری جستجو کنید یا فیلترها را تغییر دهید.
          </p>
        </div>
      )}

      {/* ------->>>------ 6 => Pagination  -------<<<------ */}
      {transactions.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-sm">
            {total === 0
              ? "هیچ تراکنشی ثبت نشده است"
              : `نمایش ${startItem}–${endItem} از ${total} تراکنش`}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="border-border hover:bg-accent rounded-lg border px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
            >
              قبلی
            </button>
            {/* 👇 دکمه‌های شماره صفحه */}
            {Array.from({ length: pageCount }, (_, idx) => idx + 1).map(
              (pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => setPage(pageNumber)}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    pageNumber === page
                      ? "bg-primary text-white"
                      : "border-border hover:bg-accent border",
                  )}
                >
                  {pageNumber}
                </button>
              ),
            )}
            {/* 👆 دکمه‌های شماره صفحه */}
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === pageCount}
              className="border-border hover:bg-accent rounded-lg border px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
            >
              بعدی
            </button>
          </div>
        </div>
      )}

      <AddTransactionModal
        isOpen={isOpen}
        mode={mode}
        onClose={onClose}
        selectedTransactionId={selectedTransactionId}
        selectedTransaction={selectedTransaction}
      />
    </div>
  );
}
