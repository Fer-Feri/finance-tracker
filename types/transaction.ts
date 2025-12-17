export type TransactionType = "income" | "expense";

export type TransactionStatus = "pending" | "completed" | "failed";

export interface Transaction {
  id: string;
  description?: string;
  category: string;
  date: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  paymentMethod?: string;
}
