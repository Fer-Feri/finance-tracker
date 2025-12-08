"use client";

import { cn } from "@/lib/utils";
import { useEffect } from "react";
import SidebarContent from "./sidebar-content";

interface MobileMenuPorps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileSidebar({ isOpen, onClose }: MobileMenuPorps) {
  // جلوگیری از اسکرول شدن صفحه اصلی وقتی منو باز است
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      {/* --- Backdrop (لایه تاریک پشت) --- */}
      <div
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          isOpen ? "visible opacity-100" : "invisible opacity-0",
        )}
      />

      {/* --- Main Sidebar (پنل کشویی) --- */}
      <aside
        className={cn(
          "border-sidebar-border bg-sidebar fixed top-0 right-0 z-50 h-screen w-64 border-l transition-transform duration-300 ease-in-out lg:hidden",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <SidebarContent onLinkClick={onClose} />
      </aside>
    </>
  );
}
