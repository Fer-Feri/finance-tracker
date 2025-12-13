import { Transaction } from "./transaction";

// نوع تراکنش (فقط درآمد و هزینه)
export type TransactionTypeForm = "income" | "expense";

// دسته‌بندی تراکنش‌ها
export type TransactionCategoryForm =
  // دسته‌های درآمد
  | "salary"
  | "freelance"
  | "investment"
  | "gift"
  // دسته‌های هزینه
  | "food"
  | "transport"
  | "shopping"
  | "bills"
  | "entertainment"
  | "health"
  | "education"
  | "other";

// روش پرداخت
export type PaymentMethodForm = "cash" | "card" | "bank_transfer" | "wallet";

// وضعیت تراکنش
export type TransactionStatusForm = "completed" | "pending" | "failed";

// Interface فرم
export interface TransactionFormData {
  type: TransactionTypeForm;
  amount: number;
  category: TransactionCategoryForm;
  description: string;
  paymentMethod: PaymentMethodForm;
  date: string;
  status: TransactionStatusForm;
  notes?: string;
}

// Props Modal
export interface AddTransactionModalProps {
  isOpen: boolean;
  mode: "add" | "edit";
  selectedTransactionId: string | null;
  selectedTransaction: Transaction | null;
  // initialData?: TransactionFormData;
  onClose: () => void;
  // onSubmit: (data: TransactionFormData) => void;
}
