// components/modals/AddTransactionModal.tsx

"use client";

import { useEffect, useMemo, useRef } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { useClickOutside } from "@/hooks/useClickOutside";
import { cn } from "@/lib/utils";
import { X, Loader2 } from "lucide-react";
import CurrencyInput from "../ui/currency-input/CurrencyInput";
import { PersianDatePicker } from "../ui/PersianDatePicker";
import { useTransactionStore } from "@/store/transactionStore";
import { TransactionType, TransactionStatus } from "@/types/transaction";
import moment from "jalali-moment";
import { useCreateTransaction } from "@/hooks/useCreateTransaction";
import { useCategories } from "@/hooks/useCategories";
import { useUpdateTransaction } from "@/hooks/useUpdateTransaction";

// ==================== TYPES ====================

interface TransactionFormData {
  type: TransactionType;
  amount: number;
  description: string;
  categoryId: string;
  paymentMethod: "card" | "online" | "cash";
  status: TransactionStatus;
  date: string;
}

interface Category {
  id: string;
  name: string;
  type: "INCOME" | "EXPENSE";
  icon: string;
}

interface Payment {
  value: string;
  label: string;
}

// ==================== CONSTANTS ====================

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

// ==================== HELPER FUNCTIONS ====================

const getTodayPersianDate = (): string => {
  return moment().locale("fa").format("jYYYY/jMM/jDD");
};

// ==================== MAIN COMPONENT ====================

