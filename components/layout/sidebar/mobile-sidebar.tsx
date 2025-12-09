"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";
import SidebarContent from "./sidebar-content";
import { useSidebarStore } from "@/store/useSidebarStore";

export default function MobileSidebar() {
  // ✅ اتصال به Zustand
  const { isMobileOpen, closeMobileMenu } = useSidebarStore();

  // جلوگیری از اسکرول بادی
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeMobileMenu}
        className={cn(
          "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          isMobileOpen ? "visible opacity-100" : "invisible opacity-0",
        )}
      />

      {/* Main Sidebar */}
      <aside
        className={cn(
          "border-sidebar-border bg-sidebar fixed top-0 right-0 z-50 h-screen w-64 border-l transition-transform duration-300 ease-in-out lg:hidden",
          isMobileOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <SidebarContent />
      </aside>
    </>
  );
}
