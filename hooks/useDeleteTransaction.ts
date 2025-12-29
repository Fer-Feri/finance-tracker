import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

// ? این تابع درخواست DELETE رو به API می‌فرسته
async function deleteTransaction(id: string): Promise<void> {
  const response = await fetch(`/api/transactions/${id}`, { method: "DELETE" });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "خطا در حذف تراکنش");
  }

  return response.json();
}

// ? Custom Hook برای حذف تراکنش
export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTransaction,
    // ۲. موقع شروع حذف (اختیاری)
    onMutate: async (id) => {
      toast.loading("در حال حذف تراکنش...", { id: "delete-transaction" });
    },

    onSuccess: () => {
      toast.success("تراکنش با موفقیت حذف شد", { id: "delete-transaction" });
      // ✅ Invalidate کردن cache برای بارگذاری مجدد لیست
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },

    onError: (error) => {
      toast.error(error.message || "خطا در حذف تراکنش", {
        id: "delete-transaction",
      });
    },
  });
}
