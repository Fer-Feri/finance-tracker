export const PERSIAN_MONTHS = [
  { number: 1, name: "فروردین" },
  { number: 2, name: "اردیبهشت" },
  { number: 3, name: "خرداد" },
  { number: 4, name: "تیر" },
  { number: 5, name: "مرداد" },
  { number: 6, name: "شهریور" },
  { number: 7, name: "مهر" },
  { number: 8, name: "آبان" },
  { number: 9, name: "آذر" },
  { number: 10, name: "دی" },
  { number: 11, name: "بهمن" },
  { number: 12, name: "اسفند" },
];

export function getMonthName(monthNumber: number) {
  const month = PERSIAN_MONTHS.find((month) => month.number === monthNumber);
  return month?.name || "";
}
