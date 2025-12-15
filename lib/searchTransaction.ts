import { Transaction } from "@/types/transaction";

export function SearchTransaction(query: string, transactions: Transaction[]) {
  if (!query.trim()) return transactions;

  const normalaizedQuery = query.toLowerCase().trim();

  return transactions.filter((transaction) => {
    const matchedDescription = transaction.description
      ?.toLowerCase()
      .includes(normalaizedQuery);

    const matchedCategory = transaction.category
      ?.toLowerCase()
      .includes(normalaizedQuery);

    return matchedDescription || matchedCategory;
  });
}
