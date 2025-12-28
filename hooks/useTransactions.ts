import { Category, Transaction } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

type TransactionWithCategory = Transaction & {
  category: Category;
};
export const useTransactions = () => {
  return useQuery<TransactionWithCategory[]>({
    queryKey: ["transactions"],
    queryFn: async () => {
      const response = await fetch("/api/transactions");

      if (!response.ok) throw new Error("خطا در دریافت تراکنش‌ها");

      return response.json();
    },
  });
};
