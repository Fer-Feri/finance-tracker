import jMoment from "jalali-moment";

// تبدیل تاریخ شمسی به میلادی (برای ذخیره)
export function persianToGregorian(persianDate: string): string {
  return jMoment(persianDate, "jYYYY/jMM/jDD").format("YYYY-MM-DD");
}

// تبدیل تاریخ میلادی به شمسی (برای نمایش)
export function gregorianToPersian(gregorianDate: string): string {
  return jMoment(gregorianDate, "YYYY-MM-DD").format("jYYYY/jMM/jDD");
}

// گرفتن تاریخ امروز شمسی
export function getTodayPersian(): string {
  return jMoment().format("jYYYY/jMM/jDD");
}

// گرفتن روزهای یک ماه
export function getMonthDays(year: number, month: number): number {
  return jMoment.jDaysInMonth(year, month - 1);
}

// گرفتن اولین روز هفته ماه (برای Grid)
export function getFirstDayOfMonth(year: number, month: number): number {
  return jMoment(`${year}/${month}/01`, "jYYYY/jMM/jDD").day();
}
