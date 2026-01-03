import { useUser } from "@/context/user-context";
import {
  PaymentMethod,
  TransactionStatus,
  TransactionType,
} from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface dataTransactionProps {
  type: TransactionType;
  amount: number;
  categoryId: string;
  date: string;
  description?: string;
  paymentMethod: PaymentMethod;
  status: TransactionStatus;
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  const { userId, isGuest } = useUser();

  return useMutation({
    mutationFn: async (data: dataTransactionProps) => {
      if (!userId) throw new Error("آی دی یافت نشد");

      if (isGuest) throw new Error("Demo Mode: ایجاد تراکنش غیرفعال است");

      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-user-id": userId },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("خطا در ایجاد تراکنش");
      }

      return response.json();
    },
    onMutate: () => {
      toast.loading("در حال ذخیره...", { id: "create-transaction" });
    },

    onSuccess: () => {
      toast.dismiss("create-transaction");
      toast.success("تراکنش با موفقیت ایجاد شد", { id: "create-transaction" });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },

    onError: (error) => {
      toast.dismiss("create-transaction");
      toast.error(error.message || "خطا در ایجاد تراکنش", {
        id: "create-transaction",
      });
    },
  });
}
