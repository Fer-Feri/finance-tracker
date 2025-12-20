// config/transaction-data.ts

import { Transaction } from "@/types/transaction";

export const transactionsData: Transaction[] = [
  {
    id: "TRX001",
    description: "حقوق ماهانه",
    category: "salary",
    date: "1404/09/18",
    amount: 15000000,
    type: "income",
    status: "completed",
    paymentMethod: "card",
  },
  {
    id: "TRX002",
    description: "خرید مواد غذایی",
    category: "food",
    date: "1404/09/17",
    amount: 2500000,
    type: "expense",
    status: "completed",
    paymentMethod: "cash",
  },
  {
    id: "TRX003",
    description: "پروژه فریلنسری",
    category: "freelance",
    date: "1404/09/15",
    amount: 8500000,
    type: "income",
    status: "pending",
    paymentMethod: "online",
  },
  {
    id: "TRX004",
    description: "قبض برق",
    category: "bills",
    date: "1404/09/14",
    amount: 450000,
    type: "expense",
    status: "completed",
    paymentMethod: "card",
  },
  {
    id: "TRX005",
    description: "خرید لباس",
    category: "shopping",
    date: "1404/09/12",
    amount: 3200000,
    type: "expense",
    status: "failed",
    paymentMethod: "online",
  },
];
