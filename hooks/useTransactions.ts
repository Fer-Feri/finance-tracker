import { useUser } from "@/context/user-context";
import { Category, Transaction } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

type TransactionWithCategory = Transaction & {
  category: Category;
};
export const useTransactions = () => {
  const { userId } = useUser();

  return useQuery<TransactionWithCategory[]>({
    queryKey: ["transactions"],
    enabled: !!userId,
    queryFn: async () => {
      if (!userId) throw new Error("آی دی یافت نشد");

      const response = await fetch("/api/transactions", {
        headers: { "x-user-id": userId },
      });

      if (!response.ok) throw new Error("خطا در دریافت تراکنش‌ها");

      return response.json();
    },
  });
};
