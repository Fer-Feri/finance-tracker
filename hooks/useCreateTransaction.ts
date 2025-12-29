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

async function createTransaction(data: dataTransactionProps) {
  const response = await fetch("/api/transactions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return response.json();
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTransaction,

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
