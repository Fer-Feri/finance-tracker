// components/modals/AddTransactionModal.tsx

"use client";

import { useEffect, useRef } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { useClickOutside } from "@/hooks/useClickOutside";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import CurrencyInput from "../ui/currency-input/CurrencyInput";
import { PersianDatePicker } from "../ui/PersianDatePicker";
import { useTransactionStore } from "@/store/transactionStore";
import { TransactionType, TransactionStatus } from "@/types/transaction";
import moment from "jalali-moment";

// ========== Types ==========
interface TransactionFormData {
  type: TransactionType;
  amount: number;
  description: string;
  category: string;
  paymentMethod: "card" | "online" | "cash";
  status: TransactionStatus;
  date: string;
}

interface Category {
  value: string;
  label: string;
  type: "income" | "expense";
  icon?: string;
}

interface Payment {
  value: string;
  label: string;
}

// ========== Constants ==========
export const TRANSACTION_CATEGORIES: Category[] = [
  // 💸 EXPENSE
  { value: "food", label: "خوراک و نوشیدنی", type: "expense", icon: "🍔" },
  { value: "transport", label: "حمل و نقل", type: "expense", icon: "🚗" },
  { value: "shopping", label: "خرید و پوشاک", type: "expense", icon: "🛍️" },
  { value: "bills", label: "قبض", type: "expense", icon: "📄" },
  { value: "health", label: "بهداشت و درمان", type: "expense", icon: "🏥" },
  { value: "entertainment", label: "سرگرمی", type: "expense", icon: "🎮" },
  { value: "education", label: "آموزش", type: "expense", icon: "📚" },
  { value: "home", label: "خانه و اجاره", type: "expense", icon: "🏠" },
  { value: "insurance", label: "بیمه", type: "expense", icon: "🛡️" },
  { value: "gifts", label: "هدیه و کمک", type: "expense", icon: "🎁" },
  {
    value: "expenseOther",
    label: "سایر هزینه‌ها",
    type: "expense",
    icon: "📦",
  },

  // 💰 INCOME
  { value: "salary", label: "حقوق و دستمزد", type: "income", icon: "💼" },
  { value: "freelance", label: "پروژه و فریلنس", type: "income", icon: "💻" },
  { value: "business", label: "کسب و کار", type: "income", icon: "🏢" },
  { value: "investment", label: "سرمایه‌گذاری", type: "income", icon: "📈" },
  { value: "rental", label: "اجاره و رهن", type: "income", icon: "🔑" },
  { value: "bonus", label: "پاداش و عیدی", type: "income", icon: "🎉" },
  { value: "giftReceived", label: "هدیه دریافتی", type: "income", icon: "🎁" },
  { value: "incomeOther", label: "سایر درآمدها", type: "income", icon: "💵" },
];

export const TRANSACTION_PAYMENTS: Payment[] = [
  { value: "card", label: "کارت بانکی" },
  { value: "online", label: "آنلاین" },
  { value: "cash", label: "نقدی" },
];

export const TRANSACTION_STATUSES: Payment[] = [
  { value: "completed", label: "تکمیل شده" },
  { value: "pending", label: "در انتظار" },
  { value: "failed", label: "ناموفق" },
];

