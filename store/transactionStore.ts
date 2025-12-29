import {
  Transaction,
  TransactionStatus,
  TransactionType,
} from "@/types/transaction";
import { create } from "zustand";
import moment from "jalali-moment";
import { getCurrentJalaliYearMonth } from "@/utils/date/dateHelpers";

// ============================================================
// TYPES
// ============================================================

/**
 * تعریف نوع فیلترها
 */
type Filters = {
  type: "all" | TransactionType;
  statuses: TransactionStatus[];
  dateRange: "all" | "today" | "month" | "custom";
  customYear?: number;
  customMonth?: number;
};

/**
 * تعریف نوع Store
 */
interface TransactionStoreType {
  // ========== STATE ==========
  transactions: Transaction[];
  currentPage: number;
  itemPerPage: number;
  searchValue: string;
  filters: Filters;
  isAddModalOpen: boolean;
  typeModal: "add" | "edit";
  selectedTransaction: Transaction | null;

  // ========== PAGINATION ACTIONS ==========
  setPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  setItemsPerPage: (items: number) => void;

  // ========== DATA ACTIONS ==========
  setTransactions: (data: Transaction[]) => void;
  setSearchValue: (value: string) => void;

  // ========== FILTER ACTIONS ==========
  setFilters: (updater: Filters | ((prev: Filters) => Filters)) => void;
  setFilterType: (type: TransactionStoreType["filters"]["type"]) => void;
  setFilterStatuses: (statuses: TransactionStatus[]) => void;
  setFilterDateRange: (
    range: TransactionStoreType["filters"]["dateRange"],
  ) => void;
  resetFilters: () => void;
  resetAll: () => void;

  // ========== COMPUTED VALUES ==========
  getFilteredTransactions: () => Transaction[];
  getTotalPages: () => number;
  getPageInfo: () => {
    currentPage: number;
    totalPages: number;
    startItem: number;
    endItem: number;
    totalItems: number;
  };

  // ========== TRANSACTION CRUD ==========
  addTransaction: (transaction: Omit<Transaction, "id">) => void;
  editTransaction: (id: string, transaction: Partial<Transaction>) => void;
  // deleteTransaction: (id: string) => void;

  // ========== MODAL ACTIONS ==========
  setIsAddModalOpen: (isOpen: boolean) => void;
  setTypeModal: (type: "add" | "edit") => void;
  setSelectedTransaction: (transaction: Transaction | null) => void;
  openAddModal: () => void;
  openEditModal: (transaction: Transaction) => void;
}

// ============================================================
// STORE IMPLEMENTATION
// ============================================================

