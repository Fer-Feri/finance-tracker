import {
  PaymentMethodForm,
  TransactionCategoryForm,
  TransactionTypeForm,
} from "@/types/transaction-form";
import {
  Banknote,
  Building2,
  Car,
  Coffee,
  CreditCard,
  Gift,
  GraduationCap,
  Heart,
  LucideIcon,
  MoreHorizontal,
  ShoppingBag,
  Smartphone,
  TrendingDown,
  TrendingUp,
  Wallet,
  Zap,
} from "lucide-react";

// نوع تراکنش
export interface TransactionTypeFormOption {
  value: TransactionTypeForm;
  label: string;
  icon: LucideIcon;
  colorClass: string;
  bgClass: string;
}

export const TransactionDataTypeFormModal: TransactionTypeFormOption[] = [
  {
    value: "income",
    label: "درآمد",
    icon: TrendingUp,
    colorClass: "text-green-500",
    bgClass: "bg-green-500/10 border-green-500",
  },
  {
    value: "expense",
    label: "هزینه",
    icon: TrendingDown,
    colorClass: "text-red-500",
    bgClass: "bg-red-500/10 border-red-500",
  },
];

// دسته‌بندی‌ها
export interface CategoryOptionForm {
  value: TransactionCategoryForm;
  label: string;
  icon: LucideIcon;
  types: TransactionTypeForm[];
}

export const CategoryDataOptionFormModal: CategoryOptionForm[] = [
  // درآمد
  { value: "salary", label: "حقوق", icon: Wallet, types: ["income"] },
  { value: "freelance", label: "فریلنسر", icon: TrendingUp, types: ["income"] },
  {
    value: "investment",
    label: "سرمایه‌گذاری",
    icon: TrendingUp,
    types: ["income"],
  },
  { value: "gift", label: "هدیه", icon: Gift, types: ["income"] },

  // هزینه
  { value: "food", label: "غذا", icon: Coffee, types: ["expense"] },
  { value: "transport", label: "حمل‌ونقل", icon: Car, types: ["expense"] },
  { value: "shopping", label: "خرید", icon: ShoppingBag, types: ["expense"] },
  { value: "bills", label: "قبوض", icon: Zap, types: ["expense"] },
  { value: "entertainment", label: "سرگرمی", icon: Heart, types: ["expense"] },
  { value: "health", label: "بهداشت", icon: Heart, types: ["expense"] },
  {
    value: "education",
    label: "آموزش",
    icon: GraduationCap,
    types: ["expense"],
  },

  // مشترک
  {
    value: "other",
    label: "سایر",
    icon: MoreHorizontal,
    types: ["income", "expense"],
  },
];

// روش پرداخت
export interface PaymentMethodOptionForm {
  value: PaymentMethodForm;
  label: string;
  icon: LucideIcon;
}

export const PaymentMethodDataFormModal: PaymentMethodOptionForm[] = [
  {
    value: "cash",
    label: "نقدی",
    icon: Banknote,
  },
  { value: "card", label: "کارت بانکی", icon: CreditCard },
  { value: "bank_transfer", label: "انتقال بانکی", icon: Building2 },
  { value: "wallet", label: "کیف پول", icon: Smartphone },
];
