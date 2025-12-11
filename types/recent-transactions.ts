export type TransactionType = "income" | "expense";
export type TransactionStatus = "pending" | "completed" | "failed";

export interface RecentTransactionProps {
  id: string;
  title: string;
  category: string;
  amount: number;
  date: string;
  type: TransactionType;
  status: TransactionStatus;
}
