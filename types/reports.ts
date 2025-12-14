export interface MonthData {
  monthNumber: number; // شماره ماه (1-12)
  monthName: string; // نام فارسی ماه
  income: number; // درآمد ماهانه
  expense: number; // هزینه ماهانه
  profit: number; // سود/زیان ماهانه
  transactionCount: number; // تعداد تراکنش‌ها
  changePercent: number; // ⬅️ درصد تغییر نسبت به ماه قبل
}

export interface YearlySummary {
  year: number; // سال شمسی
  totalIncome: number; // کل درآمد سالانه
  totalExpense: number; // کل هزینه سالانه
  totalProfit: number; // کل سود/زیان سالانه
  avgMonthlyProfit: number; // میانگین سود ماهانه
  totalTransactions: number; // کل تراکنش‌های سال
  monthlyData: MonthData[]; // آرایه داده‌های ماهانه
}
