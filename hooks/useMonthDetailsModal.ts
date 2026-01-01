import { useQuery } from "@tanstack/react-query";

async function getTransactions() {
  const response = await fetch("/api/transactions", {
    method: "GET",
  });

  if (!response.ok) throw new Error("خطا در دریافت تراکنش‌ها");

  return response.json();
}

export function useMonthDetailsModal() {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: getTransactions,
  });
}
