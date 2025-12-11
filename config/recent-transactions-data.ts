import { RecentTransactionProps } from "@/types/recent-transactions";

export const recentTransactionsData: RecentTransactionProps[] = [
  {
    id: "tx-1",
    title: "پروژه طراحی UI",
    category: "فریلنسری",
    amount: 8500000,
    date: "1404/03/15",
    type: "income",
    status: "completed",
  },
  {
    id: "tx-2",
    title: "خرید اشتراک سرور",
    category: "زیرساخت",
    amount: 450000,
    date: "1402/09/19",
    type: "expense",
    status: "pending",
  },
  {
    id: "tx-3",
    title: "اسنپ فود",
    category: "غذا و خوراک",
    amount: 280000,
    date: "1402/09/18",
    type: "expense",
    status: "completed",
  },
  {
    id: "tx-4",
    title: "واریز سود سهام",
    category: "سرمایه‌گذاری",
    amount: 1200000,
    date: "1402/09/15",
    type: "income",
    status: "failed",
  },
  {
    id: "tx-5",
    title: "خرید مانیتور",
    category: "تجهیزات",
    amount: 12500000,
    date: "1402/09/10",
    type: "expense",
    status: "completed",
  },
];
