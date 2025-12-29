import { useQuery } from "@tanstack/react-query";

interface CategoryProps {
  id: string;
  name: string;
  icon: string;
  type: "INCOME" | "EXPENSE";
  order: number;
}

async function getCategories() {
  const response = await fetch("/api/categories");

  if (!response.ok) throw new Error("خطا در دریافت دسته‌بندی‌ها");
  return response.json() as Promise<CategoryProps[]>;
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: 1000 * 60 * 60 * 24,
  });
}
