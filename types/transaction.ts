export type transactionType = "income" | "expense";

export type TransactionStatus = "pending" | "completed" | "failed";

export interface Transaction {
  id: string;
  description: string;
  category: string;
  date: string; // ISO date string
  amount: number;
  type: transactionType;
  status: TransactionStatus;
  paymentMethod?: string;
}
