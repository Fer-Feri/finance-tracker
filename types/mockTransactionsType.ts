// src/types/transaction.ts
export interface MockTransactionType {
  id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  date: string; // فرمت: 'YYYY-MM-DD' (شمسی)
  description: string;
}
