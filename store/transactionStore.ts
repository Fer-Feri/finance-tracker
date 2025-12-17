import { Transaction } from "@/types/transaction";
import { create } from "zustand";

interface TransactionStoreType {
  transactions: Transaction[];

  currentPage: number;
  itemPerPage: number;

  setPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;

  setTransactions: (data: Transaction[]) => void;

  getPaginatedTransactions: () => Transaction[];
  getTotalPages: () => number;
  getPageInfo: () => {
    currentPage: number;
    totalPages: number;
    startItem: number;
    endItem: number;
    totalItems: number;
  };
}

export const useTransactionStore = create<TransactionStoreType>((set, get) => ({
  transactions: [],

  currentPage: 1,
  itemPerPage: 10,

  setPage: (page) => set({ currentPage: page }),

  nextPage: () => {
    const { currentPage } = get();
    const totalPages = get().getTotalPages();
    if (currentPage < totalPages) set({ currentPage: currentPage + 1 });
  },

  prevPage: () => {
    const { currentPage } = get();
    if (currentPage > 1) set({ currentPage: currentPage - 1 });
  },

  setTransactions: (data) => set({ transactions: data }),

  getPaginatedTransactions: () => {
    const { currentPage, itemPerPage, transactions } = get();

    const startIndex = (currentPage - 1) * itemPerPage;
    const endIndex = startIndex + itemPerPage;

    return transactions.slice(startIndex, endIndex);
  },

  getTotalPages: () => {
    const { transactions, itemPerPage } = get();
    return Math.ceil(transactions.length / itemPerPage);
  },
  getPageInfo: () => {
    const { currentPage, transactions, itemPerPage } = get();
    const totalPages = transactions.length / itemPerPage;
    const totalItems = transactions.length;
    const startItem =
      totalItems === 0 ? 0 : (currentPage - 1) * itemPerPage + 1;
    const endItem = Math.min(currentPage * itemPerPage, totalItems);
    return {
      currentPage,
      totalPages,
      totalItems,
      startItem,
      endItem,
    };
  },
}));
