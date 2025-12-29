import moment from "jalali-moment";
import jMoment from "jalali-moment";

// تبدیل تاریخ شمسی به میلادی (برای ذخیره)
export function persianToGregorian(persianDate: string): Date {
  return moment(persianDate, "jYYYY/jMM/jDD").toDate();
}

// تبدیل تاریخ میلادی به شمسی (برای نمایش)
export function gregorianToPersian(date: Date): string {
  return moment(date).locale("fa").format("jYYYY/jMM/jDD");
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