export const useTransactionStore = create<TransactionStoreType>()((
  set,
  get,
) => {
  // ✅ دریافت سال و ماه جاری برای مقدار پیش‌فرض
  const { year: currentYear, month: currentMonth } =
    getCurrentJalaliYearMonth();

  return {
    // ========== INITIAL STATE ==========
    transactions: [],
    currentPage: 1,
    itemPerPage: 10,
    searchValue: "",
    filters: {
      type: "all",
      statuses: [],
      dateRange: "month", // ✅ پیش‌فرض: نمایش ماه جاری
      customYear: currentYear,
      customMonth: currentMonth,
    },
    isAddModalOpen: false,
    typeModal: "add",
    selectedTransaction: null,

    // ========== PAGINATION ACTIONS ==========

    /**
     * تنظیم صفحه مورد نظر
     */
    setPage: (page) => set({ currentPage: page }),

    /**
     * رفتن به صفحه بعدی
     */
    nextPage: () => {
      const { currentPage } = get();
      const totalPages = get().getTotalPages();
      if (currentPage < totalPages) {
        set({ currentPage: currentPage + 1 });
      }
    },

    /**
     * رفتن به صفحه قبلی
     */
    prevPage: () => {
      const { currentPage } = get();
      if (currentPage > 1) {
        set({ currentPage: currentPage - 1 });
      }
    },

    /**
     * تنظیم تعداد آیتم‌های هر صفحه
     * ✅ همزمان صفحه را به ۱ بازمی‌گرداند
     */
    setItemsPerPage: (items) => set({ itemPerPage: items, currentPage: 1 }),

    // ========== DATA ACTIONS ==========

    /**
     * تنظیم لیست تراکنش‌ها
     * ✅ همزمان صفحه را به ۱ بازمی‌گرداند
     */
    setTransactions: (data) => set({ transactions: data, currentPage: 1 }),

    /**
     * تنظیم مقدار جستجو
     * ✅ همزمان صفحه را به ۱ بازمی‌گرداند
     */
    setSearchValue: (value) => set({ searchValue: value, currentPage: 1 }),

    // ========== FILTER ACTIONS ==========

    /**
     * تنظیم فیلترها (پشتیبانی از Functional Update)
     * ✅ جلوگیری از مشکلات ESLint با استفاده از Functional Update
     */
    setFilters: (updater) =>
      set((state) => ({
        filters:
          typeof updater === "function" ? updater(state.filters) : updater,
        currentPage: 1,
      })),

    /**
     * تنظیم فیلتر نوع تراکنش (درآمد/هزینه/همه)
     */
    setFilterType: (type) =>
      set((state) => ({
        filters: { ...state.filters, type },
        currentPage: 1,
      })),

    /**
     * تنظیم فیلتر وضعیت‌ها (تکمیل شده، در انتظار، ناموفق)
     */
    setFilterStatuses: (statuses) =>
      set((state) => ({
        filters: { ...state.filters, statuses },
        currentPage: 1,
      })),

    /**
     * تنظیم فیلتر بازه زمانی
     */
    setFilterDateRange: (dateRange) =>
      set((state) => ({
        filters: { ...state.filters, dateRange },
        currentPage: 1,
      })),

    /**
     * بازگرداندن فیلترها به حالت پیش‌فرض
     * ✅ پاک کردن جستجو و بازگرداندن به ماه جاری
     */
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

    /**
     * بازنشانی کامل Store
     */
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

    // ========== COMPUTED VALUES ==========

    /**
     * محاسبه تراکنش‌های فیلتر شده
     * ✅ اولویت فیلترها: تاریخ → جستجو → نوع → وضعیت
     */
    getFilteredTransactions: () => {
      const { transactions, searchValue, filters } = get();
      let filtered = [...transactions];

      // ========== ۱. فیلتر تاریخ ==========
      if (filters.dateRange !== "all") {
        // ✅ فیلتر سفارشی (سال و ماه خاص)
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
          // ✅ فیلترهای از پیش تعریف شده (امروز، هفته، ماه)
          const now = moment().locale("fa");
          let startDate: moment.Moment;

          switch (filters.dateRange) {
            case "today":
              // ✅ از ابتدای امروز
              startDate = now.clone().startOf("day");
              break;
            case "month":
              // ✅ از ابتدای ماه جاری
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

    /**
     * محاسبه تعداد کل صفحات
     */
    getTotalPages: () => {
      const filtered = get().getFilteredTransactions();
      const { itemPerPage } = get();
      return Math.max(Math.ceil(filtered.length / itemPerPage), 1);
    },

    /**
     * دریافت اطلاعات صفحه‌بندی
     */
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

    // ========== TRANSACTION CRUD ==========

    /**
     * افزودن تراکنش جدید
     * ✅ ID به صورت خودکار ساخته می‌شود
     */
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

    /**
     * ویرایش تراکنش موجود
     */
    editTransaction: (id, updatedData) =>
      set((state) => ({
        transactions: state.transactions.map((t) =>
          t.id === id ? { ...t, ...updatedData } : t,
        ),
      })),

    /**
     * حذف تراکنش
     */
    // deleteTransaction: (id) =>
    //   set((state) => ({
    //     transactions: state.transactions.filter((t) => t.id !== id),
    //   })),

    // ========== MODAL ACTIONS ==========

    /**
     * تنظیم وضعیت باز/بسته مودال
     */
    setIsAddModalOpen: (isOpen) => set({ isAddModalOpen: isOpen }),

    /**
     * تنظیم نوع مودال (افزودن یا ویرایش)
     */
    setTypeModal: (type) => set({ typeModal: type }),

    /**
     * تنظیم تراکنش انتخاب شده
     */
    setSelectedTransaction: (transaction) =>
      set({ selectedTransaction: transaction }),

    /**
     * باز کردن مودال برای افزودن تراکنش جدید
     */
    openAddModal: () =>
      set({
        isAddModalOpen: true,
        typeModal: "add",
        selectedTransaction: null,
      }),

    /**
     * باز کردن مودال برای ویرایش تراکنش
     */
    openEditModal: (transaction) =>
      set({
        isAddModalOpen: true,
        typeModal: "edit",
        selectedTransaction: transaction,
      }),
  };
});
