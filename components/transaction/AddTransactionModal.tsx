"use client";

import { cn } from "@/lib/utils";
import { AddTransactionModalProps } from "@/types/transaction-form";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import ModalForm from "./ModalForm";

// ------------------------------------------------------------
// ------------------------------------------------------------
// ------------------------------------------------------------
export default function AddTransactionModal() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      {/* Modal Container */}
      <div className="bg-card border-border animate-in fade-in zoom-in-95 relative flex h-[90vh] w-full max-w-2xl flex-col overflow-auto rounded-2xl border p-6 shadow-2xl duration-300 md:h-fit">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-foreground text-2xl font-bold">
              افزودن تراکنش جدید
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">
              اطلاعات تراکنش مالی خود را وارد کنید
            </p>
          </div>

          {/* Close Button */}
          <button className="text-muted-foreground hover:bg-accent hover:text-foreground flex h-10 w-10 items-center justify-center rounded-full transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Divider */}
        <div className="bg-border mb-6 h-px w-full" />

        {/* Form */}
        <form className="space-y-5">
          {/* Transaction Type */}
          <div className="space-y-2">
            <label className="text-foreground block text-sm font-medium">
              نوع تراکنش
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="border-border hover:border-primary relative flex h-14 cursor-pointer items-center justify-center gap-2 rounded-xl border transition-all">
                <input
                  type="radio"
                  name="type"
                  value="income"
                  className="peer sr-only"
                />
                <div className="peer-checked:bg-primary peer-checked:text-primary-foreground flex h-full w-full items-center justify-center gap-2 rounded-lg transition-colors">
                  <span className="text-sm font-medium">💰 درآمد</span>
                </div>
              </label>

              <label className="border-border hover:border-destructive relative flex h-14 cursor-pointer items-center justify-center gap-2 rounded-xl border transition-all">
                <input
                  type="radio"
                  name="type"
                  value="expense"
                  className="peer sr-only"
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
            <input
              type="number"
              placeholder="مثال: 150,000"
              className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 w-full rounded-xl border px-4 py-3 text-sm transition-colors focus:ring-2 focus:outline-none"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-foreground block text-sm font-medium">
              توضیحات
            </label>
            <input
              type="text"
              placeholder="مثال: خرید مواد غذایی"
              className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 w-full rounded-xl border px-4 py-3 text-sm transition-colors focus:ring-2 focus:outline-none"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-foreground block text-sm font-medium">
              دسته‌بندی
            </label>
            <select className="border-border bg-background text-foreground focus:border-primary focus:ring-primary/20 w-full rounded-xl border px-4 py-3 text-sm transition-colors focus:ring-2 focus:outline-none">
              <option value="">انتخاب دسته‌بندی</option>
              <option value="food">خوراک</option>
              <option value="transport">حمل و نقل</option>
              <option value="entertainment">سرگرمی</option>
              <option value="salary">حقوق</option>
              <option value="freelance">فریلنس</option>
            </select>
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <label className="text-foreground block text-sm font-medium">
              روش پرداخت
            </label>
            <select className="border-border bg-background text-foreground focus:border-primary focus:ring-primary/20 w-full rounded-xl border px-4 py-3 text-sm transition-colors focus:ring-2 focus:outline-none">
              <option value="">انتخاب روش پرداخت</option>
              <option value="cash">نقدی</option>
              <option value="card">کارت بانکی</option>
              <option value="online">آنلاین</option>
            </select>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <label className="text-foreground block text-sm font-medium">
              تاریخ
            </label>
            <input
              type="text"
              placeholder="1404/09/28"
              className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 w-full rounded-xl border px-4 py-3 text-sm transition-colors focus:ring-2 focus:outline-none"
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <label className="text-foreground block text-sm font-medium">
              وضعیت
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
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
              ].map((status) => (
                <label
                  key={status.value}
                  className={`border-border relative flex h-12 cursor-pointer items-center justify-center rounded-xl border transition-all`}
                >
                  <input
                    type="radio"
                    name="status"
                    value={status.value}
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
              className="border-border hover:bg-accent flex-1 rounded-xl border px-4 py-3 text-sm font-medium transition-colors"
            >
              انصراف
            </button>
            <button
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary/90 flex-1 rounded-xl px-4 py-3 text-sm font-medium shadow-lg transition-all hover:shadow-xl"
            >
              ذخیره تراکنش
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
