"use client";

import { cn } from "@/lib/utils";
import { AddTransactionModalProps } from "@/types/transaction-form";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import ModalForm from "./ModalForm";

// ------------------------------------------------------------
// ------------------------------------------------------------
// ------------------------------------------------------------
export default function AddTransactionModal({
  isOpen,
  mode,
  onClose,
  selectedTransactionId,
}: AddTransactionModalProps) {
  // --------------------------------------------
  // --------------------------------------------

  // ---------------------------
  return (
    <AnimatePresence>
      {/* Backdrop */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          onClick={onClose}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        >
          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card border-primary/20 relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border shadow-2xl"
            >
              {/*----------------------- Header ---------------------------*/}
              <div className="border-primary/20 bg-card/95 sticky top-0 z-10 flex items-center justify-between border-b p-6 backdrop-blur-sm">
                <h2 className="text-foreground text-2xl font-bold">
                  {mode === "add" ? " افزودن تراکنش جدید" : "ویرایش تراکنش"}
                </h2>
                <button
                  onClick={onClose}
                  className="hover:bg-primary/10 rounded-lg p-2 transition-colors"
                >
                  <X className="text-muted-foreground h-5 w-5" />
                </button>
              </div>
              {/* ----------------------------- Form -------------------- */}
              <ModalForm
                key={`${mode}-${selectedTransactionId}`}
                mode={mode}
                selectedTransactionId={selectedTransactionId}
                onClose={onClose}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
