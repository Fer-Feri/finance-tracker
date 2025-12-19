"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type TransactionType = "expense" | "income";
export type CategoryType = string;

interface AddTransactionModalState {
  selectedType: TransactionType;
  amount: number | null;
  description: string;
  category: CategoryType;
  payment: string;
  status: string;

  setSelectedType: (type: TransactionType) => void;
  setAmount: (amount: number | null) => void;
  setDescription: (description: string) => void;
  setCategory: (category: CategoryType) => void;
  setPayment: (payment: string) => void;
  setStatus: (status: string) => void;
  resetForm: () => void;
}

export const useAddTransactionModalSore = create<AddTransactionModalState>()(
  persist(
    (set, get) => ({
      selectedType: "expense",
      amount: null,
      description: "",
      category: "food",
      payment: "card",
      status: "completed",

      // Actions
      setSelectedType: (type: TransactionType) => {
        set({ selectedType: type });
        if (type === "expense") set({ category: "food" });
        else set({ category: "salary" });
      },
      setAmount: (amount) => set({ amount }),
      setDescription: (description: string) => set({ description }),
      setCategory: (category: CategoryType) => set({ category }),
      setPayment: (payment: string) => set({ payment }),
      setStatus: (status: string) => set({ status }),
      resetForm: () => {
        set({
          amount: null,
          description: "",
          category: "food",
          payment: "card",
          status: "completed",
        });
      },
    }),
    {
      name: "add-transaction-modal-storage",
    },
  ),
);
