"use client";

import { useClickOutside } from "@/hooks/useClickOutside";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import CurrencyInput from "../ui/currency-input/CurrencyInput";
import { useAddTransactionModalStore } from "@/store/addTransactionModalStore";
import { PersianDatePicker } from "../ui/PersianDatePicker";
import { useTransactionStore } from "@/store/transactionStore";

export interface ModalProp {
  setIsAddModalOpen: (isOpen: boolean) => void;
}
export interface Category {
  value: string;
  label: string;
  type: "income" | "expense";
  icon?: string;
}
export interface Payment {
  value: string;
  label: string;
}
export interface Status {
  value: string;
  label: string;
}

export const TRANSACTION_CATEGORIES: Category[] = [
  // 💸 EXPENSE Categories
  { value: "food", label: "خوراک و نوشیدنی", type: "expense", icon: "🍔" },
  { value: "transport", label: "حمل و نقل", type: "expense", icon: "🚗" },
  { value: "shopping", label: "خرید و پوشاک", type: "expense", icon: "🛍️" },
  {
    value: "bills",
    label: "قبض",
    type: "expense",
    icon: "📄",
  },
  { value: "health", label: "بهداشت و درمان", type: "expense", icon: "🏥" },
  {
    value: "entertainment",
    label: "سرگرمی و تفریح",
    type: "expense",
    icon: "🎮",
  },
  { value: "education", label: "آموزش", type: "expense", icon: "📚" },
  { value: "home", label: "خانه و اجاره", type: "expense", icon: "🏠" },
  { value: "insurance", label: "بیمه", type: "expense", icon: "🛡️" },
  { value: "gifts", label: "هدیه و کمک", type: "expense", icon: "🎁" },
  {
    value: "expense-other",
    label: "سایر هزینه‌ها",
    type: "expense",
    icon: "📦",
  },

  // 💰 INCOME Categories
  { value: "salary", label: "حقوق و دستمزد", type: "income", icon: "💼" },
  { value: "freelance", label: "پروژه و فریلنس", type: "income", icon: "💻" },
  { value: "business", label: "کسب و کار", type: "income", icon: "🏢" },
  {
    value: "investment",
    label: "سرمایه‌گذاری و سود",
    type: "income",
    icon: "📈",
  },
  { value: "rental", label: "اجاره و رهن", type: "income", icon: "🔑" },
  { value: "bonus", label: "پاداش و عیدی", type: "income", icon: "🎉" },
  { value: "gift-received", label: "هدیه دریافتی", type: "income", icon: "🎁" },
  { value: "income-other", label: "سایر درآمدها", type: "income", icon: "💵" },
];

export const TRANSACTION_PAYMENTS: Payment[] = [
  { value: "card", label: "کارت بانکی" },
  { value: "online", label: "آنلاین" },
  { value: "cash", label: "نقدی" },
];

export const TRANSACTION_STATUSES: Payment[] = [
  {
    value: "completed",
    label: "تکمیل شده",
  },
  {
    value: "pending",
    label: "در انتظار",
  },
  {
    value: "failed",
    label: "ناموفق",
  },
];

