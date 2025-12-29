import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface updateTransactionProps {
  id: string;
  data: {
    type: string;
    amount: number;
    description: string;
    date: string;
    paymentMethod: string;
    status: string;
    categoryId: string;
  };
}

async function updateTransaction({ id, data }: updateTransactionProps) {
  const response = await fetch(`/api/transactions/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "خطا در ویرایش تراکنش");
  }

  const result = await response.json();
  return result;
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateTransaction,

    onMutate: () => {
      toast.loading("در حال ویرایش...", { id: "update-transaction" });
    },

    onSuccess: (updateTransaction) => {
      toast.dismiss("update-transaction");
      toast.success("تراکنش با موفقیت ویرایش شد", { id: "update-transaction" });
      // ✅ لیست تراکنش‌ها رو بروز کن
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      // ✅ اگه داده‌های جزئیات یک تراکنش رو cache کردی، اونا رو هم بروز کن
      queryClient.invalidateQueries({
        queryKey: ["transaction", updateTransaction.id],
      });
    },

    onError: (error) => {
      toast.dismiss("update-transaction");
      toast.error(error.message || "خطا در ویرایش تراکنش", {
        id: "update-transaction",
      });
    },
  });
}
