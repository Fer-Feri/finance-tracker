import {
  Transaction,
  TransactionStatus,
  TransactionType,
} from "@/types/transaction";
import { create } from "zustand";
import moment from "jalali-moment";
import { getCurrentJalaliYearMonth } from "@/utils/date/dateHelpers";

interface TransactionStoreType {
  transactions: Transaction[];
  currentPage: number;
  itemPerPage: number;
  searchValue: string;
  filters: {
    type: "all" | TransactionType;
    statuses: TransactionStatus[];
    dateRange: "all" | "today" | "week" | "month" | "custom";
    customYear?: number;
    customMonth?: number;
  };
  isAddModalOpen: boolean;
  typeModal: "add" | "edit";
  selectedTransaction: Transaction | null;

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
  addTransaction: (transaction: Omit<Transaction, "id">) => void;
  editTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  setIsAddModalOpen: (isOpen: boolean) => void;
  setTypeModal: (type: "add" | "edit") => void;
  setSelectedTransaction: (transaction: Transaction | null) => void;
  openAddModal: () => void;
  openEditModal: (transaction: Transaction) => void;
}

export const useTransactionStore = create<TransactionStoreType>()((
  set,
  get,
) => {
  const { year: currentYear, month: currentMonth } =
    getCurrentJalaliYearMonth();

  return {
    transactions: [],
    currentPage: 1,
    itemPerPage: 10,
    searchValue: "",
    filters: {
      type: "all",
      statuses: [],
      dateRange: "month",
      customYear: currentYear,
      customMonth: currentMonth,
    },
    isAddModalOpen: false,
    typeModal: "add",
    selectedTransaction: null,

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
    setTransactions: (data) => set({ transactions: data, currentPage: 1 }),
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

    resetFilters: () => {
      const { year, month } = getCurrentJalaliYearMonth();
      set({
        searchValue: "",
        filters: {
          type: "all",
          statuses: [],
          dateRange: "month",
          customYear: year,
          customMonth: month,
        },
        currentPage: 1,
      });
    },

    resetAll: () => {
      const { year, month } = getCurrentJalaliYearMonth();
      set({
        currentPage: 1,
        itemPerPage: 10,
        searchValue: "",
        filters: {
          type: "all",
          statuses: [],
          dateRange: "month",
          customYear: year,
          customMonth: month,
        },
      });
    },

    // ✅ تابع اصلی - تصحیح شده
    getFilteredTransactions: () => {
      const { transactions, searchValue, filters } = get();
      let filtered = [...transactions];

      // ========== ۱. فیلتر تاریخ (اولویت اول) ==========
      if (filters.dateRange !== "all") {
        if (
          filters.dateRange === "custom" &&
          filters.customYear &&
          filters.customMonth
        ) {
          filtered = filtered.filter((transaction) => {
            const transactionDate = moment(transaction.date, "jYYYY/jMM/jDD");
            const filterYear = Number(filters.customYear);
            const filterMonth = Number(filters.customMonth);

            return (
              transactionDate.jYear() === filterYear &&
              transactionDate.jMonth() + 1 === filterMonth
            );
          });
        } else {
          const now = moment().locale("fa");
          let startDate: moment.Moment;

          switch (filters.dateRange) {
            case "today":
              startDate = now.clone().startOf("day");
              break;
            case "month":
              startDate = now.clone().startOf("jMonth");
              break;
            default:
              startDate = now;
          }

          filtered = filtered.filter((t) => {
            const transactionDate = moment(t.date, "jYYYY/jMM/jDD").locale(
              "fa",
            );
            return transactionDate.isSameOrAfter(startDate, "day");
          });
        }
      }

      // ========== ۲. فیلتر جستجو ==========
      if (searchValue.trim()) {
        const search = searchValue.toLowerCase();
        filtered = filtered.filter(
          (t) =>
            t.description?.toLowerCase().includes(search) ||
            t.category?.toLowerCase().includes(search),
        );
      }

      // ========== ۳. فیلتر نوع ==========
      if (filters.type !== "all") {
        filtered = filtered.filter((t) => t.type === filters.type);
      }

      // ========== ۴. فیلتر وضعیت ==========
      if (filters.statuses.length > 0) {
        filtered = filtered.filter((t) => filters.statuses.includes(t.status));
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
  };
});
