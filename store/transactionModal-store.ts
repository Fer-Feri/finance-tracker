import { create } from "zustand";

type modalMode = "add" | "edit";

interface TransactionModalState {
  isOpen: boolean;
  mode: modalMode;
  selectedTransactionId: string | null;

  openAdd: () => void;
  openEdit: (id: string) => void;
  onClose: () => void;
}

export const useTransactionModalStore = create<TransactionModalState>(
  (set) => ({
    isOpen: false,
    mode: "add",
    selectedTransactionId: null,

    openAdd: () =>
      set({ isOpen: true, mode: "add", selectedTransactionId: null }),

    openEdit: (id) =>
      set({ isOpen: true, mode: "edit", selectedTransactionId: id }),

    onClose: () => set({ isOpen: false, selectedTransactionId: null }),
  }),
);
