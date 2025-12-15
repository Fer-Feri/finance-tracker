"use client";

import { cn } from "@/lib/utils";
import SidebarContent from "./sidebar-content";
import { useSidebarStore } from "@/store/useSidebarStore";

interface MobileSidebarProps {
  title?: string;
}

export default function MobileSidebar({}: MobileSidebarProps) {
  const { closeMobile, isMobileOpen } = useSidebarStore();
  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeMobile}
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
