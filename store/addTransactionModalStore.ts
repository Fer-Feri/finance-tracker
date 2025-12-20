"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type TransactionType = "expense" | "income";
export type CategoryType = string;

interface AddTransactionModalState {
  typeModal: "add" | "edit";
  selectedTransactionId: string | null;
  selectedType: TransactionType;
  amount: number | null;
  description: string;
  category: CategoryType;
  payment: string;
  status: string;
  date: string;

  setTypeModal: (type: "add" | "edit") => void;
  setTransactionForEdit: (id: string | null) => void;
  setSelectedType: (type: TransactionType) => void;
  setAmount: (amount: number | null) => void;
  setDescription: (description: string) => void;
  setCategory: (category: CategoryType) => void;
  setPayment: (payment: string) => void;
  setStatus: (status: string) => void;
  setDate: (date: string) => void;
  resetForm: () => void;

  //  پر کردن فرم با داده‌های تراکنش
  loadTransactionData: (transaction: {
    type: TransactionType;
    amount: number;
    description: string;
    category: string;
    paymentMethod: string;
    status: string;
    date: string;
  }) => void;
}

export const useAddTransactionModalStore = create<AddTransactionModalState>()(
  (set) => ({
    typeModal: "add",
    selectedTransactionId: null,
    selectedType: "expense",
    amount: null,
    description: "",
    category: "food",
    payment: "card",
    status: "completed",
    date: "",

    // Actions

    setTypeModal: (type: "add" | "edit") => set({ typeModal: type }),

    setTransactionForEdit: (id: string | null) =>
      set({ selectedTransactionId: id, typeModal: "edit" }),

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
    setDate: (date: string) => set({ date }),

    loadTransactionData: (transaction) => {
      set({
        selectedType: transaction.type,
        amount: transaction.amount,
        description: transaction.description,
        category: transaction.category,
        payment: transaction.paymentMethod,
        status: transaction.status,
        date: transaction.date,
      });
    },
    resetForm: () => {
      set({
        selectedTransactionId: null,
        typeModal: "add",
        amount: null,
        description: "",
        category: "food",
        payment: "card",
        status: "completed",
        date: "",
      });
    },
  }),
);
