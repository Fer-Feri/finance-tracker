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

  addTransaction: (data: Omit<Transaction, "id">) => void;
  deleteTransaction: (id: string) => void;
  getTransactionById: (id: string) => Transaction | undefined;

  // =============paginate==================
  page: number; // صفحه فعلی
  pageSize: number; // تعداد آیتم در هر صفحه
  setPage: (page: number) => void; // تغییر صفحه
  setPageSize: (size: number) => void; // تنظیم اندازه صفحه
  paginatedTransactions: () => Transaction[]; // داده‌های برش خورده
  totalTransactions: () => number; // مجموع تراکنش‌ها
}

export const useTransactionModalStore = create<TransactionModalState>(
  (set, get) => ({
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

    addTransaction: (data) =>
      set((state) => {
        const newTransaction: Transaction = {
          ...data,
          id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // ID یونیک
        };

        return {
          transactions: [newTransaction, ...state.transactions],
        };
      }),

    deleteTransaction: (id) =>
      set((state) => ({
        transactions: state.transactions.filter(
          (transaction) => transaction.id !== id,
        ),
      })),

    getTransactionById: (id) => {
      return get().transactions.find((transaction) => transaction.id === id);
    },

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

    // ==============================================================
    // =======================Pagination=============================
    // ==============================================================
    page: 1,
    pageSize: 10,

    setPage: (page) => {
      const total = get().transactions.length;
      const pageSize = get().pageSize;
      const maxPage = Math.max(1, Math.ceil(total / pageSize));

      set({ page: Math.min(Math.max(page, 1), maxPage) });
    },

    setPageSize: (size) =>
      set((state) => ({
        pageSize: size,
        page: 1, // برگرداندن به صفحه اول برای جلوگیری از صفحه‌های خارج از محدوده
      })),

    paginatedTransactions: () => {
      const { transactions, page, pageSize } = get();
      const start = (page - 1) * pageSize;
      return transactions.slice(start, start + pageSize);
    },

    totalTransactions: () => get().transactions.length,
  }),
);
