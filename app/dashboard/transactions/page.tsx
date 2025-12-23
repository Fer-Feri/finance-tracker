"use client";

// ============================================================
// IMPORTS - وارد کردن کتابخانه‌ها و ماژول‌ها
// ============================================================
import {
  Plus,
  Search,
  SlidersHorizontal,
  ArrowUpLeft,
  ArrowDownRight,
  Edit,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { transactionsData } from "@/config/tranaction-data";
import { TransactionStatus } from "@/types/transaction";
import { useTransactionStore } from "@/store/transactionStore";
import { useEffect, useMemo, useRef, useState } from "react";
import { useClickOutside } from "@/hooks/useClickOutside";
import AddTransactionModal from "@/components/transaction/AddTransactionModal";
import { getCurrentJalaliYearMonth } from "@/utils/date/dateHelpers";
import { useRouter, useSearchParams } from "next/navigation";
import moment from "jalali-moment";

// ============================================================
// CONSTANTS - ثابت‌های برنامه
// ============================================================
const JALALI_MONTHS = [
  { id: 1, name: "فروردین" },
  { id: 2, name: "اردیبهشت" },
  { id: 3, name: "خرداد" },
  { id: 4, name: "تیر" },
  { id: 5, name: "مرداد" },
  { id: 6, name: "شهریور" },
  { id: 7, name: "مهر" },
  { id: 8, name: "آبان" },
  { id: 9, name: "آذر" },
  { id: 10, name: "دی" },
  { id: 11, name: "بهمن" },
  { id: 12, name: "اسفند" },
];

/**
 * آیتم‌های فیلتر بازه زمانی
 * استفاده: در منوی فیلتر برای انتخاب بازه زمانی (همه، امروز، این ماه)
 */
const dateRangeItems: {
  id: "all" | "today" | "week" | "month";
  label: string;
}[] = [
  { id: "all", label: "همه" },
  { id: "today", label: "امروز" },
  { id: "month", label: "این ماه" },
];

/**
 * آیتم‌های فیلتر وضعیت تراکنش
 * استفاده: در منوی فیلتر برای انتخاب وضعیت (تکمیل شده، در انتظار، ناموفق)
 */
const statusItems: { id: TransactionStatus; label: string }[] = [
  { id: "completed", label: "تکمیل شده" },
  { id: "pending", label: "در انتظار" },
  { id: "failed", label: "ناموفق" },
];

export const TRANSACTION_CATEGORIES: Record<string, string> = {
  // 💸 EXPENSE - هزینه‌ها
  food: "خوراک و نوشیدنی",
  transport: "حمل و نقل",
  shopping: "خرید و پوشاک",
  bills: "قبض",
  health: "بهداشت و درمان",
  entertainment: "سرگرمی",
  education: "آموزش",
  home: "خانه و اجاره",
  insurance: "بیمه",
  gifts: "هدیه و کمک",
  expenseOther: "سایر هزینه‌ها",

  // 💰 INCOME - درآمدها
  salary: "حقوق و دستمزد",
  freelance: "پروژه و فریلنس",
  business: "کسب و کار",
  investment: "سرمایه‌گذاری",
  rental: "اجاره و رهن",
  bonus: "پاداش و عیدی",
  giftReceived: "هدیه دریافتی",
  incomeOther: "سایر درآمدها",
};

const CURRENT_YEAR = moment().locale("fa").jYear();

// ============================================================
// MAIN COMPONENT - کامپوننت اصلی صفحه تراکنش‌ها
// ============================================================
export default function TransactionsPage() {
  // ========== LOCAL STATE - State های محلی کامپوننت ==========

  /**
   * وضعیت باز/بسته بودن منوی فیلتر اصلی
   */
  const [isMenuFilterOpen, setIsMenuFilterOpen] = useState<boolean>(false);

  /**
   * وضعیت باز/بسته بودن بخش فیلتر سفارشی (انتخاب سال و ماه)
   */
  const [isCustomFilterOpen, setIsCustomFilterOpen] = useState<boolean>(false);

  /**
   * سال موقت - برای نگهداری سال انتخاب شده قبل از اعمال فیلتر
   * تا زمانی که کاربر روی دکمه "اعمال" کلیک نکند، فیلتر اصلی تغییر نمی‌کند
   */
  const [tempYear, setTempYear] = useState<number>(
    getCurrentJalaliYearMonth().year,
  );

  /**
   * ماه موقت - برای نگهداری ماه انتخاب شده قبل از اعمال فیلتر
   */
  const [tempMonth, setTempMonth] = useState<number>(
    getCurrentJalaliYearMonth().month,
  );

  // ========== HOOKS - استفاده از Hook های React و Next.js ==========
  const router = useRouter();

  /**
   * searchParams: برای خواندن پارامترهای URL (مثل ?year=1404&month=3)
   */
  const searchParams = useSearchParams();

  /**
   * ref برای منوی فیلتر - برای تشخیص کلیک خارج از منو و بستن آن
   */
  const menuFilterRef = useRef<HTMLDivElement>(null);

  /**
   * Custom Hook برای بستن منوی فیلتر با کلیک خارج از آن
   */
  useClickOutside(menuFilterRef, () => setIsMenuFilterOpen(false));

  // ========== STORE - دسترسی به Zustand Store ==========

  /**
   * استخراج تمام توابع و state های مورد نیاز از Store
   */
  const {
    setTransactions, // تنظیم لیست تراکنش‌ها
    searchValue, // مقدار جستجو
    setSearchValue, // تنظیم مقدار جستجو
    filters, // فیلترهای فعلی
    setFilters, // تنظیم فیلترها
    resetFilters, // بازنشانی فیلترها
    currentPage, // صفحه فعلی
    setPage, // تنظیم صفحه
    nextPage, // رفتن به صفحه بعدی
    prevPage, // رفتن به صفحه قبلی
    getFilteredTransactions, // دریافت تراکنش‌های فیلتر شده
    getPageInfo, // دریافت اطلاعات صفحه‌بندی
    itemPerPage, // تعداد آیتم در هر صفحه
    deleteTransaction, // حذف تراکنش
    openAddModal, // باز کردن مودال افزودن
    openEditModal, // باز کردن مودال ویرایش
    isAddModalOpen, // وضعیت باز/بسته مودال
  } = useTransactionStore();

  // ========== COMPUTED VALUES - مقادیر محاسبه شده ==========

  /**
   * لیست تراکنش‌های فیلتر شده بر اساس فیلترها و جستجو
   */
  const filteredTransactions = getFilteredTransactions();

  /**
   * اطلاعات صفحه‌بندی (تعداد کل صفحات، آیتم اول و آخر، تعداد کل آیتم‌ها)
   */
  const { totalPages, startItem, endItem, totalItems } = getPageInfo();

  /**
   * ✅ محاسبه داده‌های صفحه جاری با useMemo
   * استفاده از useMemo برای جلوگیری از محاسبه مجدد در هر رندر
   * فقط زمانی محاسبه می‌شود که یکی از وابستگی‌ها تغییر کند
   */
  const paginatedData = useMemo(
    () =>
      filteredTransactions.slice(
        (currentPage - 1) * itemPerPage,
        currentPage * itemPerPage,
      ),
    [filteredTransactions, currentPage, itemPerPage],
  );

  // ========== EFFECTS - اثرات جانبی ==========

  /**
   * ✅ Effect برای بارگذاری اولیه داده‌ها
   * این Effect فقط یک بار در ابتدا اجرا می‌شود
   */
  useEffect(() => {
    setTransactions(transactionsData);
  }, [setTransactions]);

  /**
   * ✅ Effect برای همگام‌سازی با URL Parameters
   *
   * عملکرد:
   * 1. خواندن year و month از URL
   * 2. اعتبارسنجی مقادیر (سال باید بین 1400-1410 و ماه بین 1-12 باشد)
   * 3. به‌روزرسانی فیلترها فقط در صورت تغییر (جلوگیری از حلقه بی‌نهایت)
   *
   * مثال URL: /dashboard/transactions?year=1404&month=3
   */
  useEffect(() => {
    // خواندن پارامترها از URL
    const yearParam = searchParams.get("year");
    const monthParam = searchParams.get("month");

    // اگر هر دو پارامتر وجود داشتند
    if (yearParam && monthParam) {
      const year = Number(yearParam);
      const month = Number(monthParam);

      // ✅ اعتبارسنجی محدوده مجاز
      if (year < 1400 || year > 1410 || month < 1 || month > 12) {
        console.warn("پارامترهای URL خارج از محدوده مجاز هستند");
        return; // خروج از Effect بدون تغییر
      }

      // ✅ به‌روزرسانی فیلترها با Functional Update
      setFilters((prev) => {
        // جلوگیری از update غیرضروری اگر مقادیر تغییر نکرده باشند
        if (
          prev.customYear === year &&
          prev.customMonth === month &&
          prev.dateRange === "custom"
        ) {
          return prev; // بازگشت state قبلی بدون تغییر
        }

        // ایجاد state جدید با مقادیر به‌روز شده
        return {
          ...prev,
          dateRange: "custom", // تغییر به حالت فیلتر سفارشی
          customYear: year,
          customMonth: month,
        };
      });
    }
  }, [searchParams, setFilters]); // وابستگی‌ها: فقط searchParams و setFilters

  // ========== HELPER FUNCTIONS - توابع کمکی ==========

  /**
   * ✅ تابع کمکی برای به‌روزرسانی URL با پارامترهای جدید
   * مثال: updateURLParams(1404, 3) -> /dashboard/transactions?year=1404&month=3
   */
  const updateURLParams = (year: number, month: number) => {
    // ایجاد یک نمونه جدید از URLSearchParams بر اساس پارامترهای فعلی
    const params = new URLSearchParams(searchParams.toString());

    // تنظیم/به‌روزرسانی پارامترهای year و month
    params.set("year", year.toString());
    params.set("month", month.toString());

    // هدایت به URL جدید بدون Scroll به بالای صفحه
    router.push(`/dashboard/transactions?${params.toString()}`, {
      scroll: false,
    });
  };

  /**
   * ✅ محاسبه صفحات قابل نمایش در pagination
   *
   * منطق: نمایش صفحه جاری ± 1 صفحه
   * مثال: اگر صفحه جاری 5 باشد، صفحات 4، 5، 6 نمایش داده می‌شوند
   *
   * @returns آرایه‌ای از شماره صفحات قابل نمایش
   */
  const getVisiblePages = () => {
    const pages = [];
    const delta = 1; // تعداد صفحات قبل و بعد از صفحه جاری

    // محاسبه محدوده صفحات
    const start = Math.max(1, currentPage - delta);
    const end = Math.min(totalPages, currentPage + delta);

    // افزودن صفحات به آرایه
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  // ========== EVENT HANDLERS - مدیریت رویدادها ==========

  /**
   * ✅ Handler برای اعمال فیلتر سفارشی (سال و ماه)
   *
   * فرآیند:
   * 1. بررسی اینکه آیا سال و ماه انتخاب شده‌اند یا نه
   * 2. به‌روزرسانی فیلترها در Store
   * 3. به‌روزرسانی URL
   * 4. بستن منوی فیلتر سفارشی
   */
  const handleApplyCustomFilter = () => {
    // اگر سال یا ماه انتخاب نشده بود، کاری انجام نمی‌دهیم
    if (!tempYear || !tempMonth) return;

    // به‌روزرسانی فیلترها
    setFilters({
      ...filters,
      dateRange: "custom", // تغییر حالت فیلتر به "سفارشی"
      customYear: tempYear,
      customMonth: tempMonth,
    });

    // به‌روزرسانی URL
    updateURLParams(tempYear, tempMonth);

    // بستن منوی فیلتر سفارشی
    setIsCustomFilterOpen(false);
  };

  /**
   * ✅ Handler برای پاک کردن فیلتر سفارشی و بازگشت به حالت پیش‌فرض
   *
   * فرآیند:
   * 1. دریافت سال و ماه جاری
   * 2. بازگرداندن فیلتر به حالت "این ماه"
   * 3. پاک کردن پارامترهای URL
   */
  const handleClearCustomFilter = () => {
    // دریافت سال و ماه جاری
    const { year, month } = getCurrentJalaliYearMonth();

    // بازگرداندن فیلتر به حالت پیش‌فرض
    setFilters({
      ...filters,
      dateRange: "month", // تغییر به "این ماه"
      customYear: year,
      customMonth: month,
    });

    // ✅ پاک کردن پارامترهای URL و هدایت به مسیر اصلی
    router.push("/dashboard/transactions", { scroll: false });
  };

  const handleResetAllFilters = () => {
    resetFilters();
    router.push("/dashboard/transactions", { scroll: false });
  };

  const handleDelete = (id: string) => {
    // نمایش پیام تاییدیه
    if (confirm("آیا از حذف این تراکنش مطمئن هستید؟")) {
      deleteTransaction(id);
    }
  };

  /**
   * ✅ Handler برای باز/بسته کردن منوی فیلتر سفارشی
   */
  const handleCustomFilterToggle = () => {
    const newState = !isCustomFilterOpen;
    setIsCustomFilterOpen(newState);

    // اگر منو در حال باز شدن است
    if (newState) {
      // مقداردهی اولیه به State های موقت از فیلترهای فعلی
      setTempYear(filters.customYear || getCurrentJalaliYearMonth().year);
      setTempMonth(filters.customMonth || getCurrentJalaliYearMonth().month);
    }
  };

  // ========== STYLING HELPERS - کمک‌کننده‌های استایل ==========

  /**
   * کلاس‌های CSS برای نمایش وضعیت‌های مختلف تراکنش
   */
  const statusClasses: Record<TransactionStatus, string> = {
    completed: "bg-secondary text-white", // سبز
    pending: "bg-muted-foreground text-white", // خاکستری
    failed: "bg-destructive text-white", // قرمز
  };

  /**
   * برچسب‌های فارسی برای وضعیت‌های تراکنش
   */
  const statusLabels: Record<TransactionStatus, string> = {
    completed: "تکمیل شده",
    pending: "در انتظار",
    failed: "ناموفق",
  };

  // ============================================================
  // هندل کردن ماه و سال هدر بصورت داینامیک
  // ============================================================
  const handleDateInHeader = useMemo(() => {
    const yearParam = searchParams.get("year");
    const monthParam = searchParams.get("month");

    const { year: currentYear, month: currentMonth } =
      getCurrentJalaliYearMonth();

    if (yearParam && monthParam) {
      return {
        year: yearParam,
        month: Number(monthParam),
      };
    } else {
      return {
        year: String(currentYear),
        month: currentMonth,
      };
    }
  }, [searchParams]);

  const handleDateRangeChange = (dateRangeId: string) => {
    setFilters({
      ...filters,
      dateRange: dateRangeId as "all" | "today" | "month" | "custom",
    });

    if (dateRangeId !== "custom") {
      router.push("/dashboard/transactions", { scroll: false });
    }
  };

  // ============================================================
  // RENDER - رندر کامپوننت
  // ============================================================
  return (
    <div className="h-full space-y-8 p-2">
      {/* ============================================================ */}
      {/* HEADER SECTION - بخش هدر صفحه */}
      {/* ============================================================ */}
      <div className="flex flex-wrap gap-4">
        <div className="space-y-1">
          {/* عنوان اصلی صفحه */}
          <h1 className="text-foreground flex items-center gap-4 text-2xl font-bold tracking-tight">
            <p> لیست تراکنش‌ها</p>
            <p className="text-xs">
              {JALALI_MONTHS[handleDateInHeader.month - 1]?.name || "نامشخص"}{" "}
              ماه - {handleDateInHeader.year}
            </p>
          </h1>
          {/* توضیحات کوتاه */}
          <p className="text-muted-foreground text-sm">
            مدیریت کامل ورودی‌ها و خروجی‌های مالی شما
          </p>
        </div>
      </div>

      {/* خط جداکننده زیبا با گرادیانت */}
      <div className="via-border h-px w-full bg-gradient-to-r from-transparent to-transparent" />

      {/* ============================================================ */}
      {/* SEARCH & FILTER BAR - نوار جستجو و فیلتر */}
      {/* ============================================================ */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* ========== SEARCH INPUT CONTAINER ========== */}
        <div className="border-border bg-card relative flex w-full max-w-xl items-center rounded-2xl border p-1 shadow-sm">
          {/* آیکون جستجو */}
          <div className="text-muted-foreground flex h-10 w-10 items-center justify-center">
            <Search className="h-5 w-5" />
          </div>

          {/* اینپوت جستجو */}
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="جستجو بر اساس توضیحات، دسته‌بندی و..."
            className="text-foreground placeholder:text-muted-foreground/70 flex-1 bg-transparent text-sm focus:outline-none"
          />

          {/* دکمه پاک کردن جستجو (فقط زمانی نمایش داده می‌شود که متنی وجود داشته باشد) */}
          {searchValue && (
            <span
              className="text-primary/70 hover:text-primary ml-3 cursor-pointer transition-colors"
              onClick={() => setSearchValue("")}
            >
              ✕
            </span>
          )}

          {/* ============================================================ */}
          {/* FILTER DROPDOWN MENU - منوی کشویی فیلترها */}
          {/* ============================================================ */}
          <div className="relative" ref={menuFilterRef}>
            {/* دکمه باز کردن منوی فیلتر */}
            <button
              onClick={() => setIsMenuFilterOpen((prev) => !prev)}
              className="bg-secondary/80 text-secondary-foreground hover:bg-secondary relative flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>فیلترها</span>
            </button>

            {/* منوی Dropdown (فقط زمانی نمایش داده می‌شود که isMenuFilterOpen === true) */}
            {isMenuFilterOpen && (
              <div className="bg-popover border-primary/70 no-scrollbar absolute top-[calc(100%+0.5rem)] left-0 z-50 max-h-[500px] w-64 overflow-auto rounded-xl border p-4 shadow-2xl md:w-80">
                {/* ========== TRANSACTION TYPE FILTER ========== */}
                {/* فیلتر نوع تراکنش (همه / درآمد / هزینه) */}
                <div className="space-y-3">
                  <p className="text-sm font-semibold">نوع تراکنش</p>
                  <div className="grid grid-cols-1 gap-2">
                    {/* حلقه روی آیتم‌های نوع تراکنش */}
                    {[
                      { id: "all" as const, label: "همه" },
                      { id: "income" as const, label: "درآمد" },
                      { id: "expense" as const, label: "هزینه" },
                    ].map((item) => (
                      <label
                        key={item.id}
                        className="border-border hover:bg-accent/30 flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 transition"
                      >
                        {/* Radio Button */}
                        <input
                          type="radio"
                          name="transactionType"
                          checked={filters.type === item.id}
                          onChange={() =>
                            setFilters({ ...filters, type: item.id })
                          }
                          className="h-4 w-4 cursor-pointer accent-[var(--primary)]"
                        />
                        {/* برچسب */}
                        <span className="text-sm">{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* ========== STATUS FILTER ========== */}
                {/* فیلتر وضعیت تراکنش (تکمیل شده / در انتظار / ناموفق) */}
                <div className="mt-6 space-y-3">
                  <p className="text-sm font-semibold">وضعیت تراکنش</p>
                  <div className="grid grid-cols-1 gap-2">
                    {/* حلقه روی آیتم‌های وضعیت */}
                    {statusItems.map((item) => (
                      <label
                        key={item.id}
                        className="border-border hover:bg-accent/30 flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 transition"
                      >
                        {/* Checkbox */}
                        <input
                          type="checkbox"
                          checked={filters.statuses.includes(item.id)}
                          onChange={(e) => {
                            setFilters({
                              ...filters,
                              statuses: e.target.checked
                                ? [...filters.statuses, item.id] // افزودن به لیست
                                : filters.statuses.filter((s) => s !== item.id), // حذف از لیست
                            });
                          }}
                          className="h-4 w-4 cursor-pointer accent-[var(--secondary)]"
                        />
                        {/* برچسب */}
                        <span className="text-sm">{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* ========== DATE RANGE FILTER ========== */}
                {/* فیلتر بازه زمانی (همه / امروز / این ماه) */}
                <div className="mt-6 space-y-3">
                  <p className="text-sm font-semibold">بازه زمانی</p>
                  <div className="grid grid-cols-1 gap-2">
                    {/* حلقه روی آیتم‌های بازه زمانی */}
                    {dateRangeItems.map((item) => (
                      <label
                        key={item.id}
                        className="border-border hover:bg-accent/30 flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 transition"
                      >
                        {/* Radio Button */}
                        <input
                          type="radio"
                          name="dateRange"
                          checked={filters.dateRange === item.id}
                          onChange={() => handleDateRangeChange(item.id)}
                          className="h-4 w-4 cursor-pointer accent-[var(--destructive)]"
                        />
                        {/* برچسب */}
                        <span className="text-sm">{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* ============================================================ */}
                {/* CUSTOM DATE FILTER SECTION - بخش فیلتر تاریخ سفارشی */}
                {/* ============================================================ */}
                <div className="bg-muted/40 mt-6 space-y-3 rounded-lg p-3 shadow-sm">
                  {/* ============================================================ */}
                  {/* TOGGLE BUTTON - دکمه باز/بسته کردن بخش سفارشی */}
                  {/* ============================================================ */}
                  <button
                    onClick={handleCustomFilterToggle}
                    className="text-muted-foreground hover:text-foreground flex w-full items-center justify-between text-xs font-semibold transition-colors"
                  >
                    <span>📅 انتخاب تاریخ دقیق (سفارشی)</span>
                    {/* نمایش شرطی آیکون بر اساس وضعیت باز/بسته */}
                    {isCustomFilterOpen ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>

                  {isCustomFilterOpen && (
                    <div className="space-y-3 pt-2">
                      <div className="space-y-1.5">
                        {/* برچسب فیلد */}
                        <label className="text-foreground text-xs font-medium">
                          سال
                        </label>

                        {/* کشویی انتخاب سال */}
                        <select
                          value={tempYear || ""} // اگر مقدار نداشت، string خالی نمایش داده می‌شود
                          onChange={(e) => setTempYear(Number(e.target.value))} // تبدیل string به number
                          className="border-border bg-background text-foreground hover:border-primary/50 focus:border-primary focus:ring-primary/30 w-full rounded-md border px-3 py-2.5 text-sm transition-all focus:ring-2 focus:outline-none"
                        >
                          {/* گزینه پیش‌فرض */}
                          <option value="">-- انتخاب سال --</option>

                          {Array.from({ length: 4 }).map((_, index) => {
                            const year = CURRENT_YEAR - index;
                            return (
                              <option key={year} value={year}>
                                {year}
                              </option>
                            );
                          })}
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        {/* برچسب فیلد */}
                        <label className="text-foreground text-xs font-medium">
                          ماه
                        </label>

                        {/* کشویی انتخاب ماه */}
                        <select
                          value={tempMonth || ""} // اگر مقدار نداشت، string خالی نمایش داده می‌شود
                          onChange={(e) => setTempMonth(Number(e.target.value))} // تبدیل string به number
                          className="border-border bg-background text-foreground hover:border-primary/50 focus:border-primary focus:ring-primary/30 w-full rounded-md border px-3 py-2.5 text-sm transition-all focus:ring-2 focus:outline-none"
                        >
                          {/* گزینه پیش‌فرض */}
                          <option value="">-- انتخاب ماه --</option>

                          {JALALI_MONTHS.map((month) => (
                            <option key={month.id} value={month.id}>
                              {month.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex gap-2 pt-1">
                        {/* ============================================================ */}
                        {/* APPLY BUTTON - دکمه اعمال فیلتر */}
                        {/* ============================================================ */}
                        <button
                          onClick={handleApplyCustomFilter}
                          disabled={!tempYear || !tempMonth} // غیرفعال اگر سال یا ماه انتخاب نشده باشد
                          className="bg-primary text-primary-foreground hover:bg-primary/90 flex-1 rounded-md py-2.5 text-sm font-medium shadow-sm transition-all hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          ✓ اعمال
                        </button>

                        {/* ============================================================ */}
                        {/* CLEAR BUTTON - دکمه پاک کردن فیلتر */}
                        {/* ============================================================ */}
                        <button
                          onClick={handleClearCustomFilter}
                          className="bg-destructive/10 text-destructive hover:bg-destructive/20 flex-1 rounded-md py-2.5 text-sm font-medium transition-all active:scale-[0.98]"
                        >
                          ✕ پاک کردن
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* ============================================================ */}
                {/* CLEAR ALL FILTERS */}
                {/* ============================================================ */}
                <button
                  onClick={handleResetAllFilters}
                  className="bg-accent hover:bg-accent/80 mt-6 w-full rounded-md py-2.5 text-sm font-medium text-black transition-colors dark:text-white"
                >
                  پاک کردن همه فیلترها
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ============================================================ */}
        {/* ADD TRANSACTION BUTTON */}
        {/* ============================================================ */}
        <button
          onClick={openAddModal}
          className="group bg-primary text-primary-foreground shadow-primary/20 hover:bg-primary/90 flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-medium shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="h-5 w-5 transition-transform group-hover:rotate-90" />
          <span>تراکنش جدید</span>
        </button>
      </div>

      {/* ============================================================ */}
      {/* TABLE */}
      {/* ============================================================ */}
      <div className="border-border bg-card w-full rounded-xl shadow-sm">
        <div className="no-scrollbar overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-border border-b">
                <th className="px-4 py-5 text-right font-semibold">
                  توضیحات تراکنش
                </th>
                <th className="px-4 py-5 text-center font-semibold">
                  دسته‌بندی
                </th>
                <th className="px-4 py-5 text-center font-semibold">تاریخ</th>
                <th className="px-4 py-5 text-center font-semibold">
                  روش پرداخت
                </th>
                <th className="px-4 py-5 text-center font-semibold">مبلغ</th>
                <th className="px-4 py-5 text-center font-semibold">وضعیت</th>
                <th className="px-4 py-5 text-center font-semibold">عملیات</th>
              </tr>
            </thead>

            <tbody>
              {paginatedData.map((transaction) => {
                const typeClasses = {
                  income: "bg-primary/10 text-primary",
                  expense: "bg-destructive/10 text-destructive",
                };

                return (
                  <tr key={transaction.id} className="border-border border-b">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all ${typeClasses[transaction.type]}`}
                        >
                          {transaction.type === "income" ? (
                            <ArrowUpLeft className="h-4 w-4" />
                          ) : (
                            <ArrowDownRight className="h-4 w-4" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-foreground truncate text-sm font-medium">
                            {transaction.description}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {transaction.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 text-center">
                      <span className="bg-secondary/80 text-secondary-foreground inline-block rounded-lg px-3 py-1 text-xs font-medium">
                        {TRANSACTION_CATEGORIES[transaction.category]}
                      </span>
                    </td>

                    <td className="p-4 text-center">
                      <span className="text-muted-foreground px-4 py-4 text-center text-xs font-medium tabular-nums">
                        {transaction.date}
                      </span>
                    </td>

                    <td className="text-muted-foreground p-4 text-center text-xs">
                      <span>
                        {transaction.paymentMethod === "cash"
                          ? "نقدی"
                          : transaction.paymentMethod === "card"
                            ? "کارت بانکی"
                            : "آنلاین"}
                      </span>
                    </td>

                    <td className="p-4 text-center">
                      <div
                        className={cn(
                          "inline-flex items-baseline gap-1 rounded-md px-2.5 py-0.5 text-sm font-semibold tabular-nums",
                          typeClasses[transaction.type],
                        )}
                      >
                        <span
                          className="max-w-[120px] truncate whitespace-nowrap"
                          title={transaction.amount.toLocaleString("fa-IR")}
                        >
                          {transaction.amount.toLocaleString("fa-IR")}
                        </span>
                        <span>{transaction.type === "income" ? "+" : "-"}</span>
                      </div>
                    </td>

                    <td className="p-4 text-center">
                      <span
                        className={cn(
                          "inline-block rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap",
                          statusClasses[transaction.status],
                        )}
                      >
                        {statusLabels[transaction.status]}
                      </span>
                    </td>

                    <td className="table-cell p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEditModal(transaction)}
                          className="text-muted-foreground hover:bg-accent/70 hover:text-foreground inline-flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
                          title="ویرایش تراکنش"
                        >
                          <Edit className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => handleDelete(transaction.id)}
                          className="text-muted-foreground hover:bg-destructive/70 hover:text-destructive-foreground inline-flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
                          title="حذف تراکنش"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ============================================================ */}
      {/* EMPTY STATE */}
      {/* ============================================================ */}
      {filteredTransactions.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="bg-muted flex h-16 w-16 items-center justify-center rounded-full">
            <Search className="text-accent h-8 w-8" />
          </div>
          <h3 className="text-destructive mt-4 text-lg font-semibold">
            نتیجه‌ای یافت نشد
          </h3>
        </div>
      )}

      {/* ============================================================ */}
      {/* PAGINATION */}
      {/* ============================================================ */}
      <div className="flex items-center justify-between opacity-70">
        <p className="text-xs md:text-sm">
          نمایش {startItem}–{endItem} از {totalItems} تراکنش
        </p>
        <div className="flex gap-2">
          <button
            className="border-primary/60 rounded-md border px-2.5 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            onClick={prevPage}
            disabled={currentPage === 1}
          >
            قبلی
          </button>

          {currentPage > 3 && (
            <>
              <button onClick={() => setPage(1)}>1</button>
              <span className="px-2">…</span>
            </>
          )}

          {getVisiblePages().map((page) => (
            <button
              key={page}
              onClick={() => setPage(page)}
              className={cn(
                "rounded-lg px-3 py-2 text-sm",
                page === currentPage
                  ? "bg-primary text-white"
                  : "hover:bg-accent border",
              )}
            >
              {page}
            </button>
          ))}

          {currentPage < totalPages - 2 && (
            <>
              <span className="px-2">…</span>
              <button onClick={() => setPage(totalPages)}>{totalPages}</button>
            </>
          )}

          <button
            className="border-primary/60 rounded-md border px-2.5 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            onClick={nextPage}
            disabled={currentPage === totalPages}
          >
            بعدی
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* TRANSACTION MODAL */}
      {/* ============================================================ */}
      {isAddModalOpen && <AddTransactionModal />}
    </div>
  );
}
