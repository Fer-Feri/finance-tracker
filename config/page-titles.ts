export const pageTitles: Record<string, string> = {
  "/dashboard": "داشبورد",
  "/dashboard/transactions": "تراکنش‌ها",
  "/dashboard/reports": "گزارشات مالی",
  "/dashboard/goals": "اهداف مالی",
  "/dashboard/accounts": "حساب‌ها",
  "/dashboard/settings": "تنظیمات",
};

export function getPageTitle(pathname: string): string {
  return pageTitles[pathname] || "داشبورد";
}
