// store/transactionStore.ts

import {
  Transaction,
  TransactionStatus,
  TransactionType,
} from "@/types/transaction";
import { create } from "zustand";
import moment from "jalali-moment";

interface TransactionStoreType {
  transactions: Transaction[];

  // ========== Pagination ==========
  currentPage: number;
  itemPerPage: number;

  // ========== Filter ==========
  searchValue: string;
  filters: {
    type: "all" | TransactionType;
    statuses: TransactionStatus[];
    dateRange: "all" | "today" | "week" | "month";
  };

  // ========== Modal State ==========
  isAddModalOpen: boolean;
  typeModal: "add" | "edit";
  selectedTransaction: Transaction | null;

  // ========== Actions ==========
  setPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  setItemsPerPage: (items: number) => void;
  setTransactions: (data: Transaction[]) => void;
  setSearchValue: (value: string) => void;
  setFilters: (filters: TransactionStoreType["filters"]) => void;
  setFilterType: (type: TransactionStoreType["filters"]["type"]) => void;
  setFilterStatuses: (statuses: TransactionStatus[]) => void;
  setFilterDateRange: (
    range: TransactionStoreType["filters"]["dateRange"],
  ) => void;
  resetFilters: () => void;
  resetAll: () => void;
  getFilteredTransactions: () => Transaction[];
  getTotalPages: () => number;
  getPageInfo: () => {
    currentPage: number;
    totalPages: number;
    startItem: number;
    endItem: number;
    totalItems: number;
  };

  // ========== CRUD Operations ==========
  addTransaction: (transaction: Omit<Transaction, "id">) => void;
  editTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;

  // ========== Modal Actions ==========
  setIsAddModalOpen: (isOpen: boolean) => void;
  setTypeModal: (type: "add" | "edit") => void;
  setSelectedTransaction: (transaction: Transaction | null) => void;
  openAddModal: () => void;
  openEditModal: (transaction: Transaction) => void;
}

export const useTransactionStore = create<TransactionStoreType>()(
  (set, get) => ({
    // ========== Initial State ==========
    transactions: [],
    currentPage: 1,
    itemPerPage: 10,
    searchValue: "",
    filters: {
      type: "all",
      statuses: [],
      dateRange: "all",
    },
    isAddModalOpen: false,
    typeModal: "add",
    selectedTransaction: null,

    // ========== Pagination ==========
    setPage: (page) => set({ currentPage: page }),
    nextPage: () => {
      const { currentPage } = get();
      const totalPages = get().getTotalPages();
      if (currentPage < totalPages) {
        set({ currentPage: currentPage + 1 });
      }
    },
    prevPage: () => {
      const { currentPage } = get();
      if (currentPage > 1) {
        set({ currentPage: currentPage - 1 });
      }
    },
    setItemsPerPage: (items) => set({ itemPerPage: items, currentPage: 1 }),

    // ========== Transaction Data ==========
    setTransactions: (data) => set({ transactions: data, currentPage: 1 }),

    // ========== Filters ==========
    setSearchValue: (value) => set({ searchValue: value, currentPage: 1 }),
    setFilters: (filters) => set({ filters, currentPage: 1 }),
    setFilterType: (type) =>
      set((state) => ({
        filters: { ...state.filters, type },
        currentPage: 1,
      })),
    setFilterStatuses: (statuses) =>
      set((state) => ({
        filters: { ...state.filters, statuses },
        currentPage: 1,
      })),
    setFilterDateRange: (dateRange) =>
      set((state) => ({
        filters: { ...state.filters, dateRange },
        currentPage: 1,
      })),
    resetFilters: () =>
      set({
        searchValue: "",
        filters: { type: "all", statuses: [], dateRange: "all" },
        currentPage: 1,
      }),
    resetAll: () =>
      set({
        currentPage: 1,
        itemPerPage: 10,
        searchValue: "",
        filters: { type: "all", statuses: [], dateRange: "all" },
      }),

    // ========== Computed ==========
    getFilteredTransactions: () => {
      const { transactions, searchValue, filters } = get();
      let filtered = [...transactions];

      if (searchValue.trim()) {
        const search = searchValue.toLowerCase();
        filtered = filtered.filter(
          (t) =>
            t.description?.toLowerCase().includes(search) ||
            t.category?.toLowerCase().includes(search),
        );
      }

      if (filters.type !== "all") {
        filtered = filtered.filter((t) => t.type === filters.type);
      }

      if (filters.statuses.length > 0) {
        filtered = filtered.filter((t) => filters.statuses.includes(t.status));
      }

      if (filters.dateRange !== "all") {
        const now = moment().locale("fa");
        let startDate: moment.Moment;

        switch (filters.dateRange) {
          case "today":
            startDate = now.clone().startOf("day");
            break;
          case "week":
            startDate = now.clone().startOf("week");
            break;
          case "month":
            startDate = now.clone().startOf("jMonth");
            break;
          default:
            startDate = now;
        }

        filtered = filtered.filter((t) => {
          const transactionDate = moment(t.date, "jYYYY/jMM/jDD").locale("fa");
          return transactionDate.isSameOrAfter(startDate, "day");
        });
      }

      return filtered;
    },

    getTotalPages: () => {
      const filtered = get().getFilteredTransactions();
      const { itemPerPage } = get();
      return Math.max(Math.ceil(filtered.length / itemPerPage), 1);
    },

    getPageInfo: () => {
      const { currentPage, itemPerPage } = get();
      const filtered = get().getFilteredTransactions();
      const totalItems = filtered.length;
      const totalPages = Math.max(Math.ceil(totalItems / itemPerPage), 1);
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

    // ========== CRUD Operations ==========
    addTransaction: (transaction) =>
      set((state) => ({
        transactions: [
          {
            ...transaction,
            id: `TRX${Date.now()}`,
          },
          ...state.transactions,
        ],
      })),

    editTransaction: (id, updatedData) =>
      set((state) => ({
        transactions: state.transactions.map((t) =>
          t.id === id ? { ...t, ...updatedData } : t,
        ),
      })),

    deleteTransaction: (id) =>
      set((state) => ({
        transactions: state.transactions.filter((t) => t.id !== id),
      })),

    // ========== Modal Actions ==========
    setIsAddModalOpen: (isOpen) => set({ isAddModalOpen: isOpen }),
    setTypeModal: (type) => set({ typeModal: type }),
    setSelectedTransaction: (transaction) =>
      set({ selectedTransaction: transaction }),

    openAddModal: () =>
      set({
        isAddModalOpen: true,
        typeModal: "add",
        selectedTransaction: null,
      }),

    openEditModal: (transaction) =>
      set({
        isAddModalOpen: true,
        typeModal: "edit",
        selectedTransaction: transaction,
      }),
  }),
);