// ------------------------------------------------------------
// ------------------------------------------------------------
// ------------------------------------------------------------
export default function AddTransactionModal({ setIsAddModalOpen }: ModalProp) {
  const {
    typeModal,
    selectedTransactionId,
    selectedType: selectedTypeValue,
    amount: amountValue,
    description: descriptionValue,
    category: categoryInput,
    payment: paymentValue,
    status: statusValue,
    date,
    setDate,
    setSelectedType,
    setAmount,
    setDescription,
    setCategory,
    setPayment,
    setStatus,
    loadTransactionData,
    resetForm,
  } = useAddTransactionModalStore();

  const { transactions } = useTransactionStore();

  // ========================================================
  const refElem = useRef(null);
  useClickOutside(refElem, () => {
    setIsAddModalOpen(false);
    resetForm();
  });

  // ======================== پر کردن فرم در حالت Edit==========================
  useEffect(() => {
    if (typeModal === "edit" && selectedTransactionId) {
      const transaction = transactions.find(
        (t) => t.id === selectedTransactionId,
      );

      if (transaction) {
        // پر کردن فرم با داده‌های تراکنش
        loadTransactionData({
          type: transaction.type,
          amount: transaction.amount,
          description: transaction.description ?? "",
          category: transaction.category,
          paymentMethod: transaction.paymentMethod ?? "card",
          status: transaction.status,
          date: transaction.date,
        });
      }
    }
  }, [typeModal, selectedTransactionId, transactions, loadTransactionData]);

  const filteredCategories = TRANSACTION_CATEGORIES.filter(
    (category) => category.type === selectedTypeValue,
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (typeModal === "add") {
      console.log("✅ افزودن تراکنش جدید:", {
        type: selectedTypeValue,
        amount: amountValue,
        description: descriptionValue,
        category: categoryInput,
        payment: paymentValue,
        status: statusValue,
        date,
      });
    } else {
      console.log("✏️ ویرایش تراکنش:", {
        id: selectedTransactionId,
        type: selectedTypeValue,
        amount: amountValue,
        description: descriptionValue,
        category: categoryInput,
        payment: paymentValue,
        status: statusValue,
        date,
      });
    }

    setIsAddModalOpen(false);
    resetForm();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      {/* Modal Container */}
      <div
        ref={refElem}
        className="bg-card border-border animate-in fade-in zoom-in-95 no-scrollbar relative flex h-[90vh] w-full max-w-2xl flex-col overflow-auto rounded-2xl border p-6 shadow-2xl duration-300"
      >
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-foreground text-2xl font-bold">
              {typeModal === "add" ? " افزودن تراکنش جدید" : "ویرایش تراکنش"}
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">
              {typeModal === "add"
                ? " اطلاعات تراکنش مالی خود را وارد کنید"
                : " اطلاعات تراکنش مالی خود را ویرایش کنید"}
            </p>
          </div>

          {/* Close Button */}
          <button className="text-muted-foreground hover:bg-accent hover:text-foreground flex h-10 w-10 items-center justify-center rounded-full transition-colors">
            <X
              onClick={() => {
                setIsAddModalOpen(false);
                resetForm();
              }}
              className="h-5 w-5"
            />
          </button>
        </div>

        {/* Divider */}
        <div className="bg-border mb-6 h-px w-full" />

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Transaction Type */}
          <div className="space-y-2">
            <label className="text-foreground block text-sm font-medium">
              نوع تراکنش
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* درآمد */}
              <label className="border-border hover:border-primary relative flex h-14 cursor-pointer items-center justify-center gap-2 rounded-xl border transition-all">
                <input
                  type="radio"
                  name="transaction-type-incom"
                  value="income"
                  checked={selectedTypeValue === "income"}
                  onChange={() => setSelectedType("income")}
                  className="peer absolute opacity-0"
                />
                <div className="peer-checked:bg-primary peer-checked:text-primary-foreground flex h-full w-full items-center justify-center gap-2 rounded-lg transition-colors">
                  <span className="text-sm font-medium">💰 درآمد</span>
                </div>
              </label>

              {/* هزینه */}
              <label className="border-border hover:border-destructive relative flex h-14 cursor-pointer items-center justify-center gap-2 rounded-xl border transition-all">
                <input
                  type="radio"
                  name="transaction-type-expose"
                  value="expense"
                  checked={selectedTypeValue === "expense"}
                  onChange={() => setSelectedType("expense")}
                  className="peer absolute opacity-0"
                />
                <div className="peer-checked:bg-destructive peer-checked:text-destructive-foreground flex h-full w-full items-center justify-center gap-2 rounded-lg transition-colors">
                  <span className="text-sm font-medium">💸 هزینه</span>
                </div>
              </label>
            </div>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <label className="text-foreground block text-sm font-medium">
              مبلغ (تومان)
            </label>
            <CurrencyInput value={amountValue} onChange={setAmount} />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-foreground block text-sm font-medium">
              توضیحات
            </label>
            <input
              type="text"
              name="description"
              required
              value={descriptionValue}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="مثال: خرید مواد غذایی"
              className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 w-full rounded-xl border px-4 py-3 text-sm transition-colors focus:ring-2 focus:outline-none"
            />
          </div>

          {/* Category */}
          <div className="bg-muted/50 space-y-2 rounded-md p-4 shadow-lg">
            <label className="text-foreground block text-sm font-medium">
              دسته‌بندی
            </label>
            <div className="md: grid grid-cols-2 gap-2 md:grid-cols-3">
              {filteredCategories.map((category) => {
                return (
                  <label
                    key={category.value}
                    className="border-border hover:border-primary relative flex w-full cursor-pointer grid-cols-3 items-center justify-center gap-2 rounded-xl border transition-all"
                  >
                    <input
                      type="radio"
                      name="category"
                      required
                      value={category.value}
                      onChange={() => setCategory(category.value)}
                      checked={categoryInput === category.value}
                      className="peer sr-only"
                    />
                    <div className="peer-checked:bg-primary peer-checked:text-primary-foreground flex h-full w-full items-center gap-2 rounded-lg p-4 transition-colors">
                      <span>{category.icon}</span>
                      <span className="text-sm font-medium">
                        {category.label}
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Payment Method */}
          <div className="mt-9 space-y-2">
            <label className="text-foreground block text-sm font-medium">
              روش پرداخت
            </label>
            <div className="md: grid grid-cols-2 gap-2 md:grid-cols-3">
              {TRANSACTION_PAYMENTS.map((payment) => {
                return (
                  <label
                    key={payment.value}
                    className="border-border hover:border-primary relative flex w-full cursor-pointer grid-cols-3 items-center justify-center gap-2 rounded-xl border transition-all"
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={payment.value}
                      onChange={() => setPayment(payment.value)}
                      checked={paymentValue === payment.value}
                      className="peer sr-only"
                    />
                    <div className="peer-checked:bg-primary peer-checked:text-primary-foreground flex h-full w-full items-center gap-2 rounded-lg p-4 transition-colors">
                      <span className="text-sm font-medium">
                        {payment.label}
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Date */}
          <div className="mt-9 space-y-2">
            <label className="text-foreground block text-sm font-medium">
              تاریخ
            </label>
            <PersianDatePicker
              value={date}
              onChange={setDate}
              placeholder="تاریخ تراکنش"
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <label className="text-foreground block text-sm font-medium">
              وضعیت
            </label>
            <div className="grid grid-cols-3 gap-3">
              {TRANSACTION_STATUSES.map((status) => (
                <label
                  key={status.value}
                  className={`border-border relative flex h-12 cursor-pointer items-center justify-center rounded-xl border transition-all`}
                >
                  <input
                    type="radio"
                    name="status"
                    value={status.value}
                    onChange={() => setStatus(status.value)}
                    defaultChecked={status.value === "completed"}
                    className="peer sr-only"
                  />
                  <div
                    className={cn(
                      "flex h-full w-full items-center justify-center rounded-xl",
                      status.value === "completed" &&
                        "peer-checked:bg-secondary peer-checked:text-muted",
                      status.value === "pending" &&
                        "peer-checked:bg-primary peer-checked:text-muted",
                      status.value === "failed" &&
                        "peer-checked:bg-destructive peer-checked:text-muted",
                    )}
                  >
                    <span className="text-sm font-medium peer-checked:font-bold">
                      {status.label}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-9 flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setIsAddModalOpen(false);
                resetForm();
              }}
              className="border-border hover:bg-accent flex-1 rounded-xl border px-4 py-3 text-sm font-medium transition-colors"
            >
              انصراف
            </button>
            <button
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary/90 flex-1 rounded-xl px-4 py-3 text-sm font-medium shadow-lg transition-all hover:shadow-xl"
            >
              {typeModal === "add" ? " افزودن تراکنش جدید" : " ذخیره تراکنش"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
