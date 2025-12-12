import {
  CategoryDataOptionFormModal,
  PaymentMethodDataFormModal,
  TransactionDataTypeFormModal,
} from "@/config/transaction-form-data";
import { Calendar } from "lucide-react";
import { useState } from "react";

interface FormState {
  description: string;
  amount: number;
}

function getInitialFormState(
  mode: "add" | "edit",
  selectedTransactionId: string | null,
): FormState {
  if (mode === "edit" && selectedTransactionId) {
    return {
      description: `ویرایش تراکنش ${selectedTransactionId}`,
      amount: 5000,
    };
  }

  return {
    description: "",
    amount: 1000,
  };
}

// ==================================================
export default function ModalForm({
  mode,
  selectedTransactionId,
  onClose,
}: {
  mode: "add" | "edit";
  selectedTransactionId: string | null;
  onClose: () => void;
}) {
  // ✅ useState با مقداردهی تنبل
  const [formState, setFormState] = useState<FormState>(() =>
    getInitialFormState(mode, selectedTransactionId),
  );
  // =======================
  return (
    <form className="space-y-6 p-6">
      {/* نوع تراکنش */}
      <div className="space-y-3">
        <label className="text-foreground block text-sm font-medium">
          نوع تراکنش
        </label>
        <div className="grid grid-cols-2 gap-3">
          {TransactionDataTypeFormModal.map((type) => {
            const Icon = type.icon;
            // const isSelected = formData.type === type.value;
            return (
              <button
                key={type.value}
                type="button"
                // onClick={() => handleTypeChange(type.value)}
                // className={cn(
                //   `relative rounded-xl border-2 p-4 transition-all duration-300 ${
                //     isSelected
                //       ? `${type.bgClass} ${type.colorClass} border-current shadow-lg`
                //       : "border-border hover:border-primary/50"
                //   }`,
                // )}
              >
                <div className="flex items-center justify-center gap-3">
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{type.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      {/* مبلغ */}
      <div className="space-y-3">
        <label
          htmlFor="amount"
          className="text-foreground block text-sm font-medium"
        >
          مبلغ (تومان)
        </label>
        <div className="relative">
          <input
            id="amount"
            type="number"
            min="0"
            step="1000"
            value={formState.amount}
            onChange={(e) =>
              setFormState((prev) => ({
                ...prev,
                amount: Number(e.target.value),
              }))
            }
            // onChange={(e) =>
            //   handleInputChange("amount", Number(e.target.value))
            // }
            placeholder="1000"
            required
            className="bg-background border-border focus:ring-primary/50 text-foreground w-full rounded-xl border px-4 py-3 font-mono text-lg transition-all focus:ring-2 focus:outline-none"
          />
          <span className="text-muted-foreground absolute top-1/2 left-8 -translate-y-1/2 text-sm">
            تومان
          </span>
        </div>
      </div>
      {/* دسته‌بندی */}
      <div className="">
        <label
          htmlFor="category"
          className="text-foreground block text-sm font-medium"
        >
          دسته‌بندی
        </label>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {CategoryDataOptionFormModal.map((category) => {
            const Icon = category.icon;
            // const isSelected = formData.category === category.value;

            return (
              <button
                key={category.value}
                type="button"
                // onClick={() =>
                //   handleInputChange("category", category.value)
                // }
                // className={`relative rounded-lg border p-3 transition-all duration-300 ${
                //   isSelected
                //     ? "bg-primary/20 border-primary text-muted-foreground shadow-md"
                //     : "border-border hover:border-primary/50"
                // }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <Icon className="h-5 w-5" />
                  <span className="text-sm">{category.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* توضیحات */}
      <div className="space-y-3">
        <label
          htmlFor="description"
          className="text-foreground block text-sm font-medium"
        >
          توضیحات
        </label>
        <input
          id="description"
          type="text"
          value={formState.description}
          onChange={(e) =>
            setFormState((prev) => ({
              ...prev,
              description: e.target.value,
            }))
          }
          // value={formData.description}
          // onChange={(e) =>
          //   handleInputChange("description", e.target.value)
          // }
          className="bg-background border-border focus:ring-primary/50 text-foreground w-full rounded-xl border px-4 py-3 transition-all focus:ring-2 focus:outline-none"
          placeholder="توضیحات تراکنش را وارد کنید..."
          required
        />
      </div>

      {/* تاریخ و روش پرداخت */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* تاریخ */}
        <div className="space-y-3">
          <label
            htmlFor="date"
            className="text-foreground block text-sm font-medium"
          >
            تاریخ
          </label>
          <div className="relative">
            <input
              id="date"
              type="date"
              // value={formData.date}
              // onChange={(e) =>
              //   handleInputChange("date", e.target.value)
              // }
              className="bg-background border-border focus:ring-primary/50 text-foreground w-full rounded-xl border px-4 py-3 transition-all focus:ring-2 focus:outline-none"
              required
            />
            <Calendar className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
          </div>
        </div>
        {/* روش پرداخت */}
        <div className="space-y-3">
          <label
            htmlFor="paymentMethod"
            className="text-foreground block text-sm font-medium"
          >
            روش پرداخت
          </label>
          <select
            id="paymentMethod"
            // value={formData.paymentMethod}
            // onChange={(e) =>
            //   handleInputChange(
            //     "paymentMethod",
            //     e.target.value as PaymentMethodForm,
            //   )
            // }
            required
            className="bg-background border-border focus:ring-primary/50 text-foreground w-full cursor-pointer rounded-xl border px-4 py-3 transition-all focus:ring-2 focus:outline-none"
          >
            {PaymentMethodDataFormModal.map((method) => (
              <option key={method.value} value={method.value}>
                {method.label}
              </option>
            ))}
          </select>
        </div>
        {/* {mode === "edit" && (
                  <select
                    value={formData.status}
                    onChange={(value) => handleInputChange("status", value)}
                  ></select>
                )} */}
      </div>

      {/* یادداشت (اختیاری) */}
      <div className="space-y-3">
        <label
          htmlFor="notes"
          className="text-foreground block text-sm font-medium"
        >
          یادداشت <span className="text-muted-foreground">(اختیاری)</span>
        </label>
        <textarea
          id="notes"
          rows={3}
          // value={formData.notes}
          // onChange={(e) => handleInputChange("notes", e.target.value)}
          className="bg-background border-border focus:ring-primary/50 text-foreground w-full resize-none rounded-xl border px-4 py-3 transition-all focus:ring-2 focus:outline-none"
          placeholder="یادداشت‌های اضافی..."
        />
      </div>

      {/* دکمه‌های عملیات */}
      <div className="grid grid-cols-1 gap-3 pt-4 sm:grid-cols-2">
        <button
          type="submit"
          className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/25 flex-1 rounded-xl px-6 py-3 font-medium shadow-lg transition-colors"
        >
          {mode === "add" ? " افزودن تراکنش" : "ذخیره تغییرات"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="border-border bg-background/50 hover:bg-background text-foreground flex-1 rounded-xl border px-6 py-3 font-medium transition-colors"
        >
          انصراف
        </button>
      </div>
    </form>
  );
}