export default function AddTransactionModal() {
  // ========== Store & Hooks ==========
  const {
    isAddModalOpen,
    setIsAddModalOpen,
    typeModal,
    selectedTransaction,
    editTransaction,
  } = useTransactionStore();

  const { mutate: createTransaction, isPending: isCreating } =
    useCreateTransaction();
  const { mutate: updateTransaction, isPending: isUpdating } =
    useUpdateTransaction();
  const { data: categories = [], isLoading: categoriesLoading } =
    useCategories();

  const isPending = isCreating || isUpdating;

  const refElem = useRef(null);

  // ========== React Hook Form Setup ==========
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<TransactionFormData>({
    defaultValues: {
      type: "expense",
      amount: 0,
      description: "",
      categoryId: "",
      paymentMethod: "card",
      status: "completed",
      date: getTodayPersianDate(),
    },
  });

  // ========== Watch Form Values ==========
  const selectedType = useWatch({ control, name: "type" });
  const currentCategoryId = useWatch({ control, name: "categoryId" });

  // ========== Filter Categories by Type ==========
  const filteredCategories = useMemo(() => {
    if (!categories || categories.length === 0) return [];

    return categories.filter(
      (cat: Category) => cat.type.toLowerCase() === selectedType,
    );
  }, [categories, selectedType]);

  // ========== Initialize Form in Add Mode ==========
  /**
   * ✅ فقط در باز شدن modal و در حالت add اجرا میشه
   */
  useEffect(() => {
    if (isAddModalOpen && typeModal === "add" && !categoriesLoading) {
      reset({
        type: "expense",
        amount: 0,
        description: "",
        categoryId: filteredCategories[0]?.id || "",
        paymentMethod: "card",
        status: "completed",
        date: getTodayPersianDate(),
      });
    }
  }, [isAddModalOpen, typeModal]); // ✅ فقط وابسته به باز/بسته شدن modal

  // ========== Auto-select First Category When Type Changes ==========
  /**
   * ✅ فقط وقتی type عوض میشه و category فعلی invalid شده
   */
  useEffect(() => {
    if (typeModal === "edit") return;

    if (filteredCategories.length === 0) return;

    const isCurrentCategoryValid = filteredCategories.some(
      (cat) => cat.id === currentCategoryId,
    );

    // ✅ فقط اگر category فعلی invalid شده باشه، اولین یکی رو انتخاب میکنیم
    if (!isCurrentCategoryValid) {
      setValue("categoryId", filteredCategories[0].id, {
        shouldValidate: false, // ✅ از trigger شدن validation جلوگیری میکنه
        shouldDirty: false, // ✅ از dirty شدن فرم جلوگیری میکنه
      });
    }
  }, [
    selectedType,
    filteredCategories,
    currentCategoryId,
    setValue,
    typeModal,
  ]); // ✅ فقط وقتی type یا categories تغییر کنه

  // ========== Populate Form in Edit Mode ==========
  /**
   * ✅ فقط یکبار وقتی modal در حالت edit باز میشه
   */
  useEffect(() => {
    if (isAddModalOpen && typeModal === "edit" && selectedTransaction) {
      const rawDate = selectedTransaction.date;

      let jalaliDate: string;

      if (typeof rawDate === "string" && rawDate.includes("/")) {
        jalaliDate = rawDate;
      } else {
        jalaliDate = moment(rawDate).format("jYYYY/jMM/jDD");
      }

      reset({
        type: selectedTransaction.type,
        amount: selectedTransaction.amount,
        description: selectedTransaction.description || "",
        categoryId: selectedTransaction.categoryId,
        paymentMethod: (selectedTransaction.paymentMethod?.toLowerCase() ||
          "online") as "card" | "online" | "cash",
        status: selectedTransaction.status.toLowerCase() as TransactionStatus,
        date: jalaliDate,
      });
    }
  }, [
    isAddModalOpen,
    typeModal,
    selectedTransaction?.id,
    reset,
    selectedTransaction,
  ]); // ✅ فقط وقتی modal باز میشه یا transaction تغییر کنه

  // ========== Close Modal on Outside Click ==========
  useClickOutside(refElem, () => {
    setIsAddModalOpen(false);
    reset();
  });

  // ========== Form Submit Handler ==========

  const onSubmit = (data: TransactionFormData) => {
    if (!data.amount || data.amount <= 0) {
      console.error("❌ Invalid amount:", data.amount);
      return;
    }

    if (!data.categoryId) {
      console.error("❌ Category not selected");
      return;
    }

    const transactionData = {
      type: data.type.toUpperCase() as "INCOME" | "EXPENSE",
      amount: Number(data.amount),
      description: data.description,
      categoryId: data.categoryId,
      paymentMethod: data.paymentMethod.toUpperCase() as
        | "CARD"
        | "ONLINE"
        | "CASH",
      status: data.status.toUpperCase() as "COMPLETED" | "PENDING" | "FAILED",
      date: data.date, // ✅ شمسی میره به بک‌اند
    };

    if (typeModal === "add") {
      createTransaction(transactionData, {
        onSuccess: () => {
          setIsAddModalOpen(false);
          reset({
            type: "expense",
            amount: 0,
            description: "",
            categoryId: "",
            paymentMethod: "card",
            status: "completed",
            date: getTodayPersianDate(),
          });
        },
      });
    }

    if (typeModal === "edit" && selectedTransaction?.id) {
      updateTransaction(
        {
          id: selectedTransaction.id,
          data: transactionData,
        },
        {
          onSuccess: () => {
            setIsAddModalOpen(false);
            reset();
          },
        },
      );
    }
  };

  // ========== Render Nothing if Modal is Closed ==========
  if (!isAddModalOpen) return null;

  // ==================== RENDER ====================
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div
        ref={refElem}
        className="bg-card border-border no-scrollbar animate-in fade-in zoom-in-95 relative flex h-[90vh] w-full max-w-2xl flex-col overflow-auto rounded-2xl border p-6 shadow-2xl"
      >
        {/* ========== HEADER ========== */}
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
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="bg-border mb-6 h-px w-full" />

        {/* ========== FORM ========== */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* ========== TRANSACTION TYPE ========== */}
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

          {/* ========== AMOUNT ========== */}
          <div className="space-y-2">
            <label className="text-foreground block text-sm font-medium">
              مبلغ (تومان) *
            </label>
            <Controller
              name="amount"
              control={control}
              rules={{
                required: "مبلغ الزامی است",
                min: { value: 1, message: "مبلغ باید بیشتر از صفر باشد" },
              }}
              render={({ field }) => (
                <CurrencyInput
                  value={field.value}
                  onChange={(value) => field.onChange(value || 0)}
                />
              )}
            />
            {errors.amount && (
              <p className="text-destructive text-xs">
                {errors.amount.message}
              </p>
            )}
          </div>

          {/* ========== DESCRIPTION ========== */}
          <div className="space-y-2">
            <label className="text-foreground block text-sm font-medium">
              توضیحات *
            </label>
            <Controller
              name="description"
              control={control}
              rules={{ required: "توضیحات الزامی است" }}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  placeholder="مثال: خرید مواد غذایی"
                  className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 w-full rounded-xl border px-4 py-3 text-sm transition-colors focus:ring-2 focus:outline-none"
                />
              )}
            />
            {errors.description && (
              <p className="text-destructive text-xs">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* ========== CATEGORY ========== */}
          <div className="bg-muted/50 space-y-2 rounded-md p-4">
            <label className="text-foreground block text-sm font-medium">
              دسته‌بندی *
            </label>

            {categoriesLoading ? (
              <div className="text-muted-foreground flex items-center justify-center gap-2 py-8 text-sm">
                <Loader2 className="h-4 w-4 animate-spin" />
                در حال بارگذاری...
              </div>
            ) : filteredCategories.length === 0 ? (
              <div className="text-muted-foreground py-8 text-center text-sm">
                دسته‌بندی‌ای برای این نوع تراکنش یافت نشد
              </div>
            ) : (
              <Controller
                name="categoryId"
                control={control}
                rules={{ required: "انتخاب دسته‌بندی الزامی است" }}
                render={({ field }) => (
                  <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                    {filteredCategories.map((category: Category) => (
                      <label
                        key={category.id}
                        className="border-border hover:border-primary relative flex cursor-pointer items-center justify-center rounded-xl border transition-all"
                      >
                        <input
                          {...field}
                          type="radio"
                          value={category.id}
                          checked={field.value === category.id}
                          className="peer sr-only"
                        />
                        <div className="peer-checked:bg-primary peer-checked:text-primary-foreground flex h-full w-full items-center gap-2 rounded-lg p-4 transition-colors">
                          <span className="text-xl">{category.icon}</span>
                          <span className="text-sm font-medium">
                            {category.name}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              />
            )}
            {errors.categoryId && (
              <p className="text-destructive text-xs">
                {errors.categoryId.message}
              </p>
            )}
          </div>

          {/* ========== PAYMENT METHOD ========== */}
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

          {/* ========== DATE ========== */}
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

          {/* ========== STATUS ========== */}
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

          {/* ========== ACTION BUTTONS ========== */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setIsAddModalOpen(false);
                reset();
              }}
              className="border-border hover:bg-accent flex-1 rounded-xl border px-4 py-3 text-sm font-medium transition-colors"
              disabled={isPending}
            >
              انصراف
            </button>

            <button
              type="submit"
              disabled={isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90 flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium shadow-lg transition-all disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  در حال ذخیره...
                </>
              ) : typeModal === "add" ? (
                "افزودن تراکنش"
              ) : (
                "ذخیره تراکنش"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
