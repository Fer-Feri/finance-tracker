import { Transaction } from "@/types/transaction";
import { create } from "zustand";

type modalMode = "add" | "edit";

interface TransactionModalState {
  isOpen: boolean;
  mode: modalMode;
  selectedTransactionId: string | null;
  selectedTransaction: Transaction | null;
  transactions: Transaction[];

  openAdd: () => void;
  openEdit: (id: string, transaction: Transaction) => void;
  onClose: () => void;

  setTransactions: (transactions: Transaction[]) => void;
  updateTransaction: (id: string, updateData: Partial<Transaction>) => void;
}

export const useTransactionModalStore = create<TransactionModalState>(
  (set) => ({
    isOpen: false,
    mode: "add",
    selectedTransactionId: null,
    selectedTransaction: null,
    transactions: [],

    setTransactions: (transactions) => set({ transactions }),

    updateTransaction: (id, updatedData) =>
      set((state) => ({
        transactions: state.transactions.map((transaction) =>
          transaction.id === id
            ? { ...transaction, ...updatedData }
            : transaction,
        ),
      })),

    openAdd: () =>
      set({
        isOpen: true,
        mode: "add",
        selectedTransactionId: null,
        selectedTransaction: null,
      }),

    openEdit: (id: string, transaction: Transaction) =>
      set({
        isOpen: true,
        mode: "edit",
        selectedTransactionId: id,
        selectedTransaction: transaction,
      }),

    onClose: () =>
      set({
        isOpen: false,
        selectedTransactionId: null,
        selectedTransaction: null,
      }),
  }),
);
