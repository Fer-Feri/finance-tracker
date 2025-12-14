import { create } from "zustand";
import { YearlySummary } from "@/types/reports";
import { calculateYearSummary } from "@/lib/reports-calculator";
import { useTransactionModalStore } from "./transactionModal-store";
import { Transaction } from "@/types/transaction";

interface ReportsState {
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  getYearlyReport: (year?: number) => YearlySummary;
  getMonthTransactions: (year: number, month: number) => Transaction[];
}

export const useReportsStore = create<ReportsState>((set, get) => ({
  selectedYear: 1404,

  setSelectedYear: (year: number) => set({ selectedYear: year }),

  getYearlyReport: (year?: number) => {
    const targetYear = year ?? get().selectedYear;
    const transactions = useTransactionModalStore.getState().transactions;
    return calculateYearSummary(transactions, targetYear);
  },

  getMonthTransactions: (year, month) => {
    const { transactions } = useTransactionModalStore.getState();
    return transactions.filter((tnx) => {
      const [txYear, txMonth] = tnx.date.split("/").map(Number);
      return txYear === year && txMonth === month;
    });
  },
}));
