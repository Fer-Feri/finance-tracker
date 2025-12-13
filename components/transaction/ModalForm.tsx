"use client";

import { useState } from "react";

import {
  CategoryDataOptionFormModal,
  PaymentMethodDataFormModal,
  TransactionDataTypeFormModal,
} from "@/config/transaction-form-data";

import { useTransactionModalStore } from "@/store/transactionModal-store";
import { Transaction } from "@/types/transaction";
import { PersianDatePicker } from "../ui/persion-date-picker";
import { getTodayJalali } from "@/utils/date/jalali";
import { CurrencyInput } from "../ui/currency-input";

// =================================================
// Component Props
// =================================================
interface ModalFormProps {
  mode: "add" | "edit";
  selectedTransactionId: string | null;
  selectedTransaction: Transaction | null;
  onClose: () => void;
}

// =================================================
// Internal Form State
// =================================================
interface FormState {
  description: string;
  category: string;
  date: string;
  amount: number;
  type: "income" | "expense";
  status: "pending" | "completed" | "failed";
  paymentMethod: string;
  notes: string;
}

// =============================================================
//  انتخاب خودکار دسته‌بندی
// =============================================================
function getDefaultCategoryByType(type: "income" | "expense") {
  const firstMatch = CategoryDataOptionFormModal.find((category) =>
    category.types.includes(type),
  );
  return firstMatch ? firstMatch.value : "";
}

// =================================================
// Initialize Form State (Add / Edit)
// =================================================
function getInitialFormState(
  mode: "add" | "edit",
  transaction: Transaction | null,
): FormState {
  if (mode === "edit" && transaction) {
    return {
      description: transaction.description ?? "",
      category:
        transaction.category || getDefaultCategoryByType(transaction.type),
      date: transaction.date,
      amount: transaction.amount,
      type: transaction.type,
      status: transaction.status,
      paymentMethod: transaction.paymentMethod ?? "card",
      notes: "",
    };
  }

  const defaultType: FormState["type"] = "expense";

  return {
    description: "",
    category: getDefaultCategoryByType(defaultType),
    date: getTodayJalali(),
    amount: 0,
    type: "expense",
    status: "completed",
    paymentMethod: "card",
    notes: "",
  };
}

