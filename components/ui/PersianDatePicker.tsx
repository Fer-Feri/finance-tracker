"use client";

import { useRef, useEffect } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { usePersianDatePicker } from "@/hooks/usePersianDatePicker";

const PERSIAN_MONTHS = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];

const WEEKDAYS = ["ش", "ی", "د", "س", "چ", "پ", "ج"];

interface PersianDatePickerProps {
  value?: string;
  onChange?: (date: string) => void;
  placeholder?: string;
}

export function PersianDatePicker({
  value,
  onChange,
  placeholder = "تاریخ را انتخاب کنید",
}: PersianDatePickerProps) {
  const pickerRef = useRef<HTMLDivElement>(null);

  const {
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
    handleYearChange, // ✅ جدید
    handleMonthChange, // ✅ جدید
  } = usePersianDatePicker({
    initialDate: value,
    onDateChange: onChange,
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  const renderDays = () => {
    const days = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 w-10" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected =
        selectedDate ===
        `${currentYear}/${String(currentMonth).padStart(2, "0")}/${String(day).padStart(2, "0")}`;

      days.push(
        <button
          key={day}
          type="button" // ✅ مهم!
          onClick={() => handleSelectDate(day)}
          className={`h-10 w-10 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 ${
            isSelected
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "text-muted-foreground"
          }`}
        >
          {day}
        </button>,
      );
    }

    return days;
  };

  // ✅ لیست سال‌ها (۱۳۸۰ تا ۱۴۲۰)
  const years = Array.from({ length: 9 }, (_, i) => 1404 + i);

  return (
    <div ref={pickerRef} className="relative w-full">
      {/* Input */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="border-border bg-background focus:border-primary focus:ring-primary/20 flex w-full justify-between rounded-xl border px-4 py-3 text-sm text-white transition-colors placeholder:text-white focus:ring-2 focus:outline-none"
      >
        <span
          className={
            selectedDate ? "text-muted-foreground" : "text-muted-foreground"
          }
        >
          {selectedDate || placeholder}
        </span>
        <Calendar className="h-5 w-5 text-gray-400" />
      </button>

      {/* Dropdown Calendar */}
      {isOpen && (
        <div className="animate-in fade-in slide-in-from-top-2 bg-muted border-destructive-foreground absolute top-full left-0 z-50 mt-2 w-full min-w-[320px] rounded-xl border p-4 shadow-2xl">
          {/* ✅ هدر با Dropdown */}
          <div className="mb-4 flex items-center justify-between gap-2">
            <button
              type="button" // ✅ مهم!
              onClick={handleNextMonth}
              className="text-primary hover:text-primary/80 rounded-lg p-2 transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2">
              {/* Dropdown ماه */}
              <select
                value={currentMonth}
                onChange={(e) => handleMonthChange(Number(e.target.value))}
                className="bg-muted border-primary/50 focus:border-primary focus:ring-primary/20 rounded-lg border-2 border-dotted px-3 py-1.5 text-sm font-medium transition-colors focus:ring-2 focus:outline-none"
              >
                {PERSIAN_MONTHS.map((month, index) => (
                  <option key={index} value={index + 1}>
                    {month}
                  </option>
                ))}
              </select>

              {/* Dropdown سال */}
              <select
                value={currentYear}
                onChange={(e) => handleYearChange(Number(e.target.value))}
                className="bg-muted border-primary/50 focus:border-primary focus:ring-primary/20 rounded-lg border-2 border-dotted px-3 py-1.5 text-sm font-medium transition-colors focus:ring-2 focus:outline-none"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button" // ✅ مهم!
              onClick={handlePrevMonth}
              className="text-primary hover:text-primary/80 rounded-lg p-2 transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          </div>

          {/* روزهای هفته */}
          <div className="mb-2 grid grid-cols-7 gap-1">
            {WEEKDAYS.map((day) => (
              <div
                key={day}
                className="text-muted-foreground flex h-10 items-center justify-center text-xs font-medium"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Grid روزها */}
          <div className="grid grid-cols-7 gap-1">{renderDays()}</div>
        </div>
      )}
    </div>
  );
}
