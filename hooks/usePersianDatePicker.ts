// hooks/usePersianDatePicker.ts

import { useState, useMemo, useCallback } from "react";
import moment from "jalali-moment";

interface UsePersianDatePickerProps {
  initialDate?: string;
  onDateChange?: (date: string) => void;
}

export function usePersianDatePicker({
  initialDate,
  onDateChange,
}: UsePersianDatePickerProps) {
  // ✅ Parse کردن تاریخ اولیه با useMemo
  const parsedInitialDate = useMemo(() => {
    if (!initialDate) {
      const now = moment().locale("fa");
      return {
        year: now.jYear(),
        month: now.jMonth() + 1,
        selectedDate: undefined,
      };
    }

    // فرمت: "1404/09/29"
    const parts = initialDate.split("/");
    const year = Number(parts[0]);
    const month = Number(parts[1]);

    return {
      year: year || moment().locale("fa").jYear(),
      month: month || moment().locale("fa").jMonth() + 1,
      selectedDate: initialDate,
    };
  }, [initialDate]);

  const [selectedDate, setSelectedDate] = useState<string | undefined>(
    parsedInitialDate.selectedDate,
  );
  const [currentYear, setCurrentYear] = useState(parsedInitialDate.year);
  const [currentMonth, setCurrentMonth] = useState(parsedInitialDate.month);
  const [isOpen, setIsOpen] = useState(false);

  // ✅ وقتی initialDate تغییر می‌کنه، State ها رو Reset می‌کنیم
  // این کار رو فقط یک بار در render انجام می‌دیم، نه در effect
  if (
    initialDate &&
    initialDate !== selectedDate &&
    parsedInitialDate.selectedDate !== selectedDate
  ) {
    setSelectedDate(parsedInitialDate.selectedDate);
    setCurrentYear(parsedInitialDate.year);
    setCurrentMonth(parsedInitialDate.month);
  }

  // محاسبه روزهای ماه
  const daysInMonth = useMemo(
    () =>
      moment(`${currentYear}/${currentMonth}/01`, "jYYYY/jM/jD")
        .locale("fa")
        .jDaysInMonth(),
    [currentYear, currentMonth],
  );

  // روز اول ماه (0 = شنبه)
  const firstDayOfMonth = useMemo(
    () =>
      moment(`${currentYear}/${currentMonth}/01`, "jYYYY/jM/jD")
        .locale("fa")
        .day(),
    [currentYear, currentMonth],
  );

  // انتخاب تاریخ
  const handleSelectDate = useCallback(
    (day: number) => {
      const dateStr = `${currentYear}/${String(currentMonth).padStart(2, "0")}/${String(day).padStart(2, "0")}`;
      setSelectedDate(dateStr);
      onDateChange?.(dateStr);
      setIsOpen(false);
    },
    [currentYear, currentMonth, onDateChange],
  );

  // ناوبری ماه قبل
  const handlePrevMonth = useCallback(() => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  }, [currentMonth]);

  // ناوبری ماه بعد
  const handleNextMonth = useCallback(() => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  }, [currentMonth]);

  // تغییر سال از Dropdown
  const handleYearChange = useCallback((year: number) => {
    setCurrentYear(year);
  }, []);

  // تغییر ماه از Dropdown
  const handleMonthChange = useCallback((month: number) => {
    setCurrentMonth(month);
  }, []);

  return {
    selectedDate,
    currentYear,
    currentMonth,
    daysInMonth,
    firstDayOfMonth,
    isOpen,
    setIsOpen,
    handleSelectDate,
    handlePrevMonth,
    handleNextMonth,
    handleYearChange,
    handleMonthChange,
  };
}