// =================================================
// Modal Form Component
// =================================================
export default function ModalForm({
  mode,
  selectedTransactionId,
  selectedTransaction,
  onClose,
}: ModalFormProps) {
  // -----------------------------------------------------
  const updateTransaction = useTransactionModalStore(
    (state) => state.updateTransaction,
  );
  // -----------------------------------------------------
  const addTransaction = useTransactionModalStore(
    (state) => state.addTransaction,
  );

  const [formState, setFormState] = useState<FormState>(() =>
    getInitialFormState(mode, selectedTransaction),
  );

  // =================================================
  // Submit Handler (Local State Update Only)
  // =================================================
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "add") {
      addTransaction({
        description: formState.description,
        amount: formState.amount,
        category: formState.category,
        date: formState.date,
        type: formState.type,
        status: formState.status,
        paymentMethod: formState.paymentMethod,
      });
      console.log("✅ Transaction Added (Local State):", formState);
    }

    if (mode === "edit" && selectedTransactionId) {
      updateTransaction(selectedTransactionId, {
        description: formState.description,
        amount: formState.amount,
        category: formState.category,
        date: formState.date,
        type: formState.type,
        status: formState.status,
        paymentMethod: formState.paymentMethod,
      });

      console.log("✅ Transaction Updated (Local State):", formState);
    }

    onClose();
  };

  // =============================================================
  // Filter categories based on selected transaction type
  // =============================================================
  const filteredCategories = CategoryDataOptionFormModal.filter((category) =>
    category.types.includes(formState.type),
  );

  // =================================================
  // JSX
  // =================================================
  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6">
      {/* ================= Transaction Type ================= */}
      <div className="space-y-3">
        <label className="text-foreground text-sm font-medium">
          نوع تراکنش
        </label>

        <div className="mt-2 grid grid-cols-2 gap-3">
          {TransactionDataTypeFormModal.map((item) => {
            const Icon = item.icon;
            const isSelected = formState.type === item.value;

            return (
              <button
                key={item.value}
                type="button"
                onClick={() =>
                  setFormState((prev) => ({
                    ...prev,
                    type: item.value,
                    category: getDefaultCategoryByType(item.value),
                  }))
                }
                className={`rounded-xl border-2 p-4 transition-all duration-300 ${
                  isSelected
                    ? `${item.bgClass} ${item.colorClass} shadow-md`
                    : "border-border hover:border-primary/40"
                } `}
              >
                <div className="flex items-center justify-center gap-2">
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= Amount ================= */}
      <div className="space-y-2">
        <label className="text-foreground text-sm font-medium">
          مبلغ (تومان)
          <span className="text-rose-500"> *</span>
        </label>

        <CurrencyInput
          value={formState.amount}
          onChange={(value) =>
            setFormState((prev) => ({
              ...prev,
              amount: value,
            }))
          }
          placeholder="مثال: 15000000"
        />
      </div>

      {/* ================= Category Selector ================= */}
      <div className="space-y-3">
        <label className="text-foreground text-sm font-medium">دسته‌بندی</label>

        <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {filteredCategories.map((item) => {
            const Icon = item.icon;
            const isSelected = formState.category === item.value;

            return (
              <button
                key={item.value}
                type="button"
                onClick={() =>
                  setFormState((prev) => ({
                    ...prev,
                    category: item.value,
                  }))
                }
                className={`rounded-lg border p-3 transition-all duration-300 ${
                  isSelected
                    ? "bg-primary/15 border-primary text-foreground shadow-sm"
                    : "border-border hover:border-primary/40"
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <Icon className="h-5 w-5" />
                  <span className="text-sm">{item.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= Description ================= */}
      <div className="space-y-3">
        <label htmlFor="description" className="text-sm font-medium">
          توضیحات:
          <span className="text-rose-500"> *</span>
        </label>

        <input
          id="description"
          value={formState.description}
          onChange={(e) =>
            setFormState((prev) => ({
              ...prev,
              description: e.target.value,
            }))
          }
          required
          className="mt-2 w-full rounded-xl border px-4 py-3"
        />
      </div>

      {/* ================= Date ================= */}
      <div className="space-y-2">
        <label className="text-foreground text-sm font-medium">تاریخ:</label>

        <PersianDatePicker
          value={formState.date}
          onChange={(value) =>
            setFormState((prev) => ({
              ...prev,
              date: value,
            }))
          }
        />
      </div>

      {/* ================= Edit Only Fields ================= */}
      {mode === "edit" && (
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Payment Method Select */}
          <div className="space-y-3">
            <label className="text-sm font-medium">روش پرداخت</label>
            <select
              value={formState.paymentMethod}
              onChange={(e) =>
                setFormState((prev) => ({
                  ...prev,
                  paymentMethod: e.target.value,
                }))
              }
              /* className={...}*/
              className="w-full rounded-xl border px-4 py-3"
            >
              {PaymentMethodDataFormModal.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          {/* Status Select */}
          <div className="space-y-3">
            <label className="text-sm font-medium">وضعیت</label>
            <select
              value={formState.status}
              onChange={(e) =>
                setFormState((prev) => ({
                  ...prev,
                  status: e.target.value as FormState["status"],
                }))
              }
              /* className={...}*/
              className="w-full rounded-xl border px-4 py-3"
            >
              <option value="completed">تکمیل شده</option>
              <option value="failed">ناموفق</option>
              <option value="pending">در انتظار</option>
            </select>
          </div>
        </div>
      )}

      {/* ================= Notes ================= */}
      <div className="space-y-3">
        <label className="text-sm font-medium">یادداشت (اختیاری)</label>
        <textarea
          rows={3}
          value={formState.notes}
          onChange={(e) =>
            setFormState((prev) => ({
              ...prev,
              notes: e.target.value,
            }))
          }
          className="mt-2 w-full resize-none rounded-xl border px-4 py-3"
        />
      </div>

      {/* ================= Actions ================= */}
      <div className="grid grid-cols-2 gap-3 pt-4">
        <button
          type="submit"
          className="bg-primary rounded-xl px-6 py-3 text-white"
        >
          {mode === "add" ? "ثبت تراکنش" : "ذخیره تغییرات"}
        </button>

        <button
          type="button"
          onClick={onClose}
          className="rounded-xl border px-6 py-3"
        >
          انصراف
        </button>
      </div>
    </form>
  );
}
