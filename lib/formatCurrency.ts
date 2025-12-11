// تابع کمکی برای فرمت کردن اعداد
export const formatCurrency = (value: number | string | undefined): string => {
  if (typeof value !== "number") {
    return "N/A";
  }
  return new Intl.NumberFormat("fa-IR").format(value);
};
