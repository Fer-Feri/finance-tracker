import {
  Transaction,
  TransactionStatus,
  TransactionType,
} from "@/types/transaction";
import { create } from "zustand";
import moment from "jalali-moment";

interface TransactionStoreType {
  transactions: Transaction[];

  // ========== Pagination State ==========
  currentPage: number;
  itemPerPage: number;

  // ========== Filter State ==========
  searchValue: string;
  filters: {
    type: "all" | TransactionType;
    statuses: TransactionStatus[]; // ✅ تایپ صحیح
    dateRange: "all" | "today" | "week" | "month";
  };

  // ========== Actions ==========
  // Pagination Actions
  setPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  setItemsPerPage: (items: number) => void;

  // Transaction Data Actions
  setTransactions: (data: Transaction[]) => void;

  // Filter Actions
  setSearchValue: (value: string) => void;
  setFilters: (filters: TransactionStoreType["filters"]) => void;
  setFilterType: (type: TransactionStoreType["filters"]["type"]) => void;
  setFilterStatuses: (statuses: TransactionStatus[]) => void; // ✅ تایپ صحیح
  setFilterDateRange: (
    range: TransactionStoreType["filters"]["dateRange"],
  ) => void;

  // Reset Actions
  resetFilters: () => void;
  resetAll: () => void;

  // Computed
  getFilteredTransactions: () => Transaction[];
  getTotalPages: () => number;
  getPageInfo: () => {
    currentPage: number;
    totalPages: number;
    startItem: number;
    endItem: number;
    totalItems: number;
  };

  deleteTransaction: (id: string) => void;
}

export const useTransactionStore = create<TransactionStoreType>((set, get) => ({
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

  // ========== Pagination Actions ==========
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

  // ========== Transaction Data Actions ==========
  setTransactions: (data) => set({ transactions: data, currentPage: 1 }),

  // ========== Filter Actions ==========
  setSearchValue: (value) =>
    set({
      searchValue: value,
      currentPage: 1,
    }),

  setFilters: (filters) =>
    set({
      filters,
      currentPage: 1,
    }),

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

  // ========== Reset Actions ==========
  resetFilters: () =>
    set({
      searchValue: "",
      filters: {
        type: "all",
        statuses: [],
        dateRange: "all",
      },
      currentPage: 1,
    }),

  resetAll: () =>
    set({
      currentPage: 1,
      itemPerPage: 10,
      searchValue: "",
      filters: {
        type: "all",
        statuses: [],
        dateRange: "all",
      },
    }),

  // ========== Computed: Filtered Transactions ==========
  getFilteredTransactions: () => {
    const { transactions, searchValue, filters } = get();
    let filtered = [...transactions];

    // STEP 1: Search Filter
    if (searchValue.trim()) {
      const search = searchValue.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.description?.toLowerCase().includes(search) ||
          t.category?.toLowerCase().includes(search),
      );
    }

    // STEP 2: Type Filter
    if (filters.type !== "all") {
      filtered = filtered.filter((t) => t.type === filters.type);
    }

    // STEP 3: Status Filter
    if (filters.statuses.length > 0) {
      // ✅ حذف as any
      filtered = filtered.filter((t) => filters.statuses.includes(t.status));
    }

    // STEP 4: Date Range Filter
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

  // ========== Computed: Total Pages ==========
  getTotalPages: () => {
    const filtered = get().getFilteredTransactions();
    const { itemPerPage } = get();
    return Math.max(Math.ceil(filtered.length / itemPerPage), 1);
  },

  // ========== Computed: Page Info ==========
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

  deleteTransaction: (id: string) => {
    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== id),
    }));
  },
}));