// ========== Component ==========
export default function AddTransactionModal() {
  const {
    isAddModalOpen,
    setIsAddModalOpen,
    typeModal,
    selectedTransaction,
    addTransaction,
    editTransaction,
  } = useTransactionStore();

  const refElem = useRef(null);

  const getTodayPersianDate = () => {
    return moment().locale("fa").format("jYYYY/jMM/jDD");
  };

  // ✅ react-hook-form
  const { control, handleSubmit, reset } = useForm<TransactionFormData>({
    defaultValues: {
      type: "income",
      amount: 0,
      description: "",
      category: "",
      paymentMethod: "card",
      status: "completed",
      date: getTodayPersianDate(),
    },
  });

  const selectedType = useWatch({ control, name: "type" });

  // ✅ پر کردن فرم در Edit Mode
  useEffect(() => {
    if (typeModal === "edit" && selectedTransaction) {
      reset({
        type: selectedTransaction.type,
        amount: selectedTransaction.amount,
        description: selectedTransaction.description || "",
        category: selectedTransaction.category,
        paymentMethod: selectedTransaction.paymentMethod as
          | "card"
          | "online"
          | "cash",
        status: selectedTransaction.status,
        date: selectedTransaction.date,
      });
    } else {
      reset();
    }
  }, [typeModal, selectedTransaction, reset]);

  // ✅ بستن Modal با کلیک بیرون
  useClickOutside(refElem, () => {
    setIsAddModalOpen(false);
    reset();
  });

  // ✅ Submit Form
  const onSubmit = (data: TransactionFormData) => {
    if (typeModal === "add") {
      addTransaction(data);
    } else if (typeModal === "edit" && selectedTransaction?.id) {
      editTransaction(selectedTransaction.id, data);
    }
    setIsAddModalOpen(false);
    reset();
  };

  // فیلتر دسته‌بندی‌ها
  const filteredCategories = TRANSACTION_CATEGORIES.filter(
    (cat) => cat.type === selectedType,
  );

  if (!isAddModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div
        ref={refElem}
        className="bg-card border-border no-scrollbar animate-in fade-in zoom-in-95 relative flex h-[90vh] w-full max-w-2xl flex-col overflow-auto rounded-2xl border p-6 shadow-2xl"
      >
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-foreground text-2xl font-bold">
              {typeModal === "add" ? "افزودن تراکنش جدید" : "ویرایش تراکنش"}
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">
              {typeModal === "add"
                ? "اطلاعات تراکنش مالی خود را وارد کنید"
                : "اطلاعات تراکنش مالی خود را ویرایش کنید"}
            </p>
          </div>

          <button
            onClick={() => {
              setIsAddModalOpen(false);
              reset();
            }}
            className="text-muted-foreground hover:bg-accent hover:text-foreground flex h-10 w-10 items-center justify-center rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="bg-border mb-6 h-px w-full" />

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Transaction Type */}
          <div className="space-y-2">
            <label className="text-foreground block text-sm font-medium">
              نوع تراکنش
            </label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-2 gap-3">
                  <label className="border-border hover:border-primary relative flex h-14 cursor-pointer items-center justify-center rounded-xl border transition-all">
                    <input
                      {...field}
                      type="radio"
                      value="income"
                      checked={field.value === "income"}
                      className="peer absolute opacity-0"
                    />
                    <div className="peer-checked:bg-primary peer-checked:text-primary-foreground flex h-full w-full items-center justify-center gap-2 rounded-lg transition-colors">
                      <span className="text-sm font-medium">💰 درآمد</span>
                    </div>
                  </label>

                  <label className="border-border hover:border-destructive relative flex h-14 cursor-pointer items-center justify-center rounded-xl border transition-all">
                    <input
                      {...field}
                      type="radio"
                      value="expense"
                      checked={field.value === "expense"}
                      className="peer absolute opacity-0"
                    />
                    <div className="peer-checked:bg-destructive peer-checked:text-destructive-foreground flex h-full w-full items-center justify-center gap-2 rounded-lg transition-colors">
                      <span className="text-sm font-medium">💸 هزینه</span>
                    </div>
                  </label>
                </div>
              )}
            />
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <label className="text-foreground block text-sm font-medium">
              مبلغ (تومان)
            </label>
            <Controller
              name="amount"
              control={control}
              rules={{ required: true, min: 1 }}
              render={({ field }) => (
                <CurrencyInput
                  value={field.value}
                  onChange={(value) => field.onChange(value || 0)}
                />
              )}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-foreground block text-sm font-medium">
              توضیحات
            </label>
            <Controller
              name="description"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  placeholder="مثال: خرید مواد غذایی"
                  className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 w-full rounded-xl border px-4 py-3 text-sm transition-colors focus:ring-2 focus:outline-none"
                />
              )}
            />
          </div>

          {/* Category */}
          <div className="bg-muted/50 space-y-2 rounded-md p-4">
            <label className="text-foreground block text-sm font-medium">
              دسته‌بندی
            </label>
            <Controller
              name="category"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                  {filteredCategories.map((category) => (
                    <label
                      key={category.value}
                      className="border-border hover:border-primary relative flex cursor-pointer items-center justify-center rounded-xl border transition-all"
                    >
                      <input
                        {...field}
                        type="radio"
                        value={category.value}
                        checked={field.value === category.value}
                        className="peer sr-only"
                      />
                      <div className="peer-checked:bg-primary peer-checked:text-primary-foreground flex h-full w-full items-center gap-2 rounded-lg p-4 transition-colors">
                        <span>{category.icon}</span>
                        <span className="text-sm font-medium">
                          {category.label}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            />
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <label className="text-foreground block text-sm font-medium">
              روش پرداخت
            </label>
            <Controller
              name="paymentMethod"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-3 gap-2">
                  {TRANSACTION_PAYMENTS.map((payment) => (
                    <label
                      key={payment.value}
                      className="border-border hover:border-primary relative flex cursor-pointer items-center justify-center rounded-xl border transition-all"
                    >
                      <input
                        {...field}
                        type="radio"
                        value={payment.value}
                        checked={field.value === payment.value}
                        className="peer sr-only"
                      />
                      <div className="peer-checked:bg-primary peer-checked:text-primary-foreground flex h-full w-full items-center justify-center rounded-lg p-4 transition-colors">
                        <span className="text-sm font-medium">
                          {payment.label}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            />
          </div>

          {/* Date */}
          <div className="space-y-2">
            <label className="text-foreground block text-sm font-medium">
              تاریخ
            </label>
            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <PersianDatePicker
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="تاریخ تراکنش"
                />
              )}
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <label className="text-foreground block text-sm font-medium">
              وضعیت
            </label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-3 gap-3">
                  {TRANSACTION_STATUSES.map((status) => (
                    <label
                      key={status.value}
                      className="border-border relative flex h-12 cursor-pointer items-center justify-center rounded-xl border transition-all"
                    >
                      <input
                        {...field}
                        type="radio"
                        value={status.value}
                        checked={field.value === status.value}
                        className="peer sr-only"
                      />
                      <div
                        className={cn(
                          "flex h-full w-full items-center justify-center rounded-xl transition-colors",
                          status.value === "completed" &&
                            "peer-checked:bg-secondary peer-checked:text-secondary-foreground",
                          status.value === "pending" &&
                            "peer-checked:bg-primary peer-checked:text-primary-foreground",
                          status.value === "failed" &&
                            "peer-checked:bg-destructive peer-checked:text-destructive-foreground",
                        )}
                      >
                        <span className="text-sm font-medium">
                          {status.label}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setIsAddModalOpen(false);
                reset();
              }}
              className="border-border hover:bg-accent flex-1 rounded-xl border px-4 py-3 text-sm font-medium transition-colors"
            >
              انصراف
            </button>
            <button
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary/90 flex-1 rounded-xl px-4 py-3 text-sm font-medium shadow-lg transition-all"
            >
              {typeModal === "add" ? "افزودن تراکنش" : "ذخیره تراکنش"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
